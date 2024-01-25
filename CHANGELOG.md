# Changelog

## 2.2.2

- Erlaube Core Verbindung zu `localhost` ohne Passwort
- Erzwinge Passwort bei Verbindungen wenn nicht `localhost`
- öffne Optionen nach erst installation
- öffne Optionen nach update, sofern Erweiterung noch (immer) nicht konfiguriert ist
- öffne Optionen beim klick auf Benachrichtigung bei Fehlern

## 2.1.6

- Manifest v3 für Chromium

## 2.1.5

- Naming für `CORE-XML-Port` korrigiert, anstelle von `Core-Port`

## 2.1.4

- Das Kontextmenü (`contextMenus`) wird jetzt immer registriert (überlebt somit auch den Browser Neustart)

## 2.1.2

- Code Refactoring für Promises mittels `async` und `await`

## 2.1.1

- jQuery komplett entfernt und für HTTP-Requests auf `window.fetch` umgestellt [#2](/../../issues/2)

## 2.1.0

- benutze `chrome.storage.sync` zum speichern der Einstellungen [#1](/../../issues/1)
- die Benutzung von jQuery in den Optionen entfernt [#2](/../../issues/2)
- es wird nur noch nach einer Berechtigung für die eingegebene URL  _oder_ phpGUI URL erfragt [#3](/../../issues/3)

## 2.0.2

- benutze `chrome.notifications` anstelle von `Notification` (html5) für X-Browser Kompatibilität

## 2.0.1

- nicht benötigte `activeTab` Berechtigungsanfrage entfernt

## 2.0.0

- import der Version `1` ins VCS
- kompatibilität zu aktuellen Firefox/Mozilla und Chrome/Chromium Browsern hergestellt
- Optionen komplett neu geschrieben
- jQuery Update von `1.7` auf `3.4`
- Code Refactoring
- Übersetzung (`locales`) hinzugefügt
- verarbeite alle `ajfsp` links, welche in einem `<a>` Tag stehen (regex)
- kompatibilität zur `phpGUI:^0.26` hergestellt (`host` param instead of ip/port)
- verarbeite und zeige Verbindungsfehler bei falschen Core Host
- verarbeite und zeige `access denied` Fehler bei falschen Core Passwort


