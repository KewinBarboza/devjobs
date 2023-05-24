import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req

  fetch('https://api.infojobs.net/api/7/offer?subcategory=programacion&subcategory=sistemas&subcategory=diseno-web', {
    headers: {
      contentType: 'application/json',
      Authorization: `Basic Y2Q3Yjg3ZTViMWQ0NDVlMjhlMTY3ZWMyMTJlZDE5NmE6REZmazlHaEEvemw3U3NQSUVObkFyeGhtR1h4bmphdFhGSzBkazU1MHdWWThWRUcrNTI=`
    }
  })
    .then((data) => data.json())
    .then((jobs) => {
      const filter = jobs.items.map(job => {
        if (job.title.includes(query?.q) || job.requirementMin.includes(query?.q)) {
          return {
            ...job
          }
        }
      }).filter(Boolean)
      res.status(200).json({ items: filter })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error: 'file load jobs' })
    })
}