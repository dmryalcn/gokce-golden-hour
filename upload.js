/* =========================================================
   GÖKÇE & YALÇIN — UPLOAD SYSTEM (GÜVENLİ VERSİYON)
========================================================= */

import "./firebase.js";

const {
  collection,
  addDoc,
  serverTimestamp
} = window.firebaseFns;

const db = window.db;

/* =========================================================
   CLOUDINARY
========================================================= */

const CLOUD_NAME    = "dgtscqpny";
const UPLOAD_PRESET = "weddingUploads";

/* =========================================================
   GÜVENLİK YARDIMCILARI
   - sanitizeText  : HTML inject'e karşı metin temizle
   - escapeHTML    : DOM'a yazarken güvenli hale getir
   - validateFile  : Tip + boyut kontrolü
   - canSubmit     : localStorage tabanlı cooldown
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

  escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

  /* İzin verilen MIME tipleri */
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "audio/webm",
    "audio/ogg",
    "audio/mp4"
  ],

  MAX_IMAGE_SIZE: 8  * 1024 * 1024,   //  8 MB
  MAX_VIDEO_SIZE: 40 * 1024 * 1024,   // 40 MB
  MAX_AUDIO_SIZE: 10 * 1024 * 1024,   // 10 MB

  validateFile(file) {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Desteklenmeyen dosya türü 😔 (jpg, png, webp, mp4, webm kabul edilir)");
    }

    if (file.type.startsWith("image") && file.size > this.MAX_IMAGE_SIZE) {
      throw new Error("Fotoğraflar en fazla 8MB olabilir 🤍");
    }
    if (file.type.startsWith("video") && file.size > this.MAX_VIDEO_SIZE) {
      throw new Error("Video en fazla 40MB olabilir 🤍");
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

  /*
   * Cooldown kontrolü.
   * key      : localStorage anahtarı
   * seconds  : bekleme süresi (saniye)
   * Dönüş    : true = gönderebilir, false = beklemeye devam
   */
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
   ELEMENTS
========================================================= */

const memoryModal      = document.getElementById("memoryModal");
const rsvpModal        = document.getElementById("rsvpModal");
const memoryForm       = document.getElementById("memoryForm");
const rsvpForm         = document.getElementById("rsvpForm");
const recordBtn        = document.getElementById("recordBtn");
const audioPreview     = document.getElementById("audioPreview");
const recordingStatus  = document.getElementById("recordingStatus");
const backgroundMusic  = document.getElementById("bgMusic");

/* =========================================================
   AUDIO RECORD
========================================================= */

let mediaRecorder    = null;
let audioChunks      = [];
let recordedAudioBlob = null;
let recordingTimer   = null;
let recordingSeconds = 15;
let isRecording      = false;

/* =========================================================
   START RECORD
========================================================= */

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

      let mimeType = "";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      }

      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      audioChunks      = [];
      recordingSeconds = 15;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        clearInterval(recordingTimer);
        stream.getTracks().forEach(track => track.stop());

        recordedAudioBlob = new Blob(
          audioChunks,
          { type: mediaRecorder.mimeType || "audio/webm" }
        );

        const audioUrl = URL.createObjectURL(recordedAudioBlob);

        if (audioPreview) {
          audioPreview.src    = audioUrl;
          audioPreview.style.display = "block";
        }

        if (recordingStatus) {
          recordingStatus.innerHTML = "Sesli mesaj hazır ✨";
        }

        recordBtn.disabled  = false;
        recordBtn.innerHTML = "🎙️ Sesli Mesaj Gönder";
        isRecording         = false;

        if (backgroundMusic) {
          backgroundMusic.volume = 0.35;
          backgroundMusic.play().catch(() => {});
        }
      };

      mediaRecorder.start();
      recordBtn.disabled  = true;
      recordBtn.innerHTML = "Kaydediliyor...";

      if (recordingStatus) {
        recordingStatus.innerHTML = "15 saniye kaldı";
      }

      recordingTimer = setInterval(() => {
        recordingSeconds--;

        if (recordingStatus) {
          recordingStatus.innerHTML = `${recordingSeconds} saniye kaldı`;
        }

        if (recordingSeconds <= 0) {
          mediaRecorder.stop();
          clearInterval(recordingTimer);
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      alert("Mikrofon erişimi sağlanamadı 😔");
      recordBtn.disabled  = false;
      recordBtn.innerHTML = "🎙️ Sesli Mesaj Gönder";
      isRecording         = false;

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
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(memoryModal);
  });
});

document.querySelectorAll('[data-open="rsvp"]').forEach(btn => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(rsvpModal);
  });
});

document.querySelectorAll(".modal-close,.memory-overlay,.rsvp-close").forEach(el => {
  el.addEventListener("click", () => closeAllModals());
});

/* =========================================================
   CLOUDINARY UPLOAD (GÜVENLİ)
   - Dosya tipi ve boyutu yüklemeden önce doğrulanır
   - Dönen URL, cloudinary.com'a ait olduğu kontrol edilir
========================================================= */

async function uploadToCloudinary(file, resourceType = "auto") {
  /* Yüklemeden önce yerel validasyon */
  Security.validateFile(file);

  const formData = new FormData();
  formData.append("file",           file);
  formData.append("upload_preset",  UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Dosya yüklenemedi 😔");
  }

  /* Dönen URL güvenlik kontrolü */
  if (!Security.isSafeCloudinaryUrl(data.secure_url)) {
    throw new Error("Geçersiz yükleme yanıtı 😔");
  }

  return data.secure_url;
}

