// api/sign-upload.js
// Vercel Serverless Function
// Cloudinary imzalı yükleme için güvenli imza üretir

const crypto = require("crypto");

module.exports = async (req, res) => {

  // Sadece POST kabul et
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS — sadece kendi domainden gelen istekler
  const origin = req.headers.origin || "";
  const allowed = [
    "https://www.gokceyalcin.net",
    "https://gokceyalcin.net"
  ];

  if (!allowed.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const apiSecret   = process.env.CLOUDINARY_API_SECRET;
    const apiKey      = process.env.CLOUDINARY_API_KEY;
    const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    // İmza parametreleri
    const timestamp = Math.round(Date.now() / 1000);
    const folder    = "wedding-memories";

    // İmzalanacak string
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // SHA-1 imza
    const signature = crypto
      .createHash("sha1")
      .update(toSign)
      .digest("hex");

    return res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder
    });

  } catch (err) {
    console.error("Sign upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
