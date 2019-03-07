function ModalProblemType() {

    let mptCallFrom = '';
    let mptProblemtypeId = '';
    let mptRowRefresh = '';

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
                type: 'checkSingle',
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
                $('#lblMptTitle').html('<i class="far fa-edit"></i> Edit Problem Type');
                $('#btnMptSubmit').html('<i class="fas fa-highlighter"></i> Update');
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
                $('#lblMptTitle').html('<i class="fas fa-plus"></i> Add Problem Type');
                $('#btnMptSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
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

                    let tempRow = {};
                    if (mptCallFrom === 'Pbt') {
                        tempRow['problemtypeDesc'] = $('#txtMptDesc').val();
                        tempRow['problemtypeStatus'] = statusVal;
                        if (mptProblemtypeId === '') {
                            tempRow['problemtypeId'] = mzAjaxRequest('problem_type.php', 'POST', data);
                            oTablePbtProblemType.row.add(tempRow).draw();
                        } else {
                            tempRow['problemtypeId'] = mptProblemtypeId;
                            data['action'] = 'update';
                            mzAjaxRequest('problem_type.php?problemtypeId='+mptProblemtypeId, 'PUT', data);
                            oTablePbtProblemType.row(mptRowRefresh).data(tempRow).draw();
                        }
                    }
                    $('#modal_problem_type').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.add = function (callFrom) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mptCallFrom = callFrom;
        mptProblemtypeId = '';
        mptRowRefresh = '';
        $('#btnMptSubmit').attr('disabled', true);
        $('#modal_problem_type').modal({backdrop: 'static', keyboard: false});
    };

    this.edit = function (callFrom, problemtypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof problemtypeId === 'undefined' || problemtypeId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mptCallFrom = callFrom;
        mptProblemtypeId = problemtypeId;
        mptRowRefresh = rowRefresh;
        $('#btnMptSubmit').attr('disabled', true);
        $('#modal_problem_type').modal({backdrop: 'static', keyboard: false});
    };

    this.deactivate = function (callFrom, problemtypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof problemtypeId === 'undefined' || problemtypeId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        ShowLoader();
        setTimeout(function () {
            try {
                mzAjaxRequest('problem_type.php?problemtypeId='+problemtypeId, 'PUT', {action: 'deactivate'});
                const currentRow = oTablePbtProblemType.row(rowRefresh).data();
                let tempRow = {};
                tempRow['problemtypeId'] = problemtypeId;
                tempRow['problemtypeDesc'] = currentRow['problemtypeDesc'];
                tempRow['problemtypeStatus'] = '2';
                if (callFrom === 'Pbt') {
                    oTablePbtProblemType.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.activate = function (callFrom, problemtypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof problemtypeId === 'undefined' || problemtypeId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        ShowLoader();
        setTimeout(function () {
            try {
                mzAjaxRequest('problem_type.php?problemtypeId='+problemtypeId, 'PUT', {action: 'activate'});
                const currentRow = oTablePbtProblemType.row(rowRefresh).data();
                let tempRow = {};
                tempRow['problemtypeId'] = problemtypeId;
                tempRow['problemtypeDesc'] = currentRow['problemtypeDesc'];
                tempRow['problemtypeStatus'] = '1';
                if (callFrom === 'Pbt') {
                    oTablePbtProblemType.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.delete = function (callFrom, problemtypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof problemtypeId === 'undefined' || problemtypeId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        ShowLoader();
        setTimeout(function () {
            try {
                mzAjaxRequest('problem_type.php?problemtypeId='+problemtypeId, 'DELETE');
                if (callFrom === 'Pbt') {
                    oTablePbtProblemType.row(rowRefresh).remove().draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.init();

}