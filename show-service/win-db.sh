#!/bin/bash -ex

rm -fdr ~/data/db;
mkdir -p ~/data/db;
mongod --dbpath ~/data/db 