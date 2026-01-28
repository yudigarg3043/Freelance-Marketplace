export default function ActivityItem({ title, description, timestamp, isLast = false }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F8FAFC';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div>
        <p
          style={{
            color: '#0F172A',
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0 0 0.25rem 0',
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: '#64748B',
            fontSize: '0.875rem',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      <span
        style={{
          color: '#64748B',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          marginLeft: '1rem',
        }}
      >
        {timestamp}
      </span>
    </div>
  );
}