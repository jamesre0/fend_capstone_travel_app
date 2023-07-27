/**
 * Attach a submit event listener to the form
 * @param {function} handler - The function to execute on form submit
 */
export function attachFormSubmitListener(handler) {
    // Get the form element
    const form = document.getElementById('travelForm');
  
    // Add a submit event listener to the form. 
    // When the form is submitted, the provided handler function will be executed
    form.addEventListener('submit', handler);
  }
  