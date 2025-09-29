## Assignment 4 - To-Do Application w/ React components

Link: https://a4-alexli.onrender.com/

Goal of app: The goal of this project is a task manager, in which a user can set a task description, Priority of the task (High, Medium, Low), and set a creation date(Defaulted to the day of access). It means to help organize your life.

### React Implementation

For this assignment, I refactored the application to use React components, improving modularity and maintainability. Instead of using Vite as recommended, I implemented a custom setup with Webpack and Babel to bundle and transpile the React code. Overall, I found the new technology to improve the developer experience. I can see how if I were to scale up this project to be more complex with more components, react would definetly be the way to go.
#### Custom React Setup
- Used Webpack for bundling and build process
- Configured Babel for JSX and ES6+ transpilation
- Set up webpack-dev-server with proxying for API requests
- Maintained the Express backend separate from the React frontend

#### Component Structure
1. **App.jsx** - The main container component that manages state and API calls for the entire application.

2. **TaskForm.jsx** - A form component for adding new tasks, handling user input and validation.

3. **TaskList.jsx** - Renders the list of tasks and manages their display order.

4. **Task.jsx** - Individual task component handling the display and deletion of each task.

The components connect to the existing Express backend through fetch API calls, maintaining the same authentication system but integrating it with React's component lifecycle. This approach allowed me to add React incrementally without completely rebuilding the application architecture.

This custom setup provided more control over the build process compared to using Vite, though it required more configuration. The component-based architecture made the code more maintainable and easier to reason about, despite the additional setup complexity.
