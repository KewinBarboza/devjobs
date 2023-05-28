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
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState({ error: false, message: '' })
  const [isErrorTechnologies, setIsErrorTechnologies] = useState({ error: false, message: '' })


  const { push } = useRouter()

  const searchUser = async () => {
    if (userName === '') return

    setUserRepos([])
    setTechnologies([])
    setIsLoading(true)

    const getDataUser = await fetch(`https://api.github.com/users/${userName}`)
    const dataUser = await getDataUser.json()

    if (dataUser.message === 'Not Found') {
      setIsError({ error: true, message: 'Usuario no encontrado' })
      setIsLoading(false)
      return
    }

    const { login } = dataUser

    const getRepoUser = await fetch(`https://api.github.com/users/${login}/repos`)
    const dataRepo = await getRepoUser.json()

    const getInfoRepo = dataRepo.map(({ name, id, languages_url }: IUserRepo) => {
      return { name, id, languages_url }
    })

    setUserRepos(getInfoRepo)
    setIsLoading(false)
  }

  const getNameRepo = async (urlLanguages: string) => {
    const getLanguages = await fetch(urlLanguages)
    const dataLanguages = await getLanguages.json()
    const languages = Object.keys(dataLanguages)

    if (languages.length === 0) {
      setIsErrorTechnologies({ error: true, message: 'No hay tecnologías disponibles' })
      return
    }

    setTechnologies(languages)
  }

  const getValuesTechnologies = (e: string[]) => {
    push(`/filter?q=${e.join('%')}`)
  }

  return (
    <>
      <Title className="mb-2 dark:text-white">Filtrar por repositorio de github</Title>
      <div className=''>
        <Card className='m-0 bg-opacity-90 border-0 rounded-lg shadow-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-800 dark:ring-slate-700 shadow-md'>
          <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-5">
            <div className="relative h-full">
              <Text className='dark:text-white' >Nombre de usuario</Text>
              <TextInput className='pe-14' placeholder="Escribe tu nombre de usuario" error={isError.error} errorMessage={isError.message} onChange={(e) => setUserName(e.target.value)} value={userName} onKeyDown={(e) => e.key === "Enter" ? searchUser() : null} />
              <Button className='absolute top-[21.5px] right-[2px] bg-[#1972A3] border-[#1972A3] hover:bg-[#144d6b]' size="xs" loading={isLoading} onClick={() => searchUser()}> Buscar </Button>
            </div>
            <div>
              <Text className='dark:text-white' >Nombre repositorio</Text>
              <SelectBox placeholder='Seleccionar repositorio' onValueChange={(value) => getNameRepo(value)} disabled={userRepos.length === 0 ? true : false} >
                {userRepos.map(({ id, languages_url, name }: IUserRepo) => <SelectBoxItem value={languages_url} text={name} key={id} />)}
              </SelectBox>
            </div>
            <div>
              <Text className='dark:text-white ' >Tecnología</Text>
              <MultiSelectBox placeholder='Seleccionar tecnología' onValueChange={(values) => getValuesTechnologies(values)} disabled={technologies.length === 0 ? true : false}>
                {technologies.map(technology => <MultiSelectBoxItem value={technology} text={technology} key={technology} />)}
              </MultiSelectBox>
              {
                isErrorTechnologies.error && <Text className='text-red-500'>{isErrorTechnologies.message}</Text>
              }
            </div>
          </Grid>
        </Card>
      </div>
    </>
  )
}
