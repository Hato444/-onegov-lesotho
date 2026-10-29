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

const REQUEST_TYPES = ['Identity Verification', 'Records Check', 'Document Verification', 'Clearance Assistance', 'Other'];
const STATUSES = ['Pending', 'In Progress', 'Information Required', 'Completed', 'Rejected'];

export function SendDeptRequestModal({ onClose, citizen, deptId }) {
  const toast = useToast();
  const [toDepartment, setToDepartment] = useState('');
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0]);
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e?.preventDefault();
    if (!citizen) { toast('Select a citizen first.', 'error'); return; }
    if (!toDepartment || !message.trim()) { toast('Choose a department and enter a reason.', 'error'); return; }
    setBusy(true);
    try {
      await api.sendDeptRequest({ toDepartment, citizenId: citizen.id, requestType, message: message.trim(), priority });
      onClose();
      toast('Department request sent to ' + DEPTS.find((d) => d.id === toDepartment).name + '.', 'success');
    } catch (err) { setBusy(false); toast(err.message, 'error'); }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-head">
        <div>
          <h2 id="modal-title" style={{ fontSize: 18 }}>Send department request</h2>
          <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 4 }}>
            {citizen ? `Citizen: ${fullName(citizen)} (${citizen.nid})` : 'No citizen selected'}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="modal-body">
        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="req">To department</label>
            <select value={toDepartment} onChange={(e) => setToDepartment(e.target.value)}>
              <option value="">Select department...</option>
              {DEPTS.filter((d) => d.id !== deptId).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="req">Request type</label>
            <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
              {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="req">Message / reason</label>
            <textarea value={message} maxLength={1000} onChange={(e) => setMessage(e.target.value)} placeholder="Explain what you need from the other department." />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Normal</option><option>Urgent</option>
            </select>
          </div>
        </form>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={busy}>Send request</button>
      </div>
    </ModalShell>
  );
}

export function DeptRequestModal({ request, canRespond, onClose, onSaved }) {
  const toast = useToast();
  const [status, setStatus] = useState(request.status);
  const [response, setResponse] = useState(request.response || '');
  const [busy, setBusy] = useState(false);
  const deptName = (id) => DEPTS.find((d) => d.id === id)?.name || 'Citizen';

  async function save() {
    setBusy(true);
    try {
      const { request: updated } = await api.updateDeptRequest(request.id, { status, response });
      toast('Request ' + updated.id + ' updated.', 'success');
      onSaved?.(updated);
      onClose();
    } catch (err) { setBusy(false); toast(err.message, 'error'); }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-head">
        <div>
          <h2 id="modal-title" style={{ fontSize: 18 }}>Request {request.id}</h2>
          <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 4 }}>
            {deptName(request.fromDepartment)} {'->'} {deptName(request.toDepartment)} | {request.priority}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="modal-body">
        <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
          <div><strong>Citizen:</strong> {request.citizenName}</div>
          <div><strong>Type:</strong> {request.requestType}</div>
          <div><strong>Status:</strong> {request.status}</div>
          <div><strong>Message:</strong> {request.message}</div>
          {request.response && <div style={{ marginTop: 8 }}><strong>Response:</strong> {request.response}</div>}
        </div>
        {canRespond && (
          <div style={{ marginTop: 18 }}>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Response</label>
              <textarea value={response} maxLength={2000} onChange={(e) => setResponse(e.target.value)} placeholder="Write the response for the sending department." />
            </div>
          </div>
        )}
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost" onClick={onClose}>{canRespond ? 'Cancel' : 'Close'}</button>
        {canRespond && <button className="btn btn-primary" onClick={save} disabled={busy}>Save response</button>}
      </div>
    </ModalShell>
  );
}
