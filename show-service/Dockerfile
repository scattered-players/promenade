FROM node:14

RUN apt-get update && apt-get install -y ffmpeg

# Create app directory
WORKDIR /usr/src/show-service

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install dependencies needed for production
RUN npm install --only=production

COPY . .

EXPOSE 1935
EXPOSE 9000
EXPOSE 9001
EXPOSE 5000
EXPOSE 80
EXPOSE 443
CMD [ "npm", "start" ]