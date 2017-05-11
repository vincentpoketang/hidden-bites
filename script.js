/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */
$(document).ready(function(){
    clickHandler();
});

var restaurants = [];

function clickHandler(){
    $('button').click(function() {
        console.log('clicklick');
        ajaxCall();
    })
}

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

