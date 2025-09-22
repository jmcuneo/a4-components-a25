import axios from "axios";
import {auth0} from "@/lib/auth0";
import {Metadata} from "next";
import {states} from "@/lib/states";
import {genders} from "@/lib/genders";

interface Data {
    firstName: string;
    lastName: string;
    dob: string;
    age: number;
    email: string;
    gender: string;
    state: string;
}

export const metadata: Metadata = {
    title: 'My Info',
    description: 'View and update your personal information',
}

export default async function Home() {
    // stores the authenticated user's data
    let data: Data | undefined = undefined;

    try {
        const session = await auth0.getSession();

        if (!session?.user?.email) {
            console.log("User not logged in. No email found in session.");
            return;
        }
        // todo: change localhost to env variable
        const res = await axios.get(`http://localhost:4242/api/my-info?email=${session?.user?.email}`);
        data = res.data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    const handleSubmit = async (formData: FormData) => {
        "use server";
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const gender = formData.get("gender") as string;
        const dob = formData.get("dob") as string;
        const state = formData.get("state") as string;
        try {
            // todo: change localhost to env variable
            axios.post('http://localhost:4242/api/update', {
                firstName,
                lastName,
                gender,
                dob,
                state,
                email: data?.email
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            // needed to prevent stale data after update
            // todo: change localhost to env variable, possible refactor
            const res = await axios.get(`http://localhost:4242/api/my-info?email=${data?.email}`);
            data = res.data;
        } catch (error) {
            if (error) {
                console.error("Error updating data:", error);
            } else {
                console.error("Unknown error updating data");
            }
        }
    }

    const handleDelete = async () => {
        "use server";
        try {
            axios.post('http://localhost:4242/api/delete', {
                email: data?.email
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            data = undefined;
        } catch (error) {
            if (error) {
                console.error("Error deleting data:", error);
            } else {
                console.error("Unknown error deleting data");
            }
        }
    }


    return (
        <>
            {/* todo: make table stretch entire page width */}
            <div className="hidden md:flex justify-center overflow-x-auto">
                <form action={handleSubmit}>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Preferred Gender</th>
                            <th>DOB</th>
                            <th>Age</th>
                            <th>State</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data ?
                            <tr className={"hover:bg-base-300"}>
                                <td>{data.email}</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={data.firstName}
                                        name={"firstName"}
                                        className="input input-ghost w-full max-w-xs"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={data.lastName}
                                        name={"lastName"}
                                        className="input input-ghost w-full max-w-xs"
                                    />
                                </td>
                                <td>
                                    <select defaultValue={data.gender} className={"select select-ghost"}
                                            name={"gender"}>
                                        {genders.map((gender) => (
                                            <option key={gender} value={gender}>{gender}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input type="date" defaultValue={data.dob?.slice(0, 10)}
                                           className={"input input-ghost"}
                                           name={"dob"}/>
                                </td>
                                <td>{data.age}</td>
                                <td>
                                    <select defaultValue={data.state} className={"select select-ghost"}
                                            name={"state"}>
                                        {states.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button className={"btn btn-soft btn-error"} onClick={handleDelete}>Delete</button>
                                </td>
                            </tr> :
                            <tr>
                                <td colSpan={7}>Please log in to see your data!</td>
                            </tr>}
                        {/* todo: fix bug where user with no data is told to log in */}
                        </tbody>
                    </table>
                    <div className={"flex justify-end"}>
                        <button className={"btn btn-primary m-4"}>Save Changes</button>
                    </div>
                </form>
            </div>
            <div className="gap-4 md:hidden">
                <form action={handleSubmit}>
                    <div tabIndex={0} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">Email</div>
                        <div className="collapse-content text-sm">
                            {data ? data.email : "Please log in to see your data!"}
                        </div>
                    </div>
                    <div tabIndex={1} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">First Name</div>
                        <div className="collapse-content text-sm">
                            <input
                                type="text"
                                defaultValue={data ? data.firstName : "Please log in to see your data!"}
                                name={"firstName"}
                                className="input input-ghost w-full max-w-xs"
                            />
                        </div>
                    </div>
                    <div tabIndex={2} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">Last Name</div>
                        <div className="collapse-content text-sm">
                            <input
                                type="text"
                                defaultValue={data ? data.lastName : "Please log in to see your data!"}
                                name={"lastName"}
                                className="input input-ghost w-full max-w-xs"
                            />
                        </div>
                    </div>
                    <div tabIndex={3} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">Preferred Gender</div>
                        <div className="collapse-content text-sm">
                            <select defaultValue={data ? data.gender : "Please log in to see your data!"}
                                    className={"select select-ghost"}
                                    name={"gender"}>
                                {genders.map((gender) => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div tabIndex={4} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">Date of Birth</div>
                        <div className="collapse-content text-sm">
                            <input type="date"
                                   defaultValue={data ? data.dob?.slice(0, 10) : "Please log in to see your data!"}
                                   className={"input input-ghost"}
                                   name={"dob"}/>
                        </div>
                    </div>
                    <div tabIndex={5} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">Age</div>
                        <div className="collapse-content text-sm">
                            {data ? data.age : "Please log in to see your data!"}
                        </div>
                    </div>
                    <div tabIndex={6} className="collapse collapse-open bg-base-100 border-base-300 border">
                        <div className="collapse-title font-semibold">State of Residence</div>
                        <div className="collapse-content text-sm">
                            <select defaultValue={data ? data.state : "Please log in to see your data!"}
                                    className={"select select-ghost"}
                                    name={"state"}>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={"flex justify-between"}>
                        <button className={"btn btn-primary m-4"} type={"submit"}>Save Changes</button>
                        <button className={"btn btn-soft btn-error m-4"} type={"button"} onClick={handleDelete}>Delete</button>
                    </div>
                </form>
            </div>
        </>
    )
}