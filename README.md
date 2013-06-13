pageless-scroll
===============

JQuery PagelessScroll Plugin  v0.9
 
A common technique to load pages with new items. A various callbacks will give you the choices of what you do with the data

MIT licensed 

Usage:

  $('#comments').pagelessScroll({
    url: "/comments.json",
    success: function(data) {
       $("#comments").append(data);
    }
  });


Configuration options:

 loadingHtml:     Default, "<div class='loading'>Loading</div>", Html indicating that ajax loging is in progress
                  This will be shown when loading start and disappear when it is done.
 bottomDistance:  The distance from bottom of the element to fire next page loading, default 50px
 initialSequence: Defualt 2, Starting number of page for ajax loading
 url:             Url to retrieve data without parameters, i.e. http://my.site.com/posts
 params:          A function to generate ajax call data hash. The sequence number is passed as parameter 
                  Default, function(sequence) { return {page: sequence}; },
 cancelSend:      Callback function when ajax call is successful. data, status, as xhr are passed as parameters
 beforeSend:      Callback function before ajax call is executed. xhr is passed as parameters
 complete:        Callback function when ajax call is finished regardless of error or success. xhr and status are passed as parameters
 error:           Callback function when ajax call is errored out. xhr and status are passed as parameters
 success:         Callback function when ajax call is successful. data, status, and xhr are passed as parameters

