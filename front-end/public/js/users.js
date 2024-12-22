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
     
      const user = JSON.parse(row.getAttribute('data-user'));

        // Load data into modal
        document.querySelector('#editModal input[name="id"]').value = user.id;
        document.querySelector('#statusDropdown').value = user.roleId;
      
    });
   }); 

 
});
  
