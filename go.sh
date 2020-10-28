#!/bin/bash -ex

trap "trap -- SIGTERM && kill -- -$ && wait" SIGINT SIGTERM EXIT

cd show-service
./local-db.sh &
npm run dev &

cd ../show-app
npm start &

wait