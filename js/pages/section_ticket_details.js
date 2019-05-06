function SectionTicketDetails() {

    const tkdClassName = 'SectionTicketDetails';
    let tkdCallFrom = '';
    let tkdTicketId = '';
    let tkdWorkorderId = '';
    let tkdRefStatus;
    let tkdRefProblemtype;
    let tkdRefWorktype;
    let tkdRefWorkcategory;
    let tkdWorkOrderDetailsClass;

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

        $('#btnTcdBack').on('click', function () {
            $('.sectionTkdDetails, .sectionWorkOrderDetails').hide();
            if (tkdCallFrom === 'tck') {
                $('.sectionTckMain').show();
            } else if (tkdCallFrom === 'wdr') {
                $('.sectionWdrMain').show();
            } else if (tkdCallFrom === 'wdp') {
                $('.sectionWdpMain').show();
            }
            $(window).scrollTop(0);
        });

        $('#butTkdCreateWorkOrder').on('click', function () {
            tkdWorkOrderDetailsClass.load('tck', tkdWorkorderId, tkdTicketId);
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
                tkdWorkOrderDetailsClass.hide();
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
                    html += '<div class=" carousel-item '+(n===0?'active':'')+' text-center">' +
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
                        tkdWorkOrderDetailsClass.load('tck', tkdWorkorderId);
                    }
                } else if (tkdCallFrom === 'wdr') {
                    $('.sectionWdrMain').hide();
                    if (tkdWorkorderId !== '') {
                        tkdWorkOrderDetailsClass.load('wdr', tkdWorkorderId);
                    }
                } else if (tkdCallFrom === 'wdp') {
                    $('.sectionWdpMain').hide();
                    if (tkdWorkorderId !== '') {
                        tkdWorkOrderDetailsClass.load('wdp', tkdWorkorderId);
                    }
                }

                $('.sectionTkdDetails').show();
                $(window).scrollTop(0);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 300);
    };

    this.getClassName = function () {
        return tkdClassName;
    };

    this.setTkdRefStatus = function (_refStatus) {
        tkdRefStatus = _refStatus;
    };

    this.setTkdRefProblemtype = function (_refProblemtype) {
        tkdRefProblemtype = _refProblemtype;
    };

    this.setTkdRefWorktype = function (_refWorktype) {
        tkdRefWorktype = _refWorktype;
    };

    this.setTkdRefWorkcategory = function (_refWorkcategory) {
        tkdRefWorkcategory = _refWorkcategory;
    };

    this.setTkdWorkOrderDetailsClass = function (_tkdWorkOrderDetailsClass) {
        tkdWorkOrderDetailsClass = _tkdWorkOrderDetailsClass;
    };
}