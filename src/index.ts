import { RUNTIME_TYPE_FILE_NAME, type IApi } from "umi";
import getTypeContent from "./utils/getTypeContent";
import getRuntimeContent from "./utils/getRuntimeContent";
import getLazyLoadableContent from "./utils/getLazyLoadableContent";
import getEmptyRouteOutletContent from "./utils/getEmptyRouteOutletContent";
import getSessionContent from "./utils/getSessionContent";
import getIconUtilContent from "./utils/getIconUtilContent";
import { withTmpPath } from "./utils/withTmpPath";

const DIR_NAME = ".";

export default (api: IApi) => {
  api.logger.info("Use ssr-routes plugin.");

  api.describe({
    key: "ssrRoutes",
    // config: {
    //   // schema(joi) {
    //   //   return joi.object({
    //   //     apiPath: joi.string().required(),
    //   //     requestLibPath: joi.string().required(),
    //   //     responseType: joi.string().required(),
    //   //   });
    //   // },
    //   onChange: api.ConfigChangeType.regenerateTmpFiles,
    // },
    config: {
      schema(joi) {
        return joi.object({});
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

  const { apiPath, requestLibPath, responseType } =
    api.userConfig?.ssrRoutes || {};

  if (!apiPath && !requestLibPath && !responseType) {
    api.logger.warn(
      "Please configure ssrRoutes.apiPath, ssrRoutes.requestLibPath ssrRoutes.responseType, otherwise plugin-ssr-routes will not work."
    );
    return;
  }

  api.addRuntimePluginKey(() => "ssrRoutes");
  //api.addRuntimePluginKey(() => ["getServerSideRoutes"]);

  api.addRuntimePlugin(() => {
    return [withTmpPath({ api, path: "runtime.tsx" })];
  });

  api.onGenerateFiles(async () => {
    api.writeTmpFile({
      path: `${DIR_NAME}/LazyLoadable.tsx`,
      content: getLazyLoadableContent(),
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/EmptyRouteOutlet.tsx`,
      content: getEmptyRouteOutletContent(),
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/session.ts`,
      content: getSessionContent(),
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/util.ts`,
      content: getIconUtilContent(),
    });
    api.writeTmpFile({
      path: `${DIR_NAME}/typing.ts`,
      content: getTypeContent(),
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/runtime.tsx`,
      content: api.appData.appJS?.exports.includes("getServerSideRoutes")
        ? getRuntimeContent()
        : "export default () => ({})",
    });

    api.writeTmpFile({
      path: RUNTIME_TYPE_FILE_NAME,
      content: `
export interface IRuntimeConfig {
  getServerSideRoutes?: () => Promise<RouteRaw[]>
}
      `,
    });
  });
};
