/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */

/**
 * load stuff when document start
 */
$(document).ready(function () {
  clickHandler();
  getCurrentLocation();
});

/**
 * wait for shift key to get pressed
 * @
 */

$(document).keypress(function (e) {
  if (e.which == 13) {
    searchFunction();
  }
});

/**
 * restaurants - global array to hold restaurantsh
 * @type {Array}
 */
var restaurants = [];
var search_term = 'hole in the wall ';

/**
 * user_location - global variable that, as an absolute worst-case scenario, default the user location to the LF HQ
 * @type {{lat: number, lng: number}}
 */
var user_location = {
  lat: 33.634910999999995,
  lng: -117.7404998
};

/**
 * search_location - global variable that stores location that is searched
 */
var search_location = user_location;

/**
 * map - global object for map
 * @type {Object}
 */
var map;

/**
 *
 * @type {[array]} //used to hold a list of common food categories and/or terms that would return results
 */
var common_categories = ['Thai', 'Mexican', 'Japanese', 'Sushi', 'Sandwich', 'Chinese', 'Pizza', 'American', 'Burgers', 'Seafood', 'Italian', 'Vietnamese', 'Coffee', 'Latin American', 'Salad', 'Koren', 'BBQ'];

/**
 * clickHandler - Event Handler when user clicks the search button
 */
function clickHandler() {
  var $alert = $('#alert-location');
  $('#firstButton').click(function () {
    if ($('#input_location').val() === '') {
      $alert
        .css('display', 'block')
        .addClass('animated bounceIn');
      setTimeout(function () {
        $('#alert-location').removeClass('animated bounceIn');
      }, 500);
    } else {
      $alert
        .removeClass('animated bounceIn')
        .css('display', 'none');
      searchFunction();
    }
  });
  $('#backToFront').click(function () {
    $('.beforeSearch')
      .removeClass('animated fadeOutLeftBig')
      .addClass('animated fadeInLeftBig');

    // clear the existing results
    setTimeout(function () {
      map = {};
      $('.map_header').text('Loading...');
      $('#map').empty();
    }, 1000);
  });
}

/**
 * search function
 *
 */
function searchFunction() {
  search_term = 'hole in the wall ';
  user_input = $('#input_food').val();
  search_term += user_input;
  search_location = $('#input_location').val();
  ajaxCall(search_term, search_location);
  $('.beforeSearch')
    .removeClass('animated fadeInLeftBig')
    .addClass('animated fadeOutLeftBig');
}

/**
 * ajaxCall - get json info from php file and if it is success, push info to restaurants,
 *              else console.log an error
 * @params term - input of the term the user is searching
 * @params search_location - the area the user input and/or their current location
 */
