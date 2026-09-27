'use client';

import { useState } from 'react';
import { siteMetadata } from '@/data/siteMetadata';
import { cn } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error' | 'no-config'
  const [errorMessage, setErrorMessage] = useState('');

  const validateField = (field, value) => {
    const trimmed = (value || '').trim();
    switch (field) {
      case 'name':
        if (!trimmed) return 'Name is required.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'email':
        if (!trimmed) return 'Email is required.';
        if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
        return '';
      case 'subject':
        if (!trimmed) return 'Subject is required.';
        if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
        return '';
      case 'message':
        if (!trimmed) return 'Message is required.';
        if (trimmed.length < 10) return 'Message must be at least 10 characters.';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (vals) => {
    return {
      name: validateField('name', vals.name),
      email: validateField('email', vals.email),
      subject: validateField('subject', vals.subject),
      message: validateField('message', vals.message),
    };
  };

  const allErrors = validateAll(values);
  const isFormValid = !allErrors.name && !allErrors.email && !allErrors.subject && !allErrors.message;

  const handleChange = (field) => (e) => {
    const newValue = e.target.value;
    setValues((prev) => ({ ...prev, [field]: newValue }));
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, newValue),
      }));
    }
    if (status !== 'idle' && status !== 'submitting') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, values[field]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    const currentErrors = validateAll(values);
    setErrors(currentErrors);

    const hasErrors = Object.values(currentErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    const formspreeId =
      process.env.NEXT_PUBLIC_FORMSPREE_ID ||
      process.env.NEXT_PUBLIC_FORMSPREE_KEY ||
      siteMetadata.formspreeKey;

    if (!formspreeId) {
      setStatus('no-config');
      setErrorMessage(
        'Online submission service is not configured. Please use direct email to reach out.'
      );
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });

      if (response.ok) {
        setStatus('success');
        setValues({ name: '', email: '', subject: '', message: '' });
        setTouched({ name: false, email: false, subject: false, message: false });
        setErrors({});
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus('error');
        setErrorMessage(
          errorData?.errors?.[0]?.message ||
            'Something went wrong while delivering your message. Please try again or use direct email.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Network error encountered while sending message. Please verify your connection or reach out directly.'
      );
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Send a Message</h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Fill out the form below and I will respond to your inquiry as soon as possible.
        </p>
      </div>

      {/* Status Announcements */}
      <div aria-live="polite" className="space-y-3">
        {status === 'success' && (
          <div className="p-4 rounded-xl bg-functional-success/10 border border-functional-success/25 text-functional-success text-sm flex items-start gap-3">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <p className="font-semibold">Message delivered successfully!</p>
              <p className="text-xs mt-0.5 text-functional-success/90">
                Thank you for reaching out. I have received your message and will be in touch shortly.
              </p>
            </div>
          </div>
        )}

        {(status === 'error' || status === 'no-config') && (
          <div className="p-4 rounded-xl bg-functional-error/10 border border-functional-error/25 text-functional-error text-sm flex items-start gap-3">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="space-y-2">
              <p className="font-semibold">{errorMessage}</p>
              <div>
                <a
                  href={`mailto:${siteMetadata.email}?subject=${encodeURIComponent(
                    values.subject || 'Project Inquiry'
                  )}&body=${encodeURIComponent(
                    `Hi Mohammed,\n\n${values.message}\n\n— ${values.name} (${values.email})`
                  )}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover underline underline-offset-4"
                >
                  Send via your email client instead →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
            Name <span className="text-functional-error" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={isSubmitting}
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            placeholder="Jane Doe"
            className={cn(
              'w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
              errors.name
                ? 'border-functional-error focus:ring-functional-error/30 focus:border-functional-error'
                : 'border-border-default hover:border-border-strong focus:border-accent focus:ring-accent/25'
            )}
          />
          {errors.name && (
            <p id="contact-name-error" className="text-xs text-functional-error font-mono flex items-center gap-1">
              <span aria-hidden="true">⚠</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
            Email <span className="text-functional-error" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isSubmitting}
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            placeholder="jane@example.com"
            className={cn(
              'w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
              errors.email
                ? 'border-functional-error focus:ring-functional-error/30 focus:border-functional-error'
                : 'border-border-default hover:border-border-strong focus:border-accent focus:ring-accent/25'
            )}
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs text-functional-error font-mono flex items-center gap-1">
              <span aria-hidden="true">⚠</span> {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
            Subject <span className="text-functional-error" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            disabled={isSubmitting}
            value={values.subject}
            onChange={handleChange('subject')}
            onBlur={handleBlur('subject')}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            placeholder="Backend Engineering Opportunity / Project Discussion"
            className={cn(
              'w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
              errors.subject
                ? 'border-functional-error focus:ring-functional-error/30 focus:border-functional-error'
                : 'border-border-default hover:border-border-strong focus:border-accent focus:ring-accent/25'
            )}
          />
          {errors.subject && (
            <p id="contact-subject-error" className="text-xs text-functional-error font-mono flex items-center gap-1">
              <span aria-hidden="true">⚠</span> {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
            Message <span className="text-functional-error" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={isSubmitting}
            value={values.message}
            onChange={handleChange('message')}
            onBlur={handleBlur('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            placeholder="Tell me about your project, architecture needs, or collaboration details..."
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-bg-tertiary border text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 resize-y disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed',
              errors.message
                ? 'border-functional-error focus:ring-functional-error/30 focus:border-functional-error'
                : 'border-border-default hover:border-border-strong focus:border-accent focus:ring-accent/25'
            )}
          />
          {errors.message && (
            <p id="contact-message-error" className="text-xs text-functional-error font-mono flex items-center gap-1">
              <span aria-hidden="true">⚠</span> {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-accent/25 hover:shadow-lg text-sm px-6 py-3 gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 shrink-0 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
