const iconStyles = [
  { bg: '#34C759', type: 'map' },
  { bg: '#7B61FF', type: 'gear' },
  { bg: '#FF6B35', type: 'star' },
  { bg: '#007AFF', type: 'chat' },
  { bg: '#FF2D55', type: 'heart' },
  { bg: '#5856D6', type: 'bolt' },
  { bg: '#FF9500', type: 'sun' },
  { bg: '#00C7BE', type: 'map' },
  { bg: '#30B0C7', type: 'gear' },
  { bg: '#AF52DE', type: 'star' }
];

const svgIcons = {
  map: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <path d="M13.5 3C10.0 3 7 6.0 7 9.5c0 5.0 6.5 13.5 6.5 13.5S20 14.5 20 9.5C20 6.0 17.0 3 13.5 3z" fill="white" opacity="0.92"/>
    <circle cx="13.5" cy="9.5" r="2.4" fill="rgba(0,0,0,0.35)"/>
  </svg>`,
  gear: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <circle cx="13.5" cy="13.5" r="4.5" fill="white" opacity="0.9"/>
    <path d="M13.5 4v2.5M13.5 20.5V23M4 13.5H1.5M25.5 13.5H23M6.4 6.4L8.2 8.2M18.8 18.8l1.8 1.8M6.4 20.6l1.8-1.8M18.8 8.2l1.8-1.8" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  </svg>`,
  star: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <path d="M13.5 3.5l2.4 7.3H23l-6 4.3 2.3 7.2-5.8-4.2-5.8 4.2 2.3-7.2-6-4.3h7.1z" fill="white" opacity="0.92"/>
  </svg>`,
  chat: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <path d="M4 5.5h19a2 2 0 012 2v10a2 2 0 01-2 2H7.5L3 23V7.5a2 2 0 012-2z" fill="white" opacity="0.92"/>
  </svg>`,
  heart: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <path d="M13.5 22S4 16.5 4 10.5a5.5 5.5 0 0111 0 5.5 5.5 0 0111 0C26 16.5 13.5 22 13.5 22z" fill="white" opacity="0.92"/>
  </svg>`,
  bolt: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <path d="M15 3L5 15.5h9l-2 8.5 10-13.5h-9z" fill="white" opacity="0.92"/>
  </svg>`,
  sun: `<svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <circle cx="13.5" cy="13.5" r="4.5" fill="white" opacity="0.95"/>
    <path d="M13.5 4.5v2M13.5 20.5v2M4.5 13.5h-2M22.5 13.5h2M7.5 7.5l1.4 1.4M18.1 18.1l1.4 1.4M7.5 19.5l1.4-1.4M18.1 9L19.5 7.5" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
  </svg>`
};

