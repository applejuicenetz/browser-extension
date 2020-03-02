#!/usr/bin/env bash

set -e

# Cleanup
rm -f appleJuice-link-catcher-*
rm -f manifest.json

# Google Chrome
cp manifest-chrome.json manifest.json

zip -r \
  --exclude *.git* \
  --exclude *.idea* \
  --exclude appleJuice-link-catcher-* \
  --exclude manifest-*.json \
  --exclude *.sh \
  --exclude *.md \
  -FS ./appleJuice-link-catcher-chrome.zip *
rm -f manifest.json

# Mozilla Firefox
cp manifest-firefox.json manifest.json

zip -r \
  --exclude *.git* \
  --exclude *.idea* \
  --exclude appleJuice-link-catcher-* \
  --exclude manifest-*.json \
  --exclude *.sh \
  --exclude *.md \
  -FS ./appleJuice-link-catcher-firefox.xpi *

rm -f manifest.json
