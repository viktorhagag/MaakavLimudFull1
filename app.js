// Main application logic for the Torah Tracker web app.
// This module handles routing, rendering of views, data persistence and
// management operations (add/edit/delete categories and tracks).

// Default dataset of categories, tracks and unit counts. If no data is found
// in localStorage, this object will be used to seed the application. Each
// category includes an id, a name, a colour and a list of tracks. Tracks
// include an id, title and the number of units. Completed units will be
// initialised at runtime.
const DEFAULT_DATA = {
  // Single category: Bavli Gemara with all tractates and page counts.  The
  // id values are transliterated for internal routing; titles are the
  // traditional Hebrew names.  Units correspond to the number of
  // dapim (pages) in the standard Vilna edition.  You can modify this
  // list from the manage screen or via JSON import/export.
  categories: [
    {
      id: 'gemara',
      name: 'גמרא (בבלי)',
      color: '#A66E31',
      tracks: [
        { id: 'berakhot',    title: 'ברכות',        units: 64 },
        { id: 'shabbat',     title: 'שבת',           units: 157 },
        { id: 'eruvin',      title: 'עירובין',       units: 105 },
        { id: 'pesachim',    title: 'פסחים',         units: 121 },
        { id: 'shekalim',    title: 'שקלים',         units: 22 },
        { id: 'yoma',        title: 'יומא',           units: 88 },
        { id: 'sukkah',      title: 'סוכה',           units: 56 },
        { id: 'beitza',      title: 'ביצה',           units: 40 },
        { id: 'rosh-hashanah', title: 'ראש השנה',     units: 35 },
        { id: 'taanit',      title: 'תענית',         units: 31 },
        { id: 'megillah',    title: 'מגילה',         units: 32 },
        { id: 'moed-katan',  title: 'מועד קטן',       units: 29 },
        { id: 'chagigah',    title: 'חגיגה',         units: 27 },
        { id: 'yevamot',     title: 'יבמות',         units: 122 },
        { id: 'ketubot',     title: 'כתובות',         units: 112 },
        { id: 'nedarim',     title: 'נדרים',         units: 91 },
        { id: 'nazir',       title: 'נזיר',           units: 66 },
        { id: 'sotah',       title: 'סוטה',           units: 49 },
        { id: 'gittin',      title: 'גיטין',          units: 90 },
        { id: 'kiddushin',   title: 'קידושין',        units: 82 },
        { id: 'bava-kamma',  title: 'בבא קמא',        units: 119 },
        { id: 'bava-metzia', title: 'בבא מציעא',      units: 119 },
        { id: 'bava-batra',  title: 'בבא בתרא',       units: 176 },
        { id: 'sanhedrin',   title: 'סנהדרין',        units: 113 },
        { id: 'makot',       title: 'מכות',           units: 24 },
        { id: 'shevuot',     title: 'שבועות',         units: 49 },
        { id: 'avodah-zarah',title: 'עבודה זרה',      units: 76 },
        { id: 'horayot',     title: 'הוריות',         units: 14 },
        { id: 'zevachim',    title: 'זבחים',          units: 120 },
        { id: 'menachot',    title: 'מנחות',          units: 110 },
        { id: 'chullin',     title: 'חולין',          units: 142 },
        { id: 'bekhorot',    title: 'בכורות',         units: 61 },
        { id: 'arachin',     title: 'ערכין',          units: 34 },
        { id: 'temurah',     title: 'תמורה',          units: 34 },
        { id: 'keritot',     title: 'כריתות',         units: 28 },
        { id: 'meilah',      title: 'מעילה',          units: 22 },
        { id: 'kinnim',      title: 'קנים',           units: 3 },
        { id: 'tamid',       title: 'תמיד',           units: 10 },
        { id: 'midot',       title: 'מידות',          units: 4 }
      ]
    }
  ]
};

// Global state for the application. This will be initialised from
// localStorage or from DEFAULT_DATA on first load. Each track will have a
// `completed` array to represent completion of its units.
let data;

// DOM references
const header = document.getElementById('app-header');
const pageTitle = document.getElementById('page-title');
const manageBtn = document.getElementById('manage-btn');
const content = document.getElementById('app-content');
const footer = document.getElementById('app-footer');

