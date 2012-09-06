$(function() {

  $('iframe').iframeAutoHeight();

  var editor = 'J_editor';
  if (window.tinyMCE) {
    tinyMCE.init({
      // General options
      mode: "textareas",
      // theme: "simple",
      auto_focus: editor,
      plugins: "fullpage",
      width: "100%",
      oninit: function() {
        tinyMCE.get(editor).show();
      }
    });
  }

  // 发送
  var $send = $('#J_send'),
    $to = $('#J_to'),
    $from = $('#J_from'),
    $subject = $('#J_subject');
  // $text = $('#J_text'),
  // $html = $('#J_html');
  $send.click(function() {
    var html = tinyMCE.get(editor).getContent();
    $.post('/ajax/mail/send', {
      'to': $to.val() || $to.data('value'),
      'from': $from.html() || $from.data('value'),
      'subject': $subject.val(),
      'text': $(html).text(),
      'html': html
    }, function(data) {
      alert(data.message || '邮件发送成功！');
    });
  });

});