// Figma layer: "Analytics / Chart Area"
import { colors, radii, shadows, typography } from '../tokens';

const styles = {
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 24,
    boxShadow: shadows.card,
    border: `1px solid ${colors.border}`,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    marginBottom: 24,
    fontFamily: typography.fontFamily,
  },
  legend: {
    display: 'flex',
    gap: 24,
    marginBottom: 24,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    height: 200,
    padding: '0 8px',
  },
  barGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  bars: {
    display: 'flex',
    gap: 4,
    alignItems: 'flex-end',
    height: 160,
  },
  bar: {
    width: 16,
    borderRadius: '4px 4px 0 0',
    minHeight: 4,
    transition: 'height 0.3s ease',
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 8,
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: typography.fontFamily,
  },
};

const datasetColors = ['#2563EB', '#10B981'];

export default function ChartDisplay({ data }) {
  if (!data || !data.labels || !data.datasets) {
    return (
      <div style={styles.container}>
        <p style={styles.empty}>No chart data available.</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.datasets.flatMap((ds) => ds.data),
    1
  );

  return (
    <div style={styles.container} data-testid="chart-display">
      <div style={styles.title}>Performance Overview</div>
      <div style={styles.legend}>
        {data.datasets.map((ds, i) => (
          <div key={ds.label} style={styles.legendItem}>
            <span style={{ ...styles.dot, backgroundColor: datasetColors[i % datasetColors.length] }} />
            {ds.label}
          </div>
        ))}
      </div>
      <div style={styles.chart}>
        {data.labels.map((label, labelIdx) => (
          <div key={label} style={styles.barGroup}>
            <div style={styles.bars}>
              {data.datasets.map((ds, dsIdx) => {
                const value = ds.data[labelIdx] || 0;
                const height = (value / maxValue) * 160;
                return (
                  <div
                    key={ds.label}
                    style={{
                      ...styles.bar,
                      height,
                      backgroundColor: datasetColors[dsIdx % datasetColors.length],
                    }}
                    title={`${ds.label}: ${value}`}
                  />
                );
              })}
            </div>
            <span style={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
