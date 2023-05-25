import { Title, Grid, Card, Subtitle, Text, Flex } from '@tremor/react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function ListJobs({ jobs }) {
  return (
    <>
      <section className="mt-10 mb-3">
        <Title className="mb-2">Trabajos</Title>
        <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-8">
          {
            jobs.map(job => (
              <Card key={job.id} className="flex flex-col justify-start">
                <div className="flex items-start">
                  {
                    job.author.logoUrl ? (
                      <Image src={job.author.logoUrl} className="bg-blue-500/50 rounded-md p-1 mb-3 me-2"
                        width={42}
                        height={42}
                        alt="Picture of the author" />

                    ) : (
                      <div className='bg-blue-500/50 rounded-md p-1 mb-3 me-2 h-[42px] w-[42px]' ></div>
                    )
                  }
                  <div className='flex flex-col items-start'>
                    <Text className='mb-0 text-[12px]'>{job.author.name}</Text>
                    <Link target='_blank' className='text-blue-500 text-[10px]' href={job.author.uri}>Conocer mas sobre el autor</Link>
                  </div>
                </div>

                <Title className='text-md'>{job.title}</Title>
                <Subtitle className="mt-4 text-sm">{job.city}</Subtitle>
                <Text className='text-sm'>{job.category.value}</Text>

                <Text className="text-blue-700 text-sm font-bold mt-8">{job.salaryDescription}</Text>

                <Flex justifyContent="end" alignItems='end' className="space-x-2 h-full">
                  <div className='border-t-2 w-full mt-2 pt-2 flex justify-end'>
                    <Link target='_blank' className='text-sm text-blue-400 font-light' href={job.link}>Ver oferta</Link>
                  </div>
                </Flex>

              </Card>
            ))
          }
        </Grid>
      </section>
    </>
  )
}

export default ListJobs
