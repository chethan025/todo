import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Daily() {
  const [tasks, setTasks] = useState([]);
  const [openId, setOpenId] = useState(null);

  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editData, setEditData] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = async () => {
  const { data } = await supabase
    .from("daily_routines")
    .select("*")
    .order("created_at", { ascending: true }); // 👈 THIS FIXES IT

  const updated = data.map((task) => {
    if (task.last_completed_date !== today) {
      return { ...task, completed: false };
    }
    return task;
  });

  setTasks(updated);

  const edit = {};
  updated.forEach((t) => {
    edit[t.id] = {
      note: t.note || "",
      next_day_reminder: t.next_day_reminder || "",
    };
  });
  setEditData(edit);
};

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;

    await supabase.from("daily_routines").insert([
      { title: text, "start-time": startTime, "end-time": endTime }
    ]);

    setText("");
    setStartTime("");
    setEndTime("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await supabase.from("daily_routines")
      .update({ completed: !task.completed, last_completed_date: today })
      .eq("id", task.id);

    fetchTasks();
  };

  const saveTask = async (id) => {
    await supabase.from("daily_routines")
      .update(editData[id])
      .eq("id", id);

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("daily_routines").delete().eq("id", id);
    fetchTasks();
  };

  return (
    <div className="card">
      <h2>Daily Tasks</h2>

      <div className="add-bar">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Task"/>
        <input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)}/>
        <input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)}/>
        <button className="btn" onClick={addTask}>✔</button>
      </div>

      {tasks.map((task) => (
        <div key={task.id} className="task">

          <div className="task-header" onClick={() => setOpenId(openId === task.id ? null : task.id)}>
            <span onClick={() => toggleTask(task)}>
              {task.completed ? "✔" : "☐"} {task.title}
            </span>

            <span>⏰ {task["start-time"] || "--"} → {task["end-time"] || "--"}</span>
          </div>

          {openId === task.id && (
            <div className="task-body">
              <textarea
                value={editData[task.id]?.note}
                onChange={(e)=>setEditData(prev=>({...prev,[task.id]:{...prev[task.id],note:e.target.value}}))}
                placeholder="Note"
              />

              <textarea
                value={editData[task.id]?.next_day_reminder}
                onChange={(e)=>setEditData(prev=>({...prev,[task.id]:{...prev[task.id],next_day_reminder:e.target.value}}))}
                placeholder="Next day"
              />

              <div>
                <button className="btn btn-icon" onClick={()=>saveTask(task.id)}>✔</button>
                <button className="btn btn-danger btn-icon" onClick={()=>deleteTask(task.id)}>✖</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Daily;