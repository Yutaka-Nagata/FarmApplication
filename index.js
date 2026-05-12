const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }))
//フォームから来たデータをパースする
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDBコネクションOK！")
    }).catch(() => {
        console.log("コネクションエラー！")
    });

const { Product, categories } = require("./models/product")
const Farm = require("./models/farm");
const { indexOf } = require("../YelpCamp/seeds/cities");




app.get("/farms", async (req, res) => {
    const farms = await Farm.find({})
    // const {category} = req.query
    // if(category){
    //     farms = await Farm.find({category})
    // }
    res.render("farms/index", { farms })

});

app.post("/farms", async (req, res) => {
    // console.log(req.body);
    await Farm.insertMany(req.body);

    res.redirect("/farms")

});

app.get("/farms/:id", async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate("products", "name")
    console.log("ファームの詳細！",farm)
    res.render("farms/detail", { farm })

});

app.delete("/farms/:id", async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.deleteOne({ _id: id });
    console.log("ファームの削除！", farm);
    res.redirect("/farms")

});


//データベースとやり取りする関数は脳死でasyncにしていいかも
app.get("/products", async (req, res) => {
    let products = await Product.find({})
    const { category } = req.query
    if (category) {
        products = await Product.find({ category })
    }
    res.render("./products/index", { products, categories })

});

app.get("/products/:id/patch", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm", "name");
    res.render("./products/patch", { product, categories })
});



app.post("/products", async (req, res) => {
    const { name, price, category } = req.body
    const product = new Product({ name, price, category })
    await product.save();

    const farm = await Farm.findOne({ name: req.body.farm })
    if (!farm) return res.send("ファームが存在しません")//ファームがなかった場合、エラー処理
    product.farm = farm;
    await product.save()
    farm.products.push(product)
    await farm.save();



    console.log("以下の商品を追加！", product);
    res.redirect("/products")

});


app.patch("/products/:id", async (req, res) => {
    // console.log("修正！");
    const { id } = req.params;
    const { name, price, category } = req.body
    const product = await Product.findByIdAndUpdate(id, { name, price, category }, { runValidators: true });
    //farm以外のUpdate
    const oldFarmId = product.farm;
    console.log("更新前のファーム", oldFarmId)

    const farm = await Farm.findOne({ name: req.body.farm })
    if (!farm) return res.send("ファームが存在しません")//ファームがなかった場合、エラー処理

    
    if(!farm._id.equals(oldFarmId)){
        product.farm = farm;
        await product.save()
        console.log("商品の修正！", product)

        farm.products.push(product._id);
        await farm.save();
        console.log("新しいファームの修正！", farm)

        if(oldFarmId){
            const oldFarm = await Farm.findById(oldFarmId);
            const index = oldFarm.products.findIndex(p => p.equals(product._id));
            if(index !== -1) oldFarm.products.splice(index, 1);
            await oldFarm.save()
            console.log("古いファームの修正！", oldFarm)
        }
    }else console.log("ファームの変更が行われませんでした")

    res.redirect("/products")
});

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.deleteOne({ _id: `${id}` });
    console.log("商品の削除！",product);
    res.redirect("/products")

});


app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id }).populate("farm", "name");
    console.log("商品の詳細！",product);
    res.render("./products/detail", { product })

});



app.listen(3000, () => {
    console.log("ポート3000で待機中！")
})