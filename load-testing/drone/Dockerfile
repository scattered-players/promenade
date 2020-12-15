FROM node:14

# Create app directory
WORKDIR /usr/src/drone

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=$(uname -m)] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
      libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
      libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
      libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
      libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
      libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 \
      lsb-release xdg-utils google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei \
      fonts-thai-tlwg fonts-kacst fonts-freefont-ttf x11vnc xvfb fluxbox wmctrl x11-utils \
      ffmpeg sudo net-tools \
    && wget  --no-check-certificate https://yt-dl.org/latest/youtube-dl -O /usr/local/bin/youtube-dl \
    && chmod a+x /usr/local/bin/youtube-dl

# RUN LC_ALL=en_US.UTF-8 /usr/local/bin/youtube-dl \
#       -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio' \
#       --merge-output-format mp4 \
#       --output webcam-mock.mp4 \
#       https://www.youtube.com/watch?v=KQaIa2V22EA \
#     && ffmpeg -i webcam-mock.mp4 -an webcam-mock.mjpeg \
#     && ffmpeg -i webcam-mock.mp4 webcam-mock.wav \
#     && rm webcam-mock.mp4

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install dependencies needed for production
RUN npm install --only=production

COPY . .

EXPOSE 5000
EXPOSE 80
CMD [ "./doitall.sh" ]