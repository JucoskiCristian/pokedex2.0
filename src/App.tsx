import axios from 'axios'
import { useEffect, useState } from 'react'

type Pokemon = {
  id: number
  name: string
  order: number
  url: string
  types: { type: { name: string } }[]
  sprites: {
    other: {
      home: {
        front_default: string
      }
      showdown: {
        front_default: string
      }
    }
  }
  height: number
  weight: number
}

export function App() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSelect, setSelected] = useState<Pokemon>()

  useEffect(() => {
    const fetchPokemonData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=400'
        )
        const pokemonList = response.data.results

        // Fetch details for each Pokémon
        const pokemonDetails = await Promise.all(
          pokemonList.map(async (pokemon: Pokemon) => {
            const pokemonDetailResponse = await axios.get(pokemon.url)
            return pokemonDetailResponse.data
          })
        )
        setPokemonData(pokemonDetails)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPokemonData()
  }, [])

  if (isLoading) {
    return (
      <main className="mx-auto h-full max-w-screen-xl bg-slate-200">
        <img className="mx-auto" src="src/img/pokedexlogo.png" alt="" />
        <div>Loading...</div>
      </main>
    )
  }

  return (
    <main className="mx-auto h-full max-w-screen-xl bg-slate-200">
      {/* logo temporario */}
      <img className="mx-auto" src="src/img/pokedexlogo.png" alt="" />
      <div className="flex flex-row">
        <section className="max-w-screen-md py-7">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-16">
            {pokemonData.map((pokemon) => (
              <li
                key={pokemon.name}
                onClick={() => setSelected(pokemon)}
                className={`bg-${pokemon.types[0].type.name} relative h-36 w-52 cursor-pointer rounded-3xl bg-white shadow-lg`}>
                <div className="flex justify-center">
                  <img
                    className="absolute -top-12 h-24 w-24 object-scale-down"
                    src={pokemon.sprites.other.showdown.front_default}
                    alt={pokemon.name}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center space-y-1 p-3">
                  <h2 className="text-xs text-neutral-500">
                    N° {pokemon.order}
                  </h2>
                  <h1 className="capitalize">{pokemon.name}</h1>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <img
                        className="h-6 w-6"
                        src={`src/img/TypeIcons/${type.type.name}.png`}
                        alt=""
                      />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="fixed right-96 top-56 flex h-[700px] w-96 items-start justify-center rounded-3xl bg-white">
          {isSelect ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src={isSelect?.sprites.other.home.front_default}
                alt=""
                className="h-48 w-48"
              />
              <h2 className="text-xs text-neutral-500">N° {isSelect?.order}</h2>
              <h1 className="capitalize">{isSelect?.name}</h1>
              <div className="flex gap-2">
                {isSelect?.types.map((type) => (
                  <img
                    className="h-6 w-6"
                    src={`src/img/TypeIcons/${type.type.name}.png`}
                    alt=""
                  />
                ))}
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center justify-center">
                  <h3>Altura</h3>
                  <div className="flex h-6 w-28 items-center justify-center rounded-full bg-slate-200 text-sm text-slate-700">
                    {isSelect
                      ? (isSelect?.height / 10).toString().replace('.', ',')
                      : ''}{' '}
                    m
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3>Peso</h3>
                  <div className="flex h-6 w-28 items-center justify-center rounded-full bg-slate-200 text-sm text-slate-700">
                    {isSelect
                      ? (isSelect?.weight / 10)
                          .toFixed(2)
                          .toString()
                          .replace('.', ',')
                      : ''}{' '}
                    kg
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </section>
      </div>
    </main>
  )
}
