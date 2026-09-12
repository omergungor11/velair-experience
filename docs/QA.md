# QA ve kabul kapıları

Faz 0 kontrolleri ile bitmiş deneyimin testleri ayrı tutulur. Şu anda 3D performans puanı veya tam browser matrisi sonucu yoktur.

## Şimdi otomatik kontrol

`npm run check`: ESLint, Next type generation + TypeScript, Node test runner ile bölüm sürekliliği/sınır testleri, production build. GitHub Actions aynı komutu temiz `npm ci` kurulumundan sonra çalıştırır. Bu testler son 3D deneyimin başarılı olduğu anlamına gelmez.

## Uygulama ilerledikçe

- Pose sampler: boundary, reverse, büyük jump, NaN/overscroll, son kare. Aynı progress aynı output üretir.
- Interaction testleri: chapter link, hotspot aç/kapa, Escape/focus gerekiyorsa geri verme, hareket modu.
- Browser smoke: desktop/mobile, console error ve başarısız asset request, JS kapalı içerik.
- Regression: onaylı `.00`, `.34`, `.48`, `.76`, `.86`, `1.0` kareleri. Screenshot eşiği görsel kararları otomatik onaylamaz.

Playwright/axe gibi araçlar ilk gerçek interaction eklendiğinde kurulacak. Foundation'a çalışan test adı altında boş browser testi konmaz.

## Cihaz matrisi

| Ortam | Minimum viewport | Kritik kontrol |
| --- | --- | --- |
| Chromium desktop | 1440×900 ve 1920×1080 | Ana hikâye, kamera, scroll ve frame süreleri |
| Safari macOS | 1440×900 | Transparan materyal, WebGL, sticky katman |
| Firefox desktop | 1440×900 | Layout, focus, fallback |
| iOS Safari gerçek cihaz | Yaklaşık 390×844 | Touch, adres çubuğu, orientation, GPU |
| Android Chrome orta cihaz | Yaklaşık 360×800 | Lite seçim, ısı/FPS, ağ maliyeti |
| Dar ekran / metin büyütme | 320px genişlik ve %200 metin | Kırpılma, yatay taşma, kontroller |

Browser emülasyonu gerçek cihaz testi olarak raporlanmaz. Gerçek cihaz yoksa bu sütun test edilmedi olarak kalır.

## Senaryolar

1. İlk yükleme: içerik hemen görünür, layout sıçraması yok; poster → canvas aynı kadraj.
2. Hızlı scroll: kullanıcı 0'dan son bölüme atlasa uçak/üst kabuk doğru durumda.
3. Reverse: kabin kapanıp bulut/hero'ya geri dönüşte bir karelik sıçrama yok.
4. Deep reload: sayfanın ortasında yenileme doğru pozdan başlar.
5. Resize/orientation: trigger ölçümleri yenilenir, çift pin/timeline yok.
6. Reduced motion: başlangıçta ve canlı değişimde pin/parallax kapalı, focus korunur.
7. WebGL yok/context loss/model 404: fallback ve metin kullanılabilir; sonsuz loader yok.
8. Klavye: skip link, nav, hotspot, tekrar başla; görsel sıra ile tab sırası tutarlı.
9. Ağ: soğuk cache ve yavaş bağlantı; model indirilirken normal içerik erişimi.
10. Sekme gizleme/geri gelme: render gereksiz çalışmaz, geri dönüş sıçramaz.

## Ölçüm disiplini

Production build üzerinde browser/sürüm, cihaz, viewport, DPR, güç durumu, ağ profili ve cache durumunu kaydet. Aynı scroll rotasını üç kez ölç; medyanı ve frame spike'larını birlikte raporla. Referans laptop/telefon ilk model provasından sonra adıyla seçilir.

Lighthouse laboratuvar sonucu saha INP kanıtı değildir. Web Vitals hedefleri PLAN.md'dedir. Trafik oluştuğunda p75 saha verisi ayrıca değerlendirilebilir. Mevcut asset transferi, görünür triangle, draw call ve GPU doku bütçesi her ağır asset değişiminde tekrar ölçülür.

## Tam ürün Definition of Done

Altı bölüm ve üç imza geçişi çalışıyor; lisans tablosu dolu; mobil ve statik alternatif kullanılabilir; console/hydration/asset hataları yok; build/CI geçiyor; test edilen cihazlarda bütçeler ölçülmüş; kalan sınırlamalar yazılmış; Vercel READY durumunda ve gerçek URL'de akış doğrulanmış. Bu kapı Faz 0 için geçilmiş sayılmaz.
