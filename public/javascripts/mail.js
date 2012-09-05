$(function() {

  $('iframe').iframeAutoHeight();

  if (window.tinyMCE) {
    tinyMCE.init({
      // General options
      mode: "textareas",
      // theme: "simple",
      auto_focus: 'J_editor',
      plugins: "fullpage",
      width: "100%",
      oninit: function() {
        tinyMCE.get('J_editor').show();
      }
    });
  }

});