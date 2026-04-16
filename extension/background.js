// ===============================
// Telegram Downloader (MongoDB Connected)
// ===============================

const API = "https://telegram-downloader-laaq.onrender.com";

let downloadQueue = [];
let isDownloading = false;
let userId = null;

// Load userId from storage
chrome.storage.local.get(["userId"], (result) => {
  if (result.userId) {
    userId = result.userId;
  }
});

// ===============================
// Listen for download requests
// ===============================
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "download") {
    if (!userId) {
      alert("Please sign in first");
      return;
    }

    downloadQueue.push(message.url);
    processQueue();
  }
});

// ===============================
// Process Queue
// ===============================
async function processQueue() {
  if (isDownloading) return;
  if (downloadQueue.length === 0) return;

  isDownloading = true;

  while (downloadQueue.length > 0) {
    const url = downloadQueue.shift();

    try {
      // 🔥 Check download permission from backend
      const res = await fetch(`${API}/consume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        alert("Download limit reached. Please upgrade.");
        break;
      }

      const data = await res.json();
      console.log("Remaining downloads:", data.remaining);

      // ✅ Download allowed
      await downloadFile(url);

      await sleep(300);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  isDownloading = false;
}

// ===============================
// Download file
// ===============================
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const extension = getExtension(url);
    const filename = `telegram_${Date.now()}.${extension}`;

    chrome.downloads.download(
      {
        url: url,
        filename: filename,
        saveAs: false,
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(downloadId);
        }
      }
    );
  });
}

// ===============================
// Helpers
// ===============================
function getExtension(url) {
  if (url.includes(".mp4")) return "mp4";
  if (url.includes(".jpg") || url.includes(".jpeg")) return "jpg";
  if (url.includes(".png")) return "png";
  if (url.includes(".webp")) return "webp";

  return "bin";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
