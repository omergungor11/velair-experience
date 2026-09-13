# Vercel yayın planı

**Şimdiki durum:** `ambalajcini-vercel/velair-experience` oluşturuldu, GitHub main bağlandı ve demo production ortamında READY. Canlı adres: [velair-experience.vercel.app](https://velair-experience.vercel.app). Commit, CI ve deployment kanıtları [STATUS.md](STATUS.md) içinde. Aşağıdaki akış sonraki sürümler için runbook'tur.

## Proje ayarları

| Ayar | Değer |
| --- | --- |
| Repository | `omergungor11/velair-experience` |
| Project / team | `velair-experience` / `ambalajcini-vercel` |
| Framework | Next.js |
| Root Directory | Repository kökü `.` |
| Node | 22.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output Directory | Framework varsayılanı |
| Production branch | `main` |
| İlk sürüm secrets | Gerekmiyor |

## GitHub entegrasyonu

1. Doğru Vercel hesabı/team'i mevcut bağlantıdan doğrula.
2. GitHub integration'a sadece bu repository erişimini vererek import et; aynı isimde proje varsa önce mevcut bağlantıyı incele.
3. Yukarıdaki ayarları doğrula. İlk importun production build başlatabileceğini hesaba kat; bu işlem bitmiş ürün yayın fazında yapılır.
4. Feature branch/PR push'u ile preview oluştur. İlgili commit SHA, deployment URL ve build sonucunu eşleştir.
5. Deployment `READY` olana kadar build durumunu ve hataları incele; yalnızca URL üretilmesini başarı sayma.
6. Preview URL'sinde QA senaryolarını çalıştır. Korumalı preview için platform erişim yöntemini kullan.
7. Main üzerinde gerekli kalite kontrolünü branch protection/ruleset ile tanımla; özelliğin hesap/repo planında kullanılabilirliğini kontrol et. Dışarıdan tanımlanmadıysa bunu etkinmiş gibi raporlama.
8. Kabul edilmiş değişikliği main'e al; production sonucu ve alias'ı doğrula.

Vercel Git integration PR/feature branch preview'ları sunar. CI ve Vercel build bağımsız çalışabilir; CI workflow dosyasının varlığı production'ı otomatik bloke etmez. İlk commit'te branch protection kurulmuş değildir. Kaynak: [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github).

## CLI alternatifi

Platformda Git import kullanılamıyorsa, hazır ürünün kökünden mevcut auth ile:

```bash
vercel link
vercel deploy
vercel inspect <gercek-preview-url>
```

Doğrulanmış preview'ı production'a almak için platformun güncel promote akışı kullanılabilir; CLI çalıştırmadan önce ilgili projeyi/team'i doğrula. Yanlış projeye `--yes` ile kör bağlantı yapılmaz. Bu belgede yer tutucu URL'ler çalıştırılmaz.

CI için Vercel token'ı eklemek bu projenin başlangıç yolu değildir; Git integration tercih edilir. Daha sonra özel CI dağıtımı gerekirse gerekli sırlar repository settings üzerinden eklenir, dosyalara yazılmaz.

## Yayın öncesi

`npm ci` ve `npm run check` temiz ortamda geçmeli. Asset yolları, büyük harf/küçük harf Linux uyumu ve varsa GLB decoder dosyaları doğrulanmalı. Mevcut demo GLB yüklemez. Gerçek canonical URL belli olduğunda metadataBase/canonical eklenmeli; starter'ın `robots: noindex` ayarı yalnızca production sunuma hazırken kaldırılmalı. Preview indexing davranışı platformda ayrıca kontrol edilmeli. Demo için noindex korunur; final portfolyo lansmanında tekrar değerlendirilir. Alan adı satın alma veya DNS değişimi bu plan kapsamında yapılmaz.

## Yayın sonrası ve geri dönüş

Gerçek production URL'sinde hero, kabin, yatay uçuş, mobil ve fallback kontrol edilir. Console ve başarısız network request'leri taranır; varsa runtime/build log hataları incelenir. Commit SHA, deployment ID, alias ve zaman `docs/STATUS.md` içine yazılır.

Önceki çalışan deployment varsa Vercel dashboard/CLI rollback ile alias ona döndürülür; sonra hata yeni bir düzeltme commit'iyle ele alınır. İlk yayında önceki çalışan deployment bulunmayabilir; bunu varsayma. Git geçmişi force push ile geri yazılmaz.
