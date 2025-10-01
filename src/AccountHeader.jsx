import React, {useEffect, useState} from 'react'

const AccountHeader = () => {
    const [user, setUser] = useState({
        avatar_url: "",
        username: "User"
    })
    const getUsername = async () => {
        const response = await fetch("/user", {
            method: "GET"
        })
        const userString = await response.text()
        setUser(JSON.parse(userString))
    }
    useEffect(async () => {
        await getUsername()
    }, []);
    return (
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
    )
}

export default AccountHeader