
const $ = (selector) => document.querySelector(selector);

const chapters = [...document.querySelectorAll(".chapter")];
const portal = $("#portal");

const homeButton = $("#homeButton");
const chapterCounter = $("#chapterCounter");
const signalStatus = $("#signalStatus");
const koordinat = $("#koordinat");

let sedangBerpindah = false;
const petunjukTerbuka = new Set();

const infoBab = {
  bab1: {
    nomor: "PROLOG",
    status: "COORDINATES: UNRESOLVED",
    koordinat: "A universe waiting to be found."
  },
  bab2: {
    nomor: "CHAPTER I · FIRE",
    status: "COORDINATES: CINDER REACH",
    koordinat: "Some stars burn to guide the way."
  },
  bab3: {
    nomor: "CHAPTER II · WATER",
    status: "COORDINATES: NERISSA DEEP",
    koordinat: "Even the quietest ocean remembers."
  },
  bab4: {
    nomor: "CHAPTER III · LEAF",
    status: "COORDINATES: VIRIDIA WILDS",
    koordinat: "Something grows where light reaches."
  },
  bab5: {
    nomor: "CHAPTER IV · THE GATE",
    status: "COORDINATES: OUTSIDE THE MAP",
    koordinat: "Three elements. One hidden destination."
  },
  bab6: {
    nomor: "CHAPTER V · THE LETTER",
    status: "COORDINATES: NEBULA ARCHIVE",
    koordinat: "The clues were never separate."
  },
  bab7: {
    nomor: "CHAPTER VI · REVELATION",
    status: "COORDINATES: THE LAST QUESTION",
    koordinat: "One final answer remains."
  },
  bab8: {
    nomor: "CHAPTER VII · BIRTHDAY",
    status: "COORDINATES: A DAY THAT MATTERS",
    koordinat: "You have reached the end of this universe."
  }
};

// Pasang gambar latar setiap bab.
function pasangLatar() {
  chapters.forEach((bab) => {
    const namaGambar = bab.dataset.image;

    if (namaGambar) {
      
bab.style.setProperty(
  "--bg-image",
  `url("${namaGambar}")`
);

    }
  });
}

// Membuat bintang kecil di halaman.
function buatBintang(jumlah = 100) {
  const wadah = $("#stars");

  if (!wadah) return;

  wadah.replaceChildren();

  for (let i = 0; i < jumlah; i++) {
    const bintang = document.createElement("span");

    bintang.className = "star";
    bintang.style.left = `${Math.random() * 100}%`;
    bintang.style.top = `${Math.random() * 100}%`;
    bintang.style.setProperty(
      "--delay",
      `${Math.random() * 5}s`
    );
    bintang.style.setProperty(
      "--duration",
      `${2 + Math.random() * 4}s`
    );

    wadah.appendChild(bintang);
  }
}

function perbaruiInfo(idBab) {
  const info = infoBab[idBab];

  if (!info) return;

  if (chapterCounter) {
    chapterCounter.textContent = info.nomor;
  }

  if (signalStatus) {
    signalStatus.textContent = info.status;
  }

  if (koordinat) {
    koordinat.textContent = info.koordinat;
  }
}

function tunggu(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Berpindah bab dengan animasi portal.
async function pindahKe(idBab) {
  const tujuan = document.getElementById(idBab);

  if (!tujuan || sedangBerpindah) return;

  sedangBerpindah = true;

  if (portal) {
    portal.classList.remove("open");
    void portal.offsetWidth;
    portal.classList.add("open");
  }

  await tunggu(1350);

  chapters.forEach((bab) => {
    bab.hidden = bab.id !== idBab;
  });

  perbaruiInfo(idBab);

  if (portal) {
    portal.classList.remove("open");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  sedangBerpindah = false;
}

// Tombol untuk memulai perjalanan.
$("#mulai")?.addEventListener("click", () => {
  pindahKe("bab2");
});

// Semua tombol lanjut menuju bab yang ditentukan di HTML.
document.querySelectorAll(".lanjut").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    const tujuan = tombol.dataset.next;

    if (tujuan) {
      pindahKe(tujuan);
    }
  });
});

// Tombol beranda kembali ke awal.
homeButton?.addEventListener("click", () => {
  pindahKe("bab1");
});

