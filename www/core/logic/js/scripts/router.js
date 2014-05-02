
/*
TO DO

-reorganize function arrays
-build routeLayer paths for refresh, push, pop
-build new Rotation logic
-implment existing page functions to new architecture

*/
//global func for taking core requests

$('.page-container, .layer-container').hide();


//ios7 status bar fix
function onDeviceReady() {
    if (parseFloat(window.device.version) >= 7.0) {
        $('#wrapper-header').css('padding-top', '20px');
    } 
    document.addEventListener("backbutton", core["backbttn"], false);
}

document.addEventListener('deviceready', onDeviceReady, false);


//global used to determine user input type ie touchstart
var trigger = "click";


//phonegap watching for app resume
document.addEventListener("resume", onResume, false);
function onResume() {
    setTimeout(function () {
        var request = $('.action-refresh').attr('href'),
           sliceOrig = request.search(">"),
           sliceDest = request.search(","),
           origin = request.slice(0, sliceOrig).trim();
        destination = request.slice(sliceOrig + 1, sliceDest).trim(),
        data = request.slice(sliceDest + 1).trim();
        console.log(request);
        core[destination](origin, data);
    }, 0);
}
//animation plugin for refresh button
$.fn.animateRotate = function (angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function (i, e) {
        args.step = function (now) {
            $.style(e, '-webkit-transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(this, arguments);
        };

        $({ deg: 0 }).animate({ deg: angle }, args);
    });
};

//Date stuff
window.today;
window.tomorrow;
function createDate() {
    var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

    var today = new Date();
    var todayDate = ((today.getDate() < 10) ? "0" : "") + today.getDate();
    function fourdigits(number) {
        return (number < 1000) ? number + 1900 : number;
    }

    var today_weekday = days[today.getDay()];

    var todayAdd = months[today.getMonth()] + " " + todayDate + ", " + (fourdigits(today.getYear()));

    window.dateList = [todayAdd];
    window.selectedDates = [];

    var n = 24;

    for (var i = 0; i < 6; i++) {
        var rawDate = new Date(new Date().getTime() + n * 60 * 60 * 1000);

        var realDate = ((rawDate.getDate() < 10) ? "0" : "") + rawDate.getDate();
        var addDate = months[rawDate.getMonth()] + " " + realDate + ", " + (fourdigits(rawDate.getYear()));
        window.dateList.push(addDate);
        var n = n + 24;

    }
}

//events

$('.staff-list ul').on('click', 'li', function (event) {
    var childPanel = $(this).find('.item-link-container');
    var panelTest = $(childPanel).is(":visible");

    if (panelTest) {
        $(this).find('.item-link-container').hide();
        $('.item-link-container').hide();
    } else {
        $('.item-link-container').hide();
        $(this).find('.item-link-container').show();
    }
});
$(document).on('click', '.route-initiator', function (event) {
    event.returnValue = false;
    event.preventDefault();})
    .on(trigger, '.route-initiator', function (event) {
        var request     = $(this).attr('href'),
            sliceOrig   = request.search(">"),
            sliceDest   = request.search(","),
            origin      = request.slice(0, sliceOrig).trim();
            destination = request.slice(sliceOrig + 1, sliceDest).trim(),
            data        = request.slice(sliceDest + 1).trim();
        console.log(request);
        core[destination](origin, data);
        if ($(this).hasClass('action-refresh')) {
            $(this).animateRotate(360, 1000, "linear");
        }
        if ($(this).hasClass('week-day')) {
            $(this).addClass('selected');
        }
        if (origin === "nav") {
            $('#wrapper-nav ul a').removeClass("active");
            $(this).addClass("active");
        }
        event.returnValue = false;
       event.preventDefault();
    });



