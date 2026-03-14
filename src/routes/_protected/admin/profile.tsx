import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import {
  Save,
  Loader2,
  Plus,
  X,
  User,
  Globe,
  FileText,
  Palette,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getProfileSettingsFn,
  saveProfileSettingsFn,
  uploadProfileImageFn,
} from '@/server/functions/portfolio'
import { Toaster } from 'sonner'

export const Route = createFileRoute('/_protected/admin/profile')({
  loader: async () => {
    const result = await getProfileSettingsFn()
    return { profile: result.profile }
  },
  component: ProfileEditor,
})

function ProfileEditor() {
  const { profile } = Route.useLoaderData()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'basic' | 'hero' | 'about' | 'social'
  >('basic')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    tagline: profile?.tagline || '',
    email: profile?.email || '',
    location: profile?.location || '',
    avatarUrl: profile?.avatarUrl || '',
    githubUsername: profile?.githubUsername || '',
    linkedinUrl: profile?.linkedinUrl || '',
    twitterUrl: profile?.twitterUrl || '',
    huggingfaceUrl: profile?.huggingfaceUrl || '',
    kaggleUrl: profile?.kaggleUrl || '',
    resumeUrl: profile?.resumeUrl || '',
    heroTitle: profile?.heroTitle || '',
    heroSubtitle: profile?.heroSubtitle || '',
    aboutTitle: profile?.aboutTitle || '',
    bio: profile?.bio || '',
    education: profile?.education || '',
    interests: profile?.interests || [],
    customSkills: profile?.customSkills || [],
    themeAccentColor: profile?.themeAccentColor || '#8B5CF6',
    showGithubStats: profile?.showGithubStats ?? true,
  })

  const [newInterest, setNewInterest] = useState('')
  const [newSkill, setNewSkill] = useState('')

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async () => {
        const base64Data = reader.result as string

        try {
          const result = await uploadProfileImageFn({
            data: {
              base64Data,
              fileName: file.name,
              mimeType: file.type,
            },
          })

          if (result.success && result.fileUrl) {
            setFormData((prev) => ({
              ...prev,
              avatarUrl: result.fileUrl,
            }))
            toast.success('Image uploaded successfully!')
          }
        } catch (error) {
          console.error('Upload error:', error)
          toast.error('Failed to upload image. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        toast.error('Failed to read file')
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('File read error:', error)
      toast.error('Failed to process image')
      setIsUploading(false)
    }
  }

  const addInterest = () => {
    if (
      newInterest.trim() &&
      !formData.interests.includes(newInterest.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i: string) => i !== interest),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.customSkills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        customSkills: [...prev.customSkills, newSkill.trim()],
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      customSkills: prev.customSkills.filter((s: string) => s !== skill),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await saveProfileSettingsFn({
        data: {
          displayName: formData.displayName || null,
          tagline: formData.tagline || null,
          email: formData.email || null,
          location: formData.location || null,
          avatarUrl: formData.avatarUrl || null,
          githubUsername: formData.githubUsername || null,
          linkedinUrl: formData.linkedinUrl || null,
          twitterUrl: formData.twitterUrl || null,
          huggingfaceUrl: formData.huggingfaceUrl || null,
          kaggleUrl: formData.kaggleUrl || null,
          resumeUrl: formData.resumeUrl || null,
          heroTitle: formData.heroTitle || null,
          heroSubtitle: formData.heroSubtitle || null,
          aboutTitle: formData.aboutTitle || null,
          bio: formData.bio || null,
          education: formData.education || null,
          interests: formData.interests.length > 0 ? formData.interests : null,
          customSkills:
            formData.customSkills.length > 0 ? formData.customSkills : null,
          themeAccentColor: formData.themeAccentColor || null,
          showGithubStats: formData.showGithubStats,
        },
      })

      toast.success('Profile saved successfully!')
      void router.invalidate()
    } catch {
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'hero', label: 'Hero Section', icon: Globe },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'social', label: 'Social Links', icon: Palette },
  ] as const

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1A1F2C] dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-sm sm:text-base text-[#8E9196] mb-6 sm:mb-8">
          Customize your portfolio profile information.
        </p>
      </motion.div>

      {/* Tabs - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-8">
        <div className="flex gap-2 min-w-max border-b border-[#E8E8E6] dark:border-[#2A2F3C] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#8E9196] hover:bg-[#F5F5F3] dark:hover:bg-[#2A2F3C]'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-4 sm:p-6 space-y-6">
              {/* Avatar Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-4">
                  Profile Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Avatar Preview */}
                  <div className="relative group">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#E8E8E6] dark:border-[#2A2F3C] bg-[#F5F5F3] dark:bg-[#0F1419]">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-[#8E9196]" />
                        </div>
                      )}
                    </div>
                    {/* Upload overlay */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <Camera className="w-8 h-8 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Upload Image
                        </>
                      )}
                    </button>
                    <p className="text-xs text-[#8E9196] mt-2">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>

                {/* Or use URL */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={16} className="text-[#8E9196]" />
                    <span className="text-sm text-[#8E9196]">
                      Or use image URL
                    </span>
                  </div>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-4 sm:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="Building the future of web"
                />
                <p className="text-xs text-[#8E9196] mt-1">
                  Main headline shown in the hero section
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none text-sm sm:text-base"
                  placeholder="A brief description of what you do..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-4 sm:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  About Section Title
                </label>
                <input
                  type="text"
                  name="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="Get to know me"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none text-sm sm:text-base"
                  placeholder="Tell visitors about yourself..."
                />
                <p className="text-xs text-[#8E9196] mt-1">
                  Use double line breaks to create paragraphs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="B.S. Computer Science, MIT"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Interests
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addInterest())
                    }
                    className="flex-1 px-4 py-2 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="Add an interest"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest: string, i: number) => (
                    <span
                      key={`${interest}-${i}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addSkill())
                    }
                    className="flex-1 px-4 py-2 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.customSkills.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-4 sm:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="https://twitter.com/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Hugging Face URL
                </label>
                <input
                  type="url"
                  name="huggingfaceUrl"
                  value={formData.huggingfaceUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="https://huggingface.co/username"
                />
                <p className="text-xs text-[#8E9196] mt-1">
                  Your Hugging Face profile URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Kaggle URL
                </label>
                <input
                  type="url"
                  name="kaggleUrl"
                  value={formData.kaggleUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="https://www.kaggle.com/username"
                />
                <p className="text-xs text-[#8E9196] mt-1">
                  Your Kaggle profile URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAF8] dark:bg-[#0F1419] border border-[#E8E8E6] dark:border-[#2A2F3C] rounded-lg text-[#1A1F2C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 text-sm sm:text-base"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button - Fixed on mobile */}
        <div className="mt-6 sm:mt-8 flex justify-end sticky bottom-4 sm:static">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-[#8B5CF6] text-white rounded-lg font-medium hover:bg-[#7C3AED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg sm:shadow-none text-sm sm:text-base"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
