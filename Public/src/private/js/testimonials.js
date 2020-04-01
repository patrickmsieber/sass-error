import 'slick-carousel';
import $ from 'jquery';

var $testimonial_carousell = $('.testimonials-container .carousel');

$testimonial_carousell.on('init', function(event) {
    var $target = $(event.target);
    $target.css('visibility', 'visible');
});

$testimonial_carousell.slick({
    dots: true,
    speed: 1200,
    autoplay: false,
    autoplaySpeed: 7000,
    pauseOnHover: false,
    arrow: true
});




// 
// 
// import Swiper from 'swiper';
// 
// var swiperContainer = new Swiper('.swiper-container', {
//     speed: 1000,
//     autoplay: {
//         delay: 5000,
//         disableOnInteraction: false
//     },
//     spaceBetween: 0,
//     effect: 'fade',
//     loop: true,
//     shortSwipes: false,
//     longSwipes: false,
//     simulateTouch: false,
//     dots: true,
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true
//     }
// });