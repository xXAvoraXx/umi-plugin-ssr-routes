export default () => {
  return `\
import { ComponentType, LazyExoticComponent } from "react";

  interface RouteObject {
    children?: API.Route[];
    element?: React.ReactNode | null;
  }

  // Ön tarafta sunucudan gelen verilere dayalı olarak oluşturulan rota verisi
  interface Route extends RouteObject {
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

  // Sunucudan gelen rota verisi RouteRaw[] olarak olur
  interface RouteRaw extends Route {
    key?: string;
    parentKeys?: 'ant-design-pro-layout' | string[];
    routes?: RouteRaw[];
    component?: string;
  }

  // Ön tarafta sunucudan gelen verilere dayalı olarak oluşturulan React.lazy gecikmeli yükleme bileşeni veya Outlet (birinci seviye rota)
  type RouteComponent = LazyExoticComponent<ComponentType<any>> | typeof Outlet;

  // patchRoutes işlevinin parametresi { routes, routeComponents } şeklinde çözümlenebilir
  // Bu tür, Object.assign(routes, parsedRoutes) işlemi için kullanılır, rota verilerini birleştirir
  interface ParsedRoutes {
    [key: number]: Route;
  }

  // Bu tür, Object.assign(routeComponents, parsedRoutes) işlemi için kullanılır, rota bileşenlerini birleştirir
  interface ParsedRouteComponent {
    [key: number]: RouteComponent;
  }

  // parseRoutes işlevinin dönüş değeri
  interface ParseRoutesReturnType {
    routes: ParsedRoutes;
    routeComponents: ParsedRouteComponent;
  }

  interface ComponentRaw {
    key: string;
    filePath: string;
    fallBack: string;
    children: ComponentRaw[]
  }
  `;
};
