import PortalNotificacao from "./PortalNotificacao";
import PortalGestao from "./PortalGestao";

export default function App() {
  const ehGestao = window.location.pathname.startsWith("/gestao");
  return ehGestao ? <PortalGestao /> : <PortalNotificacao />;
}
