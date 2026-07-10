const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { upload } = require("../config/cloudinary"); // ← add karo
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/", protect, admin, upload.single("image"), createProduct); // ← upload add kiya
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct); // ← upload add kiya
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;