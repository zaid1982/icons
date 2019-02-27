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
            $(window).scrollTop(0);
        });
    };

    this.load = function (callFrom, ticketId) {
        tkdCallFrom = callFrom;
        tkdTicketId = typeof ticketId === 'undefined' ? '' : ticketId;

        mzSetFieldValue('TkdDetSeminarTitle', 'Hsjfdklsd', 'text');

       $('#xxx').html('<div class=" carousel-item active text-center"><figure class="col-md-12 d-md-inline-block"><a href="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(2).jpg" data-size="1600x1067"> <img src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(2).jpg" class="img-fluid"> </a> </figure></div><div class="carousel-item text-center"><figure class="col-md-12 d-md-inline-block"><a href="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(22).jpg" data-size="1600x1067"> <img src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(22).jpg" class="img-fluid"> </a></figure></div>');

        if (tkdCallFrom === 'tck') {
            $('.sectionTckMain').hide();
        }
        $('.sectionTkdDetails').show();

        $(window).scrollTop(0);
    };

    this.init();
}