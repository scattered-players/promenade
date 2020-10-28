#!/bin/bash -ex

rm -rdf node_modules &

cd load-testing/drone
rm -rdf node_modules &

cd ../maestro
rm -rdf node_modules &

cd ../../show-service
rm -rdf node_modules &

cd ../show-app
rm -rdf node_modules dist &

cd ../shattered-space
rm -rdf node_modules dist &

wait