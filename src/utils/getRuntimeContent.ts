export default () => {
  return `\
  import {
  getRemoteMenu,
  patchRouteWithRemoteMenus,
  setRemoteMenu,
} from './session';
  import { getServerSideRoutes } from '@/app';
  import { parseRoutes } from './utils';
  import { history } from '@umijs/max';

export async function patchClientRoutes({ routes }) {
  patchRouteWithRemoteMenus(routes);
}

export function render(oldRender: () => void) {
  getServerSideRoutes().then((res) => {
    setRemoteMenu(res);
  });
  oldRender();
}
  `;
};
