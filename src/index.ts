import { RUNTIME_TYPE_FILE_NAME, type IApi } from "umi";
import getTypeContent from "./utils/getTypeContent";
import getRuntimeContent from "./utils/getRuntimeContent";
import getLazyLoadableContent from "./utils/getLazyLoadableContent";
import getSessionContent from "./utils/getSessionContent";
import getIconUtilContent from "./utils/getIconUtilContent";
import { withTmpPath } from "./utils/withTmpPath";

export default (api: IApi) => {
  api.logger.info("Use ssr-routes plugin.");

  api.describe({
    config: {
      schema({ zod }) {
        return zod.record(zod.any());
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });

  const { ssrRoutes } = api.userConfig;
  if (!ssrRoutes) {
    api.logger.warn(
      "Please configure ssrRoutes, otherwise plugin-ssr-routes will not work."
    );
    return;
  }

  // const { apiPath, requestLibPath, responseType } =
  //   api.userConfig?.ssrRoutes || {};

  // if (!apiPath) {
  //   api.logger.warn(
  //     "Please configure ssrRoutes.apiPath, ssrRoutes.requestLibPath ssrRoutes.responseType, otherwise plugin-ssr-routes will not work."
  //   );
  //   return;
  // }

  //api.addRuntimePluginKey(() => "ssrRoutes");
  api.addRuntimePluginKey(() => ["getServerSideRoutes"]);

  api.onGenerateFiles(async () => {
    api.writeTmpFile({
      path: `LazyLoadable.tsx`,
      content: getLazyLoadableContent(),
    });

    api.writeTmpFile({
      path: `session.ts`,
      content: getSessionContent(),
    });

    api.writeTmpFile({
      path: `utils.ts`,
      content: getIconUtilContent(),
    });

    api.writeTmpFile({
      path: `typing.ts`,
      content: getTypeContent(),
    });

    api.writeTmpFile({
      path: `runtime.tsx`,
      content: api.appData.appJS?.exports.includes("getServerSideRoutes")
        ? getRuntimeContent()
        : "export default () => ({})",
    });

    api.writeTmpFile({
      path: RUNTIME_TYPE_FILE_NAME,
      content: `
import { ServerRouteResponse } from './typing';
export interface IRuntimeConfig {
  getServerSideRoutes?: () => Promise<ServerRouteResponse[]>
}
      `,
    });
  });

  api.addRuntimePlugin(() => {
    return [withTmpPath({ api, path: "runtime.tsx" })];
  });
};
