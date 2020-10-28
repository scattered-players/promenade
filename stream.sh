#!/bin/bash -ex

trap "trap -- SIGTERM && kill -- -$ && wait" SIGINT SIGTERM EXIT

# gst-launch-1.0 avfvideosrc capture-screen=true ! videoscale ! videoconvert ! video/x-raw,width=320,height=240  ! vp8enc target-bitrate=128000 ! rtpvp8pay ! udpsink host=janus.brokenmirrors.services port=6004
# gst-launch-1.0 avfvideosrc capture-screen=true ! video/x-raw,width=1280,height=720 ! videoscale ! videoconvert ! osxvideosink
# gst-launch-1.0 avfvideosrc device-index=0 ! osxvideosink

# gst-launch-1.0 avfvideosrc device-index=0 ! videoscale ! videoconvert ! video/x-raw,width=320,height=240 ! x264enc bitrate=128 ! rtph264pay ! udpsink host=janus.brokenmirrors.services port=6004

# gst-launch-1.0 \
#   avfvideosrc device-index=0  ! \
#     audioresample ! audio/x-raw,channels=1,rate=16000 ! \
#     opusenc bitrate=64000 ! \
#       rtpopuspay ! udpsink host=janus.brokenmirrors.services port=6002 \
#   videotestsrc ! \
#     video/x-raw,width=320,height=240,framerate=15/1 ! \
#     videoscale ! videorate ! videoconvert ! timeoverlay ! \
#     vp8enc target-bitrate=128000 error-resilient=1 ! \
#       rtpvp8pay ! udpsink host=janus.brokenmirrors.services port=6004

# gst-launch-1.0 \
#   audiotestsrc ! \
#     audioresample ! audio/x-raw,channels=1,rate=16000 ! \
#     opusenc bitrate=20000 ! \
#       rtpopuspay ! udpsink host=janus.brokenmirrors.services port=6002 \
#   avfvideosrc capture-screen=true ! \
#     video/x-raw,width=640,height=480,framerate=30/1 ! \
#     videoscale ! videorate ! videoconvert ! timeoverlay ! \
#     vp8enc target-bitrate=256000 error-resilient=1 ! \
#       rtpvp8pay ! udpsink host=janus.brokenmirrors.services port=6004

# ffmpeg -f avfoundation -i ":0" -acodec libopus -ab 48k -ac 1 -f rtp rtp://54.82.122.61:6002
# ffmpeg -f avfoundation -re -r 30 -i "FaceTime HD Camera" -an  -pix_fmt yuv420p -c:v libvpx -b:v 1M -f rtp rtp://54.82.122.61:6004
# ffmpeg -f avfoundation -re -r 30 -i "Cam Link 4K" -an -c:v libvpx -pix_fmt yuv420p -vf scale=1280:720 -b:v 512K -f rtp rtp://54.82.122.61:6004
# ffmpeg -f avfoundation -re -r 10 -i "Capture screen 0" -an -c:v libvpx -pix_fmt yuv420p -vf scale=640:480 -b:v 512K -f rtp rtp://54.82.122.61:6004



# ffmpeg -f avfoundation -re -r 10 -i "Capture screen 0" -an -c:v libvpx -pix_fmt yuv420p -vf scale=640:480 -b:v 512K -f rtp rtp://54.82.122.61:6004 &
# ffmpeg -f avfoundation -i ":0" -vn -acodec libopus -ab 48k -ac 1 -f rtp rtp://54.82.122.61:6002 &

# wait 

ffmpeg -f avfoundation -re -r 15 -i "Capture screen 0" -an -c:v h264_videotoolbox -pix_fmt yuv420p -vf scale=1280:720 -b:v 1M -f rtp rtp://janus.brokenmirrors.services:6004 &
ffmpeg -f avfoundation -i ":0" -vn -acodec libopus -ab 48k -ac 1 -f rtp rtp://janus.brokenmirrors.services:6002 &

wait 