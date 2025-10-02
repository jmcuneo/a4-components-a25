import { useState, useEffect } from 'react'
import './App.css'

function Header({user}) {
    return (
        <div className="header">
            <div id="userInfo">Signed in as {user}.</div>
            <form id="logout" method="post" action="/logout" style={{float: "right"}}>
                <button type="submit" id="logoutButton">Logout</button>
            </form>
            <h1>Watchlistify</h1>
            <p>
                A list for keeping track of all the shows and movies you've watched.
            </p>
        </div>
    )
}

function EntryForm({form, handleChange, handleSubmit}) {
    return (
        <div className="form">
            <form id="myForm" onSubmit={handleSubmit}>
                <label htmlFor="format">Format:</label>
                <select id="format" name="format" required value={form.format} onChange={handleChange}>
                    <option value="" disabled>Select</option>
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                    <option value="Drama">Drama</option>
                    <option value="Documentary">Documentary</option>
                </select>
                <br/>

                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" size="40" maxLength="70" required value={form.title} onChange={handleChange}/>

                <p style={{fontWeight: "bold"}}>Genre:</p>
                <div id="genre" onChange={handleChange}>
                    <input type="radio" id="action" name="genre" value="Action" required checked={form.genre === "Action"} onChange={handleChange}/>
                    <label htmlFor="action">Action</label> <br/>
                    <input type="radio" id="adventure" name="genre" value="Adventure" checked={form.genre === "Adventure"} onChange={handleChange}/>
                    <label htmlFor="adventure">Adventure</label> <br/>
                    <input type="radio" id="comedy" name="genre" value="Comedy" checked={form.genre === "Comedy"} onChange={handleChange}/>
                    <label htmlFor="comedy">Comedy</label> <br/>
                    <input type="radio" id="horror" name="genre" value="Horror" checked={form.genre === "Horror"} onChange={handleChange}/>
                    <label htmlFor="horror">Horror</label> <br/>
                    <input type="radio" id="thriller" name="genre" value="Thriller" checked={form.genre === "Thriller"} onChange={handleChange}/>
                    <label htmlFor="thriller">Thriller</label> <br/>
                    <input type="radio" id="mystery" name="genre" value="Mystery" checked={form.genre === "Mystery"} onChange={handleChange}/>
                    <label htmlFor="mystery">Mystery</label> <br/>
                    <input type="radio" id="romance" name="genre" value="Romance" checked={form.genre === "Romance"} onChange={handleChange}/>
                    <label htmlFor="romance">Romance</label> <br/>
                    <input type="radio" id="scifi" name="genre" value="Sci-Fi" checked={form.genre === "Sci-Fi"} onChange={handleChange}/>
                    <label htmlFor="scifi">Sci-Fi</label> <br/>
                    <input type="radio" id="historical" name="genre" value="Historical" checked={form.genre === "Historical"} onChange={handleChange}/>
                    <label htmlFor="historical">Historical</label>
                </div>

                <label htmlFor="rating">Rating:</label>
                <input type="number" id="rating" name="rating" min="1" max="10" value={form.rating} onChange={handleChange}/>
                <br/>
                <label htmlFor="watched">Episodes Watched:</label>
                <input type="number" id="watched" name="watched" min="0" max="300" required value={form.watched} onChange={handleChange}/>
                <br/>
                <label htmlFor="episodes">Total Episodes:</label>
                <input type="number" id="episodes" name="episodes" min="1" max="300" required value={form.episodes} onChange={handleChange}/>

                <br/>
                <button id="submitButton" type="submit">Submit</button>
            </form>
        </div>
    )
}

function Table({data, handleDelete, handleEdit}) {
    return (
        <div className="content">
            <h2>My List</h2>
            <p>
                To modify an entry, click on the cell you want to edit. <br/>
                To delete an entry, click on the corresponding delete button. <br/>
            </p>
            <table id="dataTable">
                <thead>
                <tr>
                    <th>Format</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Rating</th>
                    <th>Watched</th>
                    <th>Episodes</th>
                    <th>Progress</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item._id}>
                        <td contentEditable suppressContentEditableWarning onBlur={(e) => handleEdit(item._id, "format", e.currentTarget.textContent, item)}>{item.format}</td>
                        <td contentEditable suppressContentEditableWarning onBlur={(e) => handleEdit(item._id, "title", e.currentTarget.textContent, item)}>{item.title}</td>
                        <td contentEditable suppressContentEditableWarning onBlur={(e) => handleEdit(item._id, "genre", e.currentTarget.textContent, item)}>{item.genre}</td>
                        <td className="aligned" contentEditable suppressContentEditableWarning onBlur={(e) => handleEdit(item._id, "rating", e.currentTarget.textContent, item)}>{item.rating}</td>
                        <td className="aligned" contentEditable suppressContentEditableWarning onBlur={(e) => handleEdit(item._id, "watched", e.currentTarget.textContent, item)}>{item.watched}</td>
                        <td className="aligned" contentEditable suppressContentEditableWarning onBlur={(e) => handleEdit(item._id, "episodes", e.currentTarget.textContent, item)}>{item.episodes}</td>
                        <td className="aligned">{item.progress}</td>
                        <td><button className="deleteButton" onClick={() => handleDelete(item._id)}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

function Footer() {
    return (
        <div className="footer">
            <a href="mailto:cnngo@wpi.edu">Email</a>
            <a href="https://github.com/christinenngo">Github</a>
            <p>
                &copy; 2025 Christine Ngo
            </p>
        </div>
    )
}

function App() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);

    const [form, setForm] = useState({
        format: "",
        title: "",
        genre: "",
        rating: "",
        watched: "",
        episodes: "",
    });

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/user');
                const data = await response.json();
                if (data.authenticated) {
                    setUser(data.user?.username);
                }
            } catch (error) {
                console.log(error);
                setUser(null);
            }
        })();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }
        (async () => {
            try {
                const response = await fetch('/results');
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((form) => ({ ...form, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch( "/submit", {
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const newData = await fetch("/results").then(res => res.json());
            setData(newData);
            setForm({
                format: "",
                title: "",
                genre: "",
                rating: "",
                watched: "",
                episodes: "",
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch('/delete', {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id }),
            })

            if (response.ok) {
                setData((data) => data.filter((row) => row._id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = async (rowId, field, value, row) => {
        const data = {
            _id: rowId,
            field,
            newInfo: value,
            watched: field === "watched" ? value : row.watched,
            episodes: field === "episodes" ? value : row.episodes,
        };

        try {
            await fetch("/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const newData = await fetch("/results").then(res => res.json());
            setData(newData);
        } catch (error) {
            console.log("Failed to update:", error)
        }
    }

    if (!user) {
        return (
            <>
                <h2 id="userInfoLoggedOut">Signed out.</h2>
                <div className="login">
                    <div className="signIn">
                        <h1 id="loginHeader">Watchlistify</h1>
                        <div id="signInButton">
                            <a href="/auth/github" id="login" className="button">Login with GitHub</a>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="container">
            <Header user={user} />
            <EntryForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} />
            <Table data={data} handleDelete={handleDelete} handleEdit={handleEdit} />
            <Footer />
        </div>
    )
}

export default App
