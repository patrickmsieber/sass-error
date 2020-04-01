import $ from 'jquery';
// import request from 'superagent';
// import SoftPage from 'softpage';
import './parallax';
import './testimonials';
import './map.js';
import './fancybox.js';
import './jquery.validate.js';
import ScrollSpy from './scrollspy';
import 'bootstrap';

import { triggerClassByScroll } from './utils';
//
import Navigation from './navigation';
import ShopifyClient from 'shopify-buy';
// var Raven = require('raven-js') ;

// Raven.config('https://30e0b9e14c98430eb02e19f87e1c49de@sentry.io/118210').install()

$('.parallax-window .bg-image').parallax();

function show_message(message_type, message) {
    let app_message = document.querySelector('.app-message');
    app_message.classList.remove('alert-danger')
    app_message.classList.remove('alert-success')

    if (message_type == 'error') {
        app_message.classList.add('alert-danger')
    }
    else {
        app_message.classList.add('alert-success')
    }

    app_message.querySelector('.content').innerHTML = message;
    setTimeout(function() {
        app_message.style.visibility = 'visible';
        app_message.style.opacity = 1;
    }, 200);

    clearInterval(window.interval_id);
    window.interval_id = setTimeout(function() {
        app_message.style.opacity = 0;
        setTimeout(function() {
            app_message.style.visibility = 'hidden';
        }, 300);
    }, 3000)
}

new Navigation({target: document.querySelector('.navbar-container')});

if (typeof(Storage) !== "undefined") {
    let message = localStorage.getItem("message_to_push");
    let message_type = localStorage.getItem("message_type");
    if (message && message_type) {
        show_message(message_type, message);
        delete localStorage["message_type"]
        delete localStorage["message_to_push"]
    }
}


// init ajax form in softpage
const init_ajax_form = function(target) {
    target.modal.modalBox.querySelector('form').addEventListener('submit', (event)=> {
        event.preventDefault();

        request
            .post(event.currentTarget.getAttribute('action'))
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('X-CSRFToken', event.currentTarget.querySelector('[name=csrfmiddlewaretoken]').value)
            .type('form')
            .send($(event.currentTarget).serialize())
            .end((error, result) => {
                if(result.statusCode == 200) {
                    target.modal.destroy();
                    if (typeof(Storage) !== "undefined") {
                        localStorage.setItem("message_to_push", "Deine Änderungen wurden gespeichert.");
                        localStorage.setItem("message_type", "success");
                    }
                    window.location = '.';
                }
                else {
                    target.modal.setContent(result.body.html);
                    if(target.modal) {
                        let error_field = target.modal.modal.querySelector('.has-error');
                        if(error_field) {
                            target.modal.modal.scrollTop = error_field.offsetTop - 20;
                        }
                    }
                    init_ajax_form(target);
                }
            }
        );
    });
}


import Swiper from 'swiper';

var pagination = $('.gallery-plugin').data('pagination') == 'True' ? '.swiper-pagination': '';
var swiperContainer = new Swiper('.gallery-plugin .swiper-container', {
    speed: 1000,
    spaceBetween: 0,
    effect: 'fade',
    loop: true,
    // shortSwipes: false,
    // longSwipes: false,
    // simulateTouch: false,
    dots: true,
    navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
    },
    pagination: {
        el: pagination,
        clickable: true
    }
});


var pagination = $('.news-preview').data('pagination') == 'True' ? '.swiper-pagination': '';
var swiperContainer = new Swiper('.news-preview .swiper-container', {
    speed: 1000,
    slidesPerView: 4,
    spaceBetween: 30,
    effect: 'slide',
    loop: false,
    // shortSwipes: false,
    // longSwipes: false,
    // simulateTouch: false,
    dots: true,
    pagination: {
        el: pagination,
        clickable: true
    },
    breakpoints: {
        991: {
            slidesPerView: 2,
            spaceBetween: 30,
            dots: true,
            pagination: {
                el: pagination,
                clickable: true
            },
            navigation: {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
            },
        },
        768: {
            slidesPerView: 1,
            spaceBetween: 30,
            dots: true,
            pagination: {
                el: pagination,
                clickable: true
            },
            navigation: {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
            },
        }
    }
});


