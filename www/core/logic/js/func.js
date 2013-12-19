$('._header_nav a').click(function (e) {
    var requestedAction = $(this).attr('href');
    switch (requestedAction) {
        case "today_date":
            dbAction("dates", "dates", today_date, "._console");
            break;
        case "tomorrow_date":
            dbAction("dates", "dates", tomorrow_date, "._console");
            break;
    }
    e.preventDefault();
});

function dbAction(db, target, data, location) {
    $.getJSON('core/logic/js/db/' + db + '.json', function (db) {
        var object = _.find(db, function (item, key) {
            return key === target;
        });
        console.log(object);
       var  output = _.find(object, function (item) {
           return _.contains(item, data);
        });
       post(location, output.data);
    });
}
function post(location, data) {
    $(location).append("<span>"+ data + "</span>");
}
$("#link").click(function (event) {
    var ref = window.open('http://google.com', '_blank', 'location=yes');
    event.preventDefault();
});