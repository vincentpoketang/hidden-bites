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
    })
}

function ajaxCall() {
    $.getJSON("static_data.json", function (data) {
        console.log(data);
    })
}
