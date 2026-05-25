function updateTime() {
  const el = document.querySelector('.status-time');
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  el.textContent = `${hours}:${minutes}`;
}

function startClock() {
  updateTime();

  const now = new Date();

  // сколько осталось до следующей минуты
  const msToNextMinute =
    (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

  setTimeout(() => {
    updateTime();

    // дальше обновляем строго раз в минуту
    setInterval(updateTime, 60000);
  }, msToNextMinute);
}

startClock();