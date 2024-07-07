export default (fetchRoutes: () => Promise<any>) => {
  return `\
export async function getRoutersInfo(): Promise<API.RouteRaw[]> {
  return await fetchRoutes();
}
  `;
};