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
      showdown: {
        front_default: string
      }
    }
  }
}

export function App() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPokemonData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto h-full max-w-screen-xl bg-slate-200">
      {/* logo temporario */}
      <img className="mx-auto" src="src/img/pokedexlogo.png" alt="" />
      <section className="py-7">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-16">
          {pokemonData.map((pokemon) => (
            <li
              key={pokemon.id}
              className={`bg-${pokemon.types[0].type.name} relative h-36 w-52 rounded-3xl bg-white shadow-lg`}>
              <div className="flex justify-center">
                <img
                  className="absolute -top-12 h-24 w-24 object-scale-down"
                  src={pokemon.sprites.other.showdown.front_default}
                  alt={pokemon.name}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center space-y-1 p-3">
                <h2 className="text-xs text-neutral-500">N° {pokemon.order}</h2>
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