// Create a back button element (will be inserted/removed dynamically)
const backBtn = document.createElement('button');
backBtn.textContent = '←';
backBtn.className = 'manage-btn';
backBtn.style.marginLeft = '0.5rem';
backBtn.setAttribute('aria-label', 'חזור');
backBtn.addEventListener('click', () => {
  window.history.back();
});

// Initialise the application
function init() {
  loadData();
  // Route when hash changes
  window.addEventListener('hashchange', () => {
    render();
  });
  manageBtn.addEventListener('click', () => {
    // Navigate to manage page
    window.location.hash = '#manage';
  });
  // Render initial page
  render();
}

// Load data from localStorage or initialise with default data
function loadData() {
  const stored = localStorage.getItem('torahTrackerData');
  if (stored) {
    try {
      data = JSON.parse(stored);
      // Ensure each track has a completed array; if not, initialise it
      for (const category of data.categories) {
        for (const track of category.tracks) {
          if (!Array.isArray(track.completed) || track.completed.length !== track.units) {
            track.completed = new Array(track.units).fill(false);
          }
        }
      }
      return;
    } catch (e) {
      console.error('Failed to parse stored data, resetting.', e);
    }
  }
  // Deep copy default data and initialise completed arrays
  data = JSON.parse(JSON.stringify(DEFAULT_DATA));
  for (const category of data.categories) {
    for (const track of category.tracks) {
      track.completed = new Array(track.units).fill(false);
    }
  }
  saveData();
}

// Save current data state to localStorage
function saveData() {
  try {
    localStorage.setItem('torahTrackerData', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

// Main router: determines which view to render based on the location hash
function render() {
  const hash = window.location.hash || '#home';
  // Clear previous page-specific listeners and content
  content.innerHTML = '';
  footer.innerHTML = '';
  // Remove back button if exists
  if (header.contains(backBtn)) header.removeChild(backBtn);
  // Determine route
  if (hash === '' || hash === '#' || hash === '#home') {
    renderHome();
  } else if (hash.startsWith('#category-')) {
    const id = decodeURIComponent(hash.substring('#category-'.length));
    renderCategoryPage(id);
  } else if (hash.startsWith('#track-')) {
    // Format: #track-{categoryId}-{trackId}
    const rest = decodeURIComponent(hash.substring('#track-'.length));
    const parts = rest.split('~');
    // Using ~ as separator to avoid confusion with hyphens in ids
    const categoryId = parts[0];
    const trackId = parts[1];
    renderTrackPage(categoryId, trackId);
  } else if (hash === '#manage') {
    renderManage();
  } else {
    // fallback to home
    renderHome();
  }
}

// Compute progress for a track: returns { completed, total }
function getTrackProgress(track) {
  const total = track.units;
  const completed = track.completed.reduce((sum, val) => sum + (val ? 1 : 0), 0);
  return { completed, total };
}

// Compute aggregated progress for a category
function getCategoryProgress(category) {
  let total = 0;
  let completed = 0;
  for (const track of category.tracks) {
    const prog = getTrackProgress(track);
    total += prog.total;
    completed += prog.completed;
  }
  return { completed, total };
}

// Render the home (categories) view
function renderHome() {
  pageTitle.textContent = 'ספרים';
  manageBtn.style.display = '';
  // Clear content
  const list = document.createElement('ul');
  list.className = 'list';
  for (const category of data.categories) {
    const { completed, total } = getCategoryProgress(category);
    const percent = total === 0 ? 0 : Math.floor((completed / total) * 100);
    // Card element
    const li = document.createElement('li');
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
      window.location.hash = `#category-${encodeURIComponent(category.id)}`;
    });
    // Accent
    const accent = document.createElement('div');
    accent.className = 'card-accent';
    accent.style.backgroundColor = category.color;
    card.appendChild(accent);
    // Content
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    // Title
    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = category.name;
    cardContent.appendChild(title);
    // Progress info
    const progDiv = document.createElement('div');
    progDiv.className = 'card-progress';
    const percentSpan = document.createElement('span');
    percentSpan.textContent = `${percent}%`;
    const ratioSpan = document.createElement('span');
    ratioSpan.style.fontSize = '0.8rem';
    ratioSpan.textContent = `${completed}/${total}`;
    progDiv.appendChild(percentSpan);
    progDiv.appendChild(ratioSpan);
    // Progress bar
    const barContainer = document.createElement('div');
    barContainer.className = 'progress-bar-container';
    const barFill = document.createElement('div');
    barFill.className = 'progress-bar-fill';
    barFill.style.backgroundColor = category.color;
    barFill.style.width = `${percent}%`;
    barContainer.appendChild(barFill);
    progDiv.appendChild(barContainer);
    cardContent.appendChild(progDiv);
    card.appendChild(cardContent);
    li.appendChild(card);
    list.appendChild(li);
  }
  content.appendChild(list);
}

// Render page showing tracks in a category
function renderCategoryPage(catId) {
  const category = data.categories.find(c => c.id === catId);
  if (!category) {
    renderHome();
    return;
  }
  pageTitle.textContent = category.name;
  // Show back button; hide manage button because manage is accessible via gear on home
  manageBtn.style.display = '';
  header.insertBefore(backBtn, pageTitle);
  // Category tracks list
  const list = document.createElement('ul');
  list.className = 'list';
  for (const track of category.tracks) {
    const { completed, total } = getTrackProgress(track);
    const percent = total === 0 ? 0 : Math.floor((completed / total) * 100);
    const li = document.createElement('li');
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
      // Use ~ as separator to avoid dash conflicts
      window.location.hash = `#track-${encodeURIComponent(category.id)}~${encodeURIComponent(track.id)}`;
    });
    const accent = document.createElement('div');
    accent.className = 'card-accent';
    accent.style.backgroundColor = category.color;
    card.appendChild(accent);
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = track.title;
    cardContent.appendChild(title);
    const progDiv = document.createElement('div');
    progDiv.className = 'card-progress';
    const percentSpan = document.createElement('span');
    percentSpan.textContent = `${percent}%`;
    const ratioSpan = document.createElement('span');
    ratioSpan.style.fontSize = '0.8rem';
    ratioSpan.textContent = `${completed}/${total}`;
    progDiv.appendChild(percentSpan);
    progDiv.appendChild(ratioSpan);
    const barContainer = document.createElement('div');
    barContainer.className = 'progress-bar-container';
    const barFill = document.createElement('div');
    barFill.className = 'progress-bar-fill';
    barFill.style.backgroundColor = category.color;
    barFill.style.width = `${percent}%`;
    barContainer.appendChild(barFill);
    progDiv.appendChild(barContainer);
    cardContent.appendChild(progDiv);
    card.appendChild(cardContent);
    li.appendChild(card);
    list.appendChild(li);
  }
  content.appendChild(list);
}

