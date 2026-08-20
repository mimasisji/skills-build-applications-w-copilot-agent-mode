import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        const response = await fetch(buildApiUrl('users'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.results || payload.data || [];
        setUsers(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load users');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-muted">Loading users...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">Users</div>
      <div className="list-group list-group-flush">
        {users.length === 0 ? (
          <div className="list-group-item text-muted">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user._id || user.id || user.email} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{user.name}</strong>
                <span className="badge bg-success">{user.points ?? 0} pts</span>
              </div>
              <div className="small text-muted">{user.email}</div>
              <div className="small text-muted">{user.grade || 'Grade not set'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