var currentLayer,
    currentPage,
    cacheLayer, //this should go
    requestedStackPos,
    //this is hella important
    core = {
        Rotation: function (currentLayer) {
            $('.action-back').attr('href', 'pop > routeLayer, Week_View');
            //check the layer
            switch (currentLayer) {
                case "Week_View":
                    $('.action-back').attr('href', '#');
                    $('.week-data-loader').html(" ");
                    $('.action-back').hide();
                    createDate();
                    $.getJSON('./core/logic/db/rotation.json', function (data) {
                        for (var d = 0; d < dateList.length; d++) {
                            for (var r in data.rotations) {
                                if (dateList[d] === data.rotations[r].date) {
                                    var selectedDate = data.rotations[r];
                                    window.selectedDates.push(selectedDate);
                                }
                            }
                        }
                        var bay = 0;
                        for (var sd in window.selectedDates) {
                            $('.week-data-loader').append("<div class='loader-" + bay + "'></div>");
                            var scheduleInfo = helper["formatSchedule"](window.selectedDates[sd].order);
                            helper["loadWeek"](window.selectedDates[sd].date, window.selectedDates[sd].day, window.selectedDates[sd].structure, scheduleInfo, bay)

                            bay++;
                        }
                    });
                    break;
                case "Day_View":
                    $('.action-back').show();
                    var selectedDate = $('.week-data-loader').find('.selected').find('.data').html();
                    $.getJSON('./core/logic/db/rotation.json', function (data) {
                        for (var r in data.rotations) {
                            if (selectedDate === data.rotations[r].date) {
                                var scheduleInfo = helper["formatSchedule"](data.rotations[r].order);

                                helper["loadDay"](data.rotations[r].date, data.rotations[r].day, data.rotations[r].structure, scheduleInfo)
                            }
                        }
                    });
                    break;
            }

        },
        Staff: function (currentLayer) {
            $('.action-back').attr('href', 'pop > routeLayer, Staff_list_View');
            //check the layer
            switch (currentLayer) {
                case "Staff_List_View":
                    $('.action-back').attr('href', '#');
                    $('.action-back').hide();
                    $('.list-data').html("");
                    $.getJSON('./core/logic/db/staff.json', function (data) {

                        for (var a in data.admin) {
                            var source = data.admin[a];
                            helper["displayListItem"]("admin", source);
                        }

                        for (var t in data.teachers) {
                            var source = data.teachers[t];
                            helper["displayListItem"]("teachers", source);
                        }

                        for (var s in data.support) {
                            var source = data.support[s];
                            helper["displayListItem"]("support", source);
                        }
                    });
                    break;
                case "Staff_Info_View":
                    $('.action-back').show();
                    break;
            }
        },
        Discover: function (currentLayer) {
            $('.action-back').attr('href', 'pop > routeLayer, Discover_list_View');
            switch (currentLayer) {
                case "Discover_List_View":
                    $('.action-back').attr('href', '#');
                    $('.action-back').hide();
                    $('.list-data').html("");
                    $.getJSON('./core/logic/db/sites.json', function (data) {

                        for (var ac in data.academics) {
                            var source = data.academics[ac];
                            helper["displayListItem"]("academics", source);
                        }

                        for (var at in data.athletics) {
                            var source = data.athletics[at];
                            helper["displayListItem"]("athletics", source);
                        }

                        for (var ar in data.arts) {
                            var source = data.arts[ar];
                            helper["displayListItem"]("arts", source);
                        }

                        for (var w in data.workexperience) {
                            var source = data.workexperience[w];
                            helper["displayListItem"]("workexperience", source);
                        }
                    });
                    break;
            }
        },
        About: function (currentLayer) {
            $('.action-back').attr('href', 'pop > routeLayer, About_View');
            switch (currentLayer) {
                case "About_View":
                    $('.action-back').attr('href', '#');
                    $.getJSON('./core/logic/db/about.json', function (data) {
                        $('.current-version').html(data.version);

                    });
                    break
            }
        },
        routeLayer: function (initiator, requestedLayer) {
            $.getJSON('./core/logic/db/pages.json', function (pages) {
                //function iterator for json loops
                var iterator = pages.Stacks.length;

                //get requestedPage
                for (var i = 0; i < iterator; i++) {
                    var possibleObjs = _.values(pages.Stacks[i]);
                    if (_.contains(possibleObjs, requestedLayer)) {
                        requestedPage = pages.Stacks[i].page;
                        break;
                    }
                }
                //get requestedStackPos, if it's available
                requestedStackPos = $('#' + requestedPage).children('.StackPos').attr('id');

                //inital set of routes
                switch (initiator) {

                    case "nav":
                        window.scrollTo(0, 0);

                        if (requestedPage !== currentPage) {
                            if (requestedStackPos === undefined) {
                                cacheLayer = requestedLayer;
                                console.log("Switching stacks, requested stack doesn't have a saved state.");

                            } else {
                                cacheLayer = requestedStackPos;
                                console.log("Switching stacks, resuming saved state.");
                            }
                            //set requestedStackPos
                            $('#' + currentLayer).addClass('StackPos');
                            $('#' + requestedLayer).removeClass('StackPos');


                        } else {
                            cacheLayer = requestedLayer;
                            console.log("Not switching stacks, resetting stack state");
                        }
                        break;

                    case "push":
                        cacheLayer = requestedLayer;
                        break;
                    case "pop":
                        cacheLayer = requestedLayer;
                        break;
                    default:
                        cacheLayer = requestedLayer;
                        console.log("Routing..");
                        break;

                }
                //cycle Layer
                currentLayer = cacheLayer;
                $('.action-refresh').attr('href', 'refresh > routeLayer, ' + currentLayer);
                //cycle Page
                currentPage = requestedPage;

                //in with the new, out with the old
                $('.page-container, .layer-container').hide();
                $('#' + currentPage + ', #' + currentLayer).removeAttr('style');




                //Run functions associated with currentPage and currentLayer 
                core[currentPage](currentLayer);
            });
        },
        scheduleError: function (reason, location, bay) {
            switch (location) {
                case "Week_View":
                    $('#timetable-today-loader').load('./core/styling/templates/Week_View_template #error', function () {

                        $('.loader-' + bay + '.error-reason').html(reason);
                        $('.loader-' + bay + '.error-reason').append("<span>Please refer to the school's website for the most up to date information.</span>");
                    });
                    break;
                case "Day_View":
                    $('#timetable-tomorrow-loader').load('./core/styling/templates/Day_View.html #error', function () {

                        $('.error-reason').html(reason);
                        $('.error-reason').append("<span>Please refer to the school's website for the most up to date information.</span>");
                    });
                    break;
            }

        },
        backbttn: function () {
           var request = $('.action-back').attr('href'),
           sliceOrig = request.search(">"),
           sliceDest = request.search(","),
           origin = request.slice(0, sliceOrig).trim();
            destination = request.slice(sliceOrig + 1, sliceDest).trim(),
            data = request.slice(sliceDest + 1).trim();
            console.log(request);
            core[destination](origin, data);
        }
    },
    helper = {
        formatSchedule: function (order) {
            var formattedSchedule = new Array;

            if (/^(?:1|2|3)$/.test(order)) {
                formattedSchedule.push(1);
                switch (order) {
                    case "1":
                        formattedSchedule.push(1, 2, 3, 4);
                        break;
                    case "2":
                        formattedSchedule.push(2, 3, 1, 4);
                        break;
                    case "3":
                        formattedSchedule.push(3, 1, 2, 4);
                        break;
                }


            } else {
                formattedSchedule.push(2);
                switch (order) {
                    case "5":
                        formattedSchedule.push(5, 6, 7, 8);
                        break;
                    case "6":
                        formattedSchedule.push(6, 7, 5, 8);
                        break;
                    case "7":
                        formattedSchedule.push(7, 5, 6, 8);
                        break;
                }
            }
            return formattedSchedule;

        },
        loadWeek: function (date, day, structure, scheduleInfo, bay) {;
            var blockRotation = new Array(scheduleInfo[1], scheduleInfo[2], scheduleInfo[3], scheduleInfo[4]);

            $('.loader-' + bay).load('./core/styling/templates/Week_View_template.html #' + structure, function () {
                var sliceMonth = date.search(" "),
                    sliceNum = date.search(","),
                    dateMonth = date.slice(0, sliceMonth).trim().slice(0, 3),
                    dateNum = date.slice(sliceMonth + 1, sliceNum).trim(),
                    dateDay = day.slice(0, 3);

                $(this).find('.data').html(date);
                $(this).find('.day').append(dateDay);
                $(this).find('.num').append(dateNum);
                $(this).find('.month').append(dateMonth);

                if (!(structure === "none")) {
                    var blockPlacer = 1;
                    for (i in blockRotation) {
                        $(this).find('.order').append('<span>' + blockRotation[i] + '</span>');
                        blockPlacer++;
                    }
                }else{console.log("caught one " + structure)}

            });
        },
        loadDay: function (date, day, structure, scheduleInfo) {
            var dayType = scheduleInfo[0],
                blockRotation = new Array(scheduleInfo[1], scheduleInfo[2], scheduleInfo[3], scheduleInfo[4]);
            $('.day-data-loader').load('./core/styling/templates/Day_View_template.html #' + structure, function () {

                if (!(structure === "none")) {

                    var blockPlacer = 1;
                    for (i in blockRotation) {
                        $('#timetable' + blockPlacer).html(blockRotation[i]);
                        blockPlacer++;
                    }
                    $('.schedule-header-title').html(day + " " + date);
                    $('.schedule-header-day').html("Day " + dayType);



                } 
            });
        },
        displayListItem: function(itemType, source) {
        switch (itemType) {
            case "admin":
                $('.admin-list-data').append("<li> <span class='font-light item-title'>" + source.title +
                "</span><span class='item-name font-light'> " + source.name +
                "</span><div class='item-link-container'><a href='mailto:" + source.email +
                "' class='item-email route-initiator font-light'>Email: " + source.email + "</a> </div></li>");
            break;

            case "teachers":
                var teachersWebCheck = _.isUndefined(source.website);

                if (!(teachersWebCheck)) {
                    $('.teachers-list-data').append("<li><span class='font-light item-name'>" + source.name + "</span><div class='item-link-container'><a href='mailto:" +
                            source.email + "' class='route-initiator font-light item-email'>Email: " + source.email + "</a><br /><a class='font-light route-initiator item-web' href='" + source.website + "'>Visit their website</a></div></li>");
                } else {
                    $('.teachers-list-data').append("<li><span class='item-name font-light'>" + source.name +
                        "</span><div class='item-link-container'><a route-initiator href='mailto:" + source.email + "' class='font-light item-email'> Email: " + source.email + "</a></div></li>");
                }
            break;

            case "support":
                var supportWebCheck = _.isUndefined(source.website);

                if (!(supportWebCheck)) {
                    $('.support-list-data').append("<li> <span class='item-title font-light'>" + source.title +
                        "</span><br /> <span class='item-name font-light'>" + source.name + "</span><div class='item-link-container'><a href='mailto:" +
                        source.email + "' class='item-email route-initiator font-light'>Email: " + source.email + "</a><br /><a class='route-initiator item-web font-light' href='" + source.website + "'>Visit their website</a></div></li>");
                } else {
               
                    $('.support-list-data').append("<li> <span class='item-title font-light'>" + source.title +
                        "</span><br /> <span class='item-name font-light'>" + source.name + "</span><div class='item-link-container'><a href='mailto:" + source.email +
                        "' class='item-email route-initiator font-light'>Email: " + source.email + "</a></div></li>");
                }
            break;

            case "academics":
                $('.academics-list-data').append("<li><a class='font-light item-program route-initiator item-web' href='" + source.website + "'>" + source.name + "</a></li>");
            break;
            case "athletics":
                $('.athletics-list-data').append("<li><a class='font-light item-program route-initiator item-web' href='" + source.website + "'>" + source.name + "</a></li>");
            break;
            case "arts":
                $('.arts-list-data').append("<li><a class='font-light item-program route-initiator item-web' href='" + source.website + "'>" + source.name + "</a></li>");
            break;
            case "workexperience":
                $('.workexperience-list-data').append("<li><a class='font-light item-program route-initiator item-web' href='" + source.website + "'>" + source.name + "</a></li>");
            break;
            }
        }
    };

core["routeLayer"]("startup", "Week_View");
//init phonegap
app.initialize();
