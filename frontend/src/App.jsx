import React, { useState, useMemo, useEffect } from 'react'

export default function App() {
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [favorites, setFavorites] = useState([])
  const [adopting, setAdopting] = useState(null)
  const [success, setSuccess] = useState(null)

  const petsData = [
    {
      id: 1,
      name: 'Bella',
      type: 'Dog',
      age: '2 years',
      short: 'Friendly Labrador',
      description: 'Loves people and other pets. Great with families!',
      image: 'https://place-puppy.com/300x300'
    },
    {
      id: 2,
      name: 'Milo',
      type: 'Cat',
      age: '1 year',
      short: 'Playful Siamese',
      description: 'Enjoys naps in sunny spots and chasing toy mice.',
      image: 'https://placekitten.com/300/300'
    },
    {
      id: 3,
      name: 'Coco',
      type: 'Rabbit',
      age: '6 months',
      short: 'Cute and calm bunny',
      description: 'Loves carrots and cuddles. Great indoor pet.',
      image: 'https://placebear.com/300/300'
    }
  ]

  useEffect(() => {
    const raw = localStorage.getItem('fav_pets')
    if (raw) setFavorites(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('fav_pets', JSON.stringify(favorites))
  }, [favorites])

  const types = useMemo(() => {
    const setTypes = new Set(petsData.map(p => p.type))
    return ['All', ...Array.from(setTypes)]
  }, [])

  const filteredPets = useMemo(() => {
    return petsData.filter(p => {
      const matchesQuery = [p.name, p.type, p.age, p.short, p.description]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesType = filterType === 'All' ? true : p.type === filterType
      return matchesQuery && matchesType
    })
  }, [query, filterType])

  const toggleFavorite = id => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      return [...prev, id]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-teal-600 text-white p-4 text-center shadow">
        <h1 className="text-3xl font-bold">🐾 Pet Adoption Center</h1>
        <p className="text-sm opacity-90">Find your new best friend today</p>
      </header>

      {/* Search & Filter */}
      <div className="max-w-5xl mx-auto mt-6 px-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <input
          type="text"
          placeholder="Search pets..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {types.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Pets Grid */}
      <main className="max-w-5xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPets.map(pet => (
          <div
            key={pet.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="rounded-xl h-56 w-full object-cover mb-3"
            />
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <p className="text-sm text-gray-500">{pet.short}</p>
            <p className="text-sm mt-1 text-gray-600">{pet.age} • {pet.type}</p>
            <p className="text-gray-700 mt-2 text-sm flex-grow">{pet.description}</p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => toggleFavorite(pet.id)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  favorites.includes(pet.id)
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {favorites.includes(pet.id) ? '♥ Favorited' : '♡ Favorite'}
              </button>
              <button
                onClick={() => setAdopting(pet)}
                className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm hover:bg-teal-700"
              >
                Adopt
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Adoption Modal */}
      {adopting && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-bold mb-3">Adopt {adopting.name}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Fill in your details to start the adoption process.
            </p>
            <form
              onSubmit={e => {
                e.preventDefault()
                setSuccess(adopting)
                setAdopting(null)
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setAdopting(null)}
                className="text-gray-500 text-sm hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Adoption Successful!</h2>
            <p className="text-gray-700 text-sm mb-4">
              You’ve successfully adopted {success.name}! Our team will contact you soon.
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t mt-8">
        © {new Date().getFullYear()} Pet Adoption Center • Built with ❤️ using React + Vite
      </footer>
    </div>
  )
}
