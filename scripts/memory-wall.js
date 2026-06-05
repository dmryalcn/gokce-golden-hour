import "../firebase.js";

const {
  collection,
  query,
  orderBy,
  onSnapshot
} = window.firebaseFns;

const db = window.db;

const memoryWall = document.getElementById("memoryWall");

/* =========================================================
   SECURITY HELPERS
========================================================= */

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

function isSafeMediaUrl(url) {
  if (!url) return false;
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
}

/* =========================================================
   LOAD MEMORIES — onSnapshot ile canlı güncellenir
========================================================= */

function loadMemories() {
  if (!memoryWall) return;

  const q = query(
    collection(db, "memories"),
    orderBy("createdAt", "desc")
  );

  /* getDocs yerine onSnapshot — yeni anı gelince sayfa yenilemeden görünür */
  onSnapshot(q, (snapshot) => {

    if (snapshot.empty) {
      memoryWall.innerHTML = `
        <div class="memory-empty">
          Henüz anı bırakılmadı 🤍
        </div>
      `;
      return;
    }

    memoryWall.innerHTML = "";

    snapshot.forEach(docSnap => {
      const memory = docSnap.data() || {};

      /* Gizli anıları gösterme */
      if (memory.hidden === true) return;

      const card     = document.createElement("div");
      card.className = "memory-card";

      const mediaItems = Array.isArray(memory.mediaItems)
        ? memory.mediaItems
        : [];

      let mediaHTML = "";

      mediaItems.forEach(item => {
        if (!item || !item.url || !isSafeMediaUrl(item.url)) return;

        if (item.type?.includes("image")) {
          mediaHTML += `
            <div class="memory-media-item">
              <img
                src="${item.url}"
                loading="lazy"
                decoding="async"
                alt="Wedding Memory">
            </div>
          `;
        } else if (item.type?.includes("video")) {
          mediaHTML += `
            <div class="memory-media-item">
              <video controls preload="metadata">
                <source src="${item.url}">
              </video>
            </div>
          `;
        }
      });

      let audioHTML = "";
      const audioItem = mediaItems.find(item =>
        item?.type?.includes("audio") && isSafeMediaUrl(item.url)
      );

      if (audioItem) {
        audioHTML = `
          <div class="memory-audio">
            <audio controls>
              <source src="${audioItem.url}">
            </audio>
          </div>
        `;
      }

      const createdAt = memory.createdAt?.toDate
        ? memory.createdAt.toDate()
        : null;

      const formattedDate = createdAt
        ? createdAt.toLocaleDateString("tr-TR")
        : "";

      const safeName    = escapeHTML(memory.name    || "Misafir");
      const safeMessage = escapeHTML(memory.message || "");

      card.innerHTML = `
        <div class="memory-header">
          <h3 class="memory-name">${safeName}</h3>
          <p class="memory-message">${safeMessage}</p>
        </div>
        ${mediaHTML ? `<div class="memory-media">${mediaHTML}</div>` : ""}
        ${audioHTML}
        <div class="memory-date">${formattedDate}</div>
      `;

      memoryWall.appendChild(card);
    });

  }, (err) => {
    console.error("Memory Wall Error:", err);
    memoryWall.innerHTML = `
      <div class="memory-empty">
        Anılar yüklenemedi 😔
      </div>
    `;
  });
}

/* =========================================================
   INIT
========================================================= */

loadMemories();