triggerClassByScroll({
    element: document.querySelector('.site-header'),
    scroll: 50,
    class_to_trigger: 'reduced',
    fix_position: false
});

var closeNav = ($navCollaps) => {
    $navCollaps.each((key, value) => {
        let $value = $(value);
        $value.parent().removeClass('active');
        let $nav = $($value.attr('data-target'));
        $nav.addClass('collapsed');
        setTimeout(() => {
            $nav.hide();
        }, 400);
    });
    localStorage.setItem('lastnav', $.now());
}

var tap = ("ontouchstart" in document.documentElement);
var $navCollaps = $('[data-nav-toggle*="nav-collapse"]');


var timer = [];

var setTimeoutConst;

$('body').on('mouseover touchstart', '[data-nav-toggle*="nav-collapse"]', function (e) {
    var flyout = $($(this).attr('data-target'));
    var thisover = this;
    
    setTimeoutConst = setTimeout(function () {
        if (e.type === 'touchstart') {
            var lastClicked = localStorage.getItem('lastnav'),
            currentClicked = $(thisover).attr('href');

            if (lastClicked !== currentClicked) {
                localStorage.setItem('lastnav', $(thisover).attr('href'));
                e.preventDefault();
            }
        }

        clearTimeout(timer[thisover.getAttribute('data-target')]);

        $('.collapse').not($(thisover).attr('data-target')).hide().addClass('collapsed');


        if (flyout.css('display') !== 'block') {
            $(thisover).removeClass('collapsed');
            $('.page-layout-medium .nav-item').not($(thisover).parents('.nav-item')).removeClass('active');
            $('.nav-item').not($(thisover).parents('.nav-item')).removeClass('active');
            $(thisover).parents('.nav-item').addClass('active');
            $(thisover).parents('.main-list').addClass('flyout--open');

            flyout.css({
                display: 'block'
            });

            setTimeout(function () {
                flyout.removeClass('collapsed')
            }, 50);
        }
    }, 200);

}).on('mouseleave', '.collapse', function () {
    var flyout = $(this);
    $('.flyout--open').removeClass('flyout--open');
    
    timer['#' + this.getAttribute('id')] = setTimeout(function () {
        flyout.addClass('collapsed');
        //$('.nav-item.active').removeClass('active');

        
        setTimeout(function () {
            flyout.css({
                display: 'none'
            });
            
            $('[data-target="#' + flyout.attr('id') + '"]').parents('.nav-item').removeClass('active');
        }, 250);
    }, 500);
}).on('mouseout', '[data-nav-toggle*="nav-collapse"]', function (e) {
    var flyout = $($(this).attr('data-target'));
    var thisover = this;

    clearTimeout(setTimeoutConst);
}).on('mouseout', '.collapse', function () {
    var strId = '' + $(this).attr('id') + '';
    var flyoutnav = $('[data-target*="' + strId + '"]');
    // $(flyoutnav).parents('.nav-item').removeClass('active');

});

$('body').on('mouseover', '.collapse', function () {
    clearTimeout(timer['#' + this.getAttribute('id')]);
});

$('body').on('click', '.hide-nav', function (e) {
    e.preventDefault();
    $(this).parents('.collapse').addClass('collapsed');
    $('.nav-item.active').removeClass('active');
    localStorage.setItem('lastnav', $.now());

    setTimeout(function () {
        $(this).parents('.collapse').css({
            display: 'none'
        });
        $('.flyout--open').removeClass('flyout--open');
    }, 250);
});

$('body').on('click', function(e) {
    // Hide simple language
    if (e.target.classList.contains('simpleLang--img')) {
        // nothing
    } else {
        $('.simpleLang--img').next('.tooltip').remove();
    }
});

if ($('#ke_search_sword').length > 0) {
    $('#ke_search_sword').focus();
}

