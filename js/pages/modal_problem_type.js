function ModalProblemType() {

    let mptCallFrom = '';
    let mptProblemtypeId = '';

    this.init = function () {
        const vDataMpt = [
            {
                field_id: 'txtMptDesc',
                type: 'text',
                name: 'Problem Type',
                validator: {
                    notEmpty: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'chkMcpStatus',
                type: 'chkMptStatus',
                name: 'Status',
                validator: {
                }
            }
        ];

        let formMptValidate = new MzValidate('formMpt');
        formMptValidate.registerFields(vDataMpt);

        $('#formMpt').on('keyup change', function () {
            $('#btnMptSubmit').attr('disabled', !formMptValidate.validateForm());
        });

        $('#modal_problem_type').on('hidden.bs.modal', function(){
            formMptValidate.clearValidation();
        });

        $('#modal_problem_type').on('shown.bs.modal', function(){
            $('#btnMptSubmit').attr('disabled', true);
            if (mptProblemtypeId !== '') {
                $('#lblMctTitle').html('<i class="far fa-edit"></i> Edit Problem Type');
                $('#btnMctSubmit').html('<i class="fas fa-highlighter"></i> Update');
                ShowLoader();
                setTimeout(function () {
                    try {
                        const dataMpt = mzAjaxRequest('problem_type.php?problemtypeId='+mptProblemtypeId, 'GET');
                        mzSetFieldValue('MptDesc', dataMpt['problemtypeDesc'], 'text');
                        mzSetFieldValue('MptStatus', dataMpt['problemtypeStatus'], 'checkSingle', '1');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        $('#modal_problem_type').modal('hide');
                    }
                    HideLoader();
                }, 300);
            } else {
                $('#lblMctTitle').html('<i class="fas fa-plus"></i> Add Problem Type');
                $('#btnMctSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
            }
        });

        $('#btnMptSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMptValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const statusVal = $("input[name='chkMptStatus']").is(":checked") ? '1' : '2';
                    const data = {
                        problemtypeDesc: $('#txtMptDesc').val(),
                        problemtypeStatus: statusVal
                    };
                    mzAjaxRequest('problem_type.php?problemtypeId='+mptProblemtypeId, 'PUT', data);
                    $('#modal_problem_type').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.load = function (callFrom, problemtypeId) {
        mptCallFrom = callFrom;
        mptProblemtypeId = typeof problemtypeId === 'undefined' ? '' : problemtypeId;

        $('#btnMptSubmit').attr('disabled', true);
        $('#modal_problem_type').modal({backdrop: 'static', keyboard: false});
    };

    this.init();

}