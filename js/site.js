$ = jQuery;

// on ready
jQuery(document).ready(function($) {
	screenSizeDetect();
	initExternalLinks();
	//initOnePagerNavigationScroller();
	initBackButton();
	initMenuToggle();
	initSearchForm();

	initAweSome();

	initFormElements();
	//initFlexslider();
	initGoogleMaps();
	
	initFancyMenu();
	
	initSinglePage();
});

function initSinglePage() {
	if ( !$('body.single').length > 0 || isMobile) return;
	
	// set header height for long titles
	var headerHeight = $('article .entry-title').innerHeight();
	$('article .single-slideshow').css('padding-top', headerHeight+"px");
	
	// set width of images for "single image slideshow"
	if ( $('.hue-slideshow .single-image').length > 0 ) {
		var $container = $('.hue-slideshow.gallery');
		var $image = $('.hue-slideshow .single-image img');
		if (  $image.width()+220 > $container.width() ) {
			console.log("x");
			$image.css('width', ($container.width()-220)+"px")
				.css("height", "auto")
				.css("margin-top", (($container.height()-$image.height())/2)+"px");
		}
	}
	
} 

function initFancyMenu() {
	//if (!isSmall)
		$('.primary-navigation-inner').css("width", $(window).height()+"px").css("margin-top", $(window).height()+"px");
	if ( $('.single-slideshow').length > 0 ) {
		//$('.single-slideshow').css("padding-top", $('.entry-header').height()+"px");
	}	
	
	var screenHeight = $(window).height();
	if ( screenHeight <= 863 ) {
		$('.primary-menu-container').addClass("small");
	} else {
		$('.primary-menu-container').removeClass("small");
	}
	
}


function hueAjaxInist() {
	initMasonry();
	initFlickity();
}


// on load
$(window).load(function() {
	initMasonry();
	initFlickity();
	
	$('.site-branding .site-title').addClass("active");
});

// on resize
var resizeTimeout = false;
$(window).resize(function(){
	if(resizeTimeout !== false) clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(resizeHandler, 100);
});
function resizeHandler() {
	screenSizeDetect();
	initFancyMenu();
	initMasonry();
	initFlickity();
	initSinglePage();
}

// on scroll
var scrollTimeout = false;
var scrollPosition = 0;
$(window).scroll(function(){
	if(scrollTimeout !== false) clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(scrollHandler, 100);
});
function scrollHandler() {
	if ( scrollPosition < $(window).scrollTop() ) {
		// scroll up
	} else {
		// scroll down
	}
	scrollPosition = $(window).scrollTop(); // leave this at the end!
}

/* Responsive detection */
var isSmall = false;
var isMobile = false;
function screenSizeDetect() {
	var size = $(".viewport-detector").css("z-index");
	if ( size <= 1 ) {
		isMobile = true;
		console.log("isMobile");
	} else if ( size <= 2 ) {
		isSmall = true;
		isMobile = false;
		console.log("isSmall");
	} else {
		isSmall = false;
		isMobile = false;
	}
}

function initExternalLinks() {
	// open external links in new window
	$.expr[':'].external = function(obj) {
		return !obj.href.match(/^mailto\:/) && (obj.hostname != location.hostname);
	};
	$('a:external').addClass('external');
	$('a:external').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		window.open(this.href, '_blank');
	});
}

function initBackButton() {
	if ( !$('#back-button').length > 0 ) return;

	if ( history.length == 1 ) {
		$('#back-button').hide();
	}
	$('#back-button').click(function(event) {
		if (!$(this).hasClass("overview")) {
			event.preventDefault();
			event.stopPropagation();
			window.history.back();
		}
	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27) { // escape key
			window.history.back();
		}
	});
}

function initMenuToggle() {
	var header = $( '#masthead' ), button, menu, widgets, social;
	if ( ! header ) return;
	button = header.find( '.menu-toggle' );
	if ( ! button ) return;

	// Hide button if there are no widgets and the menus are missing or empty.
	menu    = header.find( '.primary-navigation' );
	widgets = header.find( '#widget-area' );
	social  = header.find( '#social-navigation' );
	if ( ! widgets.length && ! social.length && ( ! menu || ! menu.children().length ) ) {
		button.hide();
		return;
	}

	button.on( 'click', function() {
		menu.toggleClass( 'toggled-on' );
		menu.trigger( 'resize' );
		$( this ).toggleClass( 'toggled-on' );
	} );
}

