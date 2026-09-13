# VELAIR — Kapsamlı proje planı

İlk plan: 12 Eylül 2026 · Amaç: kişisel portfolyo.

13 Eylül güncellemesi: Bu belge başlangıç vizyonu ve ileri üretim hedeflerini korur. Çalışan demo artık uygulanmıştır; güncel kapsam ve kanıtlar STATUS.md, gerçek mimari ARCHITECTURE.md ve MOTION.md içindedir. Demo GLB yerine özgün prosedürel geometri, perspektif yerine ortografik kamera kullanır. Mobil scroll 8.5 viewport olarak denenmiştir; gerçek cihaz optimizasyonu henüz tamamlanmamıştır.

## 1. Projenin fikri

Bir ziyaretçinin mouse tekerleği ya da dokunmatik hareketi, özel bir jetin çevresinde ilerleyen kamerayı yönetir. Hikâye yüksek irtifada, uçağın tepeden görünümüyle başlar. Bulutların hareketi hız ve derinlik hissini verir. Kamera yaklaşırken dış kabuk açılır ve aynı uçağın kabin planı görünür. İç mekânın sakin ritminden sonra jet yeniden kapanır, yan profile döner ve büyük bir bölümün arkasından geçerek ufka uzaklaşır.

Tek cümlelik görsel yön: **Soğuk gökyüzü ışığında, heykel gibi işlenmiş bir jet ve havacılık dergisinin ölçülü tipografisi.**

Çalışma adı VELAIR; alt ifade “Above the Ordinary”. İngilizce arayüz uluslararası portfolyo sunumuna uygun varsayılmıştır. Plan ve geliştirme belgeleri Türkçe tutulur. Gerçek bir jet üreticisinin adı, logosu veya doğrulanmamış teknik değerleri kullanılmaz. İsim, renkler ve metinler varlık üretimi başlamadan önce düşük maliyetle değiştirilebilir.

## 2. Portfolyoda neyi gösterecek?

- Art direction: uçak, ışık, tipografi ve bölüm geçişlerinin aynı görsel dünyaya ait olması.
- Teknik yetenek: gerçek zamanlı 3D, kamera koreografisi, scroll ile kontrol edilen zaman çizelgesi.
- Interaction design: okunabilir içerik, kullanıcının hızına uyum, ileri/geri akışın tutarlılığı.
- Ürün kalitesi: mobil düzen, klavye kullanımı, azaltılmış hareket, zayıf cihazlarda çalışan alternatif.
- Mühendislik: ölçülmüş performans, sürdürülebilir kod, açıklanmış asset süreci ve Vercel dağıtımı.

Hedef kitle potansiyel işverenler, yaratıcı ajanslar ve tasarım/geliştirme müşterileridir. Ana görev deneyimi keşfetmek; başarı yalnızca uzun ziyaret süresi değildir. İlk ekranın etkisi ve akışın kesintisizliği daha belirleyicidir.

## 3. Kapsam ve teslim sınırı

İlk ürün tek sayfadır. Altı anlatı bölümü, üç erişilebilir kabin noktası, bölüm navigasyonu, hareketi azalt seçeneği ve deneyimi başa alma bağlantısı içerir. Footer projenin bağımsız bir konsept olduğunu açıklar. Tasarımcının iletişim adresi belli olduğunda tek bir gerçek portfolyo bağlantısı eklenebilir; sahte rezervasyon formu bulunmaz.

Bu ilk commit'in kapsamı plan, çalışan Next.js başlangıcı, test/CI ve agent mimarisidir. Tam 3D site Faz 1–5'te üretilir. İlk teknik sayfa son sanat yönetimini ya da bitmiş deneyimi temsil etmez.

CMS, üyelik, chatbot, rezervasyon sistemi, çoklu uçak kataloğu, sesli anlatım ve ödeme ilk sürümde bulunmaz. Bunlar ihtiyaç oluşursa ayrı kapsam olarak ele alınır.

## 4. Sayfa akışı

| Bölüm | Ziyaretçinin gördüğü | Hareket | Okunacak içerik |
| --- | --- | --- | --- |
| 01 Above | Tepeden görünen jet, gökyüzü, geniş başlık | Çok hafif kamera yaklaşması; sakin çevre | “Above the ordinary.” |
| 02 Clouds | Uçağın altından ve kameranın önünden geçen bulutlar | Farklı derinliklerde parallax, kontrollü geçiş örtüsü | “Leave the noise below.” |
| 03 Cabin | Üst gövdesi açılan aynı uçak, açık iç plan | Yakınlaşma, kabuğun ayrılması, duraklayan kamera | “A world of your own.”; Lounge / Dining / Private suite |
| 04 Craft | Kabin detayı ve büyük editoryal içerik paneli | Kamera geri çıkar, kabuk kapanır, yan profile döner | “Every detail, considered.” |
| 05 Horizon | Jet panelin arkasından yatay geçer, tekrar görünür | Soldan sağa uçuş, çok sınırlı yatış | “Follow your own horizon.” |
| 06 Arrival | Jet ufka küçülür, sakin kapanış | Hareket sonlanır, tipografi yerleşir | “The journey is yours.”; tekrar keşfet |

