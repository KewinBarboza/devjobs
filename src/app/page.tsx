import ListJobs from "@/components/ListJobs";

async function getData() {
  const res = await fetch('https://api.infojobs.net/api/7/offer?subcategory=programacion&subcategory=sistemas&subcategory=diseno-web&maxResults=21', {
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
    <main className="min-h-screen px-10 md:px-24 pb-10 mx-10 md:mx-48">
      <ListJobs jobs={items} />
    </main>
  )
}
