import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";



export default function User_content() {

    // for the table display
    const [homework, setHomework] = useState([]);

    // for delete form
    const [delete_item, setDeleteItem] =useState("");

    // for add/update form!
    const [ID, setID] = useState("");
    const [subject, setSubject] = useState("");
    const [expectedtime, setExpectedtime] = useState("");
    const [date, setDate] = useState("");

    // username greeting
    const [username, setUsername] = useState("");

    const nav = useNavigate();

    const logout = async (event) => {
        event.preventDefault(); // stop form submission
        try {
            const reponse = await fetch("/logout", {
                method: "POST",
                credentials: "same-origin",
            });
            nav("/Login");
        } catch (error) {
            //console.log("test");
            console.error(error + " when logging out");
        }
    };

    const checkLogin = async () =>{

        try {
            const response = await fetch("/login_status", {
                method: "GET",
                credentials: "same-origin" }
            );

            const result = await response.json();
            //console.log(result);

            if (!result.can_login) {
                //nav("/login");
                return false;
            } else {
                setUsername(result.user);
                return true;
            }

        } catch (error) {
            console.error("Error checking login:", error);
            return false;
        }

    };


    const get_homework = async () => {

        try {

            const response = await fetch("/data", {
                method: "GET",
                credentials: "same-origin"
            });

            const data = await response.json();
            data.sort((a, b) => b.stress_score - a.stress_score);
            setHomework(data);

        } catch (error) {
            console.error("Failed to fetch homework:", error);
        }

    };


    // https://www.geeksforgeeks.org/reactjs/reactjs-useeffect-hook/
    // I wanted it so my program would
    // automatically check if the user was logged in here as well.
    // and grab their name while im at it!

    // my initial setup for the page
    useEffect( () => {

        checkLogin().then(logged_in => {
            if (logged_in) {
                get_homework();
            } else {
                nav("/Login");
            }
        })

    }, []);

    // I wanted my program to automatically fetch the user's data
    // https://www.geeksforgeeks.org/reactjs/when-should-we-use-the-useeffect-hook/


    // https://www.geeksforgeeks.org/reactjs/reactjs-useeffect-hook/
    //useEffect(() => {
    //    get_homework();
    //}, []);


    const delete_homework = async (event)=>{
        event.preventDefault();

        try {

            if (!delete_item || isNaN(Number(delete_item))) {
                return;
            }

            const new_table = await fetch("/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ID: delete_item}),
            });

            // get server response
            let result = await new_table.json();

            if (result.operation_worked === true) {
                get_homework().then(() => console.log("Delete success!"));
            } else {
                console.log("deletion failed!")
            }


        } catch (error) {
            console.error("Failed to delete assignment:", error);
        }
    };

    const submit_homework = async function( event ) {
        // stop form submission from trying to load
        // a new .html page for displaying results...
        // this was the original browser behavior and still
        // remains to this day
        event.preventDefault();

        try {

            // get info from the user's inputs
            const fields = {
                ID: ID,
                subject: subject,
                expectedtime: expectedtime,
                date: date,
            };

            // format data
            const body = JSON.stringify(fields);

            const new_table = await fetch("/submit", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "same-origin",
                body,
            });

            // get server response
            let result = await new_table.json();

            if (result.operation_worked === true) {
                get_homework().then(() => console.log("Delete success!"));
            } else {
                console.log("submission failed!")
            }


        } catch (error) {
            console.error("Failed to submit assignment:", error);
        }

    }



    return (
        <>
            <header className="d-flex flex-column flex-lg-row align-items-center justify-content-evenly
                                bg-primary text-white p-4 mb-4">

                <div className="d-flex align-items-center">
                    <img src="/images/icon.png" alt="logo" className="me-3 img-fluid" />
                    <h1 className="h1 fw-bold text-decoration-underline">
                        Assignment Priority Generator 2.0
                    </h1>
                </div>

                <span id="user-welcome" className="h3 fw-semibold">
                        Hello {username}, you are logged in!
                </span>

                <form id="logout-form" onSubmit={logout}>
                    <button type="submit" id="logout-button" className="btn btn-light">
                        Logout
                    </button>
                </form>

            </header>

            <main className="container">

                <div className="row g-4 mb-4 p-4">

                    <div className="col-md-6">
                        <div className="card border-success h-100 border-5 p-4">

                            <h2 className="h3 mb-3">Add / Update Assignment</h2>
                            <form id="submit-form" onSubmit={submit_homework}>

                                <div className="mb-3 fw-bold">

                                    <label htmlFor="ID" className="form-label"> ID</label>
                                    <input type="number" className="form-control" id="ID" placeholder="homework ID # (e.g 3)" required
                                           value = {ID} onChange={(event) => setID(event.target.value)}
                                    />

                                </div>

                                <div className="mb-3 fw-bold">

                                    <label htmlFor="subject" className="form-label"> Assignment name </label>
                                    <input type="text" className="form-control" id="subject" placeholder="e.g a3-ElijahGray-a25" required
                                           value = {subject} onChange={(event) => setSubject(event.target.value)}
                                    />

                                </div>

                                <div className="mb-3 fw-bold">

                                    <label htmlFor="expectedtime" className="form-label"> Hours Expected </label>
                                    <input type="number" className="form-control" id="expectedtime" placeholder="hours expected to complete" required
                                           value = {expectedtime} onChange={(event) => setExpectedtime(event.target.value)}
                                    />

                                </div>

                                <div className="mb-3 fw-bold">
                                    <label htmlFor="date" className="form-label">Due Date</label>
                                    <input type="date" className="form-control" id="date" required
                                           value = {date} onChange={(event) => setDate(event.target.value)}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100" id="submit-button">
                                    Submit
                                </button>


                            </form>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="d-flex card h-100 border-5 border-danger p-4 mb-2 justify-content-center">

                            <h2 className="h3 mb-3">Delete Assignment</h2>

                            <form id="delete-form" onSubmit={delete_homework}>
                                <input type="number"  id="delete-id"  className="form-control" aria-label="number to delete here"  placeholder="ID to delete"
                                       value = {delete_item} onChange={(event) => setDeleteItem(event.target.value)}
                                />
                                <button type="submit" className="btn btn-danger w-100" id="delete-button">
                                    Delete
                                </button>
                            </form>

                        </div>
                    </div>

                </div>

                <div className="card p-4 mb-4">
                    <h2 className="h5 mb-3">Your Assignments</h2>
                    <div className="table-responsive-xl shadow-lg">

                        <table className="table table-striped table-hover" id="homework-table">

                            <thead>
                                <tr className="table-primary text-uppercase">
                                    <th scope="col">ID</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Hours Expected</th>
                                    <th scope="col">Due Date</th>
                                    <th scope="col">Stress Score</th>
                                </tr>
                            </thead>

                            <tbody>

                                {homework.map(homework => (
                                    <tr key = {homework.ID}>
                                            <td>{homework.ID}</td> <td>{homework.subject}</td> <td>{homework.expectedtime}</td>
                                            <td>{new Date(homework.date).toLocaleDateString()}</td>
                                            <td>{homework.stress_score}</td>
                                    </tr>)
                                )}

                            </tbody>

                        </table>
                    </div>
                </div>

            </main>
        </>
    )

}