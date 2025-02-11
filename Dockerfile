# Use an official Node.js runtime as a parent image
FROM node:20
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Bundle app source
COPY . .
# Expose the port your app runs on
EXPOSE 5050
# Define the command to run your app
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY 84mgi6myoudbww7
ENV PM2_SECRET_KEY x6m17guupnbtdoa

CMD ["pm2-runtime", "start", "index.js" ]
