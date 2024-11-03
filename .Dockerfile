# Specify a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy `package.json` and `package-lock.json` files to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
