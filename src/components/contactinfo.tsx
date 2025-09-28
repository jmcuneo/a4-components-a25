export default function ContactInfo() {
    return (
        <fieldset className={"fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"}>
            <legend className={"legend text-lg font-bold"}>Contact</legend>
            <label className={"label"}>Email</label>
            <input type={"email"} className={"input"} placeholder={"example@gmail.com"}/>
            <label className={"label"}>Phone Number</label>
            <input type={"number"} className={"input"} maxLength={10} minLength={10}
                   placeholder={"(555) 555-5555"}/>
            <label className={"label"}>Additional comments</label>
            <textarea className={"textarea"}></textarea>
        </fieldset>
    )
}