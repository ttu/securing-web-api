# Step 1: Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your app's source code
COPY . .

# Step 6: Build the TypeScript app
RUN npm run build

# Step 7: Expose the port your app runs on
EXPOSE 3000

# Step 8: Define the command to run your app
# Assuming the output of the TypeScript build is in the 'dist' directory
CMD [ "node", "dist/app.js" ]