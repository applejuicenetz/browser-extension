#!/usr/bin/env bash

rm appleJuice-link-catcher.*

zip -r \
    --exclude *.git* \
    --exclude *.idea* \
    --exclude *.xpi \
    --exclude *.crx \
    --exclude *.zip \
    --exclude *.sh \
    -FS ./appleJuice-link-catcher.zip *
