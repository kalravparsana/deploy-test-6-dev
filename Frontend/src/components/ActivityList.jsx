// Figma layer: "Dashboard / Activity List"
import { colors, radii, shadows, typography } from '../tokens';

const statusColors = {
  completed: { bg: colors.successBg, text: colors.success },
  pending: { bg: colors.warningBg, text: colors.warning },
  failed: { bg: colors.errorBg, text: colors.error },
};

const styles = {
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    boxShadow: shadows.card,
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${colors.border}`,
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  list: {
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: `1px solid ${colors.border}`,
  },
  user: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  action: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: typography.fontFamily,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: radii.badge,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: typography.fontFamily,
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    fontFamily: typography.fontFamily,
  },
  empty: {
    padding: 40,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: typography.fontFamily,
  },
};

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ActivityList({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>Recent Activity</div>
        <p style={styles.empty}>No activities found.</p>
      </div>
    );
  }

  return (
    <div style={styles.container} data-testid="activity-list">
      <div style={styles.header}>Recent Activity</div>
      <ul style={styles.list}>
        {activities.map((activity) => {
          const statusStyle = statusColors[activity.status] || statusColors.pending;
          return (
            <li key={activity.id} style={styles.item}>
              <div>
                <div style={styles.user}>{activity.user}</div>
                <div style={styles.action}>{activity.action}</div>
                <div style={styles.time}>{formatTimestamp(activity.timestamp)}</div>
              </div>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                }}
              >
                {activity.status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
