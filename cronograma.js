
// ============================
// Firebase Config
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyCj8i37JYNigvbhXfqP4HVzjAEOzcXf_i0",
  authDomain: "sdel-b3f65.firebaseapp.com",
  projectId: "sdel-b3f65",
  storageBucket: "sdel-b3f65.appspot.com",
  messagingSenderId: "297725999985",
  appId: "1:297725999985:web:d41da68311c190ef8a54d0",
  measurementId: "G-PT92VECJ2H"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ============================
// Variáveis da interface
// ============================
const grid = document.getElementById('schedule-grid');
const modal = document.getElementById('modal');
const subjectSelect = document.getElementById('subject');
const studyTimeInput = document.getElementById('study-time');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const notesInput = document.getElementById('notes');
const closeModal = document.getElementById('close-modal');
const saveBtn = document.getElementById('save');
const clearCellBtn = document.getElementById('clear-cell');
const clearAllBtn = document.getElementById('clear-all');

const subjects = ['matematica', 'portugues', 'historia', 'biologia', 'quimica'];
const hours = Array.from({ length: 15 }, (_, i) => `${7 + i}:00`); // 7h até 21h

let selectedCell = null;

// ============================
// Criar grade
// ============================
function createScheduleGrid() {
  grid.innerHTML = '';
  hours.forEach(hour => {
    const row = document.createElement('div');
    row.className = 'grid-row';

    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    timeSlot.textContent = hour;
    row.appendChild(timeSlot);

    for (let day = 0; day < 7; day++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.time = hour;
      cell.dataset.day = day;

      cell.addEventListener('click', () => {
        selectedCell = cell;
        const existingSubject = subjects.find(s => cell.classList.contains(s)) || '';
        subjectSelect.value = existingSubject;
        studyTimeInput.value = cell.dataset.studyTime || '';
        startTimeInput.value = cell.dataset.startTime || '';
        endTimeInput.value = cell.dataset.endTime || '';
        notesInput.value = cell.dataset.notes || '';
        modal.style.display = 'block';
      });

      row.appendChild(cell);
    }

    grid.appendChild(row);
  });
}

// ============================
// Salvar no Firestore
// ============================
function saveScheduleToFirebase() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const allCells = document.querySelectorAll('.cell');
  const scheduleData = [];

  allCells.forEach(cell => {
    const subject = subjects.find(s => cell.classList.contains(s)) || '';
    if (subject) {
      scheduleData.push({
        day: cell.dataset.day,
        time: cell.dataset.time,
        subject,
        studyTime: cell.dataset.studyTime || '',
        startTime: cell.dataset.startTime || '',
        endTime: cell.dataset.endTime || '',
        notes: cell.dataset.notes || ''
      });
    }
  });

  db.collection('schedules').doc(user.uid).set({ schedule: scheduleData });
}

// ============================
// Carregar do Firestore
// ============================
function loadScheduleFromFirebase() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  db.collection('schedules').doc(user.uid).get().then(doc => {
    if (!doc.exists) return;

    const scheduleData = doc.data().schedule || [];
    scheduleData.forEach(item => {
      const cell = document.querySelector(`.cell[data-day="${item.day}"][data-time="${item.time}"]`);
      if (cell) {
        cell.className = `cell filled ${item.subject}`;
        cell.dataset.studyTime = item.studyTime;
        cell.dataset.startTime = item.startTime;
        cell.dataset.endTime = item.endTime;
        cell.dataset.notes = item.notes;
        cell.innerHTML = `
          <strong>${item.subject.charAt(0).toUpperCase() + item.subject.slice(1)}</strong><br>
          <small>${item.studyTime} min</small>` +
          (item.notes ? `<br><em>${item.notes}</em>` : '');
      }
    });
  });
}

// ============================
// Eventos do modal
// ============================
closeModal.onclick = () => {
  modal.style.display = 'none';
};

saveBtn.onclick = () => {
  const subject = subjectSelect.value;
  const time = studyTimeInput.value;
  const start = startTimeInput.value;
  const end = endTimeInput.value;
  const notes = notesInput.value;

  if (!subject || !time) {
    alert('Selecione uma disciplina e tempo.');
    return;
  }

  if (selectedCell) {
    selectedCell.className = `cell filled ${subject}`;
    selectedCell.dataset.studyTime = time;
    selectedCell.dataset.startTime = start;
    selectedCell.dataset.endTime = end;
    selectedCell.dataset.notes = notes;
    selectedCell.innerHTML = `
      <strong>${subject.charAt(0).toUpperCase() + subject.slice(1)}</strong><br>
      <small>${time} min</small>` +
      (notes ? `<br><em>${notes}</em>` : '');
  }

  modal.style.display = 'none';
  saveScheduleToFirebase();
};

clearCellBtn.onclick = () => {
  if (selectedCell) {
    selectedCell.className = 'cell';
    selectedCell.textContent = '';
    selectedCell.dataset.studyTime = '';
    selectedCell.dataset.startTime = '';
    selectedCell.dataset.endTime = '';
    selectedCell.dataset.notes = '';
  }
  modal.style.display = 'none';
  saveScheduleToFirebase();
};

clearAllBtn.onclick = () => {
  const allCells = document.querySelectorAll('.cell');
  allCells.forEach(cell => {
    cell.className = 'cell';
    cell.textContent = '';
    cell.dataset.studyTime = '';
    cell.dataset.startTime = '';
    cell.dataset.endTime = '';
    cell.dataset.notes = '';
  });
  modal.style.display = 'none';

  const user = firebase.auth().currentUser;
  if (user) {
    db.collection('schedules').doc(user.uid).delete();
  }
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// ============================
// Inicialização
// ============================
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    createScheduleGrid();
    loadScheduleFromFirebase();
  } else {
    window.location.href = "login.html";
  }
});
