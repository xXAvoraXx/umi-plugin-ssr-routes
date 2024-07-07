export default (fetchRoutes: () => Promise<RouteRaw[]>) => {
  const fetchRoutesStr = fetchRoutes.toString();
  return `\
export async function getRoutersInfo(): Promise<RouteRaw[]> {
  return await ${fetchRoutesStr};
}
  `;
};