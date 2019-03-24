function ModalEmployee() {

    let myeCallFrom = '';
    let myeRowRefresh = '';
    let myeGroupId = '';
    let myeUserId = '';
    let myeUserStatus = '';
    let formMyeValidate;
    let myeClassFrom;
    let myeAction = '';

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
                        myeUserId = dataMyeEmployee['userId'];
                        myeUserStatus = dataMyeEmployee['userStatus'];

                        $('#lblFormMyeTitle').html('New Employee Registration').show();
                        $('#txtMyeUserMykadNo, #txtMyeUserName, #txtMyeUserFirstName, #txtMyeUserLastName, #txtMyeUserContactNo, #txtMyeUserEmail').prop('disabled', true);
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
                        myeUserId = '';
                        myeUserStatus = '1';

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

        $('#btnMyeSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMyeValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }

                    let tempRow = {};
                    let rolesStr = '';
                    $("input[name='chkMyeRole[]']:checked").map(function(){
                        rolesStr += ','+$(this).val();
                    });
                    rolesStr = rolesStr.substr(1);

                    if (myeAction === 'add') {
                        if (myeUserId !== '') {     // existing user
                            const dataAddExisting = {
                                action: 'add_employee_existing',
                                groupId: myeGroupId,
                                userId: myeUserId,
                                roles: rolesStr
                            };
                            mzAjaxRequest('employee.php', 'POST', dataAddExisting);
                            tempRow['userId'] = myeUserId;
                        } else {    // new user
                            const dataAddNew = {
                                action: 'add_employee_new',
                                userName: $('#txtMyeUserName').val(),
                                userPassword: $('#txtMyeUserPassword').val(),
                                userFirstName: $('#txtMyeUserFirstName').val(),
                                userLastName: $('#txtMyeUserLastName').val(),
                                userContactNo: $('#txtMyeUserContactNo').val(),
                                userEmail: $('#txtMyeUserEmail').val(),
                                groupId: myeGroupId,
                                roles: rolesStr
                            };
                            tempRow['userId'] = mzAjaxRequest('employee.php', 'POST', dataAddNew);
                        }

                        if (myeCallFrom === 'ctd') {
                            tempRow['userFullname'] = ($('#txtMyeUserFirstName').val() + ' ' + $('#txtMyeUserLastName').val());
                            tempRow['userContactNo'] = $('#txtMyeUserContactNo').val();
                            tempRow['userEmail'] = $('#txtMyeUserEmail').val();
                            tempRow['roles'] = rolesStr;
                            tempRow['userStatus'] = myeUserStatus;
                            myeClassFrom.addDataTableEmployee(tempRow);
                        }
                    } else if (myeAction === 'edit') {
                        const dataEdit = {
                            action: 'update',
                            roles: rolesStr
                        };
                        mzAjaxRequest('employee.php?userId='+myeUserId, 'PUT', dataEdit);
                        if (myeCallFrom === 'ctd') {
                            tempRow['userId'] = myeUserId;
                            tempRow['userFullname'] = ($('#txtMyeUserFirstName').val() + ' ' + $('#txtMyeUserLastName').val());
                            tempRow['userContactNo'] = $('#txtMyeUserContactNo').val();
                            tempRow['userEmail'] = $('#txtMyeUserEmail').val();
                            tempRow['roles'] = rolesStr;
                            tempRow['userStatus'] = myeUserStatus;
                            myeClassFrom.editDataTableEmployee(tempRow, myeRowRefresh);
                        }
                    } else {
                        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                    }

                    $('#modal_employee').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.setClassFrom = function (classFrom) {
        myeClassFrom = classFrom;
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
        myeUserId  = '';
        myeRowRefresh = '';
        myeAction = 'add';

        $('#formMyeSelect').show();
        $('#formMye').hide();
        $('#lblMyeTitle').html('<i class="fas fa-user-plus"></i> Add Contractor Employee');
        $('#btnMyeSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
        $('#modal_employee').modal({backdrop: 'static', keyboard: false});
    };

    this.edit = function (callFrom, userId, groupId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof userId === 'undefined' || userId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        myeCallFrom = callFrom;
        myeGroupId = groupId;
        myeUserId = userId;
        myeRowRefresh = rowRefresh;
        myeAction = 'edit';

        ShowLoader();
        setTimeout(function () {
            try {
                const dataMyeEmployee = mzAjaxRequest('employee.php?userId='+myeUserId+'&groupId='+myeGroupId, 'GET');
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
                myeUserId = dataMyeEmployee['userId'];
                myeUserStatus = dataMyeEmployee['userStatus'];

                $('#divMyeUserPassword').hide();
                $('#txtMyeUserMykadNo, #txtMyeUserName, #txtMyeUserFirstName, #txtMyeUserLastName, #txtMyeUserContactNo, #txtMyeUserEmail').prop('disabled', true);
                $('#btnMyeSubmit').attr('disabled', true);
                $('#formMyeSelect').hide();
                $('#formMye').show();
                $('#lblFormMyeTitle').html('').hide();
                $('#lblMyeTitle').html('<i class="fas fa-user-plus"></i> Edit Contractor Employee');
                $('#btnMyeSubmit').html('<i class="fas fa-save ml-1"></i> Update');
                $('#modal_employee').modal({backdrop: 'static', keyboard: false});
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.init();
}