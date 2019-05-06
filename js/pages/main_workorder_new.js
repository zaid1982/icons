function MainWorkorderNew() {

    const wdpClassName = 'MainWorkorderNew';
    let self = this;
    let wdpVersionLocal;
    let oTableWdpWorkorder;
    let oTableDateSearch = false;
    let wdpRefProblemtype;
    let wdpRefWorktype;
    let wdpRefWorkcategory;
    let wdpTicketDetailsClass;

    this.init = function () {
        mzOption('optWdpProblemtypeId', wdpRefProblemtype, 'All Problem Type', 'problemtypeId', 'problemtypeDesc');
        mzOption('optWdpWorktypeId', wdpRefWorktype, 'All Work Type', 'worktypeId', 'worktypeDesc');
        mzDateFromTo('txtWdpDateFrom', 'txtWdpDateTo');

        // table Work Order List
        oTableWdpWorkorder = $('#dtWdpWorkorder').DataTable({
            bLengthChange: false,
            bFilter: true,
            "aaSorting": [6, 'desc'],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = oTableWdpWorkorder.page.info();
                $('td', nRow).eq(0).html(info.page * info.length + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('.lnkWdpWorkorderInfo').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substr(linkIndex+1);
                        const currentRow = oTableWdpWorkorder.row(parseInt(rowId)).data();
                        wdpTicketDetailsClass.load('wdp', currentRow['ticketId']);
                    }
                });
            },
            language: _DATATABLE_LANGUAGE,
            aoColumns:
                [
                    {mData: null, bSortable: false},
                    {mData: 'workorderNo'},
                    {mData: null, mRender: function (data, type, row){
                            return row['problemtypeId'] !== '' ? wdpRefProblemtype[row['problemtypeId']]['problemtypeDesc'] : '';
                        }},
                    {mData: null, mRender: function (data, type, row){
                            return row['workcategoryId'] !== '' ? wdpRefWorktype[wdpRefWorkcategory[row['workcategoryId']]['worktypeId']]['worktypeDesc'] : '';
                        }},
                    {mData: null, mRender: function (data, type, row){
                            return row['workcategoryId'] !== '' ? wdpRefWorkcategory[row['workcategoryId']]['workcategoryDesc'] : '';
                        }},
                    {mData: 'workorderTimeSubmit'},
                    {mData: 'checkpointDesc'},
                    {mData: null, bSortable: false, sClass: 'text-center',
                        mRender: function (data, type, row, meta) {
                            return '<a><i class="fas fa-info-circle lnkWdpWorkorderInfo" id="lnkWdpWorkorderInfo_' + meta.row + '" data-toggle="tooltip" data-placement="top" title="Details"></i></a>';
                            //return '<a><i class="fas fa-info-circle" onclick="wdpTicketDetailsClass.load(\'wdp\', '+row['ticketId']+')" data-toggle="tooltip" data-placement="top" title="Details"></i></a>';
                        }
                    },
                    {mData: 'workorderId', visible: false},
                    {mData: 'problemtypeId', visible: false},
                    {mData: 'workcategoryId', visible: false},
                    {mData: 'worktypeId', visible: false, mRender: function (data, type, row){
                            return row['workcategoryId'] !== '' ? wdpRefWorkcategory[row['workcategoryId']]['worktypeId'] : '';
                        }},
                    {mData: 'workorderStatus', visible: false}
                ]

        });

        $("#dtWdpWorkorder_filter").hide();
        $('#txtWdpWorkorderSearch').on('keyup change', function () {
            oTableDateSearch = true;
            oTableWdpWorkorder.search($(this).val()).draw();
        });
        $('#optWdpProblemtypeId').on('change', function () {
            const problemtypeId = $(this).val();
            oTableDateSearch = true;
            $(this).val() === '' ? oTableWdpWorkorder.column(9).search(problemtypeId).draw() : oTableWdpWorkorder.column(9).search('^'+problemtypeId+'$', true, false, true).draw();
        });
        $('#optWdpWorktypeId').on('change', function () {
            const worktypeId = $(this).val();
            oTableDateSearch = true;
            $(this).val() === '' ? oTableWdpWorkorder.column(11).search(worktypeId).draw() : oTableWdpWorkorder.column(11).search('^'+worktypeId+'$', true, false, true).draw();
        });
        $('#txtWdpDateFrom, #txtWdpDateTo').on('change', function () {
            oTableDateSearch = true;
            oTableWdpWorkorder.draw();
        });

        $.fn.dataTable.ext.search.push(function (settings, data) {
            if (!oTableDateSearch) {
                return true;
            }
            const DataTableDate = data[5].trim();
            const dateFrom = mzConvertDate($('#txtWdpDateFrom').val());
            const dateTo = mzConvertDate($('#txtWdpDateTo').val());
            oTableDateSearch = false;
            if (dateFrom === '' && dateTo === '') {
                return true;
            } else if (dateFrom === '' && DataTableDate <= dateTo) {
                return true;
            } else if (dateTo === '' && DataTableDate >= dateFrom) {
                return true;
            } else if (DataTableDate >= dateFrom && DataTableDate <= dateTo) {
                return true;
            }
            return false;
        });

        let cntWdpWorkorder;
        let btnWdpWorkorderOpt = {
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6],
                format: {
                    body: function ( data, row, column ) {
                        if (row === 0 && column === 0) {
                            cntWdpWorkorder = 1;
                        }
                        return column === 0 ? cntWdpWorkorder++ : data;
                    }
                }
            }
        };

        new $.fn.dataTable.Buttons(oTableWdpWorkorder, {
            buttons: [
                $.extend( true, {}, btnWdpWorkorderOpt, {
                    extend:    'print',
                    text:      '<i class="fas fa-print"></i>',
                    title:     'ICONS System - Work Order Pending Tasks',
                    titleAttr: 'Print',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                }),
                $.extend( true, {}, btnWdpWorkorderOpt, {
                    extend:    'excelHtml5',
                    text:      '<i class="fas fa-file-excel"></i>',
                    title:     'ICONS System - Work Order Pending Tasks',
                    titleAttr: 'Excel',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                }),
                $.extend( true, {}, btnWdpWorkorderOpt, {
                    extend:    'pdfHtml5',
                    text:      '<i class="fas fa-file-pdf"></i>',
                    title:     'ICONS System - Work Order Pending Tasks',
                    titleAttr: 'Pdf',
                    orientation: 'landscape',
                    className: 'btn btn-outline-white btn-rounded btn-sm px-2'
                })
            ]
        }).container().appendTo($('#btnDtWdpWorkorderExport'));

        $('#btnDtWdpWorkorderRefresh').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    this.genTableWdp();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });

        this.genTableWdp();
    };

    this.genTableWdp = function () {
        mzAjaxRequest('workorder.php', 'GET', {Reportid: '2', 'Cache-Control': 'no-cache, no-transform'}, 'workorderNewClass.displayChart()');
        const dataWdpWorkorder = mzAjaxRequest('workorder.php', 'GET', {Reportid: 'get_pending_tasks', 'Cache-Control': 'no-cache, no-transform'});
        oTableWdpWorkorder.clear().rows.add(dataWdpWorkorder).draw();
    };

    this.displayChart = function (result) {
        let chartData = [];
        result = JSON.parse(result);

        $.each(result, function (n, u) {
            const worktypeId = u['worktypeId'];
            chartData.push({name:wdpRefWorktype[worktypeId]['worktypeDesc'], y:parseInt(u.total)});
        });

        Highcharts.chart('chartWdpOpenByStatus', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Pending Work Order by Work Type'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            },
            credits:{
                enabled:false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        color: 'white'
                    }
                }
            },
            series: [{
                name: 'Status',
                data: chartData
            }]
        });
    };

    this.getClassName = function () {
        return wdpClassName;
    };

    this.setVersionLocal = function (_versionLocal) {
        wdpVersionLocal = _versionLocal;
    };

    this.setWdpRefProblemtype = function (_refProblemtype) {
        wdpRefProblemtype = _refProblemtype;
    };

    this.setWdpRefWorktype = function (_refWorktype) {
        wdpRefWorktype = _refWorktype;
    };

    this.setWdpRefWorkcategory = function (_refWorkcategory) {
        wdpRefWorkcategory = _refWorkcategory;
    };

    this.setTicketDetailsClass = function (_ticketDetailsClass) {
        wdpTicketDetailsClass = _ticketDetailsClass;
    };
}