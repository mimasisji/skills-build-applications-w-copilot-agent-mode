import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api.js';

const teamsEndpoint = '/api/teams/';
// Codespaces endpoint pattern: -8000.app.github.dev/api/teams

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadTeams = async () => {
      try {
        const response = await fetch(buildApiUrl(teamsEndpoint), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.results || payload.data || [];
        setTeams(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTeams();

    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-muted">Loading teams...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-info text-white">Teams</div>
      <div className="list-group list-group-flush">
        {teams.length === 0 ? (
          <div className="list-group-item text-muted">No teams found.</div>
        ) : (
          teams.map((team) => (
            <div key={team._id || team.id || team.name} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{team.name}</strong>
                <span className="badge" style={{ background: team.color || '#0d6efd' }}>
                  {team.members?.length ?? 0} members
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
