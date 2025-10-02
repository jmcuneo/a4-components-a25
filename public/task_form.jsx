import { useState } from "react"

export default function TaskForm({ onUpdate }) {
    const [priority, setPriority] = useState("")
    const [taskText, setTaskText] = useState("")
   

    const submit_task = (event) => {
        event.preventDefault();
        if(!priority || !taskText) {
            return
        }

        // call update function
        onUpdate({ priority, taskText });
        // clear form fields
        setPriority("");
        setTaskText("");
    };

    return (
        <div>
            <form 
                id="inputTask" 
                className="form-signup" 
                onSubmit={submit_task} 
                style={{ marginBottom: "2em" }}
            >
                <label 
                    htmlFor="inputPriority" 
                    className="sr-only"
                >
                    Priority Number
                </label><input 
                    type="number" 
                    id="inputPriority" 
                    className="form-control" 
                    placeholder="Priority Number" 
                    required
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                />
                <label 
                    htmlFor="inputText" 
                    className="sr-only"
                >
                    Write Task Here
                </label><input 
                    type="text" 
                    id="inputText" 
                    className="form-control" 
                    placeholder="Write Task Here" 
                    required
                    value={taskText}
                    onChange={(event) => setTaskText(event.target.value)}
                />
    
                <button 
                    className="btn btn-lg btn-primary btn-block" 
                    style={{ marginTop: "1em" }}
                    type="submit"
                >
                    Add Task
                </button>
            </form>
        </div>
    )
}