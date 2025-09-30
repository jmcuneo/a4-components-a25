import React, {useEffect, useState} from 'react'
import './App.css'
import 'beercss'
import NewButton from "./NewButton.jsx";


function App() {
    const [passwords, setPasswords] = useState([{
        website: "Loading",
        username: "Loading",
        password: "Loading",
        strength: "Loading"
    }])
    const getPasswords = async () => {
        const response = await fetch("/passwords", {
            method: "GET"
        })
        setPasswords(JSON.parse(await response.text()))
    }

    useEffect(async () => {
        await getPasswords()
    }, []);
    return (
        <>
            <div className={"mainContainer"}>


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
                        {passwords.map((entry) =>
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
                            </tr>)
                        )}
                        </tbody>
                    </table>


                </div>

            </div>
            <NewButton></NewButton>
        </>
    )
}

export default App
