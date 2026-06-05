/* =========================================================
   GÖKÇE & YALÇIN — UPLOAD SYSTEM (SIGNED CLOUDINARY)
========================================================= */

import "./firebase.js";

const {
  collection,
  addDoc,
  serverTimestamp
} = window.firebaseFns;

const db = window.db;

/* =========================================================
   GÜVENLİK YARDIMCILARI
========================================================= */

const Security = {

  sanitizeText(value) {
    return String(value ?? "")
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/onerror=/gi, "")
      .replace(/onload=/gi, "")
      .trim();
  },

  validateName(name) {
    const clean = this.sanitizeText(name);
    if (clean.length < 2)  throw new Error("İsim en az 2 karakter olmalı 🤍");
    if (clean.length > 60) throw new Error("İsim en fazla 60 karakter olabilir 🤍");
    return clean;
  },

  validateMessage(message) {
    const clean = this.sanitizeText(message);
    if (clean.length > 400) throw new Error("Mesaj en fazla 400 karakter olabilir 🤍");
    return clean;
  },

  /* Video türleri kaldırıldı — sadece fotoğraf ve ses */
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "audio/webm",
    "audio/ogg",
    "audio/mp4",
    "audio/x-m4a",
    "audio/mpeg"
  ],

  MAX_IMAGE_SIZE: 8  * 1024 * 1024,
  MAX_AUDIO_SIZE: 10 * 1024 * 1024,

  validateFile(file) {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Desteklenmeyen dosya türü 😔 (jpg, png, webp kabul edilir)");
    }
    if (file.type.startsWith("image") && file.size > this.MAX_IMAGE_SIZE) {
      throw new Error("Fotoğraflar en fazla 8MB olabilir 🤍");
    }
    if (file.type.startsWith("audio") && file.size > this.MAX_AUDIO_SIZE) {
      throw new Error("Sesli mesaj en fazla 10MB olabilir 🤍");
    }
    return true;
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

  canSubmit(key, seconds = 60) {
    const now  = Date.now();
    const last = Number(localStorage.getItem(key) || 0);
    if (last && (now - last) < seconds * 1000) {
      const remaining = Math.ceil((seconds * 1000 - (now - last)) / 1000);
      throw new Error(`Lütfen ${remaining} saniye bekleyin 🤍`);
    }
    localStorage.setItem(key, now);
    return true;
  }
};

/* =========================================================
   CLOUDINARY — SIGNED UPLOAD
========================================================= */

