export default () => `\
interface RouteObject {
  children?: Route[];
  element?: React.ReactNode | null;
}

// Route data generated on the front end based on data from the server.
export interface Route extends RouteObject {
  id: string;
  path: string;
  name?: string;
  icon?: React.ReactNode | string | null;
  access?: string;
  parentId?: 'ant-design-pro-layout' | string;
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
  [key: string]: any;
}

// Route data from the server will be RouteRaw[]
export interface RouteRaw extends Route {
  key?: string;
  parentKeys?: 'ant-design-pro-layout' | string[];
  routes?: RouteRaw[];
  component?: string;
}
`;
