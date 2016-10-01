//var winHeight = ($(window).height()) - 300;
//$('.wrap').css({"marginTop": winHeight +"px"});


//scrolls to top of page on page reload on home page
if ( $('#home-page').length ) {
    window.onbeforeunload = function () {
        window.scrollTo(0,0);
    }
};


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

   


/*
var firstAnimation = function () {
    $('h1, .videoOverlay p').each(
        function () {
            $(this).animate({
                opacity: 1,
                //height: '180',
               // width: '250'
            }, 1000);
        }
    );
};

firstAnimation();
*/


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

//Gets links to projects from index.html and generates previous and next project links 
//gets other projects from index.html (front page)
var otherProjects = function() {
	var currentPage = $('h1').text();
    
    //get brings in index.html data
    $.get('index.html', function(data) {
        //turns data into jquery object 
        data = $(data);
        //gets the anchors from index.html
        var projectNames = data.find('.boxInner a').get();
        //gets all project names and index values
        $.each(projectNames, function(index, value) {
            var s = value.innerHTML;
            //remove everything before and after page titles
            var t = s.substring(0, s.indexOf('</div>'));
            //11 is length of "titleBox">
            var u = t.substring(t.indexOf('"titleBox">') + 11);
            //matches current page to project from index.html
            if (currentPage === u) {
                //console.log('fooound iiiit in' + index);
                var nextProject;
                var prevProject;
                var projectAmount = projectNames.length - 1;

                //if it's the last project, next project is set to first in the list
                if (projectAmount === index){
                    nextProject = projectNames[0];
                } else {
                    nextProject = projectNames[index + 1];
                }

                if (index === 0) {
                    //if it's the first project, previous project is set to the last project in the list 
                    prevProject = projectNames[projectAmount];
                    console.log(projectNames[projectAmount]);
                    console.log(projectAmount);

                } else {
                    prevProject = projectNames[index - 1];
                }

                $('.next_project').append(nextProject);
                $('.prev_project').append(prevProject);
                console.log(prevProject);
                //console.log(titles[nextProject]);
                //var prevProject = 

            }
           
        });
    });

$(window).on ('load', function() {
//parallax effect on home page -- background elements must be position:fixed
    $(window).scroll(function(e){
      parallax();
    });

    function parallax(){
      var scrolled = $(window).scrollTop();
      $('.variable_scroll_slower').css('top',-(scrolled*0.3)+'px');
      $('.variable_scroll_faster').css('top',-(scrolled*0.3)+'px');
    }
});

/*
var hideHeader = function() {
    var window = $(window);
    var pos = window.scrollTop();
    var up = false;
    var newscroll;
    window.scroll(function () {
        newscroll = window.scrollTop();
        if (newscroll > pos && !up) {
            $('.return_home').hide();
            up = !up;
        } else if(newscroll < mypos && up) {
            $('.return_home').hide();
            up = !up;
        }
        mypos = newscroll;
    });
};

hideHeader();
*/
var hideHeader = function (){
    // Hide Header on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 15;
    var navbarHeight = $('.return_home').outerHeight();
    

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    //console.log($('.reveal-overlay').css('display'))
    if ( $('.reveal-overlay').css('display') === 'block' ) {
            console.log("i can see it");
            $('.return_home').removeClass('nav-down').addClass('nav-up');
            
        }

    function hasScrolled() {
        var st = $(this).scrollTop();
        
        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        
        
        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('.return_home').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('.return_home').removeClass('nav-up').addClass('nav-down');
            }
        }
        
        lastScrollTop = st;
    }
}

hideHeader();



$( window ).on('load resize', function() {
  var videoHeight = $('video.variable_scroll_faster').height();
  $('.videoOverlay').height(videoHeight+2);

});

$( window ).on('load resize', function() {
  var videoHeight = $('video.variable_scroll_faster').height();
  $('.videoOverlay img').height(videoHeight+2);

});

$('video.variable_scroll_faster').animate({
    opacity: 1,
}, 1000, function() {
});

/*Mutation observer will listen for changes to 'reveal-overlay' class of modals.
When it detects a change, the '.return_home' menu bar will get hidden (with class 'nav-up').
*/
$(function() {
(function($) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    $.fn.attrchange = function(callback) {
        if (MutationObserver) {
            var options = {
                subtree: false,
                attributes: true
            };

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
                    callback.call(e.target, e.attributeName);
                });
            });

            return this.each(function() {
                observer.observe(this, options);
            });

        }
    }
})(jQuery);

//Now you need to append event listener
    $('.reveal-overlay').attrchange(function(attrName) {
        if( $('.reveal-overlay').is(':visible')){
            //console.log('change');
            $('.return_home').removeClass('nav-down').addClass('nav-up');
        }
    });
});

/*
$(document).ready(function () {
    $(window).on('load scroll', function () {
        var scrolled = $(this).scrollTop();
        $('video').css({
            'transform': 'translate3d(0, ' + -(scrolled * 0.02) + 'px, 0)', // parallax (20% scroll rate)
            
        });
        $('#hero-vid').css('transform', 'translate3d(0, ' + -(scrolled * 0.25) + 'px, 0)'); // parallax (25% scroll rate)
    });
    
    // video controls
    
});

*/

/*
$("video").multiBackground([{"type":"video","attachment":"fixed","url":{"mp4":"./assets/video.mp4","webm":"./assets/video.webm","ogg":"./assets/video.ogg"}}], false);
*/
/*
$.fn.moveIt = function(){
  var $window = $(window);
  var instances = [];
  
  $(this).each(function(){
    instances.push(new moveItItem($(this)));
  });
  
  window.onscroll = function(){
    var scrollTop = $window.scrollTop();
    instances.forEach(function(inst){
      inst.update(scrollTop);
    });
  }
}

var moveItItem = function(el){
  this.el = $(el);
  this.speed = parseInt(this.el.attr('data-scroll-speed'));
};

moveItItem.prototype.update = function(scrollTop){
  var pos = scrollTop / this.speed;
  this.el.css('transform', 'translateY(' + -pos + 'px)');
};

$(function(){
  $('[data-scroll-speed]').moveIt();
});
*/
    
    /*if ($("pageTitles:contains('currentPage')")) {
        console.log(pageTitles);
        console.log(currentPage);
        console.log (this);
    }*/
    //$('#other_projects').text($.inArray (currentPage, pageTitles));
    
}

otherProjects();



