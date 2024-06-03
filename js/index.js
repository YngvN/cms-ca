const consumerKey = 'ck_9e359e84544c72eb9b3ac6ca6d760f6485ee31dd';
const consumerSecret = 'cs_b3a5490c3a4cbac309f80aba7eb92ea40b41a5dc';


// Fetches the products and creates the product tiles
document.addEventListener('DOMContentLoaded', function () {
    fetch(`https://cms.nykas.me/wp-json/wc/v3/products?per_page=100&_fields=id,name,description,price,regular_price,sale_price,images`, {
        headers: {
            'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`)
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(product => {
                let price = product.price ? `Price: ${product.price}` : 'Price not available';
                let regularPrice = product.regular_price ? `Regular Price: ${product.regular_price}` : '';
                let salePrice = product.sale_price ? `Sale Price: ${product.sale_price}` : '';

                content += `
                    <li class="product" onclick="fetchProductDetails(${product.id})">
                        <h2>${product.name}</h2>
                        <p>${price}</p>
                        <p>${regularPrice}</p>
                        <p>${salePrice}</p>
                    </li>
                `;
            });
            document.getElementById('products').innerHTML = content;
        })
        .catch(error => console.error('Error fetching products:', error));
});


// Fectches spesific products
window.fetchProductDetails = function (productId) {
    fetch(`https://cms.nykas.me/wp-json/wc/v3/products/${productId}?_fields=id,name,description,price,regular_price,sale_price,images`, {
        headers: {
            'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`)
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(product => {
            let price = product.price ? `Price: ${product.price}` : 'Price not available';
            let regularPrice = product.regular_price ? `Regular Price: ${product.regular_price}` : '';
            let salePrice = product.sale_price ? `Sale Price: ${product.sale_price}` : '';

            let details = `
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <div>${product.description}</div>
                    <p>${price}</p>
                    <p>${regularPrice}</p>
                    <p>${salePrice}</p>
                    <button class="btn-close" onclick="closeProductDetails()">Close</button>
                </div>
            `;

            if (product.images && product.images.length > 0) {
                product.images.forEach(image => {
                    details += `
                        <div class="product-media">
                            <img src="${image.src}" alt="${image.alt}">
                        </div>
                    `;
                });
            }

            const modal = document.getElementById('product-modal');

            modal.innerHTML = details;
            modal.style.display = "flex";

        })
        .catch(error => console.error('Error fetching product details:', error));
}

window.closeProductDetails = function () {
    document.getElementById('product-modal').style.display = 'none';
}
