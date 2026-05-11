import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
} from "../services/products.service.js";

export async function getAllProductsController(req, res) {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductByIdController(req, res) {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    const status = err.message === "Product not found" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
}

export async function createProductController(req, res) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProductController(req, res) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) {
    const status = err.message === "Product not found" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
}

export async function deactivateProductController(req, res) {
  try {
    const product = await deactivateProduct(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    const status = err.message === "Product not found" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
}
