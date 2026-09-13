# Scroll storyboard ve motion sözleşmesi

Durum: 13 Eylül 2026 demo koreografisi. Tepeden jet → bulut örtüsü → aynı uçağın kabin açılımı → kapanış ve yan profile dönüş → DOM panel arkasından uçuş → küçülerek kapanış akışı uygulanmıştır. Bu belge kodun davranışını tarif eder; cihaz performansı ve görsel QA sonuçları [STATUS.md](STATUS.md)'de ayrıca kaydedilir.

## Zaman ve layout

[`chapters.ts`](../src/lib/motion/chapters.ts) altı bölümün normalize `[0, 1]` aralıklarını tanımlar. Oranlar saniye değil, scroll mesafesinin payıdır. `FlightExperience` tek GSAP `fromTo` tween ile `playhead.value` değerini açıkça `0 → 1` hareket ettirir; ScrollTrigger başlangıcı `top top`, sonu `bottom bottom`, `scrub` değeri `.35`, tween ease'i `none` olarak kuruludur.

CSS'teki `--travel` desktop için `700svh`, genişliği `760px` altındaki mobil için `850svh` değerindedir. Son bölüme eklenen `100svh` ile toplam içerik yüksekliği sırasıyla yaklaşık `800svh` ve `950svh` olur; gerçek ölçümü ScrollTrigger yapar. Mobil demoda scroll mesafesi ilk plandaki kısaltma önerisinden daha uzundur. Daha kısa mobil kurgu sonraki cihaz testine bağlı bir tasarım kararıdır.

Sahne katmanı viewport'a `position: fixed` ile bağlıdır. Her bölümün `chapter-inner` içeriği CSS sticky kullanır; ayrı ScrollTrigger pin yoktur. Başlıkların giriş/çıkışı esas olarak normal belge akışı ve sticky yerleşimden gelir; demoda genel GSAP metin stagger sistemi uygulanmamıştır.

## Uygulanan koreografi

Tablodaki zoom değerleri desktop için 900 CSS piksel yüksekliğindeki temel örneklerdir. Gerçek canvas'a uygulanmadan önce `fitFlight` ile ölçeklenir.

| Progress | Kamera ve jet | Kabuk, atmosfer ve içerik |
| --- | --- | --- |
| `0–.10` | Jet sağda `x=4.5`; kamera `[0,26,5]`; zoom `46→47` | Kapalı uçak, solda hero, sakin atmosfer |
| `.10–.18` | Hafif yaklaşma ve merkez yönünde sınırlı kayma; zoom `49` | Hero doğal bölüm akışında çıkar; bulut örtüsü `.15` sonrasında başlar |
| `.18–.26` | Jet `x=3.3` konumuna, kamera üst görünüme yaklaşır; zoom `56` | Atmosfer resmi kayar; öndeki shader bulut perdesi güçlenir |
| `.26–.34` | Jet `x=2.6`, kamera `[0,25,.01]`, zoom `63` | Kabuk kapalı kalır; shader örtüsü `.28` civarında en yoğundur |
| `.34–.43` | Aynı jet üzerinde plan görünümü; zoom `63→70` | `reveal: 0→1`; üst kabuk ayrılıp kaybolur; bulut örtüsü `.41` sonunda biter |
| `.43–.55` | Kamera, jet, zoom ve yönelim tamamen sabittir | Kabin tam açık; üç DOM seçeneğiyle açıklamalar okunur |
| `.55–.60` | Plan görünümü sürer, zoom `70→64` ile hafif geri çıkılır | Kabuk tam açık kalır; kabin butonları bölüm içeriğinin parçasıdır |
| `.60–.68` | Kamera yukarıda ve jet yönelimi sabit; zoom `64→43` | `reveal: 1→0`; dış kabuk tamamlanmadan yana dönüş başlamaz |
| `.68–.76` | Kamera `[0,6,25]` yan görünümüne gelir; yaw `−π/2`; jet kesintisiz `x=−13` konumuna gider | Kabuk kapalı; Craft metninden Horizon paneline geçilir |
| `.76–.90` | Jet `x=−13→+13` boyunca sağa uçar; zoom `42`; küçük bank değişimi | Horizon paneli viewport ortasında kalır ve jetin orta bölümünü örter |
| `.90–.94` | Jet sağa ve `−Z` yönüne ilerler; zoom `42→28` | Ufka uzaklaşma başlar; Horizon paneli bölüm sonuna kadar görünür |
| `.94–1` | Jet `x=22, z=−22` son konumuna ilerler; zoom `28→12` | Kapanış metni ve tekrar keşfet bağlantısı; normal sayfa sonu |

Yan uçuşa hazırlık `.68–.76` aralığında gerçekleştiği için `.76` sınırında konum atlaması yoktur. Yatay uçuş sonrasında dünya X konumu artmaya devam eder; küçülme orthographic zoom'un düşürülmesiyle sağlanır. Yalnızca kameradan uzaklaşmak orthographic görünümde boyutu değiştirmez.

