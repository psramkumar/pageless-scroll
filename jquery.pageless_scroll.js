/**
 * JQuery PagelessScroll Plugin  v0.9
 *  
 *   A common technique to load pages with new items. A various callbacks will give you the choices of what you do with the data.
 *
 * MIT licensed 
 *
 * Usage:
 *
 *   $('#comments').pagelessScroll({
 *     url: "/comments.json",
 *     success: function(data) {
 *        $("#comments").append(data);
 *     }
 *   });
 *
 *
 * Configuration options:
 *
 *  loadingHtml:       Default, "<div class='loading'>Loading</div>", Html indicating that ajax loging is in progress
 *                     This will be shown when loading start and disappear when it is done.
 *  bottomDistance:    The distance from bottom of the element to fire next page loading, default 50px
 *  requireFirstFetch: Defualt, false. Indicating to fetch data when initialzed
 *  url:               Url to retrieve data without parameters, i.e. http://my.site.com/posts
 *  params:            A function to generate ajax call data hash. The sequence number is passed as parameter 
 *                     Default, function(sequence) { return {page: sequence}; },
 *  cancelFetch:       Callback function when ajax call is successful. data, status, as xhr are passed as parameters
 *  beforeFetch:       Callback function before ajax call is executed. xhr is passed as parameters
 *  complete:          Callback function when ajax call is finished regardless of error or success. xhr and status are passed as parameters
 *  error:             Callback function when ajax call is errored out. xhr and status are passed as parameters
 *  success:           Callback function when ajax call is successful. data, status, and xhr are passed as parameters
 */

( function($){

  $.fn.pagelessScroll = function(options) {
    var defaults = {
      loadingHtml: "<div class='loading'>Loading</div>",
      bottomDistance: 50,
      requireFirstFetch: false,
      url:         null,
      params:      function(sequence) { return {page: sequence}; },
      cancelFetch: function() {},
      beforeFetch: function() {},
      complete:    function() {},
      error:       function() {},
      success:     function() {}
    };

    var LOADING = 0, SUCCESS = 1, ERROR = 2, COMPLETE = 3, ALL_DONE=4;
    var options = $.extend({}, defaults, options);
    var loadData = function(sequence) {
      var self = this; // a JQuery element
      $.ajax({
        url: options.url,
        data: options.params.apply(self, [sequence]),
        beforeSend: function(xhr) {      
          self.ajaxStatus = LOADING;
          $(self).append(options.loadingHtml);
          options.beforeFetch.apply(self, [xhr]);
        }
      }).done( function(data, status, xhr) {
        self.ajaxStatus = (Array.isArray(data) && data.length == 0) ? ALL_DONE : SUCCESS;
        options.success.apply(self, [data, status, xhr]);
      }).fail( function(xhr, status) {
        self.ajaxStatus = ERROR;
        options.error.apply(this, [xhr, status]);
      }).always( function(xhr, status) {
        options.complete.apply(self, [xhr, status]);
        $(".loading",self).remove();
      });
    }

    if (options.requireFirstFetch) { // if we need to load the first page without scrolling
      loadData.apply(this, [1]);
    } else if (this == document) {
      throw "no support for document level for simplicity, use an element. i.e. div";
    }
      
    $(this).data("sequence", 2); //when scrolled, will fetch the second page
    $(this).unbind("scroll").bind("scroll", function() {
      var closeToBottom = ( this.scrollHeight - $(this).height() < $(this).scrollTop() + options.bottomDistance );
      var cancel = options.cancelFetch.apply(this);

      if ([LOADING, ALL_DONE, ERROR].indexOf(this.ajaxStatus) >= 0 || cancel == true) {
      } else if ( closeToBottom ) {
        loadData.apply(this, [$(this).data("sequence")]);
        $(this).data("sequence", $(this).data("sequence")+1);
      }
    });
  };
})(jQuery);
