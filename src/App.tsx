import {useState, useEffect} from 'react'
import './App.css'
import type {Todo} from "./Todo.ts";

const calculateDeadline = (createDate: Date, priority: string): Date => {
    const suggestedDeadline = new Date()
    switch (priority) {
        case 'Urgent':
            suggestedDeadline.setDate(createDate.getDate() + 1)
            break;
        case 'High':
            suggestedDeadline.setDate(createDate.getDate() + 2)
            break;
        case 'Medium':
            suggestedDeadline.setDate(createDate.getDate() + 7)
            break;
        case 'Low':
            suggestedDeadline.setDate(createDate.getDate() + 30)
            break;
    }
    return suggestedDeadline
}

function App() {
    const [newTask, setNewTask] = useState('')
    const [newPriority, setNewPriority] = useState('Medium')

    const [todoList, setTodoList] = useState(() => {
        //session storage to create refresh persistence

        const savedTodos = sessionStorage.getItem('todos')
        //check if its null, so initial task doesn't get recreated on refresh
        if (savedTodos !== null) {
            const parsedTodos = JSON.parse(savedTodos)

            return parsedTodos.map((todo: Todo) => ({
                ...todo,
                createDate: new Date(todo.createDate),
                suggestedDeadline: new Date(todo.suggestedDeadline),
            }))
        }

        const createDate = new Date()
        const initialTask = {
            id: Date.now(),
            task: "Complete assignment 4",
            priority: "Medium",
            createDate: createDate,
            suggestedDeadline: calculateDeadline(createDate, "Medium"),
            isComplete: false,
        };
        return [initialTask];
    })

    useEffect(() => {
        // save to-do list to local storage so it has refresh persistence
        sessionStorage.setItem('todos', JSON.stringify(todoList));
    }, [todoList]);


    const addTask = (e: React.FormEvent) => {
        e.preventDefault()
        const freshTask: Todo = {
            id: Date.now(),
            task: newTask,
            priority: newPriority,
            createDate: new Date(),
            suggestedDeadline: new Date(),
            isComplete: false
        }
        freshTask.suggestedDeadline = (calculateDeadline(freshTask.createDate, freshTask.priority))
        setTodoList([...todoList, freshTask])

    }

    const handlePriorityChange = (id: number, newPriority: string) => {
        const updatedList = todoList.map((todo: Todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    priority: newPriority,
                    suggestedDeadline: calculateDeadline(todo.createDate, newPriority)
                };
            }
            return todo;
        });

        setTodoList(updatedList);
    };

    const deleteTask = (id: number) => {
        const updatedList = todoList.filter((todo: Todo) => todo.id !== id);

        setTodoList(updatedList);
    };

    return (
        <main>
            <div>
                <h1>My To-Do List</h1>
            </div>
            <form id="todoForm" onSubmit={addTask}>
                <p>Enter your task:</p>
                <div className={"input-group"}>
                    <input type="text" id="task-input" placeholder="e.g., Finish a4"
                           onChange={(e) => setNewTask(e.target.value)} value={newTask}/>
                    <select
                        className={`priority-select priority-${newPriority}`}
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                    >
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div>
                    <button type="submit" id="submitButton">Add Task</button>
                </div>
            </form>

            <div>
                <h2>Current Tasks</h2>
            </div>

            <table id="taskTable">
                <thead>
                <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Date Created</th>
                    <th>Suggested Deadline</th>
                    <th>Completed?</th>
                </tr>
                </thead>
                <tbody id="taskTableBody">
                {todoList.map((todo: Todo) => (
                    <tr key={todo.id}>
                        <td>{todo.task}</td>
                        <td>
                            <select
                                className={`priority-select priority-${todo.priority}`}
                                value={todo.priority}
                                onChange={(e) => handlePriorityChange(todo.id, e.target.value)}
                            >
                                <option value="Urgent">Urgent</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </td>
                        <td>{todo.createDate.toLocaleDateString()}</td>
                        <td>{todo.suggestedDeadline.toLocaleDateString()}</td>
                        <td><input type="checkbox" checked={todo.isComplete} onChange={() => deleteTask(todo.id)}/></td>

                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    )
}

export default App
