export default () => `\
import EmptyRouteOutlet from './EmptyRouteOutlet';
import LazyLoadable from './LazyLoadable';
import { createIcon } from './utils';
import { Navigate } from '@umijs/max';
import React, { lazy } from 'react';
let remoteMenu: API.RouteRaw[] = [];

export function getRemoteMenu() {
    return remoteMenu;
}

export function setRemoteMenu(data: API.RouteRaw[]) {
    remoteMenu = data;
}

function generateComponentPath(inputPath: string): string {
    // Başındaki './' kısmını kaldır
    let newPath = inputPath.replace(/^\.\//, '');

    // Slash karakterlerini işle
    const pathSegments = newPath.split('/');
    newPath = pathSegments
        .map((segment, index) => {
            // İlk segmentin sonuna "pages" ekleme
            if (index === 0) {
                return segment;
            }
            // Diğer segmentlerin sonuna "pages" ekle
            return 'pages/' + segment;
        })
        .join('/');

    // Sonuna '/index' ekle
    newPath = newPath + '/index';

    return newPath;
}

// component özelliğini eleman özelliğine çeviren fonksiyon
function generateComponent(component: string | undefined): React.ReactNode | null {
    // component değeri varsa dönüş yapın, yoksa null döndürün
    if (component) {
        const componentPath = generateComponentPath(component);
        // Bileşeni oluştur ve sakla
        return React.createElement(LazyLoadable(lazy(() => import(\`@/pages/\${componentPath}\`))));
    }
    return React.createElement(EmptyRouteOutlet);
}

// Sunucudan gelen RouteRaw dizisini Route dizisine dönüştürün
function convertRoutes(rawRoutes: API.RouteRaw[]): API.Route[] {
    return rawRoutes.map((rawRoute) => {
        const { component, routes, ...rest } = rawRoute;

        for (const key in rest) {
            if (rest[key] === null) {
                delete rest[key];
            }
        }

        return {
            ...rest,
            element: rest.redirect
                ? React.createElement(Navigate, { to: rest.redirect, replace: true })
                : generateComponent(component),
            children: routes ? convertRoutes(routes) : undefined,
            icon: createIcon(rest.icon),
        };
    });
}

export function parseRoutes(layout: API.RouteRaw, routesRaw: API.RouteRaw[]) {
    routesRaw.forEach((route) => {
        layout.routes?.push(route);
    });

    layout.routes?.forEach((route, index) => {
        const replaceRoute = routesRaw.find((x) => x.key === route.key);

        if (replaceRoute) {
            layout.routes![index] = replaceRoute;
        }
    });
}

export function patchRouteWithRemoteMenus(routes: any) {
    if (remoteMenu === null) {
        return;
    }
    let proLayout = null;
    for (const routeItem of routes) {
        if (routeItem.id === 'ant-design-pro-layout') {
            proLayout = routeItem;
            break;
        }
    }
    setRemoteMenu(convertRoutes(remoteMenu));

    parseRoutes(proLayout, remoteMenu);
}
`;
