import React, { useState, useEffect } from "react";
import axios from "axios";
import {REACT_APP_API_URL}  from './config'

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const apiUrl = REACT_APP_API_URL; // Accessing environment variable

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [apiUrl]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      // Updating existing product
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
      }
    } else {
      // Adding a new product
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
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${apiUrl}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (id, productName, productPrice, productDesc) => {
    setName(productName);
    setPrice(productPrice);
    setDescription(productDesc);
    setEditingId(id);
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setEditingId(null);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "black" }}>Product List</h1>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
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
                border: "1px solid black",
                padding: "8px",
                background: "lightblue",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                background: "lightblue",
              }}
            >
              Price
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                background: "lightblue",
              }}
            >
              Description
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                background: "lightblue",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {product.name}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                ${product.price}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {product.description}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  style={{ marginRight: "5px" }}
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
// TEST AUTO TITLE
