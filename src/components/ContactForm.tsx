import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

type FormState = 'idle' | 'sending' | 'success' | 'demo' | 'error';
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (key: keyof typeof form, value: string) => {
    setForm((old) => ({ ...old, [key]: value }));
    if (state === 'error') setState('idle');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const clean = {
      name: form.name.trim().slice(0, 100),
      email: form.email.trim().slice(0, 254),
      message: form.message.trim().slice(0, 4000),
    };
    if (clean.name.length < 2) { setState('error'); setError('Enter a name with at least 2 characters.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) { setState('error'); setError('Enter a valid email address.'); return; }
    if (clean.message.length < 12) { setState('error'); setError('Message needs at least 12 characters.'); return; }

    if (!endpoint) {
      setState('demo');
      return;
    }

    setState('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(clean),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status}).`);
      setState('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? `${err.message} Check your contact endpoint and try again.` : 'Unable to send the message. Try again.');
    }
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="field-label">IDENTIFIER <span>*</span>
          <input name="name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} maxLength={100} required placeholder="Your name" aria-invalid={state === 'error' && form.name.trim().length < 2} />
        </label>
        <label className="field-label">RETURN CHANNEL <span>*</span>
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} maxLength={254} required placeholder="you@domain.com" aria-invalid={state === 'error' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())} />
        </label>
      </div>
      <label className="field-label">MESSAGE PAYLOAD <span>*</span>
        <textarea name="message" value={form.message} onChange={(event) => update('message', event.target.value)} rows={5} maxLength={4000} required placeholder="Tell us what's on your mind..." aria-invalid={state === 'error' && form.message.trim().length < 12} />
        <span className="field-counter">{form.message.length.toString().padStart(3, '0')} / 4000</span>
      </label>
      {state === 'error' && <div className="form-feedback form-error" role="alert"><AlertCircle size={16} />{error}</div>}
      {state === 'success' && <div className="form-feedback form-success" role="status"><CheckCircle2 size={16} />Message delivered to the configured endpoint.</div>}
      {state === 'demo' && <div className="form-feedback form-demo" role="status"><AlertCircle size={16} /><span><strong>Local demo mode.</strong> Your input passed validation but was not sent. Set <code>VITE_CONTACT_ENDPOINT</code> in <code>.env</code> to deliver it to your backend.</span></div>}
      <div className="form-bottom">
        <p><span className="privacy-dot" /> Input is validated in the browser. Never send secrets here.</p>
        <button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'TRANSMITTING...' : state === 'success' ? 'SEND ANOTHER' : 'TRANSMIT MESSAGE'} <Send size={14} /></button>
      </div>
    </form>
  );
}
