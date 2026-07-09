/**
 * MasteryHub Visitor Modal
 * Shows a one-time overlay asking for name/email/mobile before accessing content.
 * Data is sent to the visitor-log API for tracking.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'masteryhub_visitor';
  const API_URL = 'https://assistant.shinuailabs.com/visitor-log';

  // Don't show on login/auth pages or if already submitted
  if (localStorage.getItem(STORAGE_KEY) === 'submitted') return;

  // Create modal elements
  function createModal() {
    // Backdrop
    const overlay = document.createElement('div');
    overlay.id = 'mh-visitor-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.65); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      animation: mhFadeIn 0.3s ease;
    `;

    // Modal box
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a2e; border-radius: 16px; padding: 36px 32px 28px;
      max-width: 420px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      text-align: center; position: relative;
      animation: mhSlideUp 0.35s ease;
    `;

    // Logo/Icon
    const icon = document.createElement('div');
    icon.innerHTML = '🚀';
    icon.style.cssText = 'font-size: 48px; margin-bottom: 12px;';
    modal.appendChild(icon);

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Welcome to MasteryHub';
    title.style.cssText = `
      color: #fff; font-size: 22px; font-weight: 700; margin: 0 0 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    modal.appendChild(title);

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'A community learning engine for Quality Engineers mastering AI. Enter your details to continue.';
    subtitle.style.cssText = `
      color: #9e9e9e; font-size: 14px; line-height: 1.5; margin: 0 0 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    modal.appendChild(subtitle);

    // Form
    const form = document.createElement('form');
    form.id = 'mh-visitor-form';
    form.style.cssText = 'text-align: left;';

    // Fields config
    const fields = [
      { id: 'mh-name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
      { id: 'mh-email', label: 'Email Address', type: 'email', required: true, placeholder: 'you@example.com' },
      { id: 'mh-mobile', label: 'Mobile Number', type: 'tel', required: false, placeholder: '+91 98765 43210' },
      { id: 'mh-company', label: 'Company (optional)', type: 'text', required: false, placeholder: 'Where do you work?' }
    ];

    fields.forEach(f => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'margin-bottom: 14px;';

      const label = document.createElement('label');
      label.htmlFor = f.id;
      label.textContent = f.label;
      label.style.cssText = `
        display: block; color: #b0b0b0; font-size: 13px; font-weight: 500;
        margin-bottom: 5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      wrapper.appendChild(label);

      const input = document.createElement('input');
      input.type = f.type;
      input.id = f.id;
      input.required = f.required;
      input.placeholder = f.placeholder;
      input.style.cssText = `
        width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #333;
        background: #16213e; color: #e0e0e0; font-size: 14px; outline: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box; transition: border-color 0.2s;
      `;
      input.addEventListener('focus', function() { this.style.borderColor = '#ff6d00'; });
      input.addEventListener('blur', function() { this.style.borderColor = '#333'; });
      wrapper.appendChild(input);
      form.appendChild(wrapper);
    });

    // Error message area
    const errorEl = document.createElement('div');
    errorEl.id = 'mh-visitor-error';
    errorEl.style.cssText = 'color: #ff5252; font-size: 13px; margin-bottom: 12px; display: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
    form.appendChild(errorEl);

    // Submit button
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Access Content →';
    btn.style.cssText = `
      width: 100%; padding: 12px; border-radius: 8px; border: none;
      background: linear-gradient(135deg, #ff6d00, #ff8f00); color: #fff;
      font-size: 15px; font-weight: 600; cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    btn.addEventListener('mouseenter', function() { this.style.opacity = '0.9'; });
    btn.addEventListener('mouseleave', function() { this.style.opacity = '1'; });
    form.appendChild(btn);

    // Loading state
    const loadingEl = document.createElement('div');
    loadingEl.id = 'mh-visitor-loading';
    loadingEl.style.cssText = 'display: none; text-align: center; padding: 12px; color: #9e9e9e; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
    loadingEl.textContent = '⏳ Submitting...';
    form.appendChild(loadingEl);

    // Privacy note
    const privacy = document.createElement('p');
    privacy.style.cssText = 'color: #666; font-size: 11px; margin: 16px 0 0; text-align: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
    privacy.innerHTML = '🔒 Your information is private and will only be used for community analytics.';
    modal.appendChild(form);
    modal.appendChild(privacy);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Form submit handler
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('mh-name').value.trim();
      const email = document.getElementById('mh-email').value.trim();
      const mobile = document.getElementById('mh-mobile').value.trim();
      const company = document.getElementById('mh-company').value.trim();

      // Validation
      if (!name || !email) {
        errorEl.textContent = 'Please fill in all required fields.';
        errorEl.style.display = 'block';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        errorEl.style.display = 'block';
        return;
      }

      errorEl.style.display = 'none';
      btn.style.display = 'none';
      loadingEl.style.display = 'block';

      // Send to API
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          mobile: mobile || '',
          company: company || '',
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        })
      }).then(function(r) {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      }).then(function() {
        localStorage.setItem(STORAGE_KEY, 'submitted');
        overlay.remove();
      }).catch(function() {
        // Even if API fails, let them through and store locally
        localStorage.setItem(STORAGE_KEY, 'submitted');
        overlay.remove();
      });
    });
  }

  // Inject CSS animations
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes mhFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes mhSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(style);
  }

  // Wait for page to load, then show modal
  if (document.readyState === 'complete') {
    injectStyles();
    createModal();
  } else {
    window.addEventListener('load', function() {
      injectStyles();
      createModal();
    });
  }
})();
