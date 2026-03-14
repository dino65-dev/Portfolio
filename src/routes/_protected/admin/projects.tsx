import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  StarOff,
  ExternalLink,
  Github,
  X,
  Save,
  Loader2,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import {
  getProjectsFn,
  createProjectFn,
  updateProjectFn,
  deleteProjectFn,
} from '@/server/functions/portfolio'
import type { CustomProjects } from '@/server/lib/appwrite.types'

export const Route = createFileRoute('/_protected/admin/projects')({
  loader: async () => {
    const result = await getProjectsFn()
    return { projects: result.projects }
  },
  component: ProjectsManager,
})

interface ProjectFormData {
  title: string
  description: string
  imageUrl: string
  githubUrl: string
  liveUrl: string
  technologies: string[]
  featured: boolean
}

const emptyFormData: ProjectFormData = {
  title: '',
  description: '',
  imageUrl: '',
  githubUrl: '',
  liveUrl: '',
  technologies: [],
  featured: false,
}

function ProjectsManager() {
  const { projects } = Route.useLoaderData()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CustomProjects | null>(
    null,
  )
  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData)
  const [newTech, setNewTech] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingProject(null)
    setFormData(emptyFormData)
    setIsModalOpen(true)
  }

  const openEditModal = (project: CustomProjects) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      technologies: project.technologies || [],
      featured: project.featured,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setFormData(emptyFormData)
    setNewTech('')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const addTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }))
      setNewTech('')
    }
  }

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSaving(true)

    try {
      if (editingProject) {
        await updateProjectFn({
          data: {
            id: editingProject.$id,
            title: formData.title,
            description: formData.description || null,
            imageUrl: formData.imageUrl || null,
            githubUrl: formData.githubUrl || null,
            liveUrl: formData.liveUrl || null,
            technologies:
              formData.technologies.length > 0 ? formData.technologies : null,
            featured: formData.featured,
          },
        })
        toast.success('Project updated successfully!')
      } else {
        await createProjectFn({
          data: {
            title: formData.title,
            description: formData.description || null,
            imageUrl: formData.imageUrl || null,
            githubUrl: formData.githubUrl || null,
            liveUrl: formData.liveUrl || null,
            technologies:
              formData.technologies.length > 0 ? formData.technologies : null,
            featured: formData.featured,
          },
        })
        toast.success('Project created successfully!')
      }

      closeModal()
      void router.invalidate()
    } catch {
      toast.error('Failed to save project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setDeletingId(id)
    try {
      await deleteProjectFn({ data: { id } })
      toast.success('Project deleted successfully!')
      void router.invalidate()
    } catch {
      toast.error('Failed to delete project. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleFeatured = async (project: CustomProjects) => {
    try {
      await updateProjectFn({
        data: {
          id: project.$id,
          featured: !project.featured,
        },
      })
      toast.success(
        project.featured ? 'Removed from featured' : 'Added to featured',
      )
      void router.invalidate()
    } catch {
      toast.error('Failed to update project')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
      >
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1A1F2C] dark:text-white mb-1 sm:mb-2">
            Projects
          </h1>
          <p className="text-sm sm:text-base text-[#8E9196]">
            Manage your portfolio projects.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white rounded-lg font-medium hover:bg-[#7C3AED] transition-colors text-sm sm:text-base touch-manipulation w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Project
        </button>
      </motion.div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16 bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C]"
        >
          <p className="text-[#8E9196] mb-4 text-sm sm:text-base">
            No projects yet
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg font-medium hover:bg-[#7C3AED] transition-colors text-sm sm:text-base touch-manipulation"
          >
            <Plus size={20} />
            Create your first project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project: CustomProjects, index: number) => (
            <motion.div
              key={project.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] overflow-hidden group"
            >
              {/* Image */}
              <div className="aspect-video bg-[#F5F5F3] dark:bg-[#0F1419] relative">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8E9196] text-sm">
                    No image
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#F97316] text-white text-xs font-medium rounded">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-[#1A1F2C] dark:text-white mb-2 truncate">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E9196] line-clamp-2 mb-3">
                  {project.description || 'No description'}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {project.technologies.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-[#F5F5F3] dark:bg-[#0F1419] text-[#8E9196] rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-[#8E9196]">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E6] dark:border-[#2A2F3C]">
                  <div className="flex items-center gap-1">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white transition-colors touch-manipulation"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white transition-colors touch-manipulation"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`p-2 transition-colors touch-manipulation ${
                        project.featured
                          ? 'text-[#F97316]'
                          : 'text-[#8E9196] hover:text-[#F97316]'
                      }`}
                      title={
                        project.featured
                          ? 'Remove from featured'
                          : 'Add to featured'
                      }
                    >
                      {project.featured ? (
                        <Star size={18} />
                      ) : (
                        <StarOff size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-[#8E9196] hover:text-[#8B5CF6] transition-colors touch-manipulation"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.$id)}
                      disabled={deletingId === project.$id}
                      className="p-2 text-[#8E9196] hover:text-red-500 transition-colors disabled:opacity-50 touch-manipulation"
                    >
                      {deletingId === project.$id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white dark:bg-[#1A1F2C] rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E8E6] dark:border-[#2A2F3C] sticky top-0 bg-white dark:bg-[#1A1F2C] z-10">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1F2C] dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add Project'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white transition-colors touch-manipulation"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="Project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none text-sm sm:text-base"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), addTech())
                      }
                      className="flex-1 px-4 py-2 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                      placeholder="Add technology"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors touch-manipulation"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-red-500 touch-manipulation"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-[#E8E8E6] dark:border-[#2A2F3C] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm text-[#1A1F2C] dark:text-white"
                  >
                    Featured project (shown prominently on portfolio)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[#E8E8E6] dark:border-[#2A2F3C]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#8B5CF6] text-white rounded-lg font-medium hover:bg-[#7C3AED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        {editingProject ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