// Gerbang hanya terbuka setelah tombol ditekan.
$("#bukaGerbang")?.addEventListener("click", async (event) => {
  const tombol = event.currentTarget;
  const pesan = $("#pesanGerbang");

  tombol.disabled = true;

  if (pesan) {
    pesan.textContent =
      "The gate recognizes the three elements. The archive is opening...";
  }

  await tunggu(900);
  await pindahKe("bab6");

  tombol.disabled = false;
});

// Setiap petunjuk yang dibuka akan dihitung.
document.querySelectorAll(".clue").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    const nomor = tombol.dataset.clue;
    const isiPetunjuk = document.getElementById(`clue${nomor}`);

    if (!isiPetunjuk) return;

    const sedangTerbuka = !isiPetunjuk.hidden;
    isiPetunjuk.hidden = sedangTerbuka;

    if (sedangTerbuka) {
      petunjukTerbuka.delete(nomor);
      tombol.setAttribute("aria-expanded", "false");
    } else {
      petunjukTerbuka.add(nomor);
      tombol.setAttribute("aria-expanded", "true");
    }

    tombol.classList.toggle("discovered", !sedangTerbuka);

    const tombolLanjut = $("#keBab7");

    if (tombolLanjut) {
      tombolLanjut.disabled = petunjukTerbuka.size < 3;
    }

    if (signalStatus) {
      signalStatus.textContent =
        `CLUES DECODED: ${petunjukTerbuka.size}/3`;
    }
  });
});

// Pastikan tombol ke bab berikutnya terkunci pada awalnya.
const tombolKeBab7 = $("#keBab7");

if (tombolKeBab7) {
  tombolKeBab7.disabled = true;

  tombolKeBab7.addEventListener("click", () => {
    if (petunjukTerbuka.size === 3) {
      pindahKe("bab7");
    }
  });
}

// Teka-teki terakhir.
$("#formJawaban")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputJawaban = $("#jawaban");
  const hasil = $("#hasilJawaban");

  if (!inputJawaban || !hasil) return;

  const jawaban = inputJawaban.value
    .trim()
    .toLowerCase()
    .replace(/[.!?]/g, "");

  const jawabanBenar = [
    "waktu",
    "perjalanan"
  ];

  if (jawabanBenar.includes(jawaban)) {
    hasil.textContent =
      "Signal accepted. The final destination is no longer hidden.";

    hasil.classList.add("correct");

    setTimeout(() => {
      pindahKe("bab8");
    }, 1200);
  } else if (jawaban === "cahaya") {
    hasil.textContent =
      "Close, but not quite. Think about what makes every memory a journey.";
    hasil.classList.remove("correct");
  } else {
    hasil.textContent =
      "The universe is still quiet. Look back at the three clues and try again.";
    hasil.classList.remove("correct");
  }
});

// Membuka ucapan ulang tahun.
$("#bukaUcapan")?.addEventListener("click", () => {
  const ucapan = $("#ucapan");

  if (!ucapan) return;

  ucapan.hidden = false;

  $("#bukaUcapan").textContent = "THE MESSAGE IS REVEALED";

  ucapan.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

// Mengulang perjalanan dari awal.
$("#ulangDariAwal")?.addEventListener("click", () => {
  petunjukTerbuka.clear();

  document.querySelectorAll(".clue").forEach((tombol) => {
    tombol.classList.remove("discovered");
    tombol.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll('[id^="clue"]').forEach((isi) => {
    isi.hidden = true;
  });

  const tombolLanjut = $("#keBab7");

  if (tombolLanjut) {
    tombolLanjut.disabled = true;
  }

  const inputJawaban = $("#jawaban");
  const hasil = $("#hasilJawaban");

  if (inputJawaban) inputJawaban.value = "";

  if (hasil) {
    hasil.textContent = "";
    hasil.classList.remove("correct");
  }

  const ucapan = $("#ucapan");

  if (ucapan) {
    ucapan.hidden = true;
  }

  const tombolUcapan = $("#bukaUcapan");

  if (tombolUcapan) {
    tombolUcapan.textContent = "REVEAL THE MESSAGE";
  }

  const pesanGerbang = $("#pesanGerbang");

  if (pesanGerbang) {
    pesanGerbang.textContent = "";
  }

  pindahKe("bab1");
});

// Jalankan semuanya saat halaman selesai dimuat.
pasangLatar();
buatBintang();

perbaruiInfo(
  chapters.find((bab) => !bab.hidden)?.id || "bab1"
);
