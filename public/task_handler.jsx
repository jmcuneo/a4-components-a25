import { useState } from "react"
import TaskForm from "./task_form"

export default function TaskHandler({ userKey }) {
    const [tasks, setTasks] = useState([]);    

    // handle submitting task to server database
    const post_task = async function({ task_priority, task_text }) {
        const json = { // parse to json
            key: userKey,
            priority: task_priority, 
            text: task_text
        }  
        // parse json to body and push to server
        const body = JSON.stringify(json)
        // request POST to server
        const response = await fetch( "/pushtasks", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body 
        })

        // add posted task
        setTasks(prevTasks => [...prevTasks, { priority: task_priority, taskText: task_text }]);
    }

    const remove_task = async function(task) {
        try {
            const response = await fetch("/rmtasks", {
                method: "POST", 
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify({ key, priority: task.priority, text: task.taskText })
            });

            setTasks((prev) => prev.filter((x) => x !== task));
        } catch(error) {
            console.error("Error removing task:", error)
        }
    }

    return (
        <div>
            <TaskForm onUpdate={post_task}/>

            <div id="task-box"> {
                tasks.map((task, i) => (
                    <div key={i} className="row" style={{ margin: 0 }}>
                        <div className="col-sm-4">
                            {task.priority}
                        </div><div className="col-sm-4">
                            {task.taskText}
                        </div><div className="col-sm-4">
                            <button
                                className="btn btn-primary btn-block"
                                style={{ height: "2em" }}
                                onClick={() => remove_task(task)}
                            >
                                Delete 
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}