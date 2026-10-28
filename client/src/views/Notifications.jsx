import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { st } from '../util.js';
import NotifRow from '../components/NotifRow.jsx';

const CATS = [['all', 'All'], ['missing', 'Missing Documents'], ['pending', 'Pending Verifications'], ['approval', 'Approvals'], ['rejection', 'Rejections']];
const KPIS = [['missing', 'Missing documents', 'amber'], ['pending', 'Pending verifications', 'blue'], ['approval', 'Approvals', 'green'], ['rejection', 'Rejections', 'red']];

export default function Notifications({ notifications, go, openProfile }) {
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? notifications : notifications.filter((n) => n.cat === filter);
  const count = (cat) => notifications.filter((n) => n.cat === cat).length;

  return (
    <>
      <div className="breadcrumb"><button onClick={() => go('dashboard')}>Dashboard</button><span className="sep">/</span><span>Notification Center</span></div>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        {KPIS.map(([cat, label, color]) => (
          <div className="card pad kpi" key={cat}><div className="num" style={{ color: `var(--${color}-700)` }}>{count(cat)}</div><div className="lbl">{label}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="pad" style={st('padding-bottom:14px; display:flex; gap:8px; flex-wrap:wrap;')}>
          {CATS.map(([v, l]) => (
            <button key={v} className={'pill ' + (filter === v ? 'pill-blue' : 'pill-gray')} onClick={() => setFilter(v)} style={st('cursor:pointer;border:none;padding:8px 14px;font-size:13px;')}>{l}</button>
          ))}
        </div>
        <div className="pad" style={{ paddingTop: 0 }}>
          {list.length
            ? list.map((n) => <NotifRow key={n.id} n={n} large onView={(x) => openProfile(x.citizenId)} />)
            : <div className="empty"><Icon name="bell" size={40} /><h3>All clear</h3><p>No notifications in this category.</p></div>}
        </div>
      </div>
    </>
  );
}
