const catcher = {
    onInstalled: function () {
        chrome.contextMenus.create({
            'title': 'appleJuice Link Catcher',
            'contexts': ['link'],
            'id': 'ajfsp_catcher'
        });
    },

    onClicked: function (info, tab) {
        chrome.storage.sync.get(null, function (config) {
            if (!config) {
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

            links.forEach(function (ajfsp) {
                catcher.handleLink(ajfsp, config);
            });
        });
    },

    handleLink: function (ajfsp, config) {
        let coreUrl = config['host'];
        coreUrl = coreUrl.endsWith('/') ? coreUrl.slice(0, -1) : coreUrl;

        if (config['mode'] === 'indirect') {
            let phpGUI = config['phpgui'];
            phpGUI += (phpGUI.endsWith('/') ? '' : '/');

            $.post(phpGUI + 'main/index.php', {
                host: coreUrl + ':' + config['port'], // new phpGUI version
                ip: coreUrl,
                port: config['port'],
                cpass: config['password']
            })
                .done(function (result) {
                    $.get(phpGUI + 'main/top.php', {ajfsp_link: ajfsp})
                        .done(function (result) {
                            catcher.handleResult(result, ajfsp);
                        })
                        .fail(function (xhr, status, error) {
                            catcher.notification('phpGUI connection error', status);
                        });
                })
                .fail(function (xhr, status, error) {
                    catcher.notification('phpGUI connection error', status);
                });
        } else {
            let url = coreUrl + ':' + config['port'] + '/function/processlink';
            let pass = CryptoJS.MD5(config['password']);
            $.get(url, {link: ajfsp, password: pass.toString()})
                .done(function (result) {
                    catcher.handleResult(result, ajfsp);
                })
                .fail(function (xhr, status, error) {
                    catcher.notification('Core connection error', status);
                });
        }
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
        } else {
            catcher.notification(chrome.i18n.getMessage('linkCatchedErrorTitle'), link.split('|')[1]);
        }
    },

    notification: function (title, text) {
        chrome.notifications.create('appleJuice', {
            type: 'basic',
            iconUrl: 'icons/apple256.png',
            title: title,
            message: text
        });
    },
};

chrome.contextMenus.onClicked.addListener(catcher.onClicked);

chrome.runtime.onInstalled.addListener(catcher.onInstalled);
