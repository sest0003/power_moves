document.addEventListener('DOMContentLoaded', () => {
  
      /* Alert functions */
    const successElement = document.getElementById('success-alert');
    if (successElement) {
      const successModal = new bootstrap.Modal(successElement);
      successModal.show();
    }
  
    const errorElement = document.getElementById('error-alert');
    if (errorElement) {
      const errorModal = new bootstrap.Modal(errorModal);
      errorModal.show();
    }
  

  
    /* Load data into editModal */
   document.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', event => {
      
        const row = event.target.closest('tr');
     
      //  <% brands.forEach(function(brand, index) { %>
     // <tr scope="row" data-brand="<%= JSON.stringify(brand) %>">
      const brand = JSON.parse(row.getAttribute('data-brand'));
  
        // Load data into modal
        document.querySelector('#editModal input[name="id"]').value = brand.id;
        document.querySelector('#editModal input[name="name"]').value = brand.name;
      
    });
   });

   // Confirm delete
   document.querySelectorAll('.deleteForm').forEach(form => {
    form.addEventListener('submit', function (event) {
    if(!confirm('Are you sure you want to  delete this brand?')) {
        event.preventDefault();
    }
   });
  });
  
});
  
