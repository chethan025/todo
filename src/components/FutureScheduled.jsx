import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function FutureScheduled() {
  const [dates, setDates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openId, setOpenId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const fetchDates = async () => {
    const { data } = await supabase
      .from("scheduled_tasks")
      .select("date");

    const future = [
      ...new Set(data.map(d => d.date).filter(d => d > today))
    ].sort();

    setDates(future);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchTasks = async (date) => {
    setSelectedDate(date);

    const { data } = await supabase
      .from("scheduled_tasks")
      .select("*")
      .eq("date", date);

    setTasks(data);
  };

  return (
    <div className="card">
      <h2>Future</h2>

      <div className="date-list">
        {dates.map((d) => (
          <button key={d} onClick={()=>fetchTasks(d)}>
            {d}
          </button>
        ))}
      </div>

      {selectedDate && tasks.map(task => (
        <div key={task.id} className="task">

          <div
            className="task-header"
            onClick={() =>
              setOpenId(openId === task.id ? null : task.id)
            }
          >
            <span>{task.title}</span>
          </div>

          {openId === task.id && (
            <div className="task-body">
              {task.note && <div>📝 {task.note}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FutureScheduled;