import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Scheduled() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [openId, setOpenId] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("scheduled_tasks")
      .select("*")
      .eq("date", selectedDate);

    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const addTask = async () => {
    if (!text || !date) return;

    await supabase.from("scheduled_tasks").insert([
      { title: text, date, note }
    ]);

    setText("");
    setDate("");
    setNote("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await supabase
      .from("scheduled_tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("scheduled_tasks").delete().eq("id", id);
    fetchTasks();
  };

  return (
    <div className="card">
      <h2>Today Scheduled</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e)=>setSelectedDate(e.target.value)}
      />

      {tasks.map((task) => (
        <div key={task.id} className="task">

          <div
            className="task-header"
            onClick={() =>
              setOpenId(openId === task.id ? null : task.id)
            }
          >
            <span onClick={()=>toggleTask(task)}>
              {task.completed ? "✔" : "☐"} {task.title}
            </span>
          </div>

          {openId === task.id && (
            <div className="task-body">
              {task.note && <div>📝 {task.note}</div>}
              <button className="btn btn-danger" onClick={()=>deleteTask(task.id)}>✖</button>
            </div>
          )}
        </div>
      ))}

      <div className="add-bar2">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Task"/>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
        <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note"/>
        <button className="btn" onClick={addTask}>✔</button>
      </div>

      

      
    </div>
  );
}

export default Scheduled;