import { useEffect, useState } from 'react';
import { api } from './api.js';
import { useToast } from './toast.jsx';
import Login from './views/Login.jsx';
import Portal from './Portal.jsx';
import CitizenPortal from './CitizenPortal.jsx';

export default function App() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    api.me().then((r) => setUser(r.user)).catch(() => {}).finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    const onExpired = () => { setUser(null); toast('Your session has expired. Please sign in again.', 'error'); };
    window.addEventListener('onegov:unauthorized', onExpired);
    return () => window.removeEventListener('onegov:unauthorized', onExpired);
  }, [toast]);

  if (booting) return null;
  return (
    <div id="app">
      {user
        ? user.portal === 'citizen'
          ? <CitizenPortal user={user} onSignOut={() => setUser(null)} />
          : <Portal user={user} onSignOut={() => setUser(null)} />
        : <Login onLoggedIn={setUser} />}
    </div>
  );
}
