function ModalWorkCategory() {

    let mwcCallFrom = '';
    let mwcWorkcategoryId = '';
    let mwcRowRefresh = '';
    let mwcRefWorktype;

    this.init = function () {
        $('#optMwcWorktypeId').on('change', function () {
            $('#lblMwcWorktypeId').html('Work Type *').addClass('active');
        });

        const vDataMwc = [
            {
                field_id: 'txtMwcDesc',
                type: 'text',
                name: 'Work Category',
                validator: {
                    notEmpty: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'optMwcWorktypeId',
                type: 'select',
                name: 'Work Type',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'chkMwcStatus',
                type: 'checkSingle',
                name: 'Status',
                validator: {
                }
            }
        ];

        let formMwcValidate = new MzValidate('formMwc');
        formMwcValidate.registerFields(vDataMwc);

        $('#formMwc').on('keyup change', function () {
            $('#btnMwcSubmit').attr('disabled', !formMwcValidate.validateForm());
        });

        $('#modal_work_category').on('hidden.bs.modal', function(){
            formMwcValidate.clearValidation();
        });

        $('#modal_work_category').on('shown.bs.modal', function(){
            $('#btnMwcSubmit').attr('disabled', true);
            if (mwcWorkcategoryId !== '') {
                $('#lblMwcTitle').html('<i class="far fa-edit"></i> Edit Work Category');
                $('#btnMwcSubmit').html('<i class="fas fa-highlighter"></i> Update');
                ShowLoader();
                setTimeout(function () {
                    try {
                        const dataMwc = mzAjaxRequest('work_category.php?workcategoryId='+mwcWorkcategoryId, 'GET');
                        mzSetFieldValue('MwcDesc', dataMwc['workcategoryDesc'], 'text');
                        mzSetFieldValue('MwcWorktypeId', dataMwc['worktypeId'], 'select', 'Work Type');
                        mzSetFieldValue('MwcStatus', dataMwc['workcategoryStatus'], 'checkSingle', '1');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        $('#modal_work_category').modal('hide');
                    }
                    HideLoader();
                }, 300);
            } else {
                $('#lblMwcTitle').html('<i class="fas fa-plus"></i> Add Work Category');
                $('#btnMwcSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
            }
        });

        $('#btnMwcSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMwcValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const statusVal = $("input[name='chkMwcStatus']").is(":checked") ? '1' : '2';
                    const data = {
                        workcategoryDesc: $('#txtMwcDesc').val(),
                        worktypeId: $('#optMwcWorktypeId').val(),
                        workcategoryStatus: statusVal
                    };

                    let tempRow = {};
                    if (mwcCallFrom === 'Wkc') {
                        tempRow['workcategoryDesc'] = $('#txtMwcDesc').val();
                        tempRow['worktypeId'] = $('#optMwcWorktypeId').val();
                        tempRow['workcategoryStatus'] = statusVal;
                        if (mwcWorkcategoryId === '') {
                            tempRow['workcategoryId'] = mzAjaxRequest('work_category.php', 'POST', data);
                            oTableWkcWorkCategory.row.add(tempRow).draw();
                        } else {
                            tempRow['workcategoryId'] = mwcWorkcategoryId;
                            data['action'] = 'update';
                            mzAjaxRequest('work_category.php?workcategoryId='+mwcWorkcategoryId, 'PUT', data);
                            oTableWkcWorkCategory.row(mwcRowRefresh).data(tempRow).draw();
                        }
                    }
                    $('#modal_work_category').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.setRefWorktype = function (refWorktype) {
        mwcRefWorktype = refWorktype;
    };

    this.add = function (callFrom) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mwcCallFrom = callFrom;
        mwcWorkcategoryId = '';
        mwcRowRefresh = '';

        mzOption('optMwcWorktypeId', mwcRefWorktype, 'Choose Work Type *', 'worktypeId', 'worktypeDesc', {worktypeStatus: '1'}, 'required');
        $('#btnMwcSubmit').attr('disabled', true);
        $('#modal_work_category').modal({backdrop: 'static', keyboard: false});
    };

    this.edit = function (callFrom, workcategoryId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof workcategoryId === 'undefined' || workcategoryId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mwcCallFrom = callFrom;
        mwcWorkcategoryId = workcategoryId;
        mwcRowRefresh = rowRefresh;

        mzOption('optMwcWorktypeId', mwcRefWorktype, 'Choose Work Type *', 'worktypeId', 'worktypeDesc', [], 'required');
        $('#btnMwcSubmit').attr('disabled', true);
        $('#modal_work_category').modal({backdrop: 'static', keyboard: false});
    };

    this.deactivate = function (callFrom, workcategoryId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof workcategoryId === 'undefined' || workcategoryId === '') {
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
                mzAjaxRequest('work_category.php?workcategoryId='+workcategoryId, 'PUT', {action: 'deactivate'});
                const currentRow = oTableWkcWorkCategory.row(rowRefresh).data();
                let tempRow = {};
                tempRow['workcategoryId'] = workcategoryId;
                tempRow['workcategoryDesc'] = currentRow['workcategoryDesc'];
                tempRow['worktypeId'] = currentRow['worktypeId'];
                tempRow['workcategoryStatus'] = '2';
                if (callFrom === 'Wkc') {
                    oTableWkcWorkCategory.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.activate = function (callFrom, workcategoryId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof workcategoryId === 'undefined' || workcategoryId === '') {
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
                mzAjaxRequest('work_category.php?workcategoryId='+workcategoryId, 'PUT', {action: 'activate'});
                const currentRow = oTableWkcWorkCategory.row(rowRefresh).data();
                let tempRow = {};
                tempRow['workcategoryId'] = workcategoryId;
                tempRow['workcategoryDesc'] = currentRow['workcategoryDesc'];
                tempRow['worktypeId'] = currentRow['worktypeId'];
                tempRow['workcategoryStatus'] = '1';
                if (callFrom === 'Wkc') {
                    oTableWkcWorkCategory.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.delete = function (callFrom, workcategoryId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof workcategoryId === 'undefined' || workcategoryId === '') {
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
                mzAjaxRequest('work_category.php?workcategoryId='+workcategoryId, 'DELETE');
                if (callFrom === 'Wkc') {
                    oTableWkcWorkCategory.row(rowRefresh).remove().draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.init();

}