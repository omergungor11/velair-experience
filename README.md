# VELAIR — Above the Ordinary

Özel jetler üzerine, scroll ile ilerleyen bir 3D portfolyo deneyimi. VELAIR bu proje için seçilmiş bir çalışma adıdır; marka uygunluğu araştırılmış değildir.

**Durum: Faz 0 / plan ve proje temeli.** Bu commit tipografik başlangıç sayfasını, uyumlu bağımlılıkları, sahne sözleşmelerini, kalite kontrollerini ve agent yapılandırmasını içerir. 3D uçak, bulutlar, kabin açılımı ve scroll animasyonları henüz uygulanmadı. Vercel yapılandırması hazır; uzak proje bağlantısı ve yayın henüz yapılmadı.

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

Lint, TypeScript, scroll bölüm sınırı testleri ve production build çalışır. Next.js type dosyaları `dev`, `build` veya `typecheck` sırasında oluşur.

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

Next.js App Router, React, TypeScript, Three.js, React Three Fiber, Drei, GSAP/ScrollTrigger, CSS tokenları, GitHub Actions, Vercel. Paketler tam sürüme sabittir; `package-lock.json` kaynak kabul edilir. React 19.2.8, Fiber 9.7.0'ın `>=19 <19.3` peer aralığına göre seçildi. Lenis ilk sürümde eklenmedi; doğal scroll temel davranış olacak.

## Agent kullanımı

Bu klasörü proje kökü olarak açın. Önce [AGENTS.md](AGENTS.md), sonra görevle ilgili belge okunur. `.codex/agents/` altında beş uzman rol bulunur; ana agent entegrasyonu yürütür. Dosyalar kendiliğinden iş başlatmaz. Model ve düşünme ayarları ana oturumdan devralınır.

Örnek sonraki geliştirme talimatı:

> VELAIR Faz 1'i başlat. creative_director ile görsel yön ve asset briefini, scene_engineer ile dış gövde/kabin teknik provasını paralel yürüt. Motion ve arayüz entegrasyonunu ortak sözleşmeleri doğruladıktan sonra yap. docs/BACKLOG.md kabul kriterleriyle sonucu doğrula.

Üç boyutlu model ve diğer görsel dosyalar edinildiğinde [asset kayıt tablosuna](docs/ASSETS.md) kaynak ve kullanım koşulları eklenir. Gerçek uçuş rezervasyonu, ödeme veya operasyon hizmeti yoktur.
