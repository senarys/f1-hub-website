const list = document.getElementById("champions");
const currentYear = new Date().getFullYear();

// API'de standings verisi olmayan yıllar için manuel veri
const historicChampions = {
  1950: { givenName: "Nino", familyName: "Farina", team: "Alfa Romeo" },
  1951: { givenName: "Juan Manuel", familyName: "Fangio", team: "Alfa Romeo" },
  1952: { givenName: "Alberto", familyName: "Ascari", team: "Ferrari" },
  1953: { givenName: "Alberto", familyName: "Ascari", team: "Ferrari" },
  1954: {
    givenName: "Juan Manuel",
    familyName: "Fangio",
    team: "Maserati/Mercedes",
  },
  1955: { givenName: "Juan Manuel", familyName: "Fangio", team: "Mercedes" },
  1956: { givenName: "Juan Manuel", familyName: "Fangio", team: "Ferrari" },
  1957: { givenName: "Juan Manuel", familyName: "Fangio", team: "Maserati" },
  1958: { givenName: "Mike", familyName: "Hawthorn", team: "Ferrari" },
  1959: { givenName: "Jack", familyName: "Brabham", team: "Cooper" },
  1960: { givenName: "Jack", familyName: "Brabham", team: "Cooper" },
  1961: { givenName: "Phil", familyName: "Hill", team: "Ferrari" },
  1962: { givenName: "Graham", familyName: "Hill", team: "BRM" },
  1963: { givenName: "Jim", familyName: "Clark", team: "Lotus" },
  1964: { givenName: "John", familyName: "Surtees", team: "Ferrari" },
  1965: { givenName: "Jim", familyName: "Clark", team: "Lotus" },
  1966: { givenName: "Jack", familyName: "Brabham", team: "Brabham" },
  1967: { givenName: "Denny", familyName: "Hulme", team: "Brabham" },
  1968: { givenName: "Graham", familyName: "Hill", team: "Lotus" },
  1969: { givenName: "Jackie", familyName: "Stewart", team: "Matra" },
  1970: { givenName: "Jochen", familyName: "Rindt", team: "Lotus" },
  1971: { givenName: "Jackie", familyName: "Stewart", team: "Tyrrell" },
  1972: { givenName: "Emerson", familyName: "Fittipaldi", team: "Lotus" },
  1973: { givenName: "Jackie", familyName: "Stewart", team: "Tyrrell" },
  1974: { givenName: "Emerson", familyName: "Fittipaldi", team: "McLaren" },
  1975: { givenName: "Niki", familyName: "Lauda", team: "Ferrari" },
  1976: { givenName: "James", familyName: "Hunt", team: "McLaren" },
  1977: { givenName: "Niki", familyName: "Lauda", team: "Ferrari" },
  1978: { givenName: "Mario", familyName: "Andretti", team: "Lotus" },
};

async function getChampions() {
  list.innerHTML = `<div style="color:#aaa;padding:20px;">⏳ Şampiyonlar yükleniyor...</div>`;

  try {
    const years = [];
    for (let y = currentYear; y >= 1950; y--) years.push(y);

    const BATCH = 10;
    const allChampions = [];

    for (let i = 0; i < years.length; i += BATCH) {
      const batch = years.slice(i, i + BATCH);

      const results = await Promise.all(
        batch.map((year) =>
          fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings/1.json`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ),
      );

      results.forEach((data, idx) => {
        const year = batch[idx];

        // API'den veri geldiyse kullan
        if (data) {
          try {
            const lists = data.MRData.StandingsTable.StandingsLists;
            if (lists && lists.length > 0) {
              const standing = lists[0].DriverStandings[0];
              allChampions.push({
                year,
                driver: standing.Driver,
                constructor: standing.Constructors[0],
                isOngoing: year === currentYear,
              });
              return;
            }
          } catch (e) {
            /* devam et, fallback'e düş */
          }
        }

        // API boş döndüyse manual veriye bak
        const h = historicChampions[year];
        if (h) {
          allChampions.push({
            year,
            driver: { givenName: h.givenName, familyName: h.familyName },
            constructor: { name: h.team },
            isOngoing: false,
          });
        }
        // Ne API'den ne manual'dan veri yoksa o yılı gösterme
      });

      renderCards(allChampions);
    }

    if (allChampions.length === 0) {
      list.innerHTML = `<p style="color:red;">⚠️ Hiç veri alınamadı. Lütfen sayfayı yenileyin.</p>`;
    }
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p style="color:red;">⚠️ Beklenmeyen bir hata oluştu.</p>`;
  }
}

function renderCards(champions) {
  const sorted = [...champions].sort((a, b) => b.year - a.year);
  list.innerHTML = "";

  sorted.forEach(({ year, driver, constructor, isOngoing }) => {
    const card = document.createElement("div");
    card.classList.add("champion-card");

    if (isOngoing) {
      card.innerHTML = `
        <div class="champion-year">🏆 ${year}</div>
        <div class="champion-driver">
          🧑‍✈️ ${driver.givenName} ${driver.familyName}
          <span style="font-size:11px;color:#f90;margin-left:6px;">⏳ Sezon devam ediyor</span>
        </div>
        <div class="champion-team">🔧 ${constructor ? constructor.name : "—"}</div>
      `;
    } else {
      card.innerHTML = `
        <div class="champion-year">🏆 ${year}</div>
        <div class="champion-driver">Sürücü: ${driver.givenName} ${driver.familyName}</div>
        <div class="champion-team">Takım: ${constructor ? constructor.name : "—"}</div>
      `;
    }

    list.appendChild(card);
  });
}

getChampions();
