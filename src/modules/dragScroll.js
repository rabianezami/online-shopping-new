// اجازه می‌دهد کاربر نوار افقی را با موس بکشد
export function enableDrag(slider) {
  let isDown = false, startX, scrollLeft;

  // موس: شروع کشیدن
  slider.addEventListener('mousedown', e => {
    isDown = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  // موس: پایان کشیدن / ترک عنصر
  slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('dragging'); });
  slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('dragging'); });

  // موس: حرکت و اسکرول
  slider.addEventListener('mousemove', e => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 2;
  });

  // تاچ: شروع کشیدن
  slider.addEventListener('touchstart', e => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  // تاچ: پایان کشیدن
  slider.addEventListener('touchend', () => { isDown = false; });

  // تاچ: حرکت و اسکرول
  slider.addEventListener('touchmove', e => {
    if(!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 2;
  });
}
