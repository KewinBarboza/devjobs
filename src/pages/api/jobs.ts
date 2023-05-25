import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  const { q, page = 1 } = query

  const arrayQuery = q?.split('%')

  const data = await fetch(`https://api.infojobs.net/api/7/offer?subcategory=programacion&subcategory=sistemas&subcategory=diseno-web&maxResults=50&page=${page}`, {
    headers: {
      contentType: 'application/json',
      Authorization: `Basic Y2Q3Yjg3ZTViMWQ0NDVlMjhlMTY3ZWMyMTJlZDE5NmE6REZmazlHaEEvemw3U3NQSUVObkFyeGhtR1h4bmphdFhGSzBkazU1MHdWWThWRUcrNTI=`
    }
  })

  const jobs = await data.json()

  const filter = jobs.items.map(job => {
    let requirementMin = arrayQuery.some((elemento) => job.requirementMin.includes(elemento))
    let title = arrayQuery.some((elemento) => job.title.includes(elemento))

    if (title || requirementMin) {
      return {
        ...job
      }
    }
  }).filter(Boolean)


  res.status(200).json({ items: filter, totalPages: jobs.totalPages, currentPage: jobs.currentPage })
}
