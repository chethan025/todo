import { useState } from "react";
import Daily from "../components/Daily";
import History from "../components/History";
import Scheduled from "../components/Scheduled";
import Todos from "../components/Todos";

export default function MobileView() {
  const [tab, setTab] = useState("daily");
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile">

      <div className="topbar">
        <button onClick={() => setOpen(true)}>☰</button>
      </div>

      <div className={`drawer ${open ? "open" : ""}`}>
        <button onClick={() => setOpen(false)}>✕</button>

        <button onClick={() => { setTab("daily"); setOpen(false); }}>Daily</button>
        <button onClick={() => { setTab("history"); setOpen(false); }}>History</button>
        <button onClick={() => { setTab("scheduled"); setOpen(false); }}>Scheduled</button>
        <button onClick={() => { setTab("todos"); setOpen(false); }}>Reminders</button>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className="content">
        {tab === "daily" && <Daily />}
        {tab === "history" && <History />}
        {tab === "scheduled" && <Scheduled />}
        {tab === "todos" && <Todos />}
      </div>

    </div>
  );
}