## Poz örnekleme ve yönelim

[`sampleFlight(progress, mobile?)`](../src/lib/motion/sample-flight.ts) mutlak ve saf örnekleme yapar. Her çağrıda aynı progress aynı `FlightPose` değerlerini üretir; önceki kare, scroll yönü veya giriş olayı gizli state olarak kullanılmaz. NaN başlangıca düşer, negatif/pozitif taşma uç değerlere sınırlanır; `±Infinity` de aynı kurala uyar. Dönen tuple'lar çağrıya özeldir.

Keyframe'ler arasındaki tüm sayısal kanallar `t²(3−2t)` smoothstep ağırlığıyla enterpole edilir. Ağırlık uçlarda sıfır hız verir; poz ve hız süreklidir, segmentler içinde overshoot yoktur. Bu seçim bazı keyframe'lerde belirgin yavaşlama yaratır; sabit hızlı bir spline uçuşu olarak yorumlanmamalıdır.

Jet dönüşü radyan cinsinden Euler XYZ açılarıyla örneklenir; `FlightCanvas` bunları `jet.rotation.set(...)` ile uygular. Quaternion slerp ve Catmull-Rom ilk plan seçenekleridir, mevcut demoda kullanılmaz. Sınırlı ve sarma içermeyen açı aralığı ileri/geri örneklemede sürekliliği korur. Daha karmaşık dönüşler eklenecekse quaternion yolu ayrı değerlendirilmelidir.

Kamera orthographic'tir. Plan kadrajında konum `[0,25,.01]` olarak korunur; bakış yönü dünya up ekseniyle tam çakışmaz. Zoom ve poz doğrudan örnekten uygulanır; `.35` scroll scrub üzerine ikinci bir geciktirici lerp eklenmez.

## Kabin açılımı

`JetModel` tek uçak scene graph'ını korur. `reveal` arttıkça `FuselageUpper` grubu `Y=1.9` değerine kadar yükselir, X yönünde `.12` birim kayar ve Z etrafında en fazla `−.055` radyan döner. Üst kabuk materyallerinin opaklığı kontrollü azalır; tam açılımda grup gizlenir. `CabinInterior` aynı alt gövde ve kanatlarla hizalıdır.

Yalnızca ayrılan üst grubun materyalleri değişir; tüm uçak şeffaflaştırılmaz. Ters scroll aynı `reveal` örneğini uyguladığından kabuk tekrar yerine oturur. Kabin açıklamaları ayrı DOM butonlarıyla seçilir; demoda 3D koltuklara bağlı projekte hotspot veya bu butonlarla kamera yakınlaşması bulunmaz.

## Atmosfer ve DOM katmanları

`cloud-atmosphere.png` sabit sahnenin arka planıdır; `--flight-progress` ile hafif düşey kayma ve ölçek alır. `CloudVeil` kameranın önünde tek shader düzlemidir; `.15–.41` aralığında sinüs-kare zarfıyla görünür. Noise koordinatları aynı progress ile kayar. `depthTest` ve `depthWrite` kapalıdır; örtü jetin üzerinde, DOM metinlerinin altında çizilir.

Sampler'ın `cloud` alanı normalize bir tasarım zarfı olarak döner, ancak mevcut `CloudVeil` kendi progress zarfını kullanır. Sampler'daki bulut keyframe'lerini değiştirmek tek başına görünür örtüyü değiştirmez. Üç fiziksel derinlik katmanı ve hacimsel bulut sonraki görsel cila seçenekleridir.

Katmanlar sabittir:

1. `scene-shell`, `z-index: 0`: atmosfer resmi, canvas, gökyüzü katmanı ve grain.
2. `story-sections`, `z-index: 10`: metinler, kabin açıklamaları ve opak Horizon paneli.
3. Navigasyon ve hareket kontrolü, `z-index: 30`; skip link, `60`.

Horizon `flyby-card` animasyon modunda `position: fixed` ile viewport merkezinde kalır. `.76–.94` bölümünde CSS opacity geçişiyle görünür; uçuşun panel arkasından geçmesi gerçek DOM örtmesidir. Canvas'ın z-index'i veya DOM sırası scroll sırasında değiştirilmez. Statik modda kart ve yan uçak posteri normal akıştadır.

## Mobil kadraj

`sampleFlight`, genişlik `760px` altındayken mobil pozlarla çağrılır. Hero ve kabin X ekseninde ortalanır; temel zoom sırasıyla `28` ve `50`, yan uçuşta `24`, kapanışta `7` değerindedir. `fitFlight` önce viewport yüksekliğiyle ölçekler, ardından erken bölüm için kadraj sınırı uygular:

