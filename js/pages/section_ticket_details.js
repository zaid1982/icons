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
        map: map,
        title: "Title"
    });

    this.init = function () {
        $('.sectionTkdDetails').hide();

        $('#btnTcdBack').on('click', function () {
            $('.sectionTkdDetails').hide();
            if (tkdCallFrom === 'tck') {
                $('.sectionTckMain').show();
            }
        });
    };

    this.load = function (callFrom, ticketId) {
        tkdCallFrom = callFrom;
        tkdTicketId = typeof ticketId === 'undefined' ? '' : ticketId;

        mzSetFieldValue('TkdDetSeminarTitle', 'Hsjfdklsd', 'text');

        if (tkdCallFrom === 'tck') {
            $('.sectionTckMain').hide();
        }
        $('.sectionTkdDetails').show();
    };

    this.init();
}