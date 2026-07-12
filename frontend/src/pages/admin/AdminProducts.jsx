import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

const AdminProducts = () => {
  const { token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "", stock: ""
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch (error) {
      toast.error("Products load nahi hue!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("stock", formData.stock);
      if (imageFile) {
        form.append("image", imageFile);
      }

      if (editProduct) {
        await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/products/${editProduct._id}`, form, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/products`, form, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created!");
      }

      setShowForm(false);
      setEditProduct(null);
      setImageFile(null);
      setFormData({ name: "", description: "", price: "", category: "", stock: "" });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error!");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna chahte ho?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted!");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed!");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📦 Products</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
            setImageFile(null);
            setFormData({ name: "", description: "", price: "", category: "", stock: "" });
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
          + Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Text Fields */}
              {[
                { name: "name", placeholder: "Product Name", type: "text" },
                { name: "description", placeholder: "Description", type: "text" },
                { name: "price", placeholder: "Price", type: "number" },
                { name: "category", placeholder: "Category", type: "text" },
                { name: "stock", placeholder: "Stock", type: "number" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}

              {/* Image Upload */}
              <div>
                <label className="block text-gray-600 text-sm mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {/* New Image Preview */}
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-xl" />
                )}
                {/* Current Image */}
                {editProduct?.image && !imageFile && (
                  <img src={editProduct.image} alt="Current"
                    className="mt-2 h-32 w-32 object-cover rounded-xl" />
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">
                  {editProduct ? "Update" : "Create"}
                </button>
                <button type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">⏳ Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Image</th>
                <th className="px-6 py-4 text-left text-gray-600">Product</th>
                <th className="px-6 py-4 text-left text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-gray-600">Price</th>
                <th className="px-6 py-4 text-left text-gray-600">Stock</th>
                <th className="px-6 py-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name}
                        className="h-12 w-12 object-cover rounded-xl" />
                    ) : (
                      <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">
                        🛍️
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-indigo-600 font-bold">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(product)}
                      className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-200 font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;