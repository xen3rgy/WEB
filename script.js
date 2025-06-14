let lieferanten = [
  { id: 1, name: "Fam. Lassnig", aktiv: true },
  { id: 2, name: "Bauernhof Knafl", aktiv: true },
  { id: 3, name: "Bio Hof Steiner", aktiv: false },
];

let produkte = [
  {
    id: 101,
    name: "Speckware",
    preis: 3.1,
    bestand: 15,
    verkauf: 42,
    seitInventur: 21,
    letzterVerkauf: "2025-06-09 09:07",
    lieferant: "Fam. Lassnig",
  },
  {
    id: 102,
    name: "Streichwurst",
    preis: 2.6,
    bestand: 8,
    verkauf: 21,
    seitInventur: 10,
    letzterVerkauf: "2025-06-10 12:05",
    lieferant: "Fam. Lassnig",
  },
  {
    id: 103,
    name: "Zirbenansatz",
    preis: 4.5,
    bestand: 5,
    verkauf: 3,
    seitInventur: 1,
    letzterVerkauf: "2025-06-08 14:22",
    lieferant: "Bauernhof Knafl",
  },
];

function loadData() {
  const lsL = localStorage.getItem("lieferanten");
  const lsP = localStorage.getItem("produkte");
  if (lsL) lieferanten = JSON.parse(lsL);
  if (lsP) produkte = JSON.parse(lsP);
}

function saveData() {
  localStorage.setItem("lieferanten", JSON.stringify(lieferanten));
  localStorage.setItem("produkte", JSON.stringify(produkte));
}

loadData();

// --- Produktverwaltung ---
function initProdukte() {
  const lieferantenSelect = document.getElementById("produkt-lieferant");
  const produktSelect = document.getElementById("produkt-auswahl");
  lieferantenSelect.innerHTML = "";
  produktSelect.innerHTML = "";
  lieferanten.forEach((l) => {
    let opt = document.createElement("option");
    opt.value = l.name;
    opt.textContent = l.name;
    lieferantenSelect.appendChild(opt);
  });

  lieferantenSelect.addEventListener("change", () => {
    const selected = lieferantenSelect.value;
    produktSelect.innerHTML = "";
    produkte
      .filter((p) => p.lieferant === selected)
      .forEach((p) => {
        let opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        produktSelect.appendChild(opt);
      });
    produktSelect.dispatchEvent(new Event("change"));
  });

  produktSelect.addEventListener("change", updateProduktInfo);
  lieferantenSelect.dispatchEvent(new Event("change"));
}

function updateProduktInfo() {
  const produktID = document.getElementById("produkt-auswahl").value;
  const produkt = produkte.find((p) => p.id == produktID);
  if (!produkt) return;
  document.getElementById("preis").value = produkt.preis.toFixed(2) + " €";
  document.getElementById("bestand").value = produkt.bestand + " Stk";
  document.getElementById("verkauft").value = produkt.verkauf;
  document.getElementById("umsatz").value =
    (produkt.verkauf * produkt.preis).toFixed(2) + " €";
  document.getElementById("verkauf-seit").value =
    produkt.seitInventur ?? Math.floor(produkt.verkauf / 2);
  document.getElementById("letzter-verkauf").value = produkt.letzterVerkauf;
  const editName = document.getElementById("edit-name");
  const editPreis = document.getElementById("edit-preis");
  const editBestand = document.getElementById("edit-bestand");
  const editVerkauft = document.getElementById("edit-verkauft");
  const editSeit = document.getElementById("edit-seitInventur");
  const editLetzter = document.getElementById("edit-letzter-verkauf");
  if (editName && editPreis) {
    editName.value = produkt.name;
    editPreis.value = produkt.preis;
    if (editBestand) editBestand.value = produkt.bestand;
    if (editVerkauft) editVerkauft.value = produkt.verkauf;
    if (editSeit)
      editSeit.value = produkt.seitInventur ?? Math.floor(produkt.verkauf / 2);
    if (editLetzter) editLetzter.value = produkt.letzterVerkauf;
  }
}

function loescheProdukt() {
  const id = document.getElementById("produkt-auswahl").value;
  if (!id) return;
  if (confirm("Produkt wirklich löschen?")) {
    produkte = produkte.filter((p) => p.id != id);
    saveData();
    initProdukte();
    ladeInventurTabelle();
  }
}

function neuesProdukt() {
  const id = getNextId(produkte);
  const name = document.getElementById("neu-name").value;
  const preis = parseFloat(document.getElementById("neu-preis").value);
  const lieferant = document.getElementById("produkt-lieferant").value;
  if (!name || isNaN(preis)) return alert("Bitte gültige Eingaben machen.");
  produkte.push({
    id,
    name,
    preis,
    bestand: 0,
    verkauf: 0,
    seitInventur: 0,
    letzterVerkauf: "-",
    lieferant,
  });
  saveData();
  initProdukte();
  ladeInventurTabelle();
  document.getElementById("neu-name").value = "";
  document.getElementById("neu-preis").value = "";
}

