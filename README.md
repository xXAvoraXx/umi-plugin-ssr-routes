# umi-plugin-ssr-routes

A umi plugin that addresses the issue of static route configurations in UmiJS. This plugin aims to render route and menu information from an API, instead of displaying the static routes.

## Install

```bash
pnpm i umi-plugin-ssr-routes
yarn add umi-plugin-ssr-routes
npm install umi-plugin-ssr-routes
```

## Usage

Configure in `.umirc.ts`,

```js
export default {
  plugins: [
    ['umi-plugin-ssr-routes'],
  ],
  ssrRoutes: {}
}
```

Configure in `app.ts\tsx\js`,


```tsx
export async function getServerSideRoutes(): Promise<ServerRouteResponse[]> {
  return await getUserRoutes().then((res) => {
    if (res.data) {
      return res.data;
    } else {
      return [];
    }
  });
}

/** GET /api/getUserRoutes */
export async function getUserRoutes(options?: { [key: string]: any }) {
  return request<{
    data: ServerRouteResponse[];
  }>('/api/GetUserRoutes', {
    method: 'GET',
    prefix: undefined,
    ...(options || {}),
  });
}
```


## LICENSE

MIT
