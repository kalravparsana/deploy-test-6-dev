// Figma layer: "Dashboard / Stat Card"
import { colors, radii, shadows, typography } from '../tokens';

const styles = {
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 24,
    boxShadow: shadows.card,
    border: `1px solid ${colors.border}`,
    flex: 1,
    minWidth: 200,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: 500,
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: typography.fontFamily,
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 8,
    fontFamily: typography.fontFamily,
  },
  change: {
    fontSize: typography.caption.fontSize,
    fontWeight: 500,
    fontFamily: typography.fontFamily,
  },
};

export default function StatCard({ label, value, change, trend }) {
  const changeColor = trend === 'up' ? colors.success : colors.error;

  return (
    <div style={styles.card} data-testid="stat-card">
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
      <div style={{ ...styles.change, color: changeColor }}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}
