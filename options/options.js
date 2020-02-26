document.addEventListener('DOMContentLoaded', function (event) {
    document.querySelector('input[name=mode][value=direct]').addEventListener('click', function (e) {
        document.querySelectorAll('.phpgui').forEach(el => el.style.display = 'none');
        document.querySelector('input[name=phpgui]').removeAttribute('required');
    });

    document.querySelector('input[name=mode][value=indirect]').addEventListener('click', function (e) {
        document.querySelectorAll('.phpgui').forEach(el => el.style.display = 'block');
        document.querySelector('input[name=phpgui]').setAttribute('required', 'required');
    });

    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        let mode = document.querySelector('input[name=mode]:checked').value;
        let url = document.querySelector('indirect' === mode ? 'input[name=phpgui]' : 'input[name=host]').value.trim();

        chrome.permissions.request({
                origins: [url + '/'] // add missing trailing slash
            },
            function (granted) {
                if (granted) {
                    chrome.storage.sync.set({
                        mode: mode,
                        host: document.querySelector('input[name=host]').value.trim(),
                        phpgui: document.querySelector('input[name=phpgui]').value.trim(),
                        port: document.querySelector('input[name=port]').value.trim(),
                        password: document.querySelector('input[name=password]').value.trim(),
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
        if (0 !== Object.keys(config).length) {
            document.querySelector('input[name=mode][value=' + config['mode'] + ']').click();
            document.querySelector('input[name=phpgui]').value = config['phpgui'];
            document.querySelector('input[name=host]').value = config['host'];
            document.querySelector('input[name=port]').value = config['port'];
            document.querySelector('input[name=password]').value = config['password'];
        }
    });
});