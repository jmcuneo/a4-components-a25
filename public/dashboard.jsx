import { useState, useEffect } from "react";
import Navbar from "./navbar";
import TaskHandler from "./task_handler";

export default function dashboard() {
    const [username, setUsername] = useState("no-name");
    const [userKey, setUserKey] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
            const match = window.location.pathname.match(/\/dashboard-(.+)/)
            // check url validity
            if(!match) {
                return console.error("Invalid dashboard URL")
            }
            // good match; parse user key from url
            const key_value = match[1]
            setUserKey(key_value) // set key
            // try to get user info and user task info by api
            try {
                const response = await fetch(`/api/dashboard/${key_value}/users`)
                if(!response) {
                    throw new Error("Failed to fetch user")
                }

                const data = await response.json()
                setUsername(data.id)
            } catch(err) {
                console.error(err.message)
            }
            // try to get user tasks info by api
            try {
                const response = await fetch(`./api/dashboard/${key_value}/tasks`)
                if(!response) {
                    throw new Error("Failed to fetch user's tasks")
                }

                const data = await response.json()
                setTasks(data)
            } catch(err) {
                console.error(err.message)
            }
        };

        fetchUserData();
    }, [])

    // handles redirecting user to home page and flagging log out to server
    const logout = async function(event) {
        event.preventDefault()
        // parse json
        const json = {
            key: userKey,
        }
        // parse json to body and push to server
        const body = JSON.stringify(json)
        // request POST to server
        const response = await fetch( "/logout", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body 
        })

        // handle response
        console.log(response)
    }

    return (
        <div className="container">
            <Navbar />
            <div style={{ marginTop: "1em" }}>
                <p>
                    <a 
                        className="btn btn-primary btn-lg" 
                        onClick={logout} 
                        href="/#home" 
                        role="button"
                    >
                        Log Out »
                    </a>
                </p>
            </div>
            <h1>Hello {username}, </h1>
            <p>Here are your current tasks:</p>
            <h3>Your tasks are below with designated priority</h3>
            <p>Tasks can be created with the menu below.</p>
            <TaskHandler userKey={userKey} />
        </div> 
    );
}