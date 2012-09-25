$(function() {

  $('iframe').iframeAutoHeight();
  $('#J_toolbar').stickyPanel({topPadding: 50, savePanelSpace: true});

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
  var $composeBody = $('#J_compose_body'),
    $send = $('#J_send'),
    $to = $('#J_to'),
    $cc = $('#J_cc'),
    $from = $('#J_from'),
    $subject = $('#J_subject');
  // $text = $('#J_text'),
  // $html = $('#J_html');
  $send.click(function() {
    var html = tinyMCE.get(editor).getContent(),
      from;
    if ($composeBody.data('reply')) {
      from = $from.html();
    } else {
      from = $from.val();
    }
    $.post('/ajax/mail/send', {
      'to': $to.val() || $to.data('value'),
      'cc': $cc.val() || $cc.data('value'),
      'from': from,
      'subject': $subject.val(),
      'text': $(html).text(),
      'html': html
    }, function(data) {
      alert(data.message || '邮件发送成功！');
    });
  });

});
