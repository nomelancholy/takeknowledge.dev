export function isMobileDevice() {
  const mobileUserAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const touchMac = navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1;
  return mobileUserAgent || touchMac;
}

export function openTossQrDialog(item) {
  const dialog = document.getElementById("toss-qr-dialog");
  if (!dialog) return;

  dialog.querySelector("#toss-qr-title").textContent = item.title;
  const image = dialog.querySelector("#toss-qr-image");
  image.src = item.qrCodeUrl;
  image.alt = `${item.title} 토스 미니앱 QR 코드`;

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

export function setupTossQrDialog() {
  const dialog = document.getElementById("toss-qr-dialog");
  if (!dialog) return;
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

