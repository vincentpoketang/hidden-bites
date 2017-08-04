/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */

var app = {
  restaurants: [],
  search_term: 'hole in the wall ',
  user_location: {
    lat: 33.634910999999995,
    lng: -117.7404998
  },
  search_location: this.user_location,
  common_categories: [
    'Thai',
    'Mexican',
    'Japanese',
    'Sushi',
    'Sandwich',
    'Chinese',
    'Pizza',
    'American',
    'Burgers',
    'Seafood',
    'Italian',
    'Vietnamese',
    'Coffee',
    'Latin American',
    'Salad',
    'Koren',
    'BBQ'
  ]
};

/**
 * map - global variable to hold the google map object
 * @type {object}
 */
var map;

/**
 * setUpClickHandlers - Event Handler when user clicks the search button
 */
function setUpClickHandlers() {
  $('#button-search').click(searchClicked);
  $('#back-to-front').click(startNewSearch);
}

function searchClicked() {
  var $locationInput = $('#input-location');
  var $alert = $('#alert-location');
  if ($locationInput.val() === '') {
    $alert
      .css('display', 'block')
      .addClass('animated bounceIn');
    setTimeout(function() {
      $('#alert-location').removeClass('animated bounceIn');
    }, 500);
  } else {
    $alert
      .removeClass('animated bounceIn')
      .css('display', 'none');
    searchFunction();
    $('#input-food').attr('disabled', 'disabled');
    $locationInput.attr('disabled', 'disabled');
  }
}

function startNewSearch() {
  $('#modal').modal('hide');
  $('#input-food').removeAttr('disabled');
  $('#input-location').removeAttr('disabled');
  $('.search-container')
    .removeClass('animated fadeOutLeftBig')
    .addClass('animated fadeInLeftBig');

  // clear the existing results page so it'll be ready for the next search
  setTimeout(function() {
    map = {};
    $('#map-title-primary').text('Loading...');
    $('#map-title-extra').text('');
    $('#map').empty();
  }, 1000);
}

/**
 * search function
 */
function searchFunction() {
  app.search_term = 'hole in the wall ';
  app.user_input = $('#input-food').val();
  app.search_term += app.user_input;
  app.search_location = $('#input-location').val();
  getRestaurantData(app.search_term, app.search_location);
  $('.search-container')
    .removeClass('animated fadeInLeftBig')
    .addClass('animated fadeOutLeftBig');
}

/**
 * removeDuplicateLocations
 */
function removeDuplicateLocations(arr) {
  var coord = arr.map(rest => rest.coordinates);
  var lat = coord.map(objCoord => objCoord.latitude);
  var long = coord.map(objCoord => objCoord.longitude);
  var returnArray = [];
  for (var i = 0; i < arr.length; i++) {
    if (lat.indexOf(lat[i]) === i && long.indexOf(long[i]) === i) {
      returnArray.push(arr[i]);
    }
  }
  return returnArray;
}

/**
 * getRestaurantData - get json info from php file and if it is success, push info to app.restaurants
 *
 * @params term - input of the term the user is searching
 * @params app.search_location - the area the user input and/or their current location
 */
function getRestaurantData(term, search_location) {
  $.ajax({
    method: 'get',
    dataType: 'json',
    data: {
      'location': search_location,
      'term': term
    },
    url: 'yelp.php',
    success: function(response) {
      app.restaurants = response;

      // Occasionally Yelp bugs out and doesn't send us lat/long coordinates
      // If that's the case, we need to remove those places from the results array
      for (var i = 0; i < app.restaurants.length; i++) {
        if (!app.restaurants[i].coordinates.latitude || !app.restaurants[i].coordinates.longitude) {
          app.restaurants.splice(i, 1);
        }
      }
      app.restaurants = removeDuplicateLocations(app.restaurants);
      initMap();
      $('#map-title-primary').text(app.restaurants.length + ' spots found ');
      $('#map-title-extra').text('near ' + app.search_location);
      if (app.restaurants.length === 0) {
        showErrorModal();
      }
    },
    error: function() {
      showErrorModal('It seems an error occurred! Try refreshing the page.');
    }
  });
}

/**
 * showErrorModal - set up modal to display notice if search returns no results
 */
function showErrorModal(message) {
  startNewSearch();
  var $modal = $('.modal-body');
  $modal.empty();
  var $categories_div = $('<div>', {
    class: 'modal-div no-results'
  });
  var $modalTitle = $('.modal-title');
  var $returnLink = $('<a>', {
    class: 'modal-link',
    text: 'Try a new search...'
  });
  $returnLink.click(function(){
    $('#modal').modal('hide');
    startNewSearch();
  });
  $modalTitle.text('Uh-Oh!');
  $modalTitle.addClass('no-results-header');

  if (!message) {
    $categories_div.append('Sorry but there are no results for ' + app.user_input + ' near ' + app.search_location + '.');
    $categories_div.append('<br>' + 'Try one of these common food categories:');
    var $categories_list = $('<ul>');
    for (var i = 0; i < app.common_categories.length; i++) {
      var $food_category_li = $('<li>');
      $food_category_li.append(app.common_categories[i]);
      $categories_list.append($food_category_li);
    }
    $modal.append($categories_div, $categories_list, $returnLink);
  } else {
    $categories_div.append(message);
    $categories_div.append($returnLink);
    $modal.append($categories_div);
  }

  $('#modal').modal('show');
}

