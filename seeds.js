//初期データ（シードデータ）を作る

const mongoose = require("mongoose");
const {Product} = require("./models/product");
const Farm = require("./models/farm");

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDBコネクションOK！")
    }).catch(()=>{
        console.log("コネクションエラー！")
    });






const resetProducts = async () => {
    await Product.deleteMany({});
    await Product.insertMany([
    {
        name: "ナス",
        price: 98,
        category: "野菜"
    },
    {
        name: "カットメロン",
        price: 480,
        category: "果物"
    },
    {
        name: "種なしスイカのカット",
        price: 380,
        category: "果物"
    },
    {
        name: "オーガニックセロリ",
        price: 198,
        category: "野菜"
    },
    {
        name: "コーヒー牛乳",
        price: 298,
        category: "乳製品"
    }
    
])
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
}

const resetFarms = async () => {
    await Farm.deleteMany({})
    await Farm.insertMany([
        {name: "まったり牧場", city: "東京都", email:"@gmail.com"},
        {name: "えびふらい牧場", city: "愛知県", email:"@gmail.com"},
        {name: "たこやき牧場", city: "大阪府", email:"@gmail.com"}
    ])

}

resetProducts()
resetFarms()
