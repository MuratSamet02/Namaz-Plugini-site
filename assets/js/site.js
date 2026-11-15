/* =====================================================================
   DiniSistem — site betiği
   Bağımlılık yok. Tüm özellikler JS kapalıyken de okunabilir kalır.
   ===================================================================== */
(function () {
  "use strict";

  var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ mobil menü */
  var menu = document.getElementById("menu");
  var menuDugme = document.getElementById("menuDugme");
  if (menu && menuDugme) {
    menuDugme.addEventListener("click", function () {
      var acik = menu.classList.toggle("acik");
      menuDugme.setAttribute("aria-expanded", String(acik));
      menuDugme.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("acik");
        menuDugme.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("acik")) {
        menu.classList.remove("acik");
        menuDugme.setAttribute("aria-expanded", "false");
        menuDugme.focus();
      }
    });
  }

  /* ------------------------------------------------------------ yumuşak giriş */
  var izlenecekler = document.querySelectorAll("[data-izle]");
  if ("IntersectionObserver" in window && !azHareket) {
    var gozcu = new IntersectionObserver(function (girisler) {
      girisler.forEach(function (g) {
        if (g.isIntersecting) {
          g.target.classList.add("gorundu");
          gozcu.unobserve(g.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    izlenecekler.forEach(function (el) { gozcu.observe(el); });
  } else {
    izlenecekler.forEach(function (el) { el.classList.add("gorundu"); });
  }

  /* ------------------------------------------------------------ yukarı çık */
  var usteDon = document.getElementById("usteDon");
  if (usteDon) {
    var kaydirmaDurumu = false;
    window.addEventListener("scroll", function () {
      if (kaydirmaDurumu) return;
      kaydirmaDurumu = true;
      window.requestAnimationFrame(function () {
        usteDon.classList.toggle("gorunur", window.scrollY > 600);
        kaydirmaDurumu = false;
      });
    }, { passive: true });
    usteDon.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: azHareket ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------ komut tablosu */
  var KOMUTLAR = [
    { k: "/abdest", a: "Abdest alır", y: "dini.abdest", c: ["oyuncu"] },
    { k: "/namaz [tam|kisa|iptal]", a: "Namaza durur veya iptal eder", y: "dini.namaz", c: ["oyuncu"] },
    { k: "/namaz kisa", a: "Sadece duruşları gösteren kısa mod", y: "dini.namaz", c: ["oyuncu"] },
    { k: "/cuma [iptal]", a: "Cuma çağrısı yapar", y: "dini.cuma", c: ["oyuncu", "yonetim"] },
    { k: "/hutbe [ad]", a: "Haftanın hutbesini kitap olarak açar", y: "dini.hutbe", c: ["oyuncu"] },
    { k: "/dua [kategori|liste]", a: "Kategorilere ayrılmış dualardan gösterir", y: "dini.dua", c: ["oyuncu"] },
    { k: "/tesbih [arac|otomatik|dur|sifirla]", a: "Tesbih: araçla sağ tık, otomatik veya komutla", y: "dini.tesbih", c: ["oyuncu"] },
    { k: "/vakit", a: "Bugünün namaz vakitlerini ve sonraki vakti gösterir", y: "dini.kullan", c: ["oyuncu", "yeni"] },
    { k: "/vakit konum <şehir|enlem boylam>", a: "Vakit ve kıble konumunu ayarlar", y: "dini.admin", c: ["yonetim", "yeni"] },
    { k: "/vakit ezan", a: "Vakit girişinde ezan duyurusunu açar/kapatır", y: "dini.admin", c: ["yonetim", "yeni"] },
    { k: "/kible [kapat]", a: "Kâbe yönüne canlı pusula", y: "dini.kullan", c: ["oyuncu", "yeni"] },
    { k: "/cumabildirim", a: "Cuma çağrısı bildirimini açar/kapatır", y: "dini.kullan", c: ["oyuncu"] },
    { k: "/namazistatistik  (/nistat)", a: "Kıldığın namaz sayılarını gösterir", y: "dini.kullan", c: ["oyuncu"] },
    { k: "/saf arac", a: "İki nokta seçmek için Saf Aracı verir", y: "dini.admin", c: ["yonetim"] },
    { k: "/saf olustur <no> [kişi]", a: "Seçilen iki nokta arasına saf kurar", y: "dini.admin", c: ["yonetim"] },
    { k: "/saf liste | sil | temizle | git", a: "Safları listeler, siler, temizler veya ışınlar", y: "dini.admin", c: ["yonetim"] },
    { k: "/saf onizleme [no]", a: "Saf yerlerini parçacıkla gösterir", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini yardim", a: "Yönetici komutlarının listesi", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini kontrol", a: "Config, dünya ve metin dosyalarını denetler", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini reload", a: "Ayarları ve metinleri yeniler", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini ayar <anahtar> <değer>", a: "Tek satırla ayar değiştirir", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini mihrap", a: "İmamın yeri ve kıble yönünü belirler", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini minber", a: "Hatibin hutbe yerini belirler", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini alanbelirle [yarıçap]", a: "Cami/cemaat bölgesini belirler", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini onizleme [kişi]", a: "Mihrap, minber ve cemaat yerlerini gösterir", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini tani | onar | debug", a: "Tanı, bakımı çalıştırma ve ayrıntılı kayıt", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini cuma | cumaiptal", a: "Cuma çağrısını başlatır veya iptal eder", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini abdest <oyuncu> [al]", a: "Oyuncuya abdest verir veya abdestini alır", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini namaz <oyuncu>", a: "Oyuncuyu namaza kaldırır", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini durdur <oyuncu|hepsi>", a: "Namaz oturumlarını durdurur", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini kible <yön|derece|mihrap>", a: "Kıble yönünü elle ayarlar", y: "dini.admin", c: ["yonetim"] },
    { k: "/dini hutbeler | istatistik <oyuncu>", a: "Hutbe listesi ve oyuncu istatistiği", y: "dini.admin", c: ["yonetim"] }
  ];

  var govde = document.getElementById("komutGovde");
  var arama = document.getElementById("komutAra");
  var bosSonuc = document.getElementById("bosSonuc");
  var sayac = document.getElementById("komutSayaci");
  var filtreDugmeleri = Array.prototype.slice.call(document.querySelectorAll(".filtre"));
  var seciliKategori = "hepsi";

  /** Güvenli metin: HTML enjeksiyonu olmadan hücre oluşturur. */
  function hucre(etiket, icerik, sinif) {
    var td = document.createElement("td");
    td.setAttribute("data-etiket", etiket);
    if (sinif) td.className = sinif;
    if (icerik) {
      var parca = icerik.split(/(\[[^\]]*\]|<[^>]*>)/g);
      parca.forEach(function (p) {
        if (!p) return;
        if (p.startsWith("[") || p.startsWith("<")) {
          var em = document.createElement("span");
          em.className = "soluk";
          em.style.color = "var(--gri-koyu)";
          em.textContent = p;
          td.appendChild(em);
        } else {
          td.appendChild(document.createTextNode(p));
        }
      });
    }
    return td;
  }

  function ciz() {
    if (!govde) return;
    var q = (arama ? arama.value : "").trim().toLocaleLowerCase("tr");
    govde.textContent = "";
    var sayi = 0;

    KOMUTLAR.forEach(function (k) {
      if (seciliKategori !== "hepsi" && k.c.indexOf(seciliKategori) === -1) return;
      var havuz = (k.k + " " + k.a + " " + k.y).toLocaleLowerCase("tr");
      if (q && havuz.indexOf(q) === -1) return;

      var tr = document.createElement("tr");
      var tdKomut = document.createElement("td");
      tdKomut.setAttribute("data-etiket", "Komut");
      var kod = document.createElement("code");
      kod.textContent = k.k;
      tdKomut.appendChild(kod);

      tr.appendChild(tdKomut);
      tr.appendChild(hucre("Açıklama", k.a));
      var tdYetki = document.createElement("td");
      tdYetki.setAttribute("data-etiket", "Yetki");
      var yetki = document.createElement("span");
      yetki.className = "yetki";
      yetki.textContent = k.y;
      tdYetki.appendChild(yetki);
      tr.appendChild(tdYetki);
      govde.appendChild(tr);
      sayi++;
    });

    if (bosSonuc) bosSonuc.classList.toggle("gorunur", sayi === 0);
    if (sayac) {
      sayac.textContent = sayi === 0
        ? "Eşleşen komut yok"
        : sayi + " komut gösteriliyor" + (seciliKategori === "hepsi" ? "" : " · " + seciliKategori);
    }
  }

  if (govde) {
    if (arama) {
      arama.addEventListener("input", ciz);
      // Ctrl/Cmd + K ile aramaya odaklan
      document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          arama.focus();
          arama.select();
        }
      });
    }
    filtreDugmeleri.forEach(function (d) {
      d.addEventListener("click", function () {
        seciliKategori = d.getAttribute("data-kategori");
        filtreDugmeleri.forEach(function (x) {
          x.setAttribute("aria-pressed", String(x === d));
        });
        ciz();
      });
    });
    ciz();
  }

  /* ------------------------------------------------------------ hero terminal demosu */
  var terminal = document.getElementById("terminalGovde");
  if (terminal) {
    var adimlar = [
      { tur: "komut", metin: "/vakit", gecikme: 500 },
      { tur: "cikti", metin: "Namaz Vakitleri · 2026-11-15 · istanbul", sinif: "altin" },
      { tur: "cikti", metin: "İmsak 05:42   Güneş 07:10   Öğle 12:52", sinif: "soluk" },
      { tur: "cikti", metin: "İkindi 15:32   Akşam 17:34   Yatsı 19:00", sinif: "soluk" },
      { tur: "komut", metin: "/abdest", gecikme: 700 },
      { tur: "cikti", metin: "Abdest almaya başladın...", sinif: "altin" },
      { tur: "cikti", metin: "Abdest 1/7 · Eller", sinif: "" },
      { tur: "cikti", metin: "Abdest 2/7 · Ağız", sinif: "" },
      { tur: "cikti", metin: "Abdest 3/7 · Burun", sinif: "" },
      { tur: "cikti", metin: "Abdestin tamamlandı.", sinif: "yesil" },
      { tur: "komut", metin: "/namaz", gecikme: 800 },
      { tur: "cikti", metin: "Namaza durdun. (İptal: /namaz iptal)", sinif: "altin" },
      { tur: "cikti", metin: "Kıyam  |  Allâhü Ekber.", sinif: "" },
      { tur: "cikti", metin: "Kıyam  |  Sübhânekellâhümme ve bi hamdik...", sinif: "soluk" },
      { tur: "cikti", metin: "Rükû   |  Sübhâne rabbiyel-azîm. (3 kez)", sinif: "" },
      { tur: "cikti", metin: "Secde  |  Sübhâne rabbiyel-a'lâ. (3 kez)", sinif: "" },
      { tur: "cikti", metin: "Namazın tamamlandı. Allah kabul etsin.", sinif: "yesil" },
      { tur: "komut", metin: "/kible", gecikme: 900 },
      { tur: "cikti", metin: "Kıble: GÜNEY · ▲ ileride · 2.412 km", sinif: "altin" },
      { tur: "komut", metin: "/dua", gecikme: 1400 }
    ];

    var sira = 0;
    var satirSayisi = 0;
    var AZAMI_SATIR = 9;

    function satirEkle(veri) {
      var satir = document.createElement("div");
      satir.className = "satir";

      var isaret = document.createElement("span");
      isaret.className = "isaret" + (veri.tur === "komut" ? " kullanici" : "");
      isaret.textContent = veri.tur === "komut" ? ">" : "•";
      satir.appendChild(isaret);

      var metin = document.createElement("span");
      metin.className = "metin " + (veri.sinif || "");
      metin.textContent = veri.metin;
      satir.appendChild(metin);

      terminal.appendChild(satir);
      satirSayisi++;
      while (satirSayisi > AZAMI_SATIR && terminal.firstChild) {
        terminal.removeChild(terminal.firstChild);
        satirSayisi--;
      }
    }

    function dongu() {
      if (azHareket) {
        // Hareket azaltma tercihinde tüm demoyu tek seferde göster
        adimlar.forEach(satirEkle);
        return;
      }
      if (sira >= adimlar.length) {
        sira = 0;
        setTimeout(function () {
          terminal.textContent = "";
          satirSayisi = 0;
          dongu();
        }, 2200);
        return;
      }
      var adim = adimlar[sira++];
      satirEkle(adim);
      var bekle = adim.gecikme || (adim.tur === "komut" ? 420 : 380);
      setTimeout(dongu, bekle);
    }

    // Görünür olduğunda başlat: boşa animasyon çalıştırmasın
    if ("IntersectionObserver" in window) {
      var baslatildi = false;
      var terminalGozcu = new IntersectionObserver(function (girisler) {
        girisler.forEach(function (g) {
          if (g.isIntersecting && !baslatildi) {
            baslatildi = true;
            dongu();
            terminalGozcu.disconnect();
          }
        });
      }, { threshold: 0.2 });
      terminalGozcu.observe(terminal);
    } else {
      dongu();
    }
  }

  /* ------------------------------------------------------------ indirme bağlantısı
     Repo adresini tek yerden değiştirmek için: <html data-repo="kullanici/repo"> */
  var repo = document.documentElement.getAttribute("data-repo");
  var baglanti = document.getElementById("indirmeBaglantisi");
  if (repo && baglanti) {
    baglanti.href = "https://github.com/" + repo + "/releases/latest";
  }
})();
