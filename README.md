jquery.alert
============

jQuery plugin to display one or multiple stacked alert messages at the bottom of the screen. (growl style)
<pre>
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
</pre>