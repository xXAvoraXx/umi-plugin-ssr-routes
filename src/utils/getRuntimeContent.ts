export default () => {
  return `\
  import {
  getRemoteMenu,
  patchRouteWithRemoteMenus,
  setRemoteMenu,
} from './session';
  import { getServerSideRoutes } from '@/app';
  import { history } from '@umijs/max';

// https://umijs.org/docs/api/runtime-config#patchroutes
export async function patchClientRoutes({ routes }) {
  patchRouteWithRemoteMenus(routes);
}

export function render(oldRender: () => void) {
  getServerSideRoutes().then((res) => {
    setRemoteMenu(res);
    oldRender();
  });
}
  `;
};
