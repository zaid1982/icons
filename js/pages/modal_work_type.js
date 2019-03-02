function ModalWorkType() {

    let mwtCallFrom = '';
    let mwtWorktypeId = '';
    let mwtRowRefresh = '';

    this.init = function () {
        const vDataMwt = [
            {
                field_id: 'txtMwtDesc',
                type: 'text',
                name: 'Work Type',
                validator: {
                    notEmpty: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'chkMwtStatus',
                type: 'chkMwtStatus',
                name: 'Status',
                validator: {
                }
            }
        ];

        let formMwtValidate = new MzValidate('formMwt');
        formMwtValidate.registerFields(vDataMwt);

        $('#formMwt').on('keyup change', function () {
            $('#btnMwtSubmit').attr('disabled', !formMwtValidate.validateForm());
        });

        $('#modal_work_type').on('hidden.bs.modal', function(){
            formMwtValidate.clearValidation();
        });

        $('#modal_work_type').on('shown.bs.modal', function(){
            $('#btnMwtSubmit').attr('disabled', true);
            if (mwtWorktypeId !== '') {
                $('#lblMwtTitle').html('<i class="far fa-edit"></i> Edit Work Type');
                $('#btnMwtSubmit').html('<i class="fas fa-highlighter"></i> Update');
                ShowLoader();
                setTimeout(function () {
                    try {
                        const dataMwt = mzAjaxRequest('work_type.php?worktypeId='+mwtWorktypeId, 'GET');
                        mzSetFieldValue('MwtDesc', dataMwt['worktypeDesc'], 'text');
                        mzSetFieldValue('MwtStatus', dataMwt['worktypeStatus'], 'checkSingle', '1');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        $('#modal_work_type').modal('hide');
                    }
                    HideLoader();
                }, 300);
            } else {
                $('#lblMwtTitle').html('<i class="fas fa-plus"></i> Add Work Type');
                $('#btnMwtSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
            }
        });

        $('#btnMwtSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMwtValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const statusVal = $("input[name='chkMwtStatus']").is(":checked") ? '1' : '2';
                    const data = {
                        worktypeDesc: $('#txtMwtDesc').val(),
                        worktypeStatus: statusVal
                    };

                    let tempRow = {};
                    if (mwtCallFrom === 'Wkt') {
                        tempRow['worktypeDesc'] = $('#txtMwtDesc').val();
                        tempRow['worktypeStatus'] = statusVal;
                        if (mwtWorktypeId === '') {
                            tempRow['worktypeId'] = mzAjaxRequest('work_type.php?worktypeId='+mwtWorktypeId, 'POST', data);
                            oTableWktWorkType.row.add(tempRow).draw();
                        } else {
                            tempRow['worktypeId'] = mwtWorktypeId;
                            data['action'] = 'update';
                            mzAjaxRequest('work_type.php?worktypeId='+mwtWorktypeId, 'PUT', data);
                            oTableWktWorkType.row(mwtRowRefresh).data(tempRow).draw();
                        }
                    }
                    $('#modal_work_type').modal('hide');
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
        mwtCallFrom = callFrom;
        mwtWorktypeId = '';
        mwtRowRefresh = '';
        $('#btnMwtSubmit').attr('disabled', true);
        $('#modal_work_type').modal({backdrop: 'static', keyboard: false});
    };

    this.edit = function (callFrom, worktypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof worktypeId === 'undefined' || worktypeId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mwtCallFrom = callFrom;
        mwtWorktypeId = worktypeId;
        mwtRowRefresh = rowRefresh;
        $('#btnMwtSubmit').attr('disabled', true);
        $('#modal_work_type').modal({backdrop: 'static', keyboard: false});
    };

    this.deactivate = function (callFrom, worktypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof worktypeId === 'undefined' || worktypeId === '') {
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
                mzAjaxRequest('work_type.php?worktypeId='+worktypeId, 'PUT', {action: 'deactivate'});
                const currentRow = oTableWktWorkType.row(rowRefresh).data();
                let tempRow = {};
                tempRow['worktypeId'] = worktypeId;
                tempRow['worktypeDesc'] = currentRow['worktypeDesc'];
                tempRow['worktypeStatus'] = '2';
                if (callFrom === 'Wkt') {
                    oTableWktWorkType.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.activate = function (callFrom, worktypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof worktypeId === 'undefined' || worktypeId === '') {
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
                mzAjaxRequest('work_type.php?worktypeId='+worktypeId, 'PUT', {action: 'activate'});
                const currentRow = oTableWktWorkType.row(rowRefresh).data();
                let tempRow = {};
                tempRow['worktypeId'] = worktypeId;
                tempRow['worktypeDesc'] = currentRow['worktypeDesc'];
                tempRow['worktypeStatus'] = '1';
                if (callFrom === 'Wkt') {
                    oTableWktWorkType.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.delete = function (callFrom, worktypeId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof worktypeId === 'undefined' || worktypeId === '') {
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
                mzAjaxRequest('work_type.php?worktypeId='+worktypeId, 'DELETE');
                if (callFrom === 'Wkt') {
                    oTableWktWorkType.row(rowRefresh).remove().draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.init();

}