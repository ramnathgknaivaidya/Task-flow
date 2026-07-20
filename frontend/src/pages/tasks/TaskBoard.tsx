import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useTaskStore } from '../../store/taskStore'
import { useUIStore } from '../../store/uiStore'
import { useNotificationStore } from '../../store/notificationStore'
import { Card, Badge, AvatarGroup, Button, Modal, Input } from '../../components/ui'
import { cn, statusColors, statusLabels, priorityColors, formatDate, generateId } from '../../lib/utils'
import {
  Plus, MoreHorizontal, Calendar, Clock, Search, Filter,
  List, Columns, Table2, CalendarDays, GanttChart,
  Edit3, Trash2, Copy, Eye, AlertCircle, CheckCircle, X
} from 'lucide-react'
import type { Task, TaskStatus } from '../../types'
import toast from 'react-hot-toast'

const columns: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done']

function TaskCard({ task, index }: { task: Task; index: number }) {
  const { setSelectedTask } = useTaskStore()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'card-bg border border-[var(--border)] rounded-xl p-3.5 mb-2.5 cursor-pointer transition-all',
            snapshot.isDragging && 'shadow-lg-custom ring-2 ring-[var(--accent)]/30 scale-[1.02] rotate-[2deg]',
            'hover:border-[var(--border-hover)]'
          )}
          onClick={() => setSelectedTask(task)}
        >
          <div className="flex items-start justify-between mb-2">
            <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'} size="sm">
              {task.priority}
            </Badge>
            <div className="flex items-center gap-1">
              {task.status === 'done' && <CheckCircle size={12} className="text-emerald-500" />}
              {task.dependencies.length > 0 && <AlertCircle size={12} className="text-amber-500" />}
            </div>
          </div>
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2 line-clamp-2">{task.title}</h4>
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {task.tags.slice(0, 3).map((t, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-hover)] text-[var(--text-muted)]">#{t}</span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(task.dueDate)}</span>
              {task.estimatedTime > 0 && (
                <span className="flex items-center gap-1"><Clock size={11} /> {task.estimatedTime}h</span>
              )}
            </div>
            {task.assignees.length > 0 && (
              <AvatarGroup users={task.assignees.map((_, i) => ({ name: ['Alex M.', 'Sarah C.', 'Mike J.', 'Emily D.'][i % 4] }))} size="sm" max={2} />
            )}
          </div>
          {task.checklist.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-surface-hover)] overflow-hidden">
                  <div className="h-full rounded-full accent-bg transition-all" style={{ width: `${(task.checklist.filter(c => c.completed).length / task.checklist.length) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">{task.checklist.filter(c => c.completed).length}/{task.checklist.length}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

function Column({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const { moveTask } = useTaskStore()
  const onAddClick = () => {
    moveTask(generateId(), status)
  }

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', status === 'backlog' ? 'bg-gray-500' : status === 'todo' ? 'bg-blue-500' : status === 'in_progress' ? 'bg-amber-500' : status === 'review' ? 'bg-purple-500' : 'bg-emerald-500')} />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{statusLabels[status]}</h3>
          <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface-hover)] px-1.5 py-0.5 rounded-md">{tasks.length}</span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          title={`Add task to ${statusLabels[status]}`}
        >
          <Plus size={14} />
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 rounded-xl p-2 transition-colors min-h-[200px]',
              snapshot.isDraggingOver ? 'accent-light-bg border-2 border-dashed border-[var(--accent)]/20' : 'kanban-bg border border-[var(--border)]'
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 text-[var(--text-muted)]">
                <p className="text-sm">No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const { updateTask, deleteTask, setSelectedTask } = useTaskStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editStatus, setEditStatus] = useState(task.status)

  const handleSave = () => {
    updateTask(task.id, { title: editTitle, status: editStatus })
    toast.success('Task updated')
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    onClose()
    toast.success('Task deleted')
  }

  const handleDuplicate = () => {
    const { duplicateTask } = useTaskStore.getState()
    duplicateTask(task.id)
    toast.success('Task duplicated')
  }

  return (
    <Modal open={!!task} onClose={onClose} title={isEditing ? 'Edit Task' : task.title} size="lg">
      <div className="space-y-5">
        {isEditing ? (
          <>
            <Input label="Title" value={editTitle} onChange={(e: any) => setEditTitle(e.target.value)} />
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-1.5">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                className="w-full input-bg border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm"
              >
                {columns.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium', statusColors[task.status])}>{statusLabels[task.status]}</span>
              <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>{task.priority}</Badge>
              {task.dependencies.length > 0 && <Badge variant="warning">{task.dependencies.length} dependencies</Badge>}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{task.description || 'No description provided.'}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[var(--text-muted)]">Due Date:</span> <span className="text-[var(--text-primary)]">{formatDate(task.dueDate)}</span></div>
              <div><span className="text-[var(--text-muted)]">Progress:</span> <span className="text-[var(--text-primary)]">{task.progress}%</span></div>
              <div><span className="text-[var(--text-muted)]">Estimated:</span> <span className="text-[var(--text-primary)]">{task.estimatedTime}h</span></div>
              <div><span className="text-[var(--text-muted)]">Actual:</span> <span className="text-[var(--text-primary)]">{task.actualTime}h</span></div>
            </div>
            {task.checklist.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Checklist ({task.checklist.filter(c => c.completed).length}/{task.checklist.length})</h4>
                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => updateTask(task.id, { checklist: task.checklist.map(c => c.id === item.id ? { ...c, completed: !c.completed } : c) })}
                        className="rounded border-zinc-700 accent-[var(--accent)]"
                      />
                      <span className={cn('text-sm', item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]')}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((t, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-surface-hover)] text-[var(--text-muted)]">#{t}</span>)}
              </div>
            )}
            <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
              <Button size="sm" variant="secondary" icon={<Edit3 size={13} />} onClick={() => setIsEditing(true)}>Edit</Button>
              <Button size="sm" variant="secondary" icon={<Copy size={13} />} onClick={handleDuplicate}>Duplicate</Button>
              <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={handleDelete}>Delete</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export function TaskBoard() {
  const { tasks, addTask, moveTask, selectedTask, setSelectedTask, filter, setFilter } = useTaskStore()
  const { viewMode, setViewMode } = useUIStore()
  const { addNotification } = useNotificationStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' })

  const filteredTasks = tasks.filter(t => {
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    if (filter.priority !== 'all' && t.priority !== filter.priority) return false
    return true
  })

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    moveTask(result.draggableId, result.destination.droppableId as TaskStatus)
    addNotification({ title: 'Task moved', message: `Task moved to ${statusLabels[result.destination.droppableId as TaskStatus]}`, type: 'system_alert' })
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) { toast.error('Please enter a task title'); return }
    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as any,
      dueDate: newTask.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      status: 'todo',
      tags: [],
      assignees: ['1'],
    })
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
    setShowAdd(false)
    toast.success('Task created successfully!')
    addNotification({ title: 'Task created', message: `"${newTask.title}" has been created`, type: 'task_assigned' })
  }

  const viewOptions = [
    { mode: 'kanban' as const, icon: Columns, label: 'Kanban' },
    { mode: 'list' as const, icon: List, label: 'List' },
    { mode: 'table' as const, icon: Table2, label: 'Table' },
    { mode: 'calendar' as const, icon: CalendarDays, label: 'Calendar' },
    { mode: 'gantt' as const, icon: GanttChart, label: 'Gantt' },
  ]

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tasks</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage and track your team's tasks</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowAdd(true)}>Add Task</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap mb-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search tasks..." value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full input-bg border border-[var(--border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50" />
        </div>
        <select value={filter.priority} onChange={(e) => setFilter({ priority: e.target.value })}
          className="input-bg border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={() => toast.success('Advanced filters opened')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]">
          <Filter size={14} /> More Filters
        </button>
      </div>

      {/* View switcher */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2 bg-[var(--bg-surface)] rounded-xl p-1 border border-[var(--border)]">
          {viewOptions.map(({ mode, icon: Icon, label }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === mode ? 'accent-light-bg accent-text' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]')}>
              <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-[var(--text-muted)]">{filteredTasks.length} tasks</span>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0">
        {viewMode === 'kanban' && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto overflow-y-hidden pb-4">
              {columns.map((status) => (
                <Column key={status} status={status} tasks={filteredTasks.filter(t => t.status === status)} />
              ))}
            </div>
          </DragDropContext>
        )}

        {viewMode === 'list' && (
          <div className="space-y-2 overflow-y-auto h-full">
            {filteredTasks.map((task, i) => (
              <div key={task.id} onClick={() => setSelectedTask(task)}
                className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 hover:border-[var(--border-hover)] cursor-pointer transition-all animate-slide-in"
                style={{ animationDelay: `${i * 30}ms` } as any}>
                <div className={cn('w-2 h-2 rounded-full shrink-0', task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-400' : 'bg-zinc-400')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{task.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {task.tags.map((t, j) => (<span key={j} className="text-[10px] text-[var(--text-muted)]">#{t}</span>))}
                  </div>
                </div>
                <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'} size="sm">{task.priority}</Badge>
                <span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium', statusColors[task.status])}>{statusLabels[task.status]}</span>
                <span className="text-xs text-[var(--text-muted)] w-20 text-right">{formatDate(task.dueDate)}</span>
                <AvatarGroup users={task.assignees.map((_, j) => ({ name: ['Alex M.', 'Sarah C.', 'Mike J.'][j % 3] }))} size="sm" max={2} />
              </div>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-auto h-full">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Task</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Priority</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Due Date</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Assignees</th>
                  <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} onClick={() => setSelectedTask(task)}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-colors">
                    <td className="px-4 py-3"><p className="text-sm text-[var(--text-primary)] truncate max-w-[250px]">{task.title}</p></td>
                    <td className="px-4 py-3"><span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium', statusColors[task.status])}>{statusLabels[task.status]}</span></td>
                    <td className="px-4 py-3"><span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium', priorityColors[task.priority])}>{task.priority}</span></td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{formatDate(task.dueDate)}</td>
                    <td className="px-4 py-3"><AvatarGroup users={task.assignees.map((_, j) => ({ name: ['Alex M.', 'Sarah C.', 'Mike J.'][j % 3] }))} size="sm" max={2} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[var(--bg-surface-hover)] overflow-hidden">
                          <div className="h-full rounded-full accent-bg" style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{task.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 overflow-auto h-full">
            <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-lg overflow-hidden min-w-[560px]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="bg-[var(--bg-card)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] text-center">{d}</div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 2
                const hasTasks = day > 0 && day <= 31 && filteredTasks.some(t => new Date(t.dueDate).getDate() === day)
                const isToday = day === new Date().getDate()
                return (
                  <div key={i} className={cn('bg-[var(--bg-card)] min-h-[80px] p-2 border-t border-[var(--border)]', isToday && 'accent-light-bg')}>
                    {day > 0 && day <= 31 && (
                      <>
                        <span className={cn('text-xs font-medium', isToday ? 'accent-text' : 'text-[var(--text-muted)]')}>{day}</span>
                        {hasTasks && (
                          <div className="mt-1 space-y-1">
                            {filteredTasks.filter(t => new Date(t.dueDate).getDate() === day).slice(0, 2).map(t => (
                              <div key={t.id} onClick={() => setSelectedTask(t)}
                                className="text-[10px] px-1.5 py-0.5 rounded accent-light-bg accent-text truncate cursor-pointer hover:opacity-80">{t.title}</div>
                            ))}
                            {filteredTasks.filter(t => new Date(t.dueDate).getDate() === day).length > 2 && (
                              <div className="text-[10px] text-[var(--text-muted)] px-1">+{filteredTasks.filter(t => new Date(t.dueDate).getDate() === day).length - 2} more</div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === 'gantt' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 overflow-auto h-full">
            <div className="min-w-[500px] space-y-3">
              {filteredTasks.map((task, i) => {
                const start = new Date(task.startDate)
                const due = new Date(task.dueDate)
                const range = (due.getTime() - start.getTime()) / 86400000
                const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
                const startOffset = (start.getTime() - monthStart) / 86400000
                return (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-[var(--text-primary)] w-48 truncate shrink-0">{task.title}</p>
                      <div className="flex-1 relative h-6">
                        <div className="absolute inset-0 flex">
                          {Array.from({ length: 30 }).map((_, j) => (<div key={j} className="flex-1 border-l border-[var(--border)]" />))}
                        </div>
                        <div className="absolute top-1 h-4 rounded-full accent-light-bg border border-[var(--accent)]/50 flex items-center px-2"
                          style={{ left: `${Math.max((startOffset / 30) * 100, 0)}%`, width: `${Math.max((range / 30) * 100, 5)}%`, minWidth: '40px' }}>
                          <span className="text-[10px] accent-text truncate">{Math.max(Math.round(range), 1)}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Task">
        <div className="space-y-4">
          <Input label="Task Title" placeholder="Enter task title" value={newTask.title}
            onChange={(e: any) => setNewTask(prev => ({ ...prev, title: e.target.value }))} />
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-1.5">Description</label>
            <textarea placeholder="Describe the task..." value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full input-bg border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-1.5">Priority</label>
              <select value={newTask.priority} onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full input-bg border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)]">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <Input label="Due Date" type="date" value={newTask.dueDate}
              onChange={(e: any) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Create Task</Button>
          </div>
        </div>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  )
}
