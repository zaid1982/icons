function SectionTicketDetails() {

    let tkdCallFrom = '';
    let tkdTicketId = '';
    let tkdWorkorderId = '';
    let tkdRefStatus;
    let tkdRefProblemtype;
    let tkdRefWorktype;
    let tkdRefWorkcategory;
    let tkdWorkOrderClass;
    let mapOptions = {
        center: new google.maps.LatLng(2.904485,101.681497),
        zoom: 13,
        //mapTypeId: 'hybrid',
        styles:[
            {
                featureType: "all",
                elementType: "labels",
                stylers: [
                    { visibility: "on" }
                ]
            }
        ]
    };
    let map = new google.maps.Map(document.getElementById("mapTkdLocation"), mapOptions);
    let mapMarker = new google.maps.Marker({
        position: new google.maps.LatLng(2.904485,101.681497),
        map: map
    });

    this.init = function () {
        $('.sectionTkdDetails').hide();
        tkdWorkOrderClass = new SectionWorkOrderDetails();
        versionLocal = mzGetDataVersion();
        tkdRefStatus = mzGetLocalArray('icon_status', versionLocal, 'statusId');
        tkdRefProblemtype = mzGetLocalArray('icon_problemtype', versionLocal, 'problemtypeId');
        tkdRefWorktype = mzGetLocalArray('icon_worktype', versionLocal, 'worktypeId');
        tkdRefWorkcategory = mzGetLocalArray('icon_workcategory', versionLocal, 'workcategoryId');

        $('#btnTcdBack').on('click', function () {
            $('.sectionTkdDetails, .sectionWorkOrderDetails').hide();
            if (tkdCallFrom === 'tck') {
                $('.sectionTckMain').show();
            }
            $(window).scrollTop(0);
        });

        $('#butTkdCreateWorkOrder').on('click', function () {
            tkdWorkOrderClass.load('tck', tkdWorkorderId, tkdTicketId);
        });
    };

    this.load = function (callFrom, ticketId) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof ticketId === 'undefined' || ticketId === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        tkdCallFrom = callFrom;
        tkdTicketId = ticketId;

        ShowLoader();
        setTimeout(function () {
            try {
                tkdWorkOrderClass.hide();
                const dataTkdDetTicket = mzAjaxRequest('ticket.php?ticketId='+tkdTicketId, 'GET');
                mzSetFieldValue('TkdDetTicketNo', dataTkdDetTicket['ticketNo'], 'text');
                mzSetFieldValue('TkdDetProblemType', tkdRefProblemtype[dataTkdDetTicket['problemtypeId']]['problemtypeDesc'], 'text');
                mzSetFieldValue('TkdDetWorkType', tkdRefWorktype[tkdRefWorkcategory[dataTkdDetTicket['workcategoryId']]['worktypeId']]['worktypeDesc'], 'text');
                mzSetFieldValue('TkdDetWorkCategory', tkdRefWorkcategory[dataTkdDetTicket['workcategoryId']]['workcategoryDesc'], 'text');
                mzSetFieldValue('TkdDetCreatedBy', dataTkdDetTicket['createdBy'], 'text');
                const dateDisplay = mzConvertDateDisplay(dataTkdDetTicket['ticketTimeSubmit'].substr(0,10));
                const timeDisplay = mzConvertTimeDisplay(dataTkdDetTicket['ticketTimeSubmit'].substr(11));
                mzSetFieldValue('TkdDetTicketDate', timeDisplay + ', ' + dateDisplay, 'text');
                mzSetFieldValue('TkdDetTicketStatus', tkdRefStatus[dataTkdDetTicket['ticketStatus']]['statusDesc'], 'text');
                tkdWorkorderId = dataTkdDetTicket['workorderId'];
                $('#txaTkdDetTicketComplaint').html(dataTkdDetTicket['ticketComplaint']);

                const ticketImages = dataTkdDetTicket['ticketImages'];
                let html = '';
                $.each(ticketImages, function (n, u) {
                    html += '<div class=" carousel-item '+(n==0?'active':'')+' text-center">' +
                            '<figure class="col-md-12 d-md-inline-block">' +
                                '<a href="'+u['documentSrc']+'" data-size="1600x1067">' +
                                '<img src="'+u['documentSrc']+'" class="img-fluid" style="min-height: 340px; object-fit: contain">' +
                                '</a> ' +
                            '</figure>' +
                        '</div>';
                });
                $('#divTkdTicketImages').html(html);

                const mapLongitude = parseFloat(dataTkdDetTicket['ticketLongitude']);
                const mapLatitude = parseFloat(dataTkdDetTicket['ticketLatitude']);
                const mapLocation = new google.maps.LatLng(mapLongitude, mapLatitude);
                map.setCenter(mapLocation);
                mapMarker.setPosition(mapLocation);

                $('#butTkdCreateWorkOrder').hide();
                if (tkdCallFrom === 'tck') {
                    $('.sectionTckMain').hide();
                    if (tkdWorkorderId === '' && (mzIsRoleExist('1') || mzIsRoleExist('2') || mzIsRoleExist('4'))) {
                        $('#butTkdCreateWorkOrder').show();
                    } else if (tkdWorkorderId !== '') {
                        tkdWorkOrderClass.load('tck', tkdWorkorderId);
                    }
                } else if (tkdWorkorderId !== '') {
                    tkdWorkOrderClass.load('tck', tkdWorkorderId);
                }
                $('.sectionTkdDetails').show();

                $(window).scrollTop(0);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.init();
}