// Render page showing units for a track
function renderTrackPage(catId, trackId) {
  const category = data.categories.find(c => c.id === catId);
  if (!category) {
    renderHome();
    return;
  }
  const track = category.tracks.find(t => t.id === trackId);
  if (!track) {
    renderCategoryPage(catId);
    return;
  }
  pageTitle.textContent = track.title;
  // Show back button
  header.insertBefore(backBtn, pageTitle);
  // Provide mark all/clear all actions at top
  const actionsDiv = document.createElement('div');
  actionsDiv.style.marginBottom = '0.5rem';
  // Mark all button
  const markAllBtn = document.createElement('button');
  markAllBtn.className = 'button btn-primary';
  markAllBtn.textContent = 'סמן הכל';
  // This event toggles all units to completed and updates the UI without full re-render
  markAllBtn.addEventListener('click', () => {
    for (let i = 0; i < track.units; i++) {
      track.completed[i] = true;
    }
    saveData();
    // Update UI: mark each unit check as checked
    const checks = content.querySelectorAll('.unit-check');
    checks.forEach(ch => ch.classList.add('checked'));
    // Update bottom progress text
    const { completed: comp, total: tot } = getTrackProgress(track);
    if (progText) {
      progText.textContent = `הושלמו ${comp} מתוך ${tot}`;
    }
  });
  // Clear all button
  const clearAllBtn = document.createElement('button');
  clearAllBtn.className = 'button btn-secondary';
  clearAllBtn.textContent = 'נקה הכל';
  clearAllBtn.addEventListener('click', () => {
    for (let i = 0; i < track.units; i++) {
      track.completed[i] = false;
    }
    saveData();
    // Update UI: unmark all unit checks
    const checks = content.querySelectorAll('.unit-check');
    checks.forEach(ch => ch.classList.remove('checked'));
    const { completed: comp, total: tot } = getTrackProgress(track);
    if (progText) {
      progText.textContent = `הושלמו ${comp} מתוך ${tot}`;
    }
  });
  actionsDiv.appendChild(markAllBtn);
  actionsDiv.appendChild(clearAllBtn);
  content.appendChild(actionsDiv);
  // List of units
  const unitList = document.createElement('ul');
  unitList.className = 'list';
  for (let i = 0; i < track.units; i++) {
    const li = document.createElement('li');
    li.className = 'unit-list-item';
    // Unit label
    const label = document.createElement('span');
    label.className = 'unit-label';
    label.textContent = getUnitLabel(category.id, i);
    li.appendChild(label);
    // Check circle
    const check = document.createElement('div');
    check.className = 'unit-check';
    if (track.completed[i]) {
      check.classList.add('checked');
    }
    check.addEventListener('click', () => {
      track.completed[i] = !track.completed[i];
      saveData();
      // Update element state without full re-render for performance
      if (track.completed[i]) {
        check.classList.add('checked');
      } else {
        check.classList.remove('checked');
      }
      updateProgressBarForTrack(category, track);
    });
    li.appendChild(check);
    unitList.appendChild(li);
  }
  content.appendChild(unitList);
  // Optionally show counts at bottom
  const { completed, total } = getTrackProgress(track);
  var progText = document.createElement('div');
  progText.style.marginTop = '1rem';
  progText.style.fontSize = '0.9rem';
  progText.textContent = `הושלמו ${completed} מתוך ${total}`;
  content.appendChild(progText);
  // Save once to persist new values from previous actions
  saveData();
}

