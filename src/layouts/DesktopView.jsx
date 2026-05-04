import Daily from "../components/Daily";
import History from "../components/History";
import Scheduled from "../components/Scheduled";
import FutureScheduled from "../components/FutureScheduled";
import Todos from "../components/Todos";

export default function DesktopView() {
  return (
    <div className="dashboard">

      <div className="daily box">
        <Daily />
      </div>

      <div className="reminders box">
        <Todos />
      </div>

      <div className="scheduled box">
        <Scheduled />
      </div>

      <div className="history box">
        <History />
      </div>

      <div className="future box">
        <FutureScheduled />
        </div>

    </div>
  );
}