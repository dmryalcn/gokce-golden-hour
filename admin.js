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
   GÜVENLİK YARDIMCILARI
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

  safeText(element, value) {
    if (!element) return;
    element.textContent = String(value ?? "");
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

  ALLOWED_IMAGE_TYPES: ["image/jpeg","image/png","image/webp","image/gif"],
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

const loginScreen    = document.getElementById("loginScreen");
const adminPanel     = document.getElementById("adminPanel");
const guestTable     = document.getElementById("guestTable");
const totalCount     = document.getElementById("totalCount");
const yesCount       = document.getElementById("yesCount");
const noCount        = document.getElementById("noCount");
const maybeCount     = document.getElementById("maybeCount");
const memoryGallery  = document.getElementById("memoryGallery");
const searchInput    = document.getElementById("searchInput");
const memoryCount    = document.getElementById("memoryCount");
const galleryUploadInput = document.getElementById("galleryUploadInput");
const uploadGalleryBtn   = document.getElementById("uploadGalleryBtn");
const adminGalleryGrid   = document.getElementById("adminGalleryGrid");

/* =========================================================
   LOGIN
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
    console.error(error.code);
    alert("Giriş başarısız 😔");
  }
}

window.login = login;

async function logout() {
  await signOut(auth);
  location.reload();
}

window.logout = logout;

function showPanel() {
  loginScreen.style.display = "none";
  adminPanel.style.display  = "block";
  loadGuests();
  loadMemories();
  loadGalleryImages();
}

onAuthStateChanged(auth, (user) => {
  if (user) showPanel();
});

/* =========================================================
   CLOUDINARY — SIGNED UPLOAD (admin için)
========================================================= */

async function getUploadSignature() {
  const response = await fetch("/api/sign-upload", {
    method:  "POST",
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) throw new Error("İmza alınamadı 😔");
  return await response.json();
}

async function uploadToCloudinary(file) {
  Security.validateImageFile(file);

  const { signature, timestamp, apiKey, cloudName, folder } =
    await getUploadSignature();

  const formData = new FormData();
  formData.append("file",      file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key",   apiKey);
  formData.append("folder",    folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) throw new Error("Fotoğraf yüklenemedi 😔");

  return data.secure_url;
}

/* =========================================================
   RSVP
========================================================= */

let allGuests = [];

function loadGuests() {
  const q = query(collection(db, "rsvp"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    allGuests = [];
    snapshot.forEach((docSnap) => {
      allGuests.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderGuests(allGuests);
  });
}

function renderGuests(dataList) {
  guestTable.innerHTML = "";

  let total = 0, yes = 0, no = 0, maybe = 0;

  if (!dataList.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan     = 7;
    td.className   = "empty";
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

    const fieldOrder = [
      data.name       || "-",
      data.guestCount || "-",
      null,
      data.transportNeed || "-",
      data.comingMessage || data.cannotJoinMessage || data.maybeMessage || "-",
      date
    ];

    fieldOrder.forEach((val, idx) => {
      if (val === null) return;
      const td = document.createElement("td");
      td.textContent = val;
      row.appendChild(td);

      if (idx === 1) {
        const statusTd   = document.createElement("td");
        const statusSpan = document.createElement("span");
        statusSpan.className   = `status ${getStatusClass(data.status)}`;
        statusSpan.textContent = statusText;
        statusTd.appendChild(statusSpan);
        row.appendChild(statusTd);
      }
    });

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

function getStatusClass(status) {
  if (status === "yes") return "yes";
  if (status === "no")  return "no";
  return "maybe";
}

searchInput?.addEventListener("input", (e) => {
  const val      = e.target.value.toLowerCase();
  const filtered = allGuests.filter(item =>
    (item.name || "").toLowerCase().includes(val)
  );
  renderGuests(filtered);
});

async function deleteRSVP(id) {
  const confirmed = confirm("Bu katılım bilgisini silmek istiyor musunuz?");
  if (!confirmed) return;
  await deleteDoc(doc(db, "rsvp", id));
}
window.deleteRSVP = deleteRSVP;

function exportData() {
  let csv = "İsim,Kişi Sayısı,Durum,Ulaşım,Mesaj,Tarih\n";
  document.querySelectorAll("#guestTable tr").forEach(tr => {
    const cols = tr.querySelectorAll("td");
    if (cols.length) {
      let row = [];
      cols.forEach((td, index) => {
        if (index < 6) row.push(td.textContent.replace(/,/g, " "));
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
   MEMORIES
========================================================= */

function loadMemories() {
  const q = query(collection(db, "memories"), orderBy("createdAt", "desc"));

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

      const mediaItems = data.mediaItems || [];
      mediaItems.forEach(item => {
        /* URL kontrolü — res.cloudinary.com dahil tüm subdomain'lere izin ver */
        if (!item?.url || !Security.isSafeMediaUrl(item.url)) return;

        if (item.type?.includes("image")) {
          const img       = document.createElement("img");
          img.src         = item.url;
          img.className   = "memory-media";
          img.alt         = "Anı fotoğrafı";
          card.appendChild(img);
        } else if (item.type?.includes("video")) {
          const video     = document.createElement("video");
          video.controls  = true;
          video.className = "memory-media";
          const source    = document.createElement("source");
          source.src      = item.url;
          video.appendChild(source);
          card.appendChild(video);
        } else if (item.type?.includes("audio")) {
          const audio     = document.createElement("audio");
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

      if (data.hidden === true) {
        const badge       = document.createElement("div");
        badge.className   = "gallery-hidden";
        badge.textContent = "Gizli";
        card.prepend(badge);
      }

      const nameDiv       = document.createElement("div");
      nameDiv.className   = "memory-name";
      nameDiv.textContent = data.name || "İsimsiz";

      const msgDiv        = document.createElement("div");
      msgDiv.className    = "memory-message";
      msgDiv.textContent  = data.message || "-";

      const dateDiv       = document.createElement("div");
      dateDiv.className   = "memory-date";
      dateDiv.textContent = date;

      const actionsDiv    = document.createElement("div");
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

async function toggleMemory(id, isHidden) {
  await updateDoc(doc(db, "memories", id), { hidden: !isHidden });
}
window.toggleMemory = toggleMemory;

async function deleteMemory(id) {
  const confirmed = confirm("Bu anıyı tamamen silmek istiyor musunuz?");
  if (!confirmed) return;
  await deleteDoc(doc(db, "memories", id));
}
window.deleteMemory = deleteMemory;

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
   LOAD GALLERY
========================================================= */

function loadGalleryImages() {
  const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"));

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

      if (!Security.isSafeMediaUrl(data.imageUrl)) return;

      const card     = document.createElement("div");
      card.className = "admin-gallery-card";

      if (data.hidden === true) {
        const badge       = document.createElement("div");
        badge.className   = "gallery-hidden";
        badge.textContent = "Gizli";
        card.appendChild(badge);
      }

      const img    = document.createElement("img");
      img.src      = data.imageUrl;
      img.alt      = "Galeri fotoğrafı";
      card.appendChild(img);

      const actionsDiv     = document.createElement("div");
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

async function toggleGalleryImage(id, isHidden) {
  await updateDoc(doc(db, "galleryImages", id), { hidden: !isHidden });
}
window.toggleGalleryImage = toggleGalleryImage;

async function deleteGalleryImage(id) {
  const confirmed = confirm("Bu fotoğrafı silmek istiyor musunuz?");
  if (!confirmed) return;
  await deleteDoc(doc(db, "galleryImages", id));
}
window.deleteGalleryImage = deleteGalleryImage;