Kabin için hover zorunluluğu yoktur. Her nokta tıklanabilir/fokuslanabilir bir DOM butonudur; açıklamalar mobilde sıralı kartlara dönüşür. Her noktada kısa bir açıklama gösterilir; satın alma veya sahte teknik performans iddiası eklenmez.

## 5. Görsel sistem

Renk paleti: koyu lacivert `#101D2B`, buz mavisi `#E4EDF4`, kâğıt beyazı `#F7F8FA`, metalik gri yüzeyler ve sınırlı çelik mavisi vurgu. Kabinde derin kahverengi ahşap ve koyu deri kullanılabilir; ana arayüzün rengini değiştirmez.

Başlıklar büyük, ince ve sıkı kompozisyonlu; ana metin yalın sans serif. Başlık için lisanslı/self-hosted bir serif ile sans eşleşmesi değerlendirilecek. Başlangıç sistem fontlarıyla çalışır; görsel onaydan sonra WOFF2 eklenir. Beden metni en az 16px, sık kullanılan etiketler 14px, yardımcı metadata 12–13px hedeflenir.

Desktop 12 kolon, tablet 8, mobil 4 kolon. Hero uçağı görüntünün ana nesnesidir; başlık kanatlarla kontrolsüz çakışmaz. Ziyaretçinin gözü aynı anda en fazla bir ana hareketi takip eder. Bölüm numaraları ve küçük havacılık grafikleri yön bulmaya yardımcı olur. Yapay HUD, neon çizgiler, aşırı blur ve her kartta parallax kullanılmaz.

Kabin bölümünün mimari çizim hissi için gerçek modelden alınan üst görünüm ve sade ölçüsüz açıklama çizgileri tercih edilir. Factual ölçü veya menzil gösterilirse üretici kaynağı gerekir.

## 6. İmza geçişlerinin çözümü

### Tepeden görünüm → bulut geçişi

Tek perspektif kamera, dar görüş açısıyla tepeden görünür. İlk bulutlar uçağın altında kalır. Yaklaşma bölümünde kameraya daha yakın bir bulut düzlemi görüşü kısmen örter. Jet dünya koordinatında çok az hareket eder; göreli hareketi bulutlar taşır. Bu ayrım uçağın ekrandan kaçmasını önler.

### Bulut → iç plan

Modelin üst gövdesi ayrı bir mesh olacaktır. Kapalı modelden tamamen farklı bir iç mekân görseline atlamak yerine alt gövde, kanatlar ve kabin aynı yerel ekseni paylaşır. Bulut örtüsü sırasında üst kabuk kontrollü şekilde yükseltilir/gizlenir. Tam şeffaf uçak, çift yüzey ve yanlış depth sıralaması oluşturabileceği için ilk çözüm değildir. Kabin iç duvarları modelde bulunmalıdır.

### İç plan → bölüm arkasından yatay uçuş

Kamera uzaklaşır, üst kabuk kapanır. Uçak yönelimi quaternion ile yan profile geçer. 3D canvas anlatı boyunca aynı DOM katmanında kalır. Opak editoryal panel canvas'ın önünde yer alır ve jetin bir kısmını doğal olarak örter. Panelin iki yanında açık alan bırakıldığı için uçak girişte ve çıkışta görünür. Canvas z-index'ini animasyon sırasında değiştirmek gerekmez.

## 7. Teknik yaklaşım

Next.js App Router içerik ve metadata'yı sunar. Three.js + React Three Fiber sahneyi, Drei yükleme ve yardımcı bileşenleri yönetir. GSAP + ScrollTrigger kamera, uçak, bulut ve DOM geçişlerini ortak bir progress değerine bağlar. CSS, tipografi ve layout tokenlarının kaynağıdır.

Doğal sayfa scroll'u temel alınır. İlk teknik provada Lenis kullanılmaz. İncelenen cihazlarda belirgin bir kazanç sağlarsa tek animation frame kaynağıyla sonradan eklenebilir. Motion/Framer Motion aynı transformları yönetmek üzere ikinci motor olarak eklenmez.

