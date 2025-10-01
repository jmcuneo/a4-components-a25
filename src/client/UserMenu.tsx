import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const UserMenu: React.FC<{
    username: string | null;
    setUsername: (name: string | null) => void;
}> = ({ username, setUsername }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close menu if click is outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="ml-auto relative">
            <button
                ref={buttonRef}
                aria-label="User menu button"
                className="flex shadow items-center justify-center rounded-full bg-pink-200 h-[50px] w-[50px] hover:bg-pink-400"
                onClick={() => setMenuOpen(prev => !prev)}
            >
                <FontAwesomeIcon icon={faUser} className="text-pink-900 text-3xl" />
            </button>

            {menuOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border z-10"
                >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {username || "Guest"}
                    </div>
                    {username ? (
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-pink-600 hover:bg-pink-100"
                            onClick={() => setUsername(null)}
                        >
                            Log Out
                        </button>
                    ) : (
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-pink-600 hover:bg-pink-100"
                            onClick={() => {
                                const name = prompt("Enter your username:");
                                if (name) setUsername(name.trim());
                            }}
                        >
                            Log In
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserMenu;
