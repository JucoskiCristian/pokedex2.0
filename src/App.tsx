import axios from 'axios'
import { useEffect, useState } from 'react'
import { card } from './components/card'

type Pokemon = {
  id: number
  name: string
  url: string
  types: { type: { name: string } }[]
  sprites: {
    other: {
      showdown: {
        front_default: string
      }
    }
  }
}

export function App() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    const fetchPokemonData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=151'
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
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPokemonData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <main className="mx-auto h-dvh max-w-screen-xl bg-zinc-200">
      <h1 className="p-6 text-center text-5xl text-yellow-400">Pokedex</h1>
      <section>
        <ul className="flex flex-wrap justify-center gap-4">
          {pokemonData.map((pokemon) => (
            <li
              key={pokemon.id}
              className={`bg-${pokemon.types[0].type.name} h-52 w-52 rounded-3xl bg-slate-200`}>
              <div className="flex justify-center">
                <img
                  src={pokemon.sprites.other.showdown.front_default}
                  alt={pokemon.name}
                />
              </div>
              <div className="flex flex-col items-center justify-center p-3">
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
    </main>
  )
}
