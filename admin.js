
// === متغيرات عامة ===
let submissions = [];
let acceptedSubmissions = [];
let rejectedSubmissions = [];
let deletedSubmissions = [];

// === إدارة البيانات ===
function loadStoredData() {
  try {
    submissions = JSON.parse(localStorage.getItem('scoutSubmissions')) || [];
    acceptedSubmissions = JSON.parse(localStorage.getItem('acceptedSubmissions')) || [];
    rejectedSubmissions = JSON.parse(localStorage.getItem('rejectedSubmissions')) || [];
    deletedSubmissions = JSON.parse(localStorage.getItem('deletedSubmissions')) || [];
    console.log('تم تحميل البيانات:', {
      submissions: submissions.length,
      accepted: acceptedSubmissions.length,
      rejected: rejectedSubmissions.length,
      deleted: deletedSubmissions.length
    });
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error);
    submissions = [];
    acceptedSubmissions = [];
    rejectedSubmissions = [];
    deletedSubmissions = [];
    saveAllData();
  }
}

function saveAllData() {
  try {
    localStorage.setItem('scoutSubmissions', JSON.stringify(submissions));
    localStorage.setItem('acceptedSubmissions', JSON.stringify(acceptedSubmissions));
    localStorage.setItem('rejectedSubmissions', JSON.stringify(rejectedSubmissions));
    localStorage.setItem('deletedSubmissions', JSON.stringify(deletedSubmissions));
    console.log('تم حفظ البيانات بنجاح');
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    showNotification('حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى.', 'error');
  }
}

// دالة حفظ البيانات للاستخدام الخارجي
window.saveSubmission = function(submission) {
  submissions.push(submission);
  saveAllData();
};

// === Admin Logic ===
document.addEventListener('DOMContentLoaded', function() {
  const adminBtn = document.getElementById('admin-btn');
  const adminModal = document.getElementById('admin-modal');
  
  if (adminBtn && adminModal) {
    adminBtn.addEventListener('click', () => {
      const adminLogin = document.getElementById('admin-login');
      const adminDashboard = document.getElementById('admin-dashboard');
      
      if (adminLogin && adminDashboard) {
        adminLogin.style.display = 'block';
        adminDashboard.style.display = 'none';
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
        adminModal.style.display = 'flex';
        document.getElementById('admin-username').focus();
      }
    });
  }
});

function loginAdmin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();
  
  if (username === 'akela1' && password === 'makoly2026') {
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    if (adminLogin && adminDashboard) {
      adminLogin.style.display = 'none';
      adminDashboard.style.display = 'block';
      updateAdminStats();
      renderAllLists();
      announceToScreenReader('تم تسجيل الدخول بنجاح إلى لوحة التحكم');
    }
  } else {
    alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
    document.getElementById('admin-password').focus();
  }
}

function updateAdminStats() {
  const total = submissions.length + acceptedSubmissions.length + rejectedSubmissions.length + deletedSubmissions.length;
  
  const totalElem = document.getElementById('total-submissions');
  const pendingElem = document.getElementById('pending-submissions');
  const acceptedElem = document.getElementById('accepted-submissions');
  const rejectedElem = document.getElementById('rejected-submissions');
  
  if (totalElem) totalElem.textContent = total;
  if (pendingElem) pendingElem.textContent = submissions.length;
  if (acceptedElem) acceptedElem.textContent = acceptedSubmissions.length;
  if (rejectedElem) rejectedElem.textContent = rejectedSubmissions.length;
}

function switchTab(tabName) {
  // إخفاء جميع التبويبات
  document.querySelectorAll('.admin-tab-content').forEach(tab => {
    tab.classList.remove('active');
    tab.hidden = true;
  });
  
  // إلغاء تفعيل جميع أزرار التبويب
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  
  // إظهار التبويب المحدد
  const targetTab = document.getElementById(tabName + '-tab');
  if (targetTab) {
    targetTab.classList.add('active');
    targetTab.hidden = false;
  }
  
  // تفعيل زر التبويب
  event.target.classList.add('active');
  event.target.setAttribute('aria-selected', 'true');
  
  // عرض المحتوى المناسب
  if (tabName === 'pending') renderPendingList();
  if (tabName === 'accepted') renderAcceptedList();
  if (tabName === 'rejected') renderRejectedList();
  if (tabName === 'deleted') renderDeletedList();
  
  if (targetTab) targetTab.focus();
}

