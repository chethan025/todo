import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Todos() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [openId, setOpenId] = useState(null);

  const fetchTasks = async () => {
    const { data } = await supabase.from("todos").select("*");
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!text) return;

    await supabase.from("todos").insert([{ title: text, note }]);

    setText("");
    setNote("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await supabase
      .from("todos")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("todos").delete().eq("id", id);
    fetchTasks();
  };

  return (
    <div className="card">
      <h2>Reminders</h2>

      <div className="add-bar2">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Todo"/>
        <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note"/>
        <button className="btn" onClick={addTask}>✔</button>
      </div>

      {tasks.map(task => (
        <div key={task.id} className="task">

          <div
            className="task-header"
            onClick={()=>setOpenId(openId === task.id ? null : task.id)}
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
    </div>
  );
}

export default Todos;