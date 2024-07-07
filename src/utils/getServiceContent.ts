export default (fetchRoutes: () => Promise<RouteRaw[]>) => {
  return `\
export async function getRoutersInfo() {
  const fetchRoutes = ${fetchRoutes.toString()};
  return await fetchRoutes();
}
  `;
};