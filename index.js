class Product {
    constructor(id, name, category, price, imageUrl, description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl
        this.description = description
    }
}

let products = [];
let categories = [];
let mainProductsLimit = 50;
let productsLimit = 50;
products = getData(0, mainProductsLimit)
addProducts(products, 0, mainProductsLimit)
updateProductsCount(mainProductsLimit)
addCategories()
addClickEventToProducts()
addClickEventToCategories()
addClickEventToSearchButton()
addScrollEventToWindow()
function addClickEventToProducts() {
    $(".productDisplay").click(openProductDetailes)
}
function addClickEventToCategories() {
    $(".category").click(updateProductsByCategory)
}
function addClickEventToSearchButton() {

    $("#searchButton").click(updateProductsByProductName)
}
function addScrollEventToWindow() {
    $(window).on("scroll", manageProductforScroll)
}

function updateProductsCount(count) {
    $("#productCount").text(count)
}
function updateProductsByCategory() {
    if (this.textContent) {
        let result = searchByCategory(this.textContent)
        if (result) {
            clearAllProducts()
            addProducts(result, 0, mainProductsLimit)
            addClickEventToProducts()
        }
    }
}
function updateProductsByProductName() {
    if ($.trim($("#searchBox").val()) != "") {
        let result = searchByProductName($.trim($("#searchBox").val()))
        if (result) {
            clearAllProducts()
            addProducts(result, 0, mainProductsLimit)
            addClickEventToProducts()
        }
    }
}
function clearAllProducts() {
    $("#productContainer").html("")
}
function searchByCategory(category) {
    if (category != "All") {
        let resultProducts = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].category == category) {
                resultProducts.push(products[i]);
                if (resultProducts.length >= mainProductsLimit) {
                    break; // Stop the loop once we find the first 100 matches
                }
            }
        }
        return resultProducts;
    }
    return products;
}
function searchByProductName(name) {
    let resultProducts = [];
    for (let i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase().includes(name.toLowerCase())) {
            resultProducts.push(products[i]);
            if (resultProducts.length >= mainProductsLimit) {
                break; // Stop the loop once we find the first 100 matches
            }
        }
    }
    return resultProducts;
}

function openProductDetailes() {
    let categoriesString = JSON.stringify({ categories: categories })
    localStorage.setItem("selectedProduct", this.id)
    localStorage.setItem("categories", categoriesString)
    window.location = "product.html"
}

function addProducts(productList) {
    let count = 0;
    for (let i = 0; i < productList.length; i++) {
        let product = productList[i];

        $("#productContainer").append(`<div class="productDisplay" id="${product.id}">
        <div class="product-id">${product.id}</div>       
        <img src="${product.imageUrl}" class="productImage" alt="product image">
        <div class="productName">Name: ${product.name}   </div>
        <div class="productRate">Rate: ${product.price} Rs</div>
    </div>`
        )
        count++;
    }
}
function addCategories() {
    categories = products.map(product => product.category).filter((category, index, self) => self.indexOf(category) === index);
    categories.forEach(category => {
        $("#categoryTab").html(
            $("#categoryTab").html() +
            `<div class="category">${category}</div>`
        )
    });
}
function getData(start, end) {
    let dataList = [];
    $.ajax({
        type: "GET",
        url: "products.xml",
        // dataType: "xml",
        async: false,
        success: function (response) {
            let xmlDom = response
            let productsList = xmlDom.querySelectorAll("Product")
            // let loopLimit = (productsLimit * 10) < response.products.length ? (productsLimit * 10) : response.products.length;
            for (let i = start; i < end; i++) {
                let element = productsList[i];
                dataList.push(new Product(
                    parseInt(element.querySelector("Product_No").textContent),
                    element.querySelector("Product_Name").textContent,
                    element.querySelector("Product_Category").textContent,
                    parseFloat(element.querySelector("Product_Price").textContent),
                    element.querySelector("Product_Image_Url").textContent,
                    element.querySelector("Product_description").textContent
                ))
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                console.log("File not found");
            } else {
                console.log("Error:", error);
            }
        }
    });
    return dataList;
}

function manageProductforScroll() {
    let myBool = isHaveToAddProducts(productsLimit, 0.8)
    if (myBool) {
        productsLimit += mainProductsLimit;
        myBool = false;
        let newProducts = getData(productsLimit - mainProductsLimit, productsLimit)
        products = [...products, ...newProducts]
        addProducts(newProducts, productsLimit - mainProductsLimit, productsLimit)
        addClickEventToProducts();
        updateProductsCount(productsLimit)
    }
}
function isHaveToAddProducts(count, offset) {
    let containerSize = getTotalWidthAndHeight($("#productContainer")[0])
    let productSize = getTotalWidthAndHeight($(".productDisplay")[0]);
    let scrollTop = document.documentElement.scrollTop;
    let container = $("#productContainer")[0]
    let topOffset = container.offsetTop;
    let maxProductsInRow = Math.floor(containerSize.width / productSize.width);
    let endScroll = topOffset + productSize.height * (count / maxProductsInRow);
    let myBool = scrollTop > (endScroll * offset);
    return myBool;
}
function getTotalWidthAndHeight(element) {
    // Get the computed styles of the element
    var computedStyle = window.getComputedStyle(element);

    // Extract width, height, margin, and padding values
    var width = parseFloat(computedStyle.getPropertyValue('width'));
    var height = parseFloat(computedStyle.getPropertyValue('height'));
    var marginLeft = parseFloat(computedStyle.getPropertyValue('margin-left'));
    var marginRight = parseFloat(computedStyle.getPropertyValue('margin-right'));
    var marginTop = parseFloat(computedStyle.getPropertyValue('margin-top'));
    var marginBottom = parseFloat(computedStyle.getPropertyValue('margin-bottom'));
    var paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left'));
    var paddingRight = parseFloat(computedStyle.getPropertyValue('padding-right'));
    var paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'));
    var paddingBottom = parseFloat(computedStyle.getPropertyValue('padding-bottom'));

    // Calculate total width and height including margin and padding
    var totalWidth = width + marginLeft + marginRight + paddingLeft + paddingRight;
    var totalHeight = height + marginTop + marginBottom + paddingTop + paddingBottom;

    return { width: totalWidth, height: totalHeight };
}

