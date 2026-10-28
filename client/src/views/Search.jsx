import { Icon } from '../icons.jsx';
import { DISTRICTS, SEARCH_TYPES, SEARCH_LABEL, SEARCH_PLACEHOLDER } from '../constants.js';
import { st, fullName, onActivate } from '../util.js';

export default function Search({ search, setSearch, runSearch, openProfile, go }) {
  const { type, value, results, attempted, advOpen, filters } = search;
  const setFilter = (k, v) => setSearch((s) => ({ ...s, filters: { ...s.filters, [k]: v } }));
  const dash = <span style={{ color: 'var(--ink-300)' }}>—</span>;

  return (
    <>
      <div className="breadcrumb"><button onClick={() => go('dashboard')}>Dashboard</button><span className="sep">/</span><span>Citizen Search</span></div>
      <div className="card pad" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 2 }}>Find a citizen</div>
        <div className="section-sub" style={{ marginBottom: 18 }}>Every department reads and writes to this single record — search once, see everything.</div>
        <form onSubmit={(e) => { e.preventDefault(); runSearch(); }} noValidate>
          <div className="tabs" style={{ borderBottom: 'none', marginBottom: 14, gap: 8 }}>
            {SEARCH_TYPES.map(([v, l]) => (
              <button type="button" key={v} className={'pill ' + (type === v ? 'pill-blue' : 'pill-gray')}
                onClick={() => setSearch((s) => ({ ...s, type: v }))} style={st('cursor:pointer; border:none; padding:8px 14px; font-size:13px;')}>{l}</button>
            ))}
          </div>
          <div style={st('display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap;')}>
            <div className="form-group" style={st('flex:1; min-width:240px; margin-bottom:0;')}>
              <label htmlFor="search-input">{SEARCH_LABEL[type]}</label>
              <input type="text" id="search-input" placeholder={SEARCH_PLACEHOLDER[type]} value={value} maxLength={100} autoFocus
                onChange={(e) => setSearch((s) => ({ ...s, value: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary"><Icon name="search" size={16} /> Search</button>
            <button type="button" className="btn btn-ghost" onClick={() => setSearch((s) => ({ ...s, advOpen: !s.advOpen }))}><Icon name="filter" size={16} /> Advanced filters</button>
          </div>
          {advOpen && (
            <div className="grid g3" style={st('margin-top:16px; padding-top:16px; border-top:1px solid var(--line);')}>
              <div className="form-group" style={{ marginBottom: 0 }}><label htmlFor="adv-district">District</label>
                <select id="adv-district" value={filters.district} onChange={(e) => setFilter('district', e.target.value)}>
                  <option value="">Any district</option>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label htmlFor="adv-gender">Gender</label>
                <select id="adv-gender" value={filters.gender} onChange={(e) => setFilter('gender', e.target.value)}>
                  <option value="">Any</option><option>Male</option><option>Female</option>
                </select></div>
              <div className="form-group" style={{ marginBottom: 0 }}><label htmlFor="adv-flags">Has flagged documents</label>
                <select id="adv-flags" value={filters.flags} onChange={(e) => setFilter('flags', e.target.value)}>
                  <option value="">Any</option><option value="yes">Missing documents only</option><option value="no">Complete records only</option>
                </select></div>
            </div>
          )}
        </form>
      </div>

      {results && results.length === 0 && attempted && (
        <div className="card"><div className="empty"><Icon name="search" size={44} /><h3 style={{ marginBottom: 6 }}>No matching records</h3><p>Check the number and try again, or broaden your advanced filters.</p></div></div>
      )}
      {results && results.length > 0 && (
        <div className="card">
          <div className="pad" style={{ paddingBottom: 0 }}>
            <div className="section-title">Results</div>
            <div className="section-sub" style={{ marginBottom: 14 }}>{results.length} citizen{results.length === 1 ? '' : 's'} found</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Name</th><th>National ID</th><th>District</th><th>Passport</th><th>Employee No.</th><th>Record status</th><th></th></tr></thead>
              <tbody>
                {results.map((c) => (
                  <tr key={c.id} tabIndex={0} onClick={() => openProfile(c.id)} onKeyDown={onActivate(() => openProfile(c.id))}>
                    <td style={{ fontWeight: 700 }}>{fullName(c)}</td>
                    <td>{c.nid}</td>
                    <td>{c.district}</td>
                    <td>{c.passport || dash}</td>
                    <td>{c.empNo || dash}</td>
                    <td>{c.flags.missingDocs > 0
                      ? <span className="pill pill-amber">{c.flags.missingDocs} doc{c.flags.missingDocs > 1 ? 's' : ''} missing</span>
                      : <span className="pill pill-green">Complete</span>}</td>
                    <td style={{ textAlign: 'right', color: 'var(--blue-700)', fontWeight: 700 }}>Open →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
