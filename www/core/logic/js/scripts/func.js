//main func for 'rotation' 
function loadTimeTable(structure, order, time) {
	$('#timetable-'+ time +'-loader').load('./core/styling/templates/timetable-ui.html #' + structure, function() {
		console.log("timetable loaded for " + time);
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
		    error(time, "No school.");
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

//main func for 'staff' and 'blogs'
function displayListItem(itemType, source) {
    switch (itemType) {
        case "admin":
            $('.admin-list-data').append("<li> <span class='item-title'>" + source.title + "</span> <span class='item-name'>" + source.name + "</span><br /><a href='mailto:" + source.email + "' class='item-email'>" + source.email + "</a> </li>");
            break;
        case "teachers":
            var teachersWebCheck = _.isUndefined(source.website);

            if (!(teachersWebCheck)) {
                $('.teachers-list-data').append("<li><span class='item-name'>" + source.name + "</span><br /><a href='mailto:" + source.email + "' class='item-email'>" + source.email + "</a> - <a class='item-web' href='" + source.website + "'>website</a></li>");
            } else {
                $('.teachers-list-data').append("<li><span class='item-name'>" + source.name + "</span><br /><a href='mailto:" + source.email + "' class='item-email'>" + source.email + "</a> </li>");
            }
            break;
        case "support":
            var supportWebCheck = _.isUndefined(source.website);

            if (!(supportWebCheck)) {
                $('.support-list-data').append("<li> <span class='item-title'>" + source.title + "</span><br /> <span class='item-name'>" + source.name + "</span><br /><a href='mailto:" + source.email + "' class='item-email'>" + source.email + "</a> - <a class='item-web' href='" + source.website + "'>website</a> </li>");
            } else {
                console.log("meh");
                $('.support-list-data').append("<li> <span class='item-title'>" + source.title + "</span><br /> <span class='item-name'>" + source.name + "</span><br /><a href='mailto:" + source.email + "' class='item-email'>" + source.email + "</a> </li>");
            }
            break;

        case "blogs":
            $('.blogs-list-data').append("<li><a class='item-web' href='" + source.website + "'>" + source.name + "</a></li>");
            break;
    }
}
