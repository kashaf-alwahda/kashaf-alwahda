// إصلاحات متقدمة للهواتف

// 1. منع التمرير عند فتح القائمة
function preventBodyScroll() {
  const nav = document.querySelector('nav');
  if (nav && nav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
}

// 2. إصلاح ارتفاع 100vh على الهواتف
function setRealViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 3. إصلاح مشاكل اللمس
function improveTouchUX() {
  // زيادة وقت الاستجابة للهواتف
  const links = document.querySelectorAll('a, button');
  links.forEach(link => {
    link.style.cursor = 'pointer';
    
    // منع اللمس المتعدد
    link.addEventListener('touchstart', function(e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // إضافة تأثير اللمس
    link.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    });
    
    link.addEventListener('touchend', function() {
      this.style.opacity = '1';
    });
  });
}

// 4. إصلاح مشاكل لوحة المفاتيح على الهواتف
function handleKeyboard() {
  const inputs = document.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      // تأخير التمرير لتجنب المشاكل
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  });
}

// 5. تحميل الصور المتأخر للهواتف
function lazyLoadMobileImages() {
  if ('IntersectionObserver' in window && window.innerWidth <= 768) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
  }
}

// تشغيل جميع الإصلاحات
document.addEventListener('DOMContentLoaded', function() {
  setRealViewportHeight();
  improveTouchUX();
  handleKeyboard();
  lazyLoadMobileImages();
  
  // تحديث ارتفاع العرض عند التغيير
  window.addEventListener('resize', setRealViewportHeight);
  window.addEventListener('orientationchange', setRealViewportHeight);
  
  // إصلاح القائمة
  const nav = document.querySelector('nav');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  
  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
      this.setAttribute('aria-expanded', nav.classList.contains('active'));
      preventBodyScroll();
    });
  }
});

// إصلاح لمتصفح Safari على iOS
if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
}

// تحسين أداء التمرير
if ('scrollBehavior' in document.documentElement.style) {
  document.documentElement.style.scrollBehavior = 'smooth';
}