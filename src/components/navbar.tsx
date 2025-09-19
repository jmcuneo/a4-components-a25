import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="navbar bg-base-300 px-4">
            <div className="navbar-start">
                <a className="label text-xl text-white font-bold">My CRUD App</a>
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
                <button className="btn btn-primary">Login</button>
            </div>
        </nav>
    );
}