(async function () {
  console.log('@head/edge spec');

  const Application = module.exports;

  const { router, client } = new Application();

  router.verb('GET', '/api/users', async (ctx, next) => {
    const data = { firstName: 'Albert', lastName: 'Einstein' };
    ctx.body = data;
    next();
  });

  (async function () {
    console.log('[describe] GET 200');
    const resp = await client.get('/api/users');
    console.assert(resp.firstName === 'Albert');
  }());

  (async function () {
    console.log('[describe] GET 404');
    try {
      const resp = await client.get('/api/books');
    } catch (err) {
      console.assert(err.status === 404);
    }
  }());

  router.verb('GET', '/api/search', async (ctx, next) => {
    const query = ctx.request.query;
    const data = { firstName: query.firstName };
    ctx.body = data;
    next();
  });

  (async function () {
    console.log('[describe] GET search');
    const resp = await client.get('/api/search', { firstName: 'Albert' });
    console.assert(resp.firstName === 'Albert');
  }());

  router.verb('GET', '/api/users/:firstName', async (ctx, next) => {
    const params = ctx.request.params;
    const data = { firstName: params.firstName };
    ctx.body = data;
    next();
  });

  router.verb('GET', '/api/users/~', async (ctx, next) => {
    const data = { firstName: 'Best', lastName: 'Match' };
    ctx.body = data;
    next();
  });

  (async function () {
    console.log('[describe] GET params');
    const resp = await client.get('/api/users/Albert');
    console.assert(resp.firstName === 'Albert');
  }());

  (async function () {
    console.log('[describe] GET last registered, best match');
    const resp = await client.get('/api/users/~');
    console.assert(resp.firstName === 'Best');
  }());

  router.verb('GET', '/api/error', async (ctx, next) => {
    function _then(resolve, reject) {
      return function (resp) {
        var status = resp.status;
        if (resp.ok) {
          resp.text().then(function (t) {
            resolve(t ? JSON.parse(t) : {
              status: status
            });
          });
        } else {
          resp.text().then(function (t) {
            reject(t ? JSON.parse(t) : {
              status: status
            });
          });
        }
      };
    }

    function _catch(resolve, reject) {
      return function (err) {
        reject(err);
      };
    }

    function $get(endpoint) {
      return new Promise(function (resolve, reject) {
        fetch(endpoint, { method: 'GET', credentials: 'same-origin' })
          .then(_then(resolve, reject))
          .catch(_catch(resolve, reject));
      });
    }

    const res = await $get('https://httpbin.org/status/401');
    next();
  });

  (async function () {
    console.log('[describe] GET 401');
    try {
      const resp = await client.get('/api/error');
    } catch (err) {
      console.assert(err.status === 401);
    }
  }());

  router.verb('POST', '/api/users', async (ctx, next) => {
    const form = ctx.request.body;
    const data = { firstName: form.firstName };
    ctx.body = data;
    next();
  });

  (async function () {
    console.log('[describe] POST form');
    const resp = await client.post('/api/users', {}, { firstName: 'Created' });
    console.assert(resp.firstName === 'Created');
  }());

  router.verb('POST', '/api/books/:name', async (ctx, next) => {
    const query = ctx.request.query;
    const params = ctx.request.params;
    const form = ctx.request.body;
    const data = { query: query.name, param: params.name, firstName: form.firstName };
    ctx.body = data;
    next();
  });

  (async function () {
    console.log('[describe] POST params, search, form');
    const resp = await client.post('/api/books/2', { name: 1 }, { firstName: 'Created' });
    console.assert(resp.query === 1);
    console.assert(resp.param === '2');
    console.assert(resp.firstName === 'Created');
  }());

  const { router: router2, client: client2 } = new Application();

  router2.verb('GET', '/api/users', async (ctx, next) => {
    const data = { firstName: 'Howard', lastName: 'Wolowitz' };
    ctx.body = data;
    next();
  });

  (async function () {
    console.log('[describe] router2 is independent');
    const resp = await client2.get('/api/users');
    console.assert(resp.firstName === 'Howard');
  }());
}());
