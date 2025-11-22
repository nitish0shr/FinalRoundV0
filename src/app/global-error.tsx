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
            <body>
                <div style={{ 
                    padding: '3rem', 
                    textAlign: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    color: '#ffffff'
                }}>
                    <div style={{
                        maxWidth: '500px',
                        padding: '2rem',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(139, 92, 246, 0.05)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Critical Application Error</h2>
                        <p style={{ 
                            marginBottom: '1.5rem', 
                            color: '#999',
                            fontFamily: 'monospace',
                            padding: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '6px'
                        }}>
                            {error.message || 'An unexpected error occurred'}
                        </p>
                        <button 
                            onClick={reset}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: '#8b5cf6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                marginRight: '1rem'
                            }}
                        >
                            Try again
                        </button>
                        <button 
                            onClick={() => window.location.href = '/'}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
