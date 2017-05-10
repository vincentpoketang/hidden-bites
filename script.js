/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */
$(document).ready(function(){
    clickHandler();
});
function clickHandler(){
    $('button').click(function(){
        console.log('click initiated');
        ajaxCall();
    });
}

function ajaxCall(){
    $.ajax({
        dataType: 'json',
        url: 'static_data.json',

        success: function(result){
            console.log('success:' ,result);
        },
        error: function (result) {
            console.log('error ', result);
        }
    });
    console.log('');
}
