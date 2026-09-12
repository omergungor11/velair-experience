# Görev sırası

Durumlar: Hazır = kapsamı belli, başlanmadı. Bağımlı = ön koşulu var. Doğrulanıyor = değişiklik var, kontroller sürüyor. Tamam = kabul edildi.

| ID | Faz | Görev | Sahip | Bağımlılık | Kabul kriteri | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| VEL-00 | 0 | Plan, scaffold, agent config, CI, ilk push | Integrator | — | check geçer, uzak commit doğrulanır | Doğrulanıyor |
| VEL-01 | 1 | Kadraj, font, malzeme ve bölüm tasarımı | Creative | VEL-00 | 3 ana kadraj + mobil yerleşim + asset briefi | Bağımlı |
| VEL-02 | 1 | Model edinim/üretim ve cutaway prova | Scene | VEL-00 | Lisans, node/eksen, iç geometri ve boyut doğrulanır | Bağımlı |
| VEL-03 | 2 | Experience boundary ve fallback | Integrator | VEL-01 | JS/WebGL kapalıyken metinler ve anchorlar çalışır | Bağımlı |
| VEL-04 | 2 | Top-down hero ve bulut sahnesi | Scene | VEL-02,03 | Aynı model, doğru depth, ilk 34% kadraj hazır | Bağımlı |
| VEL-05 | 2 | Saf pose sampler ve scroll timeline | Motion | VEL-00 | Deterministik poz; sınır/ters/jump testleri | Bağımlı |
| VEL-06 | 2 | Story UI ve bölüm navigasyonu | Interface | VEL-01 | Semantik sıra, focus, responsive layout | Bağımlı |
| VEL-07 | 3 | Kabin açılımı ve 3 hotspot | Scene + Interface ayrı yollar | VEL-04,05,06 | Kabuk sıçramaz; butonlar keyboard/touch çalışır | Bağımlı |
| VEL-08 | 3 | Craft paneli ve arkadan yatay uçuş | Motion + Integrator | VEL-07 | Giriş/gizlenme/çıkış ve reverse scroll doğru | Bağımlı |
| VEL-09 | 3 | Horizon ve kapanış | Interface + Motion ayrı yollar | VEL-08 | Sayfa sonu ve tekrar keşfet erişilebilir | Bağımlı |
| VEL-10 | 4 | Lite profil ve statik motion modu | Scene + Integrator | VEL-09 | Tercih değişimi, model hatası/context loss testleri | Bağımlı |
| VEL-11 | 4 | Browser, erişilebilirlik, performans QA | Quality | VEL-10 | QA matrisi, ölçümler, engelleyici hata yok | Bağımlı |
| VEL-12 | 5 | Vercel Git bağlantısı ve preview | Integrator | VEL-11 | Doğru repo/branch, READY URL, URL'de kontroller | Bağımlı |
| VEL-13 | 5 | Production ve portfolyo sunumu | Integrator | VEL-12 | Canlı URL, kayıtlar, case study, gerçek ölçümler | Bağımlı |

Takvim tahmini PLAN.md'dedir. Eşzamanlı işler dosya sınırlarıyla atanır; bir hücrede iki rol olması aynı dosyaya eşzamanlı yazma izni değildir. Task tamamlandığında commit ve kanıt `STATUS.md` içine eklenir. Bu liste GitHub issue açıldığı anlamına gelmez.
