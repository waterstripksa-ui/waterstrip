// @ts-nocheck
/* =============================================================================
   Water value-chain diagram (home "التحديات" section).
   Adapted from waterstrip/assets/js/vchain.js. Unchanged: the diagram is scaled
   as one picture to fill its column, and clicking it opens a zoomed view.
   Differs: the zoomed view is a scaled clone of the live diagram, not the mockup's
   static water-value-chain.png — that PNG is Arabic-only and would go stale the
   moment an admin edited a card, so it could not serve the English site or edits.
   Does nothing unless the diagram is on the page.
   ========================================================================== */
(function () {
  'use strict';

  var BASE = 900;                    /* the diagram's design width in px */
  var frame = document.getElementById('vchainFrame');
  var fig = document.getElementById('vchainFig');
  if (!frame || !fig) return;

  /* ---------- 1. Scale: the diagram behaves as one picture ------------------ */
  function fit() {
    var avail = frame.clientWidth;
    if (!avail) return;
    var s = avail / BASE;
    if (s > 1.35) s = 1.35;           /* cap so it does not balloon on wide screens */
    fig.style.transform = 'scale(' + s + ')';
    frame.style.height = Math.ceil(fig.offsetHeight * s) + 'px';
  }

  fit();
  window.addEventListener('resize', fit, { passive: true });
  window.addEventListener('orientationchange', fit);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
  window.addEventListener('load', fit);
  if (window.ResizeObserver) { new ResizeObserver(fit).observe(frame); }

  /* ---------- 2. Open the diagram enlarged ---------------------------------- */
  var box = document.getElementById('vchainBox');
  var zoomBtn = document.getElementById('vchainZoom');
  var closeBtn = document.getElementById('vchainClose');
  if (!box) return;
  var scroller = box.querySelector('.vcbox__scroll');

  var lastFocus = null;

  /* Same widths the mockup gave its enlarged image (style.css: .vcbox__scroll img). */
  function zoomWidth() {
    if (window.matchMedia('(max-width: 760px)').matches) return 900;
    return window.matchMedia('(min-width: 1100px)').matches ? 1280 : 980;
  }

  function fillScroller() {
    var k = zoomWidth() / BASE;
    var copy = fig.cloneNode(true);
    copy.removeAttribute('id');
    copy.removeAttribute('role');
    copy.removeAttribute('aria-label');
    copy.setAttribute('aria-hidden', 'true');
    copy.style.transform = 'scale(' + k + ')';
    var holder = document.createElement('div');
    holder.style.position = 'relative';
    holder.style.width = Math.round(BASE * k) + 'px';
    holder.style.height = Math.ceil(fig.offsetHeight * k) + 'px';
    holder.appendChild(copy);
    scroller.textContent = '';
    scroller.appendChild(holder);
  }

  function open() {
    lastFocus = document.activeElement;
    fillScroller();
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (zoomBtn) zoomBtn.addEventListener('click', open);
  frame.addEventListener('click', function (e) {
    if (zoomBtn && zoomBtn.contains(e.target)) return;   /* the button handles itself */
    open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target === scroller) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!box.hidden && (e.key === 'Escape' || e.key === 'Esc')) close();
  });
})();
