"use client";

// todo: change from csr to ssr
import axios from "axios";
import {useEffect, useState} from "react";

interface Data {
    firstName: string;
    lastName: string;
    dob: string;
    age: number;
    email: string;
    gender: string;
    state: string;
}

export default function Home() {
    const [data, setData] = useState<Data[] | null>(null);

    useEffect(() => {
        // todo: fix localhost to env variable
        axios.get("http://localhost:4242/api/table")
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleInputChange = (index: number, field: string, value: string) => {
        if (data) {
            const updatedData = [...data];
            // @ts-ignore
            updatedData[index][field] = value;
            setData(updatedData);
        }
    }

    const saveChanges = () => {
        console.log(data);
        // todo: fix localhost to env variable
        axios.post("http://localhost:4242/api/update", data)
            .then((response) => {
                console.log("Data updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating data:", error);
            });
    }

    console.log(data)

    return (
        <>
            <div className="overflow-x-auto">
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
                    {data ? data.map((entry: any, index: number) => (
                        <tr className={"hover:bg-base-300"} key={index}>
                            <td>{entry.email}</td>
                            <td>
                                <input
                                    className={"input w-full max-w-xs"}
                                    type={"text"}
                                    value={entry.firstName}
                                    onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                                />
                            </td>
                            <td>{entry.lastName}</td>
                            <td>{entry.gender}</td>
                            <td>{new Date(entry.dob).toLocaleDateString()}</td>
                            <td>{entry.age}</td>
                            <td>{entry.state}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={7}>Loading...</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className={"flex justify-end"}>
                <button className={"btn btn-primary m-4"} onClick={saveChanges}>Save Changes</button>
            </div>
        </>
    )
}