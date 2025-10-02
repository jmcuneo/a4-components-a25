A4 – Andreas Keating

Live site: https://api.render.com/deploy/srv-d3evfg49c44c73e8hoj0?key=wesCXpZm_to

Repo: https://github.com/AndreasKeating/a4-AndreasKeating-a25

What this project does:
Users can sign in and manage their own car entries.
Supports add, update, and delete for cars.
Results table shows model, year, mpg, and age (calculated automatically).
Table includes sorting, filtering, and data export to CSV/JSON.
Login/session handling carried over from A3.
Changes from A3
Replaced the old DOM/HTML pages with a React component UI on /app.
Add/Update/Delete forms are separate components.
Results table is rendered in React with live updates, sort/filter, and export.
Legacy page (/results.html) still works but is secondary.

Did React help?:
Yes. State + JSX made UI updates much easier than manual DOM code in A3. The only minor downside is needing Babel in the browser for this assignment; in a real project I’d precompile.

How to run locally:
Clone this repo and install dependencies:

npm install

Create a .env file in the project root with:

MONGODB_URI=<your MongoDB Atlas connection string>
COOKIE_SECRET=<any random string>


Start the server:

npm start


Open http://localhost:3000
.

Sign in with a username and password (a new account is created if it doesn’t exist).

Notes:
Each user’s data is private to their account.
Age of the car is derived on the server.
CSV/JSON export works on the filtered/sorted data.
Log out clears the session and returns to the login screen.