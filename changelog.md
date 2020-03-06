# Changelog
All notable changes to this project will be documented in this file.

## 2020-03-06 (2.1.5)
- correct definition of the port option; `CORE-XML-Port` instead of `Core-Port`

## 2020-03-02 (2.1.4)
- register always `contextMenus` and not only on installation
- add missing Add-On ID for `gecko` and `chrome.storage.sync` usage

## 2020-02-27 (2.1.2)
- handle promises with `async` and `await`

## 2020-02-26 (2.1.1)
- drop jQuery usage for http request and use native `window.fetch` instead [#2](/../../issues/2)

## 2020-02-25 (2.1.0)
- use `chrome.storage.sync` to sync settings across devices [#1](/../../issues/1)
- remove jQuery usage from options frame [#2](/../../issues/2)
- only request permission to entered Core URL _or_ phpGUI URL [#3](/../../issues/3)

## 2020-02-21 (2.0.2)
-  use `chrome.notifications` instead of html5 `Notification` to work with firefox

## 2020-02-18 (2.0.1)
-  remove useless `activeTab permissions

## 2020-01-24 (2.0.0)
- vcs import 
- make compatible to Firefox and other Chromium based Browser
- refactor options menu
- jQuery version bump from `1.7` to `3.4`
- refactor js structure for better understanding
- add `locales`
- handle multiple `ajfsp` links in one `<a>` Tag
- add compatibility for updated `phpGUI` (`host` param instead of ip/port)
- handle and show connection error on wrong Hosts
- handle and show `access denied` error


