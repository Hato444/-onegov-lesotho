import { useEffect, useState } from 'react';
import { Icon } from './icons.jsx';
import { NAV_MAIN, NAV_DEPTS, VIEW_TITLES } from './constants.js';
import { api } from './api.js';
import { useToast } from './toast.jsx';
import { onActivate } from './util.js';
import { ConfirmModal, DeptActionModal, SendDeptRequestModal } from './components/Modals.jsx';
import Dashboard from './views/Dashboard.jsx';
import Search from './views/Search.jsx';
import Profile from './views/Profile.jsx';
import DeptModule from './views/DeptModule.jsx';
import Notifications from './views/Notifications.jsx';
import Analytics from './views/Analytics.jsx';
import Requests from './views/Requests.jsx';

const EMPTY_SEARCH = { type: 'nid', value: '', results: null, attempted: false, advOpen: false, filters: { district: '', gender: '', flags: '' } };

export default function Portal({ user, onSignOut }) {
  const toast = useToast();
  const [view, setView] = useState('dashboard');
  const [citizen, setCitizen] = useState(null);
  const [profileTab, setProfileTab] = useState('personal');
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState(EMPTY_SEARCH);
  const [modal, setModal] = useState(null);
  const [topQuery, setTopQuery] = useState('');
  const myDepts = NAV_DEPTS.filter((n) => n.v === user.deptId);

  useEffect(() => { api.notifications().then((r) => setNotifications(r.notifications)).catch(() => {}); }, []);

  function go(v) {
    if (v === 'search') setSearch((s) => ({ ...s, results: null, attempted: false }));
    setView(v);
    window.scrollTo(0, 0);
  }

  async function openProfile(id) {
    try {
      const { citizen: c } = await api.citizen(id);
      setCitizen(c);
      setProfileTab('personal');
      setView('profile');
      window.scrollTo(0, 0);
    } catch (e) { toast(e.message, 'error'); }
  }

  async function runSearch(override) {
    const s = { ...search, ...override };
    setSearch(s);
    if (!s.value.trim()) {
      setSearch({ ...s, results: [], attempted: true });
      toast('Enter a value to search for.', 'error');
      return;
    }
    try {
      const params = { type: s.type, q: s.value.trim() };
      Object.entries(s.filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { results } = await api.search(params);
      setSearch({ ...s, results, attempted: true });
      toast(results.length + ' record(s) found across the central registry.');
    } catch (e) { toast(e.message, 'error'); }
  }

  function onTopSearch(e) {
    if (e.key === 'Enter' && topQuery.trim()) {
      runSearch({ type: 'name', value: topQuery.trim() });
      setTopQuery('');
      setView('search');
    }
  }

  function openAction(deptId, actionIndex) {
    const open = () => setModal({ kind: 'deptaction', deptId, actionIndex });
    if (citizen) return open();
    setModal({
      kind: 'confirm', title: 'No citizen selected', confirmLabel: 'Continue anyway', onConfirm: open,
      message: 'You can still open this form and search mid-way, or find a citizen first for a pre-filled request. Continue without a selected citizen?',
    });
  }

  function askSignOut() {
    setModal({
      kind: 'confirm', title: 'Sign out', confirmLabel: 'Sign out',
      message: 'You will be signed out of OneGov Lesotho and returned to the login screen. Any unsaved form data will be lost.',
      onConfirm: async () => { await api.logout().catch(() => {}); onSignOut(); },
    });
  }

  const closeModal = () => setModal(null);
  const confirmModal = () => { const cb = modal.onConfirm; setModal(null); cb?.(); };

  const [title, sub] = VIEW_TITLES[view] || ['OneGov', ''];
  const navItem = (n) => {
    const active = view === n.v || (n.v === 'search' && view === 'profile');
    return <button key={n.v} className={'navitem ' + (active ? 'active' : '')} onClick={() => go(n.v)}><Icon name={n.icon} size={18} /><span>{n.label}</span></button>;
  };

  let content;
  if (view === 'dashboard') content = <Dashboard user={user} notifications={notifications} go={go} />;
  else if (view === 'search') content = <Search search={search} setSearch={setSearch} runSearch={() => runSearch()} openProfile={openProfile} go={go} />;
  else if (view === 'profile') content = <Profile citizen={citizen} tab={profileTab} setTab={setProfileTab} go={go} user={user} onRequestInfo={() => setModal({ kind: 'deptrequest' })} />;
  else if (view === user.deptId) {
    content = <DeptModule id={view} citizen={citizen} go={go} openProfile={openProfile} onAction={openAction}
      clearContext={() => { setCitizen(null); toast('Citizen context cleared.'); }}
      viewContextProfile={() => { setProfileTab('personal'); go('profile'); }}
      onRequestInfo={() => setModal({ kind: 'deptrequest' })} />;
  }
  else if (view === 'requests') content = <Requests user={user} go={go} />;
  else if (view === 'notifications') content = <Notifications notifications={notifications} go={go} openProfile={openProfile} />;
  else if (view === 'analytics') content = <Analytics go={go} />;
  else content = <Dashboard user={user} notifications={notifications} go={go} />;

  return (
    <>
      <div className="shell">
        <nav className="sidebar" aria-label="Primary">
          <div className="brand">
            <div className="brand-mark"><Icon name="shield" size={22} /></div>
            <div className="brand-text"><div className="t1">OneGov Lesotho</div><div className="t2">Integrated Services Platform</div></div>
          </div>
          <div className="navsection-label">Overview</div>
          {NAV_MAIN.map(navItem)}
          <div className="navsection-label">My Department</div>
          {myDepts.map(navItem)}
          <div className="sidebar-foot">Government of the Kingdom of Lesotho<br />Secure session v2.4</div>
        </nav>
        <div className="main">
          <header className="topbar">
            <div><div className="crumbtitle">{title}</div><div className="crumb">{sub}</div></div>
            <div className="topbar-spacer" />
            <div className="topbar-search" role="search">
              <Icon name="search" size={17} />
              <input type="text" placeholder="Search by National ID, Passport or Name" aria-label="Search citizens" maxLength={100}
                value={topQuery} onChange={(e) => setTopQuery(e.target.value)} onKeyDown={onTopSearch} />
            </div>
            <button className="icon-btn" onClick={() => go('notifications')} aria-label={'Notifications, ' + notifications.length + ' unread'}>
              <Icon name="bell" size={18} /><span className="badge-dot">{notifications.length}</span>
            </button>
            <div className="user-chip" tabIndex={0} role="button" aria-haspopup="true" onClick={askSignOut} onKeyDown={onActivate(askSignOut)}>
              <div className="avatar">{user.initials}</div>
              <div><div className="un">{user.name}</div><div className="rl">{user.role}{user.deptId ? ' - ' + (NAV_DEPTS.find((d) => d.v === user.deptId)?.label || '') + ' Workspace' : ''}</div></div>
              <Icon name="chevron" size={14} />
            </div>
          </header>
          <main id="main-content" className="content" tabIndex={-1}>{content}</main>
        </div>
      </div>
      {modal?.kind === 'confirm' && <ConfirmModal modal={modal} onClose={closeModal} onConfirm={confirmModal} />}
      {modal?.kind === 'deptaction' && <DeptActionModal key={modal.deptId + modal.actionIndex} modal={modal} citizen={citizen} onClose={closeModal} />}
      {modal?.kind === 'deptrequest' && <SendDeptRequestModal citizen={citizen} deptId={user.deptId} onClose={closeModal} />}
    </>
  );
}
