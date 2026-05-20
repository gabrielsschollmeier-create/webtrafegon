export default function Placeholder({ title, description }) {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-text mb-1">{title}</h1>
      <p className="text-sm text-muted mb-8">{description}</p>
      <div className="bg-surface border border-dashed border-border rounded-xl flex items-center justify-center h-64">
        <p className="text-muted text-sm">Em desenvolvimento</p>
      </div>
    </div>
  )
}
