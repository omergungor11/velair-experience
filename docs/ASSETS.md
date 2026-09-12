# 3D ve görsel asset planı

Durum: üretim/edinim bekliyor. Bu commit'te model, bulut dokusu veya lisanslı final görsel bulunmuyor.

## Uçak model briefi

Logo taşımayan çağdaş bir business jet. Uzun ve ince gövde, geriye süpürülmüş kanatlar, arka motorlar ve dengeli kuyruk oranı. İnci beyazı gövde, koyu kokpit camı, çok sınırlı metal detay. Gerçek bir üreticinin birebir doğruluk iddiası yoktur.

Tepeden, yan profilden ve açık kabin görünümünde aynı model kullanılabilir olmalı. Kabin 3 anlatı alanı içerir: lounge, dining, private suite. Bu plan bir uçuş güvenliği ya da sertifikalı yerleşim çizimi değildir.

## Zorunlu sahne yapısı

```text
JetRoot
  FuselageLower
  FuselageUpper
  Wings
  Tail
  Engines
  CabinFloor
  Seats
  Tables
  Windows
```

Üst gövde, kabin iç geometrisini açığa çıkaracak ayrı mesh olmalı. Tüm düğümlerin isimleri export sonrası korunmalı. Reveal sırasında görünür iç duvar, döşeme ve gövde kenarları modellenmeli. Tamamen kapalı dış model bu gereksinimi karşılamaz.

Y-up, burun -Z, metre birimi, ortak merkez pivot. Transform scale `(1,1,1)`; normal yönleri doğru; temiz UV; gereksiz kameralardan/ışıklardan arındırılmış export. Yanlış ölçek sonradan kamera koduna yayılmamalı.

## Çıktılar ve bütçe

| Asset | Planlanan yol örneği | Hedef | Kullanım |
| --- | --- | --- | --- |
| Ana jet | `public/models/velair-jet-v1.glb` | ≤ 3 MiB; ≤ 150k görünür triangle | Dış + kabin + yan uçuş |
| Lite jet | `public/models/velair-jet-lite-v1.glb` | ≤ 1.5 MiB; ≤ 60k triangle | Mobil/düşük GPU |
| Bulut atlası | `public/textures/cloud-atlas-v1.webp` | ≤ 400 KiB | 2–3 derinlik katmanı |
| Environment | `public/textures/sky-studio-v1.hdr` | ≤ 500 KiB | Gövde yansıması |
| Hero fallback | `public/images/jet-top-v1.webp` | ≤ 220 KiB desktop; daha küçük mobil | İlk kare + statik mod |
| Kabin fallback | `public/images/cabin-top-v1.webp` | ≤ 250 KiB | WebGL alternatifi |
| Yan profil fallback | `public/images/jet-side-v1.webp` | ≤ 220 KiB | Statik horizon |
| Fontlar | `public/fonts/` | Toplam ≤ 160 KiB WOFF2 | Son tipografi |

Bunlar rezervasyon amaçlı dosya adlarıdır; var olmayan dosyaya runtime request atılmaz. GLB içindeki texture transferi iki kez bütçelenmez; çözülmüş GPU boyutu ayrıca ölçülür.

## Üretim sırası

1. Uygun lisanslı model adayını veya özel üretim yolunu belirle; üst kabuk ve kabin varlığını kontrol et.
2. Gri blockout ile top-down → cutaway → side pozlarını aynı renderer'da doğrula.
3. Blender'da mesh bölümleri, pivot, UV ve materyalleri düzenle. Kabin/exterior kesişmelerini gider.
4. GLB export; gerekirse glTF Transform ile meshopt veya Draco seç. İkisini gereksiz yere yığma; decoder maliyetini ölç.
5. KTX2/Basis gerekiyorsa loader/decoder yollarını aynı origin'de kur; yalnızca gerçekten kazanç sağlayan dokularda kullan.
6. Gerçek sahnede test: üst kabuk kapanırken pop, cam/kanat sorting, normal ve materyal parlaklığı.
7. Lite varyant ve ana modelden aynı kamera/ışıkla fallback karelerini üret.
8. Final kaynak, lisans, boyut ve node listesini kayıt tablosuna işle.

## Kaynak ve hak kaydı

| Asset | Durum | Kaynak URL / üretici | Lisans / dağıtım hakkı | Boyut / hash | İnceleyen |
| --- | --- | --- | --- | --- | --- |
| Jet dış + kabin | Bekliyor | — | — | — | — |
| Bulut atlası | Bekliyor | — | — | — | — |
| Environment | Bekliyor | — | — | — | — |
| Fallback kareleri | Modele bağlı | — | — | — | — |
| Fontlar | Sistem fontu geçici | OS font stack | Font binary dağıtılmıyor | — | — |

Modelin browser'a gönderilmesi fiilen dosyanın erişilebilir olmasıdır. Kaynak lisansın bu kullanımı ve repository'de dağıtımı karşılaması gerekir. Satın alınan modelin ham kaynak dosyası ayrıca izin yoksa GitHub'a eklenmez. Büyük `.blend` çalışma dosyaları ayrı asset arşivinde tutulur. AI üretimi varsa araç/tarih/brief ve insan düzenlemeleri kayıt altına alınır.

## Faz 1 kabul testi

Üst kabuk bağımsız hareket ediyor; kabin içeriden görünür ve kapalı durumda sızmıyor; top-down ile side aynı gövde; model referans kamerada kadraja sığıyor; isimler `src/types/scene.ts` ile uyuşuyor; lisans kaydı tamam; desktop/lite bütçeleri ölçülmüş. Bunlar geçmeden final hero cilasına başlanmaz.
