/* Palestra CIPATR — comportamento da apresentação (reveal.js + extras) */
(function () {
  'use strict';

  // ---------- Ícones: <i data-icon="nome"></i> → SVG inline ----------
  function mountIcons(root) {
    root.querySelectorAll('[data-icon]').forEach(function (el) {
      var svg = window.ICONS && window.ICONS[el.getAttribute('data-icon')];
      if (!svg) return;
      el.classList.add('ico');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = svg;
    });
  }

  // ---------- Animação palavra por palavra em elementos .words ----------
  function splitWords(root) {
    root.querySelectorAll('.words').forEach(function (el) {
      var i = 0;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var parts = node.nodeValue.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          var span = document.createElement('span');
          span.className = 'w';
          span.style.setProperty('--i', i++);
          span.textContent = part;
          frag.appendChild(span);
        });
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  mountIcons(document);
  splitWords(document);

  var isPrint = /print-pdf/gi.test(window.location.search);

  // ---------- reveal.js ----------
  Reveal.initialize({
    width: 1920,
    height: 1080,
    margin: 0,
    minScale: 0.1,
    maxScale: 3,
    center: false,
    hash: true,
    controls: false,
    progress: true,
    slideNumber: 'c/t',
    transition: 'fade',
    transitionSpeed: 'slow',
    backgroundTransition: 'fade',
    autoAnimate: true,
    pdfSeparateFragments: false,
    pdfMaxPagesPerSlide: 1,
    defaultTiming: 110,
    hideInactiveCursor: true,
    hideCursorTime: 2500,
    help: true,
    plugins: [RevealNotes],
  }).then(onReady);

  // ---------- Véus e Ken Burns nos fundos ----------
  function decorateBackgrounds() {
    Reveal.getSlides().forEach(function (slide) {
      var bg = slide.slideBackgroundElement;
      if (!bg) return;
      var veil = slide.getAttribute('data-veil');
      if (veil && !bg.querySelector('.bg-veil')) {
        var v = document.createElement('div');
        v.className = 'bg-veil veil-' + veil;
        bg.appendChild(v);
      }
      (slide.getAttribute('data-bg-class') || '').split(/\s+/).forEach(function (c) {
        if (c) bg.classList.add(c);
      });
    });
  }

  // ---------- Moldura: capítulo atual + pontos de progresso ----------
  var chrome = document.querySelector('.chrome');
  var chapterLabel = chrome.querySelector('.label');
  var dotsWrap = chrome.querySelector('.dots');
  var chapters = [];

  function buildChapters() {
    Reveal.getSlides().forEach(function (s) {
      var c = s.getAttribute('data-chapter');
      var n = s.getAttribute('data-chapter-n');
      if (c && n && chapters.indexOf(n) === -1) chapters.push(n);
    });
    dotsWrap.innerHTML = chapters.map(function () { return '<i></i>'; }).join('');
  }

  function updateChrome(slide) {
    if (!slide) return;
    var hide = slide.getAttribute('data-chrome') === 'off';
    chrome.classList.toggle('is-hidden', hide);
    var label = slide.getAttribute('data-chapter') || '';
    var n = slide.getAttribute('data-chapter-n');
    chapterLabel.textContent = (n && /^\d+$/.test(n) ? n + ' — ' : '') + label;
    var idx = chapters.indexOf(n);
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      dot.classList.toggle('on', i === idx);
      dot.classList.toggle('done', idx > -1 && i < idx);
    });
  }

  // ---------- Dinâmica: opções clicáveis + resposta via fragmento ----------
  function setupDilemma() {
    var box = document.querySelector('.dilemma');
    if (!box) return;
    box.querySelectorAll('.opt').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        btn.classList.toggle('picked');
      });
    });
    function sync() {
      var flag = box.querySelector('.answer-flag');
      box.classList.toggle('answered', !!(flag && flag.classList.contains('visible')));
    }
    Reveal.on('fragmentshown', sync);
    Reveal.on('fragmenthidden', sync);
    Reveal.on('slidechanged', sync);
    sync();
  }

  // ---------- Cronômetro de 3 minutos da dinâmica ----------
  function setupTimer() {
    var t = document.querySelector('.timer');
    if (!t) return;
    var total = parseInt(t.getAttribute('data-seconds'), 10) || 180;
    var bar = t.querySelector('.bar');
    var out = t.querySelector('.time');
    var len = 2 * Math.PI * 42;
    bar.style.strokeDasharray = len;
    var left = total;
    var handle = null;
    function render() {
      var m = Math.floor(left / 60);
      var s = left % 60;
      out.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      bar.style.strokeDashoffset = len * (1 - left / total);
      t.classList.toggle('done', left === 0);
    }
    function stop() { clearInterval(handle); handle = null; }
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      if (handle) { stop(); return; }
      if (left === 0) left = total;
      handle = setInterval(function () {
        left = Math.max(0, left - 1);
        render();
        if (left === 0) stop();
      }, 1000);
    });
    t.addEventListener('dblclick', function (e) {
      e.stopPropagation();
      stop();
      left = total;
      render();
    });
    render();
  }

  function onReady(evt) {
    decorateBackgrounds();
    buildChapters();
    updateChrome(evt && evt.currentSlide ? evt.currentSlide : Reveal.getCurrentSlide());
    setupDilemma();
    setupTimer();
    Reveal.on('slidechanged', function (e) { updateChrome(e.currentSlide); });
    if (isPrint) document.documentElement.classList.add('print-pdf');
  }
})();
