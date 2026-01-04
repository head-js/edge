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

[path-to-regexp @8.2.0 / 2024-09-26](https://github.com/pillarjs/path-to-regexp)
--

[Koa @2.16.3 / 2025-10-18](https://github.com/koajs/koa)
--

[Koa Compose @4.2.0 / 2020-09-11](https://github.com/koajs/compose)
--

[Koa Router @14.0.0 / 2025-08-03](https://github.com/koajs/router)
--
