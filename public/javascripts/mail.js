$(function() {

  $('iframe').iframeAutoHeight();

  var mce = tinyMCE.init({
    // General options
    mode: "textareas",
    // theme: "simple",
    plugins: "fullpage",
    width: "100%",
    oninit: _tinyMCEInited
  });

  function _tinyMCEInited() {
    tinyMCE.get('J_editor').show();
  }

});