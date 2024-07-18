export default () => `\
import EmptyRouteOutlet from './EmptyRouteOutlet';
import LazyLoadable from './LazyLoadable';
import { createIcon } from './utils';
import { Navigate } from '@umijs/max';
import React, { lazy } from 'react';
import { Route, RouteRaw } from './types';
let remoteMenu: RouteRaw[] = [];

export function getRemoteMenu() {
    return remoteMenu;
}

export function setRemoteMenu(data: RouteRaw[]) {
    remoteMenu = data;
}

function generateComponentPath(inputPath: string): string {
    // Remove the './' at the beginning
    let newPath = inputPath.replace(/^\\.\\//, '');

    // Process slash characters
    const pathSegments = newPath.split('/');
    newPath = pathSegments
        .map((segment, index) => {
            // Add "pages" at the end of the first segment
            if (index === 0) {
                return segment;
            }
            // Add "pages" at the end of other segments
            return 'pages/' + segment;
        })
        .join('/');

    // Add '/index' at the end
    newPath = newPath + '/index';

    return newPath;
}

// Function to convert component property to element property
function generateComponent(component: string | undefined): React.ReactNode | null {
    // Return if component exists, otherwise return null
    if (component) {
        const componentPath = generateComponentPath(component);
        // Create and store the component
        return React.createElement(LazyLoadable(lazy(() => import(\`@/pages/\${componentPath}\`))));
    }
    return React.createElement(EmptyRouteOutlet);
}

// Convert RouteRaw array from server to Route array
function convertRoutes(rawRoutes: RouteRaw[]): Route[] {
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

export function parseRoutes(layout: RouteRaw, routesRaw: RouteRaw[]) {
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
