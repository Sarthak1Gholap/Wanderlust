(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission if form is invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // If the form is not valid, prevent submission
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Add Bootstrap validation class to the form
      form.classList.add('was-validated');
    }, false);
  });
})();
