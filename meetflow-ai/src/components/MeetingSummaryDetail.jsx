export default function MeetingSummaryDetail({ meeting }) {
  if (!meeting) return null;

  const isProcessing = meeting.status === 'processing';
  const { actionItems = [], keyDecisions = [], followUps = [] } = meeting;

  const SummarySection = ({ title, icon, items, emptyMessage }) => (
    <div className="summary-section">
      <div className="summary-section-header">
        <div className="sec-title">
          <i className={icon} aria-hidden="true" /> {title}
        </div>
        {items.length > 0 && <span style={{ color: '#94a1c4', fontWeight: 400, fontSize: '0.85rem' }}>({items.length})</span>}
      </div>
      <div className="summary-section-body">
        {isProcessing ? (
          <div className="processing-state">
            <div className="processing-spinner" />
            <p style={{ color: '#94a1c4' }}>Analyzing meeting data…</p>
          </div>
        ) : items.length > 0 ? (
          <ul className="summary-list">
            {items.map((item, index) => (
              <li key={index} className="summary-list-item">
                <span className="summary-list-dot" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-summary">
            <p style={{ color: '#94a1c4', fontSize: '0.9rem' }}>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="meeting-summary-detail">
      <SummarySection
        title="Action Items"
        icon="fa-solid fa-tasks"
        items={actionItems}
        emptyMessage="No action items identified in this meeting."
      />
      <SummarySection
        title="Key Decisions"
        icon="fa-solid fa-gavel"
        items={keyDecisions}
        emptyMessage="No key decisions recorded."
      />
      <SummarySection
        title="Follow-ups"
        icon="fa-solid fa-arrow-right"
        items={followUps}
        emptyMessage="No follow-ups scheduled."
      />
    </div>
  );
}
