/*
 *   @package    BoxLeaf
 *   @author     Daniel Coull <ttechitsolutions@gmail.com>
 *   @copyright  01/01/2020, 16:45.$year Daniel Coull
 *   @version    CVS: $Id:$
 *  @since      File available since Release 1.0.0
 *
 */

define(['uiComponent', 'jquery', 'infinatescroll', "mage/template", 'imagesloaded', 'jquery-bridget', 'masonry', 'isotope', 'packery'],
    function (Component, $, InfiniteScroll, mageTemplate, imagesloaded, bridget, Masonry, Isotope, Packery) {
        'use strict';
        return Component.extend({
            defaults: {
                settings: {
                    enable: true,
                    $element: $('.product-items'),
                    analytics: true,
                    status: true,
                    text: 'No more products',
                    display_type: "1"
                },
                config: {
                    path: '.pages-item-next .action.next',
                    append: '.item.product.product-item',
                    checkLastPage: '.pages-item-next .action.next',
                    scrollThreshold: 100,
                    loadOnScroll: true,
                    history: 'push',
                    hideNav: '.pages',
                    status: '.page-load-status',
                    debug: false
                }
            },
            initialize: function (config, element) {
                let self = this;

                this._super();

                $.extend(true, self.config, config.config);
                $.extend(true, self.settings, config.settings);

                self.settings.$element = $(element)
                self.settings.$element.addClass('infinate');

                console.log(self.config)

                InfiniteScroll.imagesLoaded = imagesloaded;
                $.bridget('infiniteScroll', InfiniteScroll, $);
                self.settings.$element.infiniteScroll.imagesLoaded = imagesloaded

                if($(self.config.path).length > 0 && self.settings.enable) {

                    self.initStatusBlock();
                    let type = self.initDisplayType();
                    if (type !== '') {
                        self.config.outlayer = type
                    }
                    self.initScroll();
                    self.initExtras();

                }
            },

            initMasonry:  function () {
                let self = this;
                $.bridget('masonry', Masonry, $);
                self.settings.$element.masonry({
                    itemSelector: 'none', // select none at first
                    columnWidth: self.config.append,
                    gutter:10,
                    percentPosition: true
                });
                let msnry =  self.settings.$element.data('masonry');

                self.settings.$element.imagesLoaded( function() {
                    self.settings.$element.css({'opacity':'1'});
                    self.settings.$element.masonry( 'option', { itemSelector: self.config.append });
                    var $items = self.settings.$element.find(self.config.append);
                    self.settings.$element.masonry( 'appended', $items );
                });

                return msnry
            },
            initIsotope: function () {
                let self = this;
                $.bridget('isotope', Isotope, $);
                self.settings.$element.isotope({
                    itemSelector: 'none', // select none at first
                    layoutMode: 'fitRows',
                });

                let isotope =  self.settings.$element.data('isotope');
                self.settings.$element.imagesLoaded( function() {
                    self.settings.$element.css({'opacity':'1'});
                    self.settings.$element.isotope( 'option', { itemSelector: self.config.append });
                    var $items = self.settings.$element.find(self.config.append);
                    self.settings.$element.isotope( 'appended', $items );
                });
                return isotope;

            },
            initPackery: function () {
                let self = this;
                $.bridget('packery', Packery, $);
                self.settings.$element.packery({
                    itemSelector: 'none', // select none at first
                });
                let packery =  self.settings.$element.data('packery');
                self.settings.$element.imagesLoaded( function() {
                    self.settings.$element.css({'opacity':'1'});
                    self.settings.$element.packery( 'option', { itemSelector: self.config.append });
                    var $items = self.settings.$element.find(self.config.append);
                    self.settings.$element.packery( 'appended', $items );
                });
                return packery;
            },
            initDisplayType: function () {
                let self = this;
                let type = '';
                switch(self.settings.display_type) {
                    case "2":
                        type = self.initMasonry()
                        break;
                    case "3":
                        type = self.initIsotope()
                        break;
                    case "4":
                        type = self.initPackery()
                        break;
                    default:
                        type =''
                }
                return type;
            },
            initStatusBlock: function () {
                let self = this;
                if (self.settings.status) {
                    let template = mageTemplate('#scroll-status');
                    let newField = template({
                        data: {
                            text: self.settings.text
                        }
                    });

                    $(newField).insertAfter('.products-grid .product-items')
                }
            },
            initScroll: function () {
                let self = this;

                self.settings.$element.infiniteScroll(self.config)

                self.settings.$element.on( 'append.infiniteScroll', function( event, response, path, items ) {
                            $('body').trigger('contentUpdated');
                    });
            },
            initExtras: function () {
                let self = this;

                if (self.settings.analytics) {

                    let ga = window[window['GoogleAnalyticsObject'] || 'ga'];
                    if (typeof ga == 'function') {
                        let link = document.createElement('a');
                        this.settings.$element.on('append.infiniteScroll', function (event, response, path) {
                            link.href = path;
                            ga('set', 'page', link.pathname);
                            ga('send', 'pageview');
                        });
                    }
                }
            }
        });
    });