function mapPinSVG() {
  return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1C4.8 1 3 2.8 3 5c0 3.2 4 8 4 8s4-4.8 4-8C11 2.8 9.2 1 7 1z" stroke="#8e8e93" stroke-width="1.2" fill="none"/>
    <circle cx="7" cy="5" r="1.4" stroke="#8e8e93" stroke-width="1.2" fill="none"/>
  </svg>`;
}

function directionArrow(direction) {
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  return '→';
}

function itemId(item) {
  return item.id ||
    `${item.name}-${item.date}-${item.expires}`
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-|-$/g, '');
}

function startOfToday(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function freshness(item, now = new Date()) {
  if (!item.expires) {
    return { label: 'Always on', tone: 'stable' };
  }

  const expires = new Date(item.expires);
  const msLeft = expires - now;

  if (msLeft <= 0) {
    return { label: 'Expired', tone: 'expired' };
  }

  const today = startOfToday(now);
  const expireDay = startOfToday(expires);
  const daysLeft = Math.round((expireDay - today) / 86400000);

  if (daysLeft <= 0) {
    return { label: 'Expires today', tone: 'hot' };
  }

  if (daysLeft === 1) {
    return { label: '1d left', tone: 'soon' };
  }

  return { label: `${daysLeft}d left`, tone: 'stable' };
}

function buildScenarioAssets(assets = []) {
  return assets.map(asset => `
    <div class="scenario-asset ${asset.direction || 'flat'}">
      <div class="scenario-asset-main">
        <span class="scenario-symbol">${asset.symbol}</span>
        <span class="scenario-move">
          ${directionArrow(asset.direction)}
          ${asset.move}
        </span>
      </div>
      ${asset.note ? `<div class="scenario-note">${asset.note}</div>` : ''}
    </div>
  `).join('');
}

function buildScenarios(scenarios = []) {
  if (!scenarios.length) return '';

  return `
    <div class="scenario-block">
      ${scenarios.map(scenario => `
        <div class="scenario-card ${scenario.type || ''}">
          <div class="scenario-top">
            <span class="scenario-label">${scenario.label}</span>
            <span class="scenario-score">
              ${scenario.probability}%
              · ${scenario.confidence}
            </span>
          </div>

          <div class="scenario-trigger">
            ${scenario.trigger}
          </div>

          <div class="scenario-summary">
            ${scenario.summary}
          </div>

          <div class="scenario-assets">
            ${buildScenarioAssets(scenario.assets)}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function buildScenarioPreview(scenarios = []) {
  const baseScenario =
    scenarios.find(scenario => scenario.type === 'base') ||
    scenarios[0];

  if (!baseScenario?.assets?.length) return '';

  const assets = baseScenario.assets
    .slice(0, 3)
    .map(asset => `${asset.symbol} ${directionArrow(asset.direction)} ${asset.move}`)
    .join(', ');

  return `
    <div class="scenario-preview">
      <span class="scenario-preview-label">Base ${baseScenario.probability}%</span>
      <span class="scenario-preview-text">${assets}</span>
    </div>
  `;
}

function buildMeta(item, freshnessInfo) {
  const parts = [];

  if (item.hasMeta) {
    parts.push(`
      <span>${mapPinSVG()}</span>
      <span class="meta-text">${item.meta}</span>
    `);
  }

  parts.push(`
    <span class="freshness-badge ${freshnessInfo.tone}">
      ${freshnessInfo.label}
    </span>
  `);

  return `<div class="item-meta">${parts.join('')}</div>`;
}

export function filterActiveInbox(inboxData, now = new Date()) {
  return inboxData.filter(item => {
    if (!item.expires) return true;

    return new Date(item.expires) > now;
  });
}

export function buildInboxItem(item, now = new Date()) {
  const style = iconStyles[item.iconIdx % iconStyles.length];
  const iconSvg = svgIcons[style.type] || svgIcons.map;
  const fresh = freshness(item, now);
  const places =
    item.places?.map(place => `<div class="chip">${place}</div>`).join('') || '';
  const people =
    item.people?.map(person => `<div class="chip">${person}</div>`).join('') || '';
  const scenarios = buildScenarios(item.scenarios);
  const scenarioPreview = buildScenarioPreview(item.scenarios);

  return `
    <div
      class="inbox-item"
      data-inbox-id="${itemId(item)}"
      data-expires="${item.expires || ''}"
      data-freshness="${fresh.tone}"
    >
      <div class="inbox-item-inner">
        <div class="app-icon" style="background:${style.bg}">
          ${iconSvg}
        </div>

        <div class="item-content">
          <div class="item-top-row">
            <div class="item-name-row">
              <span class="item-name">${item.name}</span>
              <span class="online-dot unread-dot" title="New"></span>
            </div>

            <div class="item-date-row">
              <span class="item-date">${item.date}</span>
              <span class="chevron-icon">
                <svg width="7" height="12" viewBox="0 0 7 12">
                  <path
                    d="M1 1l5 5-5 5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          <div class="item-title">${item.title}</div>
          ${scenarioPreview || `<div class="item-preview">${item.preview}</div>`}
          ${buildMeta(item, fresh)}

          <div class="item-expanded">
            <div class="expanded-message">
              ${item.fullMessage}
            </div>

            ${scenarios}

            <div class="expanded-section">
              <div class="expanded-label">Places</div>
              <div class="expanded-chips">${places}</div>
            </div>

            <div class="expanded-section">
              <div class="expanded-label">People</div>
              <div class="expanded-chips">${people}</div>
            </div>

            <div class="expanded-actions"></div>

            <div class="expanded-time">
              ${item.timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderInbox(list, items, now = new Date()) {
  list.innerHTML = items
    .map(item => buildInboxItem(item, now))
    .join('');
}
