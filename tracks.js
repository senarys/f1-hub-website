const list = document.getElementById("calendar");
const detail = document.getElementById("trackDetail");

let races = [];

async function loadCalendar() {
  list.innerHTML = `<p style="color:#aaa;"> Takvim yükleniyor...</p>`;

  try {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/2026/races.json");
    if (!res.ok) throw new Error("API hatası");
    const data = await res.json();

    races = data.MRData.RaceTable.Races;
    list.innerHTML = "";

    races.forEach((race, i) => {
      const card = document.createElement("div");
      card.className = "track-card";

      const flagEmoji = countryFlag(race.Circuit.Location.country);

      card.innerHTML = `
        <h3>🏁 ${race.raceName}</h3>
        <p>${flagEmoji} ${race.Circuit.Location.country}</p>
        <p> ${formatDate(race.date)}</p>
        <p style="font-size:11px;color:#aaa;margin-top:6px;">Detay için tıkla →</p>
      `;

      card.onclick = () => showTrack(i);
      list.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p style="color:red;">⚠️ Takvim yüklenemedi. Lütfen sayfayı yenileyin.</p>`;
  }
}

function showTrack(i) {
  const r = races[i];
  const stats = getTrackStats(r.Circuit.circuitId);
  const flagEmoji = countryFlag(r.Circuit.Location.country);

  document.getElementById("modal-content").innerHTML = `
    <h2 style="margin-bottom:12px;">🏁 ${r.Circuit.circuitName}</h2>
    <p> ${r.Circuit.Location.locality}, ${r.Circuit.Location.country} ${flagEmoji}</p>
    <hr style="border-color:#333;margin:12px 0;">
    <p> <strong>Uzunluk:</strong> ${stats.length}</p>
    <p> <strong>Tur sayısı:</strong> ${stats.laps}</p>
    <p> <strong>Toplam mesafe:</strong> ${stats.distance}</p>
    <p> <strong>Tur rekoru:</strong> ${stats.record}</p>
    <p> <strong>Rekor yılı:</strong> ${stats.recordYear}</p>
    <p> <strong>Rekoru tutan:</strong> ${stats.recordHolder}</p>
    <p> <strong>En başarılı pilot:</strong> ${stats.driver}</p>
    <p> <strong>En başarılı takım:</strong> ${stats.team}</p>
    <p> <strong>İlk GP yılı:</strong> ${stats.firstGP}</p>
  `;

  document.getElementById("modal").style.display = "block";
  document.getElementById("modal-overlay").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-overlay").style.display = "none";
}
// ── DETAYLAR VERİTABANI ───────────────────────────────────────────────────────
function getTrackStats(rawId) {
  const id = rawId.toLowerCase().replace(/[-_]/g, "");

  const db = {
    // Klasikler
    monaco: {
      length: "3.337 km",
      laps: 78,
      distance: "260.3 km",
      record: "1:12.909",
      recordYear: 2021,
      recordHolder: "Lewis Hamilton",
      driver: "Ayrton Senna (6)",
      team: "McLaren",
      firstGP: 1950,
    },
    monza: {
      length: "5.793 km",
      laps: 53,
      distance: "306.7 km",
      record: "1:21.046",
      recordYear: 2019,
      recordHolder: "Rubens Barrichello",
      driver: "Michael Schumacher (5)",
      team: "Ferrari",
      firstGP: 1950,
    },
    silverstone: {
      length: "5.891 km",
      laps: 52,
      distance: "306.2 km",
      record: "1:27.097",
      recordYear: 2020,
      recordHolder: "Max Verstappen",
      driver: "Lewis Hamilton (8)",
      team: "Mercedes",
      firstGP: 1950,
    },
    suzuka: {
      length: "5.807 km",
      laps: 53,
      distance: "307.6 km",
      record: "1:30.983",
      recordYear: 2023,
      recordHolder: "Lewis Hamilton",
      driver: "Michael Schumacher (6)",
      team: "Ferrari",
      firstGP: 1987,
    },
    spa: {
      length: "7.004 km",
      laps: 44,
      distance: "308.1 km",
      record: "1:46.286",
      recordYear: 2018,
      recordHolder: "Valtteri Bottas",
      driver: "Michael Schumacher (6)",
      team: "Ferrari",
      firstGP: 1950,
    },
    // Amerika kıtası
    interlagos: {
      length: "4.309 km",
      laps: 71,
      distance: "305.9 km",
      record: "1:10.540",
      recordYear: 2018,
      recordHolder: "Valtteri Bottas",
      driver: "Michael Schumacher (4)",
      team: "Williams",
      firstGP: 1973,
    },
    americas: {
      length: "5.513 km",
      laps: 56,
      distance: "308.4 km",
      record: "1:36.169",
      recordYear: 2019,
      recordHolder: "Charles Leclerc",
      driver: "Lewis Hamilton (6)",
      team: "Mercedes",
      firstGP: 2012,
    },
    miami: {
      length: "5.412 km",
      laps: 57,
      distance: "308.3 km",
      record: "1:29.708",
      recordYear: 2023,
      recordHolder: "Max Verstappen",
      driver: "Max Verstappen (3)",
      team: "Red Bull",
      firstGP: 2022,
    },
    vegas: {
      length: "6.201 km",
      laps: 50,
      distance: "310.1 km",
      record: "1:35.490",
      recordYear: 2023,
      recordHolder: "Oscar Piastri",
      driver: "Max Verstappen (2)",
      team: "Red Bull",
      firstGP: 2023,
    },
    // Orta Doğu

    losail: {
      length: "5.419 km",
      laps: 57,
      distance: "308.7 km",
      record: "1:24.319",
      recordYear: 2023,
      recordHolder: "Lando Norris",
      driver: "Max Verstappen (2)",
      team: "Red Bull",
      firstGP: 2021,
    },
    bahrain: {
      length: "5.412 km",
      laps: 57,
      distance: "308.2 km",
      record: "1:31.447",
      recordYear: 2020,
      recordHolder: "Pedro de la Rosa",
      driver: "Lewis Hamilton (5)",
      team: "Mercedes",
      firstGP: 2004,
    },
    jeddah: {
      length: "6.174 km",
      laps: 50,
      distance: "308.5 km",
      record: "1:30.734",
      recordYear: 2021,
      recordHolder: "Lewis Hamilton",
      driver: "Max Verstappen (4)",
      team: "Red Bull",
      firstGP: 2021,
    },
    abudhabi: {
      length: "5.281 km",
      laps: 58,
      distance: "306.2 km",
      record: "1:26.103",
      recordYear: 2021,
      recordHolder: "Max Verstappen",
      driver: "Lewis Hamilton (5)",
      team: "Mercedes",
      firstGP: 2009,
    },
    // Asya
    singapore: {
      length: "4.940 km",
      laps: 62,
      distance: "306.1 km",
      record: "1:35.867",
      recordYear: 2023,
      recordHolder: "Lewis Hamilton",
      driver: "Sebastian Vettel (5)",
      team: "Red Bull",
      firstGP: 2008,
    },
    shanghai: {
      length: "5.451 km",
      laps: 56,
      distance: "305.3 km",
      record: "1:32.238",
      recordYear: 2004,
      recordHolder: "Michael Schumacher",
      driver: "Lewis Hamilton (6)",
      team: "Ferrari",
      firstGP: 2004,
    },
    baku: {
      length: "6.003 km",
      laps: 51,
      distance: "306.0 km",
      record: "1:43.009",
      recordYear: 2019,
      recordHolder: "Charles Leclerc",
      driver: "Sergio Pérez (3)",
      team: "Red Bull",
      firstGP: 2016,
    },
    // Avrupa (diğer)
    madring: {
      length: "5.470 km",
      laps: 58,
      distance: "317.3 km",
      record: "—",
      recordYear: "—",
      recordHolder: "—",
      driver: "Yeni pist",
      team: "—",
      firstGP: 2026,
    },

    catalunya: {
      length: "4.657 km",
      laps: 66,
      distance: "307.2 km",
      record: "1:16.330",
      recordYear: 2023,
      recordHolder: "Max Verstappen",
      driver: "Michael Schumacher (6)",
      team: "Ferrari",
      firstGP: 1991,
    },

    redbullring: {
      length: "4.318 km",
      laps: 71,
      distance: "324.7 km",
      record: "1:05.619",
      recordYear: 2020,
      recordHolder: "Carlos Sainz",
      driver: "Max Verstappen (4)",
      team: "Mercedes",
      firstGP: 1970,
    },

    hungaroring: {
      length: "4.381 km",
      laps: 70,
      distance: "306.6 km",
      record: "1:16.627",
      recordYear: 2020,
      recordHolder: "Lewis Hamilton",
      driver: "Lewis Hamilton (8)",
      team: "Mercedes",
      firstGP: 1986,
    },
    zandvoort: {
      length: "4.259 km",
      laps: 72,
      distance: "306.6 km",
      record: "1:11.097",
      recordYear: 2021,
      recordHolder: "Max Verstappen",
      driver: "Max Verstappen (3)",
      team: "Red Bull",
      firstGP: 1952,
    },
    barcelona: {
      length: "4.657 km",
      laps: 66,
      distance: "307.2 km",
      record: "1:18.149",
      recordYear: 2021,
      recordHolder: "Max Verstappen",
      driver: "Michael Schumacher (6)",
      team: "Ferrari",
      firstGP: 1991,
    },
    imola: {
      length: "4.909 km",
      laps: 63,
      distance: "309.0 km",
      record: "1:15.484",
      recordYear: 2020,
      recordHolder: "Valtteri Bottas",
      driver: "Michael Schumacher (7)",
      team: "Ferrari",
      firstGP: 1980,
    },
    mugello: {
      length: "5.245 km",
      laps: 59,
      distance: "309.5 km",
      record: "1:17.939",
      recordYear: 2020,
      recordHolder: "Lewis Hamilton",
      driver: "Lewis Hamilton (1)",
      team: "Mercedes",
      firstGP: 2020,
    },
    // Avustralya / Diğer
    albert_park: {
      length: "5.278 km",
      laps: 58,
      distance: "306.1 km",
      record: "1:20.235",
      recordYear: 2023,
      recordHolder: "Max Verstappen",
      driver: "Michael Schumacher (4)",
      team: "Ferrari",
      firstGP: 1996,
    },
    // Japonya / Kore
    yeongam: {
      length: "5.615 km",
      laps: 55,
      distance: "308.6 km",
      record: "1:39.605",
      recordYear: 2011,
      recordHolder: "Jenson Button",
      driver: "Sebastian Vettel (4)",
      team: "Red Bull",
      firstGP: 2010,
    },
    // Kanada
    villeneuve: {
      length: "4.361 km",
      laps: 70,
      distance: "305.3 km",
      record: "1:13.078",
      recordYear: 2019,
      recordHolder: "Valtteri Bottas",
      driver: "Michael Schumacher (7)",
      team: "Ferrari",
      firstGP: 1978,
    },
    // Meksika
    rodriguez: {
      length: "4.304 km",
      laps: 71,
      distance: "305.4 km",
      record: "1:17.774",
      recordYear: 2021,
      recordHolder: "Valtteri Bottas",
      driver: "Ayrton Senna (3)",
      team: "Williams",
      firstGP: 1963,
    },
    // Japonya
    fuji: {
      length: "4.563 km",
      laps: 67,
      distance: "305.7 km",
      record: "1:18.426",
      recordYear: 2008,
      recordHolder: "Lewis Hamilton",
      driver: "Lewis Hamilton (2)",
      team: "McLaren",
      firstGP: 1976,
    },
  };

  // Normalizasyon
  const aliases = {
    albertpark: "albert_park",
    catalunyaspain: "barcelona",
    spain: "barcelona",
    spafrancorchamps: "spa",
    bahrainintl: "bahrain",
    yasmarina: "abudhabi",
    marinabay: "singapore",
    brazil: "interlagos",
    saopaulo: "interlagos",
    circuitoftheamericas: "americas",
    miamigrandprix: "miami",
    circuitmontecarlo: "monaco",
    autodromomonza: "monza",
    autodromo: "imola",
    hungaroring: "hungaroring",
    circuitdebarcelona: "barcelona",
    grandprixcircuit: "silverstone",

    // 2026'ya özel yeni pistler için fallback
    losangeles: "americas",
    madrid: "barcelona",
  };

  const normalized = aliases[id] || id;
  return (
    db[normalized] || {
      length: "Veri mevcut değil",
      laps: "—",
      distance: "—",
      record: "—",
      recordYear: "—",
      recordHolder: "—",
      driver: "Bilinmiyor",
      team: "Bilinmiyor",
      firstGP: "—",
    }
  );
}

//  YARDIMCI FONKSİYONLAR
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function countryFlag(country) {
  const flags = {
    Australia: "🇦🇺",
    Bahrain: "🇧🇭",
    "Saudi Arabia": "🇸🇦",
    Japan: "🇯🇵",
    China: "🇨🇳",
    USA: "🇺🇸",
    "United States": "🇺🇸",
    Italy: "🇮🇹",
    Monaco: "🇲🇨",
    Spain: "🇪🇸",
    Canada: "🇨🇦",
    Austria: "🇦🇹",
    UK: "🇬🇧",
    "United Kingdom": "🇬🇧",
    Hungary: "🇭🇺",
    Belgium: "🇧🇪",
    Netherlands: "🇳🇱",
    Azerbaijan: "🇦🇿",
    Singapore: "🇸🇬",
    Mexico: "🇲🇽",
    Brazil: "🇧🇷",
    "Las Vegas": "🇺🇸",
    Qatar: "🇶🇦",
    "Abu Dhabi": "🇦🇪",
    UAE: "🇦🇪",
  };
  return flags[country] || "🌍";
}

loadCalendar();
