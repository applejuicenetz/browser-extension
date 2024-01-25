const catcher = {
    onClicked: async function (info) {
        let links = info.linkUrl.match(/ajfsp\:\/\/file\|([^|]*)\|([a-z0-9]{32})\|([0-9]*)\//g);

        if (!links || 0 === links.length) {
            catcher.notification(chrome.i18n.getMessage('linkNotValidTitle'), info.linkUrl);
            return;
        }

        chrome.storage.sync.get(null, config => {
            if (!config || 0 === Object.keys(config).length) {
                catcher.notification(
                    chrome.i18n.getMessage('missingConfigurationTitle'),
                    chrome.i18n.getMessage('missingConfigurationText'),
                    'config_error'
                );

                chrome.runtime.openOptionsPage();

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

    requestImplicit: async function (ajfsp, config) {
        let params = {
            host: config['host'] + ':' + config['port'],
            cpass: md5(config['password']),
            ajfsp_link: ajfsp
        };

        let url = new URL(config['phpgui']);
        url.pathname = 'main/top.php';

        try {
            let result = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: (new URLSearchParams(params)).toString()
            });

            let body = await result.text();
            catcher.handleResult(body, ajfsp);
        } catch (e) {
            catcher.notification('phpGUI connection error', error.toString(), 'config_error');
            chrome.runtime.openOptionsPage();
        }
    },

    requestDirect: async function (ajfsp, config) {
        let params = {
            link: ajfsp,
            password: md5(config['password'])
        };

        let url = new URL(config['host']);
        url.pathname = '/function/processlink';
        url.port = config['port'];
        url.search = new URLSearchParams(params).toString();

        try {
            let result = await fetch(url);
            let body = await result.text();

            catcher.handleResult(body, ajfsp);
        } catch (e) {
            catcher.notification('Core connection error', e.toString(), 'config_error');
            chrome.runtime.openOptionsPage();
        }
    },

    handleResult: function (result, link) {
        if (result.match('wrong password. access denied')) {
            catcher.notification(
                chrome.i18n.getMessage('coreWrongPasswordTitle'),
                chrome.i18n.getMessage('coreWrongPasswordText'),
                'config_error'
            );
            chrome.runtime.openOptionsPage();
            return;
        }

        if ('ok' === result || result.match(/newlinkinfo(.*)ok/)) {
            catcher.notification(chrome.i18n.getMessage('linkCatchedSuccessTitle'), link.split('|')[1]);
        } else if (result.match(/already downloaded/)) {
            catcher.notification('already downloaded', link.split('|')[1]);
        } else {
            catcher.notification(chrome.i18n.getMessage('linkCatchedErrorTitle'), link.split('|')[1]);
        }
    },

    notification: function (title, text, id) {
        chrome.notifications.create(id, {
            type: 'basic',
            iconUrl: '/icons/apple256.png',
            title: title,
            message: text,
        });
    },
};

chrome.contextMenus.create({
    title: 'appleJuice Link Catcher',
    contexts: ['link'],
    id: 'ajfsp_catcher'
});

chrome.contextMenus.onClicked.addListener(catcher.onClicked);

chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.sync.get(null, config => {
        if (!config || 0 === Object.keys(config).length) {
            catcher.notification(
                chrome.i18n.getMessage('missingConfigurationTitle'),
                chrome.i18n.getMessage('missingConfigurationText'),
                'config_error'
            );
            chrome.runtime.openOptionsPage();
        }
    });
});

chrome.notifications.onClicked.addListener(function (notificationId) {
    if (notificationId === 'config_error') {
        chrome.runtime.openOptionsPage();
    }
});
