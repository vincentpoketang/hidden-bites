/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */
$(document).ready(function(){
    clickHandler();
});
/**
 * restaurants - global array to hold restaurants
 * @type {Array}
 */
var restaurants = [];
/**
 * clickHandler - Event Handler when user clicks the search button
 */
function clickHandler(){
    $('#firstButton').click(function() {
        console.log('clicklick');
        $('.beforeSearch').addClass('hide');
        ajaxCall();
    })
}
/**
 * ajaxCall - get json info from static.php and if it is success, push info to restaurants,
 *              else console.log an error
 */
function ajaxCall() {
    $.ajax({
        method : 'get',
        dataType : 'json',
        url : 'static.php',
        success: function (response){
        restaurants.push(response);
        console.log(restaurants);
        },
        error: function (response){
            console.log('Sorry nothing available')
        }
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
/**
 * map - global object for map
 * @type {Object}
 */
var map;
/**
 * initMap - initialize map object and setting up markers
 */
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
            var business = static_data.businesses[this.label-1];
            modalEdits(business);
        });
    }
}
/**
 * formatAddress - format the address that is passed and return the formatted address
 * @param address
 * @returns {string}
 */
function formatAddress(address){
    return address.address1 + ", " + address.city + ", " + address.state + " " + address.zip_code;
}
/**
 * modalEdits - set up modal and modify it
 * @param business
 */
function modalEdits(business){
    $('.modal-title').text(business.name);
    var div = $('<div>',{
        class: 'modal-div'
    });
    var img = $('<img>',{
        src: business.image_url,
        css: {
            height: '300px'
        }
    });
    var address = $('<h4>',{
        text: 'Address'
    });
    var address_info = $('<p>',{
        text: formatAddress(business.location)
    });
    var categories = $('<h4>',{
        text: 'Categories'
    });
    var categories_info = $('<p>',{
        text: business.categories[0].title
    });
    var rating = $('<h4>',{
        text: 'Rating'
    });
    var rating_stars = '';
    for(var i = 0; i < business.rating; i++){
        rating_stars += '* ';
    }
    var rating_info = $('<h4>',{
        text: rating_stars
    });
    $(div).append(img,address,address_info,categories,categories_info,rating,rating_info);
    $('.modal-body').empty().append(div);
    $('#myModal').modal('show');
}