const mongoose = require("mongoose")
const {Schema} = mongoose;
const Product = require("./product")


const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, "nameが必要です"]
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, "emailが必要です"]
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
})

farmSchema.post('findOneAndDelete', async function(farm) {
    if (farm.products.length) {
        const res = await Product.deleteMany({
            _id: { $in: doc.products }
        });
        console.log(res)
    }
});


const Farm = mongoose.model("Farm", farmSchema)
module.exports = Farm