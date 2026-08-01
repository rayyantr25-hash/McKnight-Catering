/* ==========================================================================
   McKnight's Catering — main.js
   Vanilla JS: nav, loader, scroll reveals (GSAP), counters, popup,
   testimonial/gallery sliders (Swiper), forms, lightbox, back-to-top.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Loading screen ---------------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) {
      setTimeout(function () {
        loader.classList.add("hide");
      }, 350);
    }
  });

  /* ---------------- Mobile nav toggle ---------------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  var siteHeader = document.querySelector(".site-header");

  function positionMobileNav() {
    if (!nav || !siteHeader) return;
    var bottom = siteHeader.getBoundingClientRect().bottom;
    nav.style.top = Math.max(bottom, 0) + "px";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      positionMobileNav();
      toggle.classList.toggle("open");
      nav.classList.toggle("open");
      document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        nav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
    window.addEventListener("resize", positionMobileNav);
    window.addEventListener("orientationchange", positionMobileNav);
  }

  /* ---------------- Sticky header state + back-to-top ---------------- */
  var header = document.querySelector(".site-header");
  var backToTop = document.getElementById("backToTop");
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 600);
    lastY = y;
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Active nav link ---------------- */
  (function setActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  })();

  /* ---------------- GSAP scroll reveals ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var reveals = document.querySelectorAll(".reveal");
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      reveals.forEach(function (el, i) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: function () { el.classList.add("is-visible"); },
          once: true
        });
      });

      // Hero clip reveal
      var heroMedia = document.querySelector(".hero-media img");
      if (heroMedia) {
        gsap.fromTo(heroMedia, { scale: 1.15, opacity: 0.2 }, { scale: 1, opacity: 0.55, duration: 1.8, ease: "power3.out" });
      }
      var heroContent = document.querySelectorAll(".hero-content > *");
      if (heroContent.length) {
        gsap.fromTo(heroContent, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, delay: 0.3, ease: "power3.out" });
      }
    } else {
      // fallback: use IntersectionObserver
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      reveals.forEach(function (el) { io.observe(el); });
    }

    initCounters();
    initPopup();
    initTestimonialSlider();
    initGallerySwiper();
    initLightbox();
    initForms();
    initGalleryFilter();
  });

  /* ---------------- Animated stat counters ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var done = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !done.has(entry.target)) {
          done.add(entry.target);
          animateCount(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Homepage offer popup ---------------- */
  function initPopup() {
    var overlay = document.getElementById("offerPopup");
    if (!overlay) return;
    var closeBtn = overlay.querySelector(".popup-close");
    var seen = sessionStorage.getItem("mck_popup_seen");

    if (!seen) {
      setTimeout(function () {
        overlay.classList.add("show");
      }, 4500);
    }

    function closePopup() {
      overlay.classList.remove("show");
      sessionStorage.setItem("mck_popup_seen", "1");
    }
    if (closeBtn) closeBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopup();
    });

    var form = overlay.querySelector("form");
    if (form) {
      form.addEventListener("mck:formSuccess", function () {
        sessionStorage.setItem("mck_popup_seen", "1");
        setTimeout(closePopup, 2600);
      });
    }
  }

  /* ---------------- Testimonials (Swiper) ---------------- */
  function initTestimonialSlider() {
    var el = document.querySelector(".testimonial-swiper");
    if (!el || !window.Swiper) return;
    new Swiper(el, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 28,
      autoplay: { delay: 5500, disableOnInteraction: false },
      pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
      breakpoints: {
        860: { slidesPerView: 2 },
        1180: { slidesPerView: 3 }
      }
    });
  }

  /* ---------------- Background image carousels (homepage hero + interior page banners) ---------------- */
  function initGallerySwiper() {
    document.querySelectorAll(".hero-swiper").forEach(function (el) {
      if (!window.Swiper) return;
      var paginationEl = el.querySelector(".swiper-pagination");
      new Swiper(el, {
        loop: true,
        effect: "fade",
        fadeEffect: { crossFade: true },
        autoplay: { delay: 4200, disableOnInteraction: false },
        pagination: paginationEl ? { el: paginationEl, clickable: true } : false
      });
    });
  }

  /* ---------------- Gallery filter (Gallery page) ---------------- */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll(".gallery-filter button");
    var items = document.querySelectorAll(".gallery-grid figure");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var match = cat === "all" || item.getAttribute("data-cat") === cat;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Lightbox for gallery ---------------- */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var img = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll(".gallery-grid figure img").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        img.src = thumb.getAttribute("data-full") || thumb.src;
        img.alt = thumb.alt;
        lightbox.classList.add("open");
      });
    });
    function close() { lightbox.classList.remove("open"); }
    if (closeBtn) closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------- Form handling (Contact/Quote, Popup, Newsletter) ----------------
     Sends real emails via FormSubmit.co — no backend server or signup required.
     Destination inbox: gmcknight@yccfoodservice.com (set once below).
     NOTE: the very first submission to a new destination address triggers a
     one-time "Activate Form" confirmation email from FormSubmit — until that
     link is clicked, submissions won't arrive. See README for details.
     Login/Signup below are frontend-only (no email/backend) since they collect
     passwords — wire up real authentication separately when ready. */
  var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/gmcknight@yccfoodservice.com";

  function initForms() {
    document.querySelectorAll("form[data-ajax-form]").forEach(function (form) {
      var formName = form.getAttribute("data-ajax-form");

      // Login/Signup contain passwords — never send these to FormSubmit/email.
      // Frontend-only placeholder until real authentication is connected.
      if (formName === "login" || formName === "signup") {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var required = form.querySelectorAll("[required]");
          var valid = true;
          required.forEach(function (field) {
            if (!field.value.trim()) { valid = false; field.style.borderColor = "#c0392b"; }
            else { field.style.borderColor = ""; }
          });
          if (!valid) return;
          showFormSuccess(form);
        });
        return;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var required = form.querySelectorAll("[required]");
        var valid = true;
        required.forEach(function (field) {
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = "#c0392b";
          } else {
            field.style.borderColor = "";
          }
        });
        if (!valid) return;

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalLabel = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

        var payload = Object.fromEntries(new FormData(form).entries());
        payload._subject = "McKnight's Website — " + formName.replace(/-/g, " ");
        payload._template = "table";
        payload._captcha = "false";
        payload.form_source = formName;

        fetch(FORMSUBMIT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json().catch(function () { return {}; }); })
          .then(function () {
            showFormSuccess(form);
          })
          .catch(function (err) {
            console.error("Form send failed:", err);
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
            var errNote = form.querySelector(".form-error-note");
            if (!errNote) {
              errNote = document.createElement("p");
              errNote.className = "form-error-note";
              errNote.style.cssText = "color:#c0392b;font-size:13px;margin-top:12px;";
              form.appendChild(errNote);
            }
            errNote.textContent = "Something went wrong sending this — please call 832-257-6694 or try again.";
          });
      });
    });
  }

  function showFormSuccess(form) {
    // Popup has its own two-panel structure (form-wrap / success) rather than form-success sibling.
    var popupWrap = form.closest(".popup-body");
    if (popupWrap) {
      var wrap = popupWrap.querySelector(".popup-form-wrap");
      var success = popupWrap.querySelector(".popup-success");
      if (wrap) wrap.style.display = "none";
      if (success) success.style.display = "block";
      form.dispatchEvent(new CustomEvent("mck:formSuccess"));
      return;
    }
    var successEl = form.parentElement.querySelector(".form-success");
    if (successEl) {
      form.style.display = "none";
      successEl.classList.add("show");
    } else {
      form.reset();
      var note = form.parentElement.querySelector(".form-inline-success");
      if (note) note.textContent = "Thank you — you're on the list!";
    }
  }

  /* ---------------- Smooth in-page anchor scroll offset ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var offset = 90;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });
})();
