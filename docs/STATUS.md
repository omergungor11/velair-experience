# Durum kaydı

Tarih: 14 Eylül 2026 · 3D demo Vercel production ortamında READY.

Canlı demo: **https://velair-experience.vercel.app**

## Uygulanan deneyim

Altı bölümlü VELAIR sayfasında tepeden jet, shader bulut geçişi, yükselip kaybolan üst kabuk ve görünür kabin, üç klavye ile seçilebilir kabin açıklaması, kapanan gövde ve panel arkasından yatay uçuş, ufka uzaklaşma ve tekrar keşfet bağlantısı çalışır.

Uçak özgün prosedürel geometridir. İç/dış görünüm aynı modelin parçalarıdır. Semantik HTML server tarafında üretilir; WebGL ayrı client chunk'ta yüklenir. Tek GSAP progress değeri kamera/jet/bulutları besler. Demand renderer scroll sırasında invalidate edilir; boşta sürekli animasyon yoktur.

Hareketi azalt düğmesi ve OS tercihi normal dikey statik anlatıya geçer. Hero, kabin ve yan uçuş için aynı renderer'dan alınan desktop/mobil posterler bulunur. WebGL desteği yokluğu ve context loss aynı alternatifi açar. Mod değişimi mevcut bölüme döner; tekrar açılışta kamera mevcut scroll ile eşitlenir.

## Doğrulama kanıtı

| Kontrol | 13–14 Eylül sonucu |
| --- | --- |
| `npm run check` | Geçti: ESLint, TypeScript, 11 test, production build |
| Saf motion testleri | Bölüm sınırları, overscroll/NaN, forward/reverse/jump, süreklilik, kabuk kapanmadan dönmeme, mobil viewport uyumu; 11/11 |
| Yerel production server | Next start, 127.0.0.1:3418; hero ve açık kabin render edildi |
| Chrome desktop 1440×900 | Hero, bulut, cutaway, yatay uçuş giriş/çıkış ve son bölüm görsel kontrolü |
| Chrome 390×844 / 320×800 | Mobil hero/kabin kadrajları; yatay taşma yok |
| Hareket tercihi | Canlı OS aç/kapat ve düğme ile statik/3D geçişi; mevcut bölüm korunuyor |
| WebGL desteği yok | Test init script'i webgl context döndürmüyor; canvas yok, poster ve 6 başlık hazır, Still experience kontrolü |
| Context loss | WEBGL_lose_context ile zorlandı; canvas kaldırıldı, statik mod ve mevcut bölüm korundu |
| Klavye | İlk Tab skip link; kabin butonuna focus+Enter açıklamayı değiştirdi |
| Geri scroll / replay | Açık kabinden clouds'a geri örnekleme; sona gidip tekrar başa dönüş kontrolü |
| Console / page error | Canlı sitede page error veya console.error yok; Three.Clock kullanım dışı uyarısı ve canvas temizliğinde Context Lost bilgi logu görüldü |
| Görsel boyut/hak kaydı | public/images için kaynak, byte ve SHA-256 ASSETS.md içinde |

Tarayıcı testleri agent-browser ile Chrome üzerinde yapıldı. Mobil boyutlar emülasyondur; gerçek iOS/Android ve Safari testi yapılmadı. Bu kayıt FPS, Lighthouse veya saha Web Vitals başarısı iddia etmez. Ana render'da kapalı hero 46.016 triangle / 22 draw call; açık kabin 48.376 / 44 ölçüldü. Bunlar tüm akışın en yüksek değerleri veya mobil FPS ölçümü değildir. `?capture=1` yalnız QA için canvas progress/reveal/render sayaçlarını ve buffer capture'ı açar; normal ziyaretçide preserveDrawingBuffer kapalıdır.

Yerel kanıt görselleri ignored `.artifacts/` altında tutulur. Raw QA kayıtları ve `.vercel/` Git'e girmez.

## GitHub ve yayın

- Private repository: https://github.com/omergungor11/velair-experience ; ana dal main.
- Faz 0 ilk commit: `4b93f76c0188a87dcb231d7ed752511e404fb79d`; [ilk CI](https://github.com/omergungor11/velair-experience/actions/runs/34690404955) geçti.
- Vercel projesi: `ambalajcini-vercel/velair-experience`; GitHub deposu bağlandı. Next.js preset, npm ci, npm run build, Node 22.
- Demo kodu: [`30d068a`](https://github.com/omergungor11/velair-experience/commit/30d068a93284ad2af290f98e327f00aa62a54f20). GitHub main SHA eşleşmesi doğrulandı.
- [Demo Quality CI](https://github.com/omergungor11/velair-experience/actions/runs/34786395292): başarılı; Linux üzerinde temiz npm ci + npm run check, job 42 saniye.
- Vercel Git entegrasyonu bu push için production build başlattı. Deployment: `dpl_5SgVbYifcKGNt5sm8tqqrTmqTTqk`, durum READY, build 26 saniye, oluşturulma 14 Eylül 2026 01:18:22 Europe/Istanbul.
- Sabit adres: https://velair-experience.vercel.app ; [bu build'in adresi](https://velair-experience-cvqr4mn8k-ambalajcini-vercel.vercel.app).
- Canlı adrese anonim HTTP GET 200 döndü; altı semantik bölüm var. Chrome 1440×900 hero/açık kabin ve 390×844 motion toggle kontrolü geçti; mobilde taşma yok, tekrar etkinleştirme cabin progress .3400 / cabin göstergesini koruyor. Statik yan görünüm ve WebGL yokluğu da canlı adreste doğrulandı.
- `vercel logs dpl_5SgVbYifcKGNt5sm8tqqrTmqTTqk --no-follow --level error --since 1h --limit 20`: taranan aralıkta error log bulunmadı. Kalıcı monitoring/drain bu demo kapsamında kurulmadı.
- Bu yayın sonucunu kaydeden takip commit'i yalnızca belge değiştirir; test edilmiş uygulama kodu yukarıdaki demo commit'idir.

## Kalan üretim işleri

Özel sanatçı modelinin değerlendirilmesi, otomatik LOD/lite profil, gerçek cihaz GPU/FPS/bellek/Web Vitals ölçümleri, %200 zoom dahil geniş erişilebilirlik matrisi, ekran kaydı ve portfolyo case study. Bu demo final fotogerçekçi uçak üretimi veya havacılık hizmeti değildir.

## Agent ve araç kaydı

Scene ve motion uzmanları ayrılmış dosyalarda model ve sampler geliştirdi. Entegratör UI, kamera/sahne bağlantısı, fallback, tarayıcı QA ve yayını yönetti. Quality reviewer bağımsız incelemede WebGL fallback, mobil kadraj sürekliliği, motion tercihi/aktif bölüm ve görünmeyen başlık sorunlarını buldu; düzeltmeler entegre edildi. GSAP refresh'in callback bastırması kaynak kodundan doğrulandı; explicit progress sync ile giderildi.

ESLint 9.39.5 mevcut Next plugin uyumu nedeniyle sabit. ESLint 10 geçişi plugin desteğiyle birlikte ele alınmalı. Makinedeki global codex CLI native binary ENOENT durumu bu proje kapsamında değiştirilmedi; masaüstü çoklu agent araçlarıyla geliştirme yapıldı. Rol dosyaları ayrı bir CLI oturumunda dispatch edilmiş sayılmaz.
