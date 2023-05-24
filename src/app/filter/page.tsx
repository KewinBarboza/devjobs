"use client"
import ListJobs from '@/components/ListJobs'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function FilterPage() {
  const search = useSearchParams()
  const [jobs, setJobs] = useState([])

  const searchQuery = search ? search.get('q') : null
  const encodeSearchQuery = encodeURI(searchQuery || '')

  useEffect(() => {
    fetch(`/api/jobs?q=${encodeSearchQuery}`)
      .then((data) => data.json())
      .then((jobs) => {
        setJobs(jobs.items)
      })

  }, [encodeSearchQuery])

  return (
    <main className="px-24 mx-48">
      <ListJobs jobs={jobs} />
    </main>
  )
}
