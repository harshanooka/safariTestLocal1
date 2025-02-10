const iframe = document.createElement("iframe");
iframe.src = "https://local.cache.com:8081";
iframe.style.display = "none";
document.body.appendChild(iframe);

function sendMessage(action, key, value = null) {
  return new Promise((resolve) => {
    function listener(event) {
      if (event.origin === "https://local.cache.com:8081") {
        resolve(event.data.value);
        window.removeEventListener("message", listener);
      }
    }
    window.addEventListener("message", listener);
    iframe.contentWindow?.postMessage({ action, key, value }, "https://local.cache.com:8081");
  });
}

function setDarkTheme() {
  sendMessage("set", "theme", "gray").then(() => {
    console.log("Theme set in IndexedDB!");
    document.body.style.background = "gray";
  });
}

function getTheme() {
  sendMessage("get", "theme").then((value) => {
    document.body.style.background = value;
    console.log("Theme from IndexedDB:", value);
  });
}

async function triggerRequestStorageAccess() {
  if (document.requestStorageAccess) {
    try {
      await document.requestStorageAccess();
      console.log("Storage access granted!");
    } catch (error) {
      console.warn("Storage access denied:", error);
    }
  } else {
    console.log("Storage Access API not needed in this browser.");
  }
}
