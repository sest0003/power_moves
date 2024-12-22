document.addEventListener('DOMContentLoaded', () => {
 
    /* Load data into editModal */
   document.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', event => {
      
        const row = event.target.closest('tr');
     
      const order = JSON.parse(row.getAttribute('data-order'));
      // Hämta alla rader med data-order-attribut
document.querySelectorAll('tr[data-order]').forEach(row => {
  // Logga värdet av data-order
  console.log(row.getAttribute('data-order'));
});
  
        // Load data into modal
        document.querySelector('#editModal input[name="id"]').value = order.id;
        document.querySelector('#statusDropdown').value = order.orderStatusId;
      
    });
   });

 
});
  
