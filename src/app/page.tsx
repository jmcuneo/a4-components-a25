const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
    "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin",
    "Wyoming"
];

export default function Page() {
    return (
        <div className={"flex justify-center align-baseline gap-8"}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="legend text-lg font-bold">Personal Information</legend>
                <label className={"label"}>First</label>
                <input type="text" className="input" placeholder={"John"}/>
                <label className={"label"}>Last</label>
                <input type="text" className="input" placeholder={"Doe"}/>
                <label className={"label"}>Date of Birth</label>
                <input type="date" className="input"/>
                <label className={"label"}>Preferred Gender</label>
                <div className={"flex flex-col gap-2 mb-2"}>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Male"/>
                        <label className={"label"}>Male</label>
                    </div>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Female"/>
                        <label className={"label"}>Female</label>
                    </div>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Non-binary"/>
                        <label className={"label"}>Non-binary</label>
                    </div>
                    <div className={"flex w-full gap-2"}>
                        <input type={"radio"} className={"radio"} name={"gender"} value="Prefer not to say/other}"/>
                        <label className={"label"}>Prefer not to say/Other</label>
                    </div>
                </div>
                <label className={"label"}>State of Residence</label>
                <select defaultValue="Select an option" className="select">
                    {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </fieldset>
            <fieldset className={"fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"}>
                <legend className={"legend text-lg font-bold"}>Contact</legend>
                <label className={"label"}>Email</label>
                <input type={"email"} className={"input"} placeholder={"example@gmail.com"}/>
                <label className={"label"}>Phone Number</label>
                <input type={"number"} className={"input"} maxLength={"10"} minLength={"10"}
                       placeholder={"(555) 555-5555"}/>
                <label className={"label"}>Additional comments</label>
                <textarea className={"textarea"}></textarea>
            </fieldset>
        </div>
    );
}