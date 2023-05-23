import { Card, Col, Dropdown, DropdownItem, Grid, Metric, Subtitle, Text, Title, TextInput, SelectBox, SelectBoxItem, MultiSelectBox, MultiSelectBoxItem, Button } from "@tremor/react";


import Image from 'next/image';
import { Filter } from "./components/Filter";

async function getData() {
  const res = await fetch('https://api.infojobs.net/api/7/offer?subcategory=programacion&subcategory=sistemas&subcategory=diseno-web', {
    headers: {
      contentType: 'application/json',
      Authorization: `Basic Y2Q3Yjg3ZTViMWQ0NDVlMjhlMTY3ZWMyMTJlZDE5NmE6REZmazlHaEEvemw3U3NQSUVObkFyeGhtR1h4bmphdFhGSzBkazU1MHdWWThWRUcrNTI=`
    }
  })


  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Home() {
  const { items } = await getData();
  return (
    <main className="min-h-screen p-24 mx-48">
      <Filter />

      <section className="mt-10">
        <Title className="mb-2">Trabajos</Title>
        <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-8">
          {
            items.map(job => (
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
    </main>
  )
}
