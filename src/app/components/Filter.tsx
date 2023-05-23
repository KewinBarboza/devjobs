"use client"
import { Button, Card, Grid, MultiSelectBox, MultiSelectBoxItem, SelectBox, SelectBoxItem, TextInput, Title, Text } from '@tremor/react'
import React, { useState } from 'react'

export function Filter() {
  const [userName, setUserName] = useState('')
  const [userRepos, setUserRepos] = useState([])

  const searchUser = () => {
    let user = ''
    fetch(`https://api.github.com/users/${userName}`)
      .then(response => response.json())
      .then(data => {
        const { login } = data
        fetch(`https://api.github.com/users/${login}/repos`)
          .then(response => response.json())
          .then(data => {
            const dataRepo = data.map(repo => {
              const { name, languages_url, id } = repo
              return {
                id,
                name,
                languages_url
              }
            })

            setUserRepos(dataRepo)
          })
          .catch(error => console.error(error))
      })
      .catch(error => console.error(error))


  }

  return (
    <><Title className="mb-2">Filtrar por repositorio de github</Title><Card>
      <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-8">
        <div>
          <Text>Nombre de usuario</Text>
          <div className="flex gap-2">
            <TextInput placeholder="buscar usuario" onChange={(e) => setUserName(e.target.value)} value={userName} />
            <Button size="xs" onClick={() => searchUser()}>
              Buscar
            </Button>
          </div>
        </div>
        <div>
          <Text>Nombre repositorio</Text>
          <SelectBox
            defaultValue="1"
          >

            {
              userRepos.map(repo => (
                <SelectBoxItem value={repo.id} text={repo.name} key={repo.id} />
              ))
            }
          </SelectBox>
        </div>
        <div>
          <Text>Tecnología</Text>
          <MultiSelectBox>
            <MultiSelectBoxItem value="1" text="Option 1" />
            <MultiSelectBoxItem value="2" text="Option 2" />
            <MultiSelectBoxItem value="3" text="Option 3" />
          </MultiSelectBox>
        </div>
      </Grid>
    </Card></>
  )
}
