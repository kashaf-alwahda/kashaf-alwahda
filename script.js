
// === تهيئة التطبيق ===
document.addEventListener('DOMContentLoaded', function() {
  console.log('بدء تحميل التطبيق...');
  
  // توليد CSRF Token
  generateCSRFToken();
  
  // تحميل البيانات المحفوظة
  loadStoredData();
  
  // تهيئة إمكانية الوصول
  initAccessibility();
  
  // إظهار العناصر مع التمرير
  initScrollAnimations();
  
  // التحقق من دعم Web Share API
  checkWebShareSupport();
  
  // تهيئة تحقق حقل السن
  initAgeValidation();
  
  // إعداد إدارة الحالة المظلمة
  initTheme();
  
  // تهيئة القائمة المتنقلة
  setTimeout(initMobileMenu, 100);
  
  // ضبط عنوان المشاركة
  setTimeout(() => {
    const shareUrl = document.getElementById('share-url');
    if (shareUrl) {
      shareUrl.value = window.location.href;
    }
  }, 200);
});

// === دالة تحميل البيانات المحفوظة ===
function loadStoredData() {
  try {
    const savedData = localStorage.getItem('scoutSubmissions');
    if (savedData) {
      console.log('تم تحميل البيانات المحفوظة:', JSON.parse(savedData).length, 'طلبات');
    }
  } catch (error) {
    console.log('لا توجد بيانات محفوظة بعد');
  }
}

// === تهيئة إمكانية الوصول ===
function initAccessibility() {
  // إضافة أريا لايف للمناطق الديناميكية
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.setAttribute('aria-live', 'polite');
    formMessage.setAttribute('aria-atomic', 'true');
  }
  
  // تحسين التنقل باللوحة المفاتيح
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      closeShareModal();
    }
  });
  
  // إعلان تحميل الصفحة للمستخدمين ضعاف البصر
  setTimeout(() => {
    announceToScreenReader('تم تحميل موقع منظمة كشاف الوحدة المغربية بنجاح');
  }, 1000);
}

// === شاشة التحميل ===
window.addEventListener('load', function() {
  console.log('تم تحميل جميع الموارد');
  setTimeout(function() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(function() {
        loading.style.display = 'none';
        announceToScreenReader('تم تحميل الصفحة بنجاح');
      }, 500);
    }
  }, 800);
});

// === إعلان للمستخدمين ضعاف البصر ===
function announceToScreenReader(message) {
  const announcer = document.getElementById('aria-live-announcer') || createAriaLiveAnnouncer();
  announcer.textContent = message;
  setTimeout(() => announcer.textContent = '', 1000);
}

function createAriaLiveAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'aria-live-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);
  return announcer;
}

// === توليد CSRF Token ===
function generateCSRFToken() {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const csrfInput = document.getElementById('csrfToken');
  if (csrfInput) {
    csrfInput.value = token;
  }
  return token;
}

// === القائمة المتنقلة ===
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  
  if (mobileMenuBtn && nav) {
    // إخفاء القائمة الأصلية على الهواتف
    if (window.innerWidth <= 768) {
      nav.style.display = 'none';
    }
    
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      
      if (nav.style.display === 'flex' || nav.classList.contains('active')) {
        nav.style.display = 'none';
        nav.classList.remove('active');
      } else {
        nav.style.display = 'flex';
        nav.classList.add('active');
      }
      
      this.setAttribute('aria-label', 
        nav.style.display === 'flex' ? 'إغلاق القائمة' : 'فتح القائمة');
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          nav.style.display = 'none';
          nav.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.setAttribute('aria-label', 'فتح القائمة');
        }
      });
    });
    
    // إغلاق القائمة عند الضغط على ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (nav.style.display === 'flex' || nav.classList.contains('active'))) {
        nav.style.display = 'none';
        nav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'فتح القائمة');
      }
    });
  }
}

// === تهيئة السمة الداكنة ===
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  
  // تحميل السمة المحفوظة
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    toggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', savedTheme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
  }
  
  // إضافة حدث النقر
  toggle.addEventListener('click', () => {
    const body = document.body;
    const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', theme);
    toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
    localStorage.setItem('theme', theme);
    announceToScreenReader(`تم تفعيل الوضع ${theme === 'dark' ? 'الداكن' : 'الفاتح'}`);
  });
}

