const SEARCH_ICON = `
  <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`;

function resolveElement(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return target;
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function collectTags(item) {
  return Array
    .from(item.querySelectorAll('.chip'))
    .map(chip => chip.textContent.trim())
    .filter(Boolean);
}

function createOption(value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  return option;
}

export function initInboxSearch({ root, list }) {
  const rootEl = resolveElement(root);
  const listEl = resolveElement(list);

  if (!rootEl || !listEl) return null;

  rootEl.innerHTML = `
    <div class="search-controls">
      <label class="search-field">
        ${SEARCH_ICON}
        <input
          class="search-input"
          type="search"
          placeholder="Search"
          autocomplete="off"
          spellcheck="false"
          aria-label="Search inbox"
        >
      </label>

      <select class="search-filter" aria-label="Filter inbox by tag">
        <option value="">All tags</option>
      </select>
    </div>
  `;

  const input = rootEl.querySelector('.search-input');
  const filter = rootEl.querySelector('.search-filter');
  const unreadInput = rootEl.querySelector('.unread-input');
  const items = Array.from(listEl.querySelectorAll('.inbox-item'));

  const itemIndex = items.map(item => {
    const tags = collectTags(item);

    return {
      element: item,
      searchText: normalize(item.textContent),
      tags,
      normalizedTags: tags.map(normalize)
    };
  });

  const tags = [...new Set(itemIndex.flatMap(item => item.tags))]
    .sort((a, b) => a.localeCompare(b));

  tags.forEach(tag => {
    filter.appendChild(createOption(tag));
  });

  const emptyState = document.createElement('div');
  emptyState.className = 'search-empty';
  emptyState.textContent = 'No matching inbox items';
  listEl.appendChild(emptyState);

  function filterItems() {
    const query = normalize(input.value);
    const selectedTag = normalize(filter.value);
    const unreadOnly = unreadInput.checked;
    let visibleCount = 0;

    itemIndex.forEach(item => {
      const matchesQuery =
        !query || item.searchText.includes(query);

      const matchesTag =
        !selectedTag || item.normalizedTags.includes(selectedTag);

      const matchesUnread =
        !unreadOnly || item.element.classList.contains('is-unread');

      const isVisible = matchesQuery && matchesTag && matchesUnread;

      item.element.hidden = !isVisible;
      item.element.classList.toggle('expanded', false);

      if (isVisible) visibleCount += 1;
    });

    emptyState.classList.toggle('visible', visibleCount === 0);
  }

  input.addEventListener('input', filterItems);
  input.addEventListener('search', filterItems);
  filter.addEventListener('change', filterItems);
  unreadInput.addEventListener('change', filterItems);
  document.addEventListener('inbox:read-state-change', filterItems);

  filterItems();

  return {
    input,
    filter,
    refresh: filterItems
  };
}
