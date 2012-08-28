$(function() {
  
  'use strict';

  var inboxTpl = $('#inbox_tpl').html();

  function _getInbox() {
    $.getJSON('/ajax/mail/inbox').done(function(result) {
      console.log(result);
      var tpl = Handlebars.compile(inboxTpl),
        context = result.data;
      // Handlebars.registerHelper('username', function() {
      //   return unio.cfg.username;
      // });
      
      $('#J_content').html(tpl(context));
    });
  }

  _getInbox();

});