function renderAllLists() {
  renderPendingList();
  renderAcceptedList();
  renderRejectedList();
  renderDeletedList();
}

function renderPendingList() {
  const pendingList = document.getElementById('pending-list');
  if (!pendingList) return;
  
  pendingList.innerHTML = '';
  
  if (submissions.length === 0) {
    pendingList.innerHTML = '<div style="text-align:center; color:#777; padding:30px; font-size:16px;">لا توجد طلبات قيد المراجعة.</div>';
  } else {
    submissions.forEach((entry, index) => {
      const item = createSubmissionItem(entry, index, 'pending');
      pendingList.appendChild(item);
    });
  }
}

function renderAcceptedList() {
  const acceptedList = document.getElementById('accepted-list');
  if (!acceptedList) return;
  
  acceptedList.innerHTML = '';
  
  if (acceptedSubmissions.length === 0) {
    acceptedList.innerHTML = '<div style="text-align:center; color:#777; padding:30px; font-size:16px;">لا توجد طلبات مقبولة.</div>';
  } else {
    acceptedSubmissions.forEach((entry, index) => {
      const item = createSubmissionItem(entry, index, 'accepted');
      acceptedList.appendChild(item);
    });
  }
}

function renderRejectedList() {
  const rejectedList = document.getElementById('rejected-list');
  if (!rejectedList) return;
  
  rejectedList.innerHTML = '';
  
  if (rejectedSubmissions.length === 0) {
    rejectedList.innerHTML = '<div style="text-align:center; color:#777; padding:30px; font-size:16px;">لا توجد طلبات مرفوضة.</div>';
  } else {
    rejectedSubmissions.forEach((entry, index) => {
      const item = createSubmissionItem(entry, index, 'rejected');
      rejectedList.appendChild(item);
    });
  }
}

function renderDeletedList() {
  const deletedList = document.getElementById('deleted-list');
  if (!deletedList) return;
  
  deletedList.innerHTML = '';
  
  if (deletedSubmissions.length === 0) {
    deletedList.innerHTML = '<div style="text-align:center; color:#777; padding:30px; font-size:16px;">سجل الحذف فارغ.</div>';
  } else {
    deletedSubmissions.forEach((entry, index) => {
      const item = createSubmissionItem(entry, index, 'deleted');
      deletedList.appendChild(item);
    });
  }
}

function createSubmissionItem(entry, index, status) {
  const item = document.createElement('div');
  item.className = 'submission-item';
  item.setAttribute('role', 'article');
  
  let statusBadge = '';
  let actions = '';
  
  switch(status) {
    case 'pending':
      statusBadge = '<span class="submission-status status-pending">قيد المراجعة</span>';
      actions = `
        <div class="admin-buttons">
          <button class="admin-btn accept-btn" onclick="acceptSubmission(${index})" aria-label="قبول طلب ${entry.name}">✅ قبول</button>
          <button class="admin-btn reject-btn" onclick="rejectSubmission(${index})" aria-label="رفض طلب ${entry.name}">❌ رفض</button>
          <button class="admin-btn delete-btn" onclick="deleteSubmission(${index}, 'pending')" aria-label="حذف طلب ${entry.name}">🗑️ حذف</button>
        </div>
      `;
      break;
    case 'accepted':
      statusBadge = '<span class="submission-status status-accepted">مقبول</span>';
      actions = `
        <div class="admin-buttons">
          <button class="admin-btn delete-btn" onclick="deleteFromAccepted(${index})" aria-label="حذف نهائي لطلب ${entry.name}">🗑️ حذف نهائي</button>
        </div>
      `;
      break;
    case 'rejected':
      statusBadge = '<span class="submission-status status-rejected">مرفوض</span>';
      actions = `
        <div class="admin-buttons">
          <button class="admin-btn restore-btn" onclick="restoreSubmission(${index}, 'rejected')" aria-label="استعادة طلب ${entry.name}">↩️ استعادة</button>
          <button class="admin-btn delete-btn" onclick="deleteFromRejected(${index})" aria-label="حذف نهائي لطلب ${entry.name}">🗑️ حذف نهائي</button>
        </div>
      `;
      break;
    case 'deleted':
      statusBadge = '<span class="submission-status status-deleted">محذوف</span>';
      actions = `
        <div class="admin-buttons">
          <button class="admin-btn restore-btn" onclick="restoreSubmission(${index}, 'deleted')" aria-label="استعادة طلب ${entry.name}">↩️ استعادة</button>
          <button class="admin-btn delete-btn" onclick="permanentDelete(${index})" aria-label="حذف نهائي ودائم لطلب ${entry.name}">🗑️ حذف دائم</button>
        </div>
      `;
      break;
  }
  
  // عرض السن بشكل مميز
  const ageDisplay = entry.age ? `<span class="age-display">${entry.age} سنة</span>` : 'غير محدد';
  
  item.innerHTML = `
    <div class="submission-meta">
      <div>
        <strong style="font-size:18px;">${entry.name}</strong> - ${entry.email}
        ${statusBadge}
      </div>
      <div class="submission-actions">
        ${actions}
      </div>
    </div>
    <p><strong>📞 الهاتف:</strong> ${entry.phone}</p>
    <p><strong>🎂 السن:</strong> ${ageDisplay}</p>
    <p><strong>🏙️ المدينة:</strong> ${entry.city || 'غير محددة'}</p>
    <p><strong>🎓 التعليم:</strong> ${entry.education || 'غير محدد'}</p>
    <p><strong>💬 الرسالة:</strong> ${entry.message}</p>
    <p><strong>📅 التاريخ:</strong> ${entry.date || new Date().toLocaleDateString('ar-MA')}</p>
  `;
  
  return item;
}

