'use client';

import { useState, useEffect, useRef } from 'react';
import { useOverlay } from '@/context/OverlayContext';
import { siteMetadata } from '@/data/siteMetadata';
import { metrics } from '@/data/metrics';
import { cn } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESUME_PDF_PATH = '/resume/Mohammed_Ferwana_Resume.pdf';

export default function ResumeModal() {
  const { isResumeModalOpen, closeResumeModal } = useOverlay();
  const [activeTab, setActiveTab] = useState('download'); // 'download' | 'request'
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    company: '',
    roleType: 'Full-Time Backend Engineer',
    message: '',
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const modalRef = useRef(null);

  // Lock background scroll when open
  useEffect(() => {
    if (!isResumeModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isResumeModalOpen]);

  // Reset form status when opening
  useEffect(() => {
    if (isResumeModalOpen) {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isResumeModalOpen]);

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(siteMetadata.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const validateField = (field, value) => {
    const val = (value || '').trim();
    if (field === 'name') {
      if (!val) return 'Name is required.';
      if (val.length < 2) return 'Name must be at least 2 characters.';
    }
    if (field === 'email') {
      if (!val) return 'Work email is required.';
      if (!EMAIL_REGEX.test(val)) return 'Please enter a valid email address.';
    }
    if (field === 'company') {
      if (!val) return 'Company / Organization is required.';
    }
    return '';
  };

  const handleFieldChange = (field) => (e) => {
    const val = e.target.value;
    setFormValues((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
    }
    if (status !== 'idle' && status !== 'submitting') {
      setStatus('idle');
    }
  };

  const handleFieldBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formValues[field]),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateField('name', formValues.name);
    const emailErr = validateField('email', formValues.email);
    const companyErr = validateField('company', formValues.company);

    const validationResult = { name: nameErr, email: emailErr, company: companyErr };
    setErrors(validationResult);
    setTouched({ name: true, email: true, company: true });

    if (nameErr || emailErr || companyErr) {
      return;
    }

    const formspreeId =
      process.env.NEXT_PUBLIC_FORMSPREE_ID ||
      process.env.NEXT_PUBLIC_FORMSPREE_KEY ||
      siteMetadata.formspreeKey;

    setStatus('submitting');
    setErrorMessage('');

    try {
      if (formspreeId) {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            request_type: 'Resume & Dossier Request',
            name: formValues.name.trim(),
            email: formValues.email.trim(),
            company: formValues.company.trim(),
            role_type: formValues.roleType,
            message: formValues.message.trim() || 'No custom message provided',
          }),
        });

        if (!response.ok) {
          throw new Error('Service returned non-200 response');
        }
      }

      setStatus('success');

      // Auto-trigger instant resume download for immediate recruiter gratification
      const link = document.createElement('a');
      link.href = RESUME_PDF_PATH;
      link.download = 'Mohammed_Ferwana_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // In case of network failure, still allow immediate download
      setStatus('success');
      const link = document.createElement('a');
      link.href = RESUME_PDF_PATH;
      link.download = 'Mohammed_Ferwana_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isResumeModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-bg-primary/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeResumeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-bg-secondary border border-border-strong shadow-2xl flex flex-col transition-all duration-300"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border-default bg-bg-primary/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-functional-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-functional-success" />
            </span>
            <span className="font-mono text-xs font-semibold text-functional-success tracking-wider uppercase">
              Available · Backend Engineering Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-bg-tertiary border border-border-default text-text-muted">
              ESC
            </kbd>
            <button
              type="button"
              onClick={closeResumeModal}
              aria-label="Close resume modal"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Header Introduction */}
        <div className="px-5 sm:px-7 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="resume-modal-title" className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Mohammed Ferwana
              </h2>
              <p className="text-xs sm:text-sm font-medium text-accent mt-0.5">
                Backend Engineer · Systems Architecture & Distributed Workflows
              </p>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Specialized in finite state machine (FSM) lifecycles, predictable RESTful APIs, multi-tenant databases, and automated integration test coverage.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 rounded-xl bg-bg-tertiary/70 border border-border-subtle mt-5" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'download'}
              onClick={() => setActiveTab('download')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200',
                activeTab === 'download'
                  ? 'bg-bg-primary text-text-primary border border-border-default shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Instant Download & Overview</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'request'}
              onClick={() => setActiveTab('request')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200',
                activeTab === 'request'
                  ? 'bg-bg-primary text-text-primary border border-border-default shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7.5" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              <span>Recruiter Fast-Track Request</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-5 sm:px-7 pb-6 space-y-5">
          {activeTab === 'download' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Primary PDF Download Action Card */}
              <div className="rounded-xl p-5 bg-gradient-to-br from-bg-tertiary/90 to-bg-tertiary/40 border border-border-default space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        Mohammed_Ferwana_Resume.pdf
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-text-muted">
                        <span>Vector PDF</span>
                        <span>•</span>
                        <span>ATS-Friendly</span>
                        <span>•</span>
                        <span>~103 KB</span>
                      </div>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-functional-success/15 border border-functional-success/30 text-functional-success font-semibold">
                    Current Edition
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <a
                    href={RESUME_PDF_PATH}
                    download="Mohammed_Ferwana_Resume.pdf"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm hover:shadow-accent/25 hover:shadow-md transition-all duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download PDF Now</span>
                  </a>

                  <a
                    href={RESUME_PDF_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default hover:border-border-strong text-text-primary text-xs font-semibold transition-all duration-200"
                  >
                    <span>Open in New Tab</span>
                    <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Verified Engineering Credentials Grid */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Key Verified Engineering Credentials
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                      Leadership & Delivery
                    </span>
                    <p className="font-semibold text-text-primary">
                      Backend Developer & Team Lead
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      TAQAT (TeamLine) · Led sprint planning, task estimation, RBAC architecture, and PR code reviews.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                      Systems Architecture
                    </span>
                    <p className="font-semibold text-text-primary">
                      InsurFlow Backend Owner
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      9-state FSM claim engine, atomic sequential numbering, and {metrics.integrationTests} automated tests.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                      Core Stack
                    </span>
                    <p className="font-semibold text-text-primary">
                      Server-Side & Data Integrity
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Node.js, Express.js, MongoDB, PostgreSQL, Redis, Jest, Supertest, Docker, JWT.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                      Education
                    </span>
                    <p className="font-semibold text-text-primary">
                      Computer Systems Engineering
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      B.Sc. Al-Azhar University · Operating Systems, Algorithms, Distributed Databases.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Email Fallback */}
              <div className="pt-2 flex items-center justify-between text-xs text-text-muted border-t border-border-subtle">
                <span className="text-[11px]">Need customized documentation or reference checks?</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="font-mono text-accent hover:text-accent-hover text-[11px] inline-flex items-center gap-1 transition-colors"
                >
                  {copiedEmail ? '✓ Copied' : `Copy ${siteMetadata.email}`}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              {status === 'success' ? (
                <div className="p-6 rounded-xl bg-functional-success/10 border border-functional-success/25 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-functional-success/20 border border-functional-success/40 text-functional-success flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-functional-success">
                      Request Dispatched Successfully!
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                      Thank you! Your notification has been sent to Mohammed. Your instant resume download has also been initiated automatically.
                    </p>
                  </div>

                  <div className="pt-3 flex flex-wrap justify-center gap-2">
                    <a
                      href={RESUME_PDF_PATH}
                      download="Mohammed_Ferwana_Resume.pdf"
                      className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Again
                    </a>
                    <button
                      type="button"
                      onClick={closeResumeModal}
                      className="px-4 py-2 rounded-lg bg-bg-tertiary border border-border-default text-text-secondary hover:text-text-primary text-xs"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} noValidate className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-secondary leading-relaxed">
                    <span className="font-semibold text-text-primary">For Talent Partners & Hiring Managers: </span>
                    Submit this quick inquiry to schedule an interview, request customized tech specifications, or receive direct hiring availability.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="req-name" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                        Your Name <span className="text-functional-error">*</span>
                      </label>
                      <input
                        id="req-name"
                        type="text"
                        required
                        value={formValues.name}
                        onChange={handleFieldChange('name')}
                        onBlur={handleFieldBlur('name')}
                        placeholder="Alex Morgan"
                        className={cn(
                          'w-full px-3 py-2 rounded-lg bg-bg-tertiary border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2',
                          errors.name
                            ? 'border-functional-error focus:ring-functional-error/30'
                            : 'border-border-default focus:border-accent focus:ring-accent/25'
                        )}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-functional-error font-mono">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="req-email" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                        Work Email <span className="text-functional-error">*</span>
                      </label>
                      <input
                        id="req-email"
                        type="email"
                        required
                        value={formValues.email}
                        onChange={handleFieldChange('email')}
                        onBlur={handleFieldBlur('email')}
                        placeholder="alex@company.com"
                        className={cn(
                          'w-full px-3 py-2 rounded-lg bg-bg-tertiary border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2',
                          errors.email
                            ? 'border-functional-error focus:ring-functional-error/30'
                            : 'border-border-default focus:border-accent focus:ring-accent/25'
                        )}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-functional-error font-mono">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="req-company" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                        Company / Organization <span className="text-functional-error">*</span>
                      </label>
                      <input
                        id="req-company"
                        type="text"
                        required
                        value={formValues.company}
                        onChange={handleFieldChange('company')}
                        onBlur={handleFieldBlur('company')}
                        placeholder="e.g. Stripe, TechCorp"
                        className={cn(
                          'w-full px-3 py-2 rounded-lg bg-bg-tertiary border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2',
                          errors.company
                            ? 'border-functional-error focus:ring-functional-error/30'
                            : 'border-border-default focus:border-accent focus:ring-accent/25'
                        )}
                      />
                      {errors.company && (
                        <p className="text-[10px] text-functional-error font-mono">{errors.company}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="req-role-type" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                        Opportunity Type
                      </label>
                      <select
                        id="req-role-type"
                        value={formValues.roleType}
                        onChange={handleFieldChange('roleType')}
                        className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border-default text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                      >
                        <option value="Full-Time Backend Engineer">Full-Time Backend Engineer</option>
                        <option value="Contract / Architecture Advisory">Contract / Architecture Advisory</option>
                        <option value="Technical Interview / Discussion">Technical Interview / Discussion</option>
                        <option value="General Engineering Opportunity">General Engineering Opportunity</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="req-message" className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                      Message / Role Context (Optional)
                    </label>
                    <textarea
                      id="req-message"
                      rows={2}
                      value={formValues.message}
                      onChange={handleFieldChange('message')}
                      placeholder="Brief role requirements, team structure, or preferred interview timeframe..."
                      className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border-default text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-text-muted font-mono">
                      Submitting triggers both instant download and direct notification.
                    </span>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm hover:shadow-accent/25 transition-all duration-200 disabled:opacity-50"
                    >
                      {status === 'submitting' ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit & Download</span>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
