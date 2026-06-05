import "./firebase.js";

/* =========================================================
   FIREBASE
========================================================= */

const {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} = window.firebaseFns;

const db   = window.db;
const auth = window.auth;

const {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} = window.firebaseFns;

/* =========================================================
   CLOUDINARY
========================================================= */

const CLOUD_NAME    = "dgtscqpny";
const UPLOAD_PRESET = "weddingUploads";

/* =========================================================
   GÜVENLİK YARDIMCILARI (admin.js yerel kopyası)
========================================================= */

const Security = {

  escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&#39;");
  },

  /* Güvenli text node: XSS imkansız */
  safeText(element, value) {
    if (!element) return;
    element.textContent = String(value ?? "");
  },

  isSafeCloudinaryUrl(url) {
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" &&
        parsed.hostname.endsWith("cloudinary.com")
      );
    } catch {
      return false;
    }
  },

  isSafeMediaUrl(url) {
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" && (
          parsed.hostname.endsWith("cloudinary.com") ||
          parsed.hostname.endsWith("firebasestorage.googleapis.com")
        )
      );
    } catch {
      return false;
    }
  },

  /* İzin verilen dosya tipleri (admin gallery için sadece image) */
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  MAX_IMAGE_SIZE: 8 * 1024 * 1024,

  validateImageFile(file) {
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Sadece jpg, png, webp, gif yüklenebilir 🤍");
    }
    if (file.size > this.MAX_IMAGE_SIZE) {
      throw new Error("Fotoğraflar en fazla 8MB olabilir 🤍");
    }
    return true;
  }
};

/* =========================================================
   ELEMENTS
========================================================= */

const loginScreen   = document.getElementById("loginScreen");
const adminPanel    = document.getElementById("adminPanel");
const guestTable    = document.getElementById("guestTable");
const totalCount    = document.getElementById("totalCount");
const yesCount      = document.getElementById("yesCount");
const noCount       = document.getElementById("noCount");
const maybeCount    = document.getElementById("maybeCount");
const memoryGallery = document.getElementById("memoryGallery");
const searchInput   = document.getElementById("searchInput");
const memoryCount   = document.getElementById("memoryCount");

/* =========================================================
   GALLERY ELEMENTS
========================================================= */

const galleryUploadInput = document.getElementById("galleryUploadInput");
const uploadGalleryBtn   = document.getElementById("uploadGalleryBtn");
const adminGalleryGrid   = document.getElementById("adminGalleryGrid");

/* =========================================================
   FIREBASE AUTH LOGIN
========================================================= */

async function login() {
  const email    = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("E-posta ve şifre giriniz 🤍");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showPanel();
  } catch (error) {
    /* Hata detayını kullanıcıya gösterme — saldırgana bilgi verme */
    console.error(error.code);
    alert("Giriş başarısız 😔");
  }
}

window.login = login;

/* =========================================================
   LOGOUT
========================================================= */

async function logout() {
  await signOut(auth);
  location.reload();
}

window.logout = logout;

/* =========================================================
   SHOW PANEL
========================================================= */

function showPanel() {
  loginScreen.style.display = "none";
  adminPanel.style.display  = "block";
  loadGuests();
  loadMemories();
  loadGalleryImages();
}

/* =========================================================
   AUTH CHECK
========================================================= */

onAuthStateChanged(auth, (user) => {
  if (user) showPanel();
});

/* =========================================================
   RSVP
========================================================= */

let allGuests = [];

