function flicker(el) {
  const onTime = 2000 + Math.random() * 1500;   // 2–3.5 сек
  const offTime = 3000 + Math.random() * 5000;  // пауза 3–8 сек

  el.classList.add("active");

  setTimeout(() => {
    el.classList.remove("active");
    setTimeout(() => flicker(el), offTime);
  }, onTime);
}

flicker(document.querySelector(".bar4"));
flicker(document.querySelector(".wifi-2"));