// Figma layer: "Dashboard / Main Frame"
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';
import { api } from '../api/client';
import { mockStats, mockActivities } from '../data/mockData';
import { colors, typography } from '../tokens';

const styles = {
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  searchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    padding: '10px 16px',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    fontSize: 14,
    width: 280,
    fontFamily: typography.fontFamily,
    outline: 'none',
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  error: {
    padding: 16,
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: 8,
    marginBottom: 16,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, activitiesData] = await Promise.all([
          api.getStats(),
          api.getActivities(search),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setActivities(activitiesData);
        }
      } catch {
        if (!cancelled) {
          setStats(mockStats);
          setActivities(
            search
              ? mockActivities.filter(
                  (a) =>
                    a.user.toLowerCase().includes(search.toLowerCase()) ||
                    a.action.toLowerCase().includes(search.toLowerCase())
                )
              : mockActivities
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const debounce = setTimeout(loadData, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [search]);

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Overview of your platform metrics and recent activity</p>
      </header>

      {error && (
        <div style={styles.error} role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.spinner} data-testid="spinner">Loading dashboard...</div>
      ) : (
        <>
          <div style={styles.statsGrid}>
            {stats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </div>

          <div style={styles.searchRow}>
            <label htmlFor="activity-search" style={{ fontSize: 14, fontWeight: 500, color: colors.textPrimary }}>
              Search Activity
            </label>
            <input
              id="activity-search"
              type="search"
              placeholder="Search by user or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              aria-label="Search activity"
            />
          </div>

          <ActivityList activities={activities} />
        </>
      )}
    </div>
  );
}
