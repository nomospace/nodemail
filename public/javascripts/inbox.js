$(function() {
  'use strict';

  var inboxTpl = $('#inbox_tpl').html();
  var sideItemTpl = $('#side_item_tpl').html();

  function _getInbox() {
    $.getJSON('/ajax/mail/' + TAG + (BOX && ('/' + BOX) || '')).done(function(result) {
//      console.log(result);

      var context = result.data;

      Handlebars.registerHelper('dateFormat', function(date) {
        return moment(date).format('LL');
      });
      // Handlebars.registerHelper('fromFormat', function() {
      //   return this.from[0].slice(this.from[0].indexOf('<') + 1, this.from[0].indexOf('>'));
      // });

      $('#J_content').html(Handlebars.compile(inboxTpl)(context));
      $('#J_side_list').html(Handlebars.compile(sideItemTpl)(context));
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
