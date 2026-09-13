# 3D ve görsel asset kaydı

Güncelleme: 13 Eylül 2026 · Durum: çalışan demo varlıkları üretildi. Bu belge mevcut dosyaları ve ölçümleri, gelecekteki final/lite varlık hedeflerinden ayırır.

## Demoda kullanılan kaynaklar

| Varlık | Gerçek kaynak / üretim | Hak ve dağıtım kaydı |
| --- | --- | --- |
| Jet dış gövde + kabin | [jet-geometry.ts](../src/lib/scene/jet-geometry.ts) ve [JetModel.tsx](../src/components/scene/JetModel.tsx); VELAIR için Codex ile yazılmış özgün parametrik geometri ve materyaller | Proje kaynak kodundan üretilir; üçüncü taraf jet modeli, üretici CAD dosyası veya satın alınmış model kullanılmaz. Dağıtılan `.glb` dosyası yoktur. |
| Ortam yansıması | [FlightCanvas.tsx](../src/components/scene/FlightCanvas.tsx), Three.js `0.186.0` içindeki `RoomEnvironment` ve `PMREMGenerator` | Three.js MIT lisanslıdır; telif bildirimi `Copyright © 2010–2026 three.js authors`. Lisans paketin `LICENSE` dosyasındadır. Ortam tarayıcıda üretilir; HDR/EXR indirilmez. |
| Hareketli bulut örtüsü | `FlightCanvas.tsx` içindeki `CloudVeil`: proje için yazılmış noise/fBM fragment shader ve tek düzlem | Proje kaynak kodu; bulut atlası veya harici shader dosyası indirilmez. Scroll geçişini örten katmandır. |
| Gökyüzü arka planı | `public/images/cloud-atmosphere.png`; OpenAI **imagegen**, **12 Eylül 2026**, bu proje için özgün AI üretimi | AI üretimi görsel; kaynak hizmetin çıktı koşulları geçerlidir. Stok fotoğraf lisansı veya CC lisansı atanmamıştır. |
| Altı statik jet karesi | `public/images/jet-{hero,cabin,side}-{desktop,mobile}.png`; aynı jet, materyaller, ışıklar ve WebGL renderer üzerinden PNG export | Projenin kendi prosedürel model renderları; ayrı bir uçak görseli veya fotoğrafı kullanılmaz. |
| Tipografi | Arial/Helvetica ve Georgia/Times New Roman sistem font yığınları | Font binary dağıtılmıyor; `public/fonts/` altında indirilmiş font bulunmuyor. |

Bulut görselinin sanat yönü: yüksek irtifada hacimli beyaz bulutlar, soğuk mavi-gri atmosfer ve tipografi için sakin alan. Arayüz bu görsele CSS renk azaltma ve gökyüzü gradient katmanı uygular; `next/image` responsive servis çıktıları üretir. Arka plan resmi ile WebGL içindeki hareketli bulut örtüsü farklı varlıklardır.

Jet çağdaş bir business jet konseptidir. Herhangi bir gerçek üreticinin birebir geometrisi, teknik performansı, uçuş güvenliği veya sertifikalı kabin yerleşimi iddia edilmez. Kabindeki lounge, dining ve private suite alanları görsel anlatı için tasarlanmıştır.

## Model yapısı ve ölçülmüş bütçe

Eksenler Y-up, burun -Z; ortak pivot orijindedir. Yerel ölçüm sınırları: X `−7.032…7.032`, Y `−0.804…2.625`, Z `−7.100…7.240`. Kanat açıklığı yaklaşık `14.06`, uzunluk `14.34` model birimidir; birimler metre ölçeğinde tasarlanmıştır.

Ana sahne düğümleri korunur:

```text
JetRoot
  AircraftExterior
    FuselageLower / Nose / TailCone
    Wings / WingControlSurfaces / Tail
    Engines / EngineFans / CockpitGlazing
  FuselageUpper
    FuselageUpper / Windows
  CabinInterior
    CabinFloor / CabinWalls / CabinSill
    Seats / Tables / DiningSofa / PrivateSuite
```

Üst gövde ve 18 oval pencere ayrı gruptadır. `reveal.current` değeri her frame mutlak olarak örneklenir: kabuk `1.9` birim yükselir, `.12… .84` aralığında opacity azalır ve `.995` üzerinde grup gizlenir. Alt gövde, burun ve kuyruk kalır. Kabin duvarları, döşeme, kenar profilleri ve mobilyaları aynı modelin içindedir; ters scroll kabuğu aynı yere geri oturtur. Kabin kapalı durumda render edilmez.

Geometri sayımı 13 Eylül 2026 tarihinde `createJetGeometries()` çıktıları üzerinden çalıştırılmıştır. Triangle sayıları non-indexed position attribute uzunluğundan, byte değerleri position/normal/UV typed array boyutlarından ölçülmüştür.

| Geometri grubu | Mesh / materyal grubu | Üçgen | Attribute buffer, byte |
| --- | ---: | ---: | ---: |
| Sabit dış gövde | 19 | 29.580 | 2.839.680 |
| Açılan üst kabuk + pencereler | 3 | 16.436 | 1.577.856 |
| Kabin içi | 25 | 18.796 | 1.804.416 |
| **Toplam oluşturulan** | **47** | **64.812** | **6.221.952** |
| Kapalı görünüm | 22 | 46.016 | — |
| Tam açık görünüm | 44 | 48.376 | — |

