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
     
      const order = JSON.parse(row.getAttribute('data-membership'));
    
        // Load data into modal
        document.querySelector('#editModal input[name="id"]').value = order.id;
        document.querySelector('#editModal input[name="type"]').value = order.type;
        document.querySelector('#editModal input[name="discount"]').value = order.discount;
      
    });
   });

 
});
  
