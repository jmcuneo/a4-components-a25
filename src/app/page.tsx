// todo: change from csr to ssr
import axios from "axios";
import {auth0} from "@/lib/auth0";

interface Data {
    firstName: string;
    lastName: string;
    dob: string;
    age: number;
    email: string;
    gender: string;
    state: string;
}

export default async function Home() {
    // stores the authenticated user's data
    let data: Data | undefined = undefined;
    try {
        const session = await auth0.getSession();
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
        try {
            axios.post('http://localhost:4242/api/update', {
                firstName,
                lastName,
                email: data?.email
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            // needed to prevent stale data after update
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

    return (
        <>
            <div className="overflow-x-auto">
                <form action={handleSubmit} >
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
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={data.lastName}
                                        name={"lastName"}
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                </td>
                                <td>{data.gender}</td>
                                <td>{new Date(data.dob).toLocaleDateString()}</td>
                                <td>{data.age}</td>
                                <td>{data.state}</td>
                            </tr> :
                            <tr>
                                <td colSpan={7}>Please log in to see your data!</td>
                            </tr>}
                        </tbody>
                    </table>
                    <div className={"flex justify-end"}>
                        <button className={"btn btn-primary m-4"}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )
}