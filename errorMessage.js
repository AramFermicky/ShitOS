// errorMessage.js — отображение ошибок в интерфейсе ShitOS

// Добавляем элемент для ошибок (если ещё нет)
if (!document.getElementById("errorMessage")) {
  const div = document.createElement("div");
  div.id = "errorMessage";
  div.style.position = "fixed";
  div.style.bottom = "10px";
  div.style.left = "10px";
  div.style.maxWidth = "90%";
  div.style.padding = "10px 14px";
  div.style.backgroundColor = "#ff3333";
  div.style.color = "#fff";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
  div.style.fontFamily = "monospace";
  div.style.zIndex = "9999";
  div.style.display = "none";
  document.body.appendChild(div);
}

export function showError(message) {
  const box = document.getElementById("errorMessage");
  box.textContent = "❌ " + message;
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 5000);
}
