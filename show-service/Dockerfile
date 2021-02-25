FROM node:14-buster-slim

RUN apt-get update && apt-get install -y ffmpeg

# Create app directory
WORKDIR /usr/src/show-service

# Copy over package lists
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies needed for production
RUN yarn install --production=true

COPY . .

EXPOSE 1935
EXPOSE 9000
EXPOSE 9001
EXPOSE 5000
EXPOSE 80
EXPOSE 443
CMD [ "yarn", "start" ]