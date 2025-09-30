import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import UserMenu from "./UserMenu";

interface HeaderProps {
    username: string | null;
    setUsername: (name: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ username, setUsername }) => {
    return (
        <header className="relative h-16 bg-pink-300 shadow flex items-center justify-between px-6">
            <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-pink-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faHeart} className="text-pink-600" />
                Partner Bucket List
                <FontAwesomeIcon icon={faHeart} className="text-pink-600" />
            </div>
            <UserMenu username={username} setUsername={setUsername} />
        </header>
    );
};

export default Header;
