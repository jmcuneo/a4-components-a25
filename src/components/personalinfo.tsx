'use client'
import {FormEvent, useState} from "react";
import axios from "axios";
import {states} from "@/lib/states";
import {genders} from "@/lib/genders";
import {useUser} from "@auth0/nextjs-auth0";

export default function PersonalInfo() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const {user} = useUser();
    const [gender, setGender] = useState("");
    const [state, setState] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // fetch email from auth0 rather then form
        const email = user?.email || "";
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            console.error("Backend URL is not defined");
            return;
        }
        axios.post(`${backendUrl}/api/submit`, {
            firstName,
            lastName,
            dob,
            email,
            gender,
            state
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    return (
        <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="legend text-lg font-bold">Personal Information</legend>
                <label className={"label"}>First</label>
                <input type="text" className="input" placeholder={"John"}
                       onChange={(e) => setFirstName(e.target.value)} required/>
                <label className={"label"}>Last</label>
                <input type="text" className="input" placeholder={"Doe"} onChange={(e) => setLastName(e.target.value)}
                       required/>
                <label htmlFor={"dob"} className={"label"}>Date of Birth</label>
                <input id={"dob"} type="date" className="input" onChange={(e) => setDob(e.target.value)} required/>
                <label className={"label"}>Preferred Gender</label>
                <div className={"flex flex-col gap-2 mb-2"}>
                    {genders.map(gender => (
                        <div className={"flex w-full gap-2"} key={gender}>
                            <input id={"gender"} type={"radio"} className={"radio"} name={"gender"} value={gender} onChange={(e) => setGender(e.target.value)} required/>
                            <label htmlFor={"gender"} className={"label"}>{gender}</label>
                        </div>
                    ))}
                </div>
                <label htmlFor={"state"} className={"label"}>State of Residence</label>
                {/* todo: fix default value to be placeholder, right now default is Alabama but isn't recorded */}
                <select id={"state"} defaultValue="Select an option" className="select" onChange={(e) => setState(e.target.value)}
                        required>
                    {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
                <button className={"btn btn-primary mt-4"} type={"submit"}>Submit</button>
            </fieldset>
        </form>
    )
}