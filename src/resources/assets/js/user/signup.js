const e = require("cors");

$('#eye').click(function () {
    const input = $('#inputPassword4');
    const icon = $(this);

    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fas fa-eye-slash').addClass('fas fa-eye');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fas fa-eye').addClass('fas fa-eye-slash');
    }
});

$(document).on('click','#submitButton', function (e) {
    $('#submitButton').prop("disabled", true).addClass("btn-buffer");
    $('#submitButton-spinner').removeClass('d-none');
    
    $('#signup-form').ajaxForm(function(res) {
        $('#submitButton').prop("disabled", false).addClass("btn-buffer");
        $('#submitButton-spinner').addClass('d-none');
        if (res.flag === 1) {
            Toast(res.msg, res.flag, 3000);
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } else {
            Toast(res.msg, res.flag, 3000);
        }
    }).submit()

})
