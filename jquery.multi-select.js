(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([
            'jquery'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(
            require('jquery')
        );
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    "use strict";

    var MultiSelectObject = function (element, options) {
        this.$container = $(element);
        this.options = $.extend(true, {}, $.fn.multiSelect.defaults, options);
        this._build();
    };

    MultiSelectObject.prototype = {
        _build: function() {
            var self = this;
            
            this.$container.on('change.multi-select', 'select.' + this.options.selectClass, function() {
                var select = $(this);
                var v = select.val();
                var si = $('option:eq(0)', select);
                var option, template, newLI;

                if (v) {
                    option = $('option[value="' + v + '"]', select).prop('disabled', true);
                    
                    template = self.options.template;
                    
                    newLI = $(template.replace('{{field}}', select.attr('name')).replace('{{value}}', v).replace('{{text}}', option.text()));
                    
                    if (select.data('hiddenClass')) {
                        newLI.find('input').addClass(select.data('hiddenClass'));
                    }

                    select.next('.' + self.options.listClass).append(newLI);
                    
                    select[0].selectedIndex = 0;
                    
                    select.trigger('multi-select-change');
                } else {
                    if (select[0].selectedIndex === 1) {
                        self.clearSelect(select, true);
                    }
                }
                select.trigger('blur');
            });

            this.$container.on('click.multi-select', '.' + this.options.removeClass, function() {
                var li = $(this).parents('li:first');
                var ul = li.parent();
                var v = li.find('input').val();
                var select = ul.prev('select.' + self.options.selectClass);
                var si = $('option:eq(0)', select);

                li.remove();    
                
                $('option[value="' + v + '"]', select).prop('disabled', false);
                
                if (ul.children().length > 1) {
                    select[0].selectedIndex = 0;
                } else {
                    select[0].selectedIndex = 1;
                }

                select.trigger('multi-select-change').trigger('change');
            });
        },

        /**
         * Clear a single select
         * @param  {jQuery Object} $select
         * @param  {boolean} silent
         * @public
         */
        clearSelect: function($select, silent) {
            var si;

            if (!$select.length) {
                return;
            }

            $select.find('option[disabled]').prop('disabled', false);
            
            si = $('option:eq(0)', $select);

            $select[0].selectedIndex = 1;
            
            $select.next('.' + this.options.listClass).children().filter(':not([hidden]').remove();
            
            if (!silent) {
                $select.trigger('change');
            }

            $select.trigger('multi-select-change');
        },

        /**
         * Clear all selects in the $container
         * @param  {boolean} silent
         * @public
         */
        clearAll: function(silent) {
            var self = this;
            var $allSelects = $('select.' + this.options.selectClass, this.$container).each(function() {
                var $select = $(this);
                var si = $('option:eq(0)', $select);

                $select.find('option[disabled]').prop('disabled', false);
                
                $select[0].selectedIndex = 1;
                
                $select.next('.' + self.options.listClass).children().filter(':not([hidden])').remove();
                
                $select.trigger('multi-select-change');
            });

            if (!silent) {
                $allSelects.filter(':first').trigger('change');
            }
        },

        widget: function() {
            return this;
        },

        option: function( key, value ) {
            var options = key;
            if (arguments.length === 0) {
                // don't return a reference to the internal hash
                return $.extend( {}, this.options );
            }

            if  (typeof key === "string" ) {
                if ( value === undefined ) {
                    return this.options[ key ];
                }
                options = {};
                options[ key ] = value;
            }
            this._setOptions( options );
            return this;
        },

        _setOptions: function( options ) {
            var self = this;
            $.each( options, function( key, value ) {
                self._setOption( key, value );
            });
            return this;
        },

        _setOption: function( key, value ) {
            this.options[ key ] = value;
            return this;
        }       
    };

    $.fn.multiSelect = function (option) {
        var isMethodCall = typeof option === "string",
            args = Array.prototype.slice.call( arguments, 1 ),
            returnValue = this;

        // prevent calls to internal methods
        if ( isMethodCall && option.charAt( 0 ) === "_" ) {
            return returnValue;
        }

        // call internal method
        if ( isMethodCall ) {
            this.each(function() {
                var instance = $(this).data('multiSelect'),
                    methodValue = instance && $.isFunction( instance[option] ) ? instance[ option ].apply( instance, args ) : instance;
                if (instance && methodValue && methodValue !== undefined ) {
                    returnValue = methodValue;
                    return false;
                }
                return false;
            });
        }

        // instantiate plugin
        else {
            this.each(function () {
                var $this = $(this),
                    data = $this.data('multiSelect'),
                    options = typeof option === 'object' && option;
                if (!data) {
                    $this.data('multiSelect', (data = new MultiSelectObject(this, options)));
                }
            });
        }

        return returnValue;
    };

    $.fn.multiSelect.defaults = {
        selectClass: 'multi-select',
        listClass: 'multi-select-list',
        template: '<li><span class="multi-select-remove" title="Remove">&times;</span><input type="hidden" name="{{field}}" value="{{value}}">{{text}}</li>',
        removeClass: 'multi-select-remove'
    };

    $.fn.multiSelect.Constructor = MultiSelectObject;
}));