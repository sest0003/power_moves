document.addEventListener('DOMContentLoaded', () => {
    
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
  
