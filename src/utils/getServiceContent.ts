export default (apiPath: string, requestLibPath: string, responseType: string) => {
  return `\
export async function getRoutersInfo() {
  const requestLib = require(\`${requestLibPath}\`);
  try {
    const response = await requestLib.get('${apiPath}');
    const routes = response.${responseType};
    return routes;
  } catch (error) {
    return [];
  }
}
  `;
};