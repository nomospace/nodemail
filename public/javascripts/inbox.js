$(function() {

  'use strict';

  var inboxTpl = $('#inbox_tpl').html();

  function _getInbox() {
    $.getJSON('/ajax/mail/inbox').done(function(result) {
      console.log(result);
      var tpl = Handlebars.compile(inboxTpl),
        context = result.data;

      Handlebars.registerHelper('dateFormat', function(date) {
        return moment(date).format('LL');
      });
      // Handlebars.registerHelper('fromFormat', function() {
      //   return this.from[0].slice(this.from[0].indexOf('<') + 1, this.from[0].indexOf('>'));
      // });


      $('#J_content').html(tpl(context));
    });
  }

  function _getBoxes() {
    $.getJSON('/ajax/mail/boxes').done(function(result) {
      console.log(result);
    });
  }

  _getInbox();
  // _getBoxes();
});