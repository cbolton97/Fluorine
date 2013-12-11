function sendMessage(request) {
    console.log(request);
    $.getJSON('core/logic/js/db/dates.json', function (data) {
        var dates = data.dates;
        var requestedData = _.filter(dates, function (item) {
            return _.contains(item, request);
        });
        $('._output').append(requestedData[0].message + "<br />");
    });
}
$('._nav a').click(function (e) {
    var requestedMessage = $(this).attr('href');
    switch (requestedMessage) {
        case "today_date":
            sendMessage(today_date);
            break;
        case "tomorrow_date":
            sendMessage(tomorrow_date);
            break;
    }
    e.preventDefault();
});