function initSearchForm() {
	if ( isSmall || $('#searchform').length == 0 ) return;

	$('.search-form-button').on('click', function(e) {
		$('.search-form-container').show(350, function() {
			$('.search-form-button').hide();
			$('.search-form-container input:text').focus();
		});

	});
	$(document).click(function(event) {
	    if(!$(event.target).closest('#searchform').length && !$(event.target).is('#searchform')) {
	        if($('.search-form-container').is(":visible")) {
	            $('.search-form-container').hide(350);
	            $('.search-form-button').show();
	        }
	    }
	});
}

function initMasonry() {
	if ( !$('.article-container').length > 0 ) return;
	if ( !$('.article-container *').length > 0 ) return;

	var $masonry_grid_startpage = $('.article-container').masonry({
		columnWidth: $('.article-container').width() / $('.article-container article').css("z-index"),
		itemSelector: 'article',
		gutter: 0
	});

	/* After all images are loaded, add show class to masonry elements */
	$masonry_grid_startpage.imagesLoaded().progress( function() {
		$masonry_grid_startpage.masonry('layout');
		$('.article-container article').addClass("show");
	});
}

function initOnePagerNavigationScroller() {
	//remove ids from content elements to disable page jumps
	$('.onepager-page').each(function() {
		var id = $(this).attr("id");
		$(this).attr("data-id", id);
		$(this).attr("id", "");
	});

	// check for hash in url bar
	goToOnePagerLink(location.hash);

	// click event for onpager links
	$('a.onepager-link').click(function(e){
		e.preventDefault();
		goToOnePagerLink($(this).attr("href"));
		history.pushState(null, null, $(this).attr("href"));
		return false;
	});

	// on history back event
	$(window).on("popstate", function() {
		console.log("popState: "+location.hash);
		goToOnePagerLink(location.hash);
	});
}

/* Go to link - Funcion for initOnePagerNavigationScroller */
function goToOnePagerLink(linkid) {
	var linkid = linkid.replace('#', '');
	if (linkid.length > 0 ) {
		var elemPos = $('.onepager-page[data-id="'+linkid+'"]').offset();
		setTimeout(function() {
			$('html, body').animate({
				scrollTop: elemPos.top-15
			}, 300, 'swing', function() {});
		}, 10);
	}
}

function initFormElements() {
	$('input').iCheck({
	    checkboxClass: 'icheckbox_hue',
	    radioClass: 'iradio_hue',
	    increaseArea: '-10%' // optional
	});
	$('select').chosen({
		disable_search: true
	});
}

function initFlexslider() {
	if ( !$('.flexslider').length > 0 ) return;

	$('.flexslider').flexslider({
    	animation: "slide",
    	pauseOnHover: false,
    	controlNav: true,
    	directionNav: true,
    	pausePlay: true,
    	prevText: " ",
    	nextText: " ",
    	slideshowSpeed: 6000
   	});
}

var $slider = "";
var $slider_startpage = "";
var isFlickity = false;

