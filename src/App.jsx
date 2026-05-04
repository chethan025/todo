import useIsMobile from "./hooks/useIsMobile";
import DesktopView from "./layouts/DesktopView";
import MobileView from "./layouts/MobileView";
import "./styles/dashboard.css";

function App() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileView /> : <DesktopView />;
}

export default App;