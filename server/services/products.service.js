import {
  findAll,
  findById,
  create,
  update,
  deactivate,
} from "../models/product.model.js";

export const getAllProducts = () => findAll();

export async function getProductById(id) {
  const product = await findById(id);
  if (!product) throw new Error("Product not found");
  return product;
}

export const createProduct = (data) => create(data);

export async function updateProduct(id, data) {
  const product = await update(id, data);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function deactivateProduct(id) {
  const product = await deactivate(id);
  if (!product) throw new Error("Product not found");
  return product;
}
