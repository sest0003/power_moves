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
  
});