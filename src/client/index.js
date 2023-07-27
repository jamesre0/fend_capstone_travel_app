// Importing necessary functions and styles
import { handleSubmit } from './js/app';
import { attachFormSubmitListener } from './js/eventListener';
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

// As soon as the DOM is fully loaded, attach the form submit listener
document.addEventListener('DOMContentLoaded', () => {
  // The form submit listener is attached here. When the form is submitted,
  // the handleSubmit function will be executed.
  attachFormSubmitListener(handleSubmit);
});
