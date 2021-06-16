#!/usr/bin/env bash

grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g'