function bearbeiteProdukt() {
  const id = document.getElementById("produkt-auswahl").value;
  const name = document.getElementById("edit-name").value;
  const preis = parseFloat(document.getElementById("edit-preis").value);
  const bestand = parseInt(document.getElementById("edit-bestand").value);
  const verkauft = parseInt(document.getElementById("edit-verkauft").value);
  const seitInv = parseInt(document.getElementById("edit-seitInventur").value);
  const letzter = document.getElementById("edit-letzter-verkauf").value;
  const produkt = produkte.find((p) => p.id == id);
  if (produkt && name && !isNaN(preis)) {
    produkt.name = name;
    produkt.preis = preis;
    if (!isNaN(bestand)) produkt.bestand = bestand;
    if (!isNaN(verkauft)) produkt.verkauf = verkauft;
    if (!isNaN(seitInv)) produkt.seitInventur = seitInv;
    if (letzter) produkt.letzterVerkauf = letzter;
    saveData();
    initProdukte();
    ladeInventurTabelle();
  } else {
    alert("Bitte gültige Eingaben machen.");
  }
}

// --- Lieferantenverwaltung ---
function initLieferanten() {
  const select = document.getElementById("lieferant-auswahl");
  select.innerHTML = "";
  lieferanten.forEach((l) => {
    let opt = document.createElement("option");
    opt.value = l.name;
    opt.textContent = l.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", updateLieferantInfo);
  select.dispatchEvent(new Event("change"));
}

function updateLieferantInfo() {
  const name = document.getElementById("lieferant-auswahl").value;
  const lieferant = lieferanten.find((l) => l.name === name);
  if (!lieferant) return;
  const zugeordnet = produkte.filter((p) => p.lieferant === name);
  document.getElementById("lieferant-id").value = lieferant.id;
  document.getElementById("lieferant-status").value = lieferant.aktiv
    ? "Aktiv"
    : "Inaktiv";
  document.getElementById("lieferant-produkte").value = zugeordnet.length;
  document.getElementById("lieferant-bestand").value = zugeordnet.reduce(
    (sum, p) => sum + p.bestand,
    0,
  );
  document.getElementById("lieferant-umsatz").value =
    zugeordnet.reduce((sum, p) => sum + p.preis * p.verkauf, 0).toFixed(2) +
    " €";
  const edit = document.getElementById("edit-lieferant-name");
  if (edit) edit.value = lieferant.name;
}

function toggleLieferantStatus() {
  const name = document.getElementById("lieferant-auswahl").value;
  const lieferant = lieferanten.find((l) => l.name === name);
  if (lieferant) {
    lieferant.aktiv = !lieferant.aktiv;
    updateLieferantInfo();
    saveData();
  }
}

function getNextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function neuerLieferant() {
  const id = getNextId(lieferanten);
  const name = document.getElementById("neu-lieferant-name").value;
  const pw = document.getElementById("neu-lieferant-pw").value;
  if (!name || !pw) return alert("Bitte gültige Eingaben machen.");
  lieferanten.push({ id, name, aktiv: true });
  saveData();
  initLieferanten();
  document.getElementById("neu-lieferant-name").value = "";
  document.getElementById("neu-lieferant-pw").value = "";
}

function bearbeiteLieferant() {
  const name = document.getElementById("lieferant-auswahl").value;
  const neuName = document.getElementById("edit-lieferant-name").value;
  const lieferant = lieferanten.find((l) => l.name === name);
  if (lieferant && neuName) {
    lieferant.name = neuName;
    produkte.forEach((p) => {
      if (p.lieferant === name) p.lieferant = neuName;
    });
    saveData();
    initLieferanten();
    if (document.getElementById("produkt-lieferant")) initProdukte();
  }
}

function loescheLieferant() {
  const name = document.getElementById("lieferant-auswahl").value;
  if (!name) return;
  if (
    confirm(
      "Lieferant wirklich löschen? Alle zugehörigen Produkte werden entfernt.",
    )
  ) {
    lieferanten = lieferanten.filter((l) => l.name !== name);
    produkte = produkte.filter((p) => p.lieferant !== name);
    saveData();
    initLieferanten();
    if (document.getElementById("produkt-lieferant")) initProdukte();
    ladeInventurTabelle();
  }
}

// --- Inventur dynamisch ---
function ladeInventurTabelle() {
  const tbody = document.getElementById("inventur-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  produkte.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.name}</td><td>${p.bestand}</td>`;
    tbody.appendChild(row);
  });
}
