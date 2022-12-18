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

/* show rating of the slider */

function findOutputForSlider(el) {
  const idVal = el.id;
  outputs = document.getElementsByTagName('output');
  for (const i = 0; i < outputs.length; i++) {
    if (outputs[i].htmlFor == idVal) return outputs[i];
  }
}

const sliders = document.querySelectorAll('input[type="range"].slider');
[].forEach.call(sliders, function (slider) {
  const output = findOutputForSlider(slider);
  if (output) {
    slider.addEventListener('input', function (event) {
      output.value = event.target.value;
    });
  }
});

/* end of show rating of the slider */

/* end of forms */
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
/* end of showing modals */
