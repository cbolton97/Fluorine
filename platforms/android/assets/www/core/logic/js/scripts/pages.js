//each func represents a page in the ui

function rotation(){
	$.getJSON('./core/logic/db/rotation.json',function(data){
		
		for (var r in data.rotations){
		    if (data.rotations[r].date === today_date) {
		        var today = data.rotations[r];
		        loadTimeTable(today.structure, today.order, "today");
		    } 
			if(data.rotations[r].date === tomorrow_date){
				var tomorrow = data.rotations[r];
				loadTimeTable(tomorrow.structure, tomorrow.order, "tomorrow");
			} 
		}

		var checkOutputToday = _.isUndefined(today);
		var checkOutputTomorrow = _.isUndefined(tomorrow);

		if (checkOutputToday) {
            error("today", "Today's schedule could not be loaded.")
		}
		if (checkOutputTomorrow) {
		    error("tomorrow", "Tomorrow's schedule could not be loaded.")
		}
	});
}
function staff() {
    $('.list-data').html("");
    $.getJSON('./core/logic/db/staff.json', function (data) {
        
        for (a in data.admin) {
            var source = data.admin[a];
            displayListItem("admin", source);
        }

        for (t in data.teachers) {
            var source = data.teachers[t];
            displayListItem("teachers", source);
        }

        for (s in data.support) {
            var source = data.support[s];
            displayListItem("support", source);
        }
    });
}
function blogs() {
    $('.list-data').html("");
    $.getJSON('./core/logic/db/blogs.json', function (data) {

        for (b in data.blogs) {
            var source = data.blogs[b];
            displayListItem("blogs", source);
        }

    });
}
function about() {
    $.getJSON('./core/logic/db/about.json', function (data) {
        console.log(data.version);
        $('.current-version').html(data.version);

    });
}