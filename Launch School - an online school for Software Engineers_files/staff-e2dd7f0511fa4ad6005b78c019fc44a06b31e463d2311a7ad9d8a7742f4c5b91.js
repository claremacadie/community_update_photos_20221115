$(function() {
  var $toggles = $('.content-toggle');
  var toggleCount = $toggles.length;

  $toggles.each(function(idx) {
    var $toggle = $(this);
    var $label = $toggle.next('label');
    // Using the origin and path automatically omits any other hash or query
    // string that is present in the current url
    var linkUrl = window.location.origin + window.location.pathname + '#' + $toggle.attr('id');

    var $newButton = $('<button class="btn copy-to-clipboard" data-clipboard-text="' + linkUrl + '"></button>');
    var $clipboardImage = $('<img src="/assets/clippy.svg" alt="Copy direct link">');

    $newButton.append($clipboardImage);
    $label.append($newButton);

    // We don't want to initialize clipboard.js until all of the buttons are
    // inserted
    if (idx === toggleCount - 1) {
      var clipboard = new Clipboard('.btn.copy-to-clipboard');

      clipboard.on('success', function(e) {
        var $clicked = $(e.trigger);

        $clicked.fadeOut(100, function() {
          $clicked.fadeIn(50);
        });
      });
    }
  });
});
$(function () {
  $("#gist-folders").click(function(event) {
    var gistFolder = event.target.closest(".gist-folder")
    if (gistFolder && event.target.tagName !== "A") {
      $(gistFolder).find(".folder-icon").toggleClass("fa-folder-open-o").toggleClass("fa-folder-o")
      $(gistFolder.parentElement.querySelector("table")).toggle();
    }
  })
  var gistFolder = $(window.location.hash)[0];
  if (gistFolder) gistFolder.click();
});
$(document).on('click', '.toggle-staff-course-index-children', function(e) {
  e.preventDefault();
  $(e.target).parent().find('.content').toggleClass('active');
});
// This code is the client-side component that displays user info
// popups when a user link is hovered.
(function() {
  var timeout, id, nextId;
  var SELECTOR = 'a[href*="/users/"]';

  // fetch popup HTML from server
  function loadHTML() {
    if (!nextId) { return; }

    var url = '/staff/users/' + nextId + '/stats';
    $.ajax(url, {
      method: 'GET'
    }).then(showPopup);
  }

  // display popup on screen
  function showPopup(html, textStatus, jqXHR) {
    removePopup();

    id = nextId;
    nextId = null;

    var popup = $(html);
    var $document = $(document);
    $(popup).addClass('new');

    popup.appendTo(document.body);

    $document.on('keyup.close-user-stats-popup', function(e) {
      if (e.which === 27) { removePopup(); }
    });
    $document.on('click.close-user-stats-popup', function(e) {
      if ($(e.target).closest('.staff-user-stats-popup').length === 0) {
        removePopup();
      }
    });

    setTimeout(function() {
      $(popup).removeClass('new');
    }, 100);
  }

  // Execute the callback if the event took place on a user link
  function ifUserLinkEvent(event, callback) {
    var link = event.currentTarget;
    var match = $(link).attr('href').match(/\/users\/(\w+)/);

    if (match) {
      callback(match[1]);
    }
  }

  function disableTimeout(event) {
    ifUserLinkEvent(event, function() {
      clearTimeout(timeout);
      nextId = null;
    });
  }

  function removePopup() {
    id = null;
    $('.staff-user-stats-popup').remove();
    $(document).off('.close-user-stats-popup');
  }

  $(document).on('mouseout', SELECTOR, disableTimeout);
  $(document).on('click', SELECTOR, disableTimeout);

  $(document).on('mouseover', SELECTOR, function(event) {
    ifUserLinkEvent(event, function(newId) {
      if (id === newId) { return; } // already displaying this user

      nextId = newId;
      clearTimeout(timeout);
      timeout = setTimeout(loadHTML, 700);
    });
  });

  $(document).on('click', '.staff-user-stats-popup .close-button', function(e) {
    removePopup();
  });
})();
