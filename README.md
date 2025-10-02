Assignment 4 - Components
===

### Web Application Title: Workout Log (Production)

Rohan Gladson Render Website: https://a4-rohangladson.onrender.com/

### Brief Project Summary 

## **- What was done, and what changes/additions were made from Assignment 3:**


After my completion of Assignment 4, that main concept of this assignment contrasted pretty heavily from the work we had done for assignment 3. In that for assignment 3 we tackled creating and modifying a client portal which relied on having static HTML, CSS, JavaScript programming, while also implementing an authentication format for users. Now if you look at what I have for assignment 4, while there are some similar visuals, with noticeable differences, the main difference comes with this assignment’s approach, is that I used a React environment, which was built with Vite. Specifically, instead of having the approach that we had in assignment 3, where we focused on modifying and making changes to the DOM directly, with React, the approach changed to now being to break the workout log into small React parts, that share data using props and keep track of updates with state. The benefit that came with using this using this modified approach, was that allowed for me to implement a dedicated API utility file (api.ts), in which I had it where the communication between a client and the server was easier to maintain. Ultimately, the main structure of what I have done for assignment 4, still shares the same structure as the previous assignment, as I still have the GitHub OAuth flow form, but the main difference now being the integration of a new React client workflow.


## **- Did the new technology improve or hinder the development experience?**
When it came to using the new technology, I would argue that as an overall tool, it did improve the quality of the work to an extent. When you compare the work we did for assignment 3, you can see the noticeable differences as far as quality goes, because in assignment 3, we used DOM updates, which at times would result in errors at a consistent rate. Whereas if you look at the way that we used React, you can see that its use of state meant the UI updated automatically as workouts were changed or gotten rid off.


With that being said, I would say that, as overall experience, I would say it was hindered. This more so came in several areas, with one of the notable ones being the process in which we had to set up the build system with Vite. What I mean by this, is that if you compared the process in which assignment 3 was handled, it was a lot more approachable, given that everything lived in a simple HTML/JS/CSS structure. With this being my first real usage of React, the process of having to organize my application into components and use **npm run build** to create files at times presented confusing points between what I had set up locally versus what I had to set up for Render.

If anything, the Render part of this assignment presented the most issues, given repeated trial and error, not because the type of error was large, it was that when a small error came and went, a new one would take its place. It's similar to point above, in that with assignment 3, I would say that deployment was pretty straightforward, whereas with assignment 4, we had to simultaneously make sure that the server not only served the **client/dist** build, but also be able to handle Reacts SPA routing properly. Because of this, there were a fair amount of instances where the errors in path matching led to failed builds and “missing route” errors, leading to continuous changes in server.js.

If anything, I believe if I continue to use and practice React a bit more than this assignment alone, I think the hindrances that I came across with this assignment, should not present the same problems again in the future.


