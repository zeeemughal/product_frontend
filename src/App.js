import React, { useState, useEffect } from "react";
import axios from "axios";
import {REACT_APP_API_URL}  from './config'

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const apiUrl = REACT_APP_API_URL;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
      setProducts(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Failed to load products. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [apiUrl]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (editingId) {
      try {
        await axios.put(`${apiUrl}/products/${editingId}`, {
          name,
          price,
          description,
        });
        setSuccessMessage("Product updated successfully!");
        clearForm();
        fetchProducts();
        setEditingId(null);
      } catch (error) {
        console.error("Error updating product:", error);
        setErrorMessage("Failed to update product. Please try again.");
      }
    } else {
      try {
        await axios.post(`${apiUrl}/products`, {
          name,
          price,
          description,
        });
        setSuccessMessage("Product added successfully!");
        clearForm();
        fetchProducts();
      } catch (error) {
        console.error("Error adding product:", error);
        setErrorMessage("Failed to add product. Please try again.");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${apiUrl}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Failed to delete product. Please try again.");
    }
  };

  const handleEditProduct = (id, productName, productPrice, productDesc) => {
    setName(productName);
    setPrice(productPrice);
    setDescription(productDesc);
    setEditingId(id);
    setErrorMessage("");
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setEditingId(null);
    setErrorMessage("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Product List</h1>
      {successMessage && <p style={{ color: "green", padding: "10px", background: "#e8f5e9", borderRadius: "4px" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "#c62828", padding: "10px", background: "#ffebee", borderRadius: "4px" }}>{errorMessage}</p>}
      <form onSubmit={handleAddProduct} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button
          type="submit"
          style={{
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                background: "#1976d2",
                color: "white",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                background: "#1976d2",
                color: "white",
              }}
            >
              Price
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                background: "#1976d2",
                color: "white",
              }}
            >
              Description
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                background: "#1976d2",
                color: "white",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {product.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ${product.price}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {product.description}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  style={{ marginRight: "5px", cursor: "pointer" }}
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    handleEditProduct(
                      product._id,
                      product.name,
                      product.price,
                      product.description,
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
