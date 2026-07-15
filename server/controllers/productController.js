import Product from '../models/Product.js'

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query
    let query = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    let products = Product.find(query)

    if (sort === 'price-low') {
      products = products.sort({ price: 1 })
    } else if (sort === 'price-high') {
      products = products.sort({ price: -1 })
    } else if (sort === 'rating') {
      products = products.sort({ rating: -1 })
    }

    const result = await products
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, ingredients } = req.body

    const product = new Product({
      name,
      description,
      price,
      category,
      ingredients
    })

    await product.save()
    res.status(201).json({ message: 'Product created successfully', product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    res.json({ message: 'Product updated successfully', product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
