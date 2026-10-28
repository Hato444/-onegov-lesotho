import { useEffect, useState } from 'react';
import { Icon } from '../icons.jsx';
import { api } from '../api.js';
import { st } from '../util.js';

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function Analytics({ go }) {
  const [d, setD] = useState(null);
  useEffect(() => { api.analytics().then(setD).catch(() => {}); }, []);
  if (!d) return null;
  const maxDays = Math.max(...d.turnaround.map((t) => t.days));
  const maxTrend = Math.max(...d.trend);

  return (
    <>
      <div className="breadcrumb"><button onClick={() => go('dashboard')}>Dashboard</button><span className="sep">/</span><span>Analytics</span></div>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        {d.kpis.map((k) => (
          <div className="card pad kpi" key={k.lbl}><div className="num">{k.num}</div><div className="lbl">{k.lbl}</div>
            <div className={'delta ' + k.dir}><Icon name="trend" size={12} /> {k.delta}</div></div>
        ))}
      </div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card pad">
          <div className="section-title" style={{ marginBottom: 4 }}>Department performance</div>
          <div className="section-sub" style={{ marginBottom: 18 }}>Service-level compliance, last 30 days</div>
          {d.perf.map((p) => (
            <div className="bar-row" key={p.name}><div className="bar-label">{p.name}</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: p.val + '%', background: p.color }} /></div>
              <div className="bar-val">{p.val}%</div></div>
          ))}
        </div>
        <div className="card pad">
          <div className="section-title" style={{ marginBottom: 4 }}>Service turnaround times</div>
          <div className="section-sub" style={{ marginBottom: 18 }}>Average days to complete a request</div>
          {d.turnaround.map((t) => (
            <div className="bar-row" key={t.name}><div className="bar-label">{t.name}</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: ((t.days / maxDays) * 100).toFixed(0) + '%', background: 'var(--blue-600)' }} /></div>
              <div className="bar-val">{t.days}d</div></div>
          ))}
        </div>
      </div>

      <div className="card pad">
        <div className="section-title" style={{ marginBottom: 4 }}>Citizen service trends</div>
        <div className="section-sub" style={{ marginBottom: 18 }}>Total completed applications across all departments, last 12 months</div>
        <div style={st('display:flex; align-items:flex-end; gap:8px; height:150px; padding:0 4px;')}>
          {d.trend.map((v, i) => (
            <div key={i} title={String(v)} style={{ flex: 1, background: 'linear-gradient(180deg, var(--blue-600), var(--green-600))', borderRadius: '4px 4px 0 0', height: ((v / maxTrend) * 100).toFixed(0) + '%' }} />
          ))}
        </div>
        <div style={st('display:flex; gap:8px; padding:0 4px; margin-top:8px;')}>
          {MONTHS.map((m, i) => <div key={i} style={st('flex:1; text-align:center; font-size:11px; color:var(--ink-300); font-weight:700;')}>{m}</div>)}
        </div>
      </div>
    </>
  );
}
