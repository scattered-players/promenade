REM ffmpeg -f dshow -re -rtbufsize 1024M -i video="screen-capture-recorder" -an -c:v h264_nvenc -vf scale=640:480 -f rtp rtp://janus.brokenmirrors.services:6004
REM ffmpeg -f avfoundation -i ":0" -vn -acodec libopus -ab 48k -ac 1 -f rtp rtp://janus.brokenmirrors.services:6002 &
rm -f output.mp4 output.mkv
REM ffmpeg -f gdigrab -rtbufsize 128M -i desktop -an -c:v libx264 output.mp4
REM ffmpeg -f dshow -rtbufsize 1024M -i video="screen-capture-recorder":audio="Microphone (NVIDIA RTX Voice)" -c:v h264_nvenc -c:a libopus  output.mkv
REM ffmpeg -f dshow -rtbufsize 1024M -i video="screen-capture-recorder" -c:v h264_nvenc -pix_fmt yuv420p -vf scale=1280:720 -b:v 1M  output.mkv
REM ffmpeg -f dshow -rtbufsize 1024M -re -i video="screen-capture-recorder":audio="Microphone (NVIDIA RTX Voice)" ^
REM     -an -c:v h264_nvenc -pix_fmt yuv420p -vf scale=1920:1080 -b:v 4M -zerolatency 1 -preset fast -profile:v baseline -f rtp rtp://janus.brokenmirrors.services:6004 ^
REM     -vn -c:a libopus -ac 1 -b:a 64k -frame_duration 10 -application lowdelay -f rtp rtp://janus.brokenmirrors.services:6002


REM ffmpeg -framerate 30 -f dshow -rtbufsize 128M -re -i video="screen-capture-recorder":audio="Microphone (NVIDIA RTX Voice)" ^
REM     -an -c:v h264_nvenc -pix_fmt yuv420p -vf scale=1280:720 -b:v 256k -zerolatency 1 -preset fast -profile:v baseline -f rtp rtp://janus.brokenmirrors.services:6004 ^
REM     -vn -c:a libopus -b:a 64k -f rtp rtp://janus.brokenmirrors.services:6002

ffmpeg -framerate 30 -f dshow -rtbufsize 256M -re -i video="Cam Link 4K":audio="Microphone (NVIDIA RTX Voice)" ^
    -an -c:v h264_nvenc -pix_fmt yuv420p -vf scale=1280:720 -b:v 256k -zerolatency 1 -preset fast -profile:v baseline -f rtp rtp://janus.brokenmirrors.services:6004 ^
    -vn -c:a libopus -b:a 64k -f rtp rtp://janus.brokenmirrors.services:6002

REM ffmpeg -list_devices true -f dshow -i dummy

REM ffmpeg -framerate 30 -f dshow -rtbufsize 256M -re -i video="Cam Link 4K":audio="Microphone (NVIDIA RTX Voice)" ^
REM     -an -c:v libvpx -pix_fmt yuv420p -vf scale=1280:720 -b:v 256k -deadline realtime -f rtp rtp://janus.brokenmirrors.services:6004 ^
REM     -vn -c:a libopus -b:a 64k -f rtp rtp://janus.brokenmirrors.services:6002