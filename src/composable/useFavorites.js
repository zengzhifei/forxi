import { ref } from 'vue'

const STORAGE_KEY = 'it-tools-favorites'

const favorites = ref([])

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      favorites.value = JSON.parse(stored)
      favorites.value = [...favorites.value]
    }
  } catch (e) {
    console.error('Failed to load favorites:', e)
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  } catch (e) {
    console.error('Failed to save favorites:', e)
  }
}

loadFavorites()

export function useFavorites() {
  function isFavorite(toolId) {
    return favorites.value.includes(toolId)
  }

  function toggleFavorite(toolId) {
    const index = favorites.value.indexOf(toolId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(toolId)
    }
    favorites.value = [...favorites.value]
    saveFavorites()
  }

  function addFavorite(toolId) {
    if (!favorites.value.includes(toolId)) {
      favorites.value.push(toolId)
      favorites.value = [...favorites.value]
      saveFavorites()
    }
  }

  function removeFavorite(toolId) {
    const index = favorites.value.indexOf(toolId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      favorites.value = [...favorites.value]
      saveFavorites()
    }
  }

  function getFavorites() {
    return favorites.value
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    getFavorites,
  }
}
