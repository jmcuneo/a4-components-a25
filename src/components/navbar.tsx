import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export default async function Navbar() {
    const session = await auth0.getSession();

    return (
        <nav className="navbar bg-base-300 px-4">
            <div className="navbar-start">
                <a className="label text-xl text-black dark:text-white font-bold">My CRUD App</a>
            </div>
            <div className={"navbar-center"}>
                <Link href={"/"}>
                    <button className={"btn btn-ghost"}>My Info</button>
                </Link>
                <Link href={"/enter-data"}>
                    <button className={"btn btn-ghost"}>Enter Data</button>
                </Link>
            </div>
            <div className="navbar-end">
                {!session ? <a href={"auth/login"} className="btn btn-primary">Login</a> : <a href={"auth/logout"} className="btn btn-primary">Logout</a>}
            </div>
        </nav>
    );
}