function ModalSiteAdd() {

    let msxCallFrom = '';
    let msxRowRefresh = '';
    let msxSiteId = '';
    let msxClassFrom;
    let msxRefSite;
    let msxRefArea;
    let msxRefCity;

    this.init = function () {
        $('#optMsxCityId').on('change', function () {
            $('#lblMsxCityId').html('City *').addClass('active');
            $('#lblMsxAreaId').html('').removeClass('active');
            $('#lblMsxSiteId').html('').removeClass('active');
            mzOption('optMsxAreaId', msxRefArea, 'Area *', 'areaId', 'areaDesc', {cityId: $(this).val(), areaStatus: '1'}, 'required');
            mzOption('optMsxSiteId', msxRefSite, 'Site (Select Area 1st) *', 'siteId', 'siteDesc', {areaId: '', siteStatus: '1'}, 'required');
        });

        $('#optMsxAreaId').on('change', function () {
            $('#lblMsxAreaId').html('Area *').addClass('active');
            $('#lblMsxSiteId').html('').removeClass('active');
            mzOption('optMsxSiteId', msxRefSite, 'Site *', 'siteId', 'siteDesc', {areaId: $(this).val(), siteStatus: '1'}, 'required');
        });

        $('#optMsxSiteId').on('change', function () {
            $('#lblMsxSiteId').html('Site *').addClass('active');
        });

        const vDataMsx = [
            {
                field_id: 'optMsxCityId',
                type: 'select',
                name: 'City',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optMsxAreaId',
                type: 'select',
                name: 'Area',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optMsxSiteId',
                type: 'select',
                name: 'Site',
                validator: {
                    notEmpty: true
                }
            }
        ];

        let formMsxValidate = new MzValidate('formMsx');
        formMsxValidate.registerFields(vDataMsx);

        $('#formMsx').on('keyup change', function () {
            $('#btnMsxSubmit').attr('disabled', !formMsxValidate.validateForm());
        });

        $('#modal_site_add').on('hidden.bs.modal', function(){
            formMsxValidate.clearValidation();
        });

        $('#modal_site_add').on('shown.bs.modal', function(){
            $('#btnMsxSubmit').attr('disabled', true);
            if (msxSiteId === '') {
                $('#lblMsxTitle').html('<i class="fas fa-plus"></i> Add Contractor Site');
                $('#btnMsxSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
            }
        });

        $('#btnMsxSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMsxValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const data = {
                        action: 'add_contractor_site',
                        contractorId: msxClassFrom.getCtdContractorId(),
                        siteId: $('#optMsxSiteId').val()
                    };

                    if (msxCallFrom === 'ctr') {
                        const contractorSiteId = mzAjaxRequest('contractor.php', 'POST', data);
                        msxClassFrom.addDataTableSite(contractorSiteId, $('#optMsxSiteId').val());
                    }
                    $('#modal_site_add').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.setClassFrom = function (classFrom) {
        msxClassFrom = classFrom;
    };

    this.setRefSite = function (refSiteSet) {
        msxRefSite = refSiteSet;
    };

    this.setRefArea = function (refAreaSet) {
        msxRefArea = refAreaSet;
    };

    this.setRefCity = function (refCitySet) {
        msxRefCity = refCitySet;
        mzOption('optMsxCityId', msxRefCity, 'City *', 'cityId', 'cityDesc', {cityStatus: '1'}, 'required');
    };

    this.add = function (callFrom) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        msxCallFrom = callFrom;
        msxSiteId = '';
        msxRowRefresh = '';

        mzOption('optMsxAreaId', msxRefArea, 'Area (Select City 1st) *', 'areaId', 'areaDesc', {cityId: '', areaStatus: '1'}, 'required');
        mzOption('optMsxSiteId', msxRefSite, 'Site (Select Area 1st) *', 'siteId', 'siteDesc', {areaId: '', siteStatus: '1'}, 'required');
        $('#btnMsxSubmit').attr('disabled', true);
        $('#modal_site_add').modal({backdrop: 'static', keyboard: false});
    };

    this.delete = function (callFrom, contractorSiteId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof contractorSiteId === 'undefined' || contractorSiteId === '') {
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
                mzAjaxRequest('contractor.php?contractorSiteId='+contractorSiteId, 'DELETE');
                if (callFrom === 'ctd') {
                    msxClassFrom.deleteDataTableSite(rowRefresh);
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.init();
}