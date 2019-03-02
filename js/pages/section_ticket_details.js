function SectionTicketDetails() {

    let tkdCallFrom = '';
    let tkdTicketId = '';
    let mapOptions = {
        center: new google.maps.LatLng(2.904485,101.681497),
        zoom: 13,
        mapTypeId: 'hybrid',
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
            $('.sectionTkdDetails').hide();
            if (tkdCallFrom === 'tck') {
                $('.sectionTckMain').show();
            }
            $(window).scrollTop(0);
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
                const dataTkdDetTicket = mzAjaxRequest('ticket.php?ticketId='+tkdTicketId, 'GET');
                mzSetFieldValue('TkdDetTicketNo', dataTkdDetTicket['ticketNo'], 'text');
                mzSetFieldValue('TkdDetProblemType', refProblemtype[dataTkdDetTicket['problemtypeId']]['problemtypeDesc'], 'text');
                mzSetFieldValue('TkdDetWorkType', refWorktype[refWorkcategory[dataTkdDetTicket['workcategoryId']]['worktypeId']]['worktypeDesc'], 'text');
                mzSetFieldValue('TkdDetWorkCategory', refWorkcategory[dataTkdDetTicket['workcategoryId']]['workcategoryDesc'], 'text');
                mzSetFieldValue('TkdDetCreatedBy', dataTkdDetTicket['createdBy'], 'text');
                mzSetFieldValue('TkdDetTicketDate', mzConvertDateDisplay(dataTkdDetTicket['ticketTimeSubmit']), 'text');
                mzSetFieldValue('TkdDetTicketStatus', refStatus[dataTkdDetTicket['ticketStatus']]['statusDesc'], 'text');
                $('#txaTkdDetTicketComplaint').html(dataTkdDetTicket['ticketComplaint']);

                const ticketImages = dataTkdDetTicket['ticketImages'];
                let html = '';
                $.each(ticketImages, function (n, u) {
                    html += '<div class=" carousel-item '+(n==0?'active':'')+' text-center">' +
                            '<figure class="col-md-12 d-md-inline-block">' +
                                '<a href="'+u['documentSrc']+'" data-size="1600x1067">' +
                                '<img src="'+u['documentSrc']+'" class="img-fluid">' +
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

                if (tkdCallFrom === 'tck') {
                    $('.sectionTckMain').hide();
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