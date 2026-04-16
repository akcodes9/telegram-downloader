// ===============================
// Telegram Message Downloader (Bubble UI FIX)
// ===============================

setInterval(() => {
  const messages = document.querySelectorAll(
    "[data-mid], .message, .Message, div[data-message-id]"
  );

  messages.forEach((msg) => {
    if (msg.dataset.processed) return;

    const videos = msg.querySelectorAll("video");
    const images = Array.from(msg.querySelectorAll("img")).filter((img) => {
      const src = img.src || "";
      return (
        src &&
        !src.includes("emoji") &&
        !src.includes("svg") &&
        img.width >= 100 &&
        img.height >= 100
      );
    });

    if (videos.length === 0 && images.length === 0) return;

    // 🔥 FIND BUBBLE (critical fix)
    let bubble =
      msg.querySelector(".bubble") ||
      msg.querySelector(".message-content") ||
      msg.querySelector(".text-content") ||
      msg;

    if (!bubble) return;

    msg.dataset.processed = "true";

    // ===============================
    // BUTTON
    // ===============================
    const btn = document.createElement("button");
    btn.innerText = "⬇ Download";
    btn.title = "Download media";

    btn.style.marginTop = "6px";
    btn.style.background = "transparent";
    btn.style.color = "#3390ec";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "12px";
    btn.style.padding = "2px 4px";

    btn.onmouseenter = () => {
      btn.style.textDecoration = "underline";
    };

    btn.onmouseleave = () => {
      btn.style.textDecoration = "none";
    };

    // ===============================
    // CLICK HANDLER
    // ===============================
    btn.onclick = () => {
      const downloaded = new Set();

      videos.forEach((video) => {
        if (video.src && !downloaded.has(video.src)) {
          downloaded.add(video.src);
          chrome.runtime.sendMessage({
            action: "download",
            url: video.src,
          });
        }
      });

      images.forEach((img) => {
        if (img.src && !downloaded.has(img.src)) {
          downloaded.add(img.src);
          chrome.runtime.sendMessage({
            action: "download",
            url: img.src,
          });
        }
      });
    };

    // ===============================
    // ADD BUTTON INSIDE BUBBLE
    // ===============================
    bubble.appendChild(btn);
  });
}, 2000);
