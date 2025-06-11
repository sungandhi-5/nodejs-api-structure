$('#Old_password_eye').click(function () {

    $('#confimration_otp').on('input', function () {
        // Remove non-numeric characters using a regular expression
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
    const input = $('#old_password');
    const icon = $(this);

    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fas fa-eye-slash').addClass('fas fa-eye');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fas fa-eye').addClass('fas fa-eye-slash');
    }

});

$('#New_password_eye').click(function () {
    const input = $('#new_password');
    const icon = $(this);

    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fas fa-eye-slash').addClass('fas fa-eye');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fas fa-eye').addClass('fas fa-eye-slash');
    }
});
$('#Confirm_password_eye').click(function () {
    const input = $('#confirm_password');
    const icon = $(this);

    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fas fa-eye-slash').addClass('fas fa-eye');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fas fa-eye').addClass('fas fa-eye-slash');
    }
});
$(document).ready(function () {

    showContentBasedOnHash();
    $('#change_password_btn').removeClass('disabled');
    $('#setting_save_btn').removeClass('disabled');
    $('#eth_gas_station_enableID').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).val(1); // If checked, set value to '1'
        } else {
            $(this).val(0); // If unchecked, set value to '0'
        }
    });

    $(document).on('click', '.AddIpAddress', function () {
        $('#ipAddress').val('')
    });
})
$(document).on('click', '#setting_save_btn', function () {
    const reserve_eth_gas_station_balance = parseFloat($('#reserve_eth_gas_station_balance').val());
    const reserve_bnb_gas_station_balance = parseFloat($('#reserve_bnb_gas_station_balance').val());
    const reserve_trx_gas_station_balance = parseFloat($('#reserve_trx_gas_station_balance').val());
    const low_eth_gas_station_balance = parseFloat($('#low_eth_gas_station_balance').val());
    const low_bnb_gas_station_balance = parseFloat($('#low_bnb_gas_station_balance').val());
    const low_trx_gas_station_balance = parseFloat($('#low_trx_gas_station_balance').val());
    if (reserve_eth_gas_station_balance <= low_eth_gas_station_balance) {
        Toast('Reverse ETH gas station balance should be greater than low ETH gas station balance', 2, 3000);
        return ;
    }
    else if (reserve_bnb_gas_station_balance <= low_bnb_gas_station_balance) {
        Toast('Reverse BNB gas station balance should be greater than low BNB gas station balance', 2, 3000);
        return ;
    }
    else if (reserve_trx_gas_station_balance <= low_trx_gas_station_balance) {
        Toast('Reverse TRX gas station balance should be greater than low TRX gas station balance', 2, 3000);
        return ;
    }
    const updateData = {
        login_url_token: $('#login_url_token').val().trim(),
        maintanance_mode: parseFloat($('#maintanance_mode').val()),
        free_rate_limite: parseFloat($('#free_rate_limite').val()),
        free_plan_wallet_address_max_limit: parseFloat($('#free_plan_wallet_address_max_limit').val()),
        pro_rate_limite: parseFloat($('#pro_rate_limite').val()),
        pro_plan_wallet_address_max_limit: parseFloat($('#pro_plan_wallet_address_max_limit').val()),
        create_wallet_limit: parseFloat($('#create_wallet_limit').val()),
        wallet_address_expiry_days: parseFloat($('#wallet_address_expiry_days').val()),
        test_coin_amount: parseFloat($('#test_coin_amount').val()),
        pro_plan_exp_reminder_1: parseFloat($('#pro_plan_exp_reminder_1').val()),
        pro_plan_exp_reminder_2: parseFloat($('#pro_plan_exp_reminder_2').val()),
        merchant_password_expiry_days: parseFloat($('#merchant_password_expiry_days').val()),
        reserve_eth_gas_station_balance: reserve_eth_gas_station_balance,
        reserve_bnb_gas_station_balance: reserve_bnb_gas_station_balance,
        reserve_trx_gas_station_balance: reserve_trx_gas_station_balance,
        low_eth_gas_station_balance: low_eth_gas_station_balance,
        low_bnb_gas_station_balance: low_bnb_gas_station_balance,
        low_trx_gas_station_balance: low_trx_gas_station_balance,
        eth_gas_station_enable: $('#eth_gas_station_enableID').val(),
    }
    //api call
    $('#setting_save_btn').prop("disabled", true).addClass("btn-buffer");
    $('#setting_save_btn-spinner').removeClass('d-none');
    postAjaxRequest(`setting/update`, 'POST', updateData, function (response) {
        $('#setting_save_btn').prop("disabled", false).removeClass("btn-buffer");
        $('#setting_save_btn-spinner').addClass('d-none');
        Toast(response.msg, response.flag, 3000);
        if (response.flag == 4) {
            setTimeout(() => {
                window.location.href = '/'
            }, 2000);
        } else {
            setTimeout(function () {
            }, 3000);
        }
    })
});
$(document).on('click', '#change_password_btn', function () {
    $('#change_password_btn').prop("disabled", true).addClass("btn-buffer");
    $('#change_password_btn-spinner').removeClass('d-none');

    const updateData = {
        old_password: $('#old_password').val(),
        new_password: $('#new_password').val(),
        confirm_password: $('#confirm_password').val(),

    }
    //api call
    postAjaxRequest(`setting/change-password`, 'POST', updateData, function (response) {
        $('#change_password_btn').prop("disabled", false).removeClass("btn-buffer");
        $('#change_password_btn-spinner').addClass('d-none');
        Toast(response.msg, response.flag, 1000);
        if (response.flag == 1) {
            setTimeout(function () {
                window.location.href = '/'
            }, 1000);
        }
    })
});
$(document).on('click', '.copy-icon', function () {
    var textToCopy = $(this).siblings("input[type='hidden']").val()
    var tempInput = $("<input>");
    $("body").append(tempInput);
    tempInput.val(textToCopy).select();
    document.execCommand("copy");
    tempInput.remove();

    // update the tootip message
    var tooltip = bootstrap.Tooltip.getInstance(this);
    tooltip.setContent({ '.tooltip-inner': 'Copied!' });
    tooltip.show();
    var that = this;
    setTimeout(function () {
        $(that).attr('data-bs-title', 'Copy to clipboard');
        tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
    }, 2000);
});
// $('#two_factor_authentication_div').show();
$(document).on('click', '#two_factor_authentication_on', function () {
    $('#two_factor_authentication_Main_div').hide();
    $('#two_factor_authentication_div').show();
    let data = {}
    postAjaxRequest(`setting/security/2fa/generate`, 'POST', data, function (response) {
        $('#two_factor_authentication_div').html(response.data);
    })

});

