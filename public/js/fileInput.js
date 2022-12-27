const fileInput = document.querySelector('.file-input');
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('.file-name');
    fileName.textContent = fileInput.files[0].name;
  }
});