// Update progress bar for track and its parent category after toggling a unit.
function updateProgressBarForTrack(category, track) {
  // On track page we don't have card progress bars; update aggregated progress of category card when returning.
  // For now we simply save data; the next navigation will re-calc progress.
  saveData();
}

// Convert unit index to a label based on category type
function getUnitLabel(categoryId, index) {
  // For gemara and yerushalmi use 'דף'; for shulchan_aruch use 'סעיף'; otherwise 'פרק'
  // When displaying Gemara page numbers we convert to Hebrew letters (e.g. א, ב, ג).
  if (categoryId === 'gemara') {
    return 'דף ' + toHebrewNumeral(index + 1);
  }
  if (categoryId === 'shulchan_aruch') {
    return 'סעיף ' + (index + 1);
  }
  // Default for other categories (if any added via manage)
  return 'פרק ' + (index + 1);
}

// Convert an integer to a Hebrew numeral string (gematria).  Handles values
// up to a few hundred. The algorithm builds letters for hundreds, tens and
// units and special‑cases 15 and 16 to avoid combinations that spell the
// divine name. See https://en.wikipedia.org/wiki/Hebrew_numerals for details.
function toHebrewNumeral(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '';
  // Special cases for 15 and 16
  if (n % 100 === 15) return toHebrewNumeral(n - 15) + 'טו';
  if (n % 100 === 16) return toHebrewNumeral(n - 16) + 'טז';
  let result = '';
  // Hundreds (repeat ק for each 100). For numbers beyond 400 this is a
  // simplistic approach but sufficient for our page ranges (<200).
  const hundreds = Math.floor(n / 100);
  if (hundreds > 0) {
    result += 'ק'.repeat(hundreds);
  }
  let remainder = n % 100;
  // Tens
  const tens = Math.floor(remainder / 10);
  const units = remainder % 10;
  const tensLetters = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const unitLetters = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  if (tens > 0) {
    result += tensLetters[tens];
  }
  if (units > 0) {
    result += unitLetters[units];
  }
  return result;
}

// ========== Manage screen ==========