Toplam attribute boyutu yaklaşık **5,93 MiB**'dır. Bu değer kaynak JS transferi veya toplam GPU/CPU belleği değildir; renderer, materyal, ortam texture ve olası CPU/GPU kopyalarını içermez. Mesh/materyal grubu sayısı da renderer'ın ölçülmüş draw-call sayısı değildir: görünürlük, shader örtüsü ve render pass'leri gerçek sayıyı değiştirebilir. Geçişte kabuk ve kabin birlikte görünürken tüm 47 model grubu devreye girebilir. Gerçek renderer/viewport ölçümleri `STATUS.md` ve QA kayıtlarına aittir.

Entegratörün 13 Eylül 2026 yerel production kontrolünde renderer ayrıca ölçüldü: kapalı hero **46.016 üçgen / 22 draw call**, açık kabin **48.376 üçgen / 44 draw call**. Bunlar bu iki sabit görünümün sonuçlarıdır; geçiş boyunca maksimum GPU belleği veya FPS ölçümü olarak sunulmaz.

Modelin geometri/materyal üretimi dışında harici model veya yüzey dokusu isteği yoktur. Ahşap damar hissi ince geometri şeritleriyle, deri ve metal ayrımı materyallerle sağlanır. Bu sürümde bağımsız lite geometri bulunmaz.

## Public dosya sicili

Aşağıdaki byte, PNG boyutu ve **tam SHA-256** değerleri 13 Eylül 2026 tarihinde mevcut dosyalardan okunmuştur. Yollar `public/images/` altındadır. Altı fallback PNG'si şeffaf jet renderlarıdır; gökyüzü arka planı ayrıca sunulur.

| Dosya | Boyut, px | Byte | SHA-256 |
| --- | --- | ---: | --- |
| `cloud-atmosphere.png` | 1672 × 941 | 1.577.763 | `0f498ac4266da1f0c10dcc669a11fdfd388205742ed88ba74da05fb1aace36eb` |
| `jet-hero-desktop.png` | 1425 × 900 | 138.537 | `1e7a9f90df1dc8ca44c965676bd233fdeb5e6d06b12da28e5a21531a54cf3c36` |
| `jet-hero-mobile.png` | 375 × 844 | 48.693 | `22b0a487f9963f71d3491595742fd32f213a545730c3b98e4f9e1523402f5e38` |
| `jet-cabin-desktop.png` | 1425 × 900 | 180.426 | `425004495e8a2429204b3521b4ada45114ddc1420e1e3afe63b7a963c4f91c1d` |
| `jet-cabin-mobile.png` | 375 × 844 | 64.259 | `1fd70ab0b12eb2d313ef2a431a35be5b0db69009e00d6e3fe36d60cd6cbb9f2e` |
| `jet-side-desktop.png` | 1440 × 900 | 86.994 | `1daa716a4d8678bf5fa3aa2519dd774f7f793887fb5190f2825849ad8a7e3f18` |
| `jet-side-mobile.png` | 390 × 844 | 32.792 | `12bd32b38de3b70a6171cd72342952b0afed6f228b5d328fbb7eb42c9ee43eda` |

Yedi PNG'nin diskteki toplamı **2.129.464 byte**; yalnızca altı fallback toplamı **551.701 byte**'dır. Bunlar tüm dosyaların toplamıdır; tek sayfa görüntülemesinde transfer edilen veya image optimizer üzerinden gönderilen byte sayısı olarak yorumlanmaz. Desktop/mobile export genişliklerinin farklılığı capture anındaki canvas içerik genişliğinden gelir.

## Gelecekteki final ve lite hedefleri

Aşağıdaki dosyalar **henüz üretilmedi ve runtime'da istenmiyor**. Bunlar ilk plandan korunan sonraki üretim hedefleridir; mevcut prosedürel demonun teslimleri değildir.

| Planlanan varlık | Olası yol | Gelecek bütçe / amaç |
| --- | --- | --- |
| Ana GLB | `public/models/velair-jet-v1.glb` | ≤ 3 MiB; ≤ 150k görünür üçgen; dış + kabin + yan uçuş |
| Bağımsız lite GLB | `public/models/velair-jet-lite-v1.glb` | ≤ 1.5 MiB; ≤ 60k üçgen; düşük GPU için sadeleştirme |
| Bulut atlası | `public/textures/cloud-atlas-v1.webp` | ≤ 400 KiB; shader örtüsü yerine/yanına katmanlı bulut ihtiyacı olursa |
| Özel ortam dosyası | `public/textures/sky-studio-v1.hdr` | ≤ 500 KiB; `RoomEnvironment` sonrasında özel sanat yönü gerekirse |
| Sıkıştırılmış final fallback'ler | Sürümlü WebP/AVIF yolları | Hero/yan kare ≤ 220 KiB, kabin ≤ 250 KiB; mevcut PNG'lerden kalite kontrolüyle türetilecek |
| Lisanslı font dosyaları | `public/fonts/` | Toplam ≤ 160 KiB WOFF2; son tipografi kararı sonrasında |

Sonraki asset işi: prosedürel modelin kadraj ve yüzey cilasını geliştirmek, gerekirse ayrı lite üretmek, PNG/arka plan transferlerini ölçerek optimize etmek ve değişen geometri/ışıkla altı fallback'i yeniden export etmek. GLB üretimine geçilirse üst kabuk ve kabin düğümleri, eksenler, UV/normal yönleri ve kaynak hakları korunacak; yeni dosyaların boyut/hash kayıtları bu sicile eklenecek. Satın alınmış ticari model veya harici final artwork henüz edinilmedi.