Tek kalıcı canvas, bir sahne denetleyicisi ve ayrılmış client sınırı kullanılacak. Başlıklar, kabin açıklamaları ve bağlantılar WebGL dışında semantik HTML olarak bulunacak. Canvas yüklenemese de sayfa okunabilir olacak. Mimari ve veri sözleşmesi [ARCHITECTURE.md](ARCHITECTURE.md) içinde.

## 8. Asset stratejisi

Kalitenin kritik bağımlılığı uygun 3D uçak modelidir. Tercih edilen yol, özel tasarlanmış veya web üzerinde dağıtım lisansı uygun, üst gövdesi ayrılabilir bir modeldir. Dış gövde, iç mekân, materyaller, UV'ler ve düşük detay varyantı tek bir asset sözleşmesine göre hazırlanır.

İlk teknik prova gri materyalli bir blockout ile yapılabilir; bu görsel son kalite olarak sunulmaz. Anatomik olarak tutarsız bir AI uçak görseli, gerçek 3D cutaway gereksiniminin yerine geçmez. AI üretimi atmosfer araştırması veya bulut dokusu için kullanılabilir. Gereken mesh yapısı ve teslim formatı [ASSETS.md](ASSETS.md) içinde.

Hedef final varlıklar: bir dış/iç uçak GLB, bir düşük detay GLB, bir küçük bulut atlası, bir küçük environment map ve aynı modelden 3 statik fallback karesi. Model satın alma veya sanatçı hizmeti için henüz bütçe ayrılmadı; satın alma bu planın parçası değildir.

## 9. Mobil ve erişilebilirlik

Desktop'taki uzun pin dizisi mobilde kısalır. Kabin planı daha az zoom ile gösterilir; hotspotlar planın altında erişilebilir butonlara dönüşür. Pointer tabanlı kamera hareketi dokunmatik cihazlarda yoktur. `svh`/`dvh` kullanımı ve adres çubuğu değişimleri gerçek iOS cihazda doğrulanır.

`prefers-reduced-motion` veya kullanıcının hareketi azalt seçimi statik anlatıya geçer: üç onaylı kare, normal dikey içerik, pin/parallax/zoom yok. WebGL kullanılamadığında, context kaybında veya asset yükleme hatasında aynı okunabilir alternatif devreye girer. Kullanıcı bir yükleyici ekranında tutulmaz.

Klavye gezinmesi, skip link, belirgin focus, %200 metin büyütme, görünür içerik sırası ve kontrast QA kapısının parçasıdır. Ses varsayılan kapsamda yoktur.

## 10. Performans hedefleri

Bu sayılar ölçülmüş sonuç değil, ilk tasarım bütçeleridir. Model provası sonrası gerçek cihaz sonuçlarıyla revize edilir.

| Alan | Başlangıç bütçesi |
| --- | --- |
| İlk HTML/CSS + kritik JS + font/poster transferi | ≤ 600 KiB sıkıştırılmış; 3D chunk ayrı |
| İlk 3D deneyim toplam ek transferi | ≤ 6 MiB desktop; ≤ 3 MiB lite |
| GLB | Desktop ≤ 3 MiB; lite ≤ 1.5 MiB |
| Texture | En fazla 2K desktop / 1K lite; görünür sahnede ≤ 64 MiB çözülmüş GPU dokusu hedefi |
| Geometri | ≤ 150k görünür triangle desktop / ≤ 60k lite |
| Draw call | ≤ 80 desktop / ≤ 45 lite |
| DPR | Desktop en çok 1.5; lite 1–1.25 |
| Hareket | Referans desktop 60 FPS hedefi; orta telefon ≥ 30 FPS hedefi |
| Web Vitals | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 hedefi |

Sabit blur ve ağır post-processing ilk sürümde yok. Boşta, sekme arka plandayken veya canvas görünmüyorken gereksiz render durdurulur. Web Vitals saha hedefleri, trafik oluşmadan doğrulanmış sayılmaz.

## 11. Üretim fazları

| Faz | İş ve çıktı | Tahmini iş günü | Çıkış koşulu |
| --- | --- | --- | --- |
| 0 | Plan, repository, agent rolleri, başlangıç ve CI | Bu başlangıç teslimi | Yerel kontroller ve ilk push |
| 1 | Art direction, model seçimi/üretim briefi, cutaway teknik prova | 2–3 | Dış/kabin aynı koordinatta, model hakkı ve kaynak belli |
| 2 | Hero, tek canvas, yükleme/fallback, bulut geçişi | 2–3 | İlk 34% akış ileri/geri sorunsuz |
| 3 | Kabin açılımı, hotspotlar, yatay uçuş ve kapanış | 3–4 | Altı bölüm bağlantılı, ana imza geçişleri tamam |
| 4 | Mobil, azaltılmış hareket, asset optimizasyonu | 2–3 | QA matrisi ve ölçülen bütçeler |
| 5 | Vercel preview, düzeltme, production, portfolyo kaydı | 1–2 | READY yayın + gerçek URL'de doğrulama |

