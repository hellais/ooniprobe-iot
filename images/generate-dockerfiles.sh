#!/bin/bash
set -e

IMG_TAG='2.7.12-slim'
FROM_IMG_LIST=(raspberry-pi1,resin/raspberry-pi-python raspberry-pi2,resin/raspberry-pi2-python raspberry-pi3,resin/raspberrypi3-python raspberry-pi0,resin/raspberry-pi-python)
for el in ${FROM_IMG_LIST[@]};do
    PLATFORM=$(echo $el | cut -d , -f1)
    FROM_IMG=$(echo $el | cut -d , -f2)
    echo "* Creating $PLATFORM/Dockerfile"
    mkdir -p $PLATFORM
    # Ensure we don't delete /* in case $PLATFORM is not defined
    echo "  Deleting ./$PLATFORM/*"
    rm -rf ./$PLATFORM/*

    echo "FROM $FROM_IMG:$IMG_TAG" >> $PLATFORM/Dockerfile
    cat Dockerfile.partial >> $PLATFORM/Dockerfile
    cp ooniprobe.conf $PLATFORM/ooniprobe.conf
done