function acceptSubmission(index) {
  if (confirm('هل أنت متأكد من قبول هذا الطلب؟')) {
    const acceptedSubmission = submissions[index];
    acceptedSubmission.actionDate = new Date().toLocaleDateString('ar-MA');
    acceptedSubmission.actionTime = new Date().toLocaleTimeString('ar-MA');
    acceptedSubmissions.push(acceptedSubmission);
    
    submissions.splice(index, 1);
    saveAllData();
    
    updateAdminStats();
    renderAllLists();
    
    alert('تم قبول الطلب بنجاح!');
    announceToScreenReader('تم قبول الطلب بنجاح');
  }
}

function rejectSubmission(index) {
  if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
    const rejectedSubmission = submissions[index];
    rejectedSubmission.actionDate = new Date().toLocaleDateString('ar-MA');
    rejectedSubmission.actionTime = new Date().toLocaleTimeString('ar-MA');
    rejectedSubmissions.push(rejectedSubmission);
    
    submissions.splice(index, 1);
    saveAllData();
    
    updateAdminStats();
    renderAllLists();
    
    alert('تم رفض الطلب بنجاح!');
    announceToScreenReader('تم رفض الطلب بنجاح');
  }
}

function deleteSubmission(index, from) {
  if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
    const deletedSubmission = submissions[index];
    deletedSubmission.actionDate = new Date().toLocaleDateString('ar-MA');
    deletedSubmission.actionTime = new Date().toLocaleTimeString('ar-MA');
    deletedSubmission.deletedFrom = from;
    deletedSubmissions.push(deletedSubmission);
    
    submissions.splice(index, 1);
    saveAllData();
    
    updateAdminStats();
    renderAllLists();
    
    alert('تم حذف الطلب بنجاح!');
    announceToScreenReader('تم حذف الطلب بنجاح');
  }
}

function deleteFromAccepted(index) {
  if (confirm('هل أنت متأكد من الحذف النهائي لهذا الطلب المقبول؟')) {
    const deletedSubmission = acceptedSubmissions[index];
    deletedSubmission.actionDate = new Date().toLocaleDateString('ar-MA');
    deletedSubmission.actionTime = new Date().toLocaleTimeString('ar-MA');
    deletedSubmission.deletedFrom = 'accepted';
    deletedSubmissions.push(deletedSubmission);
    
    acceptedSubmissions.splice(index, 1);
    saveAllData();
    
    updateAdminStats();
    renderAllLists();
    
    alert('تم الحذف النهائي للطلب!');
    announceToScreenReader('تم الحذف النهائي للطلب');
  }
}

