export default () => `\
import EmptyRoute from '@@/core/EmptyRoute';
import LazyLoadable from './LazyLoadable';
import { createIcon } from './utils';
import { Navigate } from '@umijs/max';
import React, { lazy } from 'react';
import { Route, ServerRouteResponse } from './typing';
import { getConfigRoutes } from './routesConfig';
let remoteMenu: ServerRouteResponse[] = [];

export function getRemoteMenu() {
    return remoteMenu;
}

export function setRemoteMenu(data: ServerRouteResponse[]) {

    var configRoutes = getConfigRoutes({ routes: data });

    remoteMenu = data;
}
    

function generateComponentPath(inputPath: string): string {
    let newPath: string;

    if (inputPath.startsWith('./')) {
        // Remove the './' prefix
        newPath = inputPath.replace(/^\\.\\/+/, '');
        // Process path segments
        const pathSegments = newPath.split('/');
        newPath = pathSegments
            .map((segment, index) => {
                // Add "pages/" prefix to all segments except the last one
                if (index < pathSegments.length - 1) {
                    return \`pages/\${segment}\`;
                }
                return segment; // Keep the last segment as is
            })
            .join('/');
        // Add "/index" suffix to the last segment
        newPath = \`\${newPath}/index\`;
    } else if (inputPath.startsWith('@/')) {
        // Remove the '@/' prefix
        newPath = inputPath.replace(/^@\\/+/, '');
    } else {
        throw new Error('Unsupported input path format');
    }

    return newPath;
}

// Function to wrap a component with wrappers
function wrapWithWrappers(
    component: React.ReactNode,
    wrappers: Array<string> | undefined
): React.ReactNode {
    if (!wrappers || wrappers.length === 0) {
        return component;
    }

    return wrappers.reduceRight((wrappedComponent, wrapperPath) => {
        const Wrapper = lazy(() => import(\`@/\${wrapperPath}\`));
        return React.createElement(LazyLoadable(Wrapper), {}, wrappedComponent);
    }, component);
}

// Function to convert component property to element property
function generateComponent(component: string | undefined, wrappers?: Array<string>): React.ReactNode | null {
    // Return if component exists, otherwise return null
    if (component) {
        const componentPath = generateComponentPath(component);
        // Create and store the component
        const baseComponent = React.createElement(LazyLoadable(lazy(() => import(\`@/\${componentPath}\`))));
        //return wrapWithWrappers(baseComponent, wrappers);
        return baseComponent;
    }
    return React.createElement(EmptyRoute);
}

// Convert ServerRouteResponse array from server to Route array
function convertRoutes(rawRoutes: ServerRouteResponse[]): Route[] {
    return rawRoutes.map((rawRoute) => {
        const { component, routes, wrappers, ...rest } = rawRoute;

        for (const key in rest) {
            if (rest[key] === null) {
                delete rest[key];
            }
        }

        return {
            ...rest,
            element: rest.redirect
                ? React.createElement(Navigate, { to: rest.redirect, replace: true })
                : generateComponent(component, wrappers),
            children: routes ? convertRoutes(routes) : undefined,
            icon: createIcon(rest.icon),
        };
    });
}

export function parseRoutes(layout: ServerRouteResponse, routesRaw: ServerRouteResponse[]) {
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
        if (routeItem.id === 'ant-design-pro-layout' || routeItem.id === '@@/global-layout') {
            proLayout = routeItem;
            break;
        }
    }
    setRemoteMenu(convertRoutes(remoteMenu));

    parseRoutes(proLayout, remoteMenu);
}
`;
