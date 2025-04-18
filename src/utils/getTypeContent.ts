export default () => `\
import { type IRoute } from "umi";
interface Route extends IRoute {
  children?: LayoutRoute[];
  element?: React.ReactNode | null;
}

// Route data generated on the front end based on data from the server.
interface LayoutRoute extends Route {
  name?: string;
  icon?: React.ReactNode | string | null;
  access?: string;
  locale?: string;
  target?: string;
  navTheme?: 'dark' | 'light' | 'realDark' | undefined;
  layout?: 'side' | 'top' | 'mix';
  headerTheme?: 'dark' | 'light';
  flatMenu?: boolean;
  headerRender?: boolean;
  footerRender?: boolean;
  menuRender?: boolean;
  menuHeaderRender?: boolean;
  fixedHeader?: boolean;
  fixSiderbar?: boolean;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  hideInBreadcrumb?: boolean;
  redirect?: string;
  disabled?: boolean;
}

// Route data from the server will be ServerRouteResponse[]
interface ServerRouteResponse extends LayoutRoute {
  key?: string;
  parentKeys?: 'ant-design-pro-layout' | '@@/global-layout' | string[];
  routes?: ServerRouteResponse[];
  component?: string;
  wrappers?: (Array<string> | undefined);
}


export type {
  Route,
  LayoutRoute,
  ServerRouteResponse,
}
`;
