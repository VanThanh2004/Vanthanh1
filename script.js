const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');
const count = document.getElementById('count');

const API_KEY = "ZCd5ED6vFFv3ESahygrTDyrA";

let totalImages = 0;
const MAX_IMAGES = 250;

let selectedBackground = 'white';

// =========================
// SIZE
// =========================

const sizePreset = document.getElementById('sizePreset');
const exportWidth = document.getElementById('exportWidth');
const exportHeight = document.getElementById('exportHeight');

// =========================
// GET SELECTED
// =========================

function getSelectedCards(){

  return [...document.querySelectorAll('.card.selected')];

}

// =========================
// ENABLE / DISABLE SIZE
// =========================

function updateSizeInputsState(){

  const selectedCards = getSelectedCards();

  const hasSelected = selectedCards.length > 0;

  exportWidth.disabled = !hasSelected;
  exportHeight.disabled = !hasSelected;
  sizePreset.disabled = !hasSelected;

}

// =========================
// SIZE PRESET
// =========================

sizePreset.addEventListener('change', () => {

  const value = sizePreset.value;

  if(value === '1200x1800'){

    exportWidth.value = 1200;
    exportHeight.value = 1800;

  }
  else if(value === '1800x1200'){

    exportWidth.value = 1800;
    exportHeight.value = 1200;

  }
  else if(value === '1080x1080'){

    exportWidth.value = 1080;
    exportHeight.value = 1080;

  }
  else if(value === 'custom'){

    exportWidth.value = '';
    exportHeight.value = '';

  }

  applyPreviewSize();

});

// =========================
// PREVIEW SIZE
// =========================

function applyPreviewSize(){

  const width = exportWidth.value || 300;

  const height = exportHeight.value || 300;

  document.querySelectorAll('.preview').forEach(preview => {

    preview.style.width = width / 4 + 'px';

    preview.style.height = height / 4 + 'px';

  });

}

exportWidth.addEventListener('input', applyPreviewSize);

exportHeight.addEventListener('input', applyPreviewSize);

// =========================
// UPLOAD
// =========================

uploadArea.addEventListener('click', () => {

  fileInput.click();

});

uploadArea.addEventListener('dragover', (e) => {

  e.preventDefault();

});

uploadArea.addEventListener('drop', (e) => {

  e.preventDefault();

  handleFiles(e.dataTransfer.files);

});

fileInput.addEventListener('change', (e) => {

  handleFiles(e.target.files);

});

// =========================
// UPDATE COUNT
// =========================

function updateCount(){

  count.innerText = totalImages;

}

// =========================
// HANDLE FILES
// =========================

function handleFiles(files){

  const imageFiles =
    [...files].filter(file =>
      file.type.startsWith('image/')
    );

  if(totalImages + imageFiles.length > MAX_IMAGES){

    alert('Tối đa 250 ảnh');

    return;

  }

  imageFiles.forEach(file => {

    const reader = new FileReader();

    reader.onload = function(e){

      const card = document.createElement('div');

      card.className = 'card selected';

      card.dataset.filename = file.name;

      card.innerHTML = `
        <input type="checkbox" class="check" checked>

        <div class="preview">
          <img src="${e.target.result}">
        </div>

        <div class="info">
          <h3>${file.name}</h3>
        </div>

        <button class="delete-btn">X</button>
      `;

      // =========================
      // DELETE
      // =========================

      const deleteBtn =
        card.querySelector('.delete-btn');

      deleteBtn.addEventListener('click', () => {

        card.remove();

        totalImages--;

        updateCount();

        updateSizeInputsState();

      });

      // =========================
      // CHECKBOX
      // =========================

      const checkbox =
        card.querySelector('.check');

      card.addEventListener('click', (e) => {

        if(e.target.classList.contains('delete-btn'))
          return;

        if(e.target.classList.contains('check'))
          return;

        checkbox.checked = !checkbox.checked;

        if(checkbox.checked){

          card.classList.add('selected');

        }
        else{

          card.classList.remove('selected');

        }

        updateSizeInputsState();

      });

      checkbox.addEventListener('change', () => {

        if(checkbox.checked){

          card.classList.add('selected');

        }
        else{

          card.classList.remove('selected');

        }

        updateSizeInputsState();

      });

      gallery.appendChild(card);

      applyPreviewSize();

      totalImages++;

      updateCount();

      updateSizeInputsState();

    }

    reader.readAsDataURL(file);

  });

}

