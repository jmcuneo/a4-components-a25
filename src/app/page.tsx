import axios from "axios";
import {auth0} from "@/lib/auth0";
import {Metadata} from "next";
import {states} from "@/lib/states";
import {genders} from "@/lib/genders";
import Warning from "@/components/warning";

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

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || undefined;

    if (!backendUrl) {
        throw new Error("BACKEND_URL environment variable is not set");
    }

    try {
        const session = await auth0.getSession();

        // only make the request if the user is logged in, avoid an axios error
        if (session?.user?.email) {
            // todo: lol not secure anyone can call this endpoint if they know an email
            const res = await axios.get(`${backendUrl}/api/my-info?email=${session?.user?.email}`);
            data = res.data;
        } else {
            console.log("User not logged in. No email found in session.");
        }
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
            await axios.post(`${backendUrl}/api/update`, {
                firstName,
                lastName,
                gender,
                dob,
                state,
                email: data?.email
            });
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
            await axios.post(`${backendUrl}/api/delete`, {
                email: data?.email
            });
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
                {/* Makes React remount component after submission, prevents stale data */}
                {data ? <form action={handleSubmit} key={JSON.stringify(data)}>
                    <label className={"label p-4"}>
                        Click on a field to edit it. Press &quot;Save Changes&quot; to save.
                    </label>
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
                            <tr className={"hover:bg-base-300"}>
                                <td className={"hover:cursor-not-allowed"}>{data.email}</td>
                                <td>
                                    <label htmlFor={"firstName"} className={"sr-only"}>First Name</label>
                                    <input
                                        type="text"
                                        defaultValue={data.firstName}
                                        name={"firstName"}
                                        id={"firstName"}
                                        className="input input-ghost w-full max-w-xs"
                                    />
                                </td>
                                <td>
                                    <label htmlFor={"lastName"} className={"sr-only"}>Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue={data.lastName}
                                        name={"lastName"}
                                        id={"lastName"}
                                        className="input input-ghost w-full max-w-xs"
                                    />
                                </td>
                                <td>
                                    <label htmlFor={"gender"} className={"sr-only"}>Select preferred gender</label>
                                    <select defaultValue={data.gender} className={"select select-ghost"}
                                            name={"gender"} id={"gender"}>
                                        {genders.map((gender) => (
                                            <option key={gender} value={gender}>{gender}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <label htmlFor={"dob"} className={"sr-only"}>Date of Birth</label>
                                    <input type="date" defaultValue={data.dob?.slice(0, 10)}
                                           className={"input input-ghost"}
                                           name={"dob"}
                                           id={"dob"}
                                    />
                                </td>
                                <td className={"hover:cursor-not-allowed"}>{data.age}</td>
                                <td>
                                    <label htmlFor={"state"} className={"sr-only"}>Select state of residence</label>
                                    <select defaultValue={data.state} className={"select select-ghost"}
                                            name={"state"}
                                            id={"state"}

                                    >
                                        {states.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button className={"btn btn-soft btn-error"} formAction={handleDelete}>Delete
                                    </button>
                                </td>
                            </tr>
                            {/* todo: fix bug where user with no data is told to log in */}
                            </tbody>
                        </table>
                        <div className={"flex justify-end"}>
                            <button className={"btn btn-primary m-4"}>Save Changes</button>
                        </div>
                    </form> :
                    <div className={"flex justify-center align-baseline gap-4 mt-10"}>
                        <Warning message={"No data found. If you are logged in, please enter data."}/>
                    </div>
                }
            </div>
            {/* Mobile view */}
            <div className="gap-4 md:hidden">
                {/* Makes React remount component after submission, prevents stale data */}
                {data ? <form action={handleSubmit} key={JSON.stringify(data) + "-mobile"}>
                        <div tabIndex={0}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">Email</div>
                            <div className="collapse-content text-sm">
                                {data ? data.email : "Please log in to see your data!"}
                            </div>
                        </div>
                        <div tabIndex={1}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">First Name</div>
                            <div className="collapse-content text-sm">
                                <label htmlFor={"firstNameMobile"} className={"sr-only"}>First Name</label>
                                <input
                                    type="text"
                                    defaultValue={data ? data.firstName : "Please log in to see your data!"}
                                    name={"firstName"}
                                    id={"firstNameMobile"}
                                    className="input input-ghost w-full max-w-xs"
                                />
                            </div>
                        </div>
                        <div tabIndex={2}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">Last Name</div>
                            <div className="collapse-content text-sm">
                                <label htmlFor={"lastNameMobile"} className={"sr-only"}>Last Name</label>
                                <input
                                    type="text"
                                    defaultValue={data ? data.lastName : "Please log in to see your data!"}
                                    name={"lastName"}
                                    id={"lastNameMobile"}
                                    className="input input-ghost w-full max-w-xs"
                                />
                            </div>
                        </div>
                        <div tabIndex={3}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">Preferred Gender</div>
                            <div className="collapse-content text-sm">
                                <label htmlFor={"genderMobile"} className={"sr-only"}>Preferred Gender</label>
                                <select defaultValue={data ? data.gender : "Please log in to see your data!"}
                                        className={"select select-ghost"}
                                        id={"genderMobile"}
                                        name={"gender"}>
                                    {genders.map((gender) => (
                                        <option key={gender} value={gender}>{gender}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div tabIndex={4}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">Date of Birth</div>
                            <div className="collapse-content text-sm">
                                <label htmlFor={"dobMobile"} className={"sr-only"}>Date of Birth</label>
                                <input type="date"
                                       defaultValue={data ? data.dob?.slice(0, 10) : "Please log in to see your data!"}
                                       className={"input input-ghost"}
                                       id={"dobMobile"}
                                       name={"dob"}/>
                            </div>
                        </div>
                        <div tabIndex={5}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">Age</div>
                            <div className="collapse-content text-sm">
                                {data ? data.age : "Please log in to see your data!"}
                            </div>
                        </div>
                        <div tabIndex={6}
                             className="collapse collapse-open bg-base-100 border-base-300 border rounded-none">
                            <div className="collapse-title font-semibold">State of Residence</div>
                            <div className="collapse-content text-sm">
                                <label htmlFor={"stateMobile"} className={"sr-only"}>State of Residence</label>
                                <select defaultValue={data ? data.state : "Please log in to see your data!"}
                                        className={"select select-ghost"}
                                        id={"stateMobile"}
                                        name={"state"}>
                                    {states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={"flex justify-between"}>
                            <button className={"btn btn-soft btn-error m-4"}
                                    formAction={handleDelete}>Delete
                            </button>
                            <button className={"btn btn-primary m-4"} type={"submit"}>Save Changes</button>
                        </div>
                    </form> :
                    <div className={"flex justify-center align-baseline gap-4 mt-10"}>
                        <Warning message={"No data found. If you are logged in, please enter data."}/>
                    </div>
                }
            </div>
        </>
    )
}