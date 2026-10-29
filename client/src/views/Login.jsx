import { useState } from 'react';
import { Icon, IconFor } from '../icons.jsx';
import { ForgotModal } from '../components/Modals.jsx';
import { api } from '../api.js';
import { useToast } from '../toast.jsx';
import { st } from '../util.js';

const DEPARTMENTS = [
  ['homeaffairs', 'Home Affairs'],
  ['police', 'Police'],
  ['traffic', 'Traffic'],
  ['passport', 'Passport'],
  ['finance', 'Finance'],
  ['pension', 'Pensions'],
];

export default function Login({ onLoggedIn }) {
  const toast = useToast();
  const [step, setStep] = useState('role');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  function chooseRole(role) {
    setError('');
    setUsername(''); setPassword(''); setDepartment('');
    setStep(role);
  }

  async function submitOfficer(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter both your username and password to continue.');
      document.getElementById('lf-user')?.focus();
      return;
    }
    if (!department) {
      setError('Select your department to continue.');
      document.getElementById('lf-dept')?.focus();
      return;
    }
    setError('');
    setBusy(true);
    try {
      const { user } = await api.login({ username: username.trim(), password, remember, department });
      onLoggedIn(user);
      toast('Welcome back, ' + user.name.split(' ')[0] + '. ' + user.role + ' workspace loaded.', 'success');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function submitCitizen(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter both your National ID and password to continue.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const { user } = await api.login({ username: username.trim(), password });
      onLoggedIn(user);
      toast('Welcome, ' + user.name.split(' ')[0] + '. Your citizen dashboard is ready.', 'success');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }


  const stat = (n, label) => (
    <div>
      <div style={st('font-family:var(--font-display); font-size:26px; font-weight:700;')}>{n}</div>
      <div style={st('font-size:12px;color:#CBDAF3;')}>{label}</div>
    </div>
  );

  return (
    <>
      <div className="login-wrap">
        <div className="login-side">
          <div>
            <div className="gov-mark"><Icon name="shield" size={32} /></div>
            <div className="stripe3"><span style={{ background: '#1D52A8' }} /><span style={{ background: '#fff' }} /><span style={{ background: '#00843D' }} /></div>
            <h1 className="login-title" style={{ color: '#fff', fontSize: 34 }}>OneGov Lesotho</h1>
            <p className="tag">Integrated Government Services Platform â€” one secure identity connecting Home Affairs, Pensions, Finance, Police, Traffic and Passport Services.</p>
          </div>
          <div style={st('display:flex; gap:28px; flex-wrap:wrap;')}>
            {stat('6', 'Departments unified')}
            {stat('14,203', 'Citizen records')}
            {stat('10', 'Districts served')}
          </div>
        </div>
        <div className="login-form-side">
          <div className="login-card">
            {step === 'role' && (
              <>
                <h2 style={{ fontSize: 21, marginBottom: 4 }}>Sign in to OneGov</h2>
                <p style={st('color:var(--ink-500); font-size:13.5px; margin-bottom:26px;')}>Choose how you want to continue.</p>
                <button type="button" className="btn btn-primary" style={{ width: '100%', padding: 14, marginBottom: 12 }} onClick={() => chooseRole('citizen')}>
                  <Icon name="users" size={17} /> Continue as Citizen
                </button>
                <button type="button" className="btn btn-outline" style={{ width: '100%', padding: 14 }} onClick={() => chooseRole('officer')}>
                  <Icon name="shield" size={17} /> Government Staff Login
                </button>
                <div className="helpbox" style={{ marginTop: 20 }}><IconFor name="info" /><span>Citizen: <strong>001</strong> / <strong>citizen123</strong><br />Officer: <strong>GOV-04417</strong> / <strong>OneGov!2026</strong> Â· Department: <strong>Police</strong></span></div>
              </>
            )}

            {step === 'citizen' && (
              <>
                <button type="button" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={() => chooseRole('role')}><Icon name="chevron" size={14} /> Back to role selection</button>
                <h2 style={{ fontSize: 21, marginBottom: 4 }}>Citizen sign in</h2>
                <p style={st('color:var(--ink-500); font-size:13.5px; margin-bottom:26px;')}>Access your identity, services and applications.</p>
                <form onSubmit={submitCitizen} noValidate>
                  <div className="form-group">
                    <label htmlFor="lf-user" className="req">National ID</label>
                    <input type="text" id="lf-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. 001" autoComplete="off" maxLength={100} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lf-pass" className="req">Password</label>
                    <input type="password" id="lf-pass" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="off" maxLength={200} />
                  </div>
                  {error && <div className="err-msg" role="alert" style={{ marginBottom: 14 }}><IconFor name="alert" /><span>{error}</span></div>}
                  <button type="submit" className="btn btn-green" style={{ width: '100%', padding: 13 }} disabled={busy}>Sign in as Citizen</button>
                </form>
              </>
            )}

            {step === 'officer' && (
              <>
                <button type="button" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={() => chooseRole('role')}><Icon name="chevron" size={14} /> Back to role selection</button>
                <h2 style={{ fontSize: 21, marginBottom: 4 }}>Government staff login</h2>
                <p style={st('color:var(--ink-500); font-size:13.5px; margin-bottom:26px;')}>Sign in to your department workspace.</p>
                <form onSubmit={submitOfficer} noValidate>
                  <div className="form-group">
                    <label htmlFor="lf-user" className="req">Username or employee number</label>
                    <input type="text" id="lf-user" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. GOV-04417" autoComplete="off" spellCheck={false} maxLength={100} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lf-pass" className="req">Password</label>
                    <input type="password" id="lf-pass" name="onegov-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password" spellCheck={false} maxLength={200} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lf-dept" className="req">Department</label>
                    <select id="lf-dept" value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option value="">Select your departmentâ€¦</option>
                      {DEPARTMENTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <div className="form-hint">Must match your assigned department.</div>
                  </div>
                  {error && <div className="err-msg" role="alert" style={{ marginBottom: 14 }}><IconFor name="alert" /><span>{error}</span></div>}
                  <div style={st('display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;')}>
                    <label style={st('display:flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--ink-700);')}>
                      <input type="checkbox" style={{ width: 'auto' }} checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Keep me signed in
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); setForgot(true); }} style={{ fontSize: 13, fontWeight: 700 }}>Forgot password?</a>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 13 }} disabled={busy}>Sign in</button>
                </form>
                <div className="helpbox"><IconFor name="info" /><span>Demo officer: <strong>GOV-04417</strong> / <strong>OneGov!2026</strong> Â· Department: <strong>Police</strong></span></div>
              </>
            )}
          </div>
        </div>
      </div>
      {forgot && <ForgotModal onClose={() => setForgot(false)} />}
    </>
  );
}

