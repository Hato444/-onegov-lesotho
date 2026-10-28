import { Icon } from '../icons.jsx';
import { PROFILE_TABS } from '../constants.js';
import { st, fullName, initials } from '../util.js';
import { useToast } from '../toast.jsx';

const SyncBadge = ({ dept }) => <span className="pill pill-blue" style={{ fontWeight: 600 }}><Icon name="flow" size={12} /> Synced from {dept}</span>;
const KV = ({ label, children }) => (
  <div style={st('display:flex; justify-content:space-between; gap:14px; padding:9px 0; border-bottom:1px solid var(--line-soft);')}>
    <span style={st('color:var(--ink-500); font-size:13px;')}>{label}</span>
    <strong style={st('font-size:13.5px; text-align:right;')}>{children}</strong>
  </div>
);
const Head = ({ title, sync }) => <div style={{ marginBottom: 18 }}><div className="section-title">{title}</div><SyncBadge dept={sync} /></div>;
const Sub = ({ children }) => <div style={st('font-weight:700; font-size:13.5px; margin-bottom:8px;')}>{children}</div>;
const None = ({ children }) => <p style={st('color:var(--ink-500); font-size:13px;')}>{children}</p>;
const Bullets = ({ items, empty }) => items.length
  ? items.map((x, i) => <div key={i} style={st('font-size:13.5px; padding:6px 0; border-bottom:1px solid var(--line-soft);')}>• {x}</div>)
  : <None>{empty}</None>;
const Block = ({ children }) => <div style={{ marginTop: 16 }}>{children}</div>;

function Tab({ c, tab }) {
  switch (tab) {
    case 'personal':
      return (
        <>
          <Head title="Personal information" sync="Home Affairs Civil Registry" />
          <div className="grid g2">
            <div>
              <KV label="Full name">{fullName(c)}</KV><KV label="Gender">{c.gender}</KV><KV label="Date of birth">{c.dob}</KV>
              <KV label="National ID">{c.nid}</KV><KV label="District">{c.district}</KV>
            </div>
            <div>
              <KV label="Phone">{c.contact.phone}</KV><KV label="Email">{c.contact.email}</KV><KV label="Address">{c.contact.address}</KV>
              <KV label="Marital status">{c.family.maritalStatus}</KV><KV label="Spouse">{c.family.spouse}</KV>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="section-title" style={{ marginBottom: 8 }}>Family information</div>
            {c.family.children.length
              ? <ul style={st('display:flex; flex-direction:column; gap:6px;')}>{c.family.children.map((ch) => <li key={ch} style={{ fontSize: 13.5 }}>• {ch}</li>)}</ul>
              : <None>No dependants on record.</None>}
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="section-title" style={{ marginBottom: 8 }}>Employment information</div>
            <KV label="Employer">{c.employment.employer}</KV><KV label="Position">{c.employment.position}</KV><KV label="Status">{c.employment.status}</KV>
          </div>
        </>
      );
    case 'finance':
      return (
        <>
          <Head title="Finance" sync="Ministry of Finance" />
          <KV label="Salary verified">{c.finance.salaryVerified ? <span className="pill pill-green">Verified</span> : <span className="pill pill-amber">Unverified</span>}</KV>
          <KV label="Monthly salary">{c.finance.monthlySalary}</KV>
          <Block><Sub>Loans</Sub>{c.finance.loans.length ? c.finance.loans.map((l) => <KV key={l.lender} label={l.lender}>{l.balance} — {l.status}</KV>) : <None>No active loans on record.</None>}</Block>
          <Block><Sub>Debts</Sub>{c.finance.debts.length ? c.finance.debts.map((d) => <KV key={d.creditor} label={d.creditor}>{d.amount} — {d.status}</KV>) : <None>No outstanding debts on record.</None>}</Block>
        </>
      );
    case 'pension':
      return (
        <>
          <Head title="Pension" sync="Pensions Department" />
          <KV label="Status">{c.pension.status}</KV><KV label="Fund number">{c.pension.fundNo}</KV><KV label="Contributions / payout">{c.pension.contributions}</KV>
          <Block><Sub>Beneficiaries</Sub><Bullets items={c.pension.beneficiaries} empty="No beneficiaries registered." /></Block>
        </>
      );
    case 'police':
      return (
        <>
          <Head title="Police" sync="Lesotho Mounted Police Service" />
          <KV label="Clearance status">{c.police.clearance === 'Clean record' ? <span className="pill pill-green">Clean record</span> : <span className="pill pill-amber">{c.police.clearance}</span>}</KV>
          <KV label="Last background check">{c.police.lastCheck}</KV>
          <Block><Sub>Incident history</Sub>{c.police.incidents.length ? c.police.incidents.map((i) => <KV key={i.date + i.type} label={i.type}>{i.date} — {i.status}</KV>) : <None>No incidents on record.</None>}</Block>
        </>
      );
    case 'traffic':
      return (
        <>
          <Head title="Traffic" sync="Traffic Department" />
          <KV label="Driver licence">{c.traffic.licence}</KV><KV label="Licence class">{c.traffic.class}</KV>
          <Block><Sub>Registered vehicles</Sub><Bullets items={c.traffic.vehicles} empty="No vehicles registered." /></Block>
          <Block><Sub>Fines</Sub>{c.traffic.fines.length ? c.traffic.fines.map((f) => (
            <KV key={f.desc} label={f.desc}>{f.amount} — {f.status === 'Paid' ? <span className="pill pill-green">Paid</span> : <span className="pill pill-red">Unpaid</span>}</KV>
          )) : <None>No fines on record.</None>}</Block>
        </>
      );
    case 'passport': {
      const s = c.passportRec.status;
      return (
        <>
          <Head title="Passport" sync="Passport Services" />
          <KV label="Status">{s === 'Valid' ? <span className="pill pill-green">Valid</span> : s === 'No record' ? <span className="pill pill-gray">No record</span> : <span className="pill pill-amber">{s}</span>}</KV>
          <KV label="Passport number">{c.passportRec.number}</KV><KV label="Expiry date">{c.passportRec.expiry}</KV>
        </>
      );
    }
    default:
      return null;
  }
}

