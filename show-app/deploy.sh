#!/bin/bash -ex

cd actor;
npm i && npm run dist &
cd ..;

cd admin;
npm i && npm run dist &
cd ..;

cd attendee;
npm i && npm run dist &
cd ..;

cd host;
npm i && npm run dist &
cd ..;

rm -fdr dist
mkdir -p dist/{actor,admin,attendee,host,login,tickets}
# cp -R root/* dist/
# cp how.md dist/how.md
# cp -R janus-demos dist/janus-demos
# cp -r login/* dist/login &
wait

cp -r actor/dist/* dist/actor &
cp -r admin/dist/* dist/admin &
cp -r attendee/dist/* dist/attendee &
cp -r host/dist/* dist/host &
wait

aws s3 sync ./dist s3://mirrors.show

echo 'DONE!'
