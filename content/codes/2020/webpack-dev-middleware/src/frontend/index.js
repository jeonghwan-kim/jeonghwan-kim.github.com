async function onload() {
  const el = document.getElementById("app")
  el.textContent = "Loading..."

  const r = await fetch("/api/greeting").then(r => r.json())
  el.textContent = r.data
}

document.addEventListener("DOMContentLoaded", onload)
