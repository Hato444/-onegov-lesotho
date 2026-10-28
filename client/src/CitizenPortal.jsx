import { useMemo, useState } from 'react';
import { Icon } from './icons.jsx';

const SERVICES = [
  'National ID Application', 'Passport Application', 'Police Clearance Request',
  'Driver Licence Renewal', 'Pension Registration', 'Birth Certificate',
];

const NAV = [
  ['dashboard', 'Dashboard', 'dashboard'],
  ['apply', 'Apply for Service', 'plus'],
  ['apps', 'My Applications', 'doc'],
  ['profile', 'My Profile', 'users'],
];

export default function CitizenPortal({ user, onSignOut }) {
  const [view, setView] = useState('dashboard');
  const [apps, setApps] = useState([]);
  const [service, setService] = useState(SERVICES[0]);
  const [notice, setNotice] = useState('');
  const [modal, setModal] = useState(false);

  const pending = useMemo(() => apps.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length, [apps]);

  function apply(e) {
    e.preventDefault();
    const ref = 'APP-' + (1001 + apps.length);
    setApps((list) => [{ ref, service, status: 'Submitted', at: 'Just now' }, ...list]);
    setNotice('Application ' + ref + ' submitted. It has been routed to the responsible department.');
    setView('apps');
  }

  let content;
  if (view === 'dashboard') {
    content = (
      <>
        <div className="card pad" style={{ marginBottom: 18, background: 'linear-gradient(120deg, var(--blue-900), var(--blue-700))', color: '#fff', border: 'none' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff' }}>Citizen Dashboard</h1>
          <p style={{ color: '#CBDAF3', marginTop: 4 }}>Welcome, {user.name} · National ID {user.nid}</p>
        </div>
        <div className="grid g4" style={{ marginBottom: 18 }}>
          <div className="card pad kpi"><div className="num">{apps.length}</div><div className="lbl">My Applications</div></div>
          <div className="card pad kpi"><div className="num">{pending}</div><div className="lbl">Pending Actions</div></div>
          <div className="card pad kpi"><div className="num">{apps.filter((a) => a.status === 'Approved').length}</div><div className="lbl">Completed Services</div></div>
          <div className="card pad kpi"><div className="num">1</div><div className="lbl">Verified Identity</div></div>
        </div>
        <div className="grid g2">
          <div className="card pad">
            <div className="section-title">Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <button className="btn btn-outline" onClick={() => setView('apply')}>Apply for Service</button>
              <button className="btn btn-outline" onClick={() => setView('apps')}>View My Applications</button>
              <button className="btn btn-outline" onClick={() => setView('profile')}>My Profile</button>
            </div>
          </div>
          <div className="card pad">
            <div className="section-title">Recent Applications</div>
            {apps.length ? apps.slice(0, 3).map((a) => (
              <div key={a.ref} style={{ padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <strong>{a.service}</strong> · {a.status}
              </div>
            )) : <p style={{ color: 'var(--ink-500)', marginTop: 8 }}>No applications yet.</p>}
            {notice && <p style={{ color: 'var(--green-700)', fontSize: 13, marginTop: 10 }}>{notice}</p>}
          </div>
        </div>
      </>
    );
  } else if (view === 'apply') {
    content = (
      <div className="card pad">
        <div className="section-title">Apply for a Service</div>
        <div className="section-sub">Your request is routed automatically to the responsible department.</div>
        <form onSubmit={apply} style={{ marginTop: 16, maxWidth: 520 }}>
          <div className="form-group">
            <label className="req">Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input type="text" placeholder="Optional details" />
          </div>
          <button type="submit" className="btn btn-green">Submit application</button>
        </form>
      </div>
    );
  } else if (view === 'apps') {
    content = (
      <div className="card">
        <div className="pad"><div className="section-title">My Applications</div></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Ref</th><th>Service</th><th>Status</th><th>Submitted</th></tr></thead>
            <tbody>
              {apps.length ? apps.map((a) => (
                <tr key={a.ref}><td>{a.ref}</td><td>{a.service}</td><td><span className="pill pill-blue">{a.status}</span></td><td>{a.at}</td></tr>
              )) : <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-500)', padding: 24 }}>No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="card pad">
        <div className="section-title">My Profile</div>
        <div style={{ marginTop: 14, display: 'grid', gap: 10, maxWidth: 480 }}>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>National ID:</strong> {user.nid}</div>
          <div><strong>Account type:</strong> Citizen (verified)</div>
          <div><strong>District:</strong> Maseru</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="shell">
        <nav className="sidebar" aria-label="Primary">
          <div className="brand">
            <div className="brand-mark"><Icon name="users" size={22} /></div>
            <div className="brand-text"><div className="t1">OneGov Lesotho</div><div className="t2">Citizen Portal</div></div>
          </div>
          <div className="navsection-label">Citizen Services</div>
          {NAV.map(([v, label, icon]) => (
            <button key={v} className={'navitem ' + (view === v ? 'active' : '')} onClick={() => setView(v)}>
              <Icon name={icon} size={18} /><span>{label}</span>
            </button>
          ))}
          <div className="sidebar-foot">Government of the Kingdom of Lesotho<br />Citizen session · v2.5</div>
        </nav>
        <div className="main">
          <header className="topbar">
            <div><div className="crumbtitle">Citizen Portal</div><div className="crumb">{user.name}</div></div>
            <div className="topbar-spacer" />
            <div className="user-chip" tabIndex={0} role="button" onClick={() => setModal(true)}>
              <div className="avatar">{user.initials}</div>
              <div><div className="un">{user.name}</div><div className="rl">Citizen</div></div>
              <Icon name="chevron" size={14} />
            </div>
          </header>
          <main className="content" tabIndex={-1}>{content}</main>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 10 }}>Sign out</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-600)', marginBottom: 20 }}>You will return to the portal selection screen.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={onSignOut}>Sign out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
