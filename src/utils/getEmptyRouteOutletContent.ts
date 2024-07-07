export default () => `\
import { Outlet, useOutletContext } from '@umijs/max';

export default function EmptyRouteOutlet() {
  const context = useOutletContext();
  return <Outlet context={context} />;
}
`;
