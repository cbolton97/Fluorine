
//watches nav for user input
$('#wrapper-nav ul a').bind(trigger, function (event) {
	console.clear();
	var requestedPage = $(this).attr('href');
	console.log("Navigation requesting page '" + requestedPage + "'");
	console.log("-----------------------------");
	loadPage(requestedPage, 'nav');
	event.returnValue = false;
	event.preventDefault();
	navigator.notification.vibrate(2000);
});


//main loader func, aka the router
function loadPage(requestedPage, source){
	console.log("loadPage has received '" + requestedPage + "' from '" + source + "'");
	$('.content-element').hide();
	window.scrollTo(0, 1);
	$('title').html(requestedPage);
	$('.'+ requestedPage).removeAttr('style');
	$('.header-refresh').attr('href', requestedPage);

	switch(requestedPage){
		case 'rotation':
            rotation();

			break;

	    case 'staff':
	        staff();
	        break;

	    case 'blogs':
	        blogs();
	        break;

		case 'about':
			about();
		    break;
	}
	console.log("-----------------------------");
}



	

