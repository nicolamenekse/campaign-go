# Campaign Game API Backend

Pokémon Go benzeri konum tabanlı oyun için backend API. İşletme kampanyalarını gizleyip bulan kişilerin çekilişe katılabileceği bir sistem.

## Özellikler

- ✅ Kullanıcı kaydı ve JWT kimlik doğrulaması
- ✅ Kampanya yönetimi (CRUD işlemleri)
- ✅ Konum tabanlı kampanya bulma
- ✅ Kullanıcının yakındaki kampanyaları görme
- ✅ Çekiliş/lot sistemi
- ✅ Puan takibi

## Teknoloji Yığını

- **Backend:** Node.js + Express
- **Veritabanı:** MongoDB (Mongoose)
- **Kimlik Doğrulama:** JWT
- **Platform:** Unity (mobil uygulama için)

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (local veya cloud)

### Adımlar

1. Depoyu klonlayın
```bash
cd game-2
```

2. Bağımlılıkları yükleyin
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın
`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri düzenleyin:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campaign-game
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Önemli:** Gerçek production ortamında güçlü bir JWT_SECRET kullanın ve MongoDB URI'nizi güncelleyin.

4. MongoDB'yi başlatın
- Local: `mongod` komutu ile başlatın
- Cloud: MongoDB Atlas URI'sini `.env` dosyasına ekleyin

5. Sunucuyu başlatın
```bash
# Geliştirme modu (otomatik yeniden başlatma)
npm run dev

# Production modu
npm start
```

Sunucu `http://localhost:5000` adresinde çalışacak.

## API Endpoints

### Authentication (Kimlik Doğrulama)

#### Kayıt Ol
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "kullaniciadi",
  "email": "email@example.com",
  "password": "sifre123"
}
```

#### Giriş Yap
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "sifre123"
}
```

#### Mevcut Kullanıcı Bilgisi
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Campaigns (Kampanyalar)

#### Tüm Kampanyaları Getir
```http
GET /api/campaigns
```

#### Kampanya Detayı
```http
GET /api/campaigns/:id
```

#### Kampanya Oluştur
```http
POST /api/campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Kampanya Başlığı",
  "description": "Kampanya açıklaması",
  "businessName": "İşletme Adı",
  "latitude": 41.0082,
  "longitude": 28.9784,
  "address": "Adres bilgisi",
  "reward": "Ödül açıklaması",
  "raffleId": "raffle_id",
  "difficulty": "medium",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

#### Kampanya Güncelle
```http
PUT /api/campaigns/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Yeni Başlık",
  "isActive": false
}
```

#### Kampanya Sil
```http
DELETE /api/campaigns/:id
Authorization: Bearer <token>
```

### Locations (Konumlar)

#### Yakındaki Kampanyaları Bul
```http
GET /api/locations/nearby?latitude=41.0082&longitude=28.9784&radius=1000
Authorization: Bearer <token>
```

- `latitude`: Kullanıcının enlem koordinatı
- `longitude`: Kullanıcının boylam koordinatı  
- `radius`: Arama yarıçapı (metre cinsinden, varsayılan 1000m)

#### Kampanya Bul (Konuma varınca)
```http
POST /api/locations/find/:campaignId
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 41.0082,
  "longitude": 28.9784
}
```

#### Kullanıcının Bulduğu Kampanyalar
```http
GET /api/locations/found
Authorization: Bearer <token>
```

### Raffles (Çekilişler)

#### Tüm Çekilişleri Getir
```http
GET /api/raffles
```

#### Çekiliş Detayı
```http
GET /api/raffles/:id
```

#### Çekiliş Oluştur
```http
POST /api/raffles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Büyük Ödül Çekilişi",
  "description": "Açıklama",
  "prize": "iPhone 15",
  "totalWinners": 3,
  "drawDate": "2024-12-31T23:59:59Z"
}
```

#### Çekilişe Katıl
```http
POST /api/raffles/:raffleId/participate
Authorization: Bearer <token>
```

#### Kazananları Seç
```http
POST /api/raffles/:raffleId/draw
Authorization: Bearer <token>
```

#### Çekiliş Güncelle
```http
PUT /api/raffles/:id
Authorization: Bearer <token>
```

#### Çekiliş Sil
```http
DELETE /api/raffles/:id
Authorization: Bearer <token>
```

## Veritabanı Şeması

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  score: Number (default: 0),
  foundCampaigns: [ObjectId],
  raffleEntries: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Campaign Model
```javascript
{
  title: String (required),
  description: String (required),
  businessName: String (required),
  location: {
    type: "Point",
    coordinates: [longitude, latitude],
    address: String
  },
  reward: String (required),
  raffle: ObjectId (ref: Raffle),
  difficulty: String (easy|medium|hard),
  totalFinds: Number (default: 0),
  isActive: Boolean (default: true),
  startDate: Date,
  endDate: Date
}
```

### Raffle Model
```javascript
{
  title: String (required),
  description: String (required),
  prize: String (required),
  totalWinners: Number (default: 1),
  participants: [{ user: ObjectId, entryDate: Date }],
  winners: [{ user: ObjectId, wonDate: Date }],
  drawDate: Date (required),
  isDrawn: Boolean (default: false),
  isActive: Boolean (default: true)
}
```

### FoundCampaign Model
```javascript
{
  user: ObjectId (ref: User, required),
  campaign: ObjectId (ref: Campaign, required),
  foundAt: Date,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  pointsEarned: Number (default: 10)
}
```

## Unity Entegrasyonu

Backend API'yi Unity ile entegre etmek için:

1. **HTTP İstekleri:** Unity'de `UnityWebRequest` veya REST API kütüphaneleri kullanın
2. **JWT Token:** Giriş sonrası token'ı saklayın ve her istekte `Authorization` header'ında gönderin
3. **GPS:** Unity'nin `LocationService` kullanarak kullanıcı konumunu alın
4. **Konum Mesafesi:** Kampanya bulma için 50 metre içinde olma kontrolü

Örnek Unity C# kodu (basit):
```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Text;

