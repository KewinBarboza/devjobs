"use client"
import { Button, Card, Grid, MultiSelectBox, MultiSelectBoxItem, SelectBox, SelectBoxItem, TextInput, Title, Text, BarList, ProgressBar, Flex } from '@tremor/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Image from 'next/image'

interface IUser {
  login: string,
  avatar_url: string,
  bio: string,
  twitter_username: string,
  following: number,
  followers: number,
  created_at: string,
  location: string,
  blog: string,
  public_repos: number,
  company: string
}

interface IUserRepo {
  name: string,
  id: number,
  languages_url: string,
  description: string,
  url: string
}

interface IUserRepoSelected {
  languages_url: string,
  name: string,
  description: string,
  url: string
}

interface ILanguages {
  name: string,
  value: unknown,
}

interface IRepos {
  [key: string]: number;
}

export function Filter() {
  const [userData, setUserData] = useState<IUser | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [dataLanguages, setDataLanguages] = useState<ILanguages[]>([])
  const [userRepos, setUserRepos] = useState<IUserRepo[]>([])
  const [userSelectedRepo, setUserSelectedRepo] = useState<IUserRepoSelected | null>(null)
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

    const { login, avatar_url, bio, twitter_username, following, followers, created_at, location, blog, public_repos, company } = dataUser
    setUserData({ login, avatar_url, bio, twitter_username, following, followers, created_at, location, blog, public_repos, company })
    setUserName(login)
    setIsError({ error: false, message: '' })

    const getRepoUser = await fetch(`https://api.github.com/users/${login}/repos`)
    const dataRepo = await getRepoUser.json()

    const getInfoRepo = dataRepo.map(({ name, id, languages_url, description, url }: IUserRepo) => {
      return { name, id, languages_url, description, url }
    })

    setUserRepos(getInfoRepo)
    setIsLoading(false)
  }

  const getDataRepo = async (repo: IUserRepoSelected) => {
    setUserSelectedRepo(null)

    const getLanguages = await fetch(repo?.languages_url)
    const dataLanguages = await getLanguages.json()
    const languages = Object.keys(dataLanguages)

    if (languages.length === 0) {
      setIsErrorTechnologies({ error: true, message: 'No hay tecnologías disponibles' })
      return
    }

    let total = 0;
    for (const key in dataLanguages) {
      total += dataLanguages[key];
    }

    const result = {};
    for (const key in dataLanguages) {
      result[key] = ((dataLanguages[key] / total) * 100).toFixed(0);
    }

    const maperLanguages = Object.entries(result).map((key, value) => {
      return {
        name: key[0],
        value: Number(key[1])
      }
    })

    setDataLanguages(maperLanguages)
    setUserSelectedRepo({ name: repo.name, description: repo.description, url: repo.url, languages_url: '' })
    setTechnologies(languages)
    setIsErrorTechnologies({ error: false, message: '' })
  }

  const getValuesTechnologies = (e: string[]) => {
    push(`/filter?q=${e.join('%')}`)
  }

  return (
    <>
      <section className='mb-2'>
        <Title className="mb-2 dark:text-white">Filtrar por repositorio de github</Title>
        <Card className='m-0 bg-opacity-90 border-0 rounded-lg shadow-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-800 dark:ring-slate-700 shadow-md'>
          <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-5">
            <div className="relative h-full">
              <Text className='dark:text-white' >Nombre de usuario</Text>
              <TextInput className='pe-14' placeholder="Escribe tu nombre de usuario" error={isError.error} errorMessage={isError.message} onChange={(e) => setUserName(e.target.value)} value={userName} onKeyDown={(e) => e.key === "Enter" ? searchUser() : null} />
              <Button className='absolute top-[21.5px] right-[2px] bg-[#1972A3] border-[#1972A3] hover:bg-[#144d6b]' size="xs" loading={isLoading} onClick={() => searchUser()}> Buscar </Button>
            </div>
            <div>
              <Text className='dark:text-white' >Nombre repositorio</Text>
              <SelectBox placeholder='Seleccionar repositorio' onValueChange={(value) => getDataRepo(value)} disabled={userRepos.length === 0 ? true : false} >
                {userRepos.map((repo: IUserRepo) => <SelectBoxItem value={repo} text={repo.name} key={repo.id} />)}
              </SelectBox>
            </div>
            <div>
              <Text className='dark:text-white ' >Tecnología</Text>
              <MultiSelectBox placeholder='Seleccionar tecnología' onValueChange={(values) => getValuesTechnologies(values)} disabled={technologies.length === 0 ? true : false}>
                {technologies.map(technology => <MultiSelectBoxItem value={technology} text={technology} key={technology} />)}
              </MultiSelectBox>
              {isErrorTechnologies.error && <Text className='text-red-500'>{isErrorTechnologies.message}</Text>}
            </div>
          </Grid>
        </Card>
      </section>
      {
        userSelectedRepo !== null ? (
          <>
            <section className='mx-auto mt-5'>
              <Title className="mb-2 dark:text-white">Datos de tu perfil</Title>
              <Grid numCols={1} numColsSm={2} numColsLg={2} className="gap-8">
                <Card className='flex bg-opacity-90 border-0 rounded-lg shadow-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-800 dark:ring-slate-700 shadow-md'>
                  <div className='mr-7'>
                    <Image src={`${userData?.avatar_url}`} className='rounded-full' alt={`${userData?.login}`} width={64} height={64} />
                  </div>
                  <section className='w-full'>
                    <header className=''>
                      <div className='flex justify-between items-center'>
                        <div>
                          <Title className='mb-0 dark:text-white'>{userData?.login}</Title>
                        </div>
                        <Text className='text-[10px] dark:text-slate-400'>{userData?.created_at}</Text>
                      </div>
                      <Text className='text-sm dark:text-slate-200'>{userData?.bio}</Text>
                    </header>
                    <main className='rounded-md flex justify-between bg-slate-200 my-3 py-2 px-3 dark:bg-slate-700'>
                      <div>
                        <Text className='text-center dark:text-white text-[12px]'>Repos</Text>
                        <Text className='text-center dark:text-slate-400 text-[11px]'>{userData?.public_repos}</Text>
                      </div>

                      <div>
                        <Text className='text-center dark:text-white text-[12px]'>followers</Text>
                        <Text className='text-center dark:text-slate-400 text-[11px]'>{userData?.followers}</Text>
                      </div>

                      <div>
                        <Text className='text-center dark:text-white text-[12px]'>following</Text>
                        <Text className='text-center dark:text-slate-400 text-[11px]'>{userData?.following}</Text>
                      </div>
                    </main>

                    <footer className='flex justify-between'>
                      <div>
                        <Text className='text-[12px] dark:text-slate-400 flex' >
                          <svg className="mr-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="0.5" stroke="#09f" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                          </svg>
                          {userData?.location}
                        </Text>
                        <Link className='text-[12px] dark:text-slate-400 flex mt-2' target='_blank' href={`${userData?.blog}`}>
                          <svg className="mr-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="0.5" stroke="#09f" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4" />
                            <path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4" />
                            <path d="M12.5 3a16.989 16.989 0 0 1 1.828 4" />
                            <path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4" />
                            <path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4" />
                            <path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4" />
                            <path d="M2 10l1 4l1.5 -4l1.5 4l1 -4" />
                            <path d="M17 10l1 4l1.5 -4l1.5 4l1 -4" />
                            <path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4" />
                          </svg>
                          {userData?.blog}
                        </Link>
                      </div>
                      <div>
                        <Link href='' className='text-[12px] dark:text-slate-400'>
                          <svg className="mr-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="0.5" stroke="#09f" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                          </svg>
                          {userData?.twitter_username}
                        </Link>
                        <Text className='text-[12px] dark:text-slate-400 flex mt-2'>
                          <svg className="mr-1" width="16" height="16" viewBox="0 0 24 24" stroke-width="0.5" stroke="#09f" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 9l5 5v7h-5v-4m0 4h-5v-7l5 -5m1 1v-6a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v17h-8" />
                            <path d="M13 7l0 .01" />
                            <path d="M17 7l0 .01" />
                            <path d="M17 11l0 .01" />
                            <path d="M17 15l0 .01" />
                          </svg>
                          {userData?.company}
                        </Text>
                      </div>
                    </footer>
                  </section>
                </Card>
                <Card className='bg-opacity-90 border-0 rounded-lg shadow-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-800 dark:ring-slate-700 shadow-md'>
                  <Title className='dark:text-white'>{userSelectedRepo?.name}</Title>
                  <Link className='text-sm text-blue-600' target='_blank' href={`${userSelectedRepo.url}`}>{userSelectedRepo?.description}</Link>
                  {
                    dataLanguages.map(l => (
                      <>
                        <Flex className='mt-3'>
                          <Text className='dark:text-white mb-0 text-[10px]'>{l.name}</Text>
                          <Text className='dark:text-gray-300 mb-0 text-[10px]' >{`${l.value}%`}</Text>
                        </Flex>
                        <ProgressBar percentageValue={l.value} color="blue" className="mt-1" />
                      </>
                    ))
                  }
                </Card>
              </Grid>
            </section>
          </>
        ) : ''
      }
    </>
  )
}
