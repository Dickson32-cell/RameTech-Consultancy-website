// Company Knowledge Base for RAG System
// This knowledge is used to augment AI responses with accurate company information

export interface KnowledgeChunk {
  id: string
  category: string
  content: string
  keywords: string[]
}

export const companyKnowledge: KnowledgeChunk[] = [
  // Company Overview
  {
    id: 'company-1',
    category: 'Company',
    content: 'RAME Tech Consultancy is a Ghana-based technology company providing innovative digital solutions. We specialize in software development, hardware & IT services, graphic design, and emerging technologies. With over 5 years of experience, we have completed 50+ projects for clients across Ghana, Africa, Europe, and North America.',
    keywords: ['company', 'about', 'who', 'rame tech', 'ghana', 'experience', 'years', 'projects', 'overview']
  },
  {
    id: 'company-2',
    category: 'Company',
    content: 'RAME Tech Consultancy delivers cutting-edge technology solutions to help businesses grow. Our mission is to provide affordable, high-quality tech services that empower businesses in Ghana and beyond to succeed in the digital age.',
    keywords: ['mission', 'vision', 'goal', 'purpose', 'why', 'values']
  },

  // Services - Software
  {
    id: 'service-software-1',
    category: 'Services',
    content: 'Software Development Services: We build custom web applications, mobile apps, e-commerce platforms, and enterprise software. Technologies include React, Next.js, Node.js, Python, and more. Websites start from GHS 5,000, e-commerce from GHS 12,000, and custom web applications from GHS 20,000.',
    keywords: ['software', 'development', 'web', 'app', 'application', 'mobile', 'website', 'custom', 'coding', 'programming', 'react', 'nextjs', 'node', 'python', 'ecommerce', 'e-commerce']
  },
  {
    id: 'service-software-2',
    category: 'Services',
    content: 'Mobile App Development: We create native and cross-platform mobile applications for iOS and Android using React Native and Flutter. Prices start from GHS 15,000 for simple apps. We handle the entire development process including app store submission.',
    keywords: ['mobile', 'app', 'iphone', 'ios', 'android', 'react native', 'flutter', 'native', 'smartphone', 'apple', 'google']
  },

  // Services - Design
  {
    id: 'service-design-1',
    category: 'Services',
    content: 'Graphic Design Services: Professional logo design starting from GHS 800. Brand identity packages from GHS 2,500. We also offer business cards, letterheads, social media graphics, marketing materials, and UI/UX design services.',
    keywords: ['design', 'graphic', 'logo', 'brand', 'identity', 'visual', 'artwork', 'card', 'business card', 'social media', 'marketing', 'ui', 'ux', 'interface', 'flyer', 'brochure']
  },

  // Services - Hardware & IT
  {
    id: 'service-it-1',
    category: 'Services',
    content: 'Hardware & IT Services: Network setup and maintenance, server management, IT support, hardware procurement, and cloud solutions. We provide comprehensive IT infrastructure services for businesses of all sizes.',
    keywords: ['hardware', 'it', 'support', 'network', 'server', 'maintenance', 'infrastructure', 'procurement', 'cabling', 'wifi', 'lan', 'system']
  },

  // Services - Cloud
  {
    id: 'service-cloud-1',
    category: 'Services',
    content: 'Cloud Services: AWS and Azure solutions, cloud migration, DevOps services, and cloud security. We help businesses leverage the power of cloud computing with customized solutions and ongoing management.',
    keywords: ['cloud', 'aws', 'azure', 'amazon', 'microsoft', 'devops', 'migration', 'hosting', 'ec2', 's3', 'serverless']
  },

  // Services - Analytics
  {
    id: 'service-analytics-1',
    category: 'Services',
    content: 'Advanced Analytics: Business intelligence dashboards, predictive analytics, real-time data processing, custom KPI tracking, and ML-powered insights. Transform your raw data into actionable business intelligence.',
    keywords: ['analytics', 'data', 'dashboard', 'kpi', 'metrics', 'tracking', 'insights', 'business intelligence', 'bi', 'reporting', 'analysis', 'predictive', 'ml', 'machine learning']
  },

  // Services - AI
  {
    id: 'service-ai-1',
    category: 'Services',
    content: 'AI & Automation: Custom chatbot development for websites and WhatsApp, process automation, natural language processing (NLP), computer vision, and AI consulting. Bring artificial intelligence to your business workflows.',
    keywords: ['ai', 'artificial', 'intelligence', 'automation', 'chatbot', 'bot', 'nlp', 'machine learning', 'ml', 'automation', 'process', 'computer vision', 'chat', 'assistant']
  },

  // Services - Cybersecurity
  {
    id: 'service-security-1',
    category: 'Services',
    content: 'Cybersecurity Services: Security audits, penetration testing, compliance management (GDPR, PCI-DSS), vulnerability assessments, incident response, and security training. Protect your business from cyber threats.',
    keywords: ['security', 'cyber', 'cybersecurity', 'hack', 'breach', 'protect', 'ssl', 'encrypt', 'malware', 'virus', 'vulnerability', 'audit', 'penetration', 'compliance', 'gdpr', 'firewall']
  },

  // Services - Marketing
  {
    id: 'service-marketing-1',
    category: 'Services',
    content: 'Marketing Research: Market segmentation, competitor analysis, customer behavior analysis, brand perception studies, trend forecasting, and survey design. Make data-driven marketing decisions.',
    keywords: ['marketing', 'market', 'research', 'competitor', 'analysis', 'customer', 'behavior', 'segmentation', 'brand', 'trends', 'survey', 'study']
  },

  // Pricing
  {
    id: 'pricing-1',
    category: 'Pricing',
    content: 'Pricing Guide: Websites from GHS 5,000, Mobile apps from GHS 15,000, E-commerce from GHS 12,000, Custom web apps from GHS 20,000, Logo design from GHS 800, Brand identity from GHS 2,500, IT support/maintenance from GHS 1,500/month.',
    keywords: ['price', 'pricing', 'cost', 'how much', 'charge', 'fee', 'quote', 'estimate', 'budget', 'afford', 'expensive', 'cheap', 'ghs']
  },
  {
    id: 'pricing-2',
    category: 'Pricing',
    content: 'Payment Options: We accept bank transfer, Mobile Money (MTN MoMo), and card payments. Our payment structure is 50% upfront, 30% at mid-project, and 20% upon delivery. Custom payment arrangements available for larger projects.',
    keywords: ['payment', 'pay', 'bank', 'transfer', 'momo', 'mobile money', 'mtn', 'card', 'installment', 'credit', 'cash']
  },

  // Timeline
  {
    id: 'timeline-1',
    category: 'Timeline',
    content: 'Project Timelines: Basic websites 2-4 weeks, E-commerce platforms 6-8 weeks, Custom web applications 8-12 weeks, Mobile apps 8-16 weeks. Complex projects may take longer. We provide detailed timelines during the consultation phase.',
    keywords: ['time', 'timeline', 'how long', 'weeks', 'days', 'when', 'schedule', 'deadline', 'turnaround', 'duration', 'project duration', 'completion']
  },

  // Contact
  {
    id: 'contact-1',
    category: 'Contact',
    content: 'Contact Information: Phone/Call: +233 55 733 2615, WhatsApp: wa.me/233204249540 or +233 20 424 9540, Email: info.rametechconsultancy@gmail.com. We reply to messages within 24 hours.',
    keywords: ['contact', 'call', 'phone', 'email', 'whatsapp', 'message', 'reach', 'connect', 'talk', 'speak', 'hour', 'response', 'reply']
  },
  {
    id: 'contact-2',
    category: 'Contact',
    content: 'Business Hours: Monday to Friday, 8:00 AM to 5:00 PM. Saturday, 9:00 AM to 2:00 PM. We are based in Ghana and serve clients locally and internationally through remote collaboration.',
    keywords: ['hours', 'open', 'closed', 'monday', 'friday', 'saturday', 'business hours', 'time zone', 'gmt']
  },

  // Process
  {
    id: 'process-1',
    category: 'Process',
    content: 'Our Process: 1) Free Consultation - We discuss your needs. 2) Requirements & Proposal - We prepare a detailed quote. 3) Contract & 50% Payment. 4) Design & Development. 5) Testing & 30% Payment. 6) Launch & 20% Payment. 7) Ongoing Support.',
    keywords: ['process', 'how', 'steps', 'procedure', 'workflow', 'consultation', 'proposal', 'contract', 'development', 'testing', 'launch', 'support']
  },

  // Support
  {
    id: 'support-1',
    category: 'Support',
    content: 'Support & Maintenance: All projects include 30-day warranty for bug fixes. We offer ongoing maintenance packages starting from GHS 1,500/month which includes security updates, backups, and content changes.',
    keywords: ['support', 'maintenance', 'help', 'issue', 'problem', 'bug', 'error', 'fix', 'update', 'maintain', 'warranty', 'buggy', 'broken']
  },

  // Portfolio
  {
    id: 'portfolio-1',
    category: 'Portfolio',
    content: 'Portfolio & Work: We have completed 50+ projects including e-commerce platforms, inventory management systems, mobile apps, custom web applications, brand identity packages, and analytics dashboards. Visit our Portfolio page to see case studies.',
    keywords: ['portfolio', 'work', 'projects', 'example', 'case study', 'reference', 'previous', 'completed', 'showcase', 'samples']
  },

  // Location
  {
    id: 'location-1',
    category: 'Location',
    content: 'Location: Based in Ghana, we serve clients locally and internationally. We specialize in remote collaboration and have worked with clients across Africa, Europe, and North America. Distance is not a barrier!',
    keywords: ['where', 'location', 'address', 'office', 'ghana', 'accra', 'based', 'located', 'country', 'international', 'global', 'remote']
  }
]

