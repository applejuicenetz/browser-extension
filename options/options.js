$(document).ready(function () {
    $('input[name=mode][value=direct]').click(function (e) {
        $('.phpgui').hide();
        $('input[name=phpgui]').attr('required', false);
    });

    $('input[name=mode][value=indirect]').click(function (e) {
        $('.phpgui').show();
        $('input[name=phpgui]').attr('required', true);
    });

    $('form').submit(function (e) {
        e.preventDefault();
        localStorage['mode'] = $('input[name=mode]:checked').val();
        localStorage['host'] = $('input[name=host]').val().trim();
        localStorage['phpgui'] = $('input[name=phpgui]').val().trim();
        localStorage['port'] = $('input[name=port]').val().trim();
        localStorage['password'] = $('input[name=password]').val().trim();

        $('#status').fadeIn().delay(1000).fadeOut();
    });

    if (0 !== localStorage.length) {
        $('input[name=mode][value=' + localStorage['mode'] + ']').click();

        $('input[name=phpgui]').val(localStorage['phpgui']);
        $('input[name=host]').val(localStorage['host']);
        $('input[name=port]').val(localStorage['port']);
        $('input[name=password]').val(localStorage['password']);
    }
});