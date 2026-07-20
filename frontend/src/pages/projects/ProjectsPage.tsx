import { useState } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { Card, CardContent, Badge, Button, Modal, Input, AvatarGroup } from '../../components/ui'
import { cn, projectStatusColors, formatDate } from '../../lib/utils'
import {
  Plus, FolderKanban, MoreHorizontal, Calendar, Target,
  AlertTriangle, Users, X
} from 'lucide-react'
import toast from 'react-hot-toast'

const statusLabels: Record<string, string> = {
  planning: 'Planning', active: 'Active', on_hold: 'On Hold', completed: 'Completed', cancelled: 'Cancelled',
}

export function ProjectsPage() {
  const { projects, selectedProject, setSelectedProject, addProject } = useProjectStore()
  const [showNew, setShowNew] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [newProject, setNewProject] = useState({ name: '', description: '', department: '', client: '', budget: '', timeline: '' })

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  const handleCreate = () => {
    if (!newProject.name.trim()) { toast.error('Project name is required'); return }
    addProject({
      name: newProject.name,
      description: newProject.description,
      department: newProject.department || 'General',
      client: newProject.client || undefined,
      budget: newProject.budget ? parseInt(newProject.budget) : undefined,
      timeline: newProject.timeline || 'TBD',
      team: ['1'],
    })
    setNewProject({ name: '', description: '', department: '', client: '', budget: '', timeline: '' })
    setShowNew(false)
    toast.success(`Project "${newProject.name}" created!`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your team's projects and milestones</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowNew(true)}>New Project</Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'active', 'planning', 'on_hold', 'completed'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all',
              filter === s ? 'accent-light-bg accent-text' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-[var(--bg-surface)]')}>
            {s === 'all' ? 'All' : statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((project, i) => (
          <Card key={project.id} hover onClick={() => setSelectedProject(project)} className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('p-2.5 rounded-xl', project.status === 'active' ? 'bg-emerald-500/15' : project.status === 'planning' ? 'bg-blue-500/15' : 'bg-[var(--bg-surface-hover)]')}>
                  <FolderKanban size={18} className={project.status === 'active' ? 'text-emerald-500' : project.status === 'planning' ? 'text-blue-500' : 'text-[var(--text-muted)]'} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{project.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium', projectStatusColors[project.status])}>{statusLabels[project.status]}</span>
                <Badge variant={project.priority === 'critical' ? 'danger' : project.priority === 'high' ? 'warning' : 'default'} size="sm">{project.priority}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                <span className="flex items-center gap-1"><Calendar size={12} /> {project.timeline}</span>
                <span className="flex items-center gap-1"><Target size={12} /> {project.milestones.length} milestones</span>
              </div>
              {project.team.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <AvatarGroup users={project.team.map((_, j) => ({ name: ['Alex M.', 'Sarah C.', 'Mike J.', 'Emily D.'][j % 4] }))} size="sm" max={3} />
                  <span className="text-xs text-[var(--text-muted)]">{project.team.length} members</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Detail Modal */}
      <Modal open={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.name} size="lg">
        {selectedProject && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant={selectedProject.priority === 'critical' ? 'danger' : selectedProject.priority === 'high' ? 'warning' : 'default'}>{selectedProject.priority} priority</Badge>
              <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', projectStatusColors[selectedProject.status])}>{statusLabels[selectedProject.status]}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{selectedProject.description}</p>
            {selectedProject.client && <div className="text-sm text-[var(--text-secondary)]">Client: <span className="text-[var(--text-primary)]">{selectedProject.client}</span></div>}
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Milestones</h4>
              <div className="space-y-2">
                {selectedProject.milestones.length === 0 && <p className="text-sm text-[var(--text-muted)]">No milestones yet</p>}
                {selectedProject.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-hover)]">
                    <div className={cn('w-2 h-2 rounded-full', m.status === 'completed' ? 'bg-emerald-500' : m.status === 'in_progress' ? 'bg-amber-500' : 'bg-zinc-500')} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{m.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{m.description} · {formatDate(m.dueDate)}</p>
                    </div>
                    <span className="text-xs capitalize text-[var(--text-muted)]">{m.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
            {selectedProject.risks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Risks</h4>
                <div className="space-y-2">
                  {selectedProject.risks.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <AlertTriangle size={14} className="text-rose-500" />
                      <div className="flex-1">
                        <p className="text-sm text-[var(--text-primary)]">{r.description}</p>
                        <p className="text-xs text-[var(--text-muted)]">Impact: {r.impact} · Probability: {r.probability}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] pt-4 border-t border-[var(--border)]">
              <span className="flex items-center gap-1"><Users size={14} /> {selectedProject.team.length} members</span>
              {selectedProject.budget && <span>💰 ${selectedProject.budget.toLocaleString()}</span>}
              <span className="flex items-center gap-1"><Calendar size={14} /> {selectedProject.timeline}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" onClick={() => toast.success('Project updated')}>Edit Project</Button>
              <Button size="sm" variant="secondary" onClick={() => toast.success('Report generated')}>Generate Report</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Project Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Create New Project" size="lg">
        <div className="space-y-4">
          <Input label="Project Name" placeholder="Enter project name" value={newProject.name}
            onChange={(e: any) => setNewProject(p => ({ ...p, name: e.target.value }))} />
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-1.5">Description</label>
            <textarea value={newProject.description} onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
              className="w-full input-bg border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 min-h-[100px]" placeholder="Describe the project..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" placeholder="e.g. Engineering" value={newProject.department}
              onChange={(e: any) => setNewProject(p => ({ ...p, department: e.target.value }))} />
            <Input label="Client" placeholder="Client name (optional)" value={newProject.client}
              onChange={(e: any) => setNewProject(p => ({ ...p, client: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget" placeholder="$" type="number" value={newProject.budget}
              onChange={(e: any) => setNewProject(p => ({ ...p, budget: e.target.value }))} />
            <Input label="Timeline" placeholder="e.g. Q3 2026" value={newProject.timeline}
              onChange={(e: any) => setNewProject(p => ({ ...p, timeline: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
