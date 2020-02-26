const catcher = {
    onInstalled: function () {
        chrome.contextMenus.create({
            'title': 'appleJuice Link Catcher',
            'contexts': ['link'],
            'id': 'ajfsp_catcher'
        });
    },

    onClicked: function (info) {
        chrome.storage.sync.get(null, config => {
            if (0 === Object.keys(config).length) {
                catcher.notification(
                    chrome.i18n.getMessage('missingConfigurationTitle'),
                    chrome.i18n.getMessage('missingConfigurationText')
                );
                return;
            }

            let links = info.linkUrl.match(/ajfsp\:\/\/file\|([^|]*)\|([a-z0-9]{32})\|([0-9]*)\//g);

            if (!links || 0 === links.length) {
                catcher.notification(chrome.i18n.getMessage('linkNotValidTitle'), info.linkUrl);
                return;
            }

            links.forEach(ajfsp => {
                if (config['mode'] === 'indirect') {
                    catcher.requestImplicit(ajfsp, config);
                } else {
                    catcher.requestDirect(ajfsp, config);
                }
            });
        });
    },

    requestImplicit: function (ajfsp, config) {
        let params = {
            host: config['host'] + ':' + config['port'],
            cpass: md5(config['password']),
            ajfsp_link: ajfsp
        };

        let url = new URL(config['phpgui']);
        url.pathname = 'main/top.php';

        window.fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: (new URLSearchParams(params)).toString()
        })
            .then(result => {
                result.text().then(data => {
                    catcher.handleResult(data, ajfsp);
                });
            })
            .catch(error => {
                catcher.notification('phpGUI connection error', error.toString());
            });
    },

    requestDirect: function (ajfsp, config) {
        let params = {
            link: ajfsp,
            password: md5(config['password'])
        };

        let url = new URL(config['host']);
        url.pathname = '/function/processlink';
        url.port = config['port'];
        url.search = new URLSearchParams(params).toString();

        window.fetch(url).then(result => {
            result.text().then(data => {
                catcher.handleResult(data, ajfsp);
            });
        }).catch(error => {
            console.log(error);
            catcher.notification('Core connection error', error.toString());
        });
    },

    handleResult: function (result, link) {
        if (result.match('wrong password. access denied')) {
            catcher.notification(
                chrome.i18n.getMessage('coreWrongPasswordTitle'),
                chrome.i18n.getMessage('coreWrongPasswordText')
            );
            return;
        }

        if ('ok' === result || result.match(/Download:(.*)ok/)) {
            catcher.notification(chrome.i18n.getMessage('linkCatchedSuccessTitle'), link.split('|')[1]);
        } else if (result.match(/already downloaded/)) {
            catcher.notification('already downloaded', link.split('|')[1]);
        } else {
            catcher.notification(chrome.i18n.getMessage('linkCatchedErrorTitle'), link.split('|')[1]);
        }
    },

    notification: function (title, text) {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'icons/apple256.png',
            title: title,
            message: text
        });
    },
};

chrome.contextMenus.onClicked.addListener(catcher.onClicked);

chrome.runtime.onInstalled.addListener(catcher.onInstalled);
