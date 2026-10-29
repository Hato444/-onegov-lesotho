import { useEffect, useState } from 'react';
import { Icon } from '../icons.jsx';
import { DEPTS } from '../constants.js';
import { api } from '../api.js';
import { useToast } from '../toast.jsx';
import { DeptRequestModal } from '../components/Modals.jsx';

const deptName = (id) => DEPTS.find((d) => d.id === id)?.name || 'Citizen';
const pill = (s) => s === 'Completed' ? 'green' : s === 'Rejected' ? 'red' : s === 'Pending' ? 'amber' : 'blue';

export default function Requests({ user, go }) {
  const toast = useToast();
  const [tab, setTab] = useState('received');
  const [data, setData] = useState({ received: [], sent: [] });
  const [open, setOpen] = useState(null);

  const load = () => api.deptRequests().then(setData).catch((e) => toast(e.message, 'error'));
  useEffect(() => { load(); }, []);
  const list = data[tab] || [];

  return (
    <>
      <div className="breadcrumb"><button onClick={() => go('dashboard')}>Dashboard</button><span className="sep">/</span><span>Requests</span></div>
      <div style={{ marginBottom: 18 }}>
        <div className="section-title">Department requests</div>
        <div className="section-sub">Requests received by {deptName(user.deptId)} and requests sent to other departments.</div>
      </div>

      <div className="tabs">
        <button className={'tab ' + (tab === 'received' ? 'active' : '')} onClick={() => setTab('received')}>Received ({data.received.length})</button>
        <button className={'tab ' + (tab === 'sent' ? 'active' : '')} onClick={() => setTab('sent')}>Sent ({data.sent.length})</button>
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="empty"><Icon name="doc" size={40} /><h3>No {tab} requests</h3><p>Requests will appear here as they are sent.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Reference</th><th>From</th><th>To</th><th>Citizen</th><th>Type</th><th>Priority</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} tabIndex={0} onClick={() => setOpen(r)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 700 }}>{r.id}</td>
                    <td>{deptName(r.fromDepartment)}</td>
                    <td>{deptName(r.toDepartment)}</td>
                    <td>{r.citizenName}</td>
                    <td>{r.requestType}</td>
                    <td>{r.priority}</td>
                    <td><span className={'pill pill-' + pill(r.status)}>{r.status}</span></td>
                    <td style={{ textAlign: 'right', color: 'var(--blue-700)', fontWeight: 700 }}>Open</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <DeptRequestModal
          request={open}
          canRespond={open.toDepartment === user.deptId}
          onClose={() => setOpen(null)}
          onSaved={() => load()}
        />
      )}
    </>
  );
}
