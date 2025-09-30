import React, {useEffect, useState} from 'react'
import NewButton from "./NewButton.jsx";
import 'beercss'
import './App.css'


function App() {
    const [passwords, setPasswords] = useState([{
        website: "Loading",
        username: "Loading",
        password: "Loading",
        strength: "Loading"
    }])
    const [user, setUser] = useState({
        avatar_url: "",
        username: "User"
    })
    const getPasswords = async () => {
        const response = await fetch("/passwords", {
            method: "GET"
        })
        setPasswords(JSON.parse(await response.text()))
    }
    const getUsername = async () => {
        const response = await fetch("/user", {
            method: "GET"
        })
        const userString = await response.text()
        setUser(JSON.parse(userString))
    }
    useEffect(async () => {
        await getPasswords()
        await getUsername()
    }, []);
    return (
        <>
            <body className={"dark"}>
            <div className={"mainContainer"}>

                <div className={"accountContainer bottom-margin"}>
                    <span>
                        {
                            user.avatar_url !== ""
                                ? <img src={user.avatar_url} className={"circle tiny small-margin right-margin"} alt={"avatar image"}/>
                                : <i className={"circle extra small-margin right-margin"}>account_circle</i>
                        }

                        <span className={"large-text"}>{user.username}</span>
                    </span>
                    <button className={"small circle absolute right"} onClick={() => {
                        window.location.href = "/logout"
                    }}>
                        <i>
                            logout
                        </i>
                    </button>
                </div>
                <div id="header">
                    <h2>
                        My Passwords
                    </h2>
                </div>
                <div id={"passwordTableContainer"}>
                    <table>
                        <thead>
                        <tr>
                            <th>
                                Website
                            </th>
                            <th>
                                Username
                            </th>
                            <th>
                                Password
                            </th>
                            <th>
                                Strength
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {passwords.map((entry, index) =>
                            (
                                (<tr>
                                <td>
                                    {entry.website}
                                </td>
                                <td>
                                    {entry.username}
                                </td>
                                <td>
                                    {entry.password}
                                </td>
                                <td>
                                    {entry.strength}
                                </td>
                                    {
                                        true ? (<td><button className={"edit-save-button transparent circle"}><i>save</i></button></td>) : (<td>bye</td>)
                                    }
                            </tr>)
                            )
                        )}
                        </tbody>
                    </table>


                </div>

            </div>
            <NewButton></NewButton>
            </body>
        </>
    )
}

export default App
