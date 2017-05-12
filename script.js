/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */
/**
 * load stuff when document start
 */
$(document).ready(function(){
    clickHandler();
    getCurrentLocation();
});

/**
 * restaurants - global array to hold restaurants
 * @type {Array}
 */
var restaurants = [];

/**
 * as an absolute worst-case scenario we default the user location to the LF HQ
 * @type {{lat: number, lng: number}}
 */
var user_location = {
    lat: 33.634910999999995,
    lng: -117.7404998
};

/**
 * clickHandler - Event Handler when user clicks the search button
 */
function clickHandler(){
    $('#firstButton').click(function() {
        console.log('clicklick');
        $('.beforeSearch').removeClass('animated fadeInLeftBig');
        $('.beforeSearch').addClass('animated fadeOutLeftBig');
        ajaxCall();
    })
    $('#backToFront').click(function(){
        $('.beforeSearch').removeClass('animated fadeOutLeftBig');
        $('.beforeSearch').addClass('animated fadeInLeftBig');
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
        data : {
            'location' : 'San Francisco, CA',
            'term' : 'dinner',
            //'price' :
        },
        url : 'static.php',
        success: function (response){
            restaurants = response;
            initMap();
            console.log(restaurants);
        },
        error: function (response){
            console.log('Sorry nothing available')
        }
    })
}

/**
 * getAddressFromCoords - using Google's Reverse Geocoding API, get
 * a human-readable address from the user's location coordinates
 */
function getAddressFromCoords() {
    $.ajax({
        method : 'get',
        dataType : 'json',
        url : 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + user_location.lat + ',' + user_location.lng + '&key=AIzaSyAqq4jH5c4jX1asTtuCjYye7CrPotGihto',
        success: function (response){
            $('#input_food').val(response.results[0].address_components[1].short_name + ', ' + response.results[0].address_components[3].short_name);
        },
        error: function (response){
            console.log('Unable to convert user\'s coordinates into address: ', response);
        }
    })
}

/**
 * getLocation - Get the user's current location using the HTML5 geolocation API,
 * and pass it in object form to the savePosition function
 */
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, positionError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

/**
 * savePosition - Takes the position object and saves the lat/lng coords to the user location object
 * @param {object} position
 */
function savePosition(position) {
    user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    getAddressFromCoords();
}

/**
 * positionError - handles errors if we're unable to determine the user's location
 * @param {object} error
 */
function positionError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        default:
            console.log("An unknown error occurred.");
    }
}

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
        center: new google.maps.LatLng(user_location.lat,user_location.lng),
        zoom: 15,
        mapTypeId: 'terrain'
    });
    for(var i = 0; i < restaurants.length; i++){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(restaurants[i].coordinates.latitude,restaurants[i].coordinates.longitude),
            map:map,
            label: ""+(i+1)
        });
        marker.addListener('click',function(){
            var business = restaurants[this.label-1];
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