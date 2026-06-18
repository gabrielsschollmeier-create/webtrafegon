import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Erro capturado:', error?.message, info?.componentStack?.split('\n')[1]?.trim())
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#080a12', flexDirection: 'column', gap: 16, padding: 24,
      }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, textAlign: 'center' }}>
          Algo deu errado nesta página
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', maxWidth: 360 }}>
          {this.state.error?.message || 'Erro desconhecido'}
        </p>
        <button
          onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
          style={{
            marginTop: 8, padding: '10px 20px', borderRadius: 12, border: 'none',
            background: '#6eda2c', color: '#0f1117', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          Recarregar página
        </button>
      </div>
    )
  }
}
