document.addEventListener('DOMContentLoaded', () => {

  /* Dropdown functions */
  const searchTypeInput = document.getElementById('search-type');
  const categoryField  = document.getElementById('categoryDropdown');
  const brandField = document.getElementById('brandDropdown');
  const searchField = document.getElementById('search');
  
    categoryField.addEventListener('change', function () {
        if(this.value) {
          searchTypeInput.value = 'category';
        }
    });

    brandField.addEventListener('change', function () {
      if(this.value) {
        searchTypeInput.value = 'brand';
      }
    });

    searchField.addEventListener('input', function () {
      if(this.value.trim() !== '') {
        searchTypeInput.value = 'search'
      }
    });


    /* Load data into editModal */
  document.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', event => {
      const row = event.target.closest('tr');
   
    //  <% brands.forEach(function(brand, index) { %>
   // <tr scope="row" data-brand="<%= JSON.stringify(brand) %>">
    const product = JSON.parse(row.getAttribute('data-product'));

      // Load data into modal
    document.querySelector('#editModal input[name="id"]').value = product.id;
    document.querySelector('#editModal input[name="name"]').value = product.name;
    document.querySelector('#editModal input[name="desc"]').value = product.description;
    document.querySelector('#editModal input[name="price"]').value = product.unitPrice;
    document.querySelector('#editModal input[name="stock"]').value = product.stock;
    document.querySelector('#editModal input[name="imageUrl"]').value = product.imageUrl;
    document.querySelector('#editModal input[name="isDeleted"]').checked = product.isDeleted === 1;
    document.querySelector('#editModal input[name="brandId"]').value = product.brandId;
    document.querySelector('#editModal input[name="categoryId"]').value = product.categoryId;    
  });
 });





});
