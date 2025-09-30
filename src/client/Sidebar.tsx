import React from "react";

interface SidebarProps {
    checklists: { [name: string]: any[] };
    currentChecklist: string | null;
    setCurrentChecklist: (name: string) => void;
    setChecklists: React.Dispatch<React.SetStateAction<{ [name: string]: any[] }>>;
    effectiveUser: string;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             checklists,
                                             currentChecklist,
                                             setCurrentChecklist,
                                             setChecklists,
                                             effectiveUser,
                                         }) => {
    const addChecklist = async () => {
        if (effectiveUser === "guest") return alert("Please create a username first");
        const name = prompt("Enter checklist name:");
        if (!name) return;
        if (checklists[name]) return alert("Checklist already exists");

        try {
            const res = await fetch(`http://localhost:3000/api/checklists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, user: effectiveUser }),
            });
            const data = await res.json();
            setChecklists(prev => ({ ...prev, [data.name]: data.tasks }));
        } catch (err) {
            console.error("Failed to add checklist", err);
        }
    };

    return (
        <aside className="w-64 bg-pink-200 p-4 flex flex-col">
            <button
                className="mb-4 bg-pink-400 text-white rounded py-2 hover:bg-pink-500"
                onClick={addChecklist}
            >
                New Adventure!
            </button>
            <ul className="flex-1 overflow-y-auto space-y-2">
                {Object.keys(checklists).map(name => (
                    <li
                        key={name}
                        onClick={() => setCurrentChecklist(name)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                            name === currentChecklist ? "bg-pink-300 font-bold" : "hover:bg-pink-100"
                        }`}
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
