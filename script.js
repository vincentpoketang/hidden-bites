/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */
$(document).ready(function(){
    clickHandler();
});

function clickHandler(){
    $('button').click(function() {
        console.log('clicklick');
        ajaxCall();
        $('.beforeSearch').addClass('hide');
    })
}

function ajaxCall() {
    $.getJSON("static_data.json", function (data) {
        console.log(data);
    })
}

var static_data = {
    "total": 8228,
    "businesses": [
        {
            "rating": 4,
            "price": "$",
            "phone": "+14152520800",
            "id": "four-barrel-coffee-san-francisco",
            "is_closed": false,
            "categories": [
                {
                    "alias": "coffee",
                    "title": "Coffee & Tea"
                }
            ],
            "review_count": 1738,
            "name": "Four Barrel Coffee",
            "url": "https://www.yelp.com/biz/four-barrel-coffee-san-francisco",
            "coordinates": {
                "latitude": 37.7670169511878,
                "longitude": -122.42184275
            },
            "image_url": "http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg",
            "location": {
                "city": "San Francisco",
                "country": "US",
                "address2": "",
                "address3": "",
                "state": "CA",
                "address1": "375 Valencia St",
                "zip_code": "94103"
            },
            "distance": 1604.23,
            "transactions": ["pickup", "delivery"]
        },
        {
            "rating": 4,
            "price": "$",
            "phone": "+14152520800",
            "id": "four-barrel-coffee-san-francisco",
            "is_closed": false,
            "categories": [
                {
                    "alias": "coffee",
                    "title": "Coffee & Tea"
                }
            ],
            "review_count": 1738,
            "name": "Painted Ladies",
            "url": "https://www.yelp.com/biz/four-barrel-coffee-san-francisco",
            "coordinates": {
                "latitude": 37.7762593,
                "longitude": -122.432758
            },
            "image_url": "http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg",
            "location": {
                "city": "San Francisco",
                "country": "US",
                "address2": "",
                "address3": "",
                "state": "CA",
                "address1": "375 Valencia St",
                "zip_code": "94103"
            },
            "distance": 1604.23,
            "transactions": ["pickup", "delivery"]
        }
        // ...
    ],
    "region": {
        "center": {
            "latitude": 37.767413217936834,
            "longitude": -122.42820739746094
        }
    }
};

var map;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(static_data.region.center.latitude,static_data.region.center.longitude),
        zoom: 15,
        mapTypeId: 'roadmap'
    });
    for(var i = 0; i < static_data.businesses.length; i++){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(static_data.businesses[i].coordinates.latitude,static_data.businesses[i].coordinates.longitude),
            map:map,
            label: ""+(i+1)
        });
        marker.addListener('click',function(){
            console.log(this.position.lat());
            console.log(this.position.lng());
            console.log(this.label - 1);
            var business = static_data.businesses[this.label-1];
            modalEdits(business);
        });
    }
}
function formatAddress(address){
    return address.address1 + ", " + address.city + ", " + address.state + " " + address.zip_code;
}
function modalEdits(business){
    $('.modal-title').text(business.name);
    $('.modal-body').empty();
    var img = $('<img>',{
        src: business.image_url,
        css: {
            width: '200px'
        }
    });
    var p = $('<p>',{
        text: formatAddress(business.location)
    });
    $('.modal-body').append(img,p);
    $('#myModal').modal('show');
}