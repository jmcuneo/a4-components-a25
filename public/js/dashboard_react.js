const {
  useState,
  useEffect
} = React;
function Dashboard() {
  const [username, setUsername] = useState("no-name");
  const [userKey, setUserKey] = useState("");
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      const match = window.location.pathname.match(/\/dashboard-(.+)/);
      // check url validity
      if (!match) {
        return console.error("Invalid dashboard URL");
      }
      // good match; parse user key from url
      const key_value = match[1];
      setUserKey(key_value); // set key
      // try to get user info and user task info by api
      try {
        const response = await fetch(`/api/dashboard/${key_value}/users`);
        if (!response) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUsername(data.id);
      } catch (err) {
        console.error(err.message);
      }
      // try to get user tasks info by api
      try {
        const response = await fetch(`./api/dashboard/${key_value}/tasks`);
        if (!response) {
          throw new Error("Failed to fetch user's tasks");
        }
        const data = await response.json();
        // map API data to the state shape
        const formatted_tasks = data.map(task => ({
          priority: task.priority,
          taskText: task.text
        }));
        // insert into tasks
        setTasks(formatted_tasks);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUserData();
  }, []);

  // handles redirecting user to home page and flagging log out to server
  const logout = async function (event) {
    event.preventDefault();
    // parse json
    const json = {
      key: userKey
    };
    // parse json to body and push to server
    const body = JSON.stringify(json);
    // request POST to server
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });

    // handle response
    console.log(response);
    // redirect home
    window.location.href = "/#home";
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "1em"
    }
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-lg",
    onClick: logout,
    href: "/#home",
    role: "button"
  }, "Log Out \xBB"))), /*#__PURE__*/React.createElement("h1", null, "Hello ", username, ", "), /*#__PURE__*/React.createElement("p", null, "Here are your current tasks:"), /*#__PURE__*/React.createElement("h3", null, "Your tasks are below with designated priority"), /*#__PURE__*/React.createElement("p", null, "Tasks can be created with the menu below."), /*#__PURE__*/React.createElement(TaskHandler, {
    userKey: userKey,
    userTasks: tasks
  }));
}
function Navbar() {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
    className: "navbar navbar-expand-md navbar-dark fixed-top bg-dark"
  }, /*#__PURE__*/React.createElement("a", {
    className: "navbar-brand",
    target: "_blank",
    rel: "noopener noreferrer",
    href: "https://www.google.com/search?q=tasker&oq=Tasker+&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7Mg0IARAuGK8BGMcBGIAEMg0IAhAuGK8BGMcBGIAEMgcIAxAAGIAEMg0IBBAuGK8BGMcBGIAEMgoIBRAAGLEDGIAEMgcIBhAAGIAEMgcIBxAAGIAEMg0ICBAuGK8BGMcBGIAE0gEIMTMyOWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8"
  }, /*#__PURE__*/React.createElement("img", {
    style: {
      objectFit: "contain",
      width: "4em",
      borderRadius: "10px"
    },
    alt: "Tasker Logo",
    src: "./assets/tasker.png"
  })), /*#__PURE__*/React.createElement("button", {
    className: "navbar-toggler",
    type: "button",
    onClick: () => setOpen(!open),
    "aria-label": "Toggle Navigation"
  }, /*#__PURE__*/React.createElement("span", {
    className: "navbar-toggler-icon"
  })), /*#__PURE__*/React.createElement("div", {
    className: `collapse navbar-collapse ${open ? "show" : ""}`
  }, /*#__PURE__*/React.createElement("ul", {
    className: "navbar-nav mr-auto"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-link",
    href: "/#home"
  }, "Home ", /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, "(current)"))), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-link",
    href: "/#about"
  }, "About")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-link",
    href: "/#donors"
  }, "Donors")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2em"
    }
  }));
}
function TaskHandler({
  userKey,
  userTasks
}) {
  const [tasks, setTasks] = useState([]);
  // update tasks from params
  useEffect(() => {
    setTasks(userTasks);
  }, [userTasks]);

  // handle submitting task to server database
  const post_task = async function ({
    priority,
    taskText
  }) {
    const json = {
      // parse to json
      key: userKey,
      priority: priority,
      text: taskText
    };
    // parse json to body and push to server
    const body = JSON.stringify(json);
    // request POST to server
    const response = await fetch("/pushtasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });

    // add posted task
    setTasks(prevTasks => [...prevTasks, {
      priority: priority,
      taskText: taskText
    }]);
  };
  const remove_task = async function (task) {
    try {
      const response = await fetch("/rmtasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: userKey,
          priority: task.priority,
          text: task.taskText
        })
      });
      setTasks(prev => prev.filter(x => x !== task));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TaskForm, {
    onUpdate: post_task
  }), /*#__PURE__*/React.createElement("div", {
    id: "task-box"
  }, " ", tasks.map((task, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "row",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-sm-4"
  }, task.priority), /*#__PURE__*/React.createElement("div", {
    className: "col-sm-4"
  }, task.taskText), /*#__PURE__*/React.createElement("div", {
    className: "col-sm-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-block",
    style: {
      height: "2em"
    },
    onClick: () => remove_task(task)
  }, "Delete"))))));
}
function TaskForm({
  onUpdate
}) {
  const [priority, setPriority] = useState("");
  const [taskText, setTaskText] = useState("");
  const submit_task = event => {
    event.preventDefault();
    if (!priority || !taskText) {
      return;
    }

    // call update function
    onUpdate({
      priority,
      taskText
    });
    // clear form fields
    setPriority("");
    setTaskText("");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: "inputTask",
    className: "form-signup",
    onSubmit: submit_task,
    style: {
      marginBottom: "2em"
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "inputPriority",
    className: "sr-only"
  }, "Priority Number"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    id: "inputPriority",
    className: "form-control",
    placeholder: "Priority Number",
    required: true,
    value: priority,
    onChange: event => setPriority(event.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "inputText",
    className: "sr-only"
  }, "Write Task Here"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "inputText",
    className: "form-control",
    placeholder: "Write Task Here",
    required: true,
    value: taskText,
    onChange: event => setTaskText(event.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-lg btn-primary btn-block",
    style: {
      marginTop: "1em"
    },
    type: "submit"
  }, "Add Task")));
}

// load react environment
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(Dashboard, null));
