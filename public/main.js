document.addEventListener('DOMContentLoaded', function() {
    // --- AUTH LOGIC ---
    let currentUser = null;

    // Add login form dynamically if not present
    function showLoginForm() {
        document.body.innerHTML = `
            <main class="container">
                <section class="form-section">
                    <h2>To-Do App Login Page: A2-AlexLi</h2>
                    <p style="margin-bottom:1rem;color:#555;">
                        To login or register, just enter your username and password and press the button below. If the username does not exist, an account will be created for you.
                    </p>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="login_username">Username:</label>
                            <input type="text" id="login_username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="login_password">Password:</label>
                            <input type="password" id="login_password" name="password" required>
                        </div>
                        <button type="submit" class="btn-primary btn btn-success">Login / Register</button>
                    </form>
                    <div id="loginMsg" style="color:red;margin-top:1rem;"></div>
                </section>
            </main>
        `;
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('login_username').value;
            const password = document.getElementById('login_password').value;
            try {
                const res = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('username', username);
                    location.reload();
                } else {
                    document.getElementById('loginMsg').textContent = data.error || 'Login failed';
                }
            } catch (err) {
                document.getElementById('loginMsg').textContent = 'Login error';
            }
        });
    }

    // Add profile and logout buttons to header if logged in
    function addProfileAndLogoutButtons() {
        const header = document.querySelector('header nav');
        if (!header) return;

        // Add Profile button
        if (!document.getElementById('profileBtn')) {
            const profileBtn = document.createElement('button');
            profileBtn.textContent = 'Log Out';
            profileBtn.id = 'profileBtn';
            profileBtn.className = 'btn-secondary';
            profileBtn.style.marginLeft = '1rem';
            profileBtn.onclick = function() {
                // Remove username from localStorage and show login form
                localStorage.removeItem('username');
                showLoginForm();
            };
            header.appendChild(profileBtn);
        }
    }

    // Check login status
    async function checkAuth() {
        // Try to fetch tasks; if unauthorized, show login
        try {
            const resp = await fetch('/api/tasks', { credentials: 'include' });
            if (resp.status === 401) {
                showLoginForm();
                return false;
            }
            currentUser = localStorage.getItem('username');
            addProfileAndLogoutButtons();
            return true;
        } catch {
            showLoginForm();
            return false;
        }
    }

    // --- MAIN LOGIC ---
    (async function() {
        if (!(await checkAuth())) return;
        const taskForm = document.getElementById('taskForm');
        const taskList = document.getElementById('taskList');
        const tasksTableBody = document.getElementById('tasksTableBody');
        
        // Set default date to today
        const dateInput = document.getElementById('creation_date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }

        // Load tasks on page load
        loadTasks();

        let editMode = false;
        let editTaskId = null;

        // Helper to get the form (works for both pages)
        function getTaskForm() {
            return document.getElementById('taskForm');
        }

        // Helper to get form fields (works for both pages)
        function getFormFields() {
            const form = getTaskForm();
            if (!form) return {};
            return {
                task: form.querySelector('[name="task"]'),
                priority: form.querySelector('[name="priority"]'),
                creation_date: form.querySelector('[name="creation_date"]'),
                submitBtn: form.querySelector('button[type="submit"]'),
                cancelBtn: document.getElementById('cancelEditBtn')
            };
        }

        // Handle form submission
    let form = getTaskForm();
    if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const fields = getFormFields();
                const taskData = {
                    task: fields.task.value,
                    priority: fields.priority.value,
                    creation_date: fields.creation_date.value
                };

                try {
                    if (editMode && editTaskId !== null) {
                        // Edit existing task
                        const response = await fetch(`/api/tasks/${editTaskId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(taskData),
                            credentials: 'include'
                        });
                        if (response.ok) {
                            resetFormMode(); // Always close form first
                            await loadTasks(); // Then reload tasks
                        }
                    } else {
                        // Add new task
                        const response = await fetch('/api/tasks', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(taskData),
                            credentials: 'include'
                        });

                        if (response.ok) {
                            resetFormMode(); // Always close form after add
                            await loadTasks();
                        }
                    }
                } catch (error) {
                    console.error('Error adding/updating task:', error);
                }
            });

            // Cancel edit button (results page only)
            const fields = getFormFields();
            if (fields.cancelBtn) {
                fields.cancelBtn.addEventListener('click', function() {
                    resetFormMode();
                });
            }
        }

        // Check if we're on results page and force load
        if (window.location.pathname === '/results') {
            setTimeout(loadTasks, 100);
        }

        // Load and display tasks
        async function loadTasks() {
            try {
                const response = await fetch('/api/tasks', { credentials: 'include' });
                if (response.ok) {
                    const tasks = await response.json();
                    if (window.location.pathname === '/results') {
                        displayAllTasks(tasks);
                    } else {
                        displayRecentTasks(tasks);
                    }
                } else {
                    console.error('Failed to load tasks:', response.status);
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }

        // Display recent tasks on home page
        function displayRecentTasks(tasks) {
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<p>No tasks yet. Add your first task!</p>';
                return;
            }

            tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = `task-item task-priority-${task.priority}`;
                taskDiv.innerHTML = `
                    <strong>${task.task}</strong><br>
                    <small>Priority: ${task.priority.toUpperCase()} | Deadline: ${task.deadline}</small>
                `;
                taskList.appendChild(taskDiv);
            });
        }

        // Display all tasks in table
        function displayAllTasks(tasks) {
            if (!tasksTableBody) return; // Guard clause for results page
            tasksTableBody.innerHTML = '';
            if (tasks.length === 0) {
                const row = tasksTableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 5;
                cell.textContent = 'No tasks found';
                cell.style.textAlign = 'center';
                // Always hide form if not editing
                const form = getTaskForm();
                if (form && !editMode) form.style.display = 'none';
                return;
            }
            tasks.forEach(task => {
                const row = tasksTableBody.insertRow();
                row.innerHTML = `
                    <td>${task.task}</td>
                    <td><span class="priority-${task.priority}">${task.priority.toUpperCase()}</span></td>
                    <td>${task.creation_date}</td>
                    <td>${task.deadline}</td>
                    <td>
                        <button class="edit-btn" data-id="${task._id}">Edit</button>
                        <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                    </td>
                `;
            });
            // Attach edit event listeners
            const editButtons = tasksTableBody.querySelectorAll('.edit-btn');
            editButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = btn.getAttribute('data-id');
                    const task = tasks.find(t => String(t._id) === String(id));
                    const form = getTaskForm();
                    const fields = getFormFields();
                    if (task && form && fields.task && fields.priority && fields.creation_date) {
                        fields.task.value = task.task;
                        fields.priority.value = task.priority;
                        fields.creation_date.value = task.creation_date;
                        editMode = true;
                        editTaskId = String(task._id);
                        if (fields.submitBtn) fields.submitBtn.textContent = 'Update Task';
                        // Show form if on results page
                        if (window.location.pathname === '/results') {
                            form.style.display = '';
                            if (fields.cancelBtn) fields.cancelBtn.style.display = '';
                        }
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });
            // Always hide form if not editing
            const form = getTaskForm();
            if (form && !editMode) form.style.display = 'none';
        }

        function resetFormMode() {
            editMode = false;
            editTaskId = null;
            const form = getTaskForm();
            const fields = getFormFields();
            if (form) {
                form.reset();
                if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
                if (fields.submitBtn) fields.submitBtn.textContent = 'Add Task';
                // Hide form if on results page
                if (window.location.pathname === '/results') {
                    form.style.display = 'none';
                }
            }
        }

        // Delete task function (global scope for onclick)
        window.deleteTask = async function(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    const response = await fetch(`/api/tasks/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (response.ok) {
                        loadTasks();
                    } else {
                        alert('Error deleting task');
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                    alert('Error deleting task');
                }
            }
        };
    })();

    // Inject style for Profile button (btn-secondary)
    if (!document.getElementById('profileBtnStyle')) {
        const style = document.createElement('style');
        style.id = 'profileBtnStyle';
        style.textContent = `
            .btn-secondary {
                background: #fff;
                color: #514ba2ff;
                border: 2px solid #764ba2;
                border-radius: 5px;
                padding: 0.5rem 1.2rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s, color 0.2s;
            }
            .btn-secondary:hover {
                background: #764ba2;
                color: #fff;
            }
        `;
        document.head.appendChild(style);
    }
});
