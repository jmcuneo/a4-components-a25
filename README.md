## My CRUD App

Your hosting link e.g. https://a3-akaashwalker.vercel.app

Include a very brief summary of your project here and what you changed / added to assignment #3. Briefly (3–4 sentences) answer the following question: did the new technology improve or hinder the development experience?

### Summary
This application builds off of assignment #3, in which I used NextJS (A framework for React). Below is the summary of assignment #3: 

* the goal of the application is to allow users to store and modify their personal information such as their name, date of birth, preferred gender, and state of residence.
* Some of the challenges I faced:
    * Implementing OAuth authentication with the NextJS
    * Deploying the application on Vercel (Vercel is a serverless platform, which made it challenging to use with express, read more in the Achievements section)
    * Managing routing using NextJS's file-based routing system alongside Express routing
    * Rendering dynamic content while also using SSR (I've only used CSR in the past)
* Authentication method used: OAuth with Auth0
    * I chose to use Auth0 because I've used it in the past and also provided some bonus points for doing so. I also figured that the implementation would be fairly straightforward since I'm using NextJS. More about my experience with Auth0 in the Achievements section.
* CSS framework used: Tailwind CSS with DaisyUI components
    * I chose to use Tailwind since it allows me to quickly add styling, while DaisyUI provides pre-built components that are easy to customize.
* Express middleware used:
    * `auth0/nextjs-auth0` for OAuth authentication
    * `mongoose` for MongoDB object modeling
    * CORS middleware to handle cross-origin requests between NextJS frontend and Express backend

### My Opinion on React
Overall, React is a powerful JS library that allows for rapid and easier development of dynamic content. I learned React when I took SoftEng in D term 2025, and have also used it to build some personal project websites. It does have a learning curve, as hooks are tricky to understand and it can be tough to know when to use some certain hooks. Overall though, it's well-thought-out and has a host of features that make it powerful for building dynamic websites. There is a reason after all as to why it is the most popular JS library, even though options with less code or better performance exist. 

### My Opinion on NextJS
NextJS was the new framework that I wanted to learn since I already new React. I saw that it is one of the most popular React frameworks, alongside Gatsby. I specifically chose NextJS because I have also had experience with using Vercel, and I saw that the development experience is supposed to be relatively easy since Vercel are the ones who made NextJS. NextJS brings a lot of features that aren't available in standard React such as a built-in file based routing system and SSR. The built in router was nice, especially since it can easily allow you to see a visual "file" like structure of your app's routes. One thing I didn't like about the file based router was the file naming convention, as NextJS requires you to have specific names for the jsx files that are at the end of a route, such as "page.tsx". This makes it difficult to search for specific file names. The solution to this would be to search for the folders that these "page.tsx" files live in, but that also determines the name of the route. In some cases, I want a small route name but a descriptive file name. Another option (that I did do) was make a page out of components, those of which I could give descriptive file names to. Since most of the application logic would then live in these components, I didn't have to worry about searching for the specific "page.tsx" file that I wanted to edit. SSR was another interesting feature of NextJS that I played around with. SSR (also known as server side rendering) allows the server to pre-render the html for a given page and send it over to the client. Then, all the client has to "hydrate" the given HTML to turn it into a dynamic/interactive webpage. This has always interested me because I noticed that with some large webpages, load times can increase significantly depending on a number of factors. One caveat of using SSR is that you can't use hooks. The way I combated this was to create an interface with fields that I needed for my client, and passed that between my server and client. Overall, a very interesting learning experience. Of course at this scale and small of a website, the performance benefit of using SSR probably doesn't make my application any more responsive than standard CSR (client side rendering). 