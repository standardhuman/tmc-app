import { renderPublicLayout } from '../main.js';
import { submitContactForm } from '../lib/api.js';

export function renderHome(app) {
  app.innerHTML = renderPublicLayout(`
    <header class="hero">
      <div class="hero-content">
        <img src="/logo-tmc.png" alt="The Men's Circle" class="hero-logo">
        <p class="hero-subtitle" style="font-size: 1.5rem; font-style: italic; color: var(--color-ember); margin-bottom: 1rem;">
          We forge brotherhood, inspire transformation, and support men in living on purpose.
        </p>
        <p class="hero-subtitle">
          A community of men committed to growth, accountability, and authentic connection.
        </p>
        <a href="#contact" class="btn btn-primary" style="margin-top: 1rem;">Connect With Us</a>
      </div>
    </header>

    <section class="section" style="background: var(--color-sand);">
      <div class="section-content">
        <h2 style="text-align: center; margin-bottom: 2rem;">What We Do</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div class="card">
            <h3 style="color: var(--color-ember);">Weekly Gatherings</h3>
            <p style="color: var(--color-muted); margin: 0;">
              We meet each week around a fire to share openly, challenge each other, and hold space for what matters most.
            </p>
          </div>
          <div class="card">
            <h3 style="color: var(--color-ember);">Brotherhood</h3>
            <p style="color: var(--color-muted); margin: 0;">
              Deep connections with men who see you fully and call you forward into your highest expression.
            </p>
          </div>
          <div class="card">
            <h3 style="color: var(--color-ember);">Purpose Work</h3>
            <p style="color: var(--color-muted); margin: 0;">
              Discover and live your purpose through honest reflection, feedback, and committed action.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-content">
        <h2 style="text-align: center; margin-bottom: 2rem;">What Members Experience</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 0 auto;">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--color-ember); font-size: 1.25rem;">✓</span>
            <p style="margin: 0; color: var(--color-charcoal);">Clarity on personal purpose and direction</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--color-ember); font-size: 1.25rem;">✓</span>
            <p style="margin: 0; color: var(--color-charcoal);">Improved communication skills</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--color-ember); font-size: 1.25rem;">✓</span>
            <p style="margin: 0; color: var(--color-charcoal);">Stronger intimate relationships</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--color-ember); font-size: 1.25rem;">✓</span>
            <p style="margin: 0; color: var(--color-charcoal);">Completion of long-delayed projects</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--color-ember); font-size: 1.25rem;">✓</span>
            <p style="margin: 0; color: var(--color-charcoal);">Honest feedback and encouragement</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--color-ember); font-size: 1.25rem;">✓</span>
            <p style="margin: 0; color: var(--color-charcoal);">A confidential space for emotional expression</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--color-sand);">
      <div class="section-content">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; align-items: center;">
          <div>
            <h2>Many Teams, One Circle</h2>
            <p style="color: var(--color-muted);">
              The Men's Circle is organized into multiple teams, each providing an intimate container for men to do their work while belonging to the larger community.
            </p>
            <p style="color: var(--color-muted); margin-bottom: 0;">
              New men are welcomed through an initiation process that prepares them to fully participate in the circle.
            </p>
          </div>
          <div style="background: var(--color-charcoal); color: white; padding: 2.5rem; border-radius: 8px; text-align: center;">
            <p style="font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; margin-bottom: 1rem;">
              "In the Men's Circle, we forge brotherhood, inspire transformation, and support men in living on purpose."
            </p>
            <p style="font-size: 0.9375rem; opacity: 0.8; margin: 0;">Our Purpose</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-content">
        <h2 style="text-align: center; margin-bottom: 2rem;">When We Meet</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; max-width: 700px; margin: 0 auto; text-align: center;">
          <div>
            <p style="font-size: 1.5rem; margin-bottom: 0.25rem;">📅</p>
            <h4 style="color: var(--color-earth); margin-bottom: 0.5rem;">When</h4>
            <p style="color: var(--color-muted); margin: 0;">Weekly on Wednesdays</p>
          </div>
          <div>
            <p style="font-size: 1.5rem; margin-bottom: 0.25rem;">🔥</p>
            <h4 style="color: var(--color-earth); margin-bottom: 0.5rem;">Where</h4>
            <p style="color: var(--color-muted); margin: 0;">Around a fire in Bay Area parks</p>
          </div>
          <div>
            <p style="font-size: 1.5rem; margin-bottom: 0.25rem;">💰</p>
            <h4 style="color: var(--color-earth); margin-bottom: 0.5rem;">Cost</h4>
            <p style="color: var(--color-muted); margin: 0;">Free to join</p>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="section" style="background: var(--color-sand);">
      <div class="section-content" style="max-width: 600px;">
        <h2 style="text-align: center; margin-bottom: 0.5rem;">Connect With Us</h2>
        <p style="text-align: center; color: var(--color-muted); margin-bottom: 2rem;">
          Interested in learning more? Reach out and one of our men will be in touch.
        </p>

        <form id="contact-form" class="card" style="padding: 2rem;">
          <div class="form-group">
            <label class="form-label">
              Your Name <span class="required">*</span>
            </label>
            <input type="text" name="name" class="form-input" required>
          </div>

          <div class="form-group">
            <label class="form-label">
              Email Address <span class="required">*</span>
            </label>
            <input type="email" name="email" class="form-input" required>
          </div>

          <div class="form-group">
            <label class="form-label">
              What brings you to The Men's Circle? <span class="required">*</span>
            </label>
            <textarea name="message" class="form-textarea" required placeholder="Tell us a bit about yourself and what you're looking for..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            Send Message
          </button>

          <div id="form-message" style="margin-top: 1rem;"></div>
        </form>

        <p style="text-align: center; font-size: 0.875rem; color: var(--color-muted); margin-top: 1.5rem;">
          🔒 The Men's Circle maintains strict confidentiality. What's shared in the circle stays in the circle.
        </p>
      </div>
    </section>
  `);

  // Handle contact form submission
  const form = document.getElementById('contact-form');
  const messageDiv = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    messageDiv.innerHTML = '';

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      await submitContactForm(data);
      messageDiv.innerHTML = `
        <div class="message message-success">
          Thank you for reaching out! One of our men will be in touch soon.
        </div>
      `;
      form.reset();
    } catch (error) {
      messageDiv.innerHTML = `
        <div class="message message-error">
          ${error.message || 'Something went wrong. Please try again.'}
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
