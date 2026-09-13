# Görev sırası

Durumlar: Hazır = kapsamı belli, başlanmadı. Bağımlı = ön koşulu var. Doğrulanıyor = değişiklik var, kontroller sürüyor. Tamam = kabul edildi. Kısmen = demo karşılığı hazır, final kabulünün kalan maddeleri açık.

| ID | Faz | Görev | Sahip | Bağımlılık | Kabul kriteri | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| VEL-00 | 0 | Plan, scaffold, agent config, CI, ilk push | Integrator | — | check geçer, uzak commit doğrulanır | Tamam |
| VEL-01 | 1 | Kadraj, font, malzeme ve bölüm tasarımı | Creative | VEL-00 | 3 ana kadraj + mobil yerleşim + asset briefi | Tamam |
| VEL-02 | 1 | Model edinim/üretim ve cutaway prova | Scene | VEL-00 | Lisans, node/eksen, iç geometri ve boyut doğrulanır | Tamam |
| VEL-03 | 2 | Experience boundary ve fallback | Integrator | VEL-01 | JS/WebGL kapalıyken metinler ve anchorlar çalışır | Tamam |
| VEL-04 | 2 | Top-down hero ve bulut sahnesi | Scene | VEL-02,03 | Aynı model, doğru depth, ilk 34% kadraj hazır | Tamam |
| VEL-05 | 2 | Saf pose sampler ve scroll timeline | Motion | VEL-00 | Deterministik poz; sınır/ters/jump testleri | Tamam |
| VEL-06 | 2 | Story UI ve bölüm navigasyonu | Interface | VEL-01 | Semantik sıra, focus, responsive layout | Tamam |
| VEL-07 | 3 | Kabin açılımı ve 3 hotspot | Scene + Interface ayrı yollar | VEL-04,05,06 | Kabuk sıçramaz; butonlar keyboard/touch çalışır | Tamam |
| VEL-08 | 3 | Craft paneli ve arkadan yatay uçuş | Motion + Integrator | VEL-07 | Giriş/gizlenme/çıkış ve reverse scroll doğru | Tamam |
| VEL-09 | 3 | Horizon ve kapanış | Interface + Motion ayrı yollar | VEL-08 | Sayfa sonu ve tekrar keşfet erişilebilir | Tamam |
| VEL-10 | 4 | Lite profil ve statik motion modu | Scene + Integrator | VEL-09 | Tercih değişimi, model hatası/context loss testleri | Kısmen |
| VEL-11 | 4 | Browser, erişilebilirlik, performans QA | Quality | VEL-10 | QA matrisi, ölçümler, engelleyici hata yok | Kısmen |
| VEL-12 | 5 | Vercel Git bağlantısı ve demo yayını | Integrator | VEL-11 demo QA | Doğru repo/branch, READY URL, URL'de kontroller | Tamam |
| VEL-13 | 5 | Production ve portfolyo sunumu | Integrator | VEL-12 | Canlı URL, kayıtlar, case study, gerçek ölçümler | Kısmen |

Takvim tahmini PLAN.md'dedir. Eşzamanlı işler dosya sınırlarıyla atanır; bir hücrede iki rol olması aynı dosyaya eşzamanlı yazma izni değildir. Task tamamlandığında commit ve kanıt `STATUS.md` içine eklenir. Bu liste GitHub issue açıldığı anlamına gelmez.

## Demo kabulü — 13 Eylül 2026

VEL-01/02, sistem fontları ve bu proje için üretilmiş prosedürel jetle kabul edildi; satın alınmış final model yok. VEL-07 üç DOM butonuyla kabin açıklamaları sunar; model üzerinde mekânsal hotspot işaretleyicileri ayrı cilalama işidir. VEL-10 için statik mod, WebGL yokluğu ve context-loss geçişi çalışır; otomatik LOD/lite seçimi açık. VEL-11 için Chrome masaüstü/mobil emülasyon ve 11 saf test geçti; gerçek iOS/Android, FPS, Web Vitals saha ölçümü ve kapsamlı erişilebilirlik incelemesi açık.

Sonraki kapsam: gerçek cihaz QA → geometri/LOD ve materyal cilası → portfolyo ekran kaydı/case study. Demo yayını final üretim hedeflerinin tamamlandığı anlamına gelmez.

14 Eylül: Vercel production demo READY ve canlı URL kontrol edildi. VEL-13 için yayın tamam; portfolyo kaydı/case study ve gerçek cihaz metrikleri açık.
