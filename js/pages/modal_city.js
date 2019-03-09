function ModalCity() {

    let mctCallFrom = '';
    let mctCityId = '';
    let mctRefState;

    this.init = function () {
        const refStates = mzGetLocalArray('icon_state', mzGetDataVersion(), 'stateId');
        this.setRefState(refStates);

        $('#optMctStateId').on('change', function () {
            $('#lblMctStateId').html('State *').addClass('active');
        });

        const vDataMct = [
            {
                field_id: 'txtMctDesc',
                type: 'text',
                name: 'Site Name',
                validator: {
                    notEmpty: true,
                    maxLength: 255
                }
            },
            {
                field_id: 'optMctStateId',
                type: 'select',
                name: 'State',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'chkMctStatus',
                type: 'checkSingle',
                name: 'Status',
                validator: {
                }
            }
        ];

        let formMctValidate = new MzValidate('formMct');
        formMctValidate.registerFields(vDataMct);

        $('#formMct').on('keyup change', function () {
            $('#btnMctSubmit').attr('disabled', !formMctValidate.validateForm());
        });

        $('#modal_city').on('hidden.bs.modal', function(){
            formMctValidate.clearValidation();
        });

        $('#modal_city').on('shown.bs.modal', function(){
            $('#btnMctSubmit').attr('disabled', true);
            if (mctCityId !== '') {
                $('#lblMctTitle').html('<i class="far fa-edit"></i> Edit City');
                $('#btnMctSubmit').html('<i class="fas fa-highlighter"></i> Update');
            } else {
                $('#lblMctTitle').html('<i class="fas fa-plus"></i> Add City');
                $('#btnMctSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
                if (mctCallFrom === 'Mst') {
                    $('#chkMctStatus').attr('disabled', true);
                    $('#chkMctStatus').attr('checked', true);
                }
            }
        });

        $('#btnMctSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMctValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const statusVal = $("input[name='chkMctStatus']").is(":checked") ? '1' : '2';
                    const data = {
                        cityDesc: $('#txtMctDesc').val(),
                        stateId: $('#optMctStateId').val(),
                        cityStatus: statusVal
                    };

                    if (mctCallFrom === 'Mst') {
                        if (mctCityId === '') {
                            const cityId = mzAjaxRequest('city.php', 'POST', data);
                            siteClass.afterAddCity(cityId);
                        }
                    }
                    $('#modal_city').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.setRefState = function (refStateSet) {
        mctRefState = refStateSet;
        mzOption('optMctStateId', mctRefState, 'Choose State *', 'stateId', 'stateDesc', {stateStatus: '1'}, 'required');
    };

    this.add = function (callFrom) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mctCallFrom = callFrom;
        mctCityId = '';

        $('#btnMctSubmit').attr('disabled', true);
        $('#modal_city').modal({backdrop: 'static', keyboard: false});
    };

    this.init();

}