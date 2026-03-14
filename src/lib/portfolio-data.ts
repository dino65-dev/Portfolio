// Portfolio data based on dino65-dev GitHub profile
export const profileData = {
  name: 'Dinmay Brahma',
  title: 'AI Engineering Student',
  tagline:
    'Building intelligent systems at the intersection of machine learning and software engineering',
  github: 'https://github.com/dino65-dev',
  email: 'contact@dinmay.dev',
  location: 'India',
  avatar: 'https://avatars.githubusercontent.com/u/132477195?v=4',
  bio: `I'm an AI Engineering student passionate about developing intelligent systems that solve real-world problems. My journey in technology began with a curiosity about how machines can learn and adapt, leading me to explore deep learning, computer vision, and natural language processing.

Currently focused on building scalable ML pipelines and contributing to open-source projects. I believe in writing clean, maintainable code and creating solutions that are both technically sound and user-friendly.

When I'm not coding, you'll find me exploring new research papers, contributing to developer communities, or experimenting with emerging AI technologies.`,
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    focus: 'Artificial Intelligence & Machine Learning',
    status: 'Currently Pursuing',
  },
  skills: {
    languages: ['Python', 'JavaScript', 'TypeScript', 'C++', 'SQL'],
    frameworks: [
      'TensorFlow',
      'PyTorch',
      'React',
      'Next.js',
      'FastAPI',
      'Flask',
    ],
    tools: ['Git', 'Docker', 'AWS', 'GCP', 'Jupyter', 'VS Code'],
    domains: [
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'NLP',
      'Data Science',
    ],
  },
  interests: [
    'Generative AI & LLMs',
    'Computer Vision Applications',
    'Open Source Development',
    'Research & Innovation',
  ],
}

export const projects = [
  {
    id: 1,
    title: 'Edumate',
    description:
      'An AI-powered educational platform that personalizes learning experiences using machine learning algorithms to adapt content based on student performance and learning patterns.',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],
    category: 'AI/ML',
    github: 'https://github.com/dino65-dev/Edumate',
    demo: null,
    featured: true,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  },
  {
    id: 2,
    title: 'PyVerse',
    description:
      'A comprehensive collection of Python projects and utilities covering various domains including automation, data analysis, web scraping, and machine learning implementations.',
    technologies: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    category: 'Open Source',
    github: 'https://github.com/dino65-dev/PyVerse',
    demo: null,
    featured: true,
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  },
  {
    id: 3,
    title: 'ML-Nexus',
    description:
      'A machine learning project hub featuring implementations of various ML algorithms, model training pipelines, and deployment strategies for production environments.',
    technologies: ['Python', 'PyTorch', 'Docker', 'MLflow', 'AWS'],
    category: 'Machine Learning',
    github: 'https://github.com/dino65-dev/ML-Nexus',
    demo: null,
    featured: true,
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    id: 4,
    title: 'AI Voice Assistant',
    description:
      'An intelligent voice assistant built with speech recognition and natural language understanding capabilities, enabling hands-free interaction with various services.',
    technologies: ['Python', 'SpeechRecognition', 'NLP', 'TTS', 'Flask'],
    category: 'AI/ML',
    github: 'https://github.com/dino65-dev',
    demo: null,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&q=80',
  },
  {
    id: 5,
    title: 'Data Visualization Dashboard',
    description:
      'Interactive dashboard for visualizing complex datasets with real-time updates, custom charts, and exportable reports for data-driven decision making.',
    technologies: ['React', 'D3.js', 'TypeScript', 'Node.js', 'MongoDB'],
    category: 'Web Development',
    github: 'https://github.com/dino65-dev',
    demo: null,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    id: 6,
    title: 'Computer Vision Toolkit',
    description:
      'A collection of computer vision tools and models for image classification, object detection, and image segmentation tasks with pre-trained models and custom training support.',
    technologies: ['Python', 'OpenCV', 'TensorFlow', 'YOLO', 'Streamlit'],
    category: 'Computer Vision',
    github: 'https://github.com/dino65-dev',
    demo: null,
    featured: false,
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  },
]

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/dino65-dev',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/dinmay-brahma',
    icon: 'linkedin',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/dino65_dev',
    icon: 'twitter',
  },
]

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Building Scalable ML Pipelines with Python',
    slug: 'building-scalable-ml-pipelines',
    excerpt:
      'Learn how to design and implement production-ready machine learning pipelines that can handle large-scale data processing and model training.',
    category: 'Machine Learning',
    date: '2024-01-15',
    readTime: '8 min read',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    id: 2,
    title: 'Introduction to MLOps: Best Practices',
    slug: 'introduction-to-mlops',
    excerpt:
      'Discover the essential practices for deploying, monitoring, and maintaining machine learning models in production environments.',
    category: 'MLOps',
    date: '2024-01-08',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  },
  {
    id: 3,
    title: 'Contributing to Open Source AI Projects',
    slug: 'contributing-to-open-source-ai',
    excerpt:
      'A comprehensive guide to getting started with open source contributions in the AI and machine learning ecosystem.',
    category: 'Open Source',
    date: '2024-01-01',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  },
  {
    id: 4,
    title: 'Deep Learning for Computer Vision',
    slug: 'deep-learning-computer-vision',
    excerpt:
      'Explore the fundamentals of using deep learning techniques for image classification, object detection, and segmentation tasks.',
    category: 'Deep Learning',
    date: '2023-12-20',
    readTime: '10 min read',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  },
]
