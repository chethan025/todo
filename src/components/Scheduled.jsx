import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Scheduled() {
  const [tasks, setTasks] = useState([]);
  const [openId, setOpenId] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch today's selected date tasks
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("scheduled_tasks")
      .select("*")
      .eq("date", selectedDate)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // Toggle complete
  const toggleTask = async (task) => {
    await supabase
      .from("scheduled_tasks")
      .update({
        completed: !task.completed,
      })
      .eq("id", task.id);

    fetchTasks();
  };

  // Delete
  const deleteTask = async (id) => {
    await supabase
      .from("scheduled_tasks")
      .delete()
      .eq("id", id);

    fetchTasks();
  };

  return (
    <div className="card">
      <h2>Today Scheduled</h2>

      {/* DATE PICKER */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* TASK LIST */}
      {tasks.map((task) => (
        <div key={task.id} className="task">

          <div
            className="task-header"
            onClick={() =>
              setOpenId(openId === task.id ? null : task.id)
            }
          >
            <span onClick={() => toggleTask(task)}>
              {task.completed ? "✔" : "☐"} {task.title}
            </span>
          </div>

          {openId === task.id && (
            <div className="task-body">

              {task.note && (
                <div>📝 {task.note}</div>
              )}

              <button
                className="btn btn-danger"
                onClick={() => deleteTask(task.id)}
              >
                ✖
              </button>

            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Scheduled;