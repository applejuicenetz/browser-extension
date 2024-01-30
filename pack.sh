#!/usr/bin/env bash

set -e

# Cleanup
rm -f appleJuice-link-catcher-*
rm -f manifest.json

# Chromium
cp manifest-chromium.json manifest.json

zip -r \
  --exclude *.git* \
  --exclude *.idea* \
  --exclude appleJuice-link-catcher-* \
  --exclude manifest-*.json \
  --exclude *.sh \
  --exclude *.md \
  -FS ./appleJuice-link-catcher-chrome.zip *
rm -f manifest.json

# Mozilla
cp manifest-mozilla.json manifest.json

zip -r \
  --exclude *.git* \
  --exclude *.idea* \
  --exclude appleJuice-link-catcher-* \
  --exclude manifest-*.json \
  --exclude *.sh \
  --exclude *.md \
  -FS ./appleJuice-link-catcher-firefox.xpi *

rm -f manifest.json
