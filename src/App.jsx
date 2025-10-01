import React, {useEffect, useState} from 'react'
import NewButton from "./NewButton.jsx";
import 'beercss'
import './App.css'


function App() {
    const [passwords, setPasswords] = useState([{
        id: "Loading...",
        website: "Loading",
        username: "Loading",
        password: "Loading",
        strength: "Loading"
    }])
    const [user, setUser] = useState({
        avatar_url: "",
        username: "User"
    })
    const [activeEditRow, setActiveEditRow] = useState(-1)
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
    const [passwordFormData, setPasswordFormData] = useState({
        id: "None",
        website: "None",
        username: "None",
        password: "None"
    })
    const savePassword = async (event) => {
        event.preventDefault()
        const body = JSON.stringify(passwordFormData)
        if (passwordFormData.website.length === 0) {
            alert("You must have a website!")
            return -1;
        } else if (!(passwordFormData.website.startsWith("http://") || passwordFormData.website.startsWith("https://"))) {
            alert("Improper website format!")
            return -1;
        }
        if (passwordFormData.username.length === 0) {
            alert("You must have a username!")
            return -1;
        }
        if (passwordFormData.password.length === 0) {
            alert("You must have a password!")
            return -1;
        }
        await fetch("/save", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        })
        await getPasswords()
        setPasswordFormData({
            id: "None",
            website: "None",
            username: "None",
            password: "None"
        })
        setActiveEditRow(-1)
    }
    const wrap = (node) => (activeEditRow > -1 ? <form>{node}</form> : node);
    useEffect(async () => {
        await getPasswords()
        await getUsername()
    }, []);
    return (
        <>
            <div className={"mainContainer"}>

                <div className={"accountContainer bottom-margin"}>
                    <span>
                        {
                            user.avatar_url !== ""
                                ?
                                <img src={user.avatar_url} className={"circle tiny small-margin right-margin"} alt={"avatar image"}/>
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
                    {wrap(
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
                                    (<tr key={entry.id}>
                                        <td className={activeEditRow === index && "no-padding"}>
                                            {
                                                activeEditRow === index ?
                                                    (<div className={"field border"}>
                                                        <input type={"url"} className={"tiny-padding"} value={passwordFormData.website} onChange={(e) => {
                                                            setPasswordFormData({
                                                                ...passwordFormData,
                                                                website: e.target.value
                                                            })
                                                        }}/>
                                                    </div>)
                                                    : entry.website
                                            }
                                        </td>
                                        <td className={activeEditRow === index && "no-padding"}>
                                            {
                                                activeEditRow === index ?
                                                    (<div className={"field border"}>
                                                        <input type={"text"} className={"tiny-padding"} value={passwordFormData.username} onChange={(e) => {
                                                            setPasswordFormData({
                                                                ...passwordFormData,
                                                                username: e.target.value
                                                            })
                                                        }}/>
                                                    </div>)
                                                    : entry.username
                                            }
                                        </td>
                                        <td className={activeEditRow === index && "no-padding"}>
                                            {
                                                activeEditRow === index ?
                                                    (<div className={"field border"}>
                                                        <input type={"text"} className={"tiny-padding"} value={passwordFormData.password} onChange={(e) => {
                                                            setPasswordFormData({
                                                                ...passwordFormData,
                                                                password: e.target.value
                                                            })
                                                        }}/>
                                                    </div>)
                                                    : entry.password
                                            }
                                        </td>
                                        <td className={"strengthCell"}>
                                            {entry.strength}
                                        </td>
                                        {
                                            activeEditRow !== index ? (<td>
                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    setPasswordFormData({
                                                        id: entry.id,
                                                        website: entry.website,
                                                        username: entry.username,
                                                        password: entry.password
                                                    })
                                                    setActiveEditRow(index)
                                                }
                                                } className={"edit-save-button transparent circle"}>
                                                    <i>edit</i>
                                                </button>
                                            </td>) : (<td>
                                                <button onClick={async (e) => {
                                                    await savePassword(e)
                                                }
                                                } className={"edit-save-button transparent circle"}>
                                                    <i>save</i>
                                                </button>
                                            </td>)
                                        }
                                    </tr>)
                                )
                            )}
                            </tbody>
                        </table>
                    )}


                </div>

            </div>
            <NewButton></NewButton>
        </>
    )
}

export default App
