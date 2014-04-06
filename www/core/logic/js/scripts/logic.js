

//1 PREREQ.JS
//backbutton logic
function onBackKeyDown(target) {
    console.log("Processing back request from " + target);
    loadPage(target, "back button");
    $('.header-refresh').animateRotate(360, 1000, "linear");
}

//ios7 status bar fix
function onDeviceReady() {
    if (parseFloat(window.device.version) === 7.0) {
        $('#wrapper-header').css('padding-top', '20px');
        $('#content-container').css('padding-top', '3.5em');
    }    document.addEventListener("backbutton", onBackKeyDown, false);
}

    document.addEventListener('deviceready', onDeviceReady, false);


    //global used to determine user input type ie touchstart
    var trigger = "click";


    //phonegap watching for app resume
    document.addEventListener("resume", onResume, false);
    function onResume() {
        setTimeout(function () {
            var page = $('.header-refresh').attr('href');
            loadPage(page, "resume");
        }, 0);
    }


    //creates time, space, and quite possibly the universe.

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

        for( var i = 0; i < 2; i++){
            var rawDate = new Date(new Date().getTime() + n * 60 * 60 * 1000);

            var realDate = ((rawDate.getDate() < 10) ? "0" : "") + rawDate.getDate();
            var addDate = months[rawDate.getMonth()] + " " + realDate + ", " + (fourdigits(rawDate.getYear()));
            window.dateList.push(addDate);
            var n = n + 24;
           
        }
    }



    //error handling
    function error(location, message) {
        switch(location){
            case "today":
                $('#timetable-today-loader').load('./core/styling/templates/timetable-ui.html #error-today', function () {

                    $('.error-message-today').html(message);
                    $('.error-message-today').append("<span>Please refer to the school's website for the most up to date information.</span>");
                });
                break;
            case "tomorrow":
                $('#timetable-tomorrow-loader').load('./core/styling/templates/timetable-ui.html #error-tomorrow', function () {

                    $('.error-message-tomorrow').html(message);
                    $('.error-message-tomorrow').append("<span>Please refer to the school's website for the most up to date information.</span>");
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
                $.style(e, '-webkit-transform', 'rotate(' + now + 'deg)');
                if (step) return step.apply(this, arguments);
            };

            $({ deg: 0 }).animate({ deg: angle }, args);
        });
    };
    //watches refresh button
    $('.header-refresh').bind('click', function (event) {
        event.preventDefault();
        event.returnValue = false;
    });
    $('.header-refresh').bind(trigger, function (event) {
        var refreshTarget = $(this).attr('href');
        loadPage(refreshTarget, "refresh button");
        $('.header-refresh').animateRotate(360, 1000, "linear");
        event.preventDefault();
    });
    //watches back button
    $('.header-back').bind('click', function (event) {
        event.preventDefault();
        event.returnValue = false;
    });
    $('.header-back').bind(trigger, function (event) {
        var backTarget = $(this).attr('href');
        onBackKeyDown(backTarget);
        event.preventDefault();
    });
    //watches list-drop down
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

    //watches lists for web links and parses them with phonegap code

    $('.web-data').on('click', '.item-web', function (event) {
        var link = $(this).attr('href');
        var ref = window.open(link, '_system', 'location=yes');
        //insert InAppBrowser code for phonegap.
        event.preventDefault();
        event.returnValue = false;
    });

    //2 LOADER.JS
    //watches nav for user input
    $('.nav').bind('click', function (event) {
        event.returnValue = false;
        event.preventDefault();
    });
    $('.nav').bind(trigger, function (event) {

        var requestedPage = $(this).attr('href');
        loadPage(requestedPage, 'nav');
        event.returnValue = false;
        event.preventDefault();
    });


    //main loader func, aka the router
    function loadPage(requestedPage, source){
        $('.content-element').hide();
        $('title').html(requestedPage);
        $('.'+ requestedPage).removeAttr('style');
        $('.header-refresh').attr('href', requestedPage);
        routePage(requestedPage);
    }

    // 3 PAGES.JS
