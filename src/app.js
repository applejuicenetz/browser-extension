const catcher = {
    onInstalled: function () {
        chrome.contextMenus.create({
            'title': 'Catch AJFSP',
            'contexts': ['link'],
            'id': 'ajfsp_catcher'
        });
    },

    onClicked: function (info, tab) {
        let link = info.linkUrl;

        if (0 === localStorage.length) {
            catcher.notification(
                chrome.i18n.getMessage('missingConfigurationTitle'),
                chrome.i18n.getMessage('missingConfigurationText')
            );
        }

        let coreUrl = localStorage['host'];
        let corePort = localStorage['port'];
        let corePass = localStorage['password'];

        coreUrl = coreUrl.lastIndexOf('/') === coreUrl.length - 1 ? coreUrl.substr(0, coreUrl.length - 1) : coreUrl;

        if (!link.match(/^ajfsp\:\/\/file\|(.*)\|([a-z0-9]{32})\|([0-9]*)\//)) {
            catcher.notification(
                chrome.i18n.getMessage('linkNotValidTitle'),
                link
            );

            return;
        }

        if (localStorage['mode'] === 'indirect') {
            let phpUrl = localStorage['phpgui'];
            phpUrl += (phpUrl.lastIndexOf('/') === phpUrl.length - 1 ? '' : '/');

            $.get(phpUrl, function () {
                $.post(phpUrl + 'main/index.php', {
                    ip: coreUrl,
                    port: corePort,
                    cpass: corePass
                }, function () {
                    $.get(phpUrl + 'main/top.php', {ajfsp_link: link}, catcher.showResult);
                });
            });
        } else {
            let url = coreUrl + ':' + corePort + '/function/processlink';
            let pass = CryptoJS.MD5(corePass);
            $.get(url, {link: link, password: pass.toString()}, catcher.showResult);
        }
    },

    showResult: function (result) {
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
