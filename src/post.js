(function () {
  var content = document.querySelector('.post-content');
  if (!content) return;

  var headings = Array.prototype.slice.call(content.querySelectorAll('h2[id], h3[id]'));
  var contents = document.querySelector('.post-sidebar-contents');
  var toc = document.querySelector('.post-toc');
  var list = document.querySelector('.post-toc-list');
  var links = [];

  headings.forEach(function (heading) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    item.className = heading.tagName === 'H3' ? 'post-toc-subsection' : '';
    link.href = '#' + encodeURIComponent(heading.id);
    link.textContent = heading.textContent;
    item.appendChild(link);
    list.appendChild(item);
    links.push(link);
  });

  if (headings.length) {
    contents.hidden = false;
    var wide = window.matchMedia('(min-width: 1200px)');
    function setTocMode() { toc.open = wide.matches; }
    setTocMode();
    if (wide.addEventListener) wide.addEventListener('change', setTocMode);
    else wide.addListener(setTocMode);

    function updateActiveHeading() {
      var active = -1;
      headings.forEach(function (heading, index) {
        if (heading.getBoundingClientRect().top <= 140) active = index;
      });
      links.forEach(function (link, index) {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', updateActiveHeading, { passive: true });
    updateActiveHeading();
  }

  var referencesHeading = content.querySelector('#references');
  var references = referencesHeading && referencesHeading.nextElementSibling;
  if (!references || references.tagName !== 'OL') return;

  var referenceList = document.querySelector('.post-reference-list');
  var referenceById = {};
  Array.prototype.forEach.call(references.children, function (reference, index) {
    var target = reference.querySelector('[id]');
    if (!target) return;
    referenceById[target.id] = { element: reference, number: index + 1 };
  });

  var notes = [];
  Array.prototype.forEach.call(content.querySelectorAll('a[href^="#"]'), function (citation) {
    if (references.contains(citation)) return;
    var id = decodeURIComponent(citation.getAttribute('href').slice(1));
    var reference = referenceById[id];
    if (!reference || reference.shown) return;
    reference.shown = true;

    var copy = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#' + encodeURIComponent(id);
    link.className = 'post-reference-number';
    link.textContent = '[' + reference.number + ']';
    link.setAttribute('aria-label', 'Full reference ' + reference.number);
    copy.appendChild(link);
    var author = reference.element.querySelector('strong');
    var title = reference.element.querySelector('em');
    if (author) copy.appendChild(document.createTextNode(' ' + author.textContent));
    if (title) {
      copy.appendChild(document.createTextNode(' · '));
      var titleText = document.createElement('em');
      titleText.textContent = title.textContent;
      var publicationLink = title.closest('a[href]');
      if (publicationLink) {
        var titleLink = document.createElement('a');
        titleLink.href = publicationLink.href;
        titleLink.appendChild(titleText);
        copy.appendChild(titleLink);
      } else {
        copy.appendChild(titleText);
      }
    }
    if (!author && !title) copy.appendChild(document.createTextNode(' ' + reference.element.textContent.trim()));
    referenceList.appendChild(copy);
    notes.push({ citation: citation, note: copy });
  });
  if (!notes.length) return;

  var sidebar = document.querySelector('.post-sidebar-references');
  sidebar.hidden = false;
  var pending = false;
  function positionNotes() {
    pending = false;
    if (window.getComputedStyle(sidebar).display === 'none') return;
    var sidebarTop = sidebar.getBoundingClientRect().top;
    var nextTop = 0;
    notes.forEach(function (entry) {
      var desiredTop = entry.citation.getBoundingClientRect().top - sidebarTop;
      var top = Math.max(desiredTop, nextTop);
      entry.note.style.top = top + 'px';
      nextTop = top + entry.note.offsetHeight + 12;
    });
  }
  function schedulePositioning() {
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(positionNotes);
    }
  }
  window.addEventListener('resize', schedulePositioning);
  window.addEventListener('load', schedulePositioning);
  if (window.ResizeObserver) new ResizeObserver(schedulePositioning).observe(content);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedulePositioning);
  schedulePositioning();
}());
