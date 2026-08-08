$(document).ready(function() {
    
    // 1. Immediately fade in the first 5 images right away
    $('.load:lt(5)').animate({'opacity': '1'}, 900);

    // 2. Create the scroll function for the REMAINING images
    function checkVisibility() {
        // Use :gt(4) to only check elements with an index greater than 4 (the 6th image onwards)
        $('.load:gt(4)').each(function() {
            var top_of_object = $(this).offset().top;
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if (bottom_of_window > top_of_object) {
                $(this).animate({'opacity': '1'}, 900);
            }
        });
    }

    // 3. Run the check on load (in case images 6+ are also visible on a large screen)
    checkVisibility();

    // 4. Run the check on scroll
    $(window).scroll(function() {
        checkVisibility();
    });
    
});