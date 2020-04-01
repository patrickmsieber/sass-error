const ScrollSpy = function(options) {
    var $window = $(window);
    var windowHeight = $window.height(),
        documentHeight = $(document).height(),
        $items = options.items;
    var bottom = windowHeight;
    var $value;
    var full_at = options.full_at || 0.5;
    var breakAt = 0.15;                                             // in percentage
    var minimum = options.minimum ? options.minimum >= 0 : 0.1;     // in percentage
    var scroll_fade = options.scroll_fade;
    var fade_in = options.fade_in || function($value, in_page) {
        return in_page > $value.height() / 5;
    };
    var set_delay = options.set_delay;
    var delay_increase = options.delay_increase || 0;
    var responsive = options.responsive;


    if(set_delay) {
        set_delay($items);
    }

    if(scroll_fade) {
        $items.css('opacity', minimum);
    }

    function fadeItems() {
        bottom = $window.scrollTop() + windowHeight;
        var hits = [];

        $items.each(function(key, value) {
            var $value = $(value);
            var in_page = bottom - $value.offset().top;
            var in_page_per = in_page / windowHeight;


            if(!$value.hasClass('fade-in') && fade_in($value, in_page)) {
                hits.push($value);
            }
            if(scroll_fade) {
                var opacity = in_page_per  / full_at + minimum;
                $value.css('opacity', opacity);
            }
        });

        for (var key in hits) {
            var $value = hits[key];
            var delay = ($value.data('delay') || 1) + key * delay_increase;
            $value.css('transition-delay', delay + 'ms').css('-webkit-transition-delay', delay + 'ms');
            $value.addClass('fade-in');
            delete hits[key];
        }
    }

    fadeItems();

    $(window).resize(function() {
        windowHeight = $window.height();
        documentHeight = $(document).height();
        fadeItems();
    });

    $(window).scroll(fadeItems);
    $(window).on('redraw', fadeItems);
};

export default ScrollSpy;
