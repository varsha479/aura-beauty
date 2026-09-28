import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const MAKEUP_API_URL = 'https://makeup-api.herokuapp.com/api/v1/products.json'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getProducts = () => api.get('/products')
export const getProduct = (id) => api.get(`/products/${id}`)

export const getMakeupProducts = (params = {}) => axios.get(MAKEUP_API_URL, { params })
export const getMakeupProduct = (id) => axios.get(`${MAKEUP_API_URL.replace('.json', '')}/${id}.json`)

const currencyToInr = { USD: 83.5, CAD: 61.5, GBP: 106.5, EUR: 90, AUD: 54 }

export function normalizeMakeupProduct(product) {
  if (!product?.image_link) return null
  const productType = (product.product_type || product.category || 'makeup').toLowerCase()
  const categoryGroups = {
    face: ['foundation', 'blush', 'bronzer', 'contour', 'highlighter', 'powder', 'concealer', 'bb_cc', 'blushes'],
    eyes: ['eyeshadow', 'eyeliner', 'mascara', 'eyebrow', 'eye_primer'],
    lips: ['lipstick', 'lip_gloss', 'lip_liner', 'lip_stain', 'lip_balm'],
    nails: ['nail_polish', 'nail_care'],
    tools: ['makeup_brushes', 'brush', 'tools', 'sponge', 'makeup_tools'],
    skin: ['skincare', 'moisturizer', 'serum', 'cleanser', 'primer', 'face_primer'],
  }
  const category = Object.entries(categoryGroups).find(([, types]) => types.includes(productType))?.[0]
  const categoryLabel = { face: 'Face', eyes: 'Eyes', lips: 'Lips', nails: 'Nails', tools: 'Tools & Brushes', skin: 'Skin' }[category] || 'Other'
  const sourcePrice = Number.parseFloat(product.price)
  const priceValue = Number.isFinite(sourcePrice) && sourcePrice > 0
    ? Math.round(sourcePrice * (currencyToInr[product.currency] || currencyToInr.USD))
    : 0
  const price = priceValue ? `₹${priceValue.toLocaleString('en-IN')}` : 'Price unavailable'

  return {
    apiId: product.id,
    brand: product.brand || 'Independent beauty',
    slug: `makeup-${product.id}`,
    name: product.name || 'Untitled makeup product',
    category: categoryLabel,
    productType,
    description: product.description?.replace(/<[^>]+>/g, '').trim() || `${productType} by ${product.brand || 'the makeup archive'}`,
    accent: `${product.brand || 'Independent beauty'} · ${product.category || productType}`,
    image: product.image_link,
    price,
    priceValue,
    rating: product.rating,
    colors: product.product_colors || [],
    tryOnType: ['eyeshadow', 'lipstick', 'foundation'].includes(productType) ? productType : null,
  }
}

export const registerUser = (payload) => api.post('/auth/register', payload)
export const loginUser = (payload) => api.post('/auth/login', payload)
export const getCurrentUser = () => api.get('/auth/me')
export const updateCurrentUser = (payload) => api.put('/auth/update', payload)

export default api
