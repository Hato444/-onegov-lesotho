import { useEffect, useRef, useState } from 'react';
import { Icon, IconFor } from '../icons.jsx';
import { DEPTS, MODULE_ACTIONS, DEPT_FORM_FIELDS } from '../constants.js';
import { api } from '../api.js';
import { fullName } from '../util.js';
import { useToast } from '../toast.jsx';

function ModalShell({ onClose, children, maxWidth }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" ref={ref} tabIndex={-1} style={maxWidth ? { maxWidth } : undefined} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {children}
      </div>
    </div>
  );
}

function CloseButton({ onClose }) {
  return <button className="x-btn" onClick={onClose} aria-label="Close dialog"><Icon name="x" size={18} /></button>;
}

export function ForgotModal({ onClose }) {
  const toast = useToast();
  const [value, setValue] = useState('');
  const [err, setErr] = useState(false);

  async function submit() {
    if (!value.trim()) { setErr(true); document.getElementById('fp-email')?.focus(); return; }
    try { await api.forgot(value.trim()); } catch { /* same message either way */ }
    onClose();
    toast('If that account exists, a reset link has been sent.', 'success');
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-head">
        <div>
          <h2 id="modal-title" style={{ fontSize: 18 }}>Reset your password</h2>
          <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 4 }}>We'll send a reset link to your registered work email.</p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="fp-email" className="req">Work email or employee number</label>
          <input type="text" id="fp-email" className={err ? 'err' : ''} value={value} maxLength={100}
            onChange={(e) => { setValue(e.target.value); setErr(false); }} placeholder="e.g. GOV-00231 or name@gov.ls" />
        </div>
        <div className="helpbox"><IconFor name="info" /><span>For security, password resets for government accounts require identity confirmation at your district office if the reset link is not used within 24 hours.</span></div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>Send reset link</button>
      </div>
    </ModalShell>
  );
}

export function ConfirmModal({ modal, onClose, onConfirm }) {
  return (
    <ModalShell onClose={onClose} maxWidth={440}>
      <div className="modal-head">
        <h2 id="modal-title" style={{ fontSize: 17 }}>{modal.title}</h2>
        <CloseButton onClose={onClose} />
      </div>
      <div className="modal-body"><p style={{ fontSize: 14, color: 'var(--ink-700)' }}>{modal.message}</p></div>
      <div className="modal-foot">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>{modal.confirmLabel || 'Confirm'}</button>
      </div>
    </ModalShell>
  );
}

function prefillFor(label, ctx) {
  if (!ctx) return '';
  if (/national id/i.test(label)) return ctx.nid;
  if (/employee number/i.test(label)) return ctx.empNo || '';
  if (/full name/i.test(label) && !/child|spouse|deceased|beneficiary/i.test(label)) return fullName(ctx);
  return '';
}

export function DeptActionModal({ modal, citizen, onClose }) {
  const toast = useToast();
  const dept = DEPTS.find((d) => d.id === modal.deptId);
  const action = MODULE_ACTIONS[modal.deptId][modal.actionIndex];
  const fields = DEPT_FORM_FIELDS[modal.deptId + ':' + modal.actionIndex] || [];
  const [values, setValues] = useState(() => fields.map((f) => prefillFor(f[0], citizen)));
  const [invalid, setInvalid] = useState([]);
  const [showError, setShowError] = useState(false);
  const [busy, setBusy] = useState(false);

  const setValue = (i, v) => setValues((vs) => vs.map((x, j) => (j === i ? v : x)));

  async function submit(e) {
    e?.preventDefault();
    const bad = fields.map((f, i) => (f[2] && !values[i].trim() ? i : -1)).filter((i) => i >= 0);
    setInvalid(bad);
    setShowError(bad.length > 0);
    if (bad.length) { document.getElementById('df-' + bad[0])?.focus(); return; }
    setBusy(true);
    try {
      const { reference } = await api.submitRequest({
        deptId: modal.deptId,
        actionIndex: modal.actionIndex,
        fields: fields.map((f, i) => ({ label: f[0], value: values[i].trim() })),
      });
      onClose();
      toast(action.title + ' submitted successfully. Reference ' + reference + '.', 'success');
    } catch (err) {
      setBusy(false);
      toast(err.message, 'error');
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-head">
        <div>
          <h2 id="modal-title" style={{ fontSize: 18 }}>{action.title}</h2>
          <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 4 }}>{dept.name} · {action.desc}</p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="modal-body">
        {citizen && (
          <div className="helpbox" style={{ marginTop: 0, marginBottom: 18 }}>
            <IconFor name="flow" />
            <span>Pre-filled for <strong>{fullName(citizen)}</strong> ({citizen.nid}) from the central registry.</span>
          </div>
        )}
        <form onSubmit={submit} noValidate>
          {showError && (
            <div className="err-msg" role="alert" style={{ marginBottom: 14 }}>
              <IconFor name="alert" /><span>Please complete all required fields before submitting.</span>
            </div>
          )}
          {fields.map(([label, type, required, options], i) => {
            const id = 'df-' + i;
            const common = { id, className: invalid.includes(i) ? 'err' : '', value: values[i], maxLength: 1000, onChange: (e) => setValue(i, e.target.value) };
            return (
              <div className="form-group" key={id}>
                <label htmlFor={id} className={required ? 'req' : ''}>{label}</label>
                {type === 'select' ? (
                  <select {...common}><option value="">Select…</option>{options.map((o) => <option key={o}>{o}</option>)}</select>
                ) : type === 'textarea' ? (
                  <textarea {...common} />
                ) : (
                  <input type={type} {...common} />
                )}
              </div>
            );
          })}
        </form>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={busy}>Submit request</button>
      </div>
    </ModalShell>
  );
}
