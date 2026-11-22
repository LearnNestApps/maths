// Older iPads (Safari before 13) have no pointer events. This turns touch and mouse events into
// pointerdown / pointermove / pointerup so dragging, the abacus and hold-to-open buttons still work.
if (typeof window !== 'undefined' && !window.PointerEvent) {
  let cap = null, touching = false;
  Element.prototype.setPointerCapture = function () { cap = this; };
  Element.prototype.releasePointerCapture = function () { cap = null; };
  Element.prototype.hasPointerCapture = function () { return cap === this; };
  const fire = (type, kind, pt, orig, target) => {
    if (!target) return;
    const ev = document.createEvent('Event'); ev.initEvent(type, true, true);
    ev.clientX = pt.clientX; ev.clientY = pt.clientY; ev.pageX = pt.pageX; ev.pageY = pt.pageY;
    ev.pointerId = kind === 'touch' ? pt.identifier : 1; ev.pointerType = kind; ev.button = 0; ev.buttons = type === 'pointerup' ? 0 : 1; ev.isPrimary = true;
    const pd = ev.preventDefault.bind(ev);
    // Stopping a move should stop the page scrolling while something is dragged.
    ev.preventDefault = () => { pd(); if (type === 'pointermove' && orig.cancelable) orig.preventDefault(); };
    target.dispatchEvent(ev);
  };
  const opt = { passive: false, capture: true };
  document.addEventListener('touchstart', e => { touching = true; fire('pointerdown', 'touch', e.changedTouches[0], e, e.target); }, opt);
  document.addEventListener('touchmove', e => { fire('pointermove', 'touch', e.changedTouches[0], e, cap || e.target); }, opt);
  const end = type => e => { fire(type, 'touch', e.changedTouches[0], e, cap || e.target); cap = null; setTimeout(() => { touching = false; }, 600); };
  document.addEventListener('touchend', end('pointerup'), opt);
  document.addEventListener('touchcancel', end('pointercancel'), opt);
  document.addEventListener('mousedown', e => { if (!touching) fire('pointerdown', 'mouse', e, e, e.target); }, true);
  document.addEventListener('mousemove', e => { if (!touching) fire('pointermove', 'mouse', e, e, cap || e.target); }, true);
  document.addEventListener('mouseup', e => { if (!touching) { fire('pointerup', 'mouse', e, e, cap || e.target); cap = null; } }, true);
}
