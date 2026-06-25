/**
 * SBT Jobs - Admin Panel Controller (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.location.pathname.includes('admin.html')) return;

  const db = window.SBT_DB;
  const auth = window.SBT_AUTH;
  if (!db || !auth) return;

  // Validate session on page load
  const session = auth.checkSession();
  document.getElementById('admin-email-display').textContent = session.email;

  // Hook up Logout Trigger
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => auth.logout());
  }

  // State Management
  let jobs = [];
  let applications = [];
  let messages = [];
  let activeTab = 'jobs';

  // Modal elements
  const jobModal = document.getElementById('job-modal');
  const jobForm = document.getElementById('job-form');
  const addJobBtn = document.getElementById('add-job-btn');
  const closeJobModalBtn = document.getElementById('close-job-modal');
  
  // App detail screening modal elements
  const appModal = document.getElementById('app-modal');
  const closeAppModalBtn = document.getElementById('close-app-modal');

  // Form fields
  const fId = document.getElementById('job-form-id');
  const fTitle = document.getElementById('job-form-title');
  const fCompany = document.getElementById('job-form-company');
  const fLocation = document.getElementById('job-form-location');
  const fSalary = document.getElementById('job-form-salary');
  const fCategory = document.getElementById('job-form-category');
  const fJobType = document.getElementById('job-form-type');
  const fExperience = document.getElementById('job-form-experience');
  const fDeadline = document.getElementById('job-form-deadline');
  const fShortDesc = document.getElementById('job-form-shortdesc');
  const fDescription = document.getElementById('job-form-description');
  const fRequirements = document.getElementById('job-form-requirements');
  const fBenefits = document.getElementById('job-form-benefits');
  const fFeatured = document.getElementById('job-form-featured');
  const fStatus = document.getElementById('job-form-status');

  // Fetch data on page load
  const loadDashboardData = async () => {
    jobs = await db.getJobs();
    applications = await db.getApplications();
    messages = await db.getContactMessages();

    // Render Stats
    document.getElementById('stat-jobs-count').textContent = jobs.length;
    document.getElementById('stat-apps-count').textContent = applications.length;
    document.getElementById('stat-new-count').textContent = applications.filter(a => a.status === 'New').length;
    document.getElementById('stat-messages-count').textContent = messages.length;

    renderActiveTab();
  };

  const renderActiveTab = () => {
    if (activeTab === 'jobs') {
      renderJobsTab();
    } else if (activeTab === 'applications') {
      renderApplicationsTab();
    } else if (activeTab === 'messages') {
      renderMessagesTab();
    }
  };

  // Switch tabs
  const tabs = document.querySelectorAll('.admin-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      renderActiveTab();
    });
  });

  // --- RENDER JOBS TAB ---
  const renderJobsTab = () => {
    const container = document.getElementById('admin-tab-content');
    container.innerHTML = `
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Vacancy Details</th>
              <th>Location & Salary</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Featured</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-jobs-tbody"></tbody>
        </table>
      </div>
    `;

    const tbody = document.getElementById('admin-jobs-tbody');
    jobs.forEach(job => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span style="font-weight: 800; color: #0f172a; display: block; font-size: 0.9rem;">${job.title}</span>
          <span style="font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-top: 4px;">${job.category}</span>
        </td>
        <td>
          <span style="color: #475569; display: block;">📍 ${job.location}</span>
          <span style="font-weight: 700; color: #1e3a8a; display: block; margin-top: 2px;">${job.salary}</span>
        </td>
        <td style="text-align: center;">
          <button class="toggle-status-btn" data-id="${job.id}" style="font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; background: ${job.status === 'active' ? '#ecfdf5' : '#f1f5f9'}; color: ${job.status === 'active' ? '#047857' : '#94a3b8'}; border: 1px solid ${job.status === 'active' ? '#d1fae5' : '#e2e8f0'}">
            ${job.status === 'active' ? 'Active' : 'Draft'}
          </button>
        </td>
        <td style="text-align: center;">
          <button class="toggle-featured-btn" data-id="${job.id}" style="color: ${job.featured ? '#d97706' : '#cbd5e1'}">
            ★
          </button>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: right;">
            <button class="btn-admin-action edit-job-btn" data-id="${job.id}">Edit</button>
            <button class="btn-admin-action btn-admin-danger delete-job-btn" data-id="${job.id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Hook listeners
    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const job = jobs.find(j => j.id === id);
        if (job) {
          job.status = job.status === 'active' ? 'inactive' : 'active';
          await db.saveJob(job);
          loadDashboardData();
        }
      });
    });

    tbody.querySelectorAll('.toggle-featured-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const job = jobs.find(j => j.id === id);
        if (job) {
          job.featured = !job.featured;
          await db.saveJob(job);
          loadDashboardData();
        }
      });
    });

    tbody.querySelectorAll('.edit-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const job = jobs.find(j => j.id === id);
        if (job) {
          fId.value = job.id;
          fTitle.value = job.title;
          fCompany.value = job.company;
          fLocation.value = job.location;
          fSalary.value = job.salary;
          fCategory.value = job.category;
          fJobType.value = job.job_type;
          fExperience.value = job.experience;
          fDeadline.value = job.deadline;
          fShortDesc.value = job.short_description;
          fDescription.value = job.description;
          fRequirements.value = job.requirements;
          fBenefits.value = job.benefits;
          fFeatured.checked = job.featured;
          fStatus.value = job.status;

          document.getElementById('modal-title').textContent = 'Modify Job Posting';
          jobModal.style.display = 'flex';
        }
      });
    });

    tbody.querySelectorAll('.delete-job-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you absolutely sure you want to delete this job listing?')) {
          await db.deleteJob(id);
          loadDashboardData();
        }
      });
    });
  };

  // --- RENDER APPLICATIONS TAB ---
  const renderApplicationsTab = () => {
    const container = document.getElementById('admin-tab-content');
    container.innerHTML = `
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Candidate details</th>
              <th>Applied Vacancy</th>
              <th>Expected Salary</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: right;">View CV</th>
            </tr>
          </thead>
          <tbody id="admin-apps-tbody"></tbody>
        </table>
      </div>
    `;

    const tbody = document.getElementById('admin-apps-tbody');
    if (applications.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 24px;">No applications submitted yet.</td></tr>';
      return;
    }

    applications.forEach(app => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span style="font-weight: 800; color: #0f172a; display: block; font-size: 0.9rem;">${app.full_name}</span>
          <span style="font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-top: 4px;">${app.nationality} • Exp: ${app.experience_years} Years</span>
        </td>
        <td>
          <span style="color: #475569; display: block; font-weight: 600;">${app.position_applied}</span>
          <span style="font-size: 0.65rem; color: #94a3b8; display: block; margin-top: 2px;">${new Date(app.created_at).toLocaleDateString()}</span>
        </td>
        <td style="font-weight: 700; color: #1e3a8a;">
          SAR ${app.expected_salary.toLocaleString()}
        </td>
        <td style="text-align: center;">
          <select class="change-status-select" data-id="${app.id}" style="font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; background: #fff; border: 1px solid #cbd5e1; outline: none; cursor: pointer;">
            <option value="New" ${app.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
            <option value="Hired" ${app.status === 'Hired' ? 'selected' : ''}>Hired</option>
            <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td style="text-align: right;">
          <button class="btn-admin-action view-candidate-btn" data-id="${app.id}">Screen</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.change-status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const id = sel.getAttribute('data-id');
        const stat = sel.value;
        await db.updateApplicationStatus(id, stat);
        loadDashboardData();
      });
    });

    tbody.querySelectorAll('.view-candidate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const app = applications.find(a => a.id === id);
        if (app) {
          document.getElementById('app-det-name').textContent = app.full_name;
          document.getElementById('app-det-nationality').textContent = app.nationality;
          document.getElementById('app-det-experience').textContent = `${app.experience_years} Years`;
          document.getElementById('app-det-phone').textContent = app.phone;
          document.getElementById('app-det-phone').href = `tel:${app.phone}`;
          document.getElementById('app-det-email').textContent = app.email;
          document.getElementById('app-det-email').href = `mailto:${app.email}`;
          document.getElementById('app-det-city').textContent = app.current_city;
          document.getElementById('app-det-salary').textContent = `SAR ${app.expected_salary.toLocaleString()}`;
          document.getElementById('app-det-message').textContent = app.message || 'No cover note provided.';
          
          const cvLink = document.getElementById('app-det-cv-link');
          if (app.cv_url) {
            cvLink.href = app.cv_url;
            cvLink.style.display = 'inline-flex';
          } else {
            cvLink.style.display = 'none';
          }

          appModal.style.display = 'flex';
        }
      });
    });
  };

  // --- RENDER MESSAGES TAB ---
  const renderMessagesTab = () => {
    const container = document.getElementById('admin-tab-content');
    container.innerHTML = `<div id="messages-list-panel" class="space-y-4"></div>`;
    const panel = document.getElementById('messages-list-panel');

    if (messages.length === 0) {
      panel.innerHTML = '<p style="text-align: center; color: #94a3b8; font-size: 0.8rem; padding: 24px; background: #fff; border-radius: 12px; border: 1px solid var(--border-light)">No customer contact submissions yet.</p>';
      return;
    }

    messages.forEach(msg => {
      const card = document.createElement('div');
      card.style.cssText = 'background: #fff; border-radius: 12px; border: 1px solid var(--border-light); padding: 24px; margin-bottom: 16px;';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
          <div>
            <h4 style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">${msg.name}</h4>
            <p style="font-size: 0.7rem; color: #64748b; margin-top: 2px;">Email: ${msg.email} | Phone: ${msg.phone}</p>
          </div>
          <span style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; font-weight: 600;">${new Date(msg.created_at).toLocaleString()}</span>
        </div>
        <h5 style="font-size: 0.75rem; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 6px;">Subject: ${msg.subject}</h5>
        <p style="font-size: 0.75rem; color: #475569; white-space: pre-line; line-height: 1.5;">${msg.message}</p>
      `;
      panel.appendChild(card);
    });
  };

  // --- SAVE JOB SUBMISSION HANDLER ---
  if (jobForm) {
    jobForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const jobPayload = {
        id: fId.value || 'job-' + Date.now().toString(),
        title: fTitle.value,
        company: fCompany.value,
        location: fLocation.value,
        salary: fSalary.value,
        category: fCategory.value,
        job_type: fJobType.value,
        experience: fExperience.value,
        short_description: fShortDesc.value,
        description: fDescription.value,
        requirements: fRequirements.value,
        benefits: fBenefits.value,
        featured: fFeatured.checked,
        status: fStatus.value,
        posted_at: new Date().toISOString(),
        deadline: fDeadline.value
      };

      await db.saveJob(jobPayload);
      jobModal.style.display = 'none';
      loadDashboardData();
    });
  }

  // --- MODAL CONTROLS ---
  if (addJobBtn) addJobBtn.addEventListener('click', handleAddJobClick);
  if (closeJobModalBtn) closeJobModalBtn.addEventListener('click', () => jobModal.style.display = 'none');
  if (closeAppModalBtn) closeAppModalBtn.addEventListener('click', () => appModal.style.display = 'none');

  function handleAddJobClick() {
    fId.value = '';
    fTitle.value = '';
    fCompany.value = 'Shama Al Bayan Trading (SBT Services)';
    fLocation.value = 'Riyadh, Saudi Arabia';
    fSalary.value = '';
    fCategory.value = 'Safety & HSE';
    fJobType.value = 'Full-time';
    fExperience.value = '3+ Years';
    fShortDesc.value = '';
    fDescription.value = '';
    fRequirements.value = '• Certified NEBOSH/OSHA\n• Valid driving licence';
    fBenefits.value = '• Shared accommodation\n• Healthcare insurance\n• Overtime allowances';
    fFeatured.checked = false;
    fStatus.value = 'active';

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);
    fDeadline.value = futureDate.toISOString().split('T')[0];

    document.getElementById('modal-title').textContent = 'Post New Job Vacancy';
    jobModal.style.display = 'flex';
  }

  // Window clicks to close modals
  window.addEventListener('click', (e) => {
    if (e.target === jobModal) jobModal.style.display = 'none';
    if (e.target === appModal) appModal.style.display = 'none';
  });

  // Initial load
  loadDashboardData();
});
