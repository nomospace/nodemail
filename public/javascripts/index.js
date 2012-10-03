$(function() {
  $.get('/ajax/mail/index').done(function(result) {
    $('#J_content').html(result);
  });
});
