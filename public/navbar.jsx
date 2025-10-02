import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    
    return (
        <div class="container">
            <div>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <a 
                        className="navbar-brand" 
                        target="_blank" 
                        ref="noopener noreferrer" 
                        href="https://www.google.com/search?q=tasker&oq=Tasker+&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7Mg0IARAuGK8BGMcBGIAEMg0IAhAuGK8BGMcBGIAEMgcIAxAAGIAEMg0IBBAuGK8BGMcBGIAEMgoIBRAAGLEDGIAEMgcIBhAAGIAEMgcIBxAAGIAEMg0ICBAuGK8BGMcBGIAE0gEIMTMyOWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8"
                    >
                        <img 
                            style={{ 
                                objectFit: "contain", 
                                width: "4em", 
                                borderRadius: "10px"
                            }}

                            alt="Tasker Logo" 
                            src="./assets/tasker.png"
                        />
                    </a>
                    <button 
                        className="navbar-toggler" 
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle Navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div 
                        className={`collapse navbar-collapse ${open ? "show" : ""}`}
                    >
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/#home">Home <span className="sr-only">(current)</span></a>
                            </li><li className="nav-item">
                                <a className="nav-link" href="/#about">About</a>
                            </li><li className="nav-item">
                                <a className="nav-link" href="/#donors">Donors</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div> 
            <div style={{padding:"2em"}}>
            </div>
        </div>
    )
}