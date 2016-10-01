//var winHeight = ($(window).height()) - 300;
//$('.wrap').css({"marginTop": winHeight +"px"});


var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
if( iOS ) {
    var background_videos = document.querySelectorAll('video');
    for( i=0; i<background_videos.length; i++ ) {
        background_videos[i].parentNode.removeChild(background_videos[i]);
    }
}

if( iOS ) {
	var iphone_image = document.querySelector(".wrap");
	iphone_image.style.marginTop = "405px";
}

/*if ($(window).width() <= 549) {
    if($(window).scrollTop() > 10) {
        // the animation that's executed
        firstAnimation();
    }
} else if ($(window).width() > 549 && $(window).width() <= 991) {
    if($(window).scrollTop() > 480){
        // the animation that's executed
        firstAnimation();
    }
} else {
    if ($(window).scrollTop() > 50) {
        // the animation that should be executed
        fadeIn();
    }
}*/



var firstAnimation = function () {
    $('h1, .videoOverlay p').each(
        function () {
            $(this).delay(500).animate({
                opacity: .5,
                //height: '180',
               // width: '250'
            }, 7000);
        }
    );
};

firstAnimation();


$.fn.isOnScreen = function(){

    var win = $(window);

    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

if ($('.wrap').isOnScreen) {
	$('.wrap').each(
		function () {
            $(this).animate({
                opacity: 1,
                //height: '180',
               // width: '250'
            }, 2000);
        }
    );

	/*$("h1, .videoOverlay p").css({
    		"text-align": "center"
    	});
    $("h1, .videoOverlay p").each(

    	function(){
    		$(this).animate({
    			"padding-left" : "0px",
    			
    		}, 200);
    	}
	
    	
   );*/
};

var otherProjects = function() {
	var currentPage = $('h1').text();
	//console.log(currentPage);
	var projectsList = $(".other_projects").load('index.html h1');
	console.log(projectsList);
}

otherProjects();



