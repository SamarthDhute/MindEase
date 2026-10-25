import { Leaf, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="mt-auto py-10"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text-muted)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Leaf size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
            MindEase
          </span>
        </div>

        <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
          A research & digital wellness tool — not a medical diagnosis.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/about" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>About</Link>
          <Link to="/privacy" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacy</Link>
          <span className="flex items-center gap-1">
            Made with <Heart size={13} style={{ color: 'var(--color-primary)' }} fill="var(--color-primary)" /> care
          </span>
        </div>
      </div>
    </footer>
  )
}
