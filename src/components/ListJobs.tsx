import { Title, Grid, Card, Subtitle, Text } from '@tremor/react'
import React from 'react'
import Image from 'next/image'

function ListJobs({ jobs }) {
  return (
    <>
      <section className="mt-10">
        <Title className="mb-2">Trabajos</Title>
        <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-8">
          {
            jobs.map(job => (
              <Card key={job.id} className="flex flex-col justify-start">
                <div className="flex ">
                  <Image src={job.author.logoUrl} className="bg-blue-500/50 rounded-md p-1 mb-3 me-2"
                    width={42}
                    height={42}
                    alt="Picture of the author" />
                  <Text>{job.author.name}</Text>
                </div>

                <Title>{job.title}</Title>
                <Subtitle className="mt-4">{job.city}</Subtitle>
                <Text>{job.category.value}</Text>

                <Text className="text-blue-700 text-sm font-bold mt-8">{job.salaryDescription}</Text>
              </Card>
            ))
          }
        </Grid>
      </section>
    </>
  )
}

export default ListJobs
