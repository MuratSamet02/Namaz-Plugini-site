# DiniSistem — tanıtım sitesi

`https://muratsamet02.github.io/Namaz-Plugini-site/` adresinde yayınlanan statik tanıtım sitesi.

- Bağımlılık yok: HTML + CSS + JS, derleme adımı yok.
- `main` dalına her push'ta GitHub Actions siteyi GitHub Pages'e yayınlar
  (`.github/workflows/pages.yml`).
- Eklentinin kaynak kodu ayrı ve **özel** repodadır; bu repoda yalnızca site ve
  indirilebilir JAR bulunur.

## Yerelde önizleme

```bash
python -m http.server 8899
```

Sonra `http://127.0.0.1:8899/` adresini aç.

## İçerik güncelleme

| Dosya | Ne var |
|---|---|
| `index.html` | Sayfa içeriği, komut tablosu verisi `assets/js/site.js` içinde |
| `assets/css/stil.css` | Koyu yeşil + altın tema |
| `assets/js/site.js` | Komut arama/süzme, mobil menü, terminal demosu |
| `indir/` | İndirilebilir eklenti JAR'ı |

Yeni sürüm yayınlarken `indir/` içindeki JAR'ı güncelle ve `index.html` içindeki
sürüm numaralarını (marka rozeti, indirme kutusu, sürüm notları) değiştir.