function deleteFromRejected(index) {
  if (confirm('هل أنت متأكد من الحذف النهائي لهذا الطلب المرفوض؟')) {
    const deletedSubmission = rejectedSubmissions[index];
    deletedSubmission.actionDate = new Date().toLocaleDateString('ar-MA');
    deletedSubmission.actionTime = new Date().toLocaleTimeString('ar-MA');
    deletedSubmission.deletedFrom = 'rejected';
    deletedSubmissions.push(deletedSubmission);
    
    rejectedSubmissions.splice(index, 1);
    saveAllData();
    
    updateAdminStats();
    renderAllLists();
    
    alert('تم الحذف النهائي للطلب!');
    announceToScreenReader('تم الحذف النهائي للطلب');
  }
}

function restoreSubmission(index, from) {
  if (confirm('هل أنت متأكد من استعادة هذا الطلب؟')) {
    let restoredSubmission;
    
    if (from === 'rejected') {
      restoredSubmission = rejectedSubmissions[index];
      rejectedSubmissions.splice(index, 1);
    } else if (from === 'deleted') {
      restoredSubmission = deletedSubmissions[index];
      deletedSubmissions.splice(index, 1);
    }
    
    if (restoredSubmission) {
      restoredSubmission.restoredDate = new Date().toLocaleDateString('ar-MA');
      restoredSubmission.restoredTime = new Date().toLocaleTimeString('ar-MA');
      submissions.push(restoredSubmission);
      saveAllData();
      
      updateAdminStats();
      renderAllLists();
      
      alert('تم استعادة الطلب بنجاح!');
      announceToScreenReader('تم استعادة الطلب بنجاح');
    }
  }
}

function permanentDelete(index) {
  if (confirm('هل أنت متأكد من الحذف النهائي والدائم لهذا الطلب؟ لا يمكن التراجع عن هذه العملية.')) {
    deletedSubmissions.splice(index, 1);
    saveAllData();
    
    updateAdminStats();
    renderAllLists();
    
    alert('تم الحذف النهائي والدائم للطلب!');
    announceToScreenReader('تم الحذف النهائي والدائم للطلب');
  }
}

