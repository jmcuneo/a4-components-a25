Assignment 4 - Components
===

## Tasker Website App

your hosting link e.g. http://a4-charlieroberts.glitch.me

### Overview:

Tasker is a website that allows user to track tasks they save and assign levels of importance to. The website has a main home page and a account user dashboard. The dashboard is unique to the user and can be signed in from the login page. Accounts can be made on the signup page. 

### Changes for React:

The main changes are the implementations of React components. The original website used a static html file for `public/dashboard.html` with JS located in folder `public/js/`. The user page implementing React was the user dashboard page. The new page design was organized as segments: (1) Navbar, (2) TaskForm, (3) TaskHandler, and (4) Dashboard. These were implemented as React Components and described below:
- `<Navbar />` from `navbar.jsx`: Creates the navigation bar on the top of the dashboard page. It includes the same content as the navbar on the home page, including links to anchored sections for Home, About, and Donors on the main page. 
- `<TaskForm />` from `task_form.jsx`: Create a form for submitting new tasks with text and a priority number. This component redirects form submissions to a handler function `onUpdate` that is specified upon using the component. 
- `<TaskHandler />` from `task_handler.jsx`: Creates a display of the user's tasks as it dynamically updates. Before rendering the display, this component also implements `<TaskForm />` to import the GUI for creating a task. This is so the form for creating tasks is presented before displaying the task table. 
-  `<Dashboard />` from `dashboard.jsx`: The main React component. This implements the entire user dashboard page. It parses the browser URL for the user's key for viewing the dashboard page. Using the key, the page talks to the server to get the user's name and list of tasks. This component renders the `<Navbar />, log-out functionality, and the general framework for this page. This component also prompts the user with their name and implements `<TaskHandler />` for handling task viewing and deleting/creating user tasks with the server.

### Consequences of React:

Using React was primarily only negative for the reason that it had to be implemented only partially. Half of the website is typical JS site and exists outside of a React project or bundler. This makes compiling and implementing JSX harder. 

Overall, the practice of React required slightly different thinking for using effects and states. However, React allows for more scalability since Components can be re-used. For example, the NavBar component could be used on every website page if the whole site did implement React. The modular-ness also benefits readability of code. 

Since only part of the website is React and not the whole website, this did make compiling the whole website more challenging. For this reason, the JSX had to be included on a single file under `dashboard.jsx` since import syntax could not be used outside of a Vite project. That JSX then had to be manually compiled into JS as `public/dashboard_react.js`. In practice you would not implement React this way, but was still a good exercise. In practice, you would likely make the whole website be a whole React project. 

