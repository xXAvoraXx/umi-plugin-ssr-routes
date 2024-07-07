import type { IApi } from "umi";
import getServiceContent from "./utils/getServiceContent";
import getTypeContent from "./utils/getTypeContent";
import getRuntimeContent from "./utils/getRuntimeContent";
import getLazyLoadableContent from "./utils/getLazyLoadableContent";
import getEmptyRouteOutletContent from "./utils/getEmptyRouteOutletContent";
import getSessionContent from "./utils/getSessionContent";
import getIconUtilContent from "./utils/getIconUtilContent";
import { join } from "path";

const DIR_NAME = ".";

export default (api: IApi) => {
  const umiTmpDir = api.paths.absTmpPath;
  api.logger.info("Use ssr-routes plugin.");

  api.describe({
    key: "ssrRoutes",
    config: {
      schema(joi) {
        return joi.object({
          fetchRoutes: joi.function().required(),
        });
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

  const { fetchRoutes } = api.userConfig?.ssrRoutes || {};

  if (!fetchRoutes) {
    api.logger.warn(
      "Please configure ssrRoutes.fetchRoutes, otherwise plugin-ssr-routes will not work."
    );
    return;
  }

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
      path: `${DIR_NAME}/service.ts`,
      content: getServiceContent(fetchRoutes),
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/typing.ts`,
      content: getTypeContent(),
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/runtime.tsx`,
      content: getRuntimeContent(),
    });
  });

  api.addRuntimePlugin({
    fn: () => [join(umiTmpDir!, `${DIR_NAME}/runtime.tsx`)],
  });

  api.addTmpGenerateWatcherPaths(() => [
    join(umiTmpDir!, `${DIR_NAME}/service.ts`),
  ]);
};
