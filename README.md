# Coffee Shop Ordering App (React Components)

**Render link:** [a4-components-a25-kyra.onrender.com](https://a4-components-a25-kyra.onrender.com/)  

---

## Summary

This project re-implements my Assignment 3 coffee shop ordering system using **React components**. The application allows users to create accounts, log in, and place coffee and food orders. Orders are displayed in a dynamic table where users can **edit** or **delete** their submissions. All data is stored and retrieved from the backend through API calls.  

The main changes from Assignment 3 include splitting the UI into reusable React components and managing state with React hooks. Features such as editing an order now are split up into start edit and save edit, or an order open inline input fields, and form elements are controlled components that track user input live.

---

## Development Reflection
- Did the new technology improve or hinder the development experience?

I've used React before and overall I think using React immproved the development expereince.

Using React significantly improved the development experience compared to plain HTML + vanilla JS in Assignment 3. With React’s state management and declarative rendering:  

- I no longer had to manually manipulate the DOM when editing or updating rows—React re-renders automatically when state changes.  
- Code became more organized by splitting functionality into smaller components (e.g., `LoginForm`, `OrderForm`, `OrdersTable`).  
- The ability to use hooks like `useState` and `useEffect` made handling authentication and API data fetching much clearer since everything was stored in the react state and componenets just 'react' to one another to allow for logical flow and easy state handling.

While the learning curve of JSX and React’s component model required some adjustment, overall React streamlined the process and reduced boilerplate code.

I still kept a lot of the orignal components of my A3.  For example, I continued to use Tailwind using the CDN. I just had to change a few formatting things to .jsx.  I kept the same UI elements and styling, and the same baseline post and get request calls, I just changed them to work with React, and created an api() helper function to help handle the fetches.

It was not too difficult to implement, and seems more intuitive when working with it.

---

## AI Usage
For this assignment I used AI to help me understand the baseline componenets of React and how to go from my express server to using it with react componenets.  ChatGPT was also very helpful with debugging if something wasn't converted correctly, specfically in my return statement in my App.jsx for front end since it is a little different from my index.html file from A3.

Also used W3 Schools for reference:  https://www.w3schools.com/react/react_getstarted.asp

---

## How to Run Locally
`npm run dev`