
function filterBrands(products) {
    const brands = products.map(product => ({
        id: product.brandId,
        name: product.Brand
    }));
    const uniqueBrands =  [...new Map(brands.map(brand => [brand.id, brand])).values()];
    return uniqueBrands;
}

function filterCategories(products) {
    const categories = products.map(product => ({
        id: product.categoryId,
        name: product.Category
    }));
    const uniqueCategories =  [...new Map(categories.map(cat => [cat.id, cat])).values()];
    return uniqueCategories;
}

module.exports = { filterBrands, filterCategories };