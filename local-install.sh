#!/bin/bash -ex

cd show-service;
rm -rdf node_modules && npm install &
cd ..;

cd show-app;
rm -rdf node_modules && npm install &
cd ..;

wait
echo 'DONE';