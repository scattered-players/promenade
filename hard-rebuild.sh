#!/bin/bash -ex

rm -rdf node_modules package-lock.json yarn.lock &

cd load-testing/drone
rm -rdf node_modules package-lock.json yarn.lock &

cd ../maestro
rm -rdf node_modules package-lock.json yarn.lock &

cd ../../show-service
rm -rdf node_modules package-lock.json yarn.lock &

cd ../show-app
rm -rdf node_modules dist package-lock.json yarn.lock &

cd ../shattered-space
rm -rdf node_modules dist package-lock.json yarn.lock &

cd ..
wait

yarn

cd shattered-space
yarn run dist