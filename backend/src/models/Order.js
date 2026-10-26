import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, validate: Number.isInteger },
    unitPriceCents: { type: Number, required: true, min: 0 },
    lineTotalCents: { type: Number, required: true, min: 0 },
  }],
  shippingAddress: {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    postalCode: { type: String, required: true, trim: true, maxlength: 24 },
  },
  subtotalCents: { type: Number, required: true, min: 0 },
  shippingCents: { type: Number, required: true, min: 0 },
  taxCents: { type: Number, required: true, min: 0 },
  totalCents: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending", index: true },
}, { timestamps: true });

export default mongoose.models.Order ?? mongoose.model("Order", orderSchema);