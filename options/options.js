document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('input[name=mode][value=direct]').addEventListener('click', () => {
        document.querySelectorAll('.phpgui').forEach(el => el.style.display = 'none');
        document.querySelector('input[name=phpgui]').removeAttribute('required');
    });

    document.querySelector('input[name=mode][value=indirect]').addEventListener('click', () => {
        document.querySelectorAll('.phpgui').forEach(el => el.style.display = 'block');
        document.querySelector('input[name=phpgui]').setAttribute('required', 'required');
    });

    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();

        const mode = document.querySelector('input[name=mode]:checked').value;
        const host = document.querySelector('input[name=host]').value.trim();
        const port = document.querySelector('input[name=port]').value.trim();
        const password = document.querySelector('input[name=password]').value.trim();
        const url = document.querySelector('indirect' === mode ? 'input[name=phpgui]' : 'input[name=host]').value.trim();

        if (0 === password.length && !host.includes('127.0.0.1') && !host.includes('localhost')) {
            document.querySelector('#status .warning').innerText = chrome.i18n.getMessage('missingPasswordText');
            document.querySelector('#status .warning').style.display = 'inline';
            return;
        }

        chrome.permissions.request({
                origins: [url + '/'] // add missing trailing slash
            },
            function (granted) {
                document.querySelector('#status .warning').style.display = 'none';
                if (granted) {
                    chrome.storage.sync.set({
                        mode: mode,
                        host: host,
                        phpgui: document.querySelector('input[name=phpgui]').value.trim(),
                        port: port,
                        password: password,
                    }, function () {
                        let state = document.querySelector('#status .success');
                        state.style.display = 'inline';
                        setTimeout(() => state.style.display = 'none', 1500);
                    });
                } else {
                    let state = document.querySelector('#status .error');
                    setTimeout(() => state.style.display = 'none', 1500);
                }
            });
    });

    chrome.storage.sync.get(null, function (config) {
        if (config && 0 !== Object.keys(config).length) {
            document.querySelector('input[name=mode][value=' + config['mode'] + ']').click();
            document.querySelector('input[name=phpgui]').value = config['phpgui'];
            document.querySelector('input[name=host]').value = config['host'];
            document.querySelector('input[name=port]').value = config['port'];
            document.querySelector('input[name=password]').value = config['password'];
        } else {
            const el = document.querySelector('#status .warning');
            el.style.display = 'inline';
            el.innerText = chrome.i18n.getMessage('missingConfigurationDescription');
        }
    });
});