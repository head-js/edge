@head/edge
==

```javascript
// service.js
import Application from '@head/edge';
import $rpc from '/path/to/user-rpc';

const { router, client } = new Application();

router.verb('GET', '/api/users', async (ctx, next) => {
  const data = await $rpc.doPost('/path-to/userService');
  ctx.body = data;
  next();
});

export default client;

// store.js
import $client from './service';

async function init() {
  const data = await $client.get('/api/users');
  state.users = data;
}
```

[delegates @1.0.0 / 2015-12-14](https://github.com/tj/node-delegates)
--

[Koa Compose @4.1.0 / 2018-05-22](https://github.com/koajs/compose)
--

[Koa @2.13.4 / 2021-10-19](https://github.com/koajs/koa)
--

[Koa Router @10.1.1 / 2021-08-23](https://github.com/koajs/router)
--
