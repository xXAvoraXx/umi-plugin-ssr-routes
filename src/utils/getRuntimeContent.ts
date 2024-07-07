export default () => {
  return `\
  import {
  getRemoteMenu,
  patchRouteWithRemoteMenus,
  setRemoteMenu,
} from './session';
  import { getRoutersInfo } from './service';
  import { parseRoutes } from './utils';
  import { history } from '@umijs/max';

export async function patchClientRoutes({ routes }) {
  patchRouteWithRemoteMenus(routes);
}

export function render(oldRender: () => void) {
  getRoutersInfo().then((res) => {
    setRemoteMenu(res);
  });
  oldRender();
}
  `;
};
