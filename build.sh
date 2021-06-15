#!/usr/bin/env bash

cmp -s .orig_version .new_version
CMP=$?

if [ $CMP -eq 0 ]; then
  exit 0
fi

echo ${DOCKER_PASS} | docker login --username ${DOCKER_USER} --password-stdin

HASH=$(git rev-parse --short HEAD)

docker build \
  -t cloudokihub/apisuite-marketplace-extension:$HASH \
  -t cloudokihub/apisuite-marketplace-extension:latest .

docker push cloudokihub/apisuite-marketplace-extension:$HASH
docker push cloudokihub/apisuite-marketplace-extension:latest


if [ "$CIRCLE_BRANCH" = "main" ]; then
  VERSION=$(cat package.json | grep version | head -1 | awk -F ": " '{ print $2 }' | sed 's/[",]//g')

  docker build -t cloudokihub/apisuite-marketplace-extension:$VERSION .
  docker push cloudokihub/apisuite-marketplace-extension:$VERSION
fi