/*
$navCollaps.on('mouseenter', function (e) {
    let $this = $(event.currentTarget);
    let $target = $($this.attr('href'));
    let $allOtherCollapse = $navCollaps.not($this);
    let $someNavOpen = $('.collapse').not('.collapsed').length;
    
    console.log('mousenter', e.target);
    console.log($allOtherCollapse);

    $this.parent().toggleClass('active');
    //closeNav($allOtherCollapse);
    
    $('.collapse').not($target).hide();
    $target.show().removeClass('collapsed');
    

    $('.hide-nav').click(function() {
        closeNav($navCollaps);
    });
});

$('.collapse').on('mouseleave', function () {
    closeNav($navCollaps);
     localStorage.setItem('lastnav', null);
});

$('.nav-item a').on('click', function () {
    var lastClicked = localStorage.getItem('lastnav', $(this).attr('href')),
        currentClicked = $(this).attr('href');

    if (lastClicked !== currentClicked) {
        localStorage.setItem('lastnav', $(this).attr('href'));
        return false
    }
});*/

/*var $navCollaps = $('[data-nav-toggle*="nav-collapse"]');
$navCollaps.click((event) => {
    let $this = $(event.currentTarget);
    let $target = $($this.attr('href'));
    let $allOtherCollapse = $navCollaps.not($this);
    let $someNavOpen = $('.collapse').not('.collapsed').length;
    $this.parent().toggleClass('active');

    closeNav($allOtherCollapse);

    $('.hide-nav').click(function() {
        closeNav($navCollaps);
    });

    if($someNavOpen && $target.hasClass('collapsed')) {
        setTimeout(() => {
            $target.removeClass('collapsed');
        }, 260);

        setTimeout(() => {
            $target.show();
        }, 250);
    }
    else if(!$target.hasClass('collapsed')) {
        $target.addClass('collapsed');
        setTimeout(() => {
            $target.hide();
        }, 10);
    }
    else {
        $target.show();
        setTimeout(() => {
            $target.removeClass('collapsed');
        }, 10);
    }
});

$navCollaps.hover((event) => {
    let $this = $(event.currentTarget);
    let $target = $($this.attr('href'));
    let $allOtherCollapse = $navCollaps.not($this);
    let $someNavOpen = $('.collapse').not('.collapsed').length;
    $this.parent().toggleClass('active');

    closeNav($allOtherCollapse);

    if($someNavOpen && $target.hasClass('collapsed')) {
        setTimeout(() => {
            $target.removeClass('collapsed');
        }, 260);

        setTimeout(() => {
            $target.show();
        }, 250);
    }
    else if(!$target.hasClass('collapsed')) {
        $target.addClass('collapsed');
        setTimeout(() => {
            $target.hide();
        }, 10);
    }
    else {
        $target.show();
        setTimeout(() => {
            $target.removeClass('collapsed');
        }, 10);
    }
});*/

$(window).click((event)=> {
    if(!$.contains($('.main-list')[0], event.target) && !$.contains($('.collapse-wrapper')[0], event.target)) {
        closeNav($navCollaps);
    }
});



$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass('show');
  $subMenu.parent().toggleClass('show');


  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
    $('.dropdown-submenu .show').removeClass("show");
  });

  return false;
});

$('.dropdown-item.active').parents('.dropdown-menu, .dropdown-submenu').addClass('show');

var init_scrollspy = function($target) {
    ScrollSpy({
        items: $target,
        delay_increase: 250,
        scroll_fade: false,
        full_at: 1,
        minimum: 0,
        fade_in: function($value, in_page) {
            return in_page > 50;
        }
    });
}

init_scrollspy($('.reveal-element'));

var initRandomSessionImage = function() {
    var $imageContainer = $('#images-to-display');
    var $images = $imageContainer.children();

    // get image id from sessions storage if possible
    var sessionImageId = window.sessionStorage.getItem('img-id');
    var $targetImage = $imageContainer.children(`[data-img-id="${sessionImageId}"]`);

    if(!$targetImage.length) {
        // choose a random index
        var randomIndex = Math.floor(Math.random() * $images.length);
        $targetImage = $($images[randomIndex]);

        // save to session storage
        window.sessionStorage.setItem('img-id', $targetImage.data('img-id'));
    }

    // remove all other images
    $imageContainer.children().not($targetImage).remove();

    // show container
    $imageContainer.show();
}

initRandomSessionImage();


$('[data-fancybox^="gallery"]').not('[data-fancydark^="sliderDark"]').fancybox({
    loop: true,
    buttons: [
        'close'
    ],
    baseClass: '',
});

