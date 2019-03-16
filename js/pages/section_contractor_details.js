function SectionContractorDetails() {

    let self = this;
    let ctdCallFrom = '';
    let ctdContractorId = '';
    let ctdRefStatus;
    let ctdRefSite;
    let ctdRefArea;
    let ctdRefCity;
    let ctdRefState;
    let ctdRoleEdit;
    let ctdRowRefresh;
    let formCtdContractor;

    this.init = function () {
        $('.sectionCtdDetails').hide();

        $('#btnCtdBack').on('click', function () {
            $('.sectionCtdDetails').hide();
            if (ctdCallFrom === 'ctr') {
                $('.sectionCtrMain').show();
            }
            $(window).scrollTop(0);
        });

        ctdRefState = mzGetLocalArray('icon_state', mzGetDataVersion(), 'stateId');
        ctdRoleEdit = mzIsRoleExist('1,2,4,5');

        const vDataCtdContractor = [
            {
                field_id: 'txtCtdContractorName',
                type: 'text',
                name: 'Contractor Name',
                validator: {
                    notEmpty: true,
                    maxLength: 255
                }
            },
            {
                field_id: 'txtCtdContractorRegNo',
                type: 'text',
                name: 'Registration No',
                validator: {
                    notEmpty: true,
                    maxLength: 30
                }
            },
            {
                field_id: 'txtCtdAddressDesc',
                type: 'text',
                name: 'Address',
                validator: {
                    notEmpty: true,
                    maxLength: 255
                }
            },
            {
                field_id: 'txtCtdAddressPostcode',
                type: 'text',
                name: 'Postcode',
                validator: {
                    notEmpty: true,
                    digit: true,
                    eqLength: 5
                }
            },
            {
                field_id: 'txtCtdAddressCity',
                type: 'text',
                name: 'City',
                validator: {
                    notEmpty: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'optCtdStateId',
                type: 'select',
                name: 'State',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtCtdContractorContactNo',
                type: 'text',
                name: 'Contact No.',
                validator: {
                    notEmpty: true,
                    digit: true,
                    minLength: 8,
                    maxLength: 15
                }
            },
            {
                field_id: 'txtCtdContractorFaxNo',
                type: 'text',
                name: 'Fax No.',
                validator: {
                    digit: true,
                    minLength: 8,
                    maxLength: 15
                }
            },
            {
                field_id: 'txtCtdContractorEmail',
                type: 'text',
                name: 'Email',
                validator: {
                    notEmpty: true,
                    email: true,
                    maxLength: 100
                }
            },
            {
                field_id: 'txtCtdContractorCreatedBy',
                type: 'text',
                name: 'Created By',
                validator: {}
            },
            {
                field_id: 'txtCtdContractorTimeCreated',
                type: 'text',
                name: 'Time Created',
                validator: {}
            },
            {
                field_id: 'txtCtdContractorStatus',
                type: 'text',
                name: 'Status',
                validator: {}
            }
        ];

        formCtdContractor = new MzValidate('formCtd');
        formCtdContractor.registerFields(vDataCtdContractor);

        $('#formCtd').on('keyup change', function () {
            $('#butCtdSubmitNew').attr('disabled', !formCtdContractor.validateForm());
        });
    };

    this.load = function (callFrom, contractorId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        ctdCallFrom = callFrom;
        ctdContractorId = typeof contractorId !== 'undefined' ? contractorId : '';
        ctdRowRefresh = typeof rowRefresh !== 'undefined' ? rowRefresh : '';

        formCtdContractor.clearValidation();

        ShowLoader();
        setTimeout(function () {
            try {
                if (ctdCallFrom === 'ctr') {
                    $('.sectionCtrMain').hide();
                }
                if (ctdContractorId === '') {
                    ctdContractorId = mzAjaxRequest('contractor.php', 'POST', {action: 'create_draft'});
                    genTableCtr(1);
                }

                if (ctdRoleEdit) {
                    mzOption('optCtdStateId', ctdRefState, 'State *', 'stateId', 'stateDesc', {stateStatus: '1'}, 'required');
                } else {
                    mzOption('optCtdStateId', ctdRefState, 'State *', 'stateId', 'stateDesc');
                }
                self.extractDetails();
                $('.sectionCtdDetails').show();
                $(window).scrollTop(0);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.setRefSite = function (refSiteSet) {
        ctdRefSite = refSiteSet;
    };

    this.setRefArea = function (refAreaSet) {
        ctdRefArea = refAreaSet;
    };

    this.setRefCity = function (refCitySet) {
        ctdRefCity = refCitySet;
    };

    this.setRefStatus = function (refStatusSet) {
        ctdRefStatus = refStatusSet;
    };

    this.extractDetails = function () {
        const dataCtdContractor = mzAjaxRequest('contractor.php?contractorId='+ctdContractorId, 'GET');
        mzSetFieldValue('CtdContractorName', dataCtdContractor['contractorName'], 'text', 'Contractor Name *');
        mzSetFieldValue('CtdContractorRegNo', dataCtdContractor['contractorRegNo'], 'text', 'Registration No *');
        mzSetFieldValue('CtdAddressDesc', dataCtdContractor['address']['addressDesc'], 'text', 'Address *');
        mzSetFieldValue('CtdAddressPostcode', dataCtdContractor['address']['addressPostcode'], 'text', 'Postcode *');
        mzSetFieldValue('CtdAddressCity', dataCtdContractor['address']['addressCity'], 'text', 'City *');
        mzSetFieldValue('CtdStateId', dataCtdContractor['address']['stateId'], 'select', 'State *');
        mzSetFieldValue('CtdContractorContactNo', dataCtdContractor['contractorContactNo'], 'text', 'Contact No *');
        mzSetFieldValue('CtdContractorFaxNo', dataCtdContractor['contractorFaxNo'], 'text', 'Fax No');
        mzSetFieldValue('CtdContractorEmail', dataCtdContractor['contractorEmail'], 'text', 'Email *');
        mzSetFieldValue('CtdContractorCreatedBy', dataCtdContractor['contractorCreatedBy'], 'text', 'Created By');
        mzSetFieldValue('CtdContractorTimeCreated', mzConvertDateDisplay(dataCtdContractor['contractorTimeCreated']), 'text', 'Time Created');
        mzSetFieldValue('CtdContractorStatus', ctdRefStatus[dataCtdContractor['contractorStatus']]['statusDesc'], 'text', 'Status');

        $('#formCtd').find('input, textarea, select').attr('disabled', true);
        $('#btnCtdSave, #btnCtdUpdate, #btnCtdSubmitNew').hide();
        if (ctdRoleEdit) {
            $('#txtCtdContractorName, #txtCtdContractorRegNo, #txtCtdAddressDesc, #txtCtdAddressPostcode, #txtCtdAddressCity, #txtCtdContractorContactNo,' +
                '#txtCtdContractorFaxNo, #txtCtdContractorEmail').prop('disabled', false);
            mzDisableSelect('optCtdStateId', false);
            if (dataCtdContractor['contractorStatus'] === '5') {
                $('#btnCtdSave, #btnCtdSubmitNew').show();
            } else {
                $('#btnCtdUpdate').show();
            }
        }
    };

    this.init();
}