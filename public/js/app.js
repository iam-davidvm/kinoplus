/* Hide flash messages */
const hideFlash = document.getElementById('hide-flash');

if (hideFlash) {
  hideFlash.addEventListener('click', (event) => {
    event.target.parentElement.style.display = 'none';
  });
}

/* forms */
const form = document.getElementById('form');
const counterBox = form.querySelector('.counter-box');
const counterMessage = form.querySelector('.counter-message');

counterBox.addEventListener('input', (event) => {
  const currentLength = event.target.textLength;
  if (currentLength === 192) {
    counterMessage.classList.remove('is-success');
    counterMessage.classList.add('is-danger');
    counterMessage.innerText =
      'You have reached the maximum amount of characters';
  } else if (currentLength > 0) {
    counterMessage.classList.add('is-success');
    counterMessage.classList.remove('is-danger');
    counterMessage.innerText = `${currentLength} / 192`;
  } else {
    counterMessage.classList.remove('is-success');
    counterMessage.classList.remove('is-danger');
    counterMessage.innerText = 'Maximum 192 characters';
  }
});
