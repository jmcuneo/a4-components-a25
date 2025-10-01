import React, {useEffect, useState} from 'react'

const PasswordTable = (props) => {
    const [passwords, setPasswords] = useState([])
    const wrap = (node) => (props.activeEditRow > -1 || props.showNewPasswordRow ? <form>{node}</form> : node);
    const getPasswords = async () => {
        const response = await fetch("/passwords", {
            method: "GET"
        })
        setPasswords(JSON.parse(await response.text()))
    }
    const [passwordFormData, setPasswordFormData] = useState({
        id: -1,
        website: "",
        username: "",
        password: ""
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
            id: -1,
            website: "",
            username: "",
            password: ""
        })
        props.setActiveEditRow(-1)
        props.setShowNewPasswordRow(false)
    }
    const deletePassword = async (id) => {
        const json = {id: id},
            body = JSON.stringify(json)
        const response = await fetch("/delete", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        })
        await getPasswords()
    }

    useEffect(async () => {
        await getPasswords()
    }, []);
    return (
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
                                <td className={props.activeEditRow === index && "no-padding"}>
                                    {
                                        props.activeEditRow === index ?
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
                                <td className={props.activeEditRow === index && "no-padding"}>
                                    {
                                        props.activeEditRow === index ?
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
                                <td className={props.activeEditRow === index && "no-padding"}>
                                    {
                                        props.activeEditRow === index ?
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
                                    props.activeEditRow !== index ? (<td>
                                        <button disabled={props.showNewPasswordRow || (props.activeEditRow !== -1 && props.activeEditRow !== index)}
                                                style={{opacity: props.showNewPasswordRow || (props.activeEditRow !== -1 && props.activeEditRow !== index) ? 0 : 100}}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setPasswordFormData({
                                                        id: entry.id,
                                                        website: entry.website,
                                                        username: entry.username,
                                                        password: entry.password
                                                    })
                                                    props.setActiveEditRow(index)
                                                }
                                                } className={"edit-save-button transparent circle"}>
                                            <i>edit</i>
                                        </button>
                                        <button disabled={props.showNewPasswordRow || (props.activeEditRow !== -1 && props.activeEditRow !== index)}
                                                style={{opacity: props.showNewPasswordRow || (props.activeEditRow !== -1 && props.activeEditRow !== index) ? 0 : 100}}
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    await deletePassword(entry.id)
                                                }
                                                } className={"delete-cancel-button transparent circle"}>
                                            <i>delete</i>
                                        </button>
                                    </td>) : (<td>
                                        <button onClick={async (e) => {
                                            await savePassword(e)
                                        }
                                        } className={"edit-save-button transparent circle"}>
                                            <i>save</i>
                                        </button>
                                        <button onClick={async (e) => {
                                            setPasswordFormData({
                                                id: -1,
                                                website: "",
                                                username: "",
                                                password: ""
                                            })
                                            props.setActiveEditRow(-1)
                                            await getPasswords()
                                        }
                                        } className={"delete-cancel-button transparent circle"}>
                                            <i>cancel</i>
                                        </button>
                                    </td>)
                                }
                            </tr>)
                        )
                    )}
                    {
                        props.showNewPasswordRow && (
                            <tr>
                                <td>
                                    <div className={"field border"}>
                                        <input type={"url"} className={"tiny-padding"} value={passwordFormData.website} onChange={(e) => {
                                            setPasswordFormData({
                                                ...passwordFormData,
                                                website: e.target.value
                                            })
                                        }}/>
                                    </div>
                                </td>
                                <td>
                                    <div className={"field border"}>
                                        <input type={"text"} className={"tiny-padding"} value={passwordFormData.username} onChange={(e) => {
                                            setPasswordFormData({
                                                ...passwordFormData,
                                                username: e.target.value
                                            })
                                        }}/>
                                    </div>
                                </td>
                                <td>
                                    <div className={"field border"}>
                                        <input type={"text"} className={"tiny-padding"} value={passwordFormData.password} onChange={(e) => {
                                            setPasswordFormData({
                                                ...passwordFormData,
                                                password: e.target.value
                                            })
                                        }}/>
                                    </div>
                                </td>
                                <td className={"strengthCell"}>
                                    Make it strong!
                                </td>
                                <td>
                                    <button onClick={async (e) => {
                                        await savePassword(e)
                                    }
                                    } className={"edit-save-button transparent circle"}>
                                        <i>save</i>
                                    </button>
                                    <button onClick={async (e) => {
                                        setPasswordFormData({
                                            id: -1,
                                            website: "",
                                            username: "",
                                            password: ""
                                        })
                                        props.setShowNewPasswordRow(false)
                                        await getPasswords()
                                    }
                                    } className={"delete-cancel-button transparent circle"}>
                                        <i>cancel</i>
                                    </button>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            )}


        </div>
    )
}

export default PasswordTable