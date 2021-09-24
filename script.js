const filters = ['blur', 'invert', 'sepia', 'saturate', 'hue'];
const filtersArea = document.querySelector('.filters');
const imageToEdit = document.querySelector('#image');
const baseUrl = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
const images = ['/01.jpg', '/02.jpg', '/03.jpg', '/04.jpg', '/05.jpg', '/06.jpg', '/07.jpg',
                '/08.jpg', '/09.jpg', '/10.jpg', '/11.jpg', '/12.jpg', '/13.jpg', '/14.jpg',
                '/15.jpg', '/16.jpg', '/17.jpg', '/18.jpg', '/19.jpg', '/20.jpg'];

function handleUpdate(e) {
  const element = e.target;
  const suffix = element.dataset.sizing;
  filters.forEach(elem => {
    if (element.matches(`input[name='${elem}']`)) {
      element.nextElementSibling.value = element.value;
      document.documentElement.style.setProperty(`--${element.name}`, element.value + suffix);
    }
  })
}

filtersArea.addEventListener('input', handleUpdate);

function resetFilters(filter) {
  const element = document.querySelector(`input[name='${filter}']`);
  const suffix = element.dataset.sizing;
  const defaultValue = element.defaultValue;
  element.value = defaultValue;
  element.nextElementSibling.value = defaultValue;
  document.documentElement.style.setProperty(`--${element.name}`, defaultValue + suffix);
}

function getTimeOfDay() {
  const date = new Date();
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 24) return 'evening';
  return 'night';
}

function viewImage(src) {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    imageToEdit.setAttribute('src', src);
    imageToEdit.setAttribute('alt', 'image');
    imageToEdit.setAttribute('crossOrigin', 'anonymous');
  }
}

const btnNext = document.querySelector('.btn-next');
let i = 0;

function getImage(element) {
  if (i > 19) i = 0;
  const index = i % images.length;
  const timeOfDay = getTimeOfDay();
  const src = baseUrl + timeOfDay + images[index];
  viewImage(src);
  i++;
  btnNext.disabled = true;
  setTimeout(function() {
    btnNext.disabled = false;
  }, 500)
}

function uploadImage(element) {
  const file = element.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const src = reader.result;
    imageToEdit.setAttribute('src', src);
    imageToEdit.setAttribute('alt', 'image');
    imageToEdit.setAttribute('crossOrigin', 'anonymous');
  }
  reader.readAsDataURL(file);
}

function getCoefBlur(value, coefficient) {
  const prevBlur = value.split(' ')[0];
  const currBlur = coefficient * parseInt(prevBlur.split('(')[1], 10);
  return value.replace(prevBlur, 'blur(' + String(currBlur) + 'px)');
}

function getFiltersValues(element, coefficient) {
  const filtersValues = window.getComputedStyle(element).getPropertyValue('filter');
  return getCoefBlur(filtersValues, coefficient);
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function drawCanvas() {
  const originWidth = imageToEdit.naturalWidth;
  const originHeight = imageToEdit.naturalHeight;
  const originDiagonal = Math.sqrt(originWidth ** 2 + originHeight ** 2);
  const displayedWidth = imageToEdit.width;
  const displayedHeight = imageToEdit.height;
  const displayedDiagonal = Math.sqrt(displayedWidth ** 2 + displayedHeight ** 2);
  const coefficient = originDiagonal / displayedDiagonal;
  canvas.width = originWidth;
  canvas.height = originHeight;
  ctx.filter = getFiltersValues(imageToEdit, coefficient);
  ctx.drawImage(imageToEdit, 0, 0);
}

function saveImage() {
  drawCanvas();
  const link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

const buttonsArea = document.querySelector('.btn-container');

buttonsArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-reset')) {
    filters.forEach(filter => resetFilters(filter));
  } else if (e.target.classList.contains('btn-next')) {
    getImage(e.target);
  } else if (e.target.classList.contains('btn-save')) {
    saveImage();
  }
})

buttonsArea.addEventListener('change', (e) => {
  if (e.target.classList.contains('btn-load--input')) {
    uploadImage(e.target);
    e.target.value = '';
  }
})

buttonsArea.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('btn')) {
    e.target.classList.add('btn-active');
  }
})

buttonsArea.addEventListener('mouseup', (e) => {
  e.target.classList.remove('btn-active');
})

buttonsArea.addEventListener('mouseout', (e) => {
  e.target.classList.remove('btn-active');
})

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.querySelector('.fullscreen').addEventListener('click', toggleFullscreen);