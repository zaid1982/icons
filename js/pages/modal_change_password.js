let mpwCallFrom = '';
let mpwUserId = '';

function initiateModalChangePassword() {

    const vDataMpw = [
        {
            field_id: 'txtOldPassword',
            type: 'text',
            name: 'Kata Laluan Asal',
            validator: {
                notEmpty: true,
                maxLength: 20,
                minLength: 6
            }
        },
        {
            field_id: 'txtNewPassword',
            type: 'text',
            name: 'Kata Laluan Baru',
            validator: {
                notEmpty: true,
                maxLength: 20,
                minLength: 6
            }
        },
        {
            field_id: 'txtConfirmPassword',
            type: 'text',
            name: 'Kata Laluan Pengesahan',
            validator: {
                notEmpty: true,
                maxLength: 20,
                minLength: 6,
                similar: {
                    id: "txtNewPassword",
                    label: "Kata Laluan Baru"
                }
            }
        }
    ];

    let formMpwValidate = new MzValidate('formMpw');
    formMpwValidate.registerFields(vDataMpw);

    $('#formMpw').on('keyup change', function () {
        $('#btnMpwSubmit').attr('disabled', !formMpwValidate.validateForm());
    });

    $('#modal_change_password').on('hidden.bs.modal', function(){
        formMpwValidate.clearValidation();
    });

    $('#modal_change_password').on('shown.bs.modal', function(){
        $('#btnMpfSubmit').attr('disabled', true);
        if (mpwCallFrom === 'Top') {
            let userInfo = sessionStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            mpwUserId = userInfo.userId;
        }
    });

    $('#btnMpwSubmit').on('click', function () {
        ShowLoader();
        setTimeout(function () {
            try {
                if (!formMpwValidate.validateForm()) {
                    throw new Error(_ALERT_MSG_VALIDATION);
                }
                if (mpwCallFrom === 'Top') {
                    const data = {
                        action: 'password',
                        oldPassword: $('#txtOldPassword').val(),
                        newPassword: $('#txtConfirmPassword').val()
                    };
                    mzAjaxRequest('profile.php?userId='+mpwUserId, 'PUT', data);
                    toastr['success'](_ALERT_MSG_SUCCESS_CHANGE_PASSWORD, _ALERT_TITLE_SUCCESS);
                } else {
                    throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                }
                $('#modal_change_password').modal('hide');
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    });
}

function loadModalChangePassword(callFrom, userId) {
    mpwCallFrom = callFrom;
    mpwUserId = typeof userId === 'undefined' ? '' : userId;

    $('#modal_change_password').modal({backdrop: 'static', keyboard: false});
    $('#modal_change_password').scrollTop(0);
}