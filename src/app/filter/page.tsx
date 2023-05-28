"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Card, Grid, Text, Title } from '@tremor/react'
import ListJobs from '@/components/ListJobs'
import Image from 'next/image'
import Link from 'next/link'

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
    <main className="px-10 md:px-24 mx-10 md:mx-48">
      <Grid numCols={1} numColsSm={2} numColsLg={2} className="gap-8">
        <Card className='flex'>
          <div className='mr-7'>
            <Image src='https://avatars.githubusercontent.com/u/32785129?v=4' alt='prueba' width={64} height={64} />
          </div>
          <section className='w-full'>
            <header className=''>
              <div className='flex justify-between'>
                <div>
                  <Title className='mb-0'>Kewin Barboza</Title>
                </div>
                <Text className='text-[10px]'>2017-10-14T02:01:40Z</Text>
              </div>
              <Text className='text-sm'>Desarrollo Web e Ingeniero en informática</Text>
            </header>
            <main className='rounded-md flex justify-between bg-slate-200 my-3 p-2'>
              <div>
                <Text className='text-center'>Repos</Text>
                <Text className='text-center'>15</Text>
              </div>

              <div>
                <Text className='text-center'>followers</Text>
                <Text className='text-center'>15</Text>
              </div>

              <div>
                <Text className='text-center'>following</Text>
                <Text className='text-center'>15</Text>
              </div>
            </main>

            <footer className='flex justify-between'>
              <div>
                <Text className='text-[12px]' >Caracas, Venezuela</Text>
                <Link className='text-[12px]' href='https://kewinbarboza.com/'>https://kewinbarboza.com/</Link>
              </div>
              <div>
                <Link href='' className='text-[12px]' >Twitter</Link>
                <Text className='text-[12px]' >Company</Text>
              </div>
            </footer>
          </section>
        </Card>
        <Card>

        </Card>
      </Grid>
      <ListJobs jobs={jobs} />
      <section className='mb-10 mt-5 mx-auto text-center'>
        <Button
          className='rounded-full bg-[#1972A3] border-[#1972A3] hover:bg-[#144d6b]'
          loading={isLoading}
          disabled={page === totalPages ? true : false}
          onClick={() => setPage(currentPage => currentPage = currentPage + 1)}
        >
          página {currentPage} de {totalPages}
        </Button>
      </section>
    </main>
  )
}