public class APIClient : MonoBehaviour
{
    private string baseUrl = "http://localhost:5000/api";
    private string token;

    // Giriş
    public IEnumerator Login(string email, string password)
    {
        string json = $"{{\"email\":\"{email}\",\"password\":\"{password}\"}}";
        using (UnityWebRequest request = new UnityWebRequest($"{baseUrl}/auth/login", "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(json));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                // Token'ı kaydet
                var response = JsonUtility.FromJson<LoginResponse>(request.downloadHandler.text);
                token = response.token;
            }
        }
    }

    // Yakındaki kampanyaları bul
    public IEnumerator GetNearbyCampaigns(float lat, float lon)
    {
        using (UnityWebRequest request = UnityWebRequest.Get($"{baseUrl}/locations/nearby?latitude={lat}&longitude={lon}"))
        {
            request.SetRequestHeader("Authorization", $"Bearer {token}");
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                // Kampanyaları işle
            }
        }
    }
}
```

## Hata Yakalama

API şu HTTP durum kodlarını kullanır:

- `200 OK`: Başarılı işlem
- `201 Created`: Kayıt oluşturma başarılı
- `400 Bad Request`: Geçersiz istek verileri
- `401 Unauthorized`: Yetkilendirme hatası veya geçersiz token
- `404 Not Found`: Kaynak bulunamadı
- `500 Internal Server Error`: Sunucu hatası

Hata yanıtı formatı:
```json
{
  "message": "Hata mesajı",
  "error": "Detaylı hata bilgisi"
}
```

## Güvenlik Notları

- Production ortamında `JWT_SECRET` değerini güçlü ve benzersiz bir string yapın
- HTTPS kullanın
- Rate limiting (istek sınırlama) ekleyin
- Input validation için express-validator kullanılmıştır
- Şifreler bcrypt ile hashlenir

## Gelecek Özellikler

- [ ] Admin paneli
- [ ] Real-time bildirimler (Socket.io)
- [ ] Resim yükleme kampanyalar için
- [ ] Liderlik tablosu
- [ ] Sosyal medya paylaşımı
- [ ] Analytics ve raporlama

## Lisans

ISC
