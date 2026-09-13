# VELAIR — Above the Ordinary

Özel jetler üzerine, scroll ile ilerleyen bir 3D portfolyo deneyimi. VELAIR bu proje için seçilmiş bir çalışma adıdır; marka uygunluğu araştırılmış değildir.

**[Canlı demo → velair-experience.vercel.app](https://velair-experience.vercel.app)**

**Durum: yayınlanmış 3D demo.** Tepeden jet görünümü, bulut geçişi, açılan kabin, üç kabin açıklaması, panel arkasından yatay uçuş ve kapanış tek scroll akışında çalışır. Mobil kadraj, hareketi azalt seçeneği ve WebGL kullanılamadığında aynı modelden üretilen statik görseller bulunur. Yayın ve test kanıtları [durum kaydında](docs/STATUS.md) tutulur.

Uçak bu proje için kodla üretilen özgün bir konsept modeldir; bir üreticinin sertifikalı yerleşimini temsil etmez. Sonraki kalite turu gerçek cihaz ölçümleri, özel model/LOD ve portfolyo case study çalışmasını kapsar.

## Başlangıç

Node.js 22 kullanın.

```bash
npm ci
npm run dev
```

Yerel adres: http://localhost:3000

```bash
npm run check
```

Lint, TypeScript, bölüm/pose/mobil kadraj için 11 test ve production build çalışır. Next.js type dosyaları `dev`, `build` veya `typecheck` sırasında oluşur.

## Proje belgeleri

- [Kapsamlı proje planı](docs/PLAN.md)
- [Scroll storyboard ve motion kuralları](docs/MOTION.md)
- [Teknik mimari](docs/ARCHITECTURE.md)
- [3D asset üretim ve lisans planı](docs/ASSETS.md)
- [Agent mimarisi ve kullanım](docs/AGENT-ARCHITECTURE.md)
- [Görev sırası ve kabul kriterleri](docs/BACKLOG.md)
- [QA ve performans hedefleri](docs/QA.md)
- [Vercel yayın akışı](docs/DEPLOYMENT.md)
- [Doğrulama kaydı](docs/STATUS.md)

## Stack

Next.js App Router, React, TypeScript, Three.js, React Three Fiber, Drei, GSAP/ScrollTrigger, CSS tokenları, GitHub Actions, Vercel. Paketler tam sürüme sabittir; `package-lock.json` kaynak kabul edilir. React 19.2.8, Fiber 9.7.0'ın `>=19 <19.3` peer aralığına göre seçildi. Lenis eklenmedi; doğal scroll kullanılır.

## Agent kullanımı

Bu klasörü proje kökü olarak açın. Önce [AGENTS.md](AGENTS.md), sonra görevle ilgili belge okunur. `.codex/agents/` altında beş uzman rol bulunur; ana agent entegrasyonu yürütür. Dosyalar kendiliğinden iş başlatmaz. Model ve düşünme ayarları ana oturumdan devralınır.

Geliştirme sırasında scene_engineer ve motion_engineer ayrılmış dosyalarda çalıştı; quality_reviewer bağımsız inceleme yaptı. Entegratör arayüzü, fallback akışını, testleri ve yayını birleştirdi. Görevlerin kabul durumları [backlog](docs/BACKLOG.md) içinde.

Görsellerin kaynağı ve dosya boyutları [asset kaydında](docs/ASSETS.md) bulunur. Gerçek uçuş rezervasyonu, ödeme veya operasyon hizmeti yoktur.
