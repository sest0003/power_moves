document.addEventListener('DOMContentLoaded', () => {
  
    /* Load data into editModal */
   document.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', event => {
      
        const row = event.target.closest('tr');
     
      //  <% brands.forEach(function(brand, index) { %>
     // <tr scope="row" data-brand="<%= JSON.stringify(brand) %>">
      const category = JSON.parse(row.getAttribute('data-category'));
  
        // Load data into modal
        document.querySelector('#editModal input[name="id"]').value = category.id;
        document.querySelector('#editModal input[name="name"]').value = category.name;
      
    });
   });

   // Confirm delete
   document.getElementById('deleteForm').addEventListener('submit', function (event) {
    if(!confirm('Are you sure you want to delete this category?')) {
        event.preventDefault();
    };
   });
  
});
  