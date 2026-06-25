/**
 * SBT Jobs - Global Site Interface Logic (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Sticky Navigation Panel Scroll Shadow Effect
  const navbar = document.querySelector('.main-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 10px 15px -3px rgba(30, 58, 138, 0.08)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      }
    });
  }

  // 2. Mobile Responsive Menu Panel Controls
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.backgroundColor = '#fff';
      navLinks.style.padding = '24px';
      navLinks.style.boxShadow = '0 15px 15px -3px rgba(30, 58, 138, 0.1)';
      navLinks.style.borderTop = '1px solid #f1f5f9';
    });
  }

  // 3. Homepage pre-loading featured vacancies
  const homeFeaturedContainer = document.getElementById('featured-jobs-grid');
  if (homeFeaturedContainer && window.SBT_DB) {
    const db = window.SBT_DB;
    const allJobs = await db.getJobs();
    const featuredJobs = allJobs.filter(j => j.featured && j.status === 'active').slice(0, 6);

    homeFeaturedContainer.innerHTML = '';

    if (featuredJobs.length === 0) {
      homeFeaturedContainer.innerHTML = '<p class="text-sm text-gray-400" style="grid-column: span 3; text-align: center;">No featured openings currently available.</p>';
    } else {
      featuredJobs.forEach(job => {
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
        homeFeaturedContainer.appendChild(card);
      });
    }
  }

  // 4. Homepage Category click handling
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      if (cat) {
        window.location.href = `jobs.html?category=${encodeURIComponent(cat)}`;
      }
    });
  });

  // 5. Contact Form Submission (contact.html)
  const contactForm = document.getElementById('contact-form');
  if (contactForm && window.SBT_DB) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('con-name').value;
      const email = document.getElementById('con-email').value;
      const phone = document.getElementById('con-phone').value;
      const subject = document.getElementById('con-subject').value;
      const message = document.getElementById('con-message').value;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending Message...';
      submitBtn.disabled = true;

      try {
        await window.SBT_DB.submitContactMessage({ name, email, phone, subject, message });

        // Hide form and show success
        contactForm.style.display = 'none';
        const successBlock = document.getElementById('contact-success-block');
        if (successBlock) {
          successBlock.style.display = 'block';
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