async function getUploadSignature() {
  const response = await fetch("/api/sign-upload", {
    method:  "POST",
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) {
    throw new Error("İmza alınamadı 😔");
  }

  return await response.json();
}

async function uploadToCloudinary(file) {
  Security.validateFile(file);

  const { signature, timestamp, apiKey, cloudName, folder } =
    await getUploadSignature();

  const formData = new FormData();
  formData.append("file",       file);
  formData.append("signature",  signature);
  formData.append("timestamp",  timestamp);
  formData.append("api_key",    apiKey);
  formData.append("folder",     folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Dosya yüklenemedi 😔");
  }

  if (!Security.isSafeCloudinaryUrl(data.secure_url)) {
    throw new Error("Geçersiz yükleme yanıtı 😔");
  }

  return data.secure_url;
}

/* =========================================================
   ELEMENTS
========================================================= */

const memoryModal     = document.getElementById("memoryModal");
const rsvpModal       = document.getElementById("rsvpModal");
const memoryForm      = document.getElementById("memoryForm");
const rsvpForm        = document.getElementById("rsvpForm");
const recordBtn       = document.getElementById("recordBtn");
const audioPreview    = document.getElementById("audioPreview");
const recordingStatus = document.getElementById("recordingStatus");
const backgroundMusic = document.getElementById("bgMusic");

/* =========================================================
   SES OYNATINCA MÜZİĞİ DURDUR
   audioPreview play → bgMusic pause
   audioPreview pause/ended → bgMusic devam
========================================================= */

if (audioPreview && backgroundMusic) {

  audioPreview.addEventListener("play", () => {
    backgroundMusic.pause();
  });

  audioPreview.addEventListener("pause", () => {
    backgroundMusic.play().catch(() => {});
  });

  audioPreview.addEventListener("ended", () => {
    backgroundMusic.play().catch(() => {});
  });
}

/* =========================================================
   AUDIO RECORD
========================================================= */

let mediaRecorder     = null;
let audioChunks       = [];
let recordedAudioBlob = null;
let recordingTimer    = null;
let recordingSeconds  = 15;
let isRecording       = false;

if (recordBtn) {
  recordBtn.addEventListener("click", async () => {

    if (isRecording) return;

    try {
      isRecording = true;

      if (backgroundMusic) {
        backgroundMusic.volume = 0;
        backgroundMusic.pause();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      /* iOS Safari audio/mp4 kaydeder, diğerleri audio/webm */
      let mimeType = "";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      mediaRecorder    = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      audioChunks      = [];
      recordingSeconds = 15;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        clearInterval(recordingTimer);
        stream.getTracks().forEach(track => track.stop());

        const blobType = mediaRecorder.mimeType || "audio/webm";

        recordedAudioBlob = new Blob(audioChunks, { type: blobType });

        const audioUrl = URL.createObjectURL(recordedAudioBlob);

        if (audioPreview) {
          audioPreview.src           = audioUrl;
          audioPreview.style.display = "block";
        }

        if (recordingStatus) recordingStatus.textContent = "Sesli mesaj hazır ✨";

        recordBtn.disabled  = false;
        recordBtn.textContent = "🎙️ Sesli Mesaj Gönder";
        isRecording         = false;

        if (backgroundMusic) {
          backgroundMusic.volume = 0.35;
          backgroundMusic.play().catch(() => {});
        }
      };

      mediaRecorder.start();
      recordBtn.disabled    = true;
      recordBtn.textContent = "Kaydediliyor...";

      if (recordingStatus) recordingStatus.textContent = "15 saniye kaldı";

      recordingTimer = setInterval(() => {
        recordingSeconds--;
        if (recordingStatus) recordingStatus.textContent = `${recordingSeconds} saniye kaldı`;
        if (recordingSeconds <= 0) {
          mediaRecorder.stop();
          clearInterval(recordingTimer);
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      alert("Mikrofon erişimi sağlanamadı 😔");
      recordBtn.disabled    = false;
      recordBtn.textContent = "🎙️ Sesli Mesaj Gönder";
      isRecording           = false;

      if (backgroundMusic) {
        backgroundMusic.volume = 0.35;
        backgroundMusic.play().catch(() => {});
      }
    }
  });
}

/* =========================================================
   MODALS
========================================================= */

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeAllModals() {
  if (memoryModal) memoryModal.classList.remove("active");
  if (rsvpModal)   rsvpModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

document.querySelectorAll('[data-open="memory"]').forEach(btn => {
  btn.addEventListener("click", (e) => { e.preventDefault(); openModal(memoryModal); });
});

document.querySelectorAll('[data-open="rsvp"]').forEach(btn => {
  btn.addEventListener("click", (e) => { e.preventDefault(); openModal(rsvpModal); });
});

document.querySelectorAll(".modal-close,.memory-overlay,.rsvp-close").forEach(el => {
  el.addEventListener("click", () => closeAllModals());
});

/* =========================================================
   MEMORY FORM — Rate limit: 60 saniye
========================================================= */

let memorySubmitting = false;

if (memoryForm) {
  memoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (memorySubmitting) return;

    try {
      Security.canSubmit("memory_last_submit", 60);
    } catch (err) {
      showPopup("Bekleyin 🤍", err.message);
      return;
    }

    memorySubmitting = true;

    const submitBtn    = memoryForm.querySelector(".send-btn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled  = true;
    submitBtn.textContent = "Yükleniyor...";

    try {
      const name    = Security.sanitizeText(document.getElementById("memoryName")?.value    || "");
      const message = Security.validateMessage(document.getElementById("memoryMessage")?.value || "");
      const files   = document.getElementById("memoryFile")?.files || [];

      if (!message.trim() && files.length === 0 && !recordedAudioBlob) {
        throw new Error("Lütfen bir anı bırakın 🤍");
      }

      let mediaItems = [];
      let imageCount = 0;

      for (const file of files) {
        Security.validateFile(file);

        if (file.type.startsWith("image")) {
          imageCount++;
          if (imageCount > 5) throw new Error("En fazla 5 fotoğraf yükleyebilirsiniz 🤍");
        }

        const uploadedUrl = await uploadToCloudinary(file);
        mediaItems.push({ url: uploadedUrl, type: file.type });
      }

      if (recordedAudioBlob) {
        /* iOS'ta mimeType audio/mp4 olabilir, uzantıyı ona göre ayarla */
        const blobType = recordedAudioBlob.type || "audio/webm";
        const ext      = blobType.includes("mp4") ? "mp4" : "webm";

        const audioFile = new File(
          [recordedAudioBlob],
          `voice-message.${ext}`,
          { type: blobType }
        );
        const uploadedAudio = await uploadToCloudinary(audioFile);
        mediaItems.push({ url: uploadedAudio, type: blobType });
      }

      await addDoc(collection(db, "memories"), {
        name,
        message,
        mediaItems,
        hidden:    false,
        createdAt: serverTimestamp()
      });

      memoryForm.reset();
      recordedAudioBlob = null;
      audioChunks       = [];

      if (audioPreview) {
        audioPreview.src           = "";
        audioPreview.style.display = "none";
      }
      if (recordingStatus) recordingStatus.textContent = "Hazır";

      closeAllModals();
      showPopup("Anınız Kaydedildi 🤍", "Bu güzel an artık hikayemizin bir parçası oldu ✨");

    } catch (error) {
      console.error(error);
      showPopup("Bir Sorun Oluştu 😔", error.message || "Bir hata oluştu");
    }

    submitBtn.disabled    = false;
    submitBtn.textContent = originalText;
    memorySubmitting      = false;
  });
}

/* =========================================================
   RSVP FORM — Rate limit: 120 saniye
========================================================= */

let rsvpSubmitting = false;

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (rsvpSubmitting) return;

    try {
      Security.canSubmit("rsvp_last_submit", 120);
    } catch (err) {
      showPopup("Bekleyin 🤍", err.message);
      return;
    }

    rsvpSubmitting = true;

    const submitBtn    = rsvpForm.querySelector(".send-btn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled  = true;
    submitBtn.textContent = "Gönderiliyor...";

    try {
      const name   = Security.validateName(document.getElementById("rsvpName")?.value || "");
      const status = document.getElementById("attendanceStatus")?.value || "";

      if (!status) throw new Error("Katılım durumunuzu seçin 🤍");
      if (!["yes", "no", "maybe"].includes(status)) throw new Error("Geçersiz katılım değeri 😔");

      const guestCount        = Security.sanitizeText(document.getElementById("guestCount")?.value        || "");
      const comingMessage     = Security.validateMessage(document.getElementById("comingMessage")?.value     || "");
      const cannotJoinMessage = Security.validateMessage(document.getElementById("cannotJoinMessage")?.value || "");
      const maybeMessage      = Security.validateMessage(document.getElementById("maybeMessage")?.value      || "");

      await addDoc(collection(db, "rsvp"), {
        name,
        status,
        guestCount,
        comingMessage,
        cannotJoinMessage,
        maybeMessage,
        createdAt: serverTimestamp()
      });

      rsvpForm.reset();
      closeAllModals();
      showPopup("Katılım Bilginiz Ulaştı 🤍", "Bu özel günümüzde yanımızda olmanız bizi çok mutlu etti ✨");

    } catch (error) {
      console.error(error);
      showPopup("Bir Sorun Oluştu 😔", error.message || "Bir hata oluştu");
    }

    submitBtn.disabled    = false;
    submitBtn.textContent = originalText;
    rsvpSubmitting        = false;
  });
}

/* =========================================================
   POPUP
========================================================= */

function showPopup(title, message) {
  alert(`${title}\n\n${message}`);
}
