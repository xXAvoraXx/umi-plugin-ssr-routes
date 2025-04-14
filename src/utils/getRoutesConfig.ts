export default () => `
import assert from 'assert';
import { ServerRouteResponse } from './typing';

interface IOpts {
  routes: any[];
  onResolveComponent?: (component: string) => string;
}

interface IMemo {
  id: number;
  ret: ServerRouteResponse[];
}

export function getConfigRoutes(opts: IOpts): ServerRouteResponse[] {
  const memo: IMemo = { ret: [], id: 1 };
  transformRoutes({
    routes: opts.routes,
    parentId: undefined,
    memo,
    onResolveComponent: opts.onResolveComponent,
  });
  return memo.ret;
}

function transformRoutes(opts: {
  routes: any[];
  parentId: undefined | string;
  memo: IMemo;
  onResolveComponent?: Function;
}) {
  opts.routes.forEach((route) => {
    transformRoute({
      route,
      parentId: opts.parentId,
      memo: opts.memo,
      onResolveComponent: opts.onResolveComponent,
    });
  });
}

function transformRoute(opts: {
  route: any;
  parentId: undefined | string;
  memo: IMemo;
  onResolveComponent?: Function;
}) {
  assert(
    !opts.route.children,
    'children is not allowed in route props, use routes instead.',
  );
  const id = String(opts.memo.id++);
  const { routes, component, wrappers, ...routeProps } = opts.route;
  let absPath = opts.route.path;
  if (absPath?.charAt(0) !== '/') {
    const parentAbsPath = opts.parentId
      ? opts.memo.ret.find((r) => r.id === opts.parentId)?.absPath.replace(/\\/+$/, '/') // to remove '/'s on the tail
      : '/';
    absPath = endsWithStar(parentAbsPath)
      ? parentAbsPath
      : ensureWithSlash(parentAbsPath, absPath);
  }
  const routeData: ServerRouteResponse = {
    ...routeProps,
    path: opts.route.path,
    ...(component
      ? {
          component: opts.onResolveComponent
            ? opts.onResolveComponent(component)
            : component,
        }
      : {}),
    parentId: opts.parentId,
    id,
    absPath,
  };
  if (wrappers?.length) {
    let parentId = opts.parentId;
    let path = opts.route.path;
    let layout = opts.route.layout;
    wrappers.forEach((wrapper: any) => {
      const { id } = transformRoute({
        route: {
          path,
          component: wrapper,
          isWrapper: true,
          ...(layout === false ? { layout: false } : {}),
        },
        parentId,
        memo: opts.memo,
        onResolveComponent: opts.onResolveComponent,
      });
      parentId = id;
      path = endsWithStar(path) ? '*' : '';
    });
    routeData.parentId = parentId;
    routeData.path = path;
    routeData.originPath = opts.route.path; // Store original path for layout rendering
  }
  opts.memo.ret.push(routeData);
  if (opts.route.routes) {
    transformRoutes({
      routes: opts.route.routes,
      parentId: id,
      memo: opts.memo,
      onResolveComponent: opts.onResolveComponent,
    });
  }
  return { id };
}

function endsWithStar(str: string) {
  return str.endsWith('*');
}

function ensureWithSlash(left: string, right: string) {
  if (!right?.length || right === '/') {
    return left;
  }
  return \`\${left.replace(/\\/+$/, '')}/\${right.replace(/^\\/+/, '')}\`;
}
`;