function initFlickity() {
	if ( !$('.flickity-slideshow').length > 0 ) return;
	
		
	if ( $('.hue-slideshow.fullscreen').length > 0 ) { // for the start page
		//console.log("dd");
		$slider_startpage = $('.hue-slideshow.fullscreen .flickity-slideshow').flickity({
	    	cellAlign: 'center',
			contain: false,
			cellSelector: '.slide',
			wrapAround: true,
			percentPosition: false,
			setGallerySize: false,
			autoPlay: true,
			autoPlay: 300,
			pauseAutoPlayOnHover: false,
			pageDots: false,
			draggable: false,
			freeScroll: false,
			prevNextButtons: false
	   	});
	   	isFlickity = true;
	   	
	} else { // for the single project view
	
		if (!isMobile) { // if desktop
		
			if ($slider.length > 0) $('.flickity-slideshow').flickity('destroy');
			
			$slider = $('.flickity-slideshow').flickity({
		    	cellAlign: 'left',
				contain: true,
				cellSelector: '.slide',
				setGallerySize: true,
				wrapAround: false,
				percentPosition: false,
				pageDots: false,
				resize: true,
				prevNextButtons: true,
				draggable: true,
				freeScroll: true
		   	});
		   	
		   	var flkty = $slider.data('flickity');
		   	var lastSlideCell = flkty.cells.length-1;
		   	var lastTargetPos = 0;
		   	for ( var i = 0; i < flkty.cells.length; i++) {
			   	if ( flkty.cells[i].target != lastTargetPos ) {
				   	lastTargetPos = flkty.cells[i].target;
				   	lastSlideCell = i;
			   	}
		   	}
		   	
		   	$slider.on( 'cellSelect', function() {
			  	if ( (flkty.selectedIndex) >= lastSlideCell ) {
				  	$('.flickity-prev-next-button.next').hide();
			  	} else {
				  	$('.flickity-prev-next-button.next').show();
				}
			});
			
			isFlickity = true;
		   	
		   //	$slider.flickity('resize');
		   	//$slider.flickity('reloadCells');
		   	
		} else { // if ipad and smaller
			if (isFlickity) {
				$('.flickity-slideshow').flickity('destroy');	
				isFlickity = false;
			}
		}

		
	}	
	/*if (!isSmall) { // if desktop
		
	} else { // if ipad and smaller
		if ( $(".viewport-detector").css("z-index") > 0 ) { // if ipad
			if ( $('.hue-slideshow.fullscreen').length > 0 ) {
				//console.log("dd");
				$slider_startpage = $('.hue-slideshow.fullscreen .flickity-slideshow').flickity({
			    	cellAlign: 'center',
					contain: false,
					cellSelector: '.slide',
					wrapAround: true,
					percentPosition: false,
					setGallerySize: false,
					autoPlay: true,
					autoPlay: 300,
					pauseAutoPlayOnHover: false,
					pageDots: false,
					draggable: false,
					freeScroll: true,
					prevNextButtons: false
			   	});
			   	
			} else {
				
				if ($slider.length > 0) $('.flickity-slideshow').flickity('destroy')
				
				$slider = $('.flickity-slideshow').flickity({
			    	cellAlign: 'center',
					contain: true,
					cellSelector: '.slide',
					setGallerySize: true,
					wrapAround: false,
					percentPosition: false,
					pageDots: false,
					prevNextButtons: false,
					resize: true,
					prevNextButtons: true
			   	});
			   	
			   //	$slider.flickity('resize');
			   	//$slider.flickity('reloadCells');
			   	
			}
		} else { // if phone
			if ($slider.length > 0) $('.flickity-slideshow').flickity('destroy')
			
			if ( $('.hue-slideshow.fullscreen').length > 0 ) {
				//console.log("dd");
				$slider_startpage = $('.hue-slideshow.fullscreen .flickity-slideshow').flickity({
			    	cellAlign: 'center',
					contain: false,
					cellSelector: '.slide',
					wrapAround: true,
					percentPosition: false,
					setGallerySize: false,
					autoPlay: true,
					autoPlay: 300,
					pauseAutoPlayOnHover: false,
					pageDots: false,
					draggable: false,
					freeScroll: true,
					prevNextButtons: false
			   	});
			   	
			}
		}
	}*/
}

function initGoogleMaps() {
	if ( !$('#map').length > 0 ) return;

	var lat = $('#map').data("lat");
	var lng = $('#map').data("lng");
	var latlng = new google.maps.LatLng(lat, lng);
	var myOptions = {
		zoom: 15,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":0},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":0}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":17}]}],
		scrollwheel: false,
		disableDefaultUI: false,
		panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
	};
	var map = new google.maps.Map(document.getElementById("map"), myOptions);
	var markerImg = new google.maps.MarkerImage(
		templateUrl+"/img/marker.png",
		new google.maps.Size(70, 120), // size
        new google.maps.Point(0, 0), // offset
        new google.maps.Point(17, 60), // anchor
        new google.maps.Size(35, 60) // scaling
	);
	var marker = new google.maps.Marker({
		position: map.getCenter(),
		icon: markerImg,
		map: map
	});
}

function initAweSome() {
	$(document).mouseup(function(e) {
		// console.log(e.which + " " + e.shiftKey + " " + e.ctrlKey + " " + e.altKey + " " + e.metaKey);
		if ( ( e.which == 1 ) && e.shiftKey && e.altKey /*&& e.metaKey*/ ) {
			$("body").toggleClass("awesome");
		}
	});
}