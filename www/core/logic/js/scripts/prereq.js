//phonegap watching for app resume
document.addEventListener("resume", onResume, false);
function onResume() {
    setTimeout(function () {
        var page = $('.header-refresh').attr('href');
        loadPage(page, "resume");
    }, 0);
}
//global used to determine user input type ie touchstart
var trigger = "click";

//creates time, space, and quite possibly the universe.
var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

var today = new Date();
var todayDate = ((today.getDate() < 10) ? "0" : "") + today.getDate();
function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
}

var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
var tomorrowDate = ((tomorrow.getDate() < 10) ? "0" : "") + tomorrow.getDate();
function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
}

var today_weekday = days[today.getDay()];

var today_date = months[today.getMonth()] + " " + todayDate + ", " + (fourdigits(today.getYear()));
var tomorrow_date = months[tomorrow.getMonth()] + " " + tomorrowDate + ", " + (fourdigits(tomorrow.getYear()));

console.log("Today's date: " + today_date);
console.log("Tomorrow's date: " + tomorrow_date);
console.log("-----------------------------");

//error handling
function error(location, message) {
        console.log("Error called from " + location + ": " + message + " ");
    switch(location){
        case "today":
            $('#timetable-today-loader').load('./core/styling/templates/timetable-ui.html #error-today', function () {

                $('.error-message-today').html(message);
            });
            break;
        case "tomorrow":
            $('#timetable-tomorrow-loader').load('./core/styling/templates/timetable-ui.html #error-tomorrow', function () {

                $('.error-message-tomorrow').html(message);
            });
            break;
    }
    
}
//animation plugin for refresh button
$.fn.animateRotate = function (angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function (i, e) {
        args.step = function (now) {
            $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(this, arguments);
        };

        $({ deg: 0 }).animate({ deg: angle }, args);
    });
};
//watches refresh button
$('.header-refresh').bind(trigger, function (event) {
    console.clear();
    var refreshTarget = $(this).attr('href');
    console.log("refresh: " + refreshTarget);
    loadPage(refreshTarget, "refresh button");
    $('.header-refresh').animateRotate(360, 1000, "linear");
    event.preventDefault();
    event.returnValue = false;
});


//watches lists for web links and parses them with phonegap code
$('.list-data').on(trigger, '.item-web', function (event) {
    var link = $(this).attr('href');
    var ref = window.open(link, '_system', 'location=yes');
    //insert InAppBrowser code for phonegap.
    event.preventDefault();
    event.returnValue = false;
});