//each func represents a page in the ui


    var pageList = {
        swipe: function () {
            createDate();
            $.getJSON('./core/logic/db/rotation.json', function (data) {
                for (var d = 0; d < dateList.length; d++) {
                    for (var r in data.rotations) {
                        if (dateList[d] == data.rotations[r].date) {

                            var selectedDate = data.rotations[r];
                            window.selectedDates.push(selectedDate);
                        }
                    }
                    
                }
                swipe(window.selectedDates);
            });

        },
        list: function () {
            createDate();
            $.getJSON('./core/logic/db/rotation.json', function (data) {
                for (var d = 0; d < dateList.length; d++) {
                    for (var r in data.rotations) {
                        if (dateList[d] == data.rotations[r].date) {
                            
                            var selectedDate = data.rotations[r];
                            window.selectedDates.push(selectedDate);
                        }
                    }
                }
                console.log(window.selectedDates);
                for (var sd in window.selectedDates) {
                    $('.selectedDates-output').append(window.selectedDates[sd].date + '<br />')
                    $('.selectedDates-output').append(window.selectedDates[sd].order + '<br />')
                }
            });
        },
        rotationWeek: function(){
            window.scrollTo(0, 0);
            $('.header-back').attr('href', 'rotation');
            $('.header-back').show();
            $('.rotationWeek-console').html("It's alive!");
        },
        rotation: function () {
            window.scrollTo(0, 0);
            createDate();
            $.getJSON('./core/logic/db/rotation.json', function (data) {
                for (var r in data.rotations) {
                    if (data.rotations[r].date === window.today) {
                        var today = data.rotations[r];
                        loadTimeTable(today.structure, today.order, "today");
                    }
                    if (data.rotations[r].date === window.tomorrow) {
                        var tomorrow = data.rotations[r];
                        loadTimeTable(tomorrow.structure, tomorrow.order, "tomorrow");
                    }
                }

                var checkOutputToday = _.isUndefined(today);
                var checkOutputTomorrow = _.isUndefined(tomorrow);

                if (checkOutputToday) {
                    error("today", "Today's schedule could not be loaded")
                }
                if (checkOutputTomorrow) {
                    error("tomorrow", "Tomorrow's schedule could not be loaded")
                }
            });
        },
        staff: function () {
            $('.list-data').html("");
            $.getJSON('./core/logic/db/staff.json', function (data) {

                for (var a in data.admin) {
                    var source = data.admin[a];
                    displayListItem("admin", source);
                }

                for (var t in data.teachers) {
                    var source = data.teachers[t];
                    displayListItem("teachers", source);
                }

                for (var s in data.support) {
                    var source = data.support[s];
                    displayListItem("support", source);
                }
            });
        },
        sites: function () {
            $('.list-data').html("");
            $.getJSON('./core/logic/db/sites.json', function (data) {

                for (var ac in data.academics) {
                    var source = data.academics[ac];
                    displayListItem("academics", source);
                }

                for (var at in data.athletics) {
                    var source = data.athletics[at];
                    displayListItem("athletics", source);
                }

                for (var ar in data.arts) {
                    var source = data.arts[ar];
                    displayListItem("arts", source);
                }

                for (var w in data.workexperience) {
                    var source = data.workexperience[w];
                    displayListItem("workexperience", source);
                }


            });
        },
        about: function () {
            window.scrollTo(0, 0);
            $.getJSON('./core/logic/db/about.json', function (data) {
                $('.current-version').html(data.version);

            });
        }
    }
    function routePage(requestedPage) {
        pageList[requestedPage]();
    }

    //4 FUNC.JS
    //main func for 'rotation' 
    function loadTimeTable(structure, order, time) {
        $('#timetable-'+ time +'-loader').load('./core/styling/templates/timetable-ui.html #' + structure, function() {
            if (!(structure === "none")) {
                if (order === "1" || order === "2" || order === "3") {
                    var day = "1";
                    switch (order) {
                        case "1":
                            var blockRotation = new Array(1, 2, 3, 4);
                            break;
                        case "2":
                            var blockRotation = new Array(2, 3, 1, 4);
                            break;
                        case "3":
                            var blockRotation = new Array(3, 1, 2, 4);
                            break;
                    }
                } else {
                    var day = "2";
                    switch (order) {
                        case "5":
                            var blockRotation = new Array(5, 6, 7, 8);
                            break;
                        case "6":
                            var blockRotation = new Array(6, 7, 5, 8);
                            break;
                        case "7":
                            var blockRotation = new Array(7, 5, 6, 8);
                            break;
                    }
                }
                var blockPlacer = 1;
                for (i in blockRotation) {
                    $(this).find('#timetable' + blockPlacer).html(blockRotation[i]);
                    blockPlacer++;
                }
                $(this).find('.schedule-header-day').html("Day " + day);
            } else {
                error(time, "No school scheduled for " + time);
            }
		
            if(time === "today"){
                $(this).find('.schedule-header-title').html("Today's Schedule");
            } else if (time === "tomorrow") {
                $(this).find('.schedule-header-title').html("Tomorrow's Schedule");
            } else {
                error("header-title", "No 'time' variable specified.");
            }
        });
    }

    //main func for 'staff' and 'sites'
    function displayListItem(itemType, source) {
        switch (itemType) {
            case "admin":
                $('.admin-list-data').append("<li> <span class='font-light item-title'>" + source.title +
                "</span><span class='item-name font-light'> " + source.name +
                "</span><div class='item-link-container'><a href='mailto:" + source.email +
                "' class='item-email font-light'>Email: " + source.email + "</a> </div></li>");
                break;

            case "teachers":
                var teachersWebCheck = _.isUndefined(source.website);

                if (!(teachersWebCheck)) {
                    $('.teachers-list-data').append("<li><span class='font-light item-name'>" + source.name + "</span><div class='item-link-container'><a href='mailto:" +
                         source.email + "' class='font-light item-email'>Email: " + source.email + "</a><br /><a class='font-light item-web' href='" + source.website + "'>Visit their website</a></div></li>");
                } else {
                    $('.teachers-list-data').append("<li><span class='item-name font-light'>" + source.name +
                        "</span><div class='item-link-container'><a href='mailto:" + source.email + "' class='font-light item-email'> Email: " + source.email + "</a></div></li>");
                }
                break;

            case "support":
                var supportWebCheck = _.isUndefined(source.website);

                if (!(supportWebCheck)) {
                    $('.support-list-data').append("<li> <span class='item-title font-light'>" + source.title +
                        "</span><br /> <span class='item-name font-light'>" + source.name + "</span><div class='item-link-container'><a href='mailto:" +
                        source.email + "' class='item-email font-light'>Email: " + source.email + "</a><br /><a class='item-web font-light' href='" + source.website + "'>Visit their website</a></div></li>");
                } else {
               
                    $('.support-list-data').append("<li> <span class='item-title font-light'>" + source.title +
                        "</span><br /> <span class='item-name font-light'>" + source.name + "</span><div class='item-link-container'><a href='mailto:" + source.email +
                        "' class='item-email font-light'>Email: " + source.email + "</a></div></li>");
                }
                break;

            case "academics":
                $('.academics-list-data').append("<li><a class='font-light item-program item-web' href='" + source.website + "'>" + source.name + "</a></li>");
                break;
            case "athletics":
                $('.athletics-list-data').append("<li><a class='font-light item-program item-web' href='" + source.website + "'>" + source.name + "</a></li>");
                break;
            case "arts":
                $('.arts-list-data').append("<li><a class='font-light item-program item-web' href='" + source.website + "'>" + source.name + "</a></li>");
                break;
            case "workexperience":
                $('.workexperience-list-data').append("<li><a class='font-light item-program item-web' href='" + source.website + "'>" + source.name + "</a></li>");
                break;
        }
    }

    //5 INIT.JS

    

    //kick off
    loadPage('router', 'startup');


    //init phonegap
    app.initialize();

