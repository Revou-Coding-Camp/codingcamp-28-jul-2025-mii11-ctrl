function playPopSound() {
  const sound = new Audio("sound/pop.mp3");
  sound.play();
}
function playCorrectSound() {
  const sound = new Audio("sound/correct.mp3");
  sound.play();
}
function playSparkleSound() {
  const sparkle = new Audio("sound/sparkle.mp3");
  sparkle.play();
}
function playProfileSound() {
  const profileSound = new Audio("sound/popp.mp3");
  profileSound.play();
}
const jingleSound = new Audio("sound/jingle.mp3");
function playNotifSound() {
  const notif = new Audio("sound/notif.mp3");
  notif.play();
}

const form = document.getElementById('belajarForm');
const dataTable = document.getElementById('dataTable');
const formSection = document.getElementById('formSection');

let dataList = JSON.parse(localStorage.getItem('formData')) || [];

function renderTable() {
  dataTable.innerHTML = '';
  dataList.forEach((data, index) => {
    const rowId = 'row-' + index;
    const row = document.createElement('tr');
    row.id = rowId;
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${formatDate(data.birthdate)}</td>
      <td>${data.gender}</td>
      <td>${data.message}</td>
      <td><button class="view-profile" onclick="showPopup(${index})">🔍 Lihat</button></td>
      <td><button onclick="confirmDelete(${index})" title="Hapus">🗑️</button></td>
    `;
    dataTable.appendChild(row);
  });
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function confirmDelete(index) {
  const confirmDelete = confirm("Yakin ingin menghapus data ini?");
  if (confirmDelete) {
    dataList.splice(index, 1);
    localStorage.setItem('formData', JSON.stringify(dataList));
    renderTable();
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  playCorrectSound();

  const newData = {
    name: document.getElementById('name').value,
    birthdate: document.getElementById('birthdate').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    message: document.getElementById('message').value
  };

  dataList.push(newData);
  localStorage.setItem('formData', JSON.stringify(dataList));
  renderTable();
  form.reset();

  // scroll to last added data
  setTimeout(() => {
    document.getElementById('row-' + (dataList.length - 1)).scrollIntoView({ behavior: 'smooth' });
  }, 100);
});

renderTable();
// Ambil pesan yang sudah tersimpan
let messages = JSON.parse(localStorage.getItem("messages")) || [];

function renderMessages() {
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  const sortBy = document.getElementById("sortComments")?.value || "newest";
  const sortedMessages = [...messages];

  if (sortBy === "oldest") {
    sortedMessages.reverse(); // hanya dibalik kalau pilih "terlama"
  }

  sortedMessages.forEach((msg, index) => {
    const initials = msg.name.split(" ").map(word => word[0]).join("").toUpperCase();
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=ffb6c1&color=fff&rounded=true&size=64`;

    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
      <img src="${avatarUrl}" alt="Avatar" />
      <div class="message-content">
        <b>${msg.name}</b> · ${msg.time}<br/>
        <b>Email:</b> ${msg.email}<br/>
        <b>Nomor Telepon:</b> ${msg.phone}<br/>
        ${msg.message}
      </div>
    `;
    list.appendChild(card);
  });
}

// Tangani form submit
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault()

  if (!confirm("Are you sure you want to send this message?")) return;

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const phone = document.getElementById("contactPhone").value;
  const message = document.getElementById("contactMessage").value;

const now = new Date();
const time = now.toLocaleString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

  const newMsg = { name, email, phone, message, time };
  messages.unshift(newMsg);
  localStorage.setItem("messages", JSON.stringify(messages));

  playNotifSound();
  renderMessages();
  e.target.reset();
});

// Tampilkan komentar saat pertama kali halaman dibuka
window.addEventListener("DOMContentLoaded", renderMessages);
document.getElementById("sortComments").addEventListener("change", renderMessages);

function showSection(sectionId) {
  playPopSound(); // Tambahkan ini
  const sections = ["homeSection", "profileSection", "messageSection"];
  sections.forEach(id => {
    document.getElementById(id).style.display = id === sectionId ? "block" : "none";
  });

if (sectionId === "profileSection") {
    jingleSound.currentTime = 0;  // Mulai dari awal
    jingleSound.play();
  } else {
    jingleSound.pause(); // Berhentiin jingle kalau pindah halaman
    jingleSound.currentTime = 0;  // Reset waktu agar nanti mulai dari awal lagi
  }
}

function closePopup() {
  playSparkleSound(); 
  document.getElementById("welcomePopup").style.display = "none";
}

function showPopup(index) {
  playProfileSound();
  const profile = dataList[index];

  const popup = document.createElement("div");
  popup.className = "profile-popup-overlay";

  popup.innerHTML = `
    <div class="profile-popup-box">
      <h3>Profil ${profile.name}</h3>
      <p><strong>Tanggal Lahir:</strong> ${formatDate(profile.birthdate)}</p>
      <p><strong>Jenis Kelamin:</strong> ${profile.gender}</p>
      <p><strong>Pesan:</strong> ${profile.message}</p>
      <button onclick="document.body.removeChild(this.parentNode.parentNode)">Tutup</button>
    </div>
  `;

  document.body.appendChild(popup);
}
function saveName() {
  const input = document.getElementById("inputUserName");
  const name = input.value.trim();

  if (!name) {
    alert("Nama tidak boleh kosong ya 😊");
    input.focus();
    return;
  }

  document.getElementById("welcomeName").textContent = name;
  document.getElementById("namePopup").style.display = "none";
  document.getElementById("welcomePopup").style.display = "flex";
  playProfileSound();
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("namePopup").style.display = "flex";
});
