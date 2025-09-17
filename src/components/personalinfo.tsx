'use client'
import {FormEvent, useState} from "react";
import axios from "axios";

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
    "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin",
    "Wyoming"
];

export default function PersonalInfo() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [state, setState] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios.post('/api/submit', {
            firstName,
            lastName,
            dob,
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
                <label className={"label"}>Date of Birth</label>
                <input type="date" className="input" onChange={(e) => setDob(e.target.value)} required/>
                <label className={"label"}>Preferred Gender</label>
                <div className={"flex flex-col gap-2 mb-2"}>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Male"
                               onChange={(e) => setGender(e.target.value)} required/>
                        <label className={"label"}>Male</label>
                    </div>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Female"
                               onChange={(e) => setGender(e.target.value)}/>
                        <label className={"label"}>Female</label>
                    </div>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Non-binary"
                               onChange={(e) => setGender(e.target.value)}/>
                        <label className={"label"}>Non-binary</label>
                    </div>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Prefer not to say/other}"
                               onChange={(e) => setGender(e.target.value)}/>
                        <label className={"label"}>Prefer not to say/Other</label>
                    </div>
                </div>
                <label className={"label"}>State of Residence</label>
                <select defaultValue="Select an option" className="select" onChange={(e) => setState(e.target.value)}
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