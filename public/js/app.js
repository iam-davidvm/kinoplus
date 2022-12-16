/* Hide flash messages */
const hideFlash = document.getElementById('hide-flash');

if (hideFlash) {
  hideFlash.addEventListener('click', (event) => {
    event.target.parentElement.style.display = 'none';
  });
}

/* forms */
// show the current length of the message box and show errors
const form = document.getElementById('form');
if (form) {
  const counterBox = form.querySelector('.counter-box');
  const counterMessage = form.querySelector('.counter-message');

  if (counterBox && counterMessage) {
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
  }
}
/* Showing modal */
const deleteModal = document.getElementById('delete-modal');
const deleteModalOpen = document.getElementById('delete-modal-open');
const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

deleteModalOpen.addEventListener('click', () => {
  deleteModal.classList.add('is-active');
});

for (let modalClose of modalCloseBtns) {
  modalClose.addEventListener('click', () => {
    deleteModal.classList.remove('is-active');
  });
}
