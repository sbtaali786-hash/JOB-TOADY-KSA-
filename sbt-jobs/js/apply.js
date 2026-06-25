/**
 * SBT Jobs - Apply Form Controller (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const applyForm = document.getElementById('apply-form');
  if (!applyForm) return;

  const db = window.SBT_DB;
  if (!db) return;

  // Retrieve job id from URL
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || 'general-application';

  const positionInput = document.getElementById('app-position');

  // Pre-fill position input if specific job is selected
  if (jobId !== 'general-application') {
    const jobs = await db.getJobs();
    const selectedJob = jobs.find(j => j.id === jobId);
    if (selectedJob && positionInput) {
      positionInput.value = selectedJob.title;
      positionInput.disabled = true; // prevent editing for accurate logging
    }
  }

  // Handle Form Submission
  applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('app-name').value;
    const email = document.getElementById('app-email').value;
    const phone = document.getElementById('app-phone').value;
    const nationality = document.getElementById('app-nationality').value;
    const currentCity = document.getElementById('app-city').value;
    const positionApplied = positionInput ? positionInput.value : 'General Application';
    const experienceYears = parseFloat(document.getElementById('app-experience').value) || 0;
    const expectedSalary = parseFloat(document.getElementById('app-salary').value) || 0;
    const message = document.getElementById('app-message').value;
    
    const cvInput = document.getElementById('app-cv');
    const cvFile = cvInput && cvInput.files ? cvInput.files[0] : null;

    if (!cvFile) {
      alert('Please select and attach your CV document (PDF/DOCX) to apply.');
      return;
    }

    const submitBtn = applyForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting Application...';
    submitBtn.disabled = true;

    try {
      const payload = {
        full_name: fullName,
        email,
        phone,
        nationality,
        current_city: currentCity,
        job_id: jobId,
        position_applied: positionApplied,
        experience_years: experienceYears,
        expected_salary: expectedSalary,
        message,
        cv_url: ''
      };

      await db.submitApplication(payload, cvFile);

      // Hide form and show success screen
      applyForm.style.display = 'none';
      const successBlock = document.getElementById('apply-success-block');
      if (successBlock) {
        successBlock.style.display = 'block';
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting your application. Please check your network and try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});