$(document).on('click', '#two_factor_authentication_off', function () {
    $('#two_factor_authentication_Main_div').hide();
    $('#two_factor_authentication_Confirm_div').show();
    let data = {}
    postAjaxRequest(`setting/security/2fa/verify`, 'POST', data, function (response) {
        $('#two_factor_authentication_Confirm_div').html(response.data);
    })

});
$(document).on('click', '#two_factor_authentication_Next', function () {
    $('#two_factor_authentication_div').hide();
    $('#two_factor_authentication_Confirm_div').show();


    let data = {
    }
    postAjaxRequest(`setting/security/2fa/verify`, 'POST', data, function (response) {
        $('#two_factor_authentication_Confirm_div').html(response.data);
    })

});
$(document).on('click', '#Confime_authentication', function () {
    $('#Confime_authentication').prop('disabled', true).addClass("btn-buffer").html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Confirm')
    const data = {
        factor_secret: $('#Factory_secret_Key').val(),
        factor_otp: $('#confimration_otp').val()
    }


    postAjaxRequest(`setting/security/2fa/enable`, 'POST', data, function (response) {
        Toast(response.msg, response.flag, 1000);
        if (response.flag == 1) {
            setTimeout(function () {
                window.location.href = '/'
                $('#Confime_authentication').prop('disabled', false).removeClass("btn-buffer").html('Confirm')
            }, 1000);
        } else {
            setTimeout(function () {
                $('#Confime_authentication').prop('disabled', false).removeClass("btn-buffer").html('Confirm')
            }, 1000);
        }
    })

});

$(document).on('click', '#Cancel_Confime_authentication', function () {
    $('#two_factor_authentication_Confirm_div').hide();
    $('#two_factor_authentication_div').show();

});

$(document).on('click', '#Cancel_two_factor_authentication_Next', function () {
    $('#two_factor_authentication_div').hide();
    $('#two_factor_authentication_Main_div').show();
});

// $(document).on('click', '#Cancel_Confime_authentication', function () {
//     $('#two_factor_authentication_Confirm_div').hide();

// });

// tab change

const updateURLHash = (hash) => {
    const newURL = window.location.pathname + '#' + hash;
    history.pushState({}, '', newURL);
};
const showContentBasedOnHash = () => {
    let hash = window.location.hash;
    if (hash == '#general') {
        $('#general-tab').tab('show');

    } else if (hash == '#change-password') {
        $('#change-password-tab').tab('show');
    }
    else if (hash == '#security') {
        $('#security-tab').tab('show')
    }

};

$('#general-tab').on('click', function (event) {
    updateURLHash('general');

});
$('#change-password-tab').on('click', function (event) {
    updateURLHash('change-password');
});
$('#security-tab').on('click', function (event) {
    updateURLHash('security');
});

function preventDotKeyPress(e) {
    if (e.key === '.') {
        e.preventDefault();
    }
}

$('input[type=number]').on('keypress', preventDotKeyPress);