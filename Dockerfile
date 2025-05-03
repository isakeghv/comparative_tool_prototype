# Dockerfile

FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Build the Nuxt app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "dev"]
