const STORAGE_KEY = 'forexInbox.readItems.v1';

function resolveElement(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return target;
}

function loadReadIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const ids = stored ? JSON.parse(stored) : [];

    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(readIds) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...readIds])
    );
  } catch {
    // Read state is a convenience layer; the inbox should still work without storage.
  }
}

function applyReadState(item, isRead) {
  item.classList.toggle('is-read', isRead);
  item.classList.toggle('is-unread', !isRead);
}

function notifyReadStateChanged() {
  document.dispatchEvent(
    new CustomEvent('inbox:read-state-change')
  );
}

export function initInboxReadState({ list }) {
  const listEl = resolveElement(list);
  const readIds = loadReadIds();

  if (!listEl) {
    return {
      markRead: () => {},
      markAllRead: () => {}
    };
  }

  const items =
    Array.from(listEl.querySelectorAll('.inbox-item'));

  items.forEach(item => {
    const id = item.dataset.inboxId;
    applyReadState(item, Boolean(id && readIds.has(id)));
  });

  function markRead(item) {
    const id = item?.dataset?.inboxId;

    if (!id || readIds.has(id)) return;

    readIds.add(id);
    saveReadIds(readIds);
    applyReadState(item, true);
    notifyReadStateChanged();
  }

  function markAllRead() {
    items.forEach(item => {
      const id = item.dataset.inboxId;

      if (!id) return;

      readIds.add(id);
      applyReadState(item, true);
    });

    saveReadIds(readIds);
    notifyReadStateChanged();
  }

  return {
    markRead,
    markAllRead
  };
}
