/**
 * SBT Jobs - Public Jobs Directory Logic (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const jobContainer = document.getElementById('job-list-container');
  if (!jobContainer && !window.location.pathname.includes('job-details.html')) return;

  const db = window.SBT_DB;
  if (!db) return;

  // Retrieve all active jobs
  const allJobs = await db.getJobs();
  const activeJobs = allJobs.filter(j => j.status === 'active');

  // Handle URL query parameters for pre-filled search
  const urlParams = new URLSearchParams(window.location.search);
  const qKeyword = urlParams.get('keyword') || '';
  const qCategory = urlParams.get('category') || '';
  const qLocation = urlParams.get('location') || '';
  const qJobId = urlParams.get('id') || '';

  // --- JOB DETAILS SPECIFIC RENDERING ---
  if (window.location.pathname.includes('job-details.html')) {
    const job = activeJobs.find(j => j.id === qJobId) || activeJobs[0];
    if (!job) return;

    // Populate Job details on DOM
    document.getElementById('det-title').textContent = job.title;
    document.getElementById('det-company').textContent = job.company;
    document.getElementById('det-location').textContent = job.location;
    document.getElementById('det-salary').textContent = job.salary.includes('SAR') ? job.salary : `SAR ${job.salary}`;
    document.getElementById('det-experience').textContent = job.experience;
    document.getElementById('det-deadline').textContent = job.deadline;
    document.getElementById('det-category').textContent = job.category;
    document.getElementById('det-type').textContent = job.job_type;
    document.getElementById('det-desc').textContent = job.description;

    // Requirements
    const reqList = document.getElementById('det-requirements');
    reqList.innerHTML = '';
    const reqs = job.requirements ? job.requirements.split('\n').filter(Boolean) : [];
    reqs.forEach(req => {
      const li = document.createElement('li');
      li.textContent = req.startsWith('•') || req.startsWith('-') ? req.substring(1).trim() : req;
      reqList.appendChild(li);
    });

    // Benefits
    const benList = document.getElementById('det-benefits');
    benList.innerHTML = '';
    const bens = job.benefits ? job.benefits.split('\n').filter(Boolean) : [];
    bens.forEach(ben => {
      const li = document.createElement('li');
      li.textContent = ben.startsWith('•') || ben.startsWith('-') ? ben.substring(1).trim() : ben;
      benList.appendChild(li);
    });

    // Apply button link
    const applyBtn = document.getElementById('det-apply-link');
    if (applyBtn) {
      applyBtn.href = `apply.html?id=${job.id}`;
    }

    // Related Vacancies List
    const relatedList = document.getElementById('related-jobs-list');
    if (relatedList) {
      relatedList.innerHTML = '';
      const related = activeJobs.filter(j => j.category === job.category && j.id !== job.id).slice(0, 3);
      if (related.length === 0) {
        relatedList.innerHTML = '<p class="text-xs text-gray-400">No related jobs listed.</p>';
      } else {
        related.forEach(rj => {
          const div = document.createElement('div');
          div.className = 'related-item mb-4 pb-3 border-b last:border-0';
          div.innerHTML = `
            <a href="job-details.html?id=${rj.id}" class="hover:text-blue-600 block transition">
              <h4 class="text-xs font-bold text-gray-900">${rj.title}</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">${rj.location}</p>
              <p class="text-[11px] font-bold text-blue-600 mt-1">${rj.salary}</p>
            </a>
          `;
          relatedList.appendChild(div);
        });
      }
    }
    return;
  }

  // --- GENERAL JOBS LISTING SEARCH & FILTER ---
  // Inputs
  const keywordInput = document.getElementById('filter-keyword');
  const categoryInput = document.getElementById('filter-category');
  const locationInput = document.getElementById('filter-location');
  const jobTypeButtons = document.querySelectorAll('.job-type-btn');
  const salaryInput = document.getElementById('filter-salary');

  let currentJobType = '';

  // Prefill inputs from URL
  if (keywordInput) keywordInput.value = qKeyword;
  if (categoryInput) categoryInput.value = qCategory;
  if (locationInput) locationInput.value = qLocation;

  // Render Function
  const renderJobs = () => {
    const term = keywordInput ? keywordInput.value.toLowerCase() : '';
    const cat = categoryInput ? categoryInput.value : '';
    const loc = locationInput ? locationInput.value.toLowerCase() : '';
    const salFilter = salaryInput ? salaryInput.value : '';

    const filtered = activeJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(term) || job.short_description.toLowerCase().includes(term);
      const matchesCategory = cat ? job.category === cat : true;
      const matchesLocation = loc ? job.location.toLowerCase().includes(loc) : true;
      const matchesJobType = currentJobType ? job.job_type === currentJobType : true;
      
      let matchesSalary = true;
      if (salFilter) {
        const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''), 10) || 0;
        if (salFilter === 'under_5k') matchesSalary = salaryNum < 5000;
        else if (salFilter === '5k_to_10k') matchesSalary = salaryNum >= 5000 && salaryNum <= 10000;
        else if (salFilter === 'over_10k') matchesSalary = salaryNum > 10000;
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesJobType && matchesSalary;
    });

    jobContainer.innerHTML = '';

    if (filtered.length === 0) {
      jobContainer.innerHTML = `
        <div class="text-center py-16" style="grid-column: span 3">
          <p class="text-sm font-bold text-gray-500">No jobs match your search parameters.</p>
          <p class="text-xs text-gray-400 mt-1">Try resetting the filters or typing other terms.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(job => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <div>
          <div class="job-tags">
            <span class="job-category-badge">${job.category}</span>
            <span class="job-type-badge">${job.job_type}</span>
          </div>
          <h3 class="job-card-title">${job.title}</h3>
          <p class="job-card-company">${job.company}</p>
          <div class="job-card-meta">
            <span>📍 ${job.location}</span>
            <span>💰 <strong style="color: #1e3a8a">${job.salary}</strong></span>
            <span>📅 Deadline: ${job.deadline}</span>
          </div>
          <p class="job-card-desc">${job.short_description}</p>
        </div>
        <div class="job-card-actions">
          <a href="job-details.html?id=${job.id}" class="btn-view-role">View Details</a>
          <a href="apply.html?id=${job.id}" class="btn-apply-role">Apply Now</a>
        </div>
      `;
      jobContainer.appendChild(card);
    });
  };

  // Add event listeners for dynamic searching
  if (keywordInput) keywordInput.addEventListener('input', renderJobs);
  if (categoryInput) categoryInput.addEventListener('change', renderJobs);
  if (locationInput) locationInput.addEventListener('change', renderJobs);
  if (salaryInput) salaryInput.addEventListener('change', renderJobs);

  jobTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      jobTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentJobType = btn.getAttribute('data-type') || '';
      renderJobs();
    });
  });

  // Initial render
  renderJobs();
});