function ajaxCall(term, search_location) {
  $.ajax({
    method: 'get',
    dataType: 'json',
    data: {
      'location': search_location,
      'term': term
    },
    url: 'yelp.php',
    success: function (response) {
      //restaurants = response;

      restaurants = [{"id":"tasty-thai-lake-forest-2","name":"Tasty Thai","image_url":"https://s3-media2.fl.yelpcdn.com/bphoto/5cBh8DAehc0cz987EkSbsg/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/tasty-thai-lake-forest-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":274,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":undefined,"longitude":undefined},"transactions":[],"price":"$","location":{"address1":"22722 Lambert St","address2":"Ste 1704","address3":"","city":"Lake Forest","zip_code":"92630","country":"US","state":"CA","display_address":["22722 Lambert St","Ste 1704","Lake Forest, CA 92630"]},"phone":"+19494617888","display_phone":"(949) 461-7888","distance":6030.85520006},{"id":"thai-spice-irvine-2","name":"Thai Spice","image_url":"https://s3-media2.fl.yelpcdn.com/bphoto/7ynB7g08WUIZ7hbGTMtfcA/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/thai-spice-irvine-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":514,"categories":[{"alias":"thai","title":"Thai"}],"rating":3,"coordinates":{"latitude":33.680508,"longitude":-117.778503},"transactions":[],"price":"$","location":{"address1":"15455 Jeffrey Rd","address2":"Ste 315","address3":"","city":"Irvine","zip_code":"92618","country":"US","state":"CA","display_address":["15455 Jeffrey Rd","Ste 315","Irvine, CA 92618"]},"phone":"+19498578424","display_phone":"(949) 857-8424","distance":2018.528857192},{"id":"sutha-thai-kitchen-tustin","name":"Sutha Thai Kitchen","image_url":"https://s3-media2.fl.yelpcdn.com/bphoto/IhMIJFc_znSIuedpj-AsLg/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/sutha-thai-kitchen-tustin?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":591,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.74798,"longitude":-117.80845},"transactions":[],"price":"$","location":{"address1":"1161 Irvine Blvd","address2":"","address3":"","city":"Tustin","zip_code":"92780","country":"US","state":"CA","display_address":["1161 Irvine Blvd","Tustin, CA 92780"]},"phone":"+17147346100","display_phone":"(714) 734-6100","distance":9856.99184844},{"id":"spice-thai-lake-forest-2","name":"Spice Thai","image_url":"https://s3-media3.fl.yelpcdn.com/bphoto/fS1OLfNQC93F9DsoxZd_JQ/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/spice-thai-lake-forest-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":269,"categories":[{"alias":"thai","title":"Thai"},{"alias":"salad","title":"Salad"},{"alias":"desserts","title":"Desserts"}],"rating":4,"coordinates":{"latitude":33.629604,"longitude":-117.705039},"transactions":[],"price":"$$","location":{"address1":"24301 Muirlands Blvd","address2":"Ste R","address3":"","city":"Lake Forest","zip_code":"92630","country":"US","state":"CA","display_address":["24301 Muirlands Blvd","Ste R","Lake Forest, CA 92630"]},"phone":"+19494589606","display_phone":"(949) 458-9606","distance":6777.586867918},{"id":"chef-yens-chinese-and-thai-fusion-irvine","name":"Chef Yen's Chinese & Thai Fusion","image_url":"https://s3-media4.fl.yelpcdn.com/bphoto/_sgeHK3-8sDsMAjiZWfdJg/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/chef-yens-chinese-and-thai-fusion-irvine?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":119,"categories":[{"alias":"asianfusion","title":"Asian Fusion"},{"alias":"thai","title":"Thai"},{"alias":"chinese","title":"Chinese"}],"rating":3,"coordinates":{"latitude":33.6685334,"longitude":-117.7633841},"transactions":[],"price":"$","location":{"address1":"6628 Irvine Center Dr","address2":"","address3":"","city":"Irvine","zip_code":"92618","country":"US","state":"CA","display_address":["6628 Irvine Center Dr","Irvine, CA 92618"]},"phone":"+19496797700","display_phone":"(949) 679-7700","distance":225.5078501762},{"id":"bhan-baitong-thai-cuisine-lake-forest","name":"Bhan Baitong Thai Cuisine","image_url":"https://s3-media2.fl.yelpcdn.com/bphoto/O4xd8Sw9C4EOIW8CNRJk-w/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/bhan-baitong-thai-cuisine-lake-forest?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":477,"categories":[{"alias":"thai","title":"Thai"}],"rating":4,"coordinates":{"latitude":undefined,"longitude":undefined},"transactions":["delivery","pickup"],"price":"$","location":{"address1":"23808 Mercury Rd","address2":"","address3":"","city":"Lake Forest","zip_code":"92630","country":"US","state":"CA","display_address":["23808 Mercury Rd","Lake Forest, CA 92630"]},"phone":"+19495950899","display_phone":"(949) 595-0899","distance":6549.60985566},{"id":"thai-cafe-irvine","name":"Thai Cafe","image_url":"https://s3-media4.fl.yelpcdn.com/bphoto/JC00i7rqgwJQUHs2b6th0w/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/thai-cafe-irvine?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":718,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.68886,"longitude":-117.77078},"transactions":[],"price":"$$","location":{"address1":"14715 Jeffrey Rd","address2":"","address3":"","city":"Irvine","zip_code":"92618","country":"US","state":"CA","display_address":["14715 Jeffrey Rd","Irvine, CA 92618"]},"phone":"+19495595382","display_phone":"(949) 559-5382","distance":2430.198994796},{"id":"thai-bamboo-bistro-irvine","name":"Thai Bamboo Bistro","image_url":"https://s3-media1.fl.yelpcdn.com/bphoto/iP1WEJtYQjiFUqElf6ttQQ/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/thai-bamboo-bistro-irvine?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":284,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.65530508528,"longitude":-117.77793165476},"transactions":[],"price":"$$","location":{"address1":"6715 Quail Hill Pkwy","address2":"","address3":"","city":"Irvine","zip_code":"92603","country":"US","state":"CA","display_address":["6715 Quail Hill Pkwy","Irvine, CA 92603"]},"phone":"+19495094771","display_phone":"(949) 509-4771","distance":2003.703456178},{"id":"thai-corner-lake-forest-2","name":"Thai Corner","image_url":"https://s3-media4.fl.yelpcdn.com/bphoto/fEkRVVdjMtq9SzTH57mq_g/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/thai-corner-lake-forest-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":626,"categories":[{"alias":"thai","title":"Thai"},{"alias":"chinese","title":"Chinese"},{"alias":"desserts","title":"Desserts"}],"rating":4,"coordinates":{"latitude":33.638400342001,"longitude":-117.6805472374},"transactions":[],"price":"$$","location":{"address1":"22371 El Toro Rd","address2":"Ste A","address3":"","city":"Lake Forest","zip_code":"92630","country":"US","state":"CA","display_address":["22371 El Toro Rd","Ste A","Lake Forest, CA 92630"]},"phone":"+19493808869","display_phone":"(949) 380-8869","distance":8254.82145814},{"id":"thai-kitchen-irvine-2","name":"Thai Kitchen","image_url":"https://s3-media2.fl.yelpcdn.com/bphoto/YgoprfoQnNTHWcrGbx7l-w/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/thai-kitchen-irvine-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":408,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.681432906204,"longitude":-117.80525852855},"transactions":[],"price":"$$","location":{"address1":"4250 Barranca Pkwy","address2":"Ste U","address3":"","city":"Irvine","zip_code":"92614","country":"US","state":"CA","display_address":["4250 Barranca Pkwy","Ste U","Irvine, CA 92614"]},"phone":"+19498571788","display_phone":"(949) 857-1788","distance":4219.370186944},{"id":"elephant-cafe-lake-forest-2","name":"Elephant Cafe","image_url":"https://s3-media3.fl.yelpcdn.com/bphoto/4lN1iIwvJf4C8Q2VLrtaNQ/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/elephant-cafe-lake-forest-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":238,"categories":[{"alias":"thai","title":"Thai"},{"alias":"noodles","title":"Noodles"},{"alias":"soup","title":"Soup"}],"rating":4,"coordinates":{"latitude":33.623224,"longitude":-117.696743},"transactions":["pickup"],"price":"$","location":{"address1":"23384 El Toro Rd","address2":"","address3":"","city":"Lake Forest","zip_code":"92630","country":"US","state":"CA","display_address":["23384 El Toro Rd","Lake Forest, CA 92630"]},"phone":"+19494723100","display_phone":"(949) 472-3100","distance":7852.64739214},{"id":"bangkok-corner-costa-mesa","name":"Bangkok Corner","image_url":"https://s3-media4.fl.yelpcdn.com/bphoto/afWFDcklRsGCAvO3SoQJxg/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/bangkok-corner-costa-mesa?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":243,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.656173706055,"longitude":-117.90325164795},"transactions":[],"price":"$","location":{"address1":"2360 Newport Blvd","address2":null,"address3":"","city":"Costa Mesa","zip_code":"92627","country":"US","state":"CA","display_address":["2360 Newport Blvd","Costa Mesa, CA 92627"]},"phone":"+19495488366","display_phone":"(949) 548-8366","distance":13080.66241178},{"id":"siamese-express-aliso-viejo","name":"Siamese Express","image_url":"https://s3-media4.fl.yelpcdn.com/bphoto/zNYOfDKyvctrjJxulcU-AQ/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/siamese-express-aliso-viejo?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":180,"categories":[{"alias":"thai","title":"Thai"}],"rating":4,"coordinates":{"latitude":33.5714989,"longitude":-117.707077},"transactions":["pickup"],"price":"$","location":{"address1":"26952 La Paz Rd","address2":"Ste C","address3":"","city":"Aliso Viejo","zip_code":"92656","country":"US","state":"CA","display_address":["26952 La Paz Rd","Ste C","Aliso Viejo, CA 92656"]},"phone":"+19498310882","display_phone":"(949) 831-0882","distance":11889.015826202},{"id":"the-wheel-of-life-irvine","name":"The Wheel Of Life","image_url":"https://s3-media1.fl.yelpcdn.com/bphoto/n8y4-3Dtyunn7Gt3YCLhnA/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/the-wheel-of-life-irvine?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":542,"categories":[{"alias":"vegetarian","title":"Vegetarian"},{"alias":"thai","title":"Thai"},{"alias":"vegan","title":"Vegan"}],"rating":4,"coordinates":{"latitude":33.705309481774,"longitude":-117.78483656257},"transactions":[],"price":"$$","location":{"address1":"14370 Culver Dr","address2":"Ste 2G","address3":"","city":"Irvine","zip_code":"92604","country":"US","state":"CA","display_address":["14370 Culver Dr","Ste 2G","Irvine, CA 92604"]},"phone":"+19495518222","display_phone":"(949) 551-8222","distance":4619.309040618},{"id":"bangkok-taste-santa-ana-2","name":"Bangkok Taste","image_url":"https://s3-media3.fl.yelpcdn.com/bphoto/tuXZLs66clQH23ShcFm4kA/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/bangkok-taste-santa-ana-2?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":295,"categories":[{"alias":"thai","title":"Thai"}],"rating":4,"coordinates":{"latitude":33.774364516139,"longitude":-117.85309106111},"transactions":[],"price":"$","location":{"address1":"2737 N Grand Ave","address2":"","address3":"","city":"Santa Ana","zip_code":"92705","country":"US","state":"CA","display_address":["2737 N Grand Ave","Santa Ana, CA 92705"]},"phone":"+17145322216","display_phone":"(714) 532-2216","distance":14460.38982728},{"id":"diho-siam-mission-viejo","name":"Diho Siam","image_url":"https://s3-media3.fl.yelpcdn.com/bphoto/lWwsouQL12Q-Bzh8cVLRSA/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/diho-siam-mission-viejo?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":228,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.5979,"longitude":-117.65948},"transactions":["pickup"],"price":"$$","location":{"address1":"27001 La Paz Rd","address2":"","address3":"","city":"Mission Viejo","zip_code":"92691","country":"US","state":"CA","display_address":["27001 La Paz Rd","Mission Viejo, CA 92691"]},"phone":"+19495971550","display_phone":"(949) 597-1550","distance":12369.87969804},{"id":"thai-bros-laguna-beach","name":"Thai Bros","image_url":"https://s3-media4.fl.yelpcdn.com/bphoto/-x7qTGnXbq8XMi321ScbjQ/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/thai-bros-laguna-beach?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":283,"categories":[{"alias":"thai","title":"Thai"}],"rating":4,"coordinates":{"latitude":33.5417024,"longitude":-117.7826722},"transactions":["pickup"],"price":"$$","location":{"address1":"238 Laguna Ave","address2":"","address3":"","city":"Laguna Beach","zip_code":"92651","country":"US","state":"CA","display_address":["238 Laguna Ave","Laguna Beach, CA 92651"]},"phone":"+19493769979","display_phone":"(949) 376-9979","distance":14151.0553672},{"id":"diho-siam-lake-forest","name":"Diho Siam","image_url":"https://s3-media3.fl.yelpcdn.com/bphoto/WJFu5QaUapiYRQqdoar-qA/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/diho-siam-lake-forest?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":197,"categories":[{"alias":"chinese","title":"Chinese"},{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.629881557186,"longitude":-117.71911964603},"transactions":["pickup"],"price":"$","location":{"address1":"23600 Rockfield Blvd","address2":"Ste 2L","address3":"","city":"Lake Forest","zip_code":"92630","country":"US","state":"CA","display_address":["23600 Rockfield Blvd","Ste 2L","Lake Forest, CA 92630"]},"phone":"+19498594192","display_phone":"(949) 859-4192","distance":5828.113604606},{"id":"cha-thai-restaurant-orange","name":"Cha Thai Restaurant","image_url":"https://s3-media2.fl.yelpcdn.com/bphoto/uF0IIuKmC_wc2nWyWRL-qg/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/cha-thai-restaurant-orange?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":318,"categories":[{"alias":"thai","title":"Thai"}],"rating":3.5,"coordinates":{"latitude":33.78748,"longitude":-117.86901},"transactions":["pickup"],"price":"$","location":{"address1":"1520 W Chapman Ave","address2":"","address3":"","city":"Orange","zip_code":"92868","country":"US","state":"CA","display_address":["1520 W Chapman Ave","Orange, CA 92868"]},"phone":"+17149783905","display_phone":"(714) 978-3905","distance":16510.1546864},{"id":"lanta-thai-fusion-orange","name":"Lanta Thai Fusion","image_url":"https://s3-media1.fl.yelpcdn.com/bphoto/NaPiv6WAXdxnRx0FbgSziQ/o.jpg","is_closed":false,"url":"https://www.yelp.com/biz/lanta-thai-fusion-orange?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw","review_count":547,"categories":[{"alias":"thai","title":"Thai"}],"rating":4.5,"coordinates":{"latitude":33.808829,"longitude":-117.845906},"transactions":[],"price":"$$","location":{"address1":"724 E Katella Ave","address2":"","address3":"","city":"Orange","zip_code":"92867","country":"US","state":"CA","display_address":["724 E Katella Ave","Orange, CA 92867"]},"phone":"+17145324922","display_phone":"(714) 532-4922","distance":17440.16652296}]




      initMap();
      console.log(restaurants);
      $('.map_header').text('Check out these ' + restaurants.length + ' spots near ' + search_location);
      if (restaurants.length === 0) {
        noResultsModal();
      }
    },
    error: function (response) {
      console.log(response);
      // dummy();
      // // ^
      // // L__fake data when mamp doesnt work
    }
  });
}

/**
 * function that will pop-up if the search result is zero
 */
function noResultsModal() {
  $('.modal-body').empty();
  var categories_div = $('<div>', {
    class: 'modal-div no-results'
  });
  $('.modal-title').text('Uh-Oh!');
  $('.modal-title').addClass('no-results-header');
  $(categories_div).append('Sorry but there are no results for ' + user_input + ' near ' + search_location);
  $(categories_div).append('<br>' + 'Try one of these common food categories:');
  var categories_list = $('<ul>');
  for (i = 0; i < common_categories.length; i++) {
    var food_category_li = $('<li>');
    $(food_category_li).append(common_categories[i]);
    $(categories_list).append(food_category_li);
  }
  $('.modal-body').append(categories_div, categories_list);
  $('#myModal').modal('show');
}

/**
 * initMap - initialize map object and setting up markers
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(findCenterForMap()[0], findCenterForMap()[1]),
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  for (var i = 0; i < restaurants.length; i++) {
    // Occasionally Yelp bugs out and doesn't send us lat/long coordinates,
    // if that's the case, we'll skip this one and jump into the next loop iteration
    if (!restaurants[i].coordinates.latitude || !restaurants[i].coordinates.longitude){
      continue;
    }

    var restaurant_name = "";
    for (var j = 0; j < 13 && j < restaurants[i].name.length; j++) {
      restaurant_name += restaurants[i].name[j];
    }
    if (restaurants[i].name.length > 13) {
      restaurant_name += '...';
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(restaurants[i].coordinates.latitude, restaurants[i].coordinates.longitude),
      map: map,
      icon: 'img/label-bg.png',
      mapId: i,
      label: restaurant_name
    });
    marker.addListener('click', function () {
      var business = restaurants[this.mapId];
      modalEdits(business);
    });
  }
}

/**
 * findCenterForMap - get all the latitude and longitude and added them together and get back average location for each one
 * @returns {[*,*]}
 */
function findCenterForMap() {
  var globalTotalLat = 0;
  var globalTotalLng = 0;
  for (var i = 0; i < restaurants.length; i++) {

    // Occasionally Yelp bugs out and doesn't send us lat/long coordinates,
    // if that's the case, we'll skip this one and jump into the next loop iteration
    if (!restaurants[i].coordinates.latitude || !restaurants[i].coordinates.longitude){
      continue;
    }

    globalTotalLat += restaurants[i].coordinates.latitude;
    globalTotalLng += restaurants[i].coordinates.longitude;
  }
  globalTotalLat /= restaurants.length;
  globalTotalLng /= restaurants.length;
  return [globalTotalLat, globalTotalLng];
}

/**
 * modalEdits - set up modal and modify it
 * @param business
 */
function modalEdits(business) {
  $('.modal-title').text(business.name);
  $('.modal-title').removeClass('no-results-header');
  var div = $('<div>', {
    class: 'modal-div'
  });
  var img = $('<img>', {
    src: business.image_url
  });
  var address = $('<h4>', {
    text: 'Address'
  });
  var address_info = $('<p>', {
    text: formatAddress(business.location)
  });
  var categories = $('<h4>', {
    text: 'Categories'
  });
  var categories_listing = business.categories[0].title;
  for (var i = 1; i < business.categories.length; i++) {
    categories_listing += ", " + business.categories[i].title;
  }
  var categories_info = $('<p>', {
    text: categories_listing
  });
  var website_url = $('<a>', {
    text: 'View on Yelp',
    href: business.url,
    target: '_blank'
  });

  var rating = $('<h4>', {
    text: 'Rating'
  });
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

  $(div).append(img, address, address_info, categories, categories_info, rating, rating_info, website_url);
  $('.modal-body').empty().append(div);
  $('#myModal').modal('show');
}

/**
 * formatAddress - format the address object that is passed and return the formatted address string
 * @param address
 * @returns {string}
 */
function formatAddress(address) {
  return address.address1 + ", " + address.city + ", " + address.state + " " + address.zip_code;
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
 * getAddressFromCoords - using Google's Reverse Geocoding API, get a human-readable address from the user's location coordinates
 */
function getAddressFromCoords() {
  $.ajax({
    method: 'get',
    dataType: 'json',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + user_location.lat + ',' + user_location.lng + '&key=AIzaSyAqq4jH5c4jX1asTtuCjYye7CrPotGihto',
    success: function (response) {
      $('#input_location').val(response.results[0].address_components[1].short_name + ', ' + response.results[0].address_components[3].short_name);
    },
    error: function (response) {
      console.log('Unable to convert user\'s coordinates into address: ', response);
    }
  });
}

/**
 * positionError - handles errors if we're unable to determine the user's location
 * @param {object} error
 */
function positionError(error) {
  switch (error.code) {
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