// === وظائف الطباعة والتصدير ===
function printSubmissions() {
  const printWindow = window.open('', '_blank');
  const currentDate = new Date().toLocaleDateString('ar-MA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let printContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>تقرير طلبات الانضمام - منظمة كشاف الوحدة المغربية</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        body { 
          font-family: 'Cairo', sans-serif; 
          padding: 20px; 
          color: #333; 
          background: #f5f7fa;
        }
        .print-container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .print-header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 3px solid #0066ff; 
          padding-bottom: 20px; 
        }
        .print-header h1 { 
          color: #001a4d; 
          margin: 0; 
          font-size: 28px;
        }
        .print-header p { 
          color: #666; 
          margin: 5px 0; 
          font-size: 16px;
        }
        .stats { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 15px; 
          margin-bottom: 30px; 
        }
        .stat-box { 
          background: #f4f7ff; 
          padding: 20px; 
          border-radius: 10px; 
          text-align: center; 
          border: 1px solid #ddd; 
        }
        .stat-number { 
          font-size: 24px; 
          font-weight: bold; 
          color: #0066ff; 
        }
        .stat-label { 
          font-size: 14px; 
          color: #555; 
        }
        .section-title {
          color: #001a4d;
          border-bottom: 2px solid #ff7a00;
          padding-bottom: 10px;
          margin-top: 30px;
          font-size: 22px;
        }
        .table-container { 
          overflow-x: auto; 
          margin-bottom: 20px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
          font-size: 14px;
        }
        th { 
          background: #0066ff; 
          color: white; 
          padding: 12px; 
          text-align: right; 
          border: 1px solid #ddd;
        }
        td { 
          padding: 10px; 
          border: 1px solid #ddd; 
          text-align: right; 
        }
        tr:nth-child(even) { 
          background: #f9f9f9; 
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 2px dashed #ddd; 
          color: #777; 
          font-size: 14px; 
        }
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: block;
        }
        @media print {
          body { 
            padding: 0; 
            background: white;
          }
          .print-container {
            box-shadow: none;
            padding: 15px;
          }
          .no-print { display: none; }
          .print-btn { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="print-header">
          <div class="logo">👨‍✈️</div>
          <h1>تقرير طلبات الانضمام</h1>
          <p>منظمة كشاف الوحدة المغربية</p>
          <p>تاريخ التقرير: ${currentDate}</p>
        </div>
        
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">${submissions.length}</div>
            <div class="stat-label">طلبات قيد المراجعة</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${acceptedSubmissions.length}</div>
            <div class="stat-label">طلبات مقبولة</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${rejectedSubmissions.length}</div>
            <div class="stat-label">طلبات مرفوضة</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${deletedSubmissions.length}</div>
            <div class="stat-label">طلبات محذوفة</div>
          </div>
        </div>
        
        <div class="table-container">
          <h3 class="section-title">الطلبات قيد المراجعة (${submissions.length})</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>السن</th>
                <th>المدينة</th>
                <th>تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  if (submissions.length > 0) {
    submissions.forEach((entry, index) => {
      printContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${entry.name}</td>
          <td>${entry.email}</td>
          <td>${entry.phone}</td>
          <td>${entry.age || 'غير محدد'}</td>
          <td>${entry.city || 'غير محددة'}</td>
          <td>${entry.date}</td>
        </tr>
      `;
    });
  } else {
    printContent += `
      <tr>
        <td colspan="7" style="text-align:center; padding:20px;">لا توجد طلبات قيد المراجعة</td>
      </tr>
    `;
  }
  
  printContent += `
            </tbody>
          </table>
        </div>
        
        <div class="table-container">
          <h3 class="section-title">الطلبات المقبولة (${acceptedSubmissions.length})</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>تاريخ القبول</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  if (acceptedSubmissions.length > 0) {
    acceptedSubmissions.forEach((entry, index) => {
      printContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${entry.name}</td>
          <td>${entry.email}</td>
          <td>${entry.phone}</td>
          <td>${entry.actionDate || entry.date}</td>
          <td>تم القبول في ${entry.actionTime || ''}</td>
        </tr>
      `;
    });
  } else {
    printContent += `
      <tr>
        <td colspan="6" style="text-align:center; padding:20px;">لا توجد طلبات مقبولة</td>
      </tr>
    `;
  }
  
  printContent += `
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>تم إنشاء هذا التقرير تلقائياً من نظام إدارة منظمة كشاف الوحدة المغربية</p>
          <p>© ${new Date().getFullYear()} - منظمة كشاف الوحدة المغربية</p>
          <p>📞 للتواصل: info@kashaf-alwahda.ma</p>
        </div>
        
        <div class="no-print" style="text-align:center; margin-top:30px;">
          <button onclick="window.print()" class="print-btn" style="background:#0066ff; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer; font-weight:bold; margin:10px; font-size:16px;">🖨️ طباعة التقرير</button>
          <button onclick="window.close()" style="background:#dc3545; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer; font-weight:bold; margin:10px; font-size:16px;">❌ إغلاق النافذة</button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  announceToScreenReader('تم فتح نافذة الطباعة');
}

function exportSubmissions() {
  const allData = {
    metadata: {
      organization: "منظمة كشاف الوحدة المغربية",
      exportDate: new Date().toLocaleDateString('ar-MA'),
      exportTime: new Date().toLocaleTimeString('ar-MA'),
      totalCount: submissions.length + acceptedSubmissions.length + rejectedSubmissions.length + deletedSubmissions.length
    },
    pending: submissions,
    accepted: acceptedSubmissions,
    rejected: rejectedSubmissions,
    deleted: deletedSubmissions
  };
  
  const dataStr = JSON.stringify(allData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const downloadLink = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadLink.href = URL.createObjectURL(dataBlob);
  downloadLink.download = `طلبات_كشاف_الوحدة_${dateStr}.json`;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  showNotification('تم تصدير البيانات بنجاح!', 'success');
}

// تصدير الدوال للاستخدام الخارجي
window.loginAdmin = loginAdmin;
window.switchTab = switchTab;
window.acceptSubmission = acceptSubmission;
window.rejectSubmission = rejectSubmission;
window.deleteSubmission = deleteSubmission;
window.deleteFromAccepted = deleteFromAccepted;
window.deleteFromRejected = deleteFromRejected;
window.restoreSubmission = restoreSubmission;
window.permanentDelete = permanentDelete;
window.printSubmissions = printSubmissions;
window.exportSubmissions = exportSubmissions;
window.closeModal = closeModal;
window.closeShareModal = closeShareModal;
window.shareOnPlatform = shareOnPlatform;
window.copyShareLink = copyShareLink;

// تحميل البيانات عند بدء التشغيل
loadStoredData();
