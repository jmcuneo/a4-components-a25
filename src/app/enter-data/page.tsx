import PersonalInfo from "@/components/personalinfo";
import {Metadata} from "next";
import {auth0} from "@/lib/auth0";
import Warning from "@/components/warning";

export const metadata: Metadata = {
    title: 'Enter Data',
    description: 'Enter your personal data to get started',
}

export default async function Page() {
    const session = await auth0.getSession()

    return (
        <div className={"flex justify-center align-baseline gap-4 mt-10"}>
            {session ? <PersonalInfo/> : <Warning message={"Please log in to enter your data!"}/>}
        </div>
    );
}