function initialize() {
    var styles = [
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 60
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 50
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 30
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 40
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": -25
                },
                {
                    "saturation": -100
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#00b5ff"
                }
            ]
        }
    ];

    var mapCanvas = document.getElementById('map_canvas');
    var bounds = new google.maps.LatLngBounds();

    function createMarker(position) {
        bounds.extend(position);
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: {
              url: '/typo3conf/ext/fconnection_project/Resources/Public/src/img/icon-location.svg',
              scaledSize: {
                  width: 30,
                  height: 40
              }
          },
          anchor : new google.maps.Point(20, 50)
        });

        return marker;
    }

    function findGetParameter(parameterName) {
        var result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
              tmp = item.split("=");
              if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }

    if(mapCanvas) {
        var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

        var mapOptions = {
            center: new google.maps.LatLng(47.388971, 8.525059),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            scrollwheel: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        var map = new google.maps.Map(mapCanvas, mapOptions);

        var infoWindow = new google.maps.InfoWindow({
            content: "holding..."
        });

        var markers = [];

        var iconparking = {
            url: '/typo3conf/ext/fconnection_project/Resources/Public/src/img/icon-parking.svg',
            scaledSize: {
                width: 35,
                height: 33
            }
        }

        for(var key in window.LOCATIONS) {
            var marker = createMarker(window.LOCATIONS[key]);

            marker.uid = window.LOCATIONS[key].uid;
            marker.content = window.LOCATIONS[key].content;

            if (window.LOCATIONS[key].parking) {
                marker.setIcon(iconparking);
            }
            markers.push(marker);
        }
        
        for (var i = markers.length - 1; i >= 0; i--) {
            google.maps.event.addListener(markers[i], 'click', function () {
                infoWindow.setContent(this.content);
                infoWindow.open(map, this);

                $('.location-trigger.active').removeClass('active');
                $('.location-trigger[data-target="' + this.uid + '"]').addClass('active');
            });
        }

        if (findGetParameter('locationpin')) {
            var locationOpen = findGetParameter('locationpin');

            $('.location-trigger[data-target="' + locationOpen + '"]').addClass('active');

            for (var i = markers.length - 1; i >= 0; i--) {
                if (markers[i].uid == locationOpen) {
                    infoWindow.setContent(markers[i].content);
                    infoWindow.open(map, markers[i]);
                }
            }
        }

        
        $('.location-trigger').click(function() {
            var target = $(this).attr('data-target');

            $('.location-trigger.active').removeClass('active');
            $(this).addClass('active');


            $('html, body').animate({
                'scrollTop': $('#map_canvas').position().top - $('.site-header').outerHeight(true) - 15
            }, 500);

            // infoWindow.close();
            for (var i = markers.length - 1; i >= 0; i--) {
                if (markers[i].uid == target) {
                    infoWindow.setContent(markers[i].content);
                    infoWindow.open(map, markers[i]);
                }


                map.panTo(map_recenter(map, infoWindow.getPosition(), 0, -20));
            }
        });

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        var extendPoint1, extendPoint2;
        if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
            extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.005, bounds.getNorthEast().lng() + 0.005);
            extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.005, bounds.getNorthEast().lng() - 0.005);
            bounds.extend(extendPoint1);
            bounds.extend(extendPoint2);
        }
        else {
            extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.005, bounds.getNorthEast().lng() + 0.005);
            extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.005, bounds.getNorthEast().lng() - 0.005);
            bounds.extend(extendPoint1);
            bounds.extend(extendPoint2);
        }

        map.fitBounds(bounds);
        
        zoomChangeBoundsListener = 
            google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                if (this.getZoom()) {   // or set a minimum
                    this.setZoom(window.ZOOM);  // set zoom here
                }
        });

        setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);
    }
}

function map_recenter(map, latlng,offsetx,offsety) {
    var point1 = map.getProjection().fromLatLngToPoint(
        (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
    );
    var point2 = new google.maps.Point(
        ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
        ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
    );  
    return map.getProjection().fromPointToLatLng(new google.maps.Point(
        point1.x - point2.x,
        point1.y + point2.y
    ));
}

if(window.hasOwnProperty('google')) {
    google.maps.event.addDomListener(window, 'load', initialize);
}
