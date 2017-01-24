$(function () {
  $.get('https://rawgit.com/minasdev/minasdev-events/master/events.json', function (data) {
    var events = _.sortBy(data.events, 'date');
    events = _.remove(events, function (r) {
      return moment(r.date + 'T22:00:00') >= moment();
    });

    renderTemplate($('#next-events'), events, {max: 100}, function () {
      if ($('.proximos-eventos-item').length > 0) $('.proximos-eventos').show();
    });
  });

  navBarPosition();

  $('header').addClass('show');

  $(document).on('scroll', function () {
    navBarPosition();
  });

  // Tem que ter suporte via teclado
  $('.nav-link').on('click', function (e) {
    e.preventDefault();

    var _this = $(this);

    scrollToElement(_this.attr('data-anchor'), _this.attr('data-offset'));
  });

  $('.newsletter-form').on('submit', function () {
    var emailInpt = $('#email');

    if (emailInpt.val() === '' || !validateEmail(emailInpt.val())) {
      emailInpt.addClass('animate-error');
      setTimeout(function () {
        emailInpt.removeClass('animate-error')
      }, 300);

      return false;
    }
  });
});

/**
 * @param {jQuery} block
 * @param {Array} results
 * @param {Object} options
 * @param {Function} done
 */
function renderTemplate(block, results, options, done) {
  options = options || {};

  if (typeof options.max === 'undefined') {
    options.max = 1;
  }

  var tpl = block.html();
  var output = '';

  $.each(results, function (i, event) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    output += _.template(tpl, event);

    return (i < (options.max - 1));
  });

  $(output).insertBefore(block);

  setTimeout(done, 0);
}

function navBarPosition() {
  if ($(window).scrollTop() < 170) {
    $('header').addClass('on-top');
  } else {
    $('header').removeClass('on-top');
  }
}

/**
 * @param {String} selector
 * @param {Number} offset
 */
function scrollToElement(selector, offset) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top - offset
  }, 1200, 'easeInOutCubic');
}

/**
 * @param {String} email
 *
 * @returns {boolean}
 */
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}