function loadGuests() {
  const q = query(
    collection(db, "rsvp"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    allGuests = [];
    snapshot.forEach((docSnap) => {
      allGuests.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderGuests(allGuests);
  });
}

/* =========================================================
   RENDER GUESTS — XSS korumalı (textContent kullanır)
========================================================= */

function renderGuests(dataList) {
  guestTable.innerHTML = "";

  let total = 0, yes = 0, no = 0, maybe = 0;

  if (!dataList.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan   = 7;
    td.className = "empty";
    td.textContent = "Henüz veri yok";
    tr.appendChild(td);
    guestTable.appendChild(tr);
  }

  dataList.forEach((data) => {
    total++;
    if      (data.status === "yes") yes++;
    else if (data.status === "no")  no++;
    else                             maybe++;

    const date = data.createdAt?.toDate
      ? new Date(data.createdAt.toDate()).toLocaleString("tr-TR")
      : "-";

    let statusText = "Kararsız ✨";
    if      (data.status === "yes") statusText = "Katılıyor 🤍";
    else if (data.status === "no")  statusText = "Katılmıyor 😔";

    const row = document.createElement("tr");

    /* Her hücre textContent ile oluşturuluyor — innerHTML YOK */
    const cells = [
      data.name       || "-",
      data.guestCount || "-",
      null, /* status span — ayrı ele alınıyor */
      data.transportNeed || "-",
      data.comingMessage || data.cannotJoinMessage || data.maybeMessage || "-",
      date
    ];

    cells.forEach((val, idx) => {
      if (val === null) return; /* status hücresi atla */
      const td = document.createElement("td");
      td.textContent = val;
      row.appendChild(td);

      /* status span'ını 2. indexten sonra ekle */
      if (idx === 1) {
        const statusTd   = document.createElement("td");
        const statusSpan = document.createElement("span");
        statusSpan.className  = `status ${getStatusClass(data.status)}`;
        statusSpan.textContent = statusText;
        statusTd.appendChild(statusSpan);
        row.appendChild(statusTd);
      }
    });

    /* Sil butonu */
    const actionTd  = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.className   = "action-btn delete";
    deleteBtn.textContent = "Sil";
    deleteBtn.addEventListener("click", () => deleteRSVP(data.id));
    actionTd.appendChild(deleteBtn);
    row.appendChild(actionTd);

    guestTable.appendChild(row);
  });

  Security.safeText(totalCount, total);
  Security.safeText(yesCount,   yes);
  Security.safeText(noCount,    no);
  Security.safeText(maybeCount, maybe);
}

/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status) {
  if (status === "yes") return "yes";
  if (status === "no")  return "no";
  return "maybe";
}

/* =========================================================
   SEARCH
========================================================= */

searchInput?.addEventListener("input", (e) => {
  const val      = e.target.value.toLowerCase();
  const filtered = allGuests.filter(item =>
    (item.name || "").toLowerCase().includes(val)
  );
  renderGuests(filtered);
});

/* =========================================================
   DELETE RSVP
========================================================= */

async function deleteRSVP(id) {
  const confirmed = confirm("Bu katılım bilgisini silmek istiyor musunuz?");
  if (!confirmed) return;
  await deleteDoc(doc(db, "rsvp", id));
}

window.deleteRSVP = deleteRSVP;

/* =========================================================
   EXPORT CSV
========================================================= */

function exportData() {
  let csv = "İsim,Kişi Sayısı,Durum,Ulaşım,Mesaj,Tarih\n";

  document.querySelectorAll("#guestTable tr").forEach(tr => {
    const cols = tr.querySelectorAll("td");
    if (cols.length) {
      let row = [];
      cols.forEach((td, index) => {
        if (index < 6) {
          row.push(td.textContent.replace(/,/g, " "));
        }
      });
      csv += row.join(",") + "\n";
    }
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "gokce-yalcin-rsvp.csv";
  a.click();
  URL.revokeObjectURL(url);
}

window.exportData = exportData;

/* =========================================================
   MEMORIES — XSS korumalı
========================================================= */

function loadMemories() {
  const q = query(
    collection(db, "memories"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    memoryGallery.innerHTML = "";
    let totalMemories = 0;

    if (snapshot.empty) {
      const div = document.createElement("div");
      div.className   = "empty";
      div.textContent = "Henüz anı bırakılmadı";
      memoryGallery.appendChild(div);
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      totalMemories++;

      const card = document.createElement("div");
      card.className = "memory-card";

      /* Medya öğeleri — sadece güvenli URL'ler */
      const mediaItems = data.mediaItems || [];
      mediaItems.forEach(item => {
        /* URL güvenlik kontrolü */
        if (!Security.isSafeMediaUrl(item.url)) return;

        if (item.type?.includes("image")) {
          const img = document.createElement("img");
          img.src       = item.url;
          img.className = "memory-media";
          img.alt       = "Anı fotoğrafı";
          card.appendChild(img);
        } else if (item.type?.includes("video")) {
          const video = document.createElement("video");
          video.controls   = true;
          video.className  = "memory-media";
          const source     = document.createElement("source");
          source.src       = item.url;
          video.appendChild(source);
          card.appendChild(video);
        } else if (item.type?.includes("audio")) {
          const audio  = document.createElement("audio");
          audio.controls  = true;
          audio.className = "memory-audio";
          const source    = document.createElement("source");
          source.src      = item.url;
          audio.appendChild(source);
          card.appendChild(audio);
        }
      });

      const date = data.createdAt?.toDate
        ? new Date(data.createdAt.toDate()).toLocaleString("tr-TR")
        : "-";

      /* Gizli badge */
      if (data.hidden === true) {
        const badge = document.createElement("div");
        badge.className   = "gallery-hidden";
        badge.textContent = "Gizli";
        card.prepend(badge);
      }

      /* Metin bilgileri — textContent ile */
      const nameDiv    = document.createElement("div");
      nameDiv.className = "memory-name";
      nameDiv.textContent = data.name || "İsimsiz";

      const msgDiv    = document.createElement("div");
      msgDiv.className = "memory-message";
      msgDiv.textContent = data.message || "-";

      const dateDiv    = document.createElement("div");
      dateDiv.className = "memory-date";
      dateDiv.textContent = date;

      /* Aksiyon butonları */
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "gallery-card-actions";

      const toggleBtn       = document.createElement("button");
      toggleBtn.className   = "action-btn";
      toggleBtn.textContent = data.hidden === true ? "Yayınla" : "Gizle";
      toggleBtn.addEventListener("click", () => toggleMemory(docSnap.id, data.hidden === true));

      const deleteBtn       = document.createElement("button");
      deleteBtn.className   = "action-btn delete";
      deleteBtn.textContent = "Sil";
      deleteBtn.addEventListener("click", () => deleteMemory(docSnap.id));

      actionsDiv.appendChild(toggleBtn);
      actionsDiv.appendChild(deleteBtn);

      card.appendChild(nameDiv);
      card.appendChild(msgDiv);
      card.appendChild(dateDiv);
      card.appendChild(actionsDiv);

      memoryGallery.appendChild(card);
    });

    Security.safeText(memoryCount, totalMemories);
  });
}

/* =========================================================
   TOGGLE MEMORY
========================================================= */

async function toggleMemory(id, isHidden) {
  await updateDoc(doc(db, "memories", id), { hidden: !isHidden });
}

window.toggleMemory = toggleMemory;

/* =========================================================
   DELETE MEMORY
========================================================= */

async function deleteMemory(id) {
  const confirmed = confirm("Bu anıyı tamamen silmek istiyor musunuz?");
  if (!confirmed) return;
  await deleteDoc(doc(db, "memories", id));
}

window.deleteMemory = deleteMemory;

/* =========================================================
   CLOUDINARY UPLOAD (admin — sadece image)
========================================================= */

async function uploadToCloudinary(file) {
  /* Tip + boyut kontrolü */
  Security.validateImageFile(file);

  const formData = new FormData();
  formData.append("file",          file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Fotoğraf yüklenemedi 😔");
  }

  if (!Security.isSafeCloudinaryUrl(data.secure_url)) {
    throw new Error("Geçersiz yükleme yanıtı 😔");
  }

  return data.secure_url;
}

/* =========================================================
   GALLERY UPLOAD
========================================================= */

uploadGalleryBtn?.addEventListener("click", async () => {
  const files = galleryUploadInput.files;

  if (!files.length) {
    alert("Lütfen fotoğraf seçin 🤍");
    return;
  }

  uploadGalleryBtn.disabled  = true;
  uploadGalleryBtn.innerText = "Yükleniyor...";

  try {
    for (const file of files) {
      const imageUrl = await uploadToCloudinary(file);

      await addDoc(collection(db, "galleryImages"), {
        imageUrl,
        hidden:    false,
        createdAt: serverTimestamp()
      });
    }

    galleryUploadInput.value = "";
    alert("Fotoğraflar yüklendi ✨");

  } catch (error) {
    console.error(error);
    alert(error.message || "Yükleme başarısız 😔");
  }

  uploadGalleryBtn.disabled  = false;
  uploadGalleryBtn.innerText = "Fotoğraf Yükle";
});

/* =========================================================
   LOAD GALLERY — XSS korumalı
========================================================= */

function loadGalleryImages() {
  const q = query(
    collection(db, "galleryImages"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    adminGalleryGrid.innerHTML = "";

    if (snapshot.empty) {
      const div = document.createElement("div");
      div.className   = "empty";
      div.textContent = "Henüz galeri fotoğrafı yok";
      adminGalleryGrid.appendChild(div);
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      /* URL güvenlik kontrolü */
      if (!Security.isSafeMediaUrl(data.imageUrl)) return;

      const card = document.createElement("div");
      card.className = "admin-gallery-card";

      /* Gizli badge */
      if (data.hidden === true) {
        const badge = document.createElement("div");
        badge.className   = "gallery-hidden";
        badge.textContent = "Gizli";
        card.appendChild(badge);
      }

      const img    = document.createElement("img");
      img.src      = data.imageUrl;
      img.alt      = "Galeri fotoğrafı";
      card.appendChild(img);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "gallery-card-actions";

      const toggleBtn       = document.createElement("button");
      toggleBtn.className   = "action-btn";
      toggleBtn.textContent = data.hidden === true ? "Yayınla" : "Gizle";
      toggleBtn.addEventListener("click", () => toggleGalleryImage(docSnap.id, data.hidden === true));

      const deleteBtn       = document.createElement("button");
      deleteBtn.className   = "action-btn delete";
      deleteBtn.textContent = "Sil";
      deleteBtn.addEventListener("click", () => deleteGalleryImage(docSnap.id));

      actionsDiv.appendChild(toggleBtn);
      actionsDiv.appendChild(deleteBtn);
      card.appendChild(actionsDiv);

      adminGalleryGrid.appendChild(card);
    });
  });
}

/* =========================================================
   TOGGLE GALLERY
========================================================= */

async function toggleGalleryImage(id, isHidden) {
  await updateDoc(doc(db, "galleryImages", id), { hidden: !isHidden });
}

window.toggleGalleryImage = toggleGalleryImage;

/* =========================================================
   DELETE GALLERY
========================================================= */

async function deleteGalleryImage(id) {
  const confirmed = confirm("Bu fotoğrafı silmek istiyor musunuz?");
  if (!confirmed) return;
  await deleteDoc(doc(db, "galleryImages", id));
}

window.deleteGalleryImage = deleteGalleryImage;
