import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api.js';

const activitiesEndpoint = '/api/activities/';
// Codespaces endpoint pattern: -8000.app.github.dev/api/activities

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadActivities = async () => {
      try {
        const response = await fetch(buildApiUrl(activitiesEndpoint), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.results || payload.data || [];
        setActivities(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-muted">Loading activities...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-success text-white">Activities</div>
      <div className="list-group list-group-flush">
        {activities.length === 0 ? (
          <div className="list-group-item text-muted">No activities found.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity._id || activity.id || activity.date} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{activity.type}</strong>
                <span className="badge bg-success">{activity.points ?? 0} pts</span>
              </div>
              <div className="small text-muted">
                {activity.durationMinutes ?? 0} min • {activity.distanceMiles ?? 0} mi
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