// =========================
// BACKGROUND
// =========================

const bgItems =
  document.querySelectorAll('.color-item');

bgItems.forEach(item => {

  item.addEventListener('click', () => {

    bgItems.forEach(i =>
      i.classList.remove('active')
    );

    item.classList.add('active');

    selectedBackground = item.dataset.bg;

  });

});

// =========================
// APPLY BACKGROUND
// =========================

document
.getElementById('applyBgBtn')
.addEventListener('click', () => {

  getSelectedCards().forEach(card => {

    const preview =
      card.querySelector('.preview');

    preview.style.background =
      selectedBackground;

  });

});

// =========================
// FILTER
// =========================

document
.getElementById('applyFilterBtn')
.addEventListener('click', () => {

  const brightness =
    document.getElementById('brightness').value;

  const contrast =
    document.getElementById('contrast').value;

  const saturate =
    document.getElementById('saturate').value;

  getSelectedCards().forEach(card => {

    const img = card.querySelector('img');

    img.style.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturate}%)
    `;

  });

});

// =========================
// SHADOW
// =========================

document
.getElementById('applyShadowBtn')
.addEventListener('click', () => {

  const opacity =
    document.getElementById('shadowOpacity').value;

  const distance =
    document.getElementById('shadowDistance').value;

  getSelectedCards().forEach(card => {

    const img = card.querySelector('img');

    img.style.filter += `
      drop-shadow(
        0 ${distance}px 25px rgba(0,0,0,${opacity / 100})
      )
    `;

  });

});

// =========================
// SELECT ALL
// =========================

document
.getElementById('selectAllBtn')
.addEventListener('click', () => {

  document.querySelectorAll('.card')
  .forEach(card => {

    card.classList.add('selected');

    card.querySelector('.check').checked = true;

  });

  updateSizeInputsState();

});

// =========================
// UNSELECT ALL
// =========================

document
.getElementById('unselectAllBtn')
.addEventListener('click', () => {

  document.querySelectorAll('.card')
  .forEach(card => {

    card.classList.remove('selected');

    card.querySelector('.check').checked = false;

  });

  updateSizeInputsState();

});

// =========================
// REMOVE BG
// =========================

document
.getElementById('removeBgBtn')
.addEventListener('click', async () => {

  const cards = getSelectedCards();

  if(cards.length === 0){

    alert("Vui lòng chọn ảnh!");

    return;

  }

  for(const card of cards){

    const img = card.querySelector('img');

    const response = await fetch(img.src);

    const blob = await response.blob();

    const formData = new FormData();

    formData.append("image_file", blob);

    const res = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY
        },
        body: formData
      }
    );

    if(!res.ok){

      alert("Lỗi remove.bg");

      return;

    }

    const resultBlob = await res.blob();

    const url = URL.createObjectURL(resultBlob);

    const newImg = new Image();

    newImg.onload = () => {

      const canvas =
        document.createElement('canvas');

      canvas.width = newImg.width;

      canvas.height = newImg.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(newImg, 0, 0);

      img.src = canvas.toDataURL('image/png');

    };

    newImg.src = url;

    card.querySelector('.preview')
      .style.background = "transparent";

  }

  alert("Tách nền xong!");

});

// =========================
// CROP
// =========================

let cropper = null;

let currentCropImg = null;

const cropBtn =
  document.getElementById('cropBtn');

const cropModal =
  document.getElementById('cropModal');

const cropImage =
  document.getElementById('cropImage');

const saveCropBtn =
  document.getElementById('saveCropBtn');

const closeCropBtn =
  document.getElementById('closeCropBtn');

// =========================
// OPEN CROP
// =========================

cropBtn.addEventListener('click', () => {

  const selected = getSelectedCards();

  if(selected.length !== 1){

    alert('Chỉ chọn 1 ảnh để crop');

    return;

  }

  currentCropImg =
    selected[0].querySelector('img');

  cropModal.style.display = 'flex';

  cropImage.src = currentCropImg.src;

});

// =========================
// IMAGE LOAD
// =========================

cropImage.addEventListener('load', () => {

  if(cropper){

    cropper.destroy();

  }

  cropper = new Cropper(cropImage, {

    viewMode: 1,

    dragMode: 'move',

    autoCropArea: 1,

    responsive: true,

    background: false,

    movable: true,

    zoomable: true,

    scalable: true,

    rotatable: false

  });

});

// =========================
// SAVE CROP
// =========================

saveCropBtn.addEventListener('click', () => {

  if(!cropper) return;

  const card =
    currentCropImg.closest('.card');

  const preview =
    card.querySelector('.preview');

  // =========================
  // GET FILTER
  // =========================

  const computedFilter =
    window.getComputedStyle(currentCropImg).filter;

  // =========================
  // GET BACKGROUND
  // =========================

  const styles =
    window.getComputedStyle(preview);

  const bgImage =
    styles.backgroundImage;

  const bgColor =
    styles.backgroundColor;

  // =========================
  // GET CROPPED CANVAS
  // =========================

  const croppedCanvas =
    cropper.getCroppedCanvas({

      imageSmoothingEnabled: true,

      imageSmoothingQuality: 'high',

      fillColor: 'transparent'

    });

  // =========================
  // FINAL CANVAS
  // =========================

  const finalCanvas =
    document.createElement('canvas');

  finalCanvas.width =
    croppedCanvas.width;

  finalCanvas.height =
    croppedCanvas.height;

  const ctx =
    finalCanvas.getContext('2d');

  // =========================
  // DRAW BACKGROUND
  // =========================

  if(bgImage && bgImage !== 'none'){

    // Gradient hồng cam
    if(
      bgImage.includes('255, 123, 123') ||
      bgImage.includes('#ff7b7b')
    ){

      const gradient =
        ctx.createLinearGradient(
          0,
          0,
          finalCanvas.width,
          finalCanvas.height
        );

      gradient.addColorStop(0, '#ff7b7b');

      gradient.addColorStop(1, '#ffb86c');

      ctx.fillStyle = gradient;

    }

    // Gradient xanh
    else if(
      bgImage.includes('0, 198, 255') ||
      bgImage.includes('#00c6ff')
    ){

      const gradient =
        ctx.createLinearGradient(
          0,
          0,
          finalCanvas.width,
          finalCanvas.height
        );

      gradient.addColorStop(0, '#00c6ff');

      gradient.addColorStop(1, '#0072ff');

      ctx.fillStyle = gradient;

    }

    else{

      ctx.fillStyle =
        bgColor || 'transparent';

    }

  }
  else{

    ctx.fillStyle =
      bgColor || 'transparent';

  }

  // =========================
  // DRAW BG IN CROP AREA
  // =========================

  ctx.fillRect(
    0,
    0,
    finalCanvas.width,
    finalCanvas.height
  );

  // =========================
  // APPLY FILTER
  // =========================

  if(
    computedFilter &&
    computedFilter !== 'none'
  ){

    ctx.filter = computedFilter;

  }

  // =========================
  // DRAW CROPPED IMAGE
  // =========================

  ctx.drawImage(
    croppedCanvas,
    0,
    0,
    finalCanvas.width,
    finalCanvas.height
  );

  ctx.filter = 'none';

  // =========================
  // UPDATE IMAGE
  // =========================

  const finalData =
    finalCanvas.toDataURL('image/png');

  currentCropImg.src =
    finalData;

  // =========================
  // SAVE REAL SIZE
  // =========================

  currentCropImg.dataset.cropWidth =
    finalCanvas.width;

  currentCropImg.dataset.cropHeight =
    finalCanvas.height;

  // =========================
  // UPDATE PREVIEW
  // =========================

  preview.style.aspectRatio =
    `${finalCanvas.width} / ${finalCanvas.height}`;

  preview.style.background =
    'transparent';

  currentCropImg.style.width =
    '100%';

  currentCropImg.style.height =
    '100%';

  currentCropImg.style.objectFit =
    'contain';

  // =========================
  // CLOSE
  // =========================

  cropModal.style.display = 'none';

  cropper.destroy();

  cropper = null;

});

// =========================
// CLOSE CROP
// =========================

closeCropBtn.addEventListener('click', () => {

  cropModal.style.display = 'none';

  if(cropper){

    cropper.destroy();

    cropper = null;

  }

});

// =========================
// EXPORT
// =========================

document
.getElementById('exportBtn')
.addEventListener('click', async () => {

  const width =
    +exportWidth.value || 1080;

  const height =
    +exportHeight.value || 1080;

  const zip = new JSZip();

  const cards =
    [...document.querySelectorAll('.card')];

  let exportCount = 0;

  for(const card of cards){

    const checkbox =
      card.querySelector('.check');

    if(!checkbox.checked) continue;

    const img = card.querySelector('img');

    const canvas =
      document.createElement('canvas');

    canvas.width = width;

    canvas.height = height;

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    ctx.clearRect(0, 0, width, height);

// =========================
// GET BACKGROUND
// =========================

const preview =
  card.querySelector('.preview');

const styles =
  window.getComputedStyle(preview);

const bgImage =
  styles.backgroundImage;

const bgColor =
  styles.backgroundColor;

// =========================
// DRAW BACKGROUND
// =========================

if(bgImage && bgImage !== 'none'){

  // Gradient hồng cam
  if(
    bgImage.includes('255, 123, 123') ||
    bgImage.includes('#ff7b7b')
  ){

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

    gradient.addColorStop(0, '#ff7b7b');
    gradient.addColorStop(1, '#ffb86c');

    ctx.fillStyle = gradient;

  }

  // Gradient xanh
  else if(
    bgImage.includes('0, 198, 255') ||
    bgImage.includes('#00c6ff')
  ){

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

    gradient.addColorStop(0, '#00c6ff');
    gradient.addColorStop(1, '#0072ff');

    ctx.fillStyle = gradient;

  }

  else{

    ctx.fillStyle =
      bgColor || 'white';

  }

}
else{

  // =========================
  // NORMAL COLORS
  // =========================

  // White
  if(
    bgColor.includes('255, 255, 255')
  ){

    ctx.fillStyle = '#ffffff';

  }

  // Black
  else if(
    bgColor.includes('0, 0, 0')
  ){

    ctx.fillStyle = '#000000';

  }

  // Purple
  else if(
    bgColor.includes('139, 92, 246') ||
    bgColor.includes('#8b5cf6')
  ){

    ctx.fillStyle = '#8b5cf6';

  }

  // Xanh đậm
  else if(
    bgColor.includes('0, 102, 204') ||
    bgColor.includes('#0066CC')
  ){

    ctx.fillStyle = '#0066CC';

  }

  // Xanh sáng
  else if(
    bgColor.includes('30, 144, 255') ||
    bgColor.includes('#1e90ff')
  ){

    ctx.fillStyle = '#1e90ff';

  }

  // Royal blue
  else if(
    bgColor.includes('55, 66, 250') ||
    bgColor.includes('#3742fa')
  ){

    ctx.fillStyle = '#3742fa';

  }

  else{

    ctx.fillStyle =
      bgColor || 'white';

  }

}

// =========================
// DRAW BG
// =========================

ctx.fillRect(
  0,
  0,
  width,
  height
);

// =========================
// DRAW IMAGE
// =========================

ctx.drawImage(
  img,
  0,
  0,
  width,
  height
);

    const data =
      canvas.toDataURL('image/png');

    const fileName =
      card.dataset.filename ||
      `photo-${exportCount + 1}.png`;

    const cleanName =
      fileName.replace(/\.[^/.]+$/, '');

    zip.file(
      cleanName + '.png',
      data.split(',')[1],
      { base64: true }
    );

    exportCount++;

  }

  if(exportCount === 0){

    alert('Không có ảnh nào được chọn!');

    return;

  }

  const content =
    await zip.generateAsync({
      type: 'blob'
    });

  const link =
    document.createElement('a');

  link.href =
    URL.createObjectURL(content);

  link.download = 'photos.zip';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

});

// =========================
// INIT
// =========================

updateSizeInputsState();
