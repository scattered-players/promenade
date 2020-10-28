#!/bin/bash -ex

ffmpeg -f avfoundation -re -r 30 -i "Cam Link 4K #2" -an -c:v h264_videotoolbox -pix_fmt yuv420p -vf scale=1280:720 -b:v 1M -f rtp rtp://janus.brokenmirrors.services:6004