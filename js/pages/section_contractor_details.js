function SectionContractorDetails() {

    const ctdClassName = 'SectionContractorDetails';
    let self = this;
    let ctdCallFrom = '';
    let ctdContractorId = '';
    let ctdGroupId;
    let ctdRefStatus;
    let ctdRefSite;
    let ctdRefArea;
    let ctdRefCity;
    let ctdRefState;
    let ctdRefRole;
    let ctdRoleEdit;
    let ctdRowRefresh;
    let formCtdContractor;
    let oTableCtdSite;
    let oTableCtdEmployee;
    let ctdSiteAddClass;
    let ctdEmployeeClass;
    let ctdConfirmDeleteSiteClass;
    let ctdConfirmDeleteEmployeeClass;

    this.init = function () {
        $('.sectionCtdDetails').hide();
        ctdSiteAddClass = new ModalSiteAdd();
        ctdEmployeeClass = new ModalEmployee();
        ctdConfirmDeleteSiteClass = new ModalConfirmDelete('contractor_site');
        ctdConfirmDeleteEmployeeClass = new ModalConfirmDelete('contractor_employee');

        let ctdVersionLocal = mzGetDataVersion();
        ctdRefState = mzGetLocalArray('icon_state', ctdVersionLocal, 'stateId');
        ctdRefRole = mzGetLocalArray('icon_role', ctdVersionLocal, 'roleId');
        ctdRoleEdit = mzIsRoleExist('1,2,4,5');
        ctdSiteAddClass.setClassFrom(self);
        ctdEmployeeClass.setClassFrom(self);

        $('#btnCtdBack').on('click', function () {
            $('.sectionCtdDetails').hide();
            if (ctdCallFrom === 'ctr') {
                $('.sectionCtrMain').show();
            }
            $(window).scrollTop(0);
        });

        $('#btnCtdSiteAdd').on('click', function () {
            ctdSiteAddClass.add('ctr');
        });

        $('#btnCtdEmployeeAdd').on('click', function () {
            ctdEmployeeClass.add('ctd', ctdGroupId);
        });

        $('#btnDtCtdSiteRefresh, #btnDtCtdEmployeeRefresh').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    self.extractDetails();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });

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
            $('#btnCtdSubmitNew').attr('disabled', !formCtdContractor.validateForm());
        });

        oTableCtdSite = $('#dtCtdSite').DataTable({
            bLengthChange: false,
            bFilter: true,
            "aaSorting": [[1, 'asc']],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = oTableCtdSite.page.info();
                $('td', nRow).eq(0).html(info.page * info.length + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
            },
            language: _DATATABLE_LANGUAGE,
            aoColumns:
                [
                    {mData: null, bSortable: false},
                    {mData: null,
                        mRender: function (data, type, row) {
                            return ctdRefSite[row['siteId']]['siteDesc'];
                        }
                    },
                    {mData: null,
                        mRender: function (data, type, row) {
                            const areaId = ctdRefSite[row['siteId']]['areaId'];
                            return ctdRefArea[areaId]['areaDesc'];
                        }
                    },
                    {mData: null,
                        mRender: function (data, type, row) {
                            const areaId = ctdRefSite[row['siteId']]['areaId'];
                            const cityId = ctdRefArea[areaId]['cityId'];
                            return refCity[cityId]['cityDesc'];
                        }
                    },
                    {mData: null, bSortable: false, sClass: 'text-center',
                        mRender: function (data, type, row, meta) {
                            return '<a><i class="fas fa-trash-alt" onclick="contractorDetailsClass.deleteSite('+row['contractorSiteId']+', ' + meta.row + ');" data-toggle="tooltip" data-placement="top" title="Delete"></i></a>';
                        }
                    }
                ]
        });
        $("#dtCtdSite_filter").hide();
        $('#txtCtdSiteSearch').on('keyup change', function () {
            oTableCtdSite.search($(this).val()).draw();
        });

        let cntCtdSite;
        let btnCtdSiteOpt = {
            exportOptions: {
                columns: [ 0, 1, 2, 3],
                format: {
                    body: function ( data, row, column ) {
                        if (row === 0 && column === 0) {
                            cntCtdSite = 1;
                        }
                        return column === 0 ? cntCtdSite++ : data;
                    }
                }
            }
        };

        new $.fn.dataTable.Buttons(oTableCtdSite, {
            buttons: [
                $.extend( true, {}, btnCtdSiteOpt, {
                    extend:    'print',
                    text:      '<i class="fas fa-print"></i>',
                    title:     'ICONS System - Contractor Sites',
                    titleAttr: 'Print',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                }),
                $.extend( true, {}, btnCtdSiteOpt, {
                    extend:    'excelHtml5',
                    text:      '<i class="fas fa-file-excel"></i>',
                    title:     'ICONS System - Contractor Sites',
                    titleAttr: 'Excel',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                }),
                $.extend( true, {}, btnCtdSiteOpt, {
                    extend:    'pdfHtml5',
                    text:      '<i class="fas fa-file-pdf"></i>',
                    title:     'ICONS System - Contractor Sites',
                    titleAttr: 'Pdf',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                })
            ]
        }).container().appendTo($('#btnDtCtdSiteExport'));

        oTableCtdEmployee = $('#dtCtdEmployee').DataTable({
            bLengthChange: false,
            bFilter: true,
            "aaSorting": [[1, 'asc']],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = oTableCtdEmployee.page.info();
                $('td', nRow).eq(0).html(info.page * info.length + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
            },
            language: _DATATABLE_LANGUAGE,
            autoWidth: false,
            aoColumns:
                [
                    {mData: null, bSortable: false},
                    {mData: 'userFullname'},
                    {mData: 'userContactNo'},
                    {mData: 'userEmail'},
                    {mData: 'roles',
                        mRender: function (data) {
                            let label = '';
                            if (data != '') {
                                const dataSplit = data.split(',');
                                if (dataSplit.length > 0) {
                                    for (let j=0; j<dataSplit.length; j++) {
                                        label += ', ' + ctdRefRole[dataSplit[j]]['roleDesc'];
                                    }
                                    label = label.substr(2);
                                }
                            }
                            return label;
                        }
                    },
                    {mData: null,
                        mRender: function (data, type, row) {
                            return '<h6><span class="badge badge-pill '+ctdRefStatus[row['userStatus']]['statusColor']+' z-depth-2">'+ctdRefStatus[row['userStatus']]['statusDesc']+'</span></h6>';
                        }
                    },
                    {mData: null, bSortable: false, sClass: 'text-center',
                        mRender: function (data, type, row, meta) {
                            let label = '<a><i class="fas fa-edit" onclick="contractorDetailsClass.editEmployee(' + row['userId'] + ', ' + meta.row + ')" data-toggle="tooltip" data-placement="top" title="Edit"></i></a>&nbsp;&nbsp;';
                            label += '<a><i class="fas fa-trash-alt" onclick="contractorDetailsClass.deleteEmployee(' + row['userId'] + ', ' + meta.row + ');" data-toggle="tooltip" data-placement="top" title="Delete"></i></a>';
                            return label;
                        }
                    }
                ]
        });
        $("#dtCtdEmployee_filter").hide();
        $('#txtCtdEmployeeSearch').on('keyup change', function () {
            oTableCtdEmployee.search($(this).val()).draw();
        });

        let cntCtdEmployee;
        let btnCtdEmployeeOpt = {
            exportOptions: {
                columns: [ 0, 1, 2, 3, 4, 5],
                format: {
                    body: function ( data, row, column ) {
                        if (row === 0 && column === 0) {
                            cntCtdEmployee = 1;
                        }
                        if (column === 5) {
                            const n = data.search('">');
                            const k = data.substr(n+2);
                            return k.replace('</span></h6>','');
                        }
                        return column === 0 ? cntCtdEmployee++ : data;
                    }
                }
            }
        };

        new $.fn.dataTable.Buttons(oTableCtdEmployee, {
            buttons: [
                $.extend( true, {}, btnCtdEmployeeOpt, {
                    extend:    'print',
                    text:      '<i class="fas fa-print"></i>',
                    title:     'ICONS System - Contractor Employee',
                    titleAttr: 'Print',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                }),
                $.extend( true, {}, btnCtdEmployeeOpt, {
                    extend:    'excelHtml5',
                    text:      '<i class="fas fa-file-excel"></i>',
                    title:     'ICONS System - Contractor Employee',
                    titleAttr: 'Excel',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                }),
                $.extend( true, {}, btnCtdEmployeeOpt, {
                    extend:    'pdfHtml5',
                    text:      '<i class="fas fa-file-pdf"></i>',
                    title:     'ICONS System - Contractor Employee',
                    titleAttr: 'Pdf',
                    orientation: 'landscape',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                })
            ]
        }).container().appendTo($('#btnDtCtdEmployeeExport'));

        $('#btnCtdSave, #btnCtdUpdate').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    const data = {
                        action: 'save_contractor',
                        contractorName: $('#txtCtdContractorName').val(),
                        contractorRegNo: $('#txtCtdContractorRegNo').val(),
                        addressDesc: $('#txtCtdAddressDesc').val(),
                        addressPostcode: $('#txtCtdAddressPostcode').val(),
                        addressCity: $('#txtCtdAddressCity').val(),
                        stateId: $('#optCtdStateId').val(),
                        contractorContactNo: $('#txtCtdContractorContactNo').val(),
                        contractorFaxNo: $('#txtCtdContractorFaxNo').val(),
                        contractorEmail: $('#txtCtdContractorEmail').val()
                    };
                    mzAjaxRequest('contractor.php?contractorId='+ctdContractorId, 'PUT', data);
                    if (ctdCallFrom === 'ctr') {
                        genTableCtr(1);
                    }
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });

        $('#btnCtdSubmitNew').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    const dataSave = {
                        action: 'save_contractor2',
                        contractorName: $('#txtCtdContractorName').val(),
                        contractorRegNo: $('#txtCtdContractorRegNo').val(),
                        addressDesc: $('#txtCtdAddressDesc').val(),
                        addressPostcode: $('#txtCtdAddressPostcode').val(),
                        addressCity: $('#txtCtdAddressCity').val(),
                        stateId: $('#optCtdStateId').val(),
                        contractorContactNo: $('#txtCtdContractorContactNo').val(),
                        contractorFaxNo: $('#txtCtdContractorFaxNo').val(),
                        contractorEmail: $('#txtCtdContractorEmail').val()
                    };
                    mzAjaxRequest('contractor.php?contractorId='+ctdContractorId, 'PUT', dataSave);

                    if (oTableCtdSite.rows().count() === 0) {
                        throw new Error(_ALERT_MSG_ERROR_CONTRACTOR_NOSITE);
                    }
                    if (oTableCtdEmployee.rows().count() === 0) {
                        throw new Error(_ALERT_MSG_ERROR_CONTRACTOR_NOEMPLOYEE);
                    }

                    const dataSubmit = {
                        action: 'submit_contractor'
                    };
                    mzAjaxRequest('contractor.php?contractorId='+ctdContractorId, 'PUT', dataSubmit);
                    $('.sectionCtdDetails').hide();
                    if (ctdCallFrom === 'ctr') {
                        genTableCtr(1);
                        $('.sectionCtrMain').show();
                    }
                    $(window).scrollTop(0);
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });
    };

    this.deleteSite = function (contractorSiteId, rowRefresh) {
        ctdConfirmDeleteSiteClass.delete('ctd', contractorSiteId, rowRefresh, ctdSiteAddClass);
    };

    this.editEmployee = function (userId, rowRefresh) {
        ctdEmployeeClass.edit('ctd', userId, ctdGroupId, rowRefresh);
    };

    this.deleteEmployee = function (userId, rowRefresh) {
        ctdEmployeeClass.setMyeGroupId(ctdGroupId);
        ctdConfirmDeleteEmployeeClass.delete('ctd', userId, rowRefresh, ctdEmployeeClass);
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
        ctdGroupId = dataCtdContractor['groupId'];

        oTableCtdSite.clear().rows.add(dataCtdContractor['sites']).draw();
        oTableCtdEmployee.clear().rows.add(dataCtdContractor['employees']).draw();

        $('#formCtd').find('input, textarea, select').attr('disabled', true);
        $('#btnCtdSave, #btnCtdUpdate, #btnCtdSubmitNew').hide();
        if (ctdRoleEdit) {
            $('#txtCtdContractorName, #txtCtdContractorRegNo, #txtCtdAddressDesc, #txtCtdAddressPostcode, #txtCtdAddressCity, #txtCtdContractorContactNo,' +
                '#txtCtdContractorFaxNo, #txtCtdContractorEmail').prop('disabled', false);
            mzDisableSelect('optCtdStateId', false);
            if (dataCtdContractor['contractorStatus'] === '5') {
                $('#btnCtdSave, #btnCtdSubmitNew').show();
                $('#btnCtdSubmitNew').attr('disabled', !formCtdContractor.validateForm());
            } else {
                $('#btnCtdUpdate').show();
            }
        }
    };

    this.addDataTableSite = function (contractorSiteId, siteId) {
        const rowAdd = {
            contractorSiteId: contractorSiteId,
            siteId: siteId
        };
        oTableCtdSite.row.add(rowAdd).draw();
    };

    this.deleteDataTableSite = function (rowDelete) {
        oTableCtdSite.row(rowDelete).remove().draw();
    };

    this.addDataTableEmployee = function (rowAdd) {
        oTableCtdEmployee.row.add(rowAdd).draw();
    };

    this.editDataTableEmployee = function (rowEdit, rowRefresh) {
        oTableCtdEmployee.row(rowRefresh).data(rowEdit).draw();
    };

    this.deleteDataTableEmployee = function (rowDelete) {
        oTableCtdEmployee.row(rowDelete).remove().draw();
    };

    this.deactivate = function (callFrom, contractorId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof contractorId === 'undefined' || contractorId === '') {
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
                mzAjaxRequest('contractor.php?contractorId='+contractorId, 'PUT', {action: 'deactivate'});
                const currentRow = oTableCtrContractor.row(rowRefresh).data();
                currentRow['contractorStatus'] = '2';
                if (callFrom === 'ctr') {
                    oTableCtrContractor.row(rowRefresh).data(currentRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.activate = function (callFrom, contractorId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof contractorId === 'undefined' || contractorId === '') {
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
                mzAjaxRequest('contractor.php?contractorId='+contractorId, 'PUT', {action: 'activate'});
                const currentRow = oTableCtrContractor.row(rowRefresh).data();
                currentRow['contractorStatus'] = '1';
                if (callFrom === 'ctr') {
                    oTableCtrContractor.row(rowRefresh).data(currentRow).draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.delete = function (callFrom, contractorId, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof contractorId === 'undefined' || contractorId === '') {
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
                mzAjaxRequest('contractor.php?contractorId='+contractorId, 'DELETE');
                if (callFrom === 'ctr') {
                    oTableCtrContractor.row(rowRefresh).remove().draw();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.getClassName = function () {
        return ctdClassName;
    };

    this.setRefSite = function (refSiteSet) {
        ctdRefSite = refSiteSet;
        ctdSiteAddClass.setRefSite(ctdRefSite);
    };

    this.setRefArea = function (refAreaSet) {
        ctdRefArea = refAreaSet;
        ctdSiteAddClass.setRefArea(ctdRefArea);
    };

    this.setRefCity = function (refCitySet) {
        ctdRefCity = refCitySet;
        ctdSiteAddClass.setRefCity(ctdRefCity);
    };

    this.setRefStatus = function (refStatusSet) {
        ctdRefStatus = refStatusSet;
    };

    this.getCtdContractorId = function () {
        return ctdContractorId;
    };

    this.init();
}