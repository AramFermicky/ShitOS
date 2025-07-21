// js/errorMessage.js

export function showError(message) {
  let errorBox = document.getElementById("shitErrorBox");

  if (!errorBox) {
    errorBox = document.createElement("div");
    errorBox.id = "shitErrorBox";
    errorBox.style.position = "fixed";
    errorBox.style.bottom = "20px";
    errorBox.style.left = "50%";
    errorBox.style.transform = "translateX(-50%)";
    errorBox.style.background = "#ff3333";
    errorBox.style.color = "#fff";
    errorBox.style.padding = "12px 20px";
    errorBox.style.borderRadius = "8px";
    errorBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
    errorBox.style.fontSize = "14px";
    errorBox.style.zIndex = "9999";
    document.body.appendChild(errorBox);
  }

  errorBox.textContent = message;
  errorBox.style.display = "block";

  setTimeout(() => {
    errorBox.style.display = "none";
  }, 4000);
}
