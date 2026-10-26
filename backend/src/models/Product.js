import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, trim: true, maxlength: 100 },
  reviewerEmail: { type: String, trim: true, lowercase: true, maxlength: 254 },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true, maxlength: 2000, required: true },
  date: { type: Date, default: Date.now },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  brand: { type: String, trim: true, maxlength: 100, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  price: { type: Number, required: true, min: 0, max: 1000000, validate: Number.isFinite },
  stock: { type: Number, required: true, min: 0, max: 1000000, validate: Number.isInteger },
  thumbnail: { type: String, required: true, trim: true, maxlength: 2048 },
  images: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
  warrantyInformation: { type: String, default: "", maxlength: 500 },
  shippingInformation: { type: String, default: "", maxlength: 500 },
  availabilityStatus: { type: String, default: "In Stock", maxlength: 80 },
  reviews: { type: [reviewSchema], default: [] },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", brand: "text" });
productSchema.index({ price: 1, rating: -1, createdAt: -1 });

export default mongoose.models.Product ?? mongoose.model("Product", productSchema);