function renderManage() {
  pageTitle.textContent = 'ניהול';
  // Show back button; hide manage button
  header.insertBefore(backBtn, pageTitle);
  manageBtn.style.display = 'none';
  // Clear content
  const container = document.createElement('div');
  container.className = 'manage-container';
  // For each category create management section
  data.categories.forEach(category => {
    const catDiv = document.createElement('div');
    catDiv.className = 'manage-category';
    // Header row with title and actions
    const headerRow = document.createElement('div');
    headerRow.className = 'manage-category-header';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'manage-category-title';
    titleSpan.textContent = category.name;
    headerRow.appendChild(titleSpan);
    const actionsDiv = document.createElement('div');
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'button btn-secondary';
    editBtn.textContent = 'ערוך';
    editBtn.addEventListener('click', () => {
      openCategoryModal(category);
    });
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'button btn-danger';
    deleteBtn.textContent = 'מחק';
    deleteBtn.addEventListener('click', () => {
      if (confirm('האם אתה בטוח שברצונך למחוק את הקטגוריה? פעולה זו תסיר גם את המסלולים והנתונים המשויכים.')) {
        data.categories = data.categories.filter(c => c.id !== category.id);
        saveData();
        renderManage();
      }
    });
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    headerRow.appendChild(actionsDiv);
    catDiv.appendChild(headerRow);
    // Track list within category
    const ul = document.createElement('ul');
    ul.className = 'manage-track-list';
    category.tracks.forEach(track => {
      const li = document.createElement('li');
      li.className = 'manage-track-item';
      const span = document.createElement('span');
      span.textContent = `${track.title} (${track.units})`;
      li.appendChild(span);
      const tActions = document.createElement('div');
      // Edit track button
      const tEdit = document.createElement('button');
      tEdit.className = 'button btn-secondary';
      tEdit.textContent = 'ערוך';
      tEdit.addEventListener('click', () => {
        openTrackModal(category, track);
      });
      const tDelete = document.createElement('button');
      tDelete.className = 'button btn-danger';
      tDelete.textContent = 'מחק';
      tDelete.addEventListener('click', () => {
        if (confirm('האם אתה בטוח שברצונך למחוק את המסלול?')) {
          category.tracks = category.tracks.filter(t => t.id !== track.id);
          saveData();
          renderManage();
        }
      });
      tActions.appendChild(tEdit);
      tActions.appendChild(tDelete);
      li.appendChild(tActions);
      ul.appendChild(li);
    });
    catDiv.appendChild(ul);
    // Add track button
    const addTrackBtn = document.createElement('button');
    addTrackBtn.className = 'button btn-secondary';
    addTrackBtn.textContent = 'הוסף מסלול';
    addTrackBtn.addEventListener('click', () => {
      openTrackModal(category, null);
    });
    catDiv.appendChild(addTrackBtn);
    container.appendChild(catDiv);
  });
  // Add category button
  const addCategoryBtn = document.createElement('button');
  addCategoryBtn.className = 'button btn-primary';
  addCategoryBtn.textContent = 'הוסף קטגוריה';
  addCategoryBtn.addEventListener('click', () => {
    openCategoryModal(null);
  });
  container.appendChild(addCategoryBtn);
  // Export button
  const exportBtn = document.createElement('button');
  exportBtn.className = 'button btn-secondary';
  exportBtn.textContent = 'ייצוא JSON';
  exportBtn.addEventListener('click', () => {
    const json = JSON.stringify(data, null, 2);
    openExportModal(json);
  });
  container.appendChild(exportBtn);
  // Import button
  const importBtn = document.createElement('button');
  importBtn.className = 'button btn-secondary';
  importBtn.textContent = 'ייבוא JSON';
  importBtn.addEventListener('click', () => {
    openImportModal();
  });
  container.appendChild(importBtn);
  content.appendChild(container);
}

// ======= Modal helpers =======

// Create and display a modal overlay. Returns functions to close modal.
function createModal(title) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const h2 = document.createElement('h2');
  h2.textContent = title;
  modal.appendChild(h2);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return { overlay, modal, close: () => { document.body.removeChild(overlay); } };
}

// Open modal to add/edit a category
function openCategoryModal(category) {
  const isNew = category == null;
  const title = isNew ? 'קטגוריה חדשה' : 'עריכת קטגוריה';
  const { overlay, modal, close } = createModal(title);
  // Input for name
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'שם';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = category ? category.name : '';
  nameInput.required = true;
  modal.appendChild(nameLabel);
  modal.appendChild(nameInput);
  // Input for colour
  const colorLabel = document.createElement('label');
  colorLabel.textContent = 'צבע';
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = category ? category.color : '#888888';
  modal.appendChild(colorLabel);
  modal.appendChild(colorInput);
  // Actions
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'button btn-primary';
  saveBtn.textContent = 'שמירה';
  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const color = colorInput.value;
    if (!name) {
      alert('יש להזין שם');
      return;
    }
    if (isNew) {
      // Generate unique id
      const newId = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      const newCategory = {
        id: newId,
        name,
        color,
        tracks: []
      };
      data.categories.push(newCategory);
    } else {
      category.name = name;
      category.color = color;
    }
    saveData();
    close();
    renderManage();
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'button btn-secondary';
  cancelBtn.textContent = 'ביטול';
  cancelBtn.addEventListener('click', () => {
    close();
  });
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  modal.appendChild(actions);
}

