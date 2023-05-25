"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Text } from '@tremor/react'
import ListJobs from '@/components/ListJobs'

export default function FilterPage() {
  const search = useSearchParams()

  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const searchQuery = search ? search.get('q') : null
  const encodeSearchQuery = encodeURI(searchQuery || '')

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/jobs?q=${encodeSearchQuery}&page=${page}`)
      .then((data) => data.json())
      .then((jobs) => {
        setJobs(currentJobs => currentJobs.concat(jobs.items))
        setTotalPages(jobs.totalPages)
        setCurrentPage(jobs.currentPage)
        setIsLoading(false)
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false))

  }, [encodeSearchQuery, page])

  return (
    <main className="px-24 mx-48">
      <ListJobs jobs={jobs} />

      <section className='mb-10 mt-5'>
        <Text className='text-center mb-2'>página {currentPage} de {totalPages}</Text>
        <Button
          className='w-full'
          loading={isLoading}
          disabled={page === totalPages ? true : false}
          onClick={() => setPage(currentPage => currentPage = currentPage + 1)}
        >
          Ver mas
        </Button>
      </section>
    </main>
  )
}
