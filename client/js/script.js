/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */

var app = {
  restaurants: [],
  searchTerm: 'hole in the wall ',
  userLocation: {
    lat: 33.634910999999995,
    lng: -117.7404998
  },
  searchLocation: this.userLocation,
  commonCategories: [
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
    runSearch();
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
 * runSearch - gather up our search terms, pass them into our AJAX call function, and show the loading screen
 */
function runSearch() {
  app.searchTerm = 'hole in the wall ';
  app.userInput = $('#input-food').val();
  app.searchTerm += app.userInput;
  app.searchLocation = $('#input-location').val();
  getRestaurantData(app.searchTerm, app.searchLocation);
  $('.search-container')
    .removeClass('animated fadeInLeftBig')
    .addClass('animated fadeOutLeftBig');
}

/**
 * removeDuplicateLocations - removes the
 * @param {array} arr - array of restaurant objects
 * @return {array} returnArray - cleaned up array of restaurant objects
 */
function removeDuplicateLocations(arr) {
  var coordinatesArray = arr.map(rest => rest.coordinates); // create array of objects with lat/lng props
  var lat = coordinatesArray.map(restaurant => restaurant.latitude); // create array of latitude numbers
  var lng = coordinatesArray.map(restaurant => restaurant.longitude); // create array of longitude numbers
  var returnArray = [];

  for (var i = 0; i < arr.length; i++) {
    // if we encounter a lat/lng that already exists, indexOf will return the index of the first occurrence,
    // thus the comparison will fail and that restaurant will not be added to the output array
    if (lat.indexOf(lat[i]) === i && lng.indexOf(lng[i]) === i) {
      returnArray.push(arr[i]);
    }
  }
  return returnArray;
}

/**
 * getRestaurantData - call our yelp API and if it is successful, push the returned JSON info to app.restaurants
 * @params {string} term - the type of food the user is looking for
 * @params {string} searchLocation - the location/area to look in
 */
function getRestaurantData(term, searchLocation) {
  $.ajax({
    method: 'get',
    dataType: 'json',
    timeout: 5000,
    data: {
      'location': searchLocation,
      'term': term
    },
    url: 'yelp.php',
    success: function(response) {
      app.restaurants = response;

      // Occasionally Yelp bugs out and doesn't send us lat/long coordinates for a restaurant
      // If that's the case, we need to remove those places from the results array
      for (var i = 0; i < app.restaurants.length; i++) {
        if (!app.restaurants[i].coordinates.latitude || !app.restaurants[i].coordinates.longitude) {
          app.restaurants.splice(i, 1);
        }
      }
      app.restaurants = removeDuplicateLocations(app.restaurants);
      initMap();
      $('#map-title-primary').text(app.restaurants.length + ' spots found ');
      $('#map-title-extra').text('near ' + app.searchLocation);
      if (app.restaurants.length === 0) {
        showErrorModal();
      }
    },
    error: function() {
      showErrorModal('Hmmm, nothing found. Perhaps try another search?');
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
  var $categoriesDiv = $('<div>', {
    class: 'modal-div no-results'
  });
  var $modalTitle = $('.modal-title');
  $modalTitle.text('Uh-Oh!');
  $modalTitle.addClass('no-results-header');

  if (!message) {
    $categoriesDiv.append('Sorry but there are no results for ' + app.userInput + ' near ' + app.searchLocation + '.');
    $categoriesDiv.append('<br>' + 'Try one of these common food categories:');
    var $categoriesList = $('<ul>');
    for (var i = 0; i < app.commonCategories.length; i++) {
      var $foodCategoryLi = $('<li>');
      $foodCategoryLi.append(app.commonCategories[i]);
      $categoriesList.append($foodCategoryLi);
    }
    $modal.append($categoriesDiv, $categoriesList);
  } else {
    $categoriesDiv.append(message);
    $modal.append($categoriesDiv);
  }

  $('#modal').modal('show');
}

/**
 * initMap - initialize map object and set up markers
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: getCenterForMap(app.restaurants),
    zoom: 13,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: 'roadmap',
    styles: googleMapRetro
  });

  var markers = [];
  for (var i = 0; i < app.restaurants.length; i++) {
    var restaurantName = "";

    // create a 13 character long string from the restaurant name
    for (var j = 0; j < 13 && j < app.restaurants[i].name.length; j++) {
      restaurantName += app.restaurants[i].name[j];
    }
    // if the restaurant name is greater than 13 characters, add an ellipsis so users know
    if (app.restaurants[i].name.length > 13) {
      restaurantName += '...';
    }

    markers[i] = new google.maps.Marker({
      position: new google.maps.LatLng(app.restaurants[i].coordinates.latitude, app.restaurants[i].coordinates.longitude),
      map: map,
      icon: 'img/label-bg.png',
      mapId: i,
      label: restaurantName
    });
    markers[i].addListener('click', function() {
      var business = app.restaurants[this.mapId];
      modalSetup(business);
    });
  }
  new MarkerClusterer(map, markers, {imagePath: 'img/m'});
}

/**
 * getCenterForMap - add up all lat/lng values and divide by total locations to obtain average/center for map display
 * @param {array} restaurants - array of all restaurant results, containing lat/lng coordinates
 * @returns {object}
 */
function getCenterForMap(restaurants) {
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
 * modalSetup - set up restaurant modals with data from yelp API
 * @param {object} business
 */
function modalSetup(business) {
  $('.modal-title')
    .removeClass('no-results-header')
    .text(business.name);
  var $div = $('<div>', {class: 'modal-div'});
  var $img = $('<img>', {src: business.image_url});
  var $address = $('<h4>', {text: 'Address'});
  var $addressInfo = $('<p>', {text: formatYelpAddress(business.location)});
  var $categories = $('<h4>', {text: 'Categories'});
  var categoriesListing = business.categories[0].title;
  for (var i = 1; i < business.categories.length; i++) {
    categoriesListing += ', ' + business.categories[i].title;
  }
  var $categoriesInfo = $('<p>', {text: categoriesListing});
  var $rating = $('<h4>', {text: 'Rating'});
  var $ratingInfo = $('<p>');
  for (var i = 0; i < business.rating; i++) {
    var $fullStar = $('<img>', {
      src: 'img/star.png',
      height: '20px'
    });
    if (i + 0.5 === business.rating) {
      var $halfStar = $('<img>', {
        src: 'img/half-star.png',
        height: '20px'
      });
      $ratingInfo.append($halfStar);
    }
    else {
      $ratingInfo.append($fullStar);
    }
  }
  var $websiteUrl = $('<a>', {
    text: 'View on Yelp',
    href: business.url,
    target: '_blank'
  });

  $div.append($img, $address, $addressInfo, $categories, $categoriesInfo, $rating, $ratingInfo, $websiteUrl);
  $('.modal-body').empty().append($div);
  $('#modal').modal('show');
}

/**
 * formatYelpAddress - concatenate the yelp address properties into a string
 * @param {object} address in object format
 * @returns {string} address in string format
 */
function formatYelpAddress(address) {
  return address.address1 + ', ' + address.city + ', ' + address.state + ' ' + address.zip_code;
}

/**
 * getLocation - Get the user's current location using the HTML5 geolocation API,
 * and pass it in object form to the savePosition function
 */
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savePosition);
  } else {
    showErrorModal('Geolocation is not supported by this browser.');
  }
}

/**
 * savePosition - Takes the position object and saves the lat/lng coords to the user location property
 * @param {object} position
 */
function savePosition(position) {
  app.userLocation = {
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
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + app.userLocation.lat + ',' + app.userLocation.lng + '&key=AIzaSyAqq4jH5c4jX1asTtuCjYye7CrPotGihto',
    success: function(response) {
      $('#input-location').val(response.results[0].address_components[1].short_name + ', ' + response.results[0].address_components[3].short_name);
    },
    error: function() {
      showErrorModal('Unable to convert user\'s coordinates into address.');
    }
  });
}

/**
 * initialize Google Places Autocomplete API and click handlers, and get our current location
 */
$(document).ready(function() {
  new google.maps.places.Autocomplete(document.getElementById('input-location'));
  setUpClickHandlers();
  getCurrentLocation();
});

/**
 * handle enter keypress and attempt to run the search (if we're on the search screen)
 */
$(document).keydown(function(e) {
  if (!$('.search-container').hasClass('fadeOutLeftBig')) {
    if (e.which === 13) {
      searchClicked();
    }
  }
});