// Authentication state
let currentUser = null;

// Authentication functions
const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        if (response.ok) {
            currentUser = username;
            document.getElementById('userDisplay').textContent = `Welcome, ${username}! Please hit Home to add tasks, or hit View All Tasks to see all previous tasks!`;
            document.getElementById('logoutBtn').style.display = 'inline';
            
            // Instead of reloading the page, initialize the React app
            const root = document.getElementById('react-root');
            if (root) {
                // Clear the login form
                root.innerHTML = '';
                
                // Import and render the React app
                import('./components/App').then(module => {
                    const App = module.default;
                    import('react-dom/client').then(ReactDOM => {
                        const { createRoot } = ReactDOM;
                        const reactRoot = createRoot(root);
                        reactRoot.render(React.createElement(App));
                    });
                });
            }
            return true;
        }
        const data = await response.json();
        document.getElementById('loginMsg').textContent = data.error || 'Login failed';
        return false;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loginMsg').textContent = 'An error occurred';
        return false;
    }
};

const showLoginForm = () => {
    const root = document.getElementById('react-root');
    if (root) {
        // Create a login form container that doesn't replace the React root
        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-container';
        loginContainer.innerHTML = `
            <main class="container">
                <section class="form-section">
                    <h2>To-Do App Login Page: A4-AlexLi</h2>
                    <p style="margin-bottom:1rem;color:#555;">
                        To login or register, just enter your username and password and press the button below. If the username does not exist, an account will be created for you.

                        After logging in, you can add tasks through clicking 'Home' and view all your previous tasks by clicking 'View All Tasks'.
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
        
        // Clear the root and append the login container
        root.innerHTML = '';
        root.appendChild(loginContainer);
        
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
};

const addProfileAndLogoutButtons = () => {
    const header = document.querySelector('header nav');
    if (!header) return;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = 'inline';
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/logout', { method: 'POST' });
                currentUser = null;
                showLoginForm();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
};

const checkAuth = async () => {
    try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
            console.log('Successfully authenticated');
            addProfileAndLogoutButtons();
            return true;
        }
        throw new Error('Not authenticated');
    } catch (error) {
        console.log('Authentication failed:', error);
        showLoginForm();
        return false;
    }
};

export { showLoginForm, addProfileAndLogoutButtons, checkAuth };