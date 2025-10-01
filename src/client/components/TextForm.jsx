import "./Theme.css";
import { useRef, useEffect, cloneElement } from "react";
import { useAuth } from '../contexts/AuthContext';

function TextForm({children, onSubmitSuccess}) {
    const formRef = useRef(null);
    const form = useRef(null);
    const canvasRef = useRef(null);
    const { currentUser, authenticated, checkAuthentication } = useAuth();
    
    useEffect( () => {
        if(formRef.current !== null) {
            form.current = formRef.current;
        }
    });

    useEffect(() => {
        if (authenticated && currentUser?.name && form.current) {
            const nameInput = form.current.querySelector('input[name="name"]');
            if (nameInput) {
                nameInput.value = currentUser.name;
            }
        }
    }, [authenticated, currentUser]);

    async function handleSubmit (event)  {
        event.preventDefault();
        
        if (!authenticated) {
            alert("Please login to submit your drawing.");
            return;
        }

        const form_data = new FormData(form.current);

        const data_url = canvasRef.current.toDataURL("image/jpeg");
        form_data.append("image", data_url);

        const data = Object.fromEntries(form_data.entries());
        const body = JSON.stringify(data);

        try {
            const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body
            });

            if (response.ok) {
                form.current.reset();
                clear_canvas_content();
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
            } else if (response.status === 401) {
                alert("Please login to submit your drawing.");
                checkAuthentication();
            } else {
                const error = await response.json();
                alert("Error: " + error.error);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Failed to submit drawing. Please try again.");
        }
    }

    function clear_canvas_content() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (!authenticated) {
        return null;
    }

    return (
        <div>
            <form onSubmit={handleSubmit} ref={formRef}>
                <label htmlFor="given_name" className="text-xl text-text-main-color">Enter your name here!*</label><br></br>
                <input type="text" name="name" placeholder="Enter your name!" id="given_name" className="bg-white border-2 border-dotted border-card-accent-color text-text-main-color"></input><br></br>
                <label htmlFor="birthday" className="text-xl text-text-main-color">Enter your birthday!*</label><br></br>
                <input type="date" name="birthday" className="bg-white border-2 border-dotted border-card-accent-color m-1 text-text-main-color" id="birthday"></input><br></br>
                <label className="text-xl text-text-main-color">Make a fun drawing!</label><br></br>
                {cloneElement(children, { canvasRef })}
                <button type="submit" className="bg-[#9EDDFF] m-2 text-text-main-color hover:bg-[#4a9eff] rounded-xl pt-2 pb-2 pl-5 pr-5">
                    submit
                </button>
            </form>
        </div>
    )
}
export default TextForm;