function SectionWorkOrderDetails() {

    let wkdCallFrom = '';
    let wkdWorkorderId = '';
    let wkdRefStatus;
    let wkdRefWorktype;
    let wkdRefWorkcategory;
    let wkdRefSite;
    let wkdRefArea;
    let wkdRefCity;
    let wkdRefContractor;
    let formWkdWorkorder;

    this.init = function () {
        $('.sectionWorkOrderDetails').hide();

        $('#optWkdSiteId').on('change', function () {
            $('#lblWkdSiteId').html('Site *').addClass('active');
            $('#optWkdContractorId').html('').removeClass('active');
            mzOption('optWkdContractorId', wkdRefContractor, 'Contractor *', 'contractorId', 'contractorName', {sites: ('#'+$(this).val()), contractorStatus: '1'}, 'required');
        });

        $('#optWkdAreaId').on('change', function () {
            $('#lblWkdAreaId').html('Area *').addClass('active');
            $('#optWkdSiteId').html('').removeClass('active');
            $('#optWkdContractorId').html('').removeClass('active');
            mzOption('optWkdSiteId', wkdRefSite, 'Site *', 'siteId', 'siteDesc', {areaId: $(this).val(), siteStatus: '1'}, 'required');
            mzOption('optWkdContractorId', wkdRefContractor, 'Contractor (Select Site 1st) *', 'contractorId', 'contractorName', {siteId: '', contractorStatus: '1'}, 'required');
        });

        $('#optWkdCityId').on('change', function () {
            $('#lblWkdCityId').html('City *').addClass('active');
            $('#optWkdAreaId').html('').removeClass('active');
            $('#optWkdSiteId').html('').removeClass('active');
            $('#optWkdContractorId').html('').removeClass('active');
            mzOption('optWkdAreaId', wkdRefArea, 'Area *', 'areaId', 'areaDesc', {cityId: $(this).val(), areaStatus: '1'}, 'required');
            mzOption('optWkdSiteId', wkdRefSite, 'Site (Select Area 1st) *', 'siteId', 'siteDesc', {areaId: '', siteStatus: '1'}, 'required');
            mzOption('optWkdContractorId', wkdRefContractor, 'Contractor (Select Site 1st) *', 'contractorId', 'contractorName', {siteId: '', contractorStatus: '1'}, 'required');
        });

        $('#optWkdContractorId').on('change', function () {
            $('#lblWkdContractorId').html('Contractor *').addClass('active');
        });

        $('#optWkdWorkorderSiteType').on('change', function () {
            $('#lblWkdWorkorderSiteType').html('Site Type *').addClass('active');
        });

        $('#optWkdWorktypeId').on('change', function () {
            $('#lblWkdWorktypeId').html('Work Type *').addClass('active');
            $('#lblWkdWorkcategoryId').html('').removeClass('active');
            mzOption('optWkdWorkcategoryId', wkdRefWorkcategory, 'Work Category *', 'workcategoryId', 'workcategoryDesc', {worktypeId: $(this).val(), workcategoryStatus: '1'}, 'required');
        });

        $('#optWkdWorkcategoryId').on('change', function () {
            $('#lblWkdWorkcategoryId').html('Work Category *').addClass('active');
        });

        versionLocal = mzGetDataVersion();
        wkdRefStatus = mzGetLocalArray('icon_status', versionLocal, 'statusId');
        wkdRefWorktype = mzGetLocalArray('icon_worktype', versionLocal, 'worktypeId');
        wkdRefWorkcategory = mzGetLocalArray('icon_workcategory', versionLocal, 'workcategoryId');
        wkdRefSite = mzGetLocalArray('icon_site', versionLocal, 'siteId');
        wkdRefArea = mzGetLocalArray('icon_area', versionLocal, 'areaId');
        wkdRefCity = mzGetLocalArray('icon_city', versionLocal, 'cityId');
        wkdRefContractor = mzGetLocalArray('icon_contractor', versionLocal, 'contractorId');

        const vDataWkd = [
            {
                field_id: 'optWkdSiteId',
                type: 'select',
                name: 'Site',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optWkdAreaId',
                type: 'select',
                name: 'Area',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optWkdCityId',
                type: 'select',
                name: 'City',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdWorkorderNo',
                type: 'text',
                name: 'Work Order No.',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdWorkorderStatusDesc',
                type: 'text',
                name: 'Work Status',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdRequesterName',
                type: 'text',
                name: 'Requester',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdWorkorderDateComplaint',
                type: 'text',
                name: 'Date',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdRequesterPhone',
                type: 'text',
                name: 'Phone Number',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdWorkorderTimeComplaint',
                type: 'text',
                name: 'Received Time',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optWkdContractorId',
                type: 'select',
                name: 'Contractor',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optWkdWorkorderSiteType',
                type: 'select',
                name: 'Site Type',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optWkdWorktypeId',
                type: 'select',
                name: 'Work Type',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optWkdWorkcategoryId',
                type: 'select',
                name: 'Work Category',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtWkdWorkorderBlock',
                type: 'text',
                name: 'Block',
                validator: {
                    maxLength: 20
                }
            },
            {
                field_id: 'txtWkdWorkorderLevel',
                type: 'text',
                name: 'Level',
                validator: {
                    maxLength: 10
                }
            },
            {
                field_id: 'txtWkdWorkorderUnit',
                type: 'text',
                name: 'Unit',
                validator: {
                    maxLength: 10
                }
            },
            {
                field_id: 'txaWkdWorkorderDesc',
                type: 'textarea',
                name: 'Problem Description',
                validator: {
                    notEmpty: true,
                    maxLength: 1000
                }
            },
            {
                field_id: 'txaWkdWorkorderLocationDesc',
                type: 'textarea',
                name: 'Other Location Description',
                validator: {
                    maxLength: 500
                }
            }
        ];

        formWkdWorkorder = new MzValidate('formWkd');
        formWkdWorkorder.registerFields(vDataWkd);

        $('#formWkd').on('keyup change', function () {
            $('#butWkdSubmit').attr('disabled', !formWkdWorkorder.validateForm());
        });

        $('#butWkdSave').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    const data = {
                        action: 'save_workorder',
                        siteId: $('#optWkdSiteId').val(),
                        areaId: $('#optWkdAreaId').val(),
                        cityId: $('#optWkdCityId').val(),
                        contractorId: $('#optWkdContractorId').val(),
                        worktypeId: $('#optWkdWorktypeId').val(),
                        workorderSiteType: $('#optWkdWorkorderSiteType').val(),
                        workcategoryId: $('#optWkdWorkcategoryId').val(),
                        workorderDesc: $('#txaWkdWorkorderDesc').val(),
                        workorderBlock: $('#txtWkdWorkorderBlock').val(),
                        workorderLevel: $('#txtWkdWorkorderLevel').val(),
                        workorderUnit: $('#txtWkdWorkorderUnit').val(),
                        workorderLocationDesc: $('#txaWkdWorkorderLocationDesc').val()
                    };
                    mzAjaxRequest('workorder.php?workorderId='+wkdWorkorderId, 'PUT', data);
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });

        $('#butWkdSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formWkdWorkorder.validateForm()) {
                        throw new Error(_ALERT_MSG_VALIDATION);
                    }

                    const data = {
                        action: 'save_workorder2',
                        siteId: $('#optWkdSiteId').val(),
                        areaId: $('#optWkdAreaId').val(),
                        cityId: $('#optWkdCityId').val(),
                        contractorId: $('#optWkdContractorId').val(),
                        worktypeId: $('#optWkdWorktypeId').val(),
                        workorderSiteType: $('#optWkdWorkorderSiteType').val(),
                        workcategoryId: $('#optWkdWorkcategoryId').val(),
                        workorderDesc: $('#txaWkdWorkorderDesc').val(),
                        workorderBlock: $('#txtWkdWorkorderBlock').val(),
                        workorderLevel: $('#txtWkdWorkorderLevel').val(),
                        workorderUnit: $('#txtWkdWorkorderUnit').val(),
                        workorderLocationDesc: $('#txaWkdWorkorderLocationDesc').val()
                    };
                    mzAjaxRequest('workorder.php?workorderId='+wkdWorkorderId, 'PUT', data);

                    if (wkdCallFrom === 'tck') {
                        confirmSubmitClass.submit('tck', 'submit_workorder');
                    }
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.load = function (callFrom, workorderId, ticketId) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof workorderId === 'undefined') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        wkdCallFrom = callFrom;
        wkdWorkorderId = workorderId;

        formWkdWorkorder.clearValidation();
        $('.divWkdPartDetails, .divWkdLabourDetails, .divWkdPictures, .divWkdAction').hide();

        if (wkdWorkorderId === '') {
            if (typeof ticketId === 'undefined' || ticketId === '') {
                toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
                return false;
            }
            ShowLoader();
            setTimeout(function () {
                try {
                    const data = {
                        action: 'create_id_temp',
                        ticketId: ticketId
                    };
                    wkdWorkorderId = mzAjaxRequest('workorder.php', 'POST', data);
                    this.extractDetails();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        } else {
            this.extractDetails();
        }
        $('.sectionWorkOrderDetails').show();
    };

    this.submitWorkorder = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzAjaxRequest('workorder.php?workorderId='+wkdWorkorderId, 'PUT', {action: 'submit_workorder'});
                if (wkdCallFrom === 'tck') {
                    mzAjaxRequest('ticket.php', 'GET', {Reportid: '1', 'Cache-Control': 'no-cache, no-transform'}, 'displayChart()');
                    genTableTck();
                    $('.sectionTkdDetails, .sectionWorkOrderDetails').hide();
                    $('.sectionTckMain').show();
                    $(window).scrollTop(0);
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.extractDetails = function () {
        const dataWkdWorkorder = mzAjaxRequest('workorder.php?workorderId='+wkdWorkorderId, 'GET');

        if (dataWkdWorkorder['workorderStatus'] === '5') {
            mzOption('optWkdWorktypeId', wkdRefWorktype, 'Work Type *', 'worktypeId', 'worktypeDesc', {worktypeStatus: '1'}, 'required');
            mzOption('optWkdWorkcategoryId', wkdRefWorkcategory, 'Work Category '+(dataWkdWorkorder['worktypeId']===''?'(Select Work Type 1st) *':'*'), 'workcategoryId', 'workcategoryDesc', {worktypeId: dataWkdWorkorder['worktypeId'], workcategoryStatus: '1'}, 'required');
            mzOption('optWkdCityId', wkdRefCity, 'City *', 'cityId', 'cityDesc', {cityStatus: '1'}, 'required');
            mzOption('optWkdAreaId', wkdRefArea, 'Area '+(dataWkdWorkorder['cityId']===''?'(Select Work Type 1st) *':'*'), 'areaId', 'areaDesc', {cityId: dataWkdWorkorder['cityId'], areaStatus: '1'}, 'required');
            mzOption('optWkdSiteId', wkdRefSite, 'Site '+(dataWkdWorkorder['areaId']===''?'(Select Work Type 1st) *':'*'), 'siteId', 'siteDesc', {areaId: dataWkdWorkorder['areaId'], siteStatus: '1'}, 'required');
            mzOption('optWkdContractorId', wkdRefContractor, 'Contractor '+(dataWkdWorkorder['siteId']===''?'(Select Site 1st) *':'*'), 'contractorId', 'contractorName', {sites: '#'+dataWkdWorkorder['siteId'], contractorStatus: '1'}, 'required');
        } else {
            mzOption('optWkdWorktypeId', wkdRefWorktype, 'Work Type *', 'worktypeId', 'worktypeDesc');
            mzOption('optWkdWorkcategoryId', wkdRefWorkcategory, 'Work Category *', 'workcategoryId', 'workcategoryDesc');
            mzOption('optWkdCityId', wkdRefCity, 'City *', 'cityId', 'cityDesc');
            mzOption('optWkdAreaId', wkdRefArea, 'Area *', 'areaId', 'areaDesc');
            mzOption('optWkdSiteId', wkdRefSite, 'Site *', 'siteId', 'siteDesc');
            mzOption('optWkdContractorId', wkdRefContractor, 'Contractor *', 'contractorId', 'contractorName');
        }
        mzSetFieldValue('WkdWorkorderNo', dataWkdWorkorder['workorderNo'], 'text', 'Work Order No.');
        mzSetFieldValue('WkdSiteId', dataWkdWorkorder['siteId'], 'select', 'Site *');
        mzSetFieldValue('WkdAreaId', dataWkdWorkorder['areaId'], 'select', 'Area *');
        mzSetFieldValue('WkdCityId', dataWkdWorkorder['cityId'], 'select', 'City *');
        mzSetFieldValue('WkdWorktypeId', dataWkdWorkorder['worktypeId'], 'select', 'Work Type *');
        mzSetFieldValue('WkdWorkcategoryId', dataWkdWorkorder['workcategoryId'], 'select', 'Work Category *');
        mzSetFieldValue('WkdContractorId', dataWkdWorkorder['contractorId'], 'select', 'Contractor *');
        mzSetFieldValue('WkdWorkorderSiteType', dataWkdWorkorder['workorderSiteType'], 'select', 'Site Type *');
        mzSetFieldValue('WkdRequesterName', dataWkdWorkorder['requesterName'], 'text', 'Requester');
        mzSetFieldValue('WkdRequesterPhone', dataWkdWorkorder['requesterPhone'], 'text', 'Phone Number');
        mzSetFieldValue('WkdWorkorderBlock', dataWkdWorkorder['workorderBlock'], 'text', 'Block');
        mzSetFieldValue('WkdWorkorderLevel', dataWkdWorkorder['workorderLevel'], 'text', 'Level');
        mzSetFieldValue('WkdWorkorderUnit', dataWkdWorkorder['workorderUnit'], 'text', 'Unit');
        mzSetFieldValue('WkdWorkorderDesc', dataWkdWorkorder['workorderDesc'], 'textarea', 'Problem Description *');
        mzSetFieldValue('WkdWorkorderLocationDesc', dataWkdWorkorder['workorderLocationDesc'], 'textarea', 'Other Location Description');
        mzSetFieldValue('WkdWorkorderDateComplaint', mzConvertDateDisplay(dataWkdWorkorder['workorderTimeComplaint'].substr(0,10)), 'text', 'Date');
        mzSetFieldValue('WkdWorkorderTimeComplaint', mzConvertTimeDisplay(dataWkdWorkorder['workorderTimeComplaint'].substr(11)), 'text', 'Received Time');
        mzSetFieldValue('WkdWorkorderStatusDesc', wkdRefStatus[dataWkdWorkorder['workorderStatus']]['statusDesc'], 'text', 'Work Status');

        $('#formWkd').find('input, textarea, select').attr('disabled', true);

        if (dataWkdWorkorder['workorderStatus'] === '5') {
            $('#txaWkdWorkorderDesc, #txtWkdWorkorderBlock, #txtWkdWorkorderLevel, #txtWkdWorkorderUnit, #txaWkdWorkorderLocationDesc').prop('disabled', false);
            mzDisableSelect('optWkdSiteId', false);
            mzDisableSelect('optWkdAreaId', false);
            mzDisableSelect('optWkdCityId', false);
            mzDisableSelect('optWkdContractorId', false);
            mzDisableSelect('optWkdWorkorderSiteType', false);
            mzDisableSelect('optWkdWorktypeId', false);
            mzDisableSelect('optWkdWorkcategoryId', false);
            $('#butWkdSubmit').attr('disabled', true);

            $('.divWkdAction').show();
        }
    };

    this.hide = function () {
        $('.sectionWorkOrderDetails').hide();
    };

    this.init();
}