export default function Profile({ citizen: c, tab, setTab, go }) {
  const toast = useToast();
  if (!c) {
    return (
      <div className="empty"><Icon name="users" size={44} /><h3>No citizen selected</h3><p>Search for a citizen to view their unified profile.</p>
        <button className="btn btn-primary" onClick={() => go('search')} style={{ marginTop: 14 }}>Go to search</button></div>
    );
  }
  const row = (label, val) => <div style={st('display:flex; justify-content:space-between; padding:6px 0;')}><span style={{ color: 'var(--ink-500)' }}>{label}</span><strong>{val}</strong></div>;
  return (
    <>
      <div className="breadcrumb">
        <button onClick={() => go('dashboard')}>Dashboard</button><span className="sep">/</span>
        <button onClick={() => go('search')}>Citizen Search</button><span className="sep">/</span><span>{fullName(c)}</span>
      </div>
      <div className="grid" style={st('grid-template-columns:280px 1fr; gap:20px; align-items:flex-start;')}>
        <div className="card pad" style={{ textAlign: 'center' }}>
          <div style={st('width:96px; height:96px; border-radius:50%; background:var(--blue-100); color:var(--blue-800); font-weight:800; font-size:30px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px;')}>{initials(c)}</div>
          <h3 style={{ fontSize: 17 }}>{fullName(c)}</h3>
          <div style={st('color:var(--ink-500); font-size:12.5px; margin-top:2px;')}>{c.district} District</div>
          <div style={st('margin-top:12px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap;')}>
            {c.flags.missingDocs > 0 ? <span className="pill pill-amber">{c.flags.missingDocs} doc missing</span> : <span className="pill pill-green">Record complete</span>}
          </div>
          <div style={st('text-align:left; margin-top:18px; border-top:1px solid var(--line); padding-top:14px; font-size:13px;')}>
            {row('National ID', c.nid)}{row('Passport', c.passport || '—')}{row('Employee No.', c.empNo || '—')}{row('Date of birth', c.dob)}
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 14 }} onClick={() => toast('This citizen is now active across all department modules.', 'success')}>
            <Icon name="flow" size={15} /> Use across modules
          </button>
        </div>
        <div>
          <div className="tabs">
            {PROFILE_TABS.map((t) => <button key={t.v} className={'tab ' + (tab === t.v ? 'active' : '')} onClick={() => setTab(t.v)}>{t.label}</button>)}
          </div>
          <div className="card pad"><Tab c={c} tab={tab} /></div>
        </div>
      </div>
    </>
  );
}