// === التحقق من دعم Web Share API ===
function checkWebShareSupport() {
  if (navigator.share) {
    console.log('Web Share API مدعوم');
  }
}

// === Animations ===
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // العناصر التي ستحصل على تأثير الظهور
  const elementsToAnimate = [
    '.hero-content h1',
    '.hero-content p',
    '.hero-content a',
    '.hero-image img',
    '.card',
    '.leader',
    '.join-form',
    '.gallery-item',
    '.gallery-btn',
    '.feature',
    '.benefit',
    '.contact-card'
  ];

  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  });
}

// === Header Scroll Effect ===
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    toggleBackToTopButton();
  });
}

// === زر العودة للأعلى ===
function toggleBackToTopButton() {
  const backToTopButton = document.getElementById('backToTop');
  if (backToTopButton) {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'flex';
    } else {
      backToTopButton.style.display = 'none';
    }
  }
}

// تهيئة زر العودة للأعلى
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainHeading = document.querySelector('h1');
    if (mainHeading) mainHeading.focus();
  });
}

// === تأثيرات الصورة الرئيسية ===
const heroImage = document.querySelector('.hero-main-image');
if (heroImage) {
  setTimeout(() => {
    heroImage.style.transition = 'opacity 1.5s ease, transform 0.8s ease';
    heroImage.style.opacity = '1';
  }, 500);
}

// === تهيئة تحقق حقل السن ===
function initAgeValidation() {
  const ageInput = document.getElementById('age');
  if (ageInput) {
    ageInput.addEventListener('input', function() {
      const age = parseInt(this.value) || 0;
      if (age < 6) {
        this.setCustomValidity('يجب أن يكون السن 6 سنوات على الأقل');
      } else if (age > 60) {
        this.setCustomValidity('يجب أن يكون السن 60 سنة على الأكثر');
      } else {
        this.setCustomValidity('');
      }
    });
  }
}

// === وظائف المشاركة ===
const shareBtn = document.getElementById('share-btn');
const shareModal = document.getElementById('share-modal');

if (shareBtn && shareModal) {
  shareBtn.addEventListener('click', function() {
    shareModal.style.display = 'flex';
    document.getElementById('share-url').focus();
    announceToScreenReader('تم فتح نافذة المشاركة');
  });
}

function closeShareModal() {
  const shareModal = document.getElementById('share-modal');
  if (shareModal) {
    shareModal.style.display = 'none';
    if (shareBtn) shareBtn.focus();
  }
}

