// @ts-nocheck
/* =============================================================================
   Interactive corridor map (Rabigh -> Jeddah).
   -----------------------------------------------------------------------------
   Adapted from waterstrip/assets/js/corridor-map.js — the tile engine, projection,
   drag / pinch / wheel / keyboard handling and the route are unchanged. What
   differs, because the site is bilingual and its copy is editable:
   1. The four areas' *names and popup lists* are not in this file. The view
      (src/components/CorridorSection.astro) server-renders each area's marker
      (`.wsmap__hub[data-hub]`) with its name and popup already in the right
      language and escaped by Astro, and this script only positions them.
      What stays here is geography: coordinates, radii and the route.
   2. The two on-map hints come from `data-hint-zoom` / `data-hint-touch` on #wsMap.
   3. `.is-ready` is added once markers are positioned (overrides.css hides them until then).
   ========================================================================== */
(function () {
  'use strict';
  var root = document.getElementById('wsMap');
  if (!root) return;

  /* ---- إعدادات ---------------------------------------------------------- */
  var TILE_URL = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  var TILE = 256, MIN_Z = 8, MAX_Z = 13, START_Z = 9;
  var BOUNDS = { minLat: 21.15, maxLat: 23.25, minLon: 38.45, maxLon: 39.95 };
  var CENTER = { lat: 22.22, lon: 39.12 };

  var HUBS = [
    { key: 'rabigh', lat: 22.800, lon: 39.033, r: 7000 },
    { key: 'kaec',   lat: 22.400, lon: 39.083, r: 8000 },
    { key: 'thuwal', lat: 22.283, lon: 39.100, r: 6000 },
    { key: 'jeddah', lat: 21.679, lon: 39.157, r: 9000 }
  ];
  var ROUTE = [[22.80758,39.05892],[22.77184,39.08478],[22.7361,39.09707],[22.70035,39.10898],[22.66461,39.1222],[22.62887,39.13461],[22.59313,39.14821],[22.55738,39.15562],[22.52164,39.17227],[22.4859,39.18168],[22.45016,39.19013],[22.41441,39.19474],[22.37867,39.18674],[22.34293,39.166],[22.30719,39.14588],[22.27144,39.12481],[22.2357,39.11167],[22.19996,39.11142],[22.16422,39.11302],[22.12847,39.11305],[22.09273,39.11469],[22.05699,39.11513],[22.02125,39.11632],[21.9855,39.11814],[21.94976,39.12093],[21.91402,39.12122],[21.87828,39.12122],[21.84253,39.11778],[21.80679,39.11527],[21.77105,39.15634],[21.73531,39.16277],[21.69956,39.15738],[21.66382,39.16081],[21.62808,39.17121]];

  /* ---- رياضيات الإسقاط (Web Mercator) ---------------------------------- */
  function worldSize(z) { return TILE * Math.pow(2, z); }
  function lonToX(lon, z) { return (lon + 180) / 360 * worldSize(z); }
  function latToY(lat, z) {
    var s = Math.sin(lat * Math.PI / 180);
    s = Math.max(-0.9999, Math.min(0.9999, s));
    return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * worldSize(z);
  }
  function xToLon(x, z) { return x / worldSize(z) * 360 - 180; }
  function yToLat(y, z) {
    var n = Math.PI - 2 * Math.PI * y / worldSize(z);
    return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  }
  function metersPerPixel(lat, z) {
    return 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, z);
  }

  /* ---- الحالة ----------------------------------------------------------- */
  var z = START_Z, center = { lat: CENTER.lat, lon: CENTER.lon };
  var vw = 0, vh = 0, frame = null;

  /* ---- بناء العناصر ----------------------------------------------------- */
  var tilesLayer = document.createElement('div'); tilesLayer.className = 'wsmap__tiles';
  var svgNS = 'http://www.w3.org/2000/svg';
  var overlay = document.createElementNS(svgNS, 'svg'); overlay.setAttribute('class', 'wsmap__overlay');
  var routePath = document.createElementNS(svgNS, 'path');
  routePath.setAttribute('class', 'wsmap__route'); routePath.setAttribute('fill', 'none');
  var routeGlow = document.createElementNS(svgNS, 'path');
  routeGlow.setAttribute('class', 'wsmap__route-glow'); routeGlow.setAttribute('fill', 'none');
  overlay.appendChild(routeGlow); overlay.appendChild(routePath);
  var rings = HUBS.map(function () {
    var c = document.createElementNS(svgNS, 'circle'); c.setAttribute('class', 'wsmap__ring');
    overlay.appendChild(c); return c;
  });
  var markersLayer = root.querySelector('.wsmap__markers');
  var markers = HUBS.map(function (h) {
    return markersLayer.querySelector('.wsmap__hub[data-hub="' + h.key + '"]');
  });

  var hint = document.createElement('div');
  hint.className = 'wsmap__hint'; hint.setAttribute('aria-hidden', 'true');

  root.insertBefore(tilesLayer, markersLayer); root.insertBefore(overlay, markersLayer);
  root.appendChild(hint);

  /* ---- الرسم ------------------------------------------------------------ */
  var tileCache = {};
  function clampCenter() {
    center.lat = Math.max(BOUNDS.minLat, Math.min(BOUNDS.maxLat, center.lat));
    center.lon = Math.max(BOUNDS.minLon, Math.min(BOUNDS.maxLon, center.lon));
  }
  function topLeft() {
    return { x: lonToX(center.lon, z) - vw / 2, y: latToY(center.lat, z) - vh / 2 };
  }
  function draw() {
    frame = null;
    if (!vw || !vh) return;
    var tl = topLeft(), n = Math.pow(2, z);
    var x0 = Math.floor(tl.x / TILE), x1 = Math.floor((tl.x + vw) / TILE);
    var y0 = Math.floor(tl.y / TILE), y1 = Math.floor((tl.y + vh) / TILE);
    var seen = {};
    for (var tx = x0; tx <= x1; tx++) {
      for (var ty = y0; ty <= y1; ty++) {
        if (ty < 0 || ty >= n) continue;
        var wx = ((tx % n) + n) % n, key = z + '/' + wx + '/' + ty;
        seen[key] = 1;
        var img = tileCache[key];
        if (!img) {
          img = new Image();
          img.className = 'wsmap__tile'; img.alt = ''; img.decoding = 'async';
          img.src = TILE_URL.replace('{z}', z).replace('{x}', wx).replace('{y}', ty);
          img.addEventListener('error', function () { this.classList.add('is-failed'); });
          tileCache[key] = img; tilesLayer.appendChild(img);
        }
        img.style.transform = 'translate3d(' + (tx * TILE - tl.x) + 'px,' + (ty * TILE - tl.y) + 'px,0)';
      }
    }
    for (var k in tileCache) {
      if (!seen[k]) { var t = tileCache[k]; if (t.parentNode) t.parentNode.removeChild(t); delete tileCache[k]; }
    }
    // المسار
    var d = '';
    for (var i = 0; i < ROUTE.length; i++) {
      d += (i ? 'L' : 'M') + (lonToX(ROUTE[i][1], z) - tl.x).toFixed(1) + ',' + (latToY(ROUTE[i][0], z) - tl.y).toFixed(1) + ' ';
    }
    routePath.setAttribute('d', d); routeGlow.setAttribute('d', d);
    // دوائر المناطق + العلامات
    HUBS.forEach(function (h, i) {
      var px = lonToX(h.lon, z) - tl.x, py = latToY(h.lat, z) - tl.y;
      rings[i].setAttribute('cx', px.toFixed(1));
      rings[i].setAttribute('cy', py.toFixed(1));
      rings[i].setAttribute('r', Math.max(9, h.r / metersPerPixel(h.lat, z)).toFixed(1));
      if (markers[i]) markers[i].style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)';
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }

  function resize() {
    /* clientWidth/Height = صندوق المحتوى بلا الحدود، حتى تتطابق طبقة الرسم
       مع طبقة العلامات تمامًا (اختلاف بكسلين كان يظهر في اتجاه RTL). */
    vw = root.clientWidth; vh = root.clientHeight;
    overlay.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    draw();
  }

  /* ---- التكبير مع تثبيت نقطة ------------------------------------------- */
  function zoomAround(nz, ax, ay) {
    nz = Math.max(MIN_Z, Math.min(MAX_Z, nz));
    if (nz === z) return;
    var tl = topLeft();
    var lon = xToLon(tl.x + ax, z), lat = yToLat(tl.y + ay, z);
    z = nz;
    var nx = lonToX(lon, z) - ax + vw / 2, ny = latToY(lat, z) - ay + vh / 2;
    center.lon = xToLon(nx, z); center.lat = yToLat(ny, z);
    clampCenter(); root.setAttribute('data-z', z); schedule();
  }
  function zoomBy(dz) { zoomAround(z + dz, vw / 2, vh / 2); }

  /* ---- السحب ------------------------------------------------------------ */
  var dragging = false, lastX = 0, lastY = 0, moved = 0;
  root.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;          /* اللمس له معالج خاص */
    if (e.target.closest('.wsmap__hub')) return;
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
    root.setPointerCapture(e.pointerId); root.classList.add('is-dragging');
  });
  root.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    var tl = topLeft();
    center.lon = xToLon(tl.x - dx + vw / 2, z);
    center.lat = yToLat(tl.y - dy + vh / 2, z);
    clampCenter(); schedule();
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false; root.classList.remove('is-dragging');
    try { root.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  root.addEventListener('dblclick', function (e) {
    if (e.target.closest('.wsmap__hub')) return;
    var r = root.getBoundingClientRect();
    zoomAround(z + 1, e.clientX - r.left, e.clientY - r.top);
  });

  /* ---- العجلة: تكبير مع Ctrl فقط حتى لا نعطّل تمرير الصفحة ------------- */
  var hintTimer = null;
  function showHint(msg) {
    hint.textContent = msg; hint.classList.add('is-on');
    clearTimeout(hintTimer); hintTimer = setTimeout(function () { hint.classList.remove('is-on'); }, 1600);
  }
  root.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      var r = root.getBoundingClientRect();
      zoomAround(z + (e.deltaY < 0 ? 1 : -1), e.clientX - r.left, e.clientY - r.top);
    } else {
      showHint(root.getAttribute('data-hint-zoom') || '');
    }
  }, { passive: false });

  /* ---- اللمس: إصبعان للتحريك والتقريب، إصبع واحد يمرّر الصفحة ---------- */
  var touchMode = 0, tPrev = null, tDist = 0;
  function tCenter(t) {
    return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
  }
  function tSpread(t) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }
  root.addEventListener('touchstart', function (e) {
    if (e.target.closest('.wsmap__hub')) return;
    if (e.touches.length === 2) {
      touchMode = 2; tPrev = tCenter(e.touches); tDist = tSpread(e.touches); e.preventDefault();
    } else if (e.touches.length === 1) {
      touchMode = 1; showHint(root.getAttribute('data-hint-touch') || '');
    }
  }, { passive: false });
  root.addEventListener('touchmove', function (e) {
    if (touchMode !== 2 || e.touches.length !== 2) return;
    e.preventDefault();
    var c = tCenter(e.touches), dist = tSpread(e.touches);
    var dx = c.x - tPrev.x, dy = c.y - tPrev.y; tPrev = c;
    var tl = topLeft();
    center.lon = xToLon(tl.x - dx + vw / 2, z);
    center.lat = yToLat(tl.y - dy + vh / 2, z);
    clampCenter();
    if (tDist > 0) {
      var ratio = dist / tDist;
      if (ratio > 1.35 || ratio < 0.74) {
        var r = root.getBoundingClientRect();
        zoomAround(z + (ratio > 1 ? 1 : -1), c.x - r.left, c.y - r.top);
        tDist = dist;
      }
    }
    schedule();
  }, { passive: false });
  root.addEventListener('touchend', function () { touchMode = 0; });

  /* ---- الأزرار ---------------------------------------------------------- */
  /* لوحة المفاتيح */
  root.addEventListener('keydown', function (e) {
    var step = 60, tl;
    if (e.key === '+' || e.key === '=') { zoomBy(1); e.preventDefault(); }
    else if (e.key === '-' || e.key === '_') { zoomBy(-1); e.preventDefault(); }
    else if (e.key.indexOf('Arrow') === 0) {
      tl = topLeft();
      var dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
      var dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
      center.lon = xToLon(tl.x + dx + vw / 2, z);
      center.lat = yToLat(tl.y + dy + vh / 2, z);
      clampCenter(); schedule(); e.preventDefault();
    }
  });

  /* ---- واجهة برمجية صغيرة: نداء من بطاقات المناطق في صفحة الممر -------- */
  function focus(key) {
    var i = -1;
    HUBS.forEach(function (h, k) { if (h.key === key) i = k; });
    if (i < 0) return;
    center.lat = HUBS[i].lat; center.lon = HUBS[i].lon;
    z = Math.max(z, 11); clampCenter();
    root.setAttribute('data-z', z); draw();
    markersLayer.querySelectorAll('.wsmap__cw').forEach(function (c) { c.classList.remove('is-open'); });
    var cw = markers[i] && markers[i].querySelector('.wsmap__cw'); if (cw) cw.classList.add('is-open');
    root.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-hub]') : null;
    if (b) { e.preventDefault(); focus(b.getAttribute('data-hub')); }
  });
  /* إغلاق النافذة المفتوحة يدويًا عند السحب أو التكبير */
  root.addEventListener('pointerdown', function () {
    markersLayer.querySelectorAll('.wsmap__cw.is-open').forEach(function (c) { c.classList.remove('is-open'); });
  });
  window.WS_CORRIDOR_MAP = { focus: focus };

  /* ---- الإقلاع ---------------------------------------------------------- */
  root.setAttribute('data-z', z);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(root);
  window.addEventListener('resize', resize);
  resize();
  root.classList.add('is-ready');
})();
