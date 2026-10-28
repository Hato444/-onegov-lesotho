import { useEffect, useState } from 'react';
import { Icon } from '../icons.jsx';
import { DEPTS } from '../constants.js';
import { api } from '../api.js';
import { st, onActivate } from '../util.js';
import NotifRow from '../components/NotifRow.jsx';

export default function Dashboard({ user, notifications, go }) {
  const [data, setData] = useState({ stats: [], caseCounts: {}, activity: [] });
  useEffect(() => { api.dashboard().then(setData).catch(() => {}); }, []);

  return (
    <>
      <div className="card pad" style={st('margin-bottom:20px; background:linear-gradient(120deg, var(--blue-900), var(--blue-700)); color:#fff; border:none;')}>
        <div style={st('display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap;')}>
          <div>
            <h1 style={st('font-family:var(--font-display); font-weight:600; font-size:26px; color:#fff;')}>Good day, Officer {user.name.split(' ')[0]}</h1>
            <p style={st('color:#CBDAF3; font-size:14px; margin-top:6px; max-width:520px;')}>You're signed in at {user.office}. All six department systems are online and synchronised with the central citizen registry.</p>
          </div>
          <button className="btn btn-green" onClick={() => go('search')}><Icon name="search" size={17} /> Search a citizen</button>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 20 }}>
        {data.stats.map((s) => (
          <div className="card pad kpi" key={s.lbl}>
            <div className="num">{s.num}</div>
            <div className="lbl">{s.lbl}</div>
            <div className={'delta ' + s.dir}><Icon name="trend" size={12} /> {s.delta}</div>
          </div>
        ))}
      </div>

      <div className="section-title" style={{ marginBottom: 10, fontSize: 16 }}>Departments</div>
      <div className="grid g3" style={{ marginBottom: 22 }}>
        {DEPTS.map((d) => (
          <div className="dept-card" key={d.id} style={{ '--accent': d.color, '--accent-soft': d.soft }} tabIndex={0} role="button"
            aria-label={'Open ' + d.name + ' module'} onClick={() => go(d.id)} onKeyDown={onActivate(() => go(d.id))}>
            <div className="dc-top"><div className="dc-ic"><Icon name={d.icon} size={21} /></div><div className="dc-title">{d.name}</div></div>
            <div className="dc-desc">{d.desc}</div>
            <div className="dc-foot"><span>{data.caseCounts[d.id] || 0} open cases</span><span>Open →</span></div>
          </div>
        ))}
      </div>

      <div className="grid g2">
        <div className="card pad">
          <div style={st('display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;')}>
            <div><div className="section-title">Notifications</div><div className="section-sub">Latest cross-department alerts</div></div>
            <button className="btn btn-ghost btn-sm" onClick={() => go('notifications')}>View all</button>
          </div>
          {notifications.slice(0, 4).map((n) => <NotifRow key={n.id} n={n} />)}
        </div>
        <div className="card pad">
          <div style={{ marginBottom: 12 }}><div className="section-title">Recent activity</div><div className="section-sub">Actions across the platform</div></div>
          {data.activity.map((a, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-dot" />
              <div>
                <div style={{ fontSize: 13.5 }}><strong>{a.who}</strong> {a.what}</div>
                <div style={st('font-size:11.5px; color:var(--ink-300); margin-top:2px;')}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