- Hero tarafında sınır `width / 16.5` ile kanatlara yatay boşluk bırakır.
- `.28–.43` arasında kabin zarfı yükselir; sınır `height / 25` yönüne geçerek iç planı okunabilir tutar.
- Modelin Z konumu erken bölümde `2.5` birim, kabin açıldığında buna ek `2.4` birim kaydırılır; üstteki metne yer açılır.
- Ek düzeltmeler `.60–.76` boyunca yumuşakça kaldırılır; sınırda ani zoom veya konum değişimi yoktur.

Yatay uçuş mobilde `x=−9→+9`, `y=7` yolunu kullanır. Panel merkezi viewport'un `%56` yüksekliğindedir; jet daha yukarıdaki açık alandan geçer. Dar viewport mevcut demoda farklı geometri/LOD seçmez. Orientation değişimi R3F boyutları ve ScrollTrigger ölçümleriyle yeniden kadrajlanır; gerçek telefon sonuçları ayrıca doğrulanmalıdır.

## Hareket tercihi, yükleme ve cleanup

OS'nin `prefers-reduced-motion` tercihi canlı dinlenir. Varsayılan `auto` seçimi bu tercihe uyar; düğmeyle açık kullanıcı seçimi yapılabilir. Statik modda GSAP scrub ve WebGL canvas kaldırılır; CSS sticky içerikler normal bölümlere dönüşür, atmosfer sabit kalır ve üç görünüm için desktop/mobil posterler kullanılır. JS kapalıyken başlangıç HTML'si statik düzeni taşır.

Mod değişimi veya sahne hatasından önce görünür chapter saklanır; yeni düzende aynı bölüm başlangıcına kaydırılır. Piksel konumu korunmaz; kullanıcı otomatik olarak hero'ya gönderilmez. Kabin seçimi kendi client state'inde tutulur. Canvas dekoratiftir; bölüm değişimleri `aria-live` ile sürekli duyurulmaz, yalnızca kabin seçimine ait açıklama nazikçe duyurulur.

`useGSAP` scope/context ve `revertOnUpdate` eski tween/ScrollTrigger kaynaklarını kaldırır. Kurulumdaki kısa refresh timer'ı temizlenir; font hazır callback'i dispose durumunu kontrol eder. `gsap.matchMedia()` kullanılmaz; React dış store abonelikleri tercihi yönetir. WebGL context loss listener'ı, visibility listener'ı, ortam dokusu ve model kaynakları unmount sırasında temizlenir.

`onRefresh`, mevcut scroll progress'ini doğrudan `applyProgress` fonksiyonuna geçirir. Font/timer refresh yolu ayrıca trigger'ı günceller, tween progress'ini eşitler ve aynı uygulama fonksiyonunu açıkça çağırır. Yalnızca `totalProgress(..., false)` çağrısına güvenilmez: refresh tween'i aynı noktaya callback'leri bastırarak getirmiş olabilir. Bu eşitleme, ortadan yükleme ve statik moddan dönüşte progress ref'i, aktif bölüm, CSS ve render isteğini birlikte günceller.

Canvas `frameloop="demand"` kullanır. Scroll scrub güncellemeleri render ister; sürekli idle salınımı, cursor takibi, wheel engelleme, scroll snap, zorunlu preloader veya ikinci smoothing motoru yoktur. Canvas hazır durumu kurulum sonrası animation frame callback'iyle açılır; poster değişimi ve ortadan yükleme davranışı görsel QA'nın parçasıdır.

## Doğrulama ve sonraki cila

[`flight.test.mjs`](../tests/flight.test.mjs) uç değerler/NaN, ileri-geri örnekleme, büyük sıçramalar, poz/hız sürekliliği, sakin kabin aralığı, kapanış öncesi dönüş olmaması, yatay uçuş yönü ve tuple izolasyonunu kapsar. [`viewport.test.mjs`](../tests/viewport.test.mjs) mobil reveal/yan uçuş sınırlarında kadraj sürekliliğini ve dar hero'nun sığmasını kontrol eder. [`chapters.test.mjs`](../tests/chapters.test.mjs) bölüm aralıklarını doğrular. Saf testler gerçek tarayıcı davranışının yerine geçmez.

Tarayıcı QA'sında `0 → .5 → .2 → .85 → .4 → 1`, yavaş/hızlı scroll, scrollbar sürükleme, kabin içinde refresh, anchor navigasyonu, resize/orientation, canlı hareket tercihi ve context loss incelenir. Özellikle `.34`, `.43`, `.60`, `.68`, `.76`, `.90`, `.94` sınırlarında sıçrama, kabuk sızıntısı ve panelin giriş/çıkışı kontrol edilir. Gerçek cihaz FPS, ısınma, Web Vitals, GLB/LOD ve daha kısa mobil hikâye sonraki üretim çalışmalarına aittir; ölçülmeden tamamlandı sayılmaz.
