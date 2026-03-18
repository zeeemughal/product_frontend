import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {REACT_APP_API_URL}  from './config'

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const apiUrl = REACT_APP_API_URL;

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = sortBy === "price" ? Number(a.price) : a.name.toLowerCase();
        const bVal = sortBy === "price" ? Number(b.price) : b.name.toLowerCase();
        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
  }, [products, searchTerm, sortBy, sortOrder]);

  const paginationInfo = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    return { currentProducts, totalPages };
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, itemsPerPage]);

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
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "200px" }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} style={{ padding: "5px 10px" }}>
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
        <span style={{ marginLeft: "20px" }}>
          Show:
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{ marginLeft: "5px", padding: "5px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </span>
      </div>
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
          {paginationInfo.currentProducts.map((product) => (
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
      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || paginationInfo.totalPages === 0}
          style={{ padding: "5px 10px" }}
        >
          Prev
        </button>
        <span>Page {currentPage} of {paginationInfo.totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(paginationInfo.totalPages, prev + 1))}
          disabled={currentPage >= paginationInfo.totalPages || paginationInfo.totalPages === 0}
          style={{ padding: "5px 10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
