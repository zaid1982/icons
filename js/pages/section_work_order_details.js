function SectionWorkOrderDetails() {

    let wkdCallFrom = '';
    let wkdWorkorderId = '';
    let wkdRefStatus;
    let wkdRefWorktype;
    let wkdRefWorkcategory;
    let wkdRefSite;
    let wkdRefArea;
    let wkdRefCity;

    this.init = function () {
        $('.sectionWorkOrderDetails').hide();

        $('#optWkdSiteId').on('change', function () {
            $('#lblWkdSiteId').html('Site *').addClass('active');
        });

        $('#optWkdAreaId').on('change', function () {
            $('#lblWkdAreaId').html('Area *').addClass('active');
            mzOption('optWkdSiteId', wkdRefSite, 'Choose Site *', 'siteId', 'siteDesc', {areaId: $(this).val(), siteStatus: '1'}, 'required');
        });

        $('#optWkdCityId').on('change', function () {
            $('#lblWkdCityId').html('City *').addClass('active');
            mzOption('optWkdAreaId', wkdRefArea, 'Choose Area *', 'areaId', 'areaDesc', {cityId: $(this).val(), areaStatus: '1'}, 'required');
            mzOption('optWkdSiteId', wkdRefSite, 'Choose Site *', 'siteId', 'siteDesc', {areaId: '', siteStatus: '1'}, 'required');
        });

        $('#optWkdContractorId').on('change', function () {
            $('#lblWkdContractorId').html('Contractor *').addClass('active');
        });

        $('#optWkdWorkorderSiteType').on('change', function () {
            $('#lblWkdWorkorderSiteType').html('Site Type *').addClass('active');
        });

        $('#optWkdWorktypeId').on('change', function () {
            $('#lblWkdWorktypeId').html('Work Type *').addClass('active');
            mzOption('optWkdWorkcategoryId', wkdRefWorkcategory, 'Choose Work Category *', 'workcategoryId', 'workcategoryDesc', {worktypeId: $(this).val(), workcategoryStatus: '1'}, 'required');
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

    this.extractDetails = function () {
        const dataWkdWorkorder = mzAjaxRequest('workorder.php?workorderId='+wkdWorkorderId, 'GET');

        let worktypeId = '';
        if (dataWkdWorkorder['workcategoryId'] !== '') {
            worktypeId = wkdRefWorkcategory[dataWkdWorkorder['workcategoryId']]['worktypeId'];
        }
        if (dataWkdWorkorder['workorderStatus'] === '5') {
            mzOption('optWkdWorktypeId', wkdRefWorktype, 'Choose Work Type *', 'worktypeId', 'worktypeDesc', {worktypeStatus: '1'}, 'required');
            mzOption('optWkdWorkcategoryId', wkdRefWorkcategory, 'Choose Work Category *', 'workcategoryId', 'workcategoryDesc', {worktypeId: worktypeId, workcategoryStatus: '1'}, 'required');
            mzOption('optWkdCityId', wkdRefCity, 'Choose City *', 'cityId', 'cityDesc', {cityStatus: '1'}, 'required');
            mzOption('optWkdAreaId', wkdRefArea, 'Choose Area *', 'areaId', 'areaDesc', {cityId: dataWkdWorkorder['cityId'], areaStatus: '1'}, 'required');
            mzOption('optWkdSiteId', wkdRefSite, 'Choose Site *', 'siteId', 'siteDesc', {areaId: dataWkdWorkorder['areaId'], siteStatus: '1'}, 'required');
        } else {
            mzOption('optWkdWorktypeId', wkdRefWorktype, 'Choose Work Type *', 'worktypeId', 'worktypeDesc');
            mzOption('optWkdWorkcategoryId', wkdRefWorkcategory, 'Choose Work Category *', 'workcategoryId', 'workcategoryDesc');
            mzOption('optWkdCityId', wkdRefCity, 'Choose City *', 'cityId', 'cityDesc');
            mzOption('optWkdAreaId', wkdRefArea, 'Choose Area *', 'areaId', 'areaDesc');
            mzOption('optWkdSiteId', wkdRefSite, 'Choose Site *', 'siteId', 'siteDesc');
        }

        mzSetFieldValue('WkdWorkorderNo', dataWkdWorkorder['workorderNo'], 'text', 'Work Order No.');
        mzSetFieldValue('WkdSiteId', dataWkdWorkorder['siteId'], 'select', 'Site *');
        mzSetFieldValue('WkdAreaId', dataWkdWorkorder['areaId'], 'select', 'Area *');
        mzSetFieldValue('WkdCityId', dataWkdWorkorder['cityId'], 'select', 'City *');
        mzSetFieldValue('WkdWorktypeId', worktypeId, 'select', 'Work Type *');
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

            $('.divWkdAction').show();
        }
    };

    this.hide = function () {
        $('.sectionWorkOrderDetails').hide();
    };

    this.init();
}