Assignment 4 - Components -- Ceci Herriman
===

## Movie Reviewer

My hosting link: https://a4-ceciherriman-components.onrender.com/ 

Premade user login and password: c, c

My project is a movie reviewer application which allows users to make, edit, delete, and view movie reviews they have made in the past. Users can log in or create an account and then view past reviews in a table and make more entries with an entry form. It mimics the functionality and design of my A3 assignment, with the majority of my work not affecting the frontend or underlying functionality of the application -- only how it operated and was structured. I used React, so I decided to switch my application to a one-page app, meaning that users cannot "go back" to the login screen after they have successfully logged in (you must refresh). Using React also means that the page updates in real time without needing to prompt the server. 

I changed my frontend to use React, meaning that I split my existing home page html into different components who each implemented different parts of my A3 frontend javascript. I also brought in my login page html to use within a "login" component. With React, I managed the state of the application with hooks such as useState() and useEffect(). Different components also passed functions and data to one another through props, as opposed to using shared functions. On the server, I did not have to change much. I needed to switch my method of importing, this time using "import" statements instead of "require". I also had to tweak the way my server started running. 

Did the new technology improve or hinder the development experience? 

Using React mostly improved my development experience because it made it easier for me to handle changes gracefully and render a variable amount of entry objects for my table. For example, using just Javacript + HTML to fetch data from other elements required me to save element IDs and manually store values in temporary variables, while with React, I could instead make a component with props, making references to its data much more streamlined and standardized. Additionally, with React's useEffect() and depdency array, I could have my entry table refresh automatically when something changed with the entries. This was much simpler and more reliable than having to call a JavaScript function to update the table every time a relevant API call was made.

To develop my project, I used Professor Cuneo's GitHub resources for React development. I also used W3 schools to refresh myself on topics like props and events. To get help with debugging my code, I used ChatGPT. 
