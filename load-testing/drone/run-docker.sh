#!/bin/bash

cat Dockerfile | time docker build -t shattered/drone:x86 -f- .

docker run --rm --privileged \
  --device=/dev/dri:/dev/dri \
  -p 5901:5900 \
  -e VNC_SERVER_PASSWORD=password \
  -e IS_HEADLESS=false \
  shattered/drone:x86 