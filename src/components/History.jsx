import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function History() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [openId, setOpenId] = useState(null);

  const fetchDates = async () => {
    const { data } = await supabase
      .from("daily_routine_history")
      .select("log_date");

    const uniqueDates = [
      ...new Set(data.map((d) => d.log_date)),
    ].sort((a, b) => new Date(b) - new Date(a));

    setDates(uniqueDates);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchTasks = async (date) => {
    setSelectedDate(date);

    const { data } = await supabase
      .from("daily_routine_history")
      .select("*")
      .eq("log_date", date)
      .order("start_time");

    setTasks(data);
  };

  return (
    <div className="card">
      <h2>History</h2>

      <div className="date-list">
        {dates.map((date) => (
          <button key={date} onClick={() => fetchTasks(date)}>
            {date}
          </button>
        ))}
      </div>

      {selectedDate && (
        <>
          <h3>
            {selectedDate} (
            {tasks.filter((t) => t.completed).length}/{tasks.length})
          </h3>

          {tasks.map((task) => (
            <div key={task.id} className="task">

              <div
                className="task-header"
                onClick={() =>
                  setOpenId(openId === task.id ? null : task.id)
                }
              >
                <span>
                  {task.completed ? "✔" : "☐"} {task.title}
                </span>

                <span>
                  ⏰ {task.start_time || "--"} → {task.end_time || "--"}
                </span>
              </div>

              {openId === task.id && (
                <div className="task-body">
                  {task.note && <div>📝 {task.note}</div>}
                  {task.next_day_reminder && (
                    <div>🔮 {task.next_day_reminder}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default History;