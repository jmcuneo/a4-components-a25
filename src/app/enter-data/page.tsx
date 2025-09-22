import PersonalInfo from "@/components/personalinfo";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Enter Data',
    description: 'Enter your personal data to get started',
}

export default function Page() {
    return (
        <div className={"flex justify-center align-baseline gap-4 mt-10"}>
            <PersonalInfo />
        </div>
    );
}