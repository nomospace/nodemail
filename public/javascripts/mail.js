$(function() {
  'use strict';

  $('iframe').iframeAutoHeight();
  $('#J_toolbar').stickyPanel({topPadding: 40, savePanelSpace: true});

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
  var $delete = $('#J_delete'),
    $composeBody = $('#J_compose_body'),
    $send = $('#J_send'),
    $to = $('#J_to'),
    $cc = $('#J_cc'),
    $from = $('#J_from'),
    $subject = $('#J_subject'),
    $saveAsDraft = $('#J_saveas_draft'),
    $attachFile = $('#J_attach_file');
  // $text = $('#J_text'),
  // $html = $('#J_html');
  $send.click(function() {
    var html = tinyMCE.get(editor).getContent(), from;
    if ($composeBody.data('reply')) {
      from = $from.html();
    } else {
      from = $from.val();
    }

    var options = {
      'to': $to.val() || $to.data('value'),
      'cc': $cc.val() || $cc.data('value'),
      'from': from,
      'subject': $subject.val(),
      'text': $(html).text(),
      'html': html
    };

    $.post('/ajax/mail/send', options, function(data) {
      alert(data.message || '邮件发送成功');
    });
  });

  $delete.click(function() {
    $.post('/ajax/mail/' + ID + '/addFlags/deleted', function(data) {
      alert('邮件删除' + (data.success ? '成功' : '失败'));
    });
  });

  $saveAsDraft.click(function() {
    $.post('/ajax/mail/' + ID + '/addFlags/draft', function(data) {
      alert('邮件保存' + (data.success ? '成功' : '失败'));
    });
  });

  $attachFile.change(function(e) {
    debugger;
  });

});
