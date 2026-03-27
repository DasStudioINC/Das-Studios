// script.js

// Replace this URL with your GitHub raw JSON URL
const jsonURL = 'https://raw.githubusercontent.com/DasStudioINC/my-json-data/refs/heads/main/data.json';

async function loadJSON() {
  const res = await fetch(jsonURL);
  const data = await res.json();
  createParentButtons(data);
}

// Container inside your content div to hold dynamic buttons
const content = document.querySelector('.content');

function createParentButtons(data) {
  content.innerHTML = ''; // Clear existing content

  Object.keys(data).forEach(parentKey => {
    // Create parent button
    const parentBtn = document.createElement('button');
    parentBtn.textContent = parentKey;
    parentBtn.className = 'button';
    parentBtn.style.width = '100%';
    parentBtn.style.marginBottom = '10px';

    // Container for child buttons
    const childContainer = document.createElement('div');
    childContainer.style.display = 'none';
    childContainer.style.marginLeft = '15px';
    childContainer.style.marginBottom = '15px';
    childContainer.style.flexDirection = 'column';
    childContainer.style.gap = '5px';

    // Create child buttons
    const children = data[parentKey];
    Object.keys(children).forEach(childKey => {
      const childBtn = document.createElement('button');
      childBtn.textContent = childKey;
      childBtn.className = 'button main';
      childBtn.style.width = '95%';
      childBtn.style.fontSize = '14px';

      // Click opens modal
      childBtn.onclick = () => openModal(childKey, children[childKey]);

      childContainer.appendChild(childBtn);
    });

    // Toggle children visibility on parent click
    parentBtn.onclick = () => {
      childContainer.style.display = childContainer.style.display === 'none' ? 'flex' : 'none';
    }

    content.appendChild(parentBtn);
    content.appendChild(childContainer);
  });
}

// ---------- Modal Setup ----------
const modal = document.createElement('div');
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = 0;
modal.style.left = 0;
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.background = 'rgba(0,0,0,0.5)';
modal.style.zIndex = '1000';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.display = 'flex';

const modalContent = document.createElement('div');
modalContent.style.background = '#172438';
modalContent.style.color = 'white';
modalContent.style.padding = '20px';
modalContent.style.borderRadius = '10px';
modalContent.style.width = '400px';
modalContent.style.maxHeight = '80%';
modalContent.style.overflowY = 'auto';
modalContent.style.position = 'relative';

const closeBtn = document.createElement('span');
closeBtn.textContent = '×';
closeBtn.style.position = 'absolute';
closeBtn.style.top = '10px';
closeBtn.style.right = '15px';
closeBtn.style.cursor = 'pointer';
closeBtn.style.fontSize = '20px';
closeBtn.onclick = () => { modal.style.display = 'none'; };

const modalTitle = document.createElement('h2');
modalTitle.style.marginTop = '0';

const modalBody = document.createElement('div');

modalContent.appendChild(closeBtn);
modalContent.appendChild(modalTitle);
modalContent.appendChild(modalBody);
modal.appendChild(modalContent);
document.body.appendChild(modal);

function openModal(childName, childData) {
  modalTitle.textContent = childName;
  modalBody.innerHTML = '';
  Object.keys(childData).forEach(key => {
    const p = document.createElement('p');
    p.textContent = `${key}: ${childData[key]}`;
    modalBody.appendChild(p);
  });
  modal.style.display = 'flex';
}

// Close modal if clicking outside content
modal.onclick = e => {
  if(e.target === modal) modal.style.display = 'none';
}

// Load JSON on page load
loadJSON();


