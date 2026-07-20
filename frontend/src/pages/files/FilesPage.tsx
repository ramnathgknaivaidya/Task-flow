import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Badge } from '../../components/ui'
import { cn } from '../../lib/utils'
import { FileText, Image, FileSpreadsheet, FileArchive, Download, Upload, Search, Folder, Star, MoreHorizontal, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  modified: string
  owner: string
  starred: boolean
}

export function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: 'f1', name: 'Q3_Budget_Plan.xlsx', type: 'spreadsheet', size: '2.4 MB', modified: '2 hours ago', owner: 'Alex M.', starred: true },
    { id: 'f2', name: 'Landing_Page_Designs.fig', type: 'image', size: '14.8 MB', modified: 'Yesterday', owner: 'Emily D.', starred: false },
    { id: 'f3', name: 'Sprint_Notes.md', type: 'document', size: '12 KB', modified: '3 days ago', owner: 'Sarah C.', starred: true },
    { id: 'f4', name: 'API_Documentation_v2.pdf', type: 'document', size: '3.1 MB', modified: '1 week ago', owner: 'Mike J.', starred: false },
    { id: 'f5', name: 'Presentation_Q3.pptx', type: 'document', size: '8.6 MB', modified: '2 weeks ago', owner: 'Alex M.', starred: false },
    { id: 'f6', name: 'Assets_v2.zip', type: 'archive', size: '45.2 MB', modified: '3 weeks ago', owner: 'Emily D.', starred: true },
  ])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = files.filter(f => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'All') return true
    if (filter === 'Documents') return f.type === 'document'
    if (filter === 'Images') return f.type === 'image'
    if (filter === 'Spreadsheets') return f.type === 'spreadsheet'
    return true
  })

  const toggleStar = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f))
    const file = files.find(f => f.id === id)
    toast.success(file?.starred ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleUpload = () => {
    toast.success('File upload dialog opened')
  }

  const handleDelete = (id: string, name: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    toast.success(`"${name}" deleted`)
  }

  const typeIcons: Record<string, React.ReactNode> = {
    document: <FileText size={18} className="text-blue-500" />,
    image: <Image size={18} className="text-purple-500" />,
    spreadsheet: <FileSpreadsheet size={18} className="text-emerald-500" />,
    archive: <FileArchive size={18} className="text-amber-500" />,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Files</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Upload, manage, and share files</p>
        </div>
        <Button icon={<Upload size={16} />} onClick={handleUpload}>Upload Files</Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full input-bg border border-[var(--border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50" />
        </div>
        <div className="flex gap-2">
          {['All', 'Documents', 'Images', 'Spreadsheets'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                filter === f ? 'accent-light-bg accent-text' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-[var(--bg-surface)]')}>{f}</button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">All Files</h3>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Folder size={12} /> {filtered.length} files
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.map((file, i) => (
            <div key={file.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-surface-hover)] transition-colors animate-slide-in"
              style={{ animationDelay: `${i * 30}ms` } as any}>
              <div className="p-2 rounded-xl bg-[var(--bg-surface-hover)]">{typeIcons[file.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{file.name}</p>
                  <button onClick={() => toggleStar(file.id)}>
                    <Star size={12} className={file.starred ? 'text-amber-500 fill-amber-500' : 'text-[var(--text-muted)]'} />
                  </button>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{file.size} · Modified {file.modified}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge size="sm">{file.type}</Badge>
                <span className="text-xs text-[var(--text-muted)]">{file.owner}</span>
                <button onClick={() => { toast.success(`Downloading "${file.name}"`) }} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <Download size={14} />
                </button>
                <button onClick={() => handleDelete(file.id, file.name)} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Actions</h3></CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button size="sm" variant="secondary" icon={<Upload size={13} />} onClick={handleUpload}>Upload File</Button>
          <Button size="sm" variant="secondary" onClick={() => toast.success('Creating new folder')}>New Folder</Button>
          <Button size="sm" variant="secondary" onClick={() => toast.success('Opening shared files')}>Shared with me</Button>
        </CardContent>
      </Card>
    </div>
  )
}
