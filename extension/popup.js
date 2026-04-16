const API = "https://telegram-downloader-laaq.onrender.com";
document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");

  chrome.storage.local.get(["userId"], async (result) => {
    if (!result.userId) {
      statusDiv.innerText = "Not logged in";
      return;
    }

    statusDiv.innerText = "Checking account...";

    try {
      const res = await fetch(`${API}/remaining`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: result.userId }),
      });

      const data = await res.json();

      statusDiv.innerText = "Remaining downloads: " + data.remaining;
    } catch {
      statusDiv.innerText = "Error fetching data";
    }
  });
});
