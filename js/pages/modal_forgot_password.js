document.addEventListener('DOMContentLoaded', function () {

    const vDataMfp = [
        {
            field_id: 'txtMfpUserId',
            type: 'text',
            name: 'User ID',
            validator: {
                notEmpty: true,
                maxLength: 100
            }
        }
    ];

    let formMfpValidate = new MzValidate('formMfpForgotPassword');
    formMfpValidate.registerFields(vDataMfp);

    $('#formMfpForgotPassword').on('keyup', function () {
        $('#btnMfpSend').attr('disabled', !formMfpValidate.validateForm());
    });

    $('#modalForgotPassword').on('shown.bs.modal', function () {
        formMfpValidate.clearValidation();
        $('#btnMfpSend').attr('disabled', true);
    });

    $('#btnMfpSend').on('click', function () {
        ShowLoader();
        setTimeout(function () {
            try {
                if (!formMfpValidate.validateForm()) {
                    throw new Error(_ALERT_MSG_VALIDATION);
                }
                const data = {
                    action: 'forgot_password',
                    username: $('#txtMfpUserId').val()
                };
                mzAjaxRequest('login.php', 'POST', data);
                $('#modalForgotPassword').modal('hide');
                toastr['success'](_ALERT_MSG_SUCCESS_FORGOT_PASSWORD, _ALERT_TITLE_SUCCESS_FORGOT_PASSWORD);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR_FORGOT_PASSWORD);
            }
            HideLoader();
        }, 300);
    });

});