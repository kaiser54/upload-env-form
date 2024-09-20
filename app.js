const inputContainer = document.getElementById('inputContainer');
const addButton = document.getElementById('addButton');
// const logButton = document.getElementById('logButton');
// const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');

function addNewField(key = '', value = '', note = '') {
  const newField = document.createElement('div');
  newField.className = 'input-container fade-in';
  newField.innerHTML = `
                <div class="input-wrap">
                  <input
                    type="text"
                    placeholder="e.g. CLIENT_KEY"
                    class="key-input"
                    value="${key}"
                  />
                  <input type="text" placeholder="aBb123XyZ" class="value-input" value="${value}"/>
                  <div class="action-btn-group">
                    <button class="note-btn icon-button">${pencilSvg}</button>
                    <button class="delete-btn icon-button">${trashSvg}</button>
                  </div>
                </div>
                <textarea
                  class="note-input"
                  placeholder="Enter your text here..."
                  value="${note}"
                ></textarea>
            `;
  inputContainer.appendChild(newField);

  const noteButton = newField.querySelector('.note-btn');
  noteButton.addEventListener('click', toggleNoteField);

  newField.querySelector('.delete-btn').addEventListener('click', deleteField);
}

function deleteField(e) {
  if (inputContainer.children.length > 1) {
    const inputContainerToRemove = e.target.closest('.input-container');
    inputContainerToRemove.classList.remove("fade-in");
    inputContainerToRemove.classList.add("fade-out");

    inputContainerToRemove.addEventListener('animationend', () => {
      inputContainerToRemove.remove();
    });
  }
}

function toggleNoteField(e) {
  const container = e.target.closest('.input-container');
  const noteInput = container.querySelector('.note-input');
  const isHidden = window.getComputedStyle(noteInput).display === 'none';

  if (isHidden) {
    noteInput.style.display = 'block';
    noteInput.classList.remove('fade-out');
    noteInput.classList.add('fade-in');

    noteInput.addEventListener('animationend', function handleAnimationEnd() {
      noteInput.classList.remove('fade-in');
      noteInput.removeEventListener('animationend', handleAnimationEnd);
    });
  } else {
    noteInput.classList.remove('fade-in');
    noteInput.classList.add('fade-out');

    noteInput.addEventListener('animationend', function handleAnimationEnd() {
      noteInput.style.display = 'none';
      noteInput.classList.remove('fade-out');
      noteInput.removeEventListener('animationend', handleAnimationEnd);
    });
  }
}

function logData() {
  const data = [];
  document.querySelectorAll('.input-container').forEach(container => {
    const key = container.querySelector('.key-input').value;
    const value = container.querySelector('.value-input').value;
    const note = container.querySelector('.note-input').value;
    data.push({ key, value, note });
  });
  console.log(data);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    console.log('File selected:', file.name);
    handleFile(file);
  } else {
    console.log('No file selected.');
  }
}

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    console.log('File content:', text);
    parseAndAppendEnvFile(text);
  };
  reader.onerror = function (e) {
    console.error('File reading error:', e);
  };
  reader.readAsText(file);
}

function parseAndAppendEnvFile(text) {
  const lines = text.split('\n');
  let currentContainer = inputContainer.querySelector('.input-container:last-child');
  let currentKeyInput = currentContainer.querySelector('.key-input');
  let currentValueInput = currentContainer.querySelector('.value-input');

  lines.forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value !== undefined) {
        if (!currentKeyInput.value && !currentValueInput.value) {
          currentKeyInput.value = key.trim();
          currentValueInput.value = value.trim();
        } else {
          addNewField(key.trim(), value.trim());
          currentContainer = inputContainer.querySelector('.input-container:last-child');
          currentKeyInput = currentContainer.querySelector('.key-input');
          currentValueInput = currentContainer.querySelector('.value-input');
        }
      }
    }
  });
}

addButton.addEventListener('click', () => addNewField());
// logButton.addEventListener('click', logData);
// uploadButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);

inputContainer.addEventListener('paste', (e) => {
  if (e.target.classList.contains('key-input') || e.target.classList.contains('value-input')) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    parseAndAppendEnvFile(pastedText, e.target);
  }
});

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    console.log('File dropped:', files[0].name);
    handleFile(files[0]);
  }
  dropZone.classList.remove('dragover');
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
  dropZone.classList.remove('dragover');
}

dropZone.addEventListener('drop', handleDrop);
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('click', () => fileInput.click());

document.querySelectorAll('.note-btn').forEach(button => {
  button.addEventListener('click', toggleNoteField);
});

document.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', deleteField);
});

const pencilSvg = `
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.9859 6.2359L12.9717 5.25012C13.4926 4.72924 13.4926 3.88479 12.9717 3.36479L11.7193 2.11235C11.1984 1.59146 10.3539 1.59146 9.83392 2.11235L8.84814 3.09812L11.9859 6.2359Z" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.51386 4.43066L3.26942 8.67511C3.0472 8.89733 2.88809 9.17466 2.8072 9.47866L1.80542 13.2769L5.60364 12.2751C5.90764 12.1951 6.18498 12.0351 6.4072 11.8129L10.6516 7.56844" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.06943 5.98633L5.1521 9.90366" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`

const trashSvg = `
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.02771 3.27783H13.1388" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.58325 3.27776V1.94443C5.58325 1.45376 5.98147 1.05554 6.47214 1.05554H8.69436C9.18503 1.05554 9.58325 1.45376 9.58325 1.94443V3.27776" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.8055 5.5V12.1667C11.8055 13.1489 11.01 13.9444 10.0278 13.9444H5.13886C4.15664 13.9444 3.36108 13.1489 3.36108 12.1667V5.5" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.02771 7.27783V11.2778" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.13879 7.27783V11.2778" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`

const plusSvg = `
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_5832_1470)">
  <path d="M15.3068 15.1636C17.8236 12.6469 17.8236 8.56649 15.3068 6.04978C12.7901 3.53307 8.70973 3.53307 6.19302 6.04978C3.67631 8.56649 3.67631 12.6469 6.19302 15.1636C8.70973 17.6803 12.7901 17.6803 15.3068 15.1636Z" stroke="white" stroke-opacity="0.56" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.29297 10.6067H14.2069" stroke="white" stroke-opacity="0.56" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.7499 7.14972V14.0637" stroke="white" stroke-opacity="0.56" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
  <clipPath id="clip0_5832_1470">
  <rect width="15" height="15" fill="white" transform="translate(0.143311 10.6067) rotate(-45)"/>
  </clipPath>
  </defs>
  </svg>
`

const arrowTray = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5556 10.4444V11.7778C13.5556 12.76 12.76 13.5556 11.7778 13.5556H4.22224C3.24001 13.5556 2.44446 12.76 2.44446 11.7778V10.4444" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.88889 6L8 9.11111L11.1111 6" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 9.11111V2.44444" stroke="#52525B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`

const note_btn = document.getElementsByClassName('note-btn')
const del_btn = document.getElementsByClassName('delete-btn')
const plus_btn = document.getElementById('addButton')
const arrow_tray_btn = document.getElementById('importIcon')

note_btn[0].innerHTML = pencilSvg
del_btn[0].innerHTML = trashSvg
plus_btn.innerHTML = plusSvg + '<span>Add another</span>'
arrow_tray_btn.innerHTML = arrowTray
