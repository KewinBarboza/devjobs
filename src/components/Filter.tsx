"use client"
import { Button, Card, Grid, MultiSelectBox, MultiSelectBoxItem, SelectBox, SelectBoxItem, TextInput, Title, Text } from '@tremor/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface IUser {
  login: string
}

interface IUserRepo {
  name: string,
  id: number,
  languages_url: string
}

export function Filter() {
  const [userName, setUserName] = useState<string>('')
  const [userRepos, setUserRepos] = useState<IUserRepo[]>([])
  const [technologies, setTechnologies] = useState<string[]>([])

  const { push } = useRouter()

  const searchUser = async () => {
    setUserRepos([])
    setTechnologies([])

    const getDataUser = await fetch(`https://api.github.com/users/${userName}`)
    const dataUser = await getDataUser.json()
    const { login } = dataUser

    const getRepoUser = await fetch(`https://api.github.com/users/${login}/repos`)
    const dataRepo = await getRepoUser.json()

    const getInfoRepo = dataRepo.map(({ name, id, languages_url }: IUserRepo) => {
      return { name, id, languages_url }
    })

    setUserRepos(getInfoRepo)
  }

  const getNameRepo = async (urlLanguages: string) => {
    const getLanguages = await fetch(urlLanguages)
    const dataLanguages = await getLanguages.json()

    setTechnologies(Object.keys(dataLanguages))
  }

  const getValuesTechnologies = (e: string[]) => {
    push(`/filter?q=${e[0]}`)
  }

  return (
    <><Title className="mb-2">Filtrar por repositorio de github</Title><Card>
      <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-5">
        <div>
          <Text>Nombre de usuario</Text>
          <div className="flex gap-2">
            <TextInput placeholder="buscar usuario" onChange={(e) => setUserName(e.target.value)} value={userName} onKeyDown={(e) => e.key === "Enter" ? searchUser() : null} />
            <Button size="xs" onClick={() => searchUser()}> Buscar </Button>
          </div>
        </div>
        <div>
          <Text>Nombre repositorio</Text>
          <SelectBox onValueChange={(value) => getNameRepo(value)} >
            {userRepos.map(({ id, languages_url, name }: IUserRepo) => <SelectBoxItem value={languages_url} text={name} key={id} />)}
          </SelectBox>
        </div>
        <div>
          <Text>Tecnología</Text>
          <MultiSelectBox onValueChange={(values) => getValuesTechnologies(values)}>
            {technologies.map(technology => <MultiSelectBoxItem value={technology} text={technology} key={technology} />)}
          </MultiSelectBox>
        </div>
      </Grid>
    </Card></>
  )
}
