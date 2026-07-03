import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

// 1. Google ke liye Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const jobId = decodeURIComponent(params.id)
  
  return {
    title: `${jobId} Jobs in Saudi Arabia | Job Today KSA`,
    description: `Apply for the latest ${jobId} vacancies in KSA. Check salary, requirements, and recruitment details.`,
    openGraph: {
      title: `${jobId} Vacancies - Saudi Arabia`,
      description: `Find recruitment details for ${jobId} in KSA.`,
      images: ['/assets/job-banner.jpg'],
    },
  }
}

// 2. Job Detail Page Component
export default function JobPage({ params }: Props) {
  const jobId = decodeURIComponent(params.id)
  
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0284c7' }}>{jobId} Job Details</h1>
      <p>Latest opening in Saudi Arabia (KSA). Content is loading from server...</p>
    </div>
  )
}
