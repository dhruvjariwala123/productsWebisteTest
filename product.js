class Product{
    constructor(id,name,category,price,imageUrl,description){
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl
        this.description = description
    }    
}
let productsLimit = 50;
let products =[];
getData()
let categories = JSON.parse(localStorage.getItem("categories"))["categories"]
let selectedProduct = products.find(p=>p.id==localStorage.getItem("selectedProduct"))


addCategories()
addSelectedProduct()
addClickEventToProducts()
addClickEventToCategories()
addClickEventToSearchButton()

function addClickEventToCategories(){
    $(".category").click(updateProductsByCategory)
}
function addClickEventToSearchButton(){

    $("#searchButton").click(updateProductsByProductName)
}
function addClickEventToProducts(){
    $(".productDisplay").click(openProductDetailes)
}

function addCategories() {
    categories.forEach(category => {
        $("#categoryTab").html(
            $("#categoryTab").html() +
            `<div class="category">${category}</div>`
        )
    });
}

function updateProductsByCategory(){
    if(this.textContent){
        let result = searchByCategory(this.textContent)
        if(result){
            clearAllProducts()
            addProducts(result,productsLimit)
            addClickEventToProducts()
        }
    }
}
function updateProductsByProductName(){
    if($.trim($("#searchBox").val()) != ""){
        let result = searchByProductName($.trim($("#searchBox").val()))
        if(result){
            clearAllProducts()
            addProducts(result,productsLimit)
            addClickEventToProducts()
        }
    }
}

function clearAllProducts(){
    $("#product").html("")
}
function searchByCategory(category){
    if(category != "All"){
        let resultProducts = products.filter(p=>p.category == category)
        return resultProducts;
    }
    return products;
}
function searchByProductName(name){
    let resultProducts = products.filter(p=>p.name.toLowerCase().includes(name.toLowerCase()))
    return resultProducts;
}

function addProducts(productList,limit){
    let count = 0;
    for(let i = 0; i < (limit > productList.length ? productList.length:limit); i++){
        let product = productList[i];
        $("#product").html( $("#product").html()+
            `<div class="productDisplay" id="${product.id}">       
            <img src="${product.imageUrl}" class="productImage" alt="product image">
            <div class="productName">Name: ${product.name}   </div>
            <div class="productRate">Rate: ${product.price} Rs</div>
        </div>`
        )
        count++;
    }
    $("#productCount").html(`Count : ${count}`);
}

function addSelectedProduct() {
    $("#product").html(`<div class="selectedProductDisplay" id="${selectedProduct.id}"> <img src="${selectedProduct.imageUrl}"  class="productImage" alt="product image">
    <div class="productDetailes">Name: ${selectedProduct.name}   </div>
    <div class="productDetailes">Rate: ${selectedProduct.price} Rs</div>
    <div
    class="productDetailes">Category : ${selectedProduct.category}</div>
    <div class="productDetailes">Description: ${selectedProduct.description}</div>
    <input type="button" class="btn" value="Buy Now">
    `)
}
function openProductDetailes(){
    let productsString = JSON.stringify({products:products})
    let categoriesString = JSON.stringify({categories:categories})
    localStorage.setItem("selectedProduct",this.id)
    localStorage.setItem("products",productsString)
    localStorage.setItem("categories",categoriesString)
window.location = "product.html"
}
function getData(){
    $.ajax({
        type: "GET",
        url: "products.xml",
        dataType: "xml",
        async:false,
        success: function (response) {
            // console.log(response)
            let xmlDom = response
            let productsList = xmlDom.querySelectorAll("Product")
           
            for(let i = 0; i < productsLimit*10; i++){
                let element = productsList[i];
               products.push(new Product(
               parseInt(element.querySelector("Product_No").textContent),
                element.querySelector("Product_Name").textContent,
                element.querySelector("Product_Category").textContent,
                parseFloat(element.querySelector("Product_Price").textContent),
                element.querySelector("Product_Image_Url").textContent,
                element.querySelector("Product_description").textContent
               ))
            }
        },
        error:function(xhr,status,error){
            if(xhr.status === 404) {
                console.log("File not found");
            } else {
                console.log("Error:", error);
            }
        }
    });
}

