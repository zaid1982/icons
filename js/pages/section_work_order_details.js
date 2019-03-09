function SectionWorkOrderDetails() {

    let wkdCallFrom = '';
    let wkdWorkorderId = '';

    this.init = function () {
        $('.sectionWorkOrderDetails').hide();

        $('#optWkdSiteId').on('change', function () {
            $('#lblWkdSiteId').html('Site *').addClass('active');
        });

        $('#optWkdAreaId').on('change', function () {
            $('#lblWkdAreaId').html('Area *').addClass('active');
        });

        $('#optWkdCityId').on('change', function () {
            $('#lblWkdCityId').html('City *').addClass('active');
        });

        $('#optWkdContractorId').on('change', function () {
            $('#lblWkdContractorId').html('Contractor *').addClass('active');
        });

        $('#optWkdWorkorderSiteType').on('change', function () {
            $('#lblWkdWorkorderSiteType').html('Site Type *').addClass('active');
        });

        $('#optWkdWorktypeId').on('change', function () {
            $('#lblWkdWorktypeId').html('Work Type *').addClass('active');
        });

        $('#optWkdWorkcategoryId').on('change', function () {
            $('#lblWkdWorkcategoryId').html('Work Category *').addClass('active');
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
        mzSetFieldValue('WkdSiteId', dataWkdWorkorder['siteId'], 'select');
        mzSetFieldValue('WkdAreaId', dataWkdWorkorder['areaId'], 'select');
        mzSetFieldValue('WkdCityId', dataWkdWorkorder['cityId'], 'select');
        mzSetFieldValue('WkdWorkorderNo', dataWkdWorkorder['workorderNo'], 'text');

        $('#formWkd').find('input, textarea, select').attr('disabled', true);

        if (dataWkdWorkorder['workorderStatus'] === '5') {
            $('#txaWkdWorkorderDesc, #txaWkdWorkorderBlock, #txaWkdWorkorderLevel, #txaWkdWorkorderUnit, #txaWkdWorkorderLocationDesc').prop('disabled', false);
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