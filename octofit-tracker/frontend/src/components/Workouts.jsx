import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api.js';

const workoutsEndpoint = '/api/workouts/';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadWorkouts = async () => {
      try {
        const response = await fetch(buildApiUrl(workoutsEndpoint), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch workouts: ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.results || payload.data || [];
        setWorkouts(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load workouts');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadWorkouts();

    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-muted">Loading workouts...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-secondary text-white">Workouts</div>
      <div className="list-group list-group-flush">
        {workouts.length === 0 ? (
          <div className="list-group-item text-muted">No workout plans found.</div>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id || workout.id || workout.title} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{workout.title}</strong>
                <span className="badge bg-secondary">{workout.category}</span>
              </div>
              <div className="small text-muted">
                {workout.durationMinutes ?? 0} min • {workout.difficulty ?? 'beginner'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
