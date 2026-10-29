import { useEffect, useState } from 'react';
import { Icon } from '../icons.jsx';
import { DEPTS, MODULE_ACTIONS, MODULE_TABLE } from '../constants.js';
import { api } from '../api.js';
import { st, fullName, initials, onActivate } from '../util.js';

export default function DeptModule({ id, citizen, go, openProfile, onAction, clearContext, viewContextProfile, onRequestInfo }) {
  const dept = DEPTS.find((d) => d.id === id);
  const actions = MODULE_ACTIONS[id];
  const tbl = MODULE_TABLE[id];
  const [citizens, setCitizens] = useState([]);
  useEffect(() => { api.citizens().then((r) => setCitizens(r.citizens)).catch(() => {}); }, [id]);

  const ghost = st('color:#fff; border-color:rgba(255,255,255,.35);');
  return (
    <>
      <div className="breadcrumb"><button onClick={() => go('dashboard')}>Dashboard</button><span className="sep">/</span><span>{dept.name}</span></div>

      {citizen ? (
        <div className="citizen-context">
          <div className="cc-av">{initials(citizen)}</div>
          <div>
            <div className="cc-name">Active citizen: {fullName(citizen)}</div>
            <div className="cc-meta">{citizen.nid} · Forms below will pre-fill from the central registry</div>
          </div>
          <div className="cc-actions">
            <button className="btn btn-ghost btn-sm" style={ghost} onClick={viewContextProfile}>View profile</button>
            <button className="btn btn-ghost btn-sm" style={ghost} onClick={onRequestInfo}>Request information</button>
            <button className="btn btn-ghost btn-sm" style={ghost} onClick={clearContext}>Clear</button>
          </div>
        </div>
      ) : (
        <div className="card pad" style={st('margin-bottom:20px; display:flex; align-items:center; gap:14px; background:var(--blue-50); border-color:var(--blue-100);')}>
          <Icon name="info" size={20} />
          <div style={st('flex:1; font-size:13.5px; color:var(--blue-800);')}>No citizen selected. Actions below will ask you to look up a citizen first, or{' '}
            <button onClick={() => go('search')} style={st('background:none;border:none;color:var(--blue-700);font-weight:700;cursor:pointer; padding:0; text-decoration:underline;')}>search now</button>.</div>
        </div>
      )}

      <div className="section-title" style={{ marginBottom: 10, fontSize: 16 }}>Services</div>
      <div className="grid g3" style={{ marginBottom: 24 }}>
        {actions.map((a, i) => (
          <div className="action-tile" key={a.title} tabIndex={0} role="button" onClick={() => onAction(id, i)} onKeyDown={onActivate(() => onAction(id, i))}>
            <div className="at-ic"><Icon name={a.icon} size={19} /></div>
            <div><div className="at-title">{a.title}</div><div className="at-desc">{a.desc}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="pad" style={st('padding-bottom:0; display:flex; justify-content:space-between; align-items:center;')}>
          <div>
            <div className="section-title">Recent {dept.name.toLowerCase()} records</div>
            <div className="section-sub" style={{ marginBottom: 14 }}>Pulled live from the shared citizen registry</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr>{tbl.cols.map((c) => <th key={c}>{c}</th>)}<th></th></tr></thead>
            <tbody>
              {citizens.map((c) => (
                <tr key={c.id} tabIndex={0} onClick={() => openProfile(c.id)} onKeyDown={onActivate(() => openProfile(c.id))}>
                  {tbl.rows(c).map((cell, i) => (
                    <td key={i}>{typeof cell === 'object' ? <span className={'pill pill-' + cell.pill}>{cell.label}</span> : cell}</td>
                  ))}
                  <td style={{ textAlign: 'right', color: 'var(--blue-700)', fontWeight: 700 }}>Open →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
