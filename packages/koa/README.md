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


[Koa @2.13.4 / 2021-10-19](https://github.com/koajs/koa)
--

[Koa Compose @4.2.0 / 2020-09-11](https://github.com/koajs/compose)
--

[Koa Router](https://github.com/koajs/router)
--