Toplam ilk tahmin 10–15 odaklı iş günü; bu süre garanti veya agent çalışma süresi değildir. Sıfırdan yüksek kaliteli özel model gerekirse 3–7 ek iş günü planlanır. Model temini kritik yoldur; arayüz işi bununla paralel yürüyebilir. Task ayrıntıları [BACKLOG.md](BACKLOG.md) içindedir.

## 12. Agent çalışma düzeni

Ana agent ürün sahibi/entegratör olarak planı, ortak sözleşmeleri, paketleri ve yayını yönetir. creative_director görsel yönü; scene_engineer 3D yapıyı; motion_engineer zaman çizelgesini; interface_engineer erişilebilir arayüzü; quality_reviewer bağımsız doğrulamayı üstlenir. Eşzamanlı en fazla 3 uzman + ana agent çalışır.

Önce arayüz sözleşmesi sabitlenir, sonra dosya sahipliği ayrılır. Aynı dosyaya iki yazıcı atanmaz. Her görev kapsam, girdi, çıktı, bağımlılık ve kabul kriteriyle başlar. Alt agentlar doğrudan main'e push veya yayın yapmaz. [Agent mimarisi](AGENT-ARCHITECTURE.md), bu kuralları ve örnek iş paketlerini içerir.

## 13. Vercel akışı

GitHub deposu ilk aşamada private açılır. Vercel'e bu repository bağlandığında feature/PR branch'leri preview, main production kaynağı olur. GitHub CI build ve kalite kontrollerini yürütür. Bu iki sistemin çalışması kendi başına production için kalite kilidi oluşturmaz; main koruması ve gerekli kontrol ayrıca ayarlanır.

İlk ürün hiçbir gizli API anahtarı gerektirmez. Vercel projesi Node 22, Next.js preset, repository kökü ve `npm ci` kullanır. Final 3D deneyim hazır olduğunda preview üzerinden mobil/desktop QA yapılır, sonra production yayınlanır. Alan adı satın alma bu fazda yoktur. Adım adım kontrol ve geri dönüş [DEPLOYMENT.md](DEPLOYMENT.md) içinde.

## 14. Riskler ve karar noktaları

| Risk | Etki | Önlem / tetikleyici |
| --- | --- | --- |
| Modelin içi yok veya tek mesh | Kabin geçişi yapılamaz | Faz 1'de cutaway provası; gerekirse model düzenleme |
| Model lisansı web asset dağıtımına uygun değil | GitHub/public GLB teslimi sorunlu | Kaynak ve koşulları kaydet; uygun varlık üret/edin |
| Mobil GPU maliyeti | Takılma, ısınma | Lite geometri, DPR düşürme, statik alternatif |
| Çok uzun pin ve okuma aralığı | Kullanıcı kontrol kaybı | 6–8 viewport hareket mesafesini test et, mobil kısalt |
| Kamera/gövde geçişinde sıçrama | İmza deneyim bozulur | Tek progress, mutlak pose örnekleme, ileri/geri testi |
| DOM panel 3D'yi tamamen gizler | Yatay geçiş anlaşılmaz | Panelin iki yanına görünür giriş/çıkış boşluğu |
| Paralel dosya çakışması | Entegrasyon süresi artar | Dosya sahipliği, ortak sözleşmede tek yazıcı |

İlk geliştirme kararı, Faz 1'de kullanılacak dış gövde/kabin modelinin doğrulanmasıdır. Daha sonraki görsel cilalama bu teknik provanın üzerine kurulmalıdır.

## 15. Portfolyo teslim paketi

Çalışan Vercel URL'si, düzenli GitHub repository, desktop ve mobil ekran görüntüleri, üç ana geçişi gösteren 20–30 saniyelik ekran kaydı ve kısa bir case study. Case study problem, storyboard, teknik seçim, performans ölçümü ve kişisel katkıyı anlatır. Henüz ölçülmemiş başarı puanları veya yapılmamış üretim işleri yazılmaz.

## Teknik kaynaklar

- [Next.js kurulumu ve App Router](https://nextjs.org/docs/app/getting-started/installation)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP responsive motion](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
- [React Three Fiber performans](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Vercel GitHub entegrasyonu](https://vercel.com/docs/git/vercel-for-github)
- [Codex proje agent dosyaları](https://learn.chatgpt.com/docs/agent-configuration/subagents)

Kaynaklar 12 Eylül 2026 tarihinde kontrol edildi. Görsel kurgu, iş süreleri, asset bütçeleri ve görev dağılımı bu projeye ait tasarım kararlarıdır.