// RAG Retrieval Function
export function retrieveRelevantKnowledge(query: string, topK: number = 3): string[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)

  // Score each chunk based on keyword matches
  const scoredChunks = companyKnowledge.map(chunk => {
    let score = 0

    // Check exact phrase matches
    if (queryLower.includes(chunk.content.toLowerCase().substring(0, 50))) {
      score += 10
    }

    // Check keyword matches
    for (const keyword of queryWords) {
      if (chunk.keywords.some(k => k.includes(keyword) || keyword.includes(k))) {
        score += 2
      }
    }

    // Check category-specific boosts
    for (const keyword of chunk.keywords) {
      if (queryLower.includes(keyword)) {
        score += 5
      }
    }

    return { chunk, score }
  })

  // Sort by score and get top K
  const relevantChunks = scoredChunks
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk)

  return relevantChunks.map(c => c.content)
}

// Build RAG context for prompts
export function buildRAGContext(query: string): string {
  const relevantInfo = retrieveRelevantKnowledge(query, 3)
  
  if (relevantInfo.length === 0) {
    return ''
  }

  return `\n\nRelevant Company Information:\n${relevantInfo.map((info, i) => `${i + 1}. ${info}`).join('\n')}\n\nUse this information to provide accurate responses about RAME Tech Consultancy.`
}