/* =========================================================
   MEMORY FORM
   - Rate limit : 60 saniyede 1 gönderim
   - İsim + mesaj sanitize edilir
   - Dosya tip + boyut validasyonu
========================================================= */

let memorySubmitting = false;

if (memoryForm) {
  memoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (memorySubmitting) return;

    /* Rate limit kontrolü */
    try {
      Security.canSubmit("memory_last_submit", 60);
    } catch (err) {
      showPopup("Bekleyin 🤍", err.message);
      return;
    }

    memorySubmitting = true;

    const submitBtn   = memoryForm.querySelector(".send-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled  = true;
    submitBtn.innerHTML = "Yükleniyor...";

    try {
      /* Girdi temizleme */
      const name    = Security.sanitizeText(document.getElementById("memoryName")?.value    || "");
      const message = Security.validateMessage(document.getElementById("memoryMessage")?.value || "");
      const files   = document.getElementById("memoryFile")?.files || [];

      if (!message.trim() && files.length === 0 && !recordedAudioBlob) {
        throw new Error("Lütfen bir anı bırakın 🤍");
      }

      let mediaItems  = [];
      let imageCount  = 0;
      let videoCount  = 0;

      /* Dosya yükleme */
      for (const file of files) {
        /* Tip + boyut kontrolü (validateFile içinde) */
        Security.validateFile(file);

        if (file.type.startsWith("image")) {
          imageCount++;
          if (imageCount > 5) throw new Error("En fazla 5 fotoğraf yükleyebilirsiniz 🤍");
        }

        if (file.type.startsWith("video")) {
          videoCount++;
          if (videoCount > 1) throw new Error("Sadece 1 video yükleyebilirsiniz 🤍");
        }

        const uploadedUrl = await uploadToCloudinary(file, "auto");
        mediaItems.push({ url: uploadedUrl, type: file.type });
      }

      /* Ses kaydı yükleme */
      if (recordedAudioBlob) {
        const audioFile = new File(
          [recordedAudioBlob],
          "voice-message.webm",
          { type: recordedAudioBlob.type || "audio/webm" }
        );

        const uploadedAudio = await uploadToCloudinary(audioFile, "auto");
        mediaItems.push({ url: uploadedAudio, type: recordedAudioBlob.type || "audio/webm" });
      }

      /* Firestore kayıt */
      await addDoc(collection(db, "memories"), {
        name,
        message,
        mediaItems,
        hidden:    false,
        createdAt: serverTimestamp()
      });

      /* Formu sıfırla */
      memoryForm.reset();
      recordedAudioBlob = null;
      audioChunks       = [];

      if (audioPreview) {
        audioPreview.src           = "";
        audioPreview.style.display = "none";
      }

      if (recordingStatus) {
        recordingStatus.innerHTML = "Hazır";
      }

      closeAllModals();
      showPopup(
        "Anınız Kaydedildi 🤍",
        "Bu güzel an artık hikayemizin bir parçası oldu ✨"
      );

    } catch (error) {
      console.error(error);
      showPopup("Bir Sorun Oluştu 😔", error.message || "Bir hata oluştu");
    }

    submitBtn.disabled  = false;
    submitBtn.innerHTML = originalText;
    memorySubmitting    = false;
  });
}

/* =========================================================
   RSVP FORM
   - Rate limit : 120 saniyede 1 gönderim
   - İsim + mesajlar sanitize edilir
========================================================= */

let rsvpSubmitting = false;

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (rsvpSubmitting) return;

    /* Rate limit kontrolü */
    try {
      Security.canSubmit("rsvp_last_submit", 120);
    } catch (err) {
      showPopup("Bekleyin 🤍", err.message);
      return;
    }

    rsvpSubmitting = true;

    const submitBtn    = rsvpForm.querySelector(".send-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled  = true;
    submitBtn.innerHTML = "Gönderiliyor...";

    try {
      const name   = Security.validateName(document.getElementById("rsvpName")?.value || "");
      const status = document.getElementById("attendanceStatus")?.value || "";

      if (!status) throw new Error("Katılım durumunuzu seçin 🤍");

      /* Geçerli status değeri kontrolü */
      if (!["yes", "no", "maybe"].includes(status)) {
        throw new Error("Geçersiz katılım değeri 😔");
      }

      /* Diğer alanları sanitize et */
      const guestCount          = Security.sanitizeText(document.getElementById("guestCount")?.value          || "");
      const comingMessage       = Security.validateMessage(document.getElementById("comingMessage")?.value       || "");
      const cannotJoinMessage   = Security.validateMessage(document.getElementById("cannotJoinMessage")?.value   || "");
      const maybeMessage        = Security.validateMessage(document.getElementById("maybeMessage")?.value        || "");

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
      showPopup(
        "Katılım Bilginiz Ulaştı 🤍",
        "Bu özel günümüzde yanımızda olmanız bizi çok mutlu etti ✨"
      );

    } catch (error) {
      console.error(error);
      showPopup("Bir Sorun Oluştu 😔", error.message || "Bir hata oluştu");
    }

    submitBtn.disabled  = false;
    submitBtn.innerHTML = originalText;
    rsvpSubmitting      = false;
  });
}

/* =========================================================
   POPUP
========================================================= */

function showPopup(title, message) {
  alert(`${title}\n\n${message}`);
}
