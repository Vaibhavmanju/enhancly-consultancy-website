// Enhancly Consultancy — shared front-end behaviour
document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active nav link based on current page */
  var current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Back to top */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 480);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Header shrink shadow on scroll */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 12 ? '0 8px 24px -18px rgba(11,31,58,0.5)' : 'none';
    });
  }

  /* Contact / application form handling — submits to Formspree so
     entries land in enhancly@gmail.com. Falls back to a clear message
     with the direct email address if the Formspree endpoint hasn't
     been activated yet (see SETUP-EMAIL.md). */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) valid = false;
      });

      if (!status) return;
      status.classList.remove('show');

      if (!valid) {
        status.textContent = 'Please complete all required fields before submitting.';
        status.style.color = '#B4442E';
        status.classList.add('show');
        return;
      }

      var endpoint = form.getAttribute('action');
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      var placeholderActive = !endpoint || endpoint.indexOf('REPLACE_WITH_YOUR_FORMSPREE_ID') !== -1;

      var finish = function (message, color) {
        status.textContent = message;
        status.style.color = color;
        status.classList.add('show');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      };

      if (placeholderActive) {
        // Formspree endpoint not yet configured — see SETUP-EMAIL.md
        finish('Thanks — this form is not yet connected to email delivery. Please email us directly at enhancly@gmail.com so we don\'t miss your message.', '#B4442E');
        return;
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (response) {
        if (response.ok) {
          finish('Thank you — your message has been sent to our team and you should hear back within one business day.', '#1F6F4A');
          form.reset();
        } else {
          return response.json().then(function (data) {
            var detail = (data && data.errors) ? data.errors.map(function (err) { return err.message; }).join(', ') : 'Please try again.';
            throw new Error(detail);
          });
        }
      }).catch(function () {
        finish('Something went wrong sending your message. Please email us directly at enhancly@gmail.com.', '#B4442E');
      });
    });
  });

  /* Simple counter animation for stat numbers with data-count */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var current = 0;
        var step = Math.max(1, Math.round(target / 50));
        var timer = setInterval(function () {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current + suffix;
        }, 24);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }
});