$('[data-fancybox^="gallery"][data-fancydark^="sliderDark"]').not('').fancybox({
    loop: true,
    buttons: [
        'close'
    ],
    baseClass: 'sliderDark',
});

$('.js-slickSlider').each(function () {
    var carousel = $(this),
        wrapper = carousel.parent('.sliderContainer'),
        counter = parseInt(carousel.attr('data-counter'), 10) !== 0 ? true : false,
        dots = parseInt(carousel.attr('data-counter'), 10) !== 0 ? false : true,
        slideCount = $('.slider__slide', carousel).length,
        itemsDesktop = parseInt(carousel.attr('data-itemsDesktop'), 10),
        newsDetail = parseInt(carousel.attr('data-newsDetail'), 10) !== 1 ? false : true;

    if (!dots) {
        if (itemsDesktop > 1) {
            $('.slider__counter', wrapper).addClass('slider__counter--hideDesktop');
            $('.slider__dots', wrapper).addClass('slider__dots--showDesktop');
        }
    } 

    if (newsDetail) {
        if (counter) {
            $('.slider__dots', wrapper).addClass('slider__dots--hide');
        }
    }

    carousel.slick({
        arrows: true,
        infinite: false,
        appendArrows: $('.slider__navigation', wrapper),
        dots: true,
        appendDots: $('.slider__dots', wrapper),
        slidesToShow: itemsDesktop,
        slidesToScroll: itemsDesktop,
        responsive: [{
            breakpoint: 1201,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    if (counter) {
        var counterContainer = $('.slider__counter', wrapper);

        counterContainer.html('<span class="js-current">1</span> / <span class="js-all">' + slideCount + '</span>');

        carousel.on('afterChange', function (event, slick) {
            //console.log(currentSlide);
            $('.js-current').text(parseInt(slick.currentSlide, 10) + 1);
        });
    }
});

$('.js-slickSlider--header').each(function () {
    var carousel = $(this);

    carousel.slick({
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 600,
        fade: true,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [{
            breakpoint: 1201,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });
});

$('.js-simplelang').each(function () {
    var container = $(this);
    $('h1', container).eq(0).addClass('simpleLang--header');
    $('.simpleLang--img').appendTo($('.simpleLang--header'));
});

/**
 * store the value of and then remove the title attributes from the
 * abbreviations (thus removing the default tooltip functionality of
 * the abbreviations)
 */
$('.simpleLang--img').each(function(){		
    $(this).data('title',$(this).attr('title'));
    $(this).removeAttr('title');
});

 /**
 * when abbreviations are mouseover-ed show a tooltip with the data from the title attribute
 */	
$('.simpleLang--img').mouseover(function () {		
    
    // first remove all existing abbreviation tooltips
    $('.simpleLang--img').next('.tooltip').remove();
    
    // create the tooltip
    $(this).after('<span class="tooltip">' + $(this).data('title') + '</span>');
    
    // position the tooltip 4 pixels above and 4 pixels to the left of the abbreviation
    var posLeft = $(this).position().left - 175;
    var posTop = $(this).position().top - 4;

    var positionTooltip = {
        left : posLeft,
        top : posTop,
        opacity : '1'
      };
    $(this).next().css(positionTooltip);
});
/**
 * mouseenter
 */
$('.simpleLang--img').mouseenter(function () {
   // $(this).mouseover();
});

/**
 * when abbreviations are clicked trigger their mouseover event then fade the tooltip
 * (this is friendly to touch interfaces)
 */
$('.simpleLang--img').click(function () {
    
    var clicks = $(this).data('clicks');
    if (clicks) {
        $(this).next('.tooltip').css('opacity',1);
    } else {
        $(this).next('.tooltip').css('opacity',0);
    }
    $(this).data("clicks", !clicks);

    
    // after a slight 2 second fade, fade out the tooltip for 1 second
    /*
    $(this).next().animate({opacity: 0.9},{duration: 2000, complete: function(){
        $(this).fadeOut(8000);
    }});
    */
});


/**
 * Remove the tooltip on abbreviation mouseout
*/
$('.simpleLang--img').mouseout(function () {
    $(this).next('.tooltip').remove();
});


const client = ShopifyClient.buildClient({
  domain: 'geschenkreich.myshopify.com',
  storefrontAccessToken: 'bc39e0b5ce58922a407c5e58c8921e49'
});

$('a[href$=".pdf"]').on('click', function () {
    var label = $(this).attr('href').substr($(this).attr('href').lastIndexOf('/') + 1);
    
    dataLayer.push({
    'event': 'customEvent',
    'EventCategory': 'PDF Öffnung',
    'EventAction': label,
    'EventLabel': 'interaction'
    });
});

/*
// Fetch all products in your shop
client.product.fetchAll().then((products) => {
  // Do something with the products
  // console.log(products);
});

// Fetch a single product by ID
const productId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzU2MjExNDU2MDA1OQ==';

client.product.fetch(productId).then((product) => {
  // Do something with the product
  // console.log(product);
});

// Fetch all collections, including their products
client.collection.fetchAllWithProducts().then((collections) => {
  // Do something with the collections
  // console.log(collections);
  // console.log(collections[0].products);

  for(let i = 0, length1 = collections.length; i < length1; i++){
      if (collections[i].title === 'Spenden') {
          // console.log(collections[i].products);
      }
  }
});

// Fetch a single collection by ID, including its products
// const collectionId = '68785438779';
/*
client.collection.fetchWithProducts(collectionSpenden).then((collection) => {
  // Do something with the collection
  // console.log(collection);
  // console.log(collection.products);
});* /

// Create an empty checkout
client.checkout.create().then((checkout) => {
  // Do something with the checkout
  // console.log(checkout);

  const checkoutId = checkout.id; // ID of an existing checkout

  // console.log(checkoutId);

  const lineItemsToAdd = [
    {variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg==', quantity: 1}
  ];

  // Add an item to the checkout
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    // Do something with the updated checkout
    console.log(checkout.lineItems); // Array with one additional line item
  });

  const input = {customAttributes: [{key: "MyKey", value: "MyValue"}]};

  client.checkout.updateAttributes(checkoutId, input).then((checkout) => {
    // Do something with the updated checkout
  });
});*/

/*
var shopifyInit = function() {
    /*fetchType: '’Collection’ or ‘Product’',
    fetchId: 'collection or product ID',* /

    console.log('shopify init');

    // var scriptURL = 'http://sdks.shopifycdn.com/js-buy-sdk/v1/latest/index.umd.min.js';
    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
          ShopifyBuyInit();
        } else {
          loadScript();
        }
    } else {
        loadScript();
    }

    function loadScript() {
        var script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = ShopifyBuyInit;
    }

    function ShopifyBuyInit() {
        var client = ShopifyBuy.buildClient({
          domain: 'geschenkreich.myshopify.com',
          storefrontAccessToken: 'bc39e0b5ce58922a407c5e58c8921e49',
          appId: '6',
        });

        ShopifyBuy.UI.onReady(client).then(function (ui) {
            ui.createComponent('collection', {
                id: [68785438779],
                node: document.getElementById('collection-component-02411786a78'),
                moneyFormat: 'CHF%20%7B%7Bamount%7D%7D',
                options: {
                    "product": {
                        "buttonDestination": "checkout",
                        "variantId": "all",
                        "contents": {
                            "imgWithCarousel": false,
                            "variantTitle": false,
                            "description": false,
                            "buttonWithQuantity": false,
                            "quantity": false
                        },
                        "text": {
                            "button": "spenden"
                        },
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "calc(25% - 20px)",
                                    "margin-left": "20px",
                                    "margin-bottom": "50px"
                                }
                            },
                            "button": {
                                "background-color": "#ffffff",
                                "color": "#96286e",
                                ":hover": {
                                    "background-color": "#e6e6e6",
                                    "color": "#96286e"
                                },
                                ":focus": {
                                    "background-color": "#e6e6e6"
                                }
                            }
                        }
                    },
                    "cart": {
                        "contents": {
                            "button": true
                        },
                        "styles": {
                            "button": {
                                "background-color": "#ffffff",
                                "color": "#96286e",
                                ":hover": {
                                    "background-color": "#e6e6e6",
                                    "color": "#96286e"
                                },
                                ":focus": {
                                    "background-color": "#e6e6e6"
                                }
                            },
                            "footer": {
                                "background-color": "#ffffff"
                            }
                        }
                    },
                    "modalProduct": {
                        "contents": {
                            "img": false,
                            "imgWithCarousel": true,
                            "variantTitle": false,
                            "buttonWithQuantity": true,
                            "button": false,
                            "quantity": false
                        },
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "100%",
                                    "margin-left": "0px",
                                    "margin-bottom": "0px"
                                }
                            },
                            "button": {
                                "background-color": "#ffffff",
                                "color": "#96286e",
                                ":hover": {
                                    "background-color": "#e6e6e6",
                                    "color": "#96286e"
                                },
                                ":focus": {
                                    "background-color": "#e6e6e6"
                                }
                            }
                        }
                    },
                    "toggle": {
                        "styles": {
                            "toggle": {
                                "background-color": "#ffffff",
                                ":hover": {
                                    "background-color": "#e6e6e6"
                                },
                                ":focus": {
                                    "background-color": "#e6e6e6"
                                }
                            },
                            "count": {
                                "color": "#96286e",
                                ":hover": {
                                    "color": "#96286e"
                                }
                            },
                            "iconPath": {
                                "fill": "#96286e"
                            }
                        }
                    },
                    "productSet": {
                        "styles": {
                            "products": {
                                "@media (min-width: 601px)": {
                                    "margin-left": "-20px"
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}

shopifyInit();*/




$.validator.messages.required = 'Dieses Feld ist ein Pflichtfeld.';
$.validator.messages.email = 'Geben Sie bitte eine gültige E-Mail Adresse ein.';

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

var timeNow = new Date();
timeNow.setHours(0,0,0,0);
const timeNowDate = formatDate(timeNow);

$('.js-adventskalender').each(function () {
    var container = $(this);

    $('.newsItem--advent').each(function () {
        var newsItem = $(this),
            itemDate = new Date($(newsItem).attr('data-date'));            

        itemDate.setHours(0,0,0,0);

        var itemDateDate = formatDate(itemDate);

        if (itemDate < timeNow) {
            $(newsItem).addClass('newsItem--advent--open');
        }

        if (itemDateDate == timeNowDate) {
            $(newsItem).addClass('newsItem--advent--today');
            $(newsItem).attr('id', 'timeNowDate');
        }

    });


    $(container).on('click', '.newsItem--advent', function () {
        if (!$(this).hasClass('newsItem--advent--open')) {
            $(this).removeClass('newsItem--advent--today');
            $(this).addClass('newsItem--advent--open');
        }
    });

});

$(window).on('load', function () {
    var todaysCalender = $('#timeNowDate').offset();

    if (todaysCalender) {
        $('html,body').animate({
            scrollTop: todaysCalender.top - $('.navbar-container').outerHeight()
        }, 300);
    }

});

$('.js-instantValidation--form').each(function () {
    var form = this;
    
    $(this).validate({
        errorClass: 'has-error',
        validClass: 'has--success', //different to prevent bootstrap styles
        ignore: '.js-noValidate, :hidden, .fieldset--hidden *',
        focusInvalid: false,
        rules: {
            'EMAIL': {
                email: true
            }
        },
        
        invalidHandler: function (formElement, validator) {
            if (!validator.numberOfInvalids()) {
                return;
            }
            
            $('html, body').animate({
                scrollTop: $(form).offset().top - 50
            }, 1000);
        },
        
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element).parent().addClass(errorClass).removeClass(validClass);
        },

        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).parent().removeClass(errorClass).addClass(validClass);
        },

        errorPlacement: function (error, element) {
            var fieldset = $(element).parents('fieldset');
            fieldset.prepend(error);
            if ($(element).parents('.input-group').length > 0) {
                error.insertAfter($(element).parents('.input-group'));
            } else {
                error.appendTo($(element).parent());
            }
        },

        submitHandler: function (form) {
            $('input[type="submit"]', this).attr('disabled', 'disabled');
            $('button[type="submit"]', this).attr('disabled', 'disabled');
            form.submit();
            form.reset();
        }
    });
});

