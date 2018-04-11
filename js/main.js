var me = {};

var you = {};

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0) {
    var control = "";
    var date = formatAMPM(new Date());

    if (who == "me") {

        control = '<li tabindex="1" class="left clearfix">' +
            '<div class="chat-body clearfix">' +
            '<div class="header">' +
            '<strong class="primary-font">MapChat</strong> <small class="pull-right text-muted"><i class="fa fa-calendar"></i>' + date + '</small>' +
            '</div>' +
            '<p>' + text + '</p>' +
            '</div>' +
            '</li>';
    } else {
        control = '<li tabindex="1" class="left clearfix">' +
            '<div class="chat-body clearfix">' +
            '<div class="header">' +
            '<strong class="primary-font">You</strong> <small class="pull-right text-muted"><i class="fa fa-calendar"></i>' + date + '</small>' +
            '</div>' +
            '<p>' + text + '</p>' +
            '</div>' +
            '</li>';
    }
    setTimeout(
        function () {
            $("ul").append(control);
            $('div').animate({
                    scrollTop: $("#chat li").last().offset().top
                },
                'slow');

        }, time);

}

function resetChat() {
    $("ul").empty();
}

$(document).ready(function () {
    $("#mytext").on("keyup", function (e) {
        if (e.which == 13) {
            var text = $(this).val();
            $(this).val('');
            find(text)
        }
    });
    $('#btn-chat').click(function (e) {
        var text = $('#mytext').val();
        find(text)
        document.getElementById("mytext").innerHTML = "";
    });

    function find(address) {
        var text = address
        if (text !== "") {
            insertChat("you", text);
            url = "https://nominatim.openstreetmap.org/search/" + text + "?format=json&addressdetails=1&limit=1"
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (data == "") {
                        insertChat("me", "Sorry I can't find the address you are searching for, lets try again.", 100);
                        return;
                    }
                    var lon = data[0].lon
                    var lat = data[0].lat
                    var state_url = "https://demo.boundlessgeo.com/geoserver/wfs?service=WFS&request=GetFeature&version=1.0.0&typeName=topp:states&outputFormat=application/json&CQL_FILTER=INTERSECTS%28the_geom,%20POINT(" + lon + " " + lat + "))";
                    $.ajax({
                        url: state_url,
                        type: 'GET',
                        dataType: 'json',
                        async: false,
                        lat: lon,
                        lon: lat,
                        success: function (data) {
                            if (data.features.length == 0){
                                insertChat("me", "Oops, I cannot find the state you are in.", 1500);
                                return;
                            }
                            var state = data.features[0].properties.STATE_NAME;
                            insertChat("me", "You are currently in the state of " + state + ".", 1500);
                        },
                        error: function () {
                            insertChat("me", "Sorry I can't locate what state you are in right now.", 100);
                            return;
                        }
                    });
                },
                error: function () {
                    insertChat("me", "Sorry I can't search for address right now, lets try again.", 100);
                    return;
                }
            });
        }
    };
});

//-- Clear Chat
resetChat();

//-- Print Messages
insertChat("me", "Hi, I'm MapChat here to help you with find out information about what state you are in!", 0);
$('#chat').animate({
    scrollTop: $('#chat').prop("scrollHeight")
}, 500);
insertChat("me", "Let's get started, what is the address you are searching?", 1500);
