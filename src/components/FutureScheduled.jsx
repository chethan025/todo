import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function FutureScheduled() {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [dates, setDates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openId, setOpenId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // Fetch future available dates
  const fetchDates = async () => {
    const { data, error } = await supabase
      .from("scheduled_tasks")
      .select("date");

    if (error) {
      console.error(error);
      return;
    }

    const future = [
      ...new Set(
        data
          .map((d) => d.date)
          .filter((d) => d > today)
      ),
    ].sort();

    setDates(future);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  // Fetch tasks for selected future date
  const fetchTasks = async (date) => {
    setSelectedDate(date);

    const { data, error } = await supabase
      .from("scheduled_tasks")
      .select("*")
      .eq("date", date)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setTasks(data);
  };

  // Add future task
  const addTask = async () => {
    if (!text.trim() || !date) return;

    await supabase
      .from("scheduled_tasks")
      .insert([
        {
          title: text,
          date,
          note: note || null,
          completed: false,
        },
      ]);

    setText("");
    setDate("");
    setNote("");

    fetchDates();

    // auto refresh selected date
    if (selectedDate === date) {
      fetchTasks(date);
    }
  };

  return (
    <div className="card">

      {/* ADD TASK */}
      <div className="add-bar2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />

        <button className="btn" onClick={addTask}>
          ✔
        </button>

      </div>

      <h2>Future Scheduled</h2>

      {/* DATE LIST */}
      <div className="date-list">
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => fetchTasks(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* TASKS */}
      {selectedDate && (
        <div>

          <h3>{selectedDate}</h3>

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
              </div>

              {openId === task.id && (
                <div className="task-body">

                  {task.note && (
                    <div>📝 {task.note}</div>
                  )}

                </div>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default FutureScheduled;