// Open modal to add/edit a track
function openTrackModal(category, track) {
  const isNew = track == null;
  const title = isNew ? 'מסלול חדש' : 'עריכת מסלול';
  const { overlay, modal, close } = createModal(title);
  // Input for title
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'כותרת';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = track ? track.title : '';
  titleInput.required = true;
  modal.appendChild(titleLabel);
  modal.appendChild(titleInput);
  // Input for units count
  const unitsLabel = document.createElement('label');
  unitsLabel.textContent = 'מספר יחידות';
  const unitsInput = document.createElement('input');
  unitsInput.type = 'number';
  unitsInput.min = 1;
  unitsInput.value = track ? track.units : 1;
  modal.appendChild(unitsLabel);
  modal.appendChild(unitsInput);
  // Actions
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'button btn-primary';
  saveBtn.textContent = 'שמירה';
  saveBtn.addEventListener('click', () => {
    const newTitle = titleInput.value.trim();
    const units = parseInt(unitsInput.value, 10);
    if (!newTitle || !units || units < 1) {
      alert('אנא הזן כותרת ומספר יחידות תקף');
      return;
    }
    if (isNew) {
      const newId = `${newTitle.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      const newTrack = {
        id: newId,
        title: newTitle,
        units: units,
        completed: new Array(units).fill(false)
      };
      category.tracks.push(newTrack);
    } else {
      // Update track
      track.title = newTitle;
      // If units changed, adjust completed array
      const oldCount = track.units;
      track.units = units;
      if (!Array.isArray(track.completed)) {
        track.completed = new Array(units).fill(false);
      }
      if (units > oldCount) {
        track.completed = track.completed.concat(new Array(units - oldCount).fill(false));
      } else if (units < oldCount) {
        track.completed = track.completed.slice(0, units);
      }
    }
    saveData();
    close();
    renderManage();
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'button btn-secondary';
  cancelBtn.textContent = 'ביטול';
  cancelBtn.addEventListener('click', () => {
    close();
  });
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  modal.appendChild(actions);
}

// Open modal to export JSON
function openExportModal(json) {
  const { overlay, modal, close } = createModal('ייצוא נתונים');
  const textArea = document.createElement('textarea');
  textArea.style.width = '100%';
  textArea.style.height = '10rem';
  textArea.value = json;
  modal.appendChild(textArea);
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'button btn-primary';
  closeBtn.textContent = 'סגור';
  closeBtn.addEventListener('click', () => {
    close();
  });
  actions.appendChild(closeBtn);
  modal.appendChild(actions);
}

// Open modal to import JSON
function openImportModal() {
  const { overlay, modal, close } = createModal('ייבוא נתונים');
  const textArea = document.createElement('textarea');
  textArea.style.width = '100%';
  textArea.style.height = '10rem';
  textArea.placeholder = '{\n  "categories": [...]\n}';
  modal.appendChild(textArea);
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const importBtn = document.createElement('button');
  importBtn.className = 'button btn-primary';
  importBtn.textContent = 'ייבוא';
  importBtn.addEventListener('click', () => {
    try {
      const imported = JSON.parse(textArea.value);
      // Validate basic structure
      if (!imported || !Array.isArray(imported.categories)) {
        alert('פורמט JSON לא תקין');
        return;
      }
      data = imported;
      // Ensure completed arrays exist
      for (const cat of data.categories) {
        for (const tr of cat.tracks) {
          if (!Array.isArray(tr.completed) || tr.completed.length !== tr.units) {
            tr.completed = new Array(tr.units).fill(false);
          }
        }
      }
      saveData();
      close();
      renderManage();
    } catch (e) {
      alert('קובץ JSON לא תקין: ' + e.message);
    }
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'button btn-secondary';
  cancelBtn.textContent = 'ביטול';
  cancelBtn.addEventListener('click', () => {
    close();
  });
  actions.appendChild(importBtn);
  actions.appendChild(cancelBtn);
  modal.appendChild(actions);
}

// Initialise app when DOM is ready
document.addEventListener('DOMContentLoaded', init);