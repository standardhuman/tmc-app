import { getUser, setSession } from '../lib/auth.js';
import { completeOnboarding, uploadPhoto } from '../lib/api.js';
import { router } from '../lib/router.js';

const TEAMS = ['No', 'Bloom', 'Roar', 'Electric'];

export function renderOnboarding(app) {
  const user = getUser();

  // If user is not pending, redirect to members area
  if (user?.status !== 'pending') {
    router.navigate('/members');
    return;
  }

  let photoPreview = null;
  let photoFile = null;

  app.innerHTML = `
    <div class="onboarding-container">
      <div class="onboarding-card">
        <div class="onboarding-header">
          <h1>Welcome to The Men's Circle</h1>
          <p>Complete your profile to join the brotherhood</p>
        </div>

        <div style="background: var(--color-cream); padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">
          <p style="font-family: var(--font-serif); font-style: italic; color: var(--color-earth); margin: 0;">
            "We forge brotherhood, inspire transformation, and support men in living on purpose."
          </p>
        </div>

        <form id="onboarding-form">
          <!-- Photo Upload -->
          <div class="form-group">
            <label class="form-label">Your Photo <span class="required">*</span></label>
            <div class="photo-upload">
              <div class="photo-preview" id="photo-preview">
                <span class="photo-preview-placeholder">No photo</span>
              </div>
              <input type="file" id="photo-input" class="photo-input" accept="image/*">
              <button type="button" class="btn btn-outline" id="photo-btn">
                Choose Photo
              </button>
              <p class="form-hint">A clear photo of your face helps brothers recognize you</p>
            </div>
          </div>

          <!-- Basic Info -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">First Name <span class="required">*</span></label>
              <input type="text" name="firstName" class="form-input" required value="${user?.name?.split(' ')[0] || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Last Name <span class="required">*</span></label>
              <input type="text" name="lastName" class="form-input" required value="${user?.name?.split(' ').slice(1).join(' ') || ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number <span class="required">*</span></label>
            <input type="tel" name="phone" class="form-input" required placeholder="(510) 555-1234">
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" value="${user?.email || ''}" disabled style="background: var(--color-cream);">
            <p class="form-hint">This is the email you use to log in</p>
          </div>

          <!-- Team Selection -->
          <div class="form-group">
            <label class="form-label">Your Team <span class="required">*</span></label>
            <select name="team" class="form-select" required>
              <option value="">Select your team...</option>
              ${TEAMS.map(team => `<option value="${team}">${team}</option>`).join('')}
            </select>
            <p class="form-hint">The team you're initiating with</p>
          </div>

          <!-- Emergency Contact -->
          <div style="background: var(--color-warm-white); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 1rem; color: var(--color-forest);">Emergency Contact</h4>
            <div class="form-group">
              <label class="form-label">Contact Name <span class="required">*</span></label>
              <input type="text" name="emergencyName" class="form-input" required placeholder="Full name">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Phone <span class="required">*</span></label>
                <input type="tel" name="emergencyPhone" class="form-input" required placeholder="(510) 555-1234">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Relationship <span class="required">*</span></label>
                <input type="text" name="emergencyRelationship" class="form-input" required placeholder="e.g., Spouse, Brother">
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="form-group">
            <label class="form-label">How did you find out about The Men's Circle? <span class="required">*</span></label>
            <textarea name="howFound" class="form-textarea" required placeholder="A friend referred me, found online, etc."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Who is your sponsor? <span class="required">*</span></label>
            <input type="text" name="sponsor" class="form-input" required placeholder="Name of the man sponsoring your initiation">
            <p class="form-hint">The member who invited or is guiding you through initiation</p>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
            Complete Profile & Enter
          </button>

          <div id="form-message" style="margin-top: 1rem;"></div>
        </form>
      </div>
    </div>
  `;

  // Photo upload handling
  const photoInput = document.getElementById('photo-input');
  const photoBtn = document.getElementById('photo-btn');
  const photoPreviewEl = document.getElementById('photo-preview');

  photoBtn.addEventListener('click', () => photoInput.click());

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      photoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview = e.target.result;
        photoPreviewEl.innerHTML = `<img src="${photoPreview}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Form submission
  const form = document.getElementById('onboarding-form');
  const messageDiv = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!photoFile) {
      messageDiv.innerHTML = `
        <div class="message message-error">
          Please upload a photo of yourself.
        </div>
      `;
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    messageDiv.innerHTML = '';

    const formData = new FormData(form);

    try {
      // Upload photo first
      let photoUrl = '';
      if (photoFile) {
        const uploadResult = await uploadPhoto(photoFile);
        photoUrl = uploadResult.url;
      }

      // Submit onboarding data
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        team: formData.get('team'),
        emergencyContact: {
          name: formData.get('emergencyName'),
          phone: formData.get('emergencyPhone'),
          relationship: formData.get('emergencyRelationship')
        },
        howFound: formData.get('howFound'),
        sponsor: formData.get('sponsor'),
        photoUrl
      };

      const response = await completeOnboarding(data);

      // Update session with new token (status changed)
      if (response.token) {
        setSession(response.token);
      }

      // Redirect to members area
      router.navigate('/members');

    } catch (error) {
      messageDiv.innerHTML = `
        <div class="message message-error">
          ${error.message || 'Something went wrong. Please try again.'}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Complete Profile & Enter';
    }
  });
}
