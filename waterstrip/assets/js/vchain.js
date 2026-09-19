/* ملف: assets/js/vchain.js
   مخطط سلسلة قيمة المياه في قسم «التحديات»:
   1) يتعامل مع المخطط كصورة واحدة — يُصغَّر أو يُكبَّر بنسبة واحدة ليملأ
      عرض الحاوية دون أي تغيّر في شكله أو ترتيبه (نفس الشكل على الجوال).
   2) الضغط عليه يفتح نسخة صورة مكبَّرة يمكن تمريرها أفقيًا وعموديًا.
   لا يعمل الملف إلا إذا وُجد المخطط في الصفحة. */
(function () {
  'use strict';

  var BASE = 900;                    /* عرض تصميم المخطط الأساسي بالبكسل */
  var frame = document.getElementById('vchainFrame');
  var fig = document.getElementById('vchainFig');
  if (!frame || !fig) return;

  /* ---------- 1. المقياس: يتصرّف المخطط كصورة واحدة ------------------- */
  function fit() {
    var avail = frame.clientWidth;
    if (!avail) return;
    var s = avail / BASE;
    if (s > 1.35) s = 1.35;           /* حد أعلى كي لا يتضخّم على الشاشات العريضة */
    fig.style.transform = 'scale(' + s + ')';
    frame.style.height = Math.ceil(fig.offsetHeight * s) + 'px';
  }

  fit();
  window.addEventListener('resize', fit, { passive: true });
  window.addEventListener('orientationchange', fit);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
  window.addEventListener('load', fit);
  if (window.ResizeObserver) { new ResizeObserver(fit).observe(frame); }

  /* ---------- 2. فتح المخطط كصورة مكبَّرة ------------------------------ */
  var box = document.getElementById('vchainBox');
  var zoomBtn = document.getElementById('vchainZoom');
  var closeBtn = document.getElementById('vchainClose');
  if (!box) return;

  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
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
    if (zoomBtn && zoomBtn.contains(e.target)) return;   /* الزر يتكفّل بنفسه */
    open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.className === 'vcbox__scroll') close();
  });
  document.addEventListener('keydown', function (e) {
    if (!box.hidden && (e.key === 'Escape' || e.key === 'Esc')) close();
  });
})();
