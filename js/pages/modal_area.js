function ModalArea() {

    let mraCallFrom = '';
    let mraAreaId = '';
    let mraCityId = '';
    let mraRefCity;

    this.init = function () {
        $('#optMraCityId').on('change', function () {
            $('#lblMraCityId').html('City *').addClass('active');
        });

        const vDataMra = [
            {
                field_id: 'txtMraDesc',
                type: 'text',
                name: 'Site Name',
                validator: {
                    notEmpty: true,
                    maxLength: 255
                }
            },
            {
                field_id: 'optMraCityId',
                type: 'select',
                name: 'City',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'chkMraStatus',
                type: 'checkSingle',
                name: 'Status',
                validator: {
                }
            }
        ];

        let formMraValidate = new MzValidate('formMra');
        formMraValidate.registerFields(vDataMra);

        $('#formMra').on('keyup change', function () {
            $('#btnMraSubmit').attr('disabled', !formMraValidate.validateForm());
        });

        $('#modal_area').on('hidden.bs.modal', function(){
            formMraValidate.clearValidation();
        });

        $('#modal_area').on('shown.bs.modal', function(){
            $('#btnMraSubmit').attr('disabled', true);
            if (mraAreaId !== '') {
                $('#lblMraTitle').html('<i class="far fa-edit"></i> Edit Area');
                $('#btnMraSubmit').html('<i class="fas fa-highlighter"></i> Update');
            } else {
                $('#lblMraTitle').html('<i class="fas fa-plus"></i> Add Area');
                $('#btnMraSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
                if (mraCallFrom === 'Mst') {
                    $('#optMraCityId, #chkMraStatus').attr('disabled', true);
                    $('#chkMraStatus').attr('checked', true);
                    mzSetFieldValue('MraCityId', mraCityId, 'select', 'Area');
                }
            }
        });

        $('#btnMraSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMraValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const statusVal = $("input[name='chkMraStatus']").is(":checked") ? '1' : '2';
                    const data = {
                        areaDesc: $('#txtMraDesc').val(),
                        cityId: $('#optMraCityId').val(),
                        areaStatus: statusVal
                    };

                    if (mraCallFrom === 'Mst') {
                        if (mraAreaId === '') {
                            const areaId = mzAjaxRequest('area.php', 'POST', data);
                            siteClass.afterAddArea(areaId, mraCityId);
                        }
                    }
                    $('#modal_area').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.setRefCity = function (refCitySet) {
        mraRefCity = refCitySet;
        mzOption('optMraCityId', mraRefCity, 'Choose City *', 'cityId', 'cityDesc', {cityStatus: '1'}, 'required');
    };

    this.add = function (callFrom, cityId) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (callFrom === 'Mst' && (typeof cityId === 'undefined' || cityId === '')) {
            toastr['error'](_ALERT_MSG_ERROR_SITE_NOCITY, _ALERT_TITLE_ERROR);
            return false;
        }
        mraCallFrom = callFrom;
        mraAreaId = '';
        mraCityId = cityId;

        $('#btnMraSubmit').attr('disabled', true);
        $('#modal_area').modal({backdrop: 'static', keyboard: false});
    };

    this.init();

}