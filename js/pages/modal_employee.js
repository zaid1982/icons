function ModalEmployee() {

    let myeCallFrom = '';
    let myeRowRefresh = '';
    let myeUserGroupId = '';
    let myeGroupId = '';
    let formMyeValidate;

    this.init = function () {
        const vDataMyeSelect = [
            {
                field_id: 'txtMyeSelectMykad',
                type: 'text',
                name: 'MyKad No. / Passport No.',
                validator: {
                    notEmpty: true,
                    maxLength: 20,
                    minLength: 8
                }
            }
        ];

        let formMyeSelectValidate = new MzValidate('formMyeSelect');
        formMyeSelectValidate.registerFields(vDataMyeSelect);

        const vDataMye = [
            {
                field_id: 'txtMyeUserMykadNo',
                type: 'text',
                name: 'MyKad No. / Passport No.',
                validator: {
                }
            },
            {
                field_id: 'txtMyeUserName',
                type: 'text',
                name: 'User ID',
                validator: {
                    notEmpty: true,
                    maxLength: 11,
                    minLength: 4
                }
            },
            {
                field_id: 'txtMyeUserPassword',
                type: 'text',
                name: 'Password',
                validator: {
                    notEmpty: true,
                    maxLength: 30,
                    minLength: 6
                }
            },
            {
                field_id: 'txtMyeUserFirstName',
                type: 'text',
                name: 'First Name',
                validator: {
                    notEmpty: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'txtMyeUserLastName',
                type: 'text',
                name: 'Last Name',
                validator: {
                    notEmpty: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'txtMyeUserContactNo',
                type: 'text',
                name: 'Contact No.',
                validator: {
                    notEmpty: true,
                    digit: true,
                    minLength: 8,
                    maxLength: 15
                }
            },
            {
                field_id: 'txtMyeUserEmail',
                type: 'text',
                name: 'Email',
                validator: {
                    notEmpty: true,
                    email: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'chkMyeRole[]',
                type: 'check',
                name: 'Role',
                validator: {
                    notEmptyCheck: true
                }
            }
        ];

        formMyeValidate = new MzValidate('formMye');
        formMyeValidate.registerFields(vDataMye);

        $('#formMye').on('keyup change', function () {
            $('#btnMyeSubmit').attr('disabled', !formMyeValidate.validateForm());
        });

        $('#modal_employee').on('hidden.bs.modal', function(){
            formMyeSelectValidate.clearValidation();
            formMyeValidate.clearValidation();
        });

        $('#modal_employee').on('shown.bs.modal', function(){
            $('#btnMyeSubmit').attr('disabled', true);
        });

        $('#lnkMyeCheckIc').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMyeSelectValidate.validateForm()) {
                        throw new Error('Please enter the valid MyKad No. / Passport No.');
                    }
                    const myKad = $('#txtMyeSelectMykad').val();
                    formMyeValidate.clearValidation();

                    const data = {
                        action: 'get_by_mykad',
                        groupId: myeGroupId,
                        userMykadNo: myKad
                    };
                    const dataMyeEmployee = mzAjaxRequest('employee.php', 'POST', data);
                    if (dataMyeEmployee.length !== 0) {
                        $('#divMyeUserPassword').hide();
                        formMyeValidate.disableField('txtMyeUserName');
                        formMyeValidate.disableField('txtMyeUserPassword');
                        formMyeValidate.disableField('txtMyeUserFirstName');
                        formMyeValidate.disableField('txtMyeUserLastName');
                        formMyeValidate.disableField('txtMyeUserContactNo');
                        formMyeValidate.disableField('txtMyeUserEmail');
                        mzSetFieldValue('MyeUserMykadNo', dataMyeEmployee['userMykadNo'], 'text', 'MyKad No. / Passport No. *');
                        mzSetFieldValue('MyeUserName', dataMyeEmployee['userName'], 'text', 'User ID *');
                        mzSetFieldValue('MyeUserFirstName', dataMyeEmployee['userFirstName'], 'text', 'First Name *');
                        mzSetFieldValue('MyeUserLastName', dataMyeEmployee['userLastName'], 'text', 'Last Name *');
                        mzSetFieldValue('MyeUserContactNo', dataMyeEmployee['userContactNo'], 'text', 'Contact No. *');
                        mzSetFieldValue('MyeUserEmail', dataMyeEmployee['userEmail'], 'text', 'Email *');
                        mzSetFieldValue('MyeRole', dataMyeEmployee['roles'], 'check');

                        $('#lblFormMyeTitle').html('New Employee Registration').show();
                        $('#txtMyeUserMykadNo').prop('disabled', true);
                        $('#txtMyeUserName, #txtMyeUserFirstName, #txtMyeUserLastName, #txtMyeUserContactNo, #txtMyeUserEmail').prop('disabled', true);
                        $('#btnMyeSubmit').attr('disabled', !formMyeValidate.validateForm());
                    } else {
                        $('#divMyeUserPassword').show();
                        formMyeValidate.enableField('txtMyeUserName');
                        formMyeValidate.enableField('txtMyeUserPassword');
                        formMyeValidate.enableField('txtMyeUserFirstName');
                        formMyeValidate.enableField('txtMyeUserLastName');
                        formMyeValidate.enableField('txtMyeUserContactNo');
                        formMyeValidate.enableField('txtMyeUserEmail');
                        mzSetFieldValue('MyeUserMykadNo', myKad, 'text', 'MyKad No. / Passport No. *');

                        $('#lblFormMyeTitle').html('Existing System User').show();
                        $('#txtMyeUserMykadNo').prop('disabled', true);
                        $('#txtMyeUserName, #txtMyeUserFirstName, #txtMyeUserLastName, #txtMyeUserContactNo, #txtMyeUserEmail').prop('disabled', false);
                        $('#btnMyeSubmit').attr('disabled', true);
                    }
                    $('#formMye').show();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.add = function (callFrom, groupId) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof groupId === 'undefined' || groupId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        myeCallFrom = callFrom;
        myeGroupId = groupId;
        myeUserGroupId  = '';
        myeRowRefresh = '';

        $('#formMyeSelect').show();
        $('#formMye').hide();
        $('#lblMyeTitle').html('<i class="fas fa-user-plus"></i> Add Contractor Employee');
        $('#btnMyeSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
        $('#modal_employee').modal({backdrop: 'static', keyboard: false});
    };

    this.edit = function (callFrom, userGroupId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof userGroupId === 'undefined' || userGroupId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        myeCallFrom = callFrom;
        myeGroupId = '';
        myeUserGroupId  = userGroupId;
        myeRowRefresh = rowRefresh;

        $('#txtMyeUserMykadNo, #txtMyeUserName, #txtMyeUserFirstName, #txtMyeUserLastName, #txtMyeUserContactNo, #txtMyeUserEmail').prop('disabled', false);
        $('#btnMyeSubmit').attr('disabled', !formMyeValidate.validateForm());
        $('#formMyeSelect').hide();
        $('#formMye').show();
        $('#lblFormMyeTitle').html('').hide();
        $('#lblMyeTitle').html('<i class="fas fa-user-plus"></i> Edit Contractor Employee');
        $('#btnMyeSubmit').html('<i class="fas fa-save ml-1"></i> Update');
        $('#modal_employee').modal({backdrop: 'static', keyboard: false});
    };

    this.init();
}