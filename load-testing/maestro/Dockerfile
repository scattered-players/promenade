FROM node:12

# Create app directory
WORKDIR /usr/src/maestro

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install dependencies needed for production
RUN npm install --only=production

COPY . .

EXPOSE 5000
EXPOSE 80
CMD [ "npm", "start" ]