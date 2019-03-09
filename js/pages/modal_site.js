function ModalSite(_areaClass, _cityClass) {

    if (typeof _areaClass !== 'object') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (typeof _cityClass !== 'object') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }

    let mstCallFrom = '';
    let mstSiteId = '';
    let mstRowRefresh = '';
    let mstRefArea;
    let mstRefCity;
    let mstAreaClass = _areaClass;
    let mstCityClass = _cityClass;

    this.init = function () {
        $('#optMstCityId').on('change', function () {
            $('#lblMstCityId').html('City *').addClass('active');
            mzOption('optMstAreaId', mstRefArea, 'Choose Area *', 'areaId', 'areaDesc', {cityId: $(this).val(), areaStatus: '1'}, 'required');
        });

        $('#optMstAreaId').on('change', function () {
            $('#lblMstAreaId').html('Area *').addClass('active');
        });

        const vDataMst = [
            {
                field_id: 'txtMstDesc',
                type: 'text',
                name: 'Site Name',
                validator: {
                    notEmpty: true,
                    maxLength: 255
                }
            },
            {
                field_id: 'optMstCityId',
                type: 'select',
                name: 'City',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optMstAreaId',
                type: 'select',
                name: 'Area',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'chkMstStatus',
                type: 'checkSingle',
                name: 'Status',
                validator: {
                }
            }
        ];

        let formMstValidate = new MzValidate('formMst');
        formMstValidate.registerFields(vDataMst);

        $('#formMst').on('keyup change', function () {
            $('#btnMstSubmit').attr('disabled', !formMstValidate.validateForm());
        });

        $('#lnkMstAddCity').on('click', function () {
            mstCityClass.add('Mst');
        });

        $('#lnkMstAddArea').on('click', function () {
            mstAreaClass.add('Mst', $('#optMstCityId').val());
        });

        $('#modal_site').on('hidden.bs.modal', function(){
            formMstValidate.clearValidation();
        });

        $('#modal_site').on('shown.bs.modal', function(){
            $('#btnMstSubmit').attr('disabled', true);
            if (mstSiteId !== '') {
                $('#lblMstTitle').html('<i class="far fa-edit"></i> Edit Site');
                $('#btnMstSubmit').html('<i class="fas fa-highlighter"></i> Update');
                ShowLoader();
                setTimeout(function () {
                    try {
                        const dataMst = mzAjaxRequest('site.php?siteId='+mstSiteId, 'GET');
                        const cityId = mstRefArea[dataMst['areaId']]['cityId'];

                        mzOption('optMstAreaId', mstRefArea, 'Choose Area *', 'areaId', 'areaDesc', {cityId: cityId}, 'required');
                        mzSetFieldValue('MstDesc', dataMst['siteDesc'], 'text');
                        mzSetFieldValue('MstCityId', cityId, 'select', 'Area');
                        mzSetFieldValue('MstAreaId', dataMst['areaId'], 'select', 'Area');
                        mzSetFieldValue('MstStatus', dataMst['siteStatus'], 'checkSingle', '1');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                        $('#modal_site').modal('hide');
                    }
                    HideLoader();
                }, 300);
            } else {
                $('#lblMstTitle').html('<i class="fas fa-plus"></i> Add Site');
                $('#btnMstSubmit').html('<i class="far fa-paper-plane ml-1"></i> Submit');
            }
        });

        $('#btnMstSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formMstValidate.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }
                    const statusVal = $("input[name='chkMstStatus']").is(":checked") ? '1' : '2';
                    const data = {
                        siteDesc: $('#txtMstDesc').val(),
                        areaId: $('#optMstAreaId').val(),
                        siteStatus: statusVal
                    };

                    let tempRow = {};
                    if (mstCallFrom === 'Ste') {
                        tempRow['siteDesc'] = $('#txtMstDesc').val();
                        tempRow['areaId'] = $('#optMstAreaId').val();
                        tempRow['siteStatus'] = statusVal;
                        if (mstSiteId === '') {
                            tempRow['siteId'] = mzAjaxRequest('site.php', 'POST', data);
                            oTableSteSite.row.add(tempRow).draw();
                        } else {
                            tempRow['siteId'] = mstSiteId;
                            data['action'] = 'update';
                            mzAjaxRequest('site.php?siteId='+mstSiteId, 'PUT', data);
                            oTableSteSite.row(mstRowRefresh).data(tempRow).draw();
                        }
                    }
                    $('#modal_site').modal('hide');
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.setRefArea = function (refAreaSet) {
        mstRefArea = refAreaSet;
    };

    this.setRefCity = function (refCitySet) {
        mstRefCity = refCitySet;
        mzOption('optMstCityId', mstRefCity, 'Choose City *', 'cityId', 'cityDesc', {cityStatus: '1'}, 'required');
    };

    this.add = function (callFrom) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mstCallFrom = callFrom;
        mstSiteId = '';
        mstRowRefresh = '';

        $('#btnMstSubmit').attr('disabled', true);
        $('#modal_site').modal({backdrop: 'static', keyboard: false});
    };

    this.edit = function (callFrom, siteId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof siteId === 'undefined' || siteId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mstCallFrom = callFrom;
        mstSiteId = siteId;
        mstRowRefresh = rowRefresh;

        $('#btnMstSubmit').attr('disabled', true);
        $('#modal_site').modal({backdrop: 'static', keyboard: false});
    };

    this.deactivate = function (callFrom, siteId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof siteId === 'undefined' || siteId === '') {
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
                mzAjaxRequest('site.php?siteId='+siteId, 'PUT', {action: 'deactivate'});
                const currentRow = oTableSteSite.row(rowRefresh).data();
                let tempRow = {};
                tempRow['siteId'] = siteId;
                tempRow['siteDesc'] = currentRow['siteDesc'];
                tempRow['areaId'] = currentRow['areaId'];
                tempRow['siteStatus'] = '2';
                if (callFrom === 'Ste') {
                    oTableSteSite.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.activate = function (callFrom, siteId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof siteId === 'undefined' || siteId === '') {
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
                mzAjaxRequest('site.php?siteId='+siteId, 'PUT', {action: 'activate'});
                const currentRow = oTableSteSite.row(rowRefresh).data();
                let tempRow = {};
                tempRow['siteId'] = siteId;
                tempRow['siteDesc'] = currentRow['siteDesc'];
                tempRow['areaId'] = currentRow['areaId'];
                tempRow['siteStatus'] = '1';
                if (callFrom === 'Ste') {
                    oTableSteSite.row(rowRefresh).data(tempRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.delete = function (callFrom, siteId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof siteId === 'undefined' || siteId === '') {
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
                mzAjaxRequest('site.php?siteId='+siteId, 'DELETE');
                if (callFrom === 'Ste') {
                    oTableSteSite.row(rowRefresh).remove().draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.afterAddArea = function (areaId, cityId) {
        refArea = mzGetLocalArray('icon_area', mzGetDataVersion(), 'areaId');
        this.setRefArea(refArea);
        mzOption('optMstAreaId', mstRefArea, 'Choose Area *', 'areaId', 'areaDesc', {cityId: cityId}, 'required');
        mzSetFieldValue('MstAreaId', areaId, 'select', 'Area');
    };

    this.afterAddCity = function (cityId) {
        refCity = mzGetLocalArray('icon_city', mzGetDataVersion(), 'cityId');
        this.setRefCity(refCity);
        _areaClass.setRefCity(refCity);
        mzOption('optMstCityId', mstRefCity, 'Choose City *', 'cityId', 'cityDesc', {cityStatus: '1'}, 'required');
        mzSetFieldValue('MstCityId', cityId, 'select', 'City');
    };

    this.init();

}