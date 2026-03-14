import { createFileRoute } from '@tanstack/react-router'
import {
  Nav,
  Hero,
  Projects,
  About,
  Blog,
  Contact,
  Footer,
} from '@/components/portfolio'
import { Toaster } from 'sonner'
import {
  getPublicProfileFn,
  getPublicProjectsFn,
  getMediumPostsFn,
} from '@/server/functions/portfolio'

export const Route = createFileRoute('/_public/')({
  loader: async () => {
    // Fetch all data in parallel with individual error handling
    const [profileResult, projectsResult, blogResult] = await Promise.all([
      getPublicProfileFn().catch((error) => {
        console.error('Failed to fetch profile:', error)
        return { profile: null }
      }),
      getPublicProjectsFn().catch((error) => {
        console.error('Failed to fetch projects:', error)
        return { projects: [] }
      }),
      getMediumPostsFn().catch((error) => {
        console.error('Failed to fetch blog posts:', error)
        return {
          posts: [],
          blogSiteUrl: 'https://dinmaysblog.onrender.com',
          mediumUrl: 'https://medium.com/@dinmaybrahma',
          error: 'Failed to load blog posts',
        }
      }),
    ])

    return {
      profile: profileResult.profile,
      projects: projectsResult.projects,
      blogPosts: blogResult.posts || [],
      blogSiteUrl: blogResult.blogSiteUrl || 'https://dinmaysblog.onrender.com',
      mediumUrl: blogResult.mediumUrl || 'https://medium.com/@dinmaybrahma',
    }
  },
  component: PortfolioPage,
})

function PortfolioPage() {
  const { profile, projects, blogPosts, blogSiteUrl, mediumUrl } =
    Route.useLoaderData()

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1F2C]">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1F2C',
            color: '#FAFAF8',
            border: 'none',
          },
        }}
      />

      {/* Fixed Navigation */}
      <Nav profile={profile} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero profile={profile} />

        {/* Projects Section */}
        <Projects projects={projects} />

        {/* Blog Section - Live from Medium */}
        <Blog
          posts={blogPosts}
          blogSiteUrl={blogSiteUrl}
          mediumUrl={mediumUrl}
        />

        {/* About Section */}
        <About profile={profile} />

        {/* Contact Section */}
        <Contact profile={profile} />
      </main>

      {/* Footer */}
      <Footer profile={profile} />
    </div>
  )
}
