/* 
  jQuery.alert (c) 2013, Ignacio Chavez. http://github.com/nashio
  
  Displays an alert message or multiple stacked messages at the bottom of the screen.
  
  Options:
  
  delay: time in milliseconds to appear
  timeout: time in milliseconds before it closes
  stay: bolean to keep the alert forever
  message: message to insert in the alert, accepts objects
  
  Example:
  $.alert({ 
    message: "Your message goes here, hello :D ", 
    stay : false,
    timeout: 3000,
    delay : 1000, 
    bg : "royalblue",
    txt : "yellow"
  });
*/



;(function($) {
  
  var popup = function() {
    var that = this;
      return function(message){
        return that.showPopup(message);
    };
  };

  popup.prototype = {
   
    // Options

    id: "alert-popup",
    timeout: 3000,
    $alerts: null,

    showPopup: function(args) {
           
      var message = args.message;
      var self = this;
      var bg_color = args.bg || "#000";
     
      
      // Force unformated message to object
      if (typeof args == "string")
        { return this.showPopup({ 'message': args }); }
      
      // If not formated corrently dump it
      if ((typeof args != "object") ||
          (args.message === undefined))
        { return; }
      

      // A parameter is object, now parse it and convert it to String
      if (Object.prototype.toString.call(message) === "[object Object]" || 
          Object.prototype.toString.call(message) === "[object Array]"){
       
        if(JSON.stringify){
          args.message = JSON.stringify(args.message, undefined, 4);
        }else{
          // if no JSON available manually parse object
          args.message = this.stringObject(args.message);
        }

      }
      
      // Create the container for alerts.
      
      if (!self.$alerts) {
        self.$alerts = $("<div id='" + self.id + "'><div class='alerts'></div></div>");
        $(document.body).append(self.$alerts);
      }

      // create the HTML.
      var item_html = this.createHtml(args);

      // Construct the item and start hidden
      var item = $(item_html); 
      
      // Apply color
      item.css({"background-color" : bg_color, "display" : "none"});
      
      if (args.classname) { item.addClass(args.classname); }

      item.find('.close').click(function() {
        self.killAlert(item);
      });

      // add the alert to the container
      
      var delay = args.delay || 50; 
      
      setTimeout(function(){
        var id = args.id ? (args.id) : null;
        item.attr('id', id);
        item.fadeIn("slow");
        self.$alerts.find('.alerts').prepend(item);

        // Set kill timer
        self.addTimer(item, args);        
      }, delay);

    },
    
    // Attach a timer to $item to give lifespan

    addTimer: function($item, args) {
      var self = this;

      // Remove timeout
      var timer = $item.data('alert-timer');
      if (timer) { window.clearTimeout(timer); }

      // Add timeout.
      if (args.stay !== true) {
        timer = window.setTimeout(function() {
          self.killAlert($item);
        }, args.timeout || self.timeout);
        $item.data('alert-timer', timer);
      }
    },

    // Remove all alerts 

    kill: function() {
      var self = this;
      self.$alerts.find('.alerts > *').each(function() {
        self.killAlert($(this));
      });
    },

    // Remove specific alert 

    killAlert: function($alert) {
      $alert = $($alert);
      $alert.slideUp(function() { $(this).remove(); });
    },
    
   // Construct the html. Override me if you like.
    
    createHtml: function(options) {
      if (options.message && options.title) {
        return "<div class='alert'><h3>"+options.title+"</h3><p>"+options.message+"</p><a href='#' class='close'></a></div>";
      } else {
        return "<div class='alert'><p>"+options.message+"</p><a href='#' class='close'>x</a></div>";
      }
    },

    
    // Convert Object to String, and recurse if no JSON is present
    
    stringObject: function(str){
      
      var spc = arguments[1] || 0;
      var o;
      ind_str = this.getIndent(spc);
      o = "{<br/>";
      for( var i in str ){
        if(Object.prototype.toString.call( str[i] ) === "[object Object]" || 
           Object.prototype.toString.call( str[i] ) === "[object Array]"){
          o += ind_str+i+":"+this.stringObject( str[i], spc + 1 )+"<br/>";
        } else {
          o += ind_str+i+":"+str[i]+"<br/>";
        }
      }    
      
      o += this.getIndent(spc)+"}";
      
      return o;
    },
    
    // Generate left indenting 
    
    getIndent: function(spc){
      var str = "";
      while(spc > 0){
        str += "&nbsp;&nbsp;";
        spc--;
      }
      return str;
    }
    
  };
  
  // Instantiate the alert popup and add it to jQuery
  $.alert = new popup();
  
  
})(jQuery);


