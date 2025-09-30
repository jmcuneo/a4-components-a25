## Chat App

https://a4-jackrichard.onrender.com

I built this project based on my Assignment #2 submission for the 'chat app' with a global chat client.
I used Svelte to rewrite the UI component of the application, but the functionality itself is identical.

Svelte made the code significantly easier to read and understand. Before, there was HTML being generated in
the JS itself, to make the dynamically appearing elements load after the API responded. I was able to get
rid of that here, and use Svelte logic like effects and state to dynamically update the page without
writing any hard to follow logic or worrying about page updates. I wrote much less JS overall.

The biggest challenge was that the vite-express package didn't have a Svelte option when
creating the project, so I had to select React and manually change all references accordingly.