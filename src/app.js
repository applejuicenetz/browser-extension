const catcher = {
    onInstalled: function () {
        chrome.contextMenus.create({
            'title': 'Catch AJFSP',
            'contexts': ['link'],
            'id': 'ajfsp_catcher'
        });
    },

    onClicked: function (info, tab) {
        if (0 === localStorage.length) {
            catcher.notification(
                chrome.i18n.getMessage('missingConfigurationTitle'),
                chrome.i18n.getMessage('missingConfigurationText')
            );
        }

        let links = info.linkUrl.match(/ajfsp\:\/\/file\|([^|]*)\|([a-z0-9]{32})\|([0-9]*)\//g);

        if (!links || 0 === links.length) {
            catcher.notification(chrome.i18n.getMessage('linkNotValidTitle'), info.linkUrl);
            return;
        }
        links.forEach(catcher.handleLink);
    },

    handleLink: function (ajfsp) {
        let coreUrl = localStorage['host'];
        coreUrl = coreUrl.lastIndexOf('/') === coreUrl.length - 1 ? coreUrl.substr(0, coreUrl.length - 1) : coreUrl;

        if (localStorage['mode'] === 'indirect') {
            let phpGUI = localStorage['phpgui'];
            phpGUI += (phpGUI.lastIndexOf('/') === phpGUI.length - 1 ? '' : '/');

            $.get(phpGUI, function () {
                $.post(phpGUI + 'main/index.php', {
                    ip: coreUrl,
                    port: localStorage['port'],
                    cpass: localStorage['password']
                }, function () {
                    $.get(phpGUI + 'main/top.php', {ajfsp_link: ajfsp}, function (result) {
                        catcher.showResult(result, ajfsp);
                    });
                });
            });
        } else {
            let url = coreUrl + ':' + localStorage['port'] + '/function/processlink';
            let pass = CryptoJS.MD5(localStorage['password']);
            $.get(url, {link: ajfsp, password: pass.toString()}, function (result) {
                catcher.showResult(result, ajfsp);
            });
        }
    },

    showResult: function (result, link) {
        if ($(result).find('#newlinkinfo').text().trim().match(/^Download\:(.*)ok$/) || result === 'ok') {
            catcher.notification(chrome.i18n.getMessage('linkCatchedSuccessTitle'), link.split('|')[1]);
        } else {
            catcher.notification(chrome.i18n.getMessage('linkCatchedErrorTitle'), link.split('|')[1]);
        }
    },

    notification: function (title, text) {
        let n = new Notification(title, {body: text, icon: 'icons/apple256.png'});
        setTimeout(n.close, 3000);
    },
};


chrome.contextMenus.onClicked.addListener(catcher.onClicked);

chrome.runtime.onInstalled.addListener(catcher.onInstalled);
