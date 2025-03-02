document.addEventListener("DOMContentLoaded", function () {
  let prevBtn = document.getElementById("previous-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", goBack);
  }
});

function goBack() {
  window.history.back();
}


function goBack() {
    if (window.history.length > 1) {
       window.history.back();
     } else {
      alert("No previous page available!");
    }
 }
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

//     function IsDelConfirm(obj){
//     let sure = confirm("Are you sure to delete this listing!");
//     console.log(obj);
//   if(sure){
//     return;
//   }else{
//     obj.preventDefault();
//     console.dir(obj);
//     return;
//   }
//  }
