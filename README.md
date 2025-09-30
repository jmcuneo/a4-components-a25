Assignment 4 - Components
===

Aditya Patel
live link : https://a4-adityapatel.onrender.com

Bucket Buddy (React Edition)

This is my updated web app called Bucket Buddy, re-implemented with React components. It lets users log in with GitHub, create bucket list items, view them, mark them completed, or delete them.

Compared to A3, I refactored the frontend into React. Instead of static HTML tables, the app now uses components to manage state and render updates dynamically. The backend still uses Express for the server and MongoDB Atlas for persistence. Styling is provided by Bootstrap.

**Technical Achievements**

**Tech Achievement 1**: React components

Added BucketForm, BucketList, and CompletedList under client/src/components/.

State is managed in App.jsx and passed as props to child components.

Items update live when added, completed, or deleted.

**Tech Achievement 2**: Express server with CRUD + sessions

Create, Read, Update, Delete routes built in Express (/results).

All routes protected by GitHub login (passport-github2).

Sessions stored in MongoDB using express-session + connect-mongo.

**Tech Achievement 3**: GitHub OAuth login

Handled via Passport.js.

Login/logout flow updates the frontend dynamically.

Design / Evaluation Achievements

**Design Achievement 1**: Bootstrap Styling

Used Bootstrap 5 for forms, tables, and buttons.

Navbar dynamically shows “Login” or “Logout.”

**Design Achievement 2**: Accessibility

Proper labels for all form inputs.

Semantic headings (h1, h2).

Meta viewport + description included.

**Design Achievement 3**: CRAP Principles

Contrast: Buttons use Bootstrap contextual colors.

Repetition: Consistent navbar, spacing, and fonts.

Alignment: Grid system aligns forms and tables.

Proximity: Inputs grouped with labels.

**Live Link**
https://a4-adityapatel.onrender.com

**Instructions**

Visit the site → redirected to login.html., Click “Sign in with GitHub.”
Use the form (React) to add a new bucket item. See active items under BucketList.Mark items completed or delete them. Completed items move into CompletedList. Logout via the navbar.