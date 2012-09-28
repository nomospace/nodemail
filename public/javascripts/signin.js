$(function() {
  'use strict';
  var $form = $('#signin_form');
  $form.validate({
    rules: {
      name: {
        required: true,
        email: true
      },
      pass: {
        required: true
      }
    }
  });
});
