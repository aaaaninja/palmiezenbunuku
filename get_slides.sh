#!/usr/bin/env bash
set -eux

for i in {1..2000}; do
  [ $(curl "${1}${i}.jpg" -w '%{http_code}\n' -s -o "${2}/${i}.jpg") == 200 ]
done;
