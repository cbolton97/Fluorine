
//watches nav for user input
$('#wrapper-nav ul a').bind(trigger, function (event) {
	console.clear();
	var requestedPage = $(this).attr('href');
	console.log("Navigation requesting page '" + requestedPage + "'");
	console.log("-----------------------------");
	loadPage(requestedPage, 'nav');
	
	event.preventDefault();
});


//main loader func, aka the router
function loadPage(requestedPage, source){
	console.log("loadPage has received '" + requestedPage + "' from '" + source + "'");
	$('.content-element').hide();

	switch(requestedPage){
		case 'rotation':
			$('title').html('rotation');
			$('.rotation').removeAttr('style');
            $('.header-refresh').attr('href', 'rotation');
            rotation();

			break;

	    case 'staff':
	        $('title').html('staff');
	        $('.staff').removeAttr('style');
	        $('.header-refresh').attr('href', 'staff');
	        staff();
	        break;

	    case 'blogs':
	        $('title').html('blogs');
	        $('.blogs').removeAttr('style');
	        $('.header-refresh').attr('href', 'blogs');
	        blogs();
	        break;

		case 'about':
			$('title').html('about');
			$('.about').removeAttr('style');
			$('.header-refresh').attr('href', 'about');
			about();
		    break;
	}
	console.log("-----------------------------");
}



	

