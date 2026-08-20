import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api.js';

const leaderboardEndpoint = '/api/leaderboard/';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadLeaderboard = async () => {
      try {
        const response = await fetch(buildApiUrl(leaderboardEndpoint), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.results || payload.data || [];
        setScores(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-muted">Loading leaderboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-warning text-dark">Leaderboard</div>
      <div className="list-group list-group-flush">
        {scores.length === 0 ? (
          <div className="list-group-item text-muted">No leaderboard data yet.</div>
        ) : (
          scores.map((entry, index) => (
            <div key={entry._id || entry.id || `${entry.user}-${index}`} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <strong>#{index + 1} {entry.user?.name || 'Unknown User'}</strong>
                <span className="badge bg-warning text-dark">{entry.totalPoints ?? 0} pts</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
