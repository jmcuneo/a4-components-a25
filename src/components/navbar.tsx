export default function Navbar() {
    return (
        <nav className="navbar bg-base-300 px-4">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">My CRUD App</a>
            </div>
            <div className="navbar-end">
                <button className="btn btn-primary">Login</button>
            </div>
        </nav>
    );
}