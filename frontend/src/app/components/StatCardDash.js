export default function StatCardDash({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#2563EB';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E7EB';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <p
        style={{
          color: '#64748B',
          fontSize: '0.875rem',
          margin: '0 0 0.5rem 0',
        }}
      >
        {title}
      </p>
      <p
        style={{
          color: '#0F172A',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}