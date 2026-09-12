# Scroll storyboard ve motion sözleşmesi

Durum: uygulanacak koreografi. Başlangıç commit'inde yalnızca bölüm verisi ve sınır testleri vardır.

## Zaman tabanı

Kaynak `src/lib/motion/chapters.ts` içindeki normalize `[0, 1]` progress'tir. Aşağıdaki oranlar saniye değildir; toplam scroll mesafesindeki paydır. İlk desktop prototip toplam 6–8 viewport hareket mesafesiyle denenir. Sabit viewport yüksekliğine göre üretilen sayılar gerçek ekranlarda yeniden ölçülür.

Scene host, story container içinde `position: sticky; top: 0; height: 100svh` olabilir. Sticky host sabit bir wrapper içinde, scroll panelleri ayrı content katmanında bulunur. Aynı elemana hem CSS sticky hem ScrollTrigger pin uygulanmaz. ScrollTrigger yalnızca story container'dan progress okur. Alternatif pin mimarisine geçilirse içteki görsel hareket eder; ölçülen pin wrapper'ın transform'u değişmez.

## Koreografi tablosu

| Progress | Kamera / uçak | Bulut / DOM | Geçiş koşulu |
| --- | --- | --- | --- |
| 0–0.10 | Tepeden, uçak ekranın yaklaşık %55–65 yüksekliği | Büyük başlık, hafif bulut derinliği | İlk kare model/poster hizalı |
| 0.10–0.18 | Hafif yaklaşma; dönüş en fazla birkaç derece | Hero metni yavaşça çıkar | Metin jet üzerinden geçmez |
| 0.18–0.26 | Kamera uçak merkezine yaklaşır | Üç derinlik katmanı ayrı hızla kayar | Bulut bütün ekranı uzun süre kapatmaz |
| 0.26–0.34 | Üst gövde açılımına hazırlık | Yakın bulut geçişi örter | Kabin hazır değilse statik alternatif |
| 0.34–0.42 | Üst kabuk ayrılır; iç plan hizalanır | Bulut seyrelir, kabin başlığı girer | İç geometri ve alt kabuk kesintisiz |
| 0.42–0.56 | Kamera durağan okunabilir plan görünümünde | 3 hotspot görünür, kısa metin | Okuma sırasında zorunlu hareket yok |
| 0.56–0.60 | Çok hafif geri çıkış | Hotspot katmanı kapanır | Açık bilgi paneli fokus kaybettirmez |
| 0.60–0.68 | Kabuk geri oturur | Craft metni girer | Dış geometri tamamlanmadan rotate yok |
| 0.68–0.76 | Kamera yan profile; jet quaternion ile döner | Opak editoryal panel öne gelir | Top-down → side görünüm kesintisiz |
| 0.76–0.88 | Jet soldan sağa panelin arkasından geçer | Panel iki kenarda açık alan bırakır | Giriş, gizlenme, çıkış okunur |
| 0.88–0.94 | Jet ufka ilerler ve küçülür | Horizon metni yerleşir | Kenardan ani kesilme yok |
| 0.94–1.00 | Kamera ve jet son pozu alır | Kapanış ve başa dönüş bağlantısı | Sayfa sonuna normal erişim |

## Katman düzeni

1. Story host arka planı: gökyüzü rengi.
2. Canvas `z-index: 0`: uçak, 3D bulut katmanları, ışık.
3. Story content `z-index: 10`: metin, kabin hotspotlarının DOM karşılığı ve Craft paneli.
4. Navigasyon `z-index: 30`.
5. Gerekirse erişilebilir açıklama paneli `z-index: 40`.

Story container `isolation: isolate` ile kendi stacking context'ine sahip olur. Arka plan canvas'ın üstüne tam sayfa opak bir blok olarak yerleştirilmez. Bulutlar dünya depth'ine göre sıralanır; DOM metni kapatmak için rastgele canvas z-index değişimi yapılmaz. Kamera kesmelerini örten bulut, DOM metinlerinin arkasındadır; o aralıkta metin zaten çıkar.

## Motion ilkeleri

- Scroll scrub bir ana timeline'a bağlıdır. Başlangıç `scrub: 0.35` denenir; sahne progress'i ham scroll yerine scrub edilen timeline playhead'inden alınır. İkinci bir lerp aynı değeri tekrar geciktirmez.
- Kameranın konumu, hedefi ve jet yönelimi her progress değeri için mutlak olarak örneklenir. Sadece `onEnter` olayına bağlı gizli state kullanılmaz; scrollbar sürükleme ve ters scroll aynı kareyi üretir.
- Vektör yolu Catmull-Rom veya kontrollü keyframe interpolation; yönelim quaternion slerp. Kesin top-down lookAt durumunda sabit dünya up vektörüyle tekillik oluşmayacak kamera rig'i kurulur.
- Ana zaman çizelgesi ease `none`; sahne içi keyframe geçişleri ihtiyaca göre yumuşatılır. Metin girişleri 0.45–0.7s, 16–28px kayma, küçük stagger; kabin okuma aralığı sakin kalır.
- `useGSAP` / context cleanup ile timeline ve ScrollTrigger kaldırılır. Media değişimi `gsap.matchMedia()` ile yeniden kurulur. Eski `ScrollTrigger.matchMedia()` kullanılmaz.
- Default olarak scroll snap, wheel engelleme, otomatik scroll, cursor takipçisi ve zorunlu preloader yoktur.
- Yükleme tamamlanınca mevcut scroll noktasına karşılık gelen poz alınır. Kamera başlangıca sıçramaz. Poster ancak ilk başarılı 3D kareden sonra çıkar.
- Font/model yükleme ve resize sonrasında ölçümler bir kez yenilenir. Render döngüsünde DOM ölçümü yapılmaz.
- Boşta sürekli jet sallanması varsayılan değildir. Idle efekti eklenirse hareket azalt seçeneği ve görünürlük kontrolüyle kapatılır.

## Erişilebilir hareket modu

OS tercihi veya kullanıcı seçimi ile pin, parallax, scrub kamera, zoom ve sürekli hareket kapatılır. Üç statik model karesi ve sırayla okunan bölümler gösterilir. Geçiş sırasında sayfa/fokus başa atılmaz. Mod değişimi sonrası GSAP kaynakları ve WebGL renderer gerektiği gibi temizlenir.

Hotspot açıklamaları gerçek butonlarla açılır. Kapalı içerik tab sırasına girmez. Hover ile tek başına bilgi verilmez. Canvas dekoratif olduğu için metin alternatifleri DOM'dadır. Bölüm değişimi her frame `aria-live` ile duyurulmaz.

## Mobil koreografi

Top-down hero, kısa bulut geçişi ve sade kabin planı korunur. Yatay uçuş daha kısa mesafede olur; opak panel ekranı tamamen dolduruyorsa uçak geçişi panelin üst/alt açık bandına taşınır. Model 3D bütçeye sığmıyorsa lite veya statik modu kullanır. Kamera hareketi touch scroll'u engellemez.

## Doğrulama örnekleri

`0 → .5 → .2 → .85 → .4 → 1` atlamaları, yavaş/çok hızlı scroll, scrollbar sürükleme, sayfanın ortasında refresh, geri/ileri navigasyon, orientation değişimi ve motion tercihini canlı değiştirme test edilir. Özellikle `.34`, `.60`, `.76`, `.94` sınırlarında sıçrama ve bir karelik kabuk sızıntısı aranır.

Referans: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) ve [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). Oranlar ve geçiş tasarımı proje kararlarıdır.
