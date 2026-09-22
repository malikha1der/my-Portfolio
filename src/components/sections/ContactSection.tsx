import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle2, AlertCircle, Copy, Check, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { EMAILJS_CONFIG, PERSONAL_INFO, SOCIAL_LINKS } from '../../data/portfolioData';
import { CardSpotlight } from '../ui/CardSpotlight';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    // Parameters mapped to standard EmailJS template keys
    const templateParams = {
      name: formData.name,
      from_name: formData.name,
      user_name: formData.name,
      email: formData.email,
      from_email: formData.email,
      user_email: formData.email,
      reply_to: formData.email,
      subject: formData.subject || 'New Contact from Portfolio',
      message: formData.message,
    };

    try {
      // Use exact configured credentials
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('EmailJS Submission Error:', err);
      setStatus('error');
      setErrorMessage(
        err?.text || 'Failed to send message. You can reach out directly via malikhaider48008@gmail.com.'
      );
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact Section"
      className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 border-t border-zinc-900 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>05 // GET IN TOUCH</span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Let's build something extraordinary together.
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Have a project in mind, an inquiry, or an engineering role? Send a message directly or connect via professional networks.
          </p>
        </div>

        {/* 2-Column Grid: Direct Contact Info & Form */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <CardSpotlight glowColor="rgba(56, 189, 248, 0.12)" className="p-8">
              <h3 className="font-display text-xl font-bold text-white mb-6">
                Direct Channels
              </h3>

              <div className="space-y-6">
                {/* Email Item */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-cyan-400 shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-zinc-400 block">
                        EMAIL ADDRESS
                      </span>
                      <a
                        href={`mailto:${PERSONAL_INFO.email}`}
                        className="text-sm font-medium text-zinc-100 hover:text-cyan-400 transition-colors"
                      >
                        {PERSONAL_INFO.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-cyan-400 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-zinc-400 block">
                      LOCATION
                    </span>
                    <span className="text-sm font-medium text-zinc-100">
                      {PERSONAL_INFO.location}
                    </span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-emerald-400 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-zinc-400 block">
                      AVAILABILITY
                    </span>
                    <span className="text-sm font-medium text-emerald-300">
                      Currently available for selective contracts & full-time roles
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Profiles Grid */}
              <div className="mt-8 pt-6 border-t border-zinc-800/80">
                <span className="font-mono text-xs text-zinc-400 block mb-4">
                  VERIFIED NETWORKS
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                    >
                      <span className="font-medium">{link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            </CardSpotlight>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <CardSpotlight glowColor="rgba(56, 189, 248, 0.15)" className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Form Status Messages */}
                {status === 'success' && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-mono text-emerald-300 animate-in fade-in">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-zinc-400 mt-0.5">Thank you for reaching out. I will respond to your message promptly.</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-xs font-mono text-red-300 animate-in fade-in">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Unable to Send</p>
                      <p className="text-zinc-400 mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Name & Email inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block font-mono text-xs text-zinc-400 mb-2">
                      NAME <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:bg-zinc-900/90 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block font-mono text-xs text-zinc-400 mb-2">
                      EMAIL ADDRESS <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:bg-zinc-900/90 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block font-mono text-xs text-zinc-400 mb-2">
                    SUBJECT / TOPIC
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Project Inquiry / Collaboration"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:bg-zinc-900/90 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>

                {/* Message textarea */}
                <div>
                  <label htmlFor="contact-message" className="block font-mono text-xs text-zinc-400 mb-2">
                    MESSAGE <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share brief details regarding your project scope, timeline, or inquiry..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:bg-zinc-900/90 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
                    Delivered directly via EmailJS
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      status === 'sending'
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-[0.98]'
                    }`}
                  >
                    <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
                    <Send className={`h-4 w-4 ${status === 'sending' ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

              </form>
            </CardSpotlight>
          </div>

        </div>

      </div>
    </section>
  );
}
