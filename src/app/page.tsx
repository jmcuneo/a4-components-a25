import PersonalInfo from "@/components/personalinfo";
import ContactInfo from "@/components/contactinfo";

export default function Page() {
    return (
        <div className={"flex justify-center align-baseline gap-4"}>
            <PersonalInfo />
            <ContactInfo />
        </div>
    );
}