// Figma layer: "Analytics / Main Frame"
import { useState, useEffect } from 'react';
import TabBar from '../components/TabBar';
import ChartDisplay from '../components/ChartDisplay';
import { api } from '../api/client';
import { mockAnalytics } from '../data/mockData';
import { colors, typography } from '../tokens';

const periodTabs = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
];

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    marginTop: 4,
  },
  spinner: {
    textAlign: 'center',
    padding: 40,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginTop: 24,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    border: `1px solid ${colors.border}`,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: typography.fontFamily,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
};

function computeSummary(data) {
  if (!data?.datasets) return [];
  return data.datasets.map((ds) => {
    const total = ds.data.reduce((sum, v) => sum + v, 0);
    const avg = Math.round(total / ds.data.length);
    return { label: ds.label, total, avg };
  });
}

export default function Analytics() {
  const [activePeriod, setActivePeriod] = useState('7d');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      try {
        const data = await api.getAnalytics(activePeriod);
        if (!cancelled) setChartData(data);
      } catch {
        if (!cancelled) setChartData(mockAnalytics[activePeriod]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalytics();
    return () => { cancelled = true; };
  }, [activePeriod]);

  const summary = chartData ? computeSummary(chartData) : [];

  return (
    <div>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Analytics</h1>
          <p style={styles.subtitle}>Track performance metrics over time</p>
        </div>
        <TabBar tabs={periodTabs} activeTab={activePeriod} onTabChange={setActivePeriod} />
      </header>

      {loading ? (
        <div style={styles.spinner} data-testid="spinner">Loading analytics...</div>
      ) : (
        <>
          <ChartDisplay data={chartData} />
          <div style={styles.summaryGrid}>
            {summary.map((item) => (
              <div key={item.label} style={styles.summaryCard}>
                <div style={styles.summaryLabel}>{item.label} Total</div>
                <div style={styles.summaryValue}>{item.total.toLocaleString()}</div>
                <div style={{ ...styles.summaryLabel, marginTop: 8 }}>
                  Avg: {item.avg.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