/**
 * initMap - initialize map object and set up markers
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: findCenterForMap(app.restaurants),
    zoom: 13,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: 'roadmap',
    styles: googleMapRetro
  });

  var markers = [];
  for (var i = 0; i < app.restaurants.length; i++) {
    var restaurant_name = "";
    for (var j = 0; j < 13 && j < app.restaurants[i].name.length; j++) {
      restaurant_name += app.restaurants[i].name[j];
    }
    if (app.restaurants[i].name.length > 13) {
      restaurant_name += '...';
    }
    markers[i] = new google.maps.Marker({
      position: new google.maps.LatLng(app.restaurants[i].coordinates.latitude, app.restaurants[i].coordinates.longitude),
      map: map,
      icon: 'img/label-bg.png',
      mapId: i,
      label: restaurant_name
    });
    markers[i].addListener('click', function() {
      var business = app.restaurants[this.mapId];
      modalSetup(business);
    });
  }
  new MarkerClusterer(map, markers, {imagePath: './img/m'});
}

/**
 * findCenterForMap - add up all lat/lng values and divide by total locations to obtain average/center for map display
 *
 * @param {array} restaurants - array of all restaurant results, containing lat/lng coordinates
 * @returns {object}
 */
function findCenterForMap(restaurants) {
  var totalLat = 0;
  var totalLng = 0;
  for (var i = 0; i < restaurants.length; i++) {
    totalLat += restaurants[i].coordinates.latitude;
    totalLng += restaurants[i].coordinates.longitude;
  }
  totalLat /= restaurants.length;
  totalLng /= restaurants.length;
  return {lat: totalLat, lng: totalLng};
}

/**
 * modalSetup - set up modal and modify it
 * @param business
 */
function modalSetup(business) {
  $('.modal-title')
    .removeClass('no-results-header')
    .text(business.name);
  var div = $('<div>', {class: 'modal-div'});
  var img = $('<img>', {src: business.image_url});
  var address = $('<h4>', {text: 'Address'});
  var address_info = $('<p>', {text: formatYelpAddress(business.location)});
  var categories = $('<h4>', {text: 'Categories'});
  var categories_listing = business.categories[0].title;
  for (var i = 1; i < business.categories.length; i++) {
    categories_listing += ", " + business.categories[i].title;
  }
  var categories_info = $('<p>', {text: categories_listing});
  var rating = $('<h4>', {text: 'Rating'});
  var rating_info = $('<p>');
  for (var i = 0; i < business.rating; i++) {
    var full_star = $('<img>', {
      src: "img/Star.png",
      height: '20px'
    });
    if (i + 0.5 === business.rating) {
      var half_star = $('<img>', {
        src: "img/Half Star.png",
        height: '20px'
      });
      $(rating_info).append(half_star);
    }
    else {
      $(rating_info).append(full_star);
    }
  }
  var website_url = $('<a>', {
    text: 'View on Yelp',
    href: business.url,
    target: '_blank'
  });

  $(div).append(img, address, address_info, categories, categories_info, rating, rating_info, website_url);
  $('.modal-body').empty().append(div);
  $('#modal').modal('show');
}

/**
 * formatYelpAddress - concatenate the yelp address properties into a string
 * @param address
 * @returns {string}
 */
function formatYelpAddress(address) {
  return address.address1 + ", " + address.city + ", " + address.state + " " + address.zip_code;
}

/**
 * getLocation - Get the user's current location using the HTML5 geolocation API,
 * and pass it in object form to the savePosition function
 */
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savePosition);
  } else {
    showErrorModal("Geolocation is not supported by this browser.");
  }
}

/**
 * savePosition - Takes the position object and saves the lat/lng coords to the user location property
 * @param {object} position
 */
function savePosition(position) {
  app.user_location = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  getAddressFromCoords();
}

/**
 * getAddressFromCoords - using Google's Reverse Geocoding API, get a human-readable address from the user's location coordinates
 */
function getAddressFromCoords() {
  $.ajax({
    method: 'get',
    dataType: 'json',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + app.user_location.lat + ',' + app.user_location.lng + '&key=AIzaSyAqq4jH5c4jX1asTtuCjYye7CrPotGihto',
    success: function(response) {
      $('#input-location').val(response.results[0].address_components[1].short_name + ', ' + response.results[0].address_components[3].short_name);
    },
    error: function(response) {
      showErrorModal('Unable to convert user\'s coordinates into address.');
    }
  });
}

/**
 * load stuff when document start
 */
$(document).ready(function() {
  new google.maps.places.Autocomplete(document.getElementById('input-location'));
  setUpClickHandlers();
  getCurrentLocation();
});

/**
 * handle enter and backspace key presses
 */
$(document).keydown(function(e) {
  if (!$('.search-container').hasClass('fadeOutLeftBig')) {
    // enter key, which starts the search process
    if (e.which === 13) {
      searchClicked();
    }
  }
});