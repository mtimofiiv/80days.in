(function() {
  var initSocialButtons = function(klass, onHover, onClick) {
    var el = document.getElementsByClassName(klass);
    for (var i = 0; i < el.length; i++) {
      el[i].addEventListener('mouseover', onHover);
      el[i].addEventListener('mouseout', removeShareHover);
      el[i].addEventListener('click', onClick);
    }
  };

  var shareHover = function(message) {
    var labels = document.getElementsByClassName('share-action');

    return function(e) {
      for (var i = 0; i < labels.length; i++) labels[i].innerHTML = message;
    }
  };

  var removeShareHover = function() {
    var labels = document.getElementsByClassName('share-action');
    for (var i = 0; i < labels.length; i++) labels[i].innerHTML = '&nbsp;';
  };

  var shareClickFacebook = function() {
    var uri = 'https://www.facebook.com/dialog/share?display=popup'
    uri += '&href=' + encodeURIComponent(window.location.href);
    uri += '&redirect_uri=' + encodeURIComponent(window.location.href);
    window.open(uri, 'Share on Facebook', 'menubar=0,scrollbars=0,location=0,width=600,height=400');
  };

  var shareClickTwitter = function() {
    var uri = 'https://twitter.com/intent/tweet?'
    uri += '&url=' + encodeURIComponent(window.location.href);
    uri += '&text=' + encodeURIComponent(document.title);
    window.open(uri, 'Share on Twitter', 'menubar=0,scrollbars=0,location=0,width=600,height=400');
  };

  var initialize = function() {
    initSocialButtons('share-facebook', shareHover('Share on Facebook'), shareClickFacebook);
    initSocialButtons('share-twitter', shareHover('Share on Twitter'), shareClickTwitter);
  };

  initialize();
})();
