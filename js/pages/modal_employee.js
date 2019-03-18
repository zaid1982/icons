function ModalEmployee() {

    let myeCallFrom = '';
    let myeRowRefresh = '';
    let myeUserGroupId = '';
    let myeGroupId = '';

    this.init = function () {
        const vDataMye = [
            {
                field_id: 'txtMyeUserMykadNo',
                type: 'text',
                name: 'MyKad No. / Passport No.',
                validator: {
                    notEmpty: true,
                    maxLength: 20,
                    minLength: 8
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

        let formMyeValidate = new MzValidate('formMye');
        formMyeValidate.registerFields(vDataMye);

        $('#formMye').on('keyup change', function () {
            $('#btnMyeSubmit').attr('disabled', !formMyeValidate.validateForm());
        });

        $('#modal_employee').on('hidden.bs.modal', function(){
            formMyeValidate.clearValidation();
        });

        $('#modal_employee').on('shown.bs.modal', function(){
            $('#btnMyeSubmit').attr('disabled', true);
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
        myeUserGroupId = '';
        myeRowRefresh = '';

        $('#lblMyeTitle').html('<i class="fas fa-user-plus"></i> Add Contractor Employee');
        $('#btnMyeSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
        $('#btnMyeSubmit').attr('disabled', true);
        $('#modal_employee').modal({backdrop: 'static', keyboard: false});
    };

    this.init();
}