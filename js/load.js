$(document).ready(function() {
    
    // 1. Immediately fade in the first 10 images right away
    $('.load:lt(10)').animate({'opacity': '1'}, 900);

    // 2. Create the scroll function for the remaining images
    function checkVisibility() {
        // Only check elements with an index greater than 9 (the 11th image onwards)
        $('.load:gt(9)').each(function() {
            var top_of_object = $(this).offset().top;
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if (bottom_of_window > top_of_object) {
                $(this).animate({'opacity': '1'}, 900);
            }
        });
    }

    // 3. Run the check on load in case images 11+ are also visible
    checkVisibility();

    // 4. Run the check on scroll
    $(window).scroll(function() {
        checkVisibility();
    });
    
});