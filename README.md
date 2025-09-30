## a4-johndiamond

https://a4-johndiamond.onrender.com

Summary of changes vs. starter code (A2):
- Replaced the Node server with Express and kept the same API routes.
- Migrated the frontend to Vite + React. The UI is now a single React component that renders the form and task table, with inline editing for name and time.
- Integrated ViteExpress so a single Node process serves the React app in development (via Vite) and the built client in production.


Did the new tech help?
- Learning React and Vite was a learning curve, as well as modifying my existing application to use them instead. Moreover, converting my HTML to JSX was a little difficult. However, React's ability to modify the UI in real time made debugging faster. So if I was buidling an application from scratch, I would prefer to use React and Vite for the frontend instead of traditional HTML + JS.



AI Prompts: 
- Give me an example of how to setup a React project with Vite
- Explain vite.config.js
- Explain how App.jsx works
- Explain how to reorganize my old src folder into Vite’s structure
- Explain step by step how Vite handles API requests in dev vs production
- Show me how to add a Vite proxy so /api calls forward to Express
- Show me how to configure Express to serve React from the dist/ folder
- node:internal/modules/esm/resolve:853
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
-   (base) johndiamond@autoreg-4776138 a4-johndiamond % npm install
    npm ERR! code ETARGET
    npm ERR! notarget No matching version found for vite-express@^0.20.5.
    npm ERR! notarget In most cases you or one of your dependencies are requesting
    npm ERR! notarget a package version that doesn't exist.

- > a4-johndiamond@1.0.0 start
> NODE_ENV=production node server.improved.js

node:events:496
      throw er; // Unhandled 'error' event
      ^
Error: listen EADDRINUSE: address already in use :::3000
-   ==> Running build command 'npm run build'...
    > a4-johndiamond@1.0.0 build
    > vite build
    sh: 1: vite: not found
    ==> Build failed