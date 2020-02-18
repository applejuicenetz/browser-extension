#!/usr/bin/env bash

rm appleJuice-link-catcher.*

# Chrome Web Store
zip -r \
    --exclude *.git* \
    --exclude *.idea* \
    --exclude *.xpi \
    --exclude *.crx \
    --exclude *.zip \
    --exclude *.sh \
    -FS ./appleJuice-link-catcher.zip *

# Firefox
cp ./appleJuice-link-catcher.zip ./appleJuice-link-catcher.xpi