function shareOnPlatform(platform) {
  const url = window.location.href;
  const title = 'منظمة كشاف الوحدة المغربية - انضم إلى رحلة بناء الوطن';
  const text = 'انضم إلى منظمة كشاف الوحدة المغربية لتكون جزءًا من جيل كشفي قيادي وملتزم!';
  
  let shareUrl = '';
  
  switch(platform) {
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=كشاف,مغربية,تربية`;
      break;
    case 'email':
      shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
      break;
    case 'sms':
      shareUrl = `sms:?body=${encodeURIComponent(text + '\n' + url)}`;
      break;
    case 'copy':
      copyShareLink();
      return;
    case 'more':
      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).catch(err => {
          console.log('Error sharing:', err);
        });
      } else {
        alert('ميزة المشاركة غير مدعومة في هذا المتصفح. يمكنك نسخ الرابط يدويًا.');
      }
      return;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=500');
  }
  
  announceToScreenReader(`تم فتح ${platform} للمشاركة`);
}

function copyShareLink() {
  const shareUrl = document.getElementById('share-url');
  if (!shareUrl) return;
  
  shareUrl.select();
  shareUrl.setSelectionRange(0, 99999);
  
  try {
    navigator.clipboard.writeText(shareUrl.value)
      .then(() => {
        showNotification('تم نسخ الرابط إلى الحافظة!', 'success');
      })
      .catch(() => {
        document.execCommand('copy');
        showNotification('تم نسخ الرابط إلى الحافظة!', 'success');
      });
  } catch (error) {
    document.execCommand('copy');
    showNotification('تم نسخ الرابط إلى الحافظة!', 'success');
  }
}

// === نموذج الانضمام ===
const joinForm = document.getElementById('joinForm');
if (joinForm) {
  joinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('تم النقر على زر الإرسال');
    
    // الحصول على القيم من الحقول
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const age = document.getElementById('age').value;
    const city = document.getElementById('city').value;
    const education = document.getElementById('education').value;
    const interests = document.getElementById('interests').value;
    const message = document.getElementById('message').value.trim();
    const agree = document.querySelector('input[name="agree"]:checked');
    
    console.log('قيم الحقول:', { name, email, phone, age, city, education, interests, message, agree: !!agree });
    
    // التحقق من جميع الحقول الإلزامية
    if (!name || !email || !phone || !age || !city || !education || !message || !agree) {
      showFormMessage('يرجى ملء جميع الحقول الإلزامية وتأكيد الموافقة على الشروط', 'error');
      
      // تحديد أول حقل فارغ للتركيز عليه
      if (!name) {
        document.getElementById('fullName').focus();
      } else if (!email) {
        document.getElementById('email').focus();
      } else if (!phone) {
        document.getElementById('phone').focus();
      } else if (!age) {
        document.getElementById('age').focus();
      } else if (!city) {
        document.getElementById('city').focus();
      } else if (!education) {
        document.getElementById('education').focus();
      } else if (!message) {
        document.getElementById('message').focus();
      } else if (!agree) {
        document.querySelector('input[name="agree"]').focus();
      }
      
      return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (!isValidEmail(email)) {
      showFormMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
      document.getElementById('email').focus();
      return;
    }
    
    // التحقق من صحة رقم الهاتف
    if (!isValidPhone(phone)) {
      showFormMessage('يرجى إدخال رقم هاتف صحيح (يبدأ بـ 06 أو 07)', 'error');
      document.getElementById('phone').focus();
      return;
    }
    
    // التحقق من السن
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 60) {
      showFormMessage('الرجاء إدخال سن بين 6 و 60 سنة', 'error');
      document.getElementById('age').focus();
      return;
    }
    
    // إنشاء كائن البيانات
    const submission = {
      name,
      email,
      phone,
      age: ageNum,
      city,
      education,
      interests: interests || 'غير محدد',
      message,
      date: new Date().toLocaleDateString('ar-MA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date().toLocaleTimeString('ar-MA'),
      timestamp: Date.now(),
      status: 'pending'
    };
    
    console.log('بيانات الطلب:', submission);
    
    // حفظ البيانات
    try {
      // سيتم التعامل مع هذا في admin.js
      if (typeof window.saveSubmission === 'function') {
        window.saveSubmission(submission);
      } else {
        // حفظ محلي إذا لم يتم تحميل admin.js
        saveSubmissionLocal(submission);
      }
      
      // إعادة تعيين الفورم
      this.reset();
      
      // عرض رسالة النجاح
      showFormMessage('🎉 تم إرسال طلبك بنجاح! سنتواصل معك قريباً.', 'success');
      
      // تمركز الصفحة على الرسالة
      const formMessage = document.getElementById('formMessage');
      if (formMessage) {
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // إعلام المستخدمين ضعاف البصر
      announceToScreenReader('تم إرسال طلب الانضمام بنجاح');
      
      // إرسال إشعار
      showNotification('طلب الانضمام تم إرساله بنجاح!', 'success');
      
      // إضافة تأثير بصري
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '✅ تم الإرسال';
        submitBtn.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
        
        setTimeout(() => {
          submitBtn.innerHTML = 'إرسال طلب الانضمام';
          submitBtn.style.background = 'linear-gradient(90deg, var(--blue), #004ad8)';
        }, 2000);
      }
      
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      showFormMessage('حدث خطأ في إرسال طلبك. يرجى المحاولة مرة أخرى.', 'error');
    }
  });
}

// دالة حفظ البيانات محلياً (بديل)
function saveSubmissionLocal(submission) {
  try {
    const existingData = JSON.parse(localStorage.getItem('scoutSubmissions') || '[]');
    existingData.push(submission);
    localStorage.setItem('scoutSubmissions', JSON.stringify(existingData));
    console.log('تم حفظ الطلب محلياً');
  } catch (error) {
    console.error('خطأ في الحفظ المحلي:', error);
  }
}

// تحسين دالة التحقق من رقم الهاتف
function isValidPhone(phone) {
  // إزالة المسافات والرموز
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[-\+\(\)]/g, '');
  
  // تحقق من أن الرقم يبدأ بـ 06 أو 07 ويتكون من 10 أرقام
  const phoneRegex = /^(06|07)[0-9]{8}$/;
  return phoneRegex.test(cleanPhone);
}

// تحسين دالة التحقق من البريد الإلكتروني
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// تحسين دالة عرض رسائل الفورم
function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.textContent = message;
    formMessage.className = `form-message form-${type}`;
    formMessage.style.display = 'block';
    
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// إضافة أنماط الرسوم المتحركة
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(-100%); opacity: 0; }
  }
`;
document.head.appendChild(animationStyles);

// === إغلاق النوافذ ===
function closeModal() {
  const adminModal = document.getElementById('admin-modal');
  if (adminModal) {
    adminModal.style.display = 'none';
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.focus();
  }
}

// === Debounce ===
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('scroll', debounce(toggleBackToTopButton, 10));

// === Service Worker ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// === تحسين تجربة الهواتف ===
window.addEventListener('resize', function() {
  const nav = document.querySelector('nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (window.innerWidth > 768) {
    // على الشاشات الكبيرة، إظهار القائمة دائمًا
    if (nav) {
      nav.style.display = 'flex';
      nav.classList.remove('active');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.style.display = 'none';
    }
  } else {
    // على الهواتف، إخفاء القائمة وإظهار زر القائمة
    if (nav) {
      nav.style.display = 'none';
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.style.display = 'block';
    }
  }
});

// تشغيل عند تحميل الصفحة للتحقق من حجم الشاشة
window.dispatchEvent(new Event('resize'));

// === تحسين أداء التمرير ===
let isScrolling;
window.addEventListener('scroll', function() {
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(function() {
    // تنفيذ العمليات بعد توقف التمرير
  }, 66);
}, false);

// === تحميل الصور الكسولة ===
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// === إصلاحات خاصة بالهواتف ===

// وظيفة لتعديل القائمة المتنقلة للهواتف
function adjustForMobile() {
  const nav = document.querySelector('nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const header = document.getElementById('header');
  
  if (window.innerWidth <= 768) {
    // على الهواتف
    if (nav) {
      nav.style.display = 'none';
      nav.classList.remove('active');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.style.display = 'block';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    if (header) {
      header.style.flexWrap = 'wrap';
      header.style.justifyContent = 'center';
    }
  } else {
    // على الشاشات الكبيرة
    if (nav) {
      nav.style.display = 'flex';
      nav.classList.remove('active');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.style.display = 'none';
    }
    if (header) {
      header.style.flexWrap = 'nowrap';
      header.style.justifyContent = 'space-between';
    }
  }
}

// تشغيل عند التحميل وعند تغيير الحجم
window.addEventListener('load', adjustForMobile);
window.addEventListener('resize', adjustForMobile);

// إغلاق القائمة عند النقر خارجها (للهواتف)
document.addEventListener('click', function(event) {
  const nav = document.querySelector('nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (window.innerWidth <= 768 && 
      nav && 
      nav.classList.contains('active') &&
      !nav.contains(event.target) && 
      !mobileMenuBtn.contains(event.target)) {
    nav.style.display = 'none';
    nav.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'فتح القائمة');
  }
});

// إصلاح مشكلة الزوم في حقول الإدخال على الهواتف
function preventZoomOnFocus() {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      if (window.innerWidth <= 768) {
        this.style.fontSize = '16px';
        this.style.transform = 'scale(1)';
      }
    });
    
    // إصلاح للآيفون لمنع التكبير التلقائي
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      input.addEventListener('touchstart', function() {
        this.style.fontSize = '16px';
      }, { passive: true });
    }
  });
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // تشغيل إصلاحات الهواتف
  adjustForMobile();
  preventZoomOnFocus();
  
  // إصلاح حجم الخط للهواتف
  if (window.innerWidth <= 768) {
    document.body.style.fontSize = '15px';
  }
});

// تحسين أداء التمرير على الهواتف
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
  if (window.innerWidth <= 768) {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    // إخفاء/إظهار الهيدر عند التمرير
    const header = document.getElementById('header');
    if (header) {
      if (st > lastScrollTop && st > 100) {
        // التمرير للأسفل
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.3s ease';
      } else {
        // التمرير للأعلى
        header.style.transform = 'translateY(0)';
      }
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }
}, { passive: true });

// إصلاح مشاكل اللمس على الأجهزة المحمولة
document.addEventListener('touchstart', function() {}, { passive: true });

console.log('تم تحميل script.js بنجاح');
