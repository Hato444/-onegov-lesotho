import { Icon } from '../icons.jsx';
import { NOTIF_STYLE } from '../constants.js';

export default function NotifRow({ n, large, onView }) {
  const [color, bg, icon] = NOTIF_STYLE[n.level];
  return (
    <div className="notif-row" style={large ? { alignItems: 'center' } : undefined}>
      <div className="notif-ic" style={{ background: bg, color }}><Icon name={icon} size={large ? 17 : 16} /></div>
      <div style={{ flex: 1 }}>
        <div className="notif-title">{n.title}</div>
        <div className="notif-sub">{n.citizen} · {n.dept}{large ? ' · ' + n.time : ''}</div>
      </div>
      {large ? (
        <button className="btn btn-ghost btn-sm" onClick={() => onView(n)} disabled={!n.citizenId}>View citizen</button>
      ) : (
        <div className="notif-time">{n.time}</div>
      )}
    </div>
  );
}
