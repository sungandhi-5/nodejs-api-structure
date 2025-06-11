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

$('#signin-form').submit(function (event) {
    event.preventDefault();

    const email = $('#inputEmail4').val();
    const password = $('#inputPassword4').val();
    const rememberMe = $('#flexCheckDefault').is(':checked');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const factor_otp = $('#otpId').val();
    if (!email || !emailRegex.test(email)) {
        $('.invalid-feedback').html('Invalid email');
    } else {
        const user = {
            email: email,
            password: password,
            rememberMe: rememberMe,
            factor_otp: factor_otp
        };

        $('#submitButton').prop("disabled", true).addClass("btn-buffer");
        $('#submitButton-spinner').removeClass('d-none');

        $.ajax({
            type: 'POST',
            url: '/login',
            data: JSON.stringify(user),
            contentType: 'application/json',
            success: function (response) {
                Toast(response.msg, response.flag, 3000)
                if (response.flag === 1) {
                    setTimeout(() => {
                        window.location.href = '/user/dashboard';
                    }, 500);
                }
            },
            error: function (xhr, status, error) {
                Toast(response.msg, response.flag, 3000)},
            complete: function () {
                $('#submitButton').prop("disabled", false).removeClass("btn-buffer");
                $('#submitButton-spinner').addClass('d-none');
            }
        });
    }
});