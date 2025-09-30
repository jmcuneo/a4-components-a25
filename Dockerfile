# Use a specific Node.js base image (e.g., node:20-alpine for a lightweight image)
FROM node:22-alpine

ENV PORT=3000
ENV RUN_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker's caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the code
RUN npm run build

# Expose the port your Express app listens on (default is often 3000)
EXPOSE ${PORT}

# Define the command to run your application
CMD ["npm", "run", "start"]