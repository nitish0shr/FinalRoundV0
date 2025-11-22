'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                fontFamily: 'system-ui, sans-serif',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '500px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '2rem',
                    backgroundColor: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Critical Error
                    </h2>
                    <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
                        {error.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
