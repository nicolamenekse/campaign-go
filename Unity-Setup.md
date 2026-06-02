# Unity Mobil Oyun Kurulumu

Backend API hazır. Şimdi Unity mobil oyununu geliştirmek için temel adımlar.

## Ön Hazırlık

### Gereksinimler
- Unity Hub ve Unity Editor (2021.3 veya üzeri)
- Android SDK ve Build Tools (Android için)
- Xcode (iOS için - macOS gerekli)
- Git

## Proje Kurulumu

### 1. Unity Projesi Oluşturma
```bash
# Unity Hub'da "2D Mobile" veya "3D Mobile" template ile proje oluşturun
# Project name: CampaignGame
```

### 2. Platform Ayarları

#### Android Ayarları
- **File → Build Settings → Platform:** Android
- **Player Settings:**
  - Package Name: com.companyname.campaingame
  - Minimum API Level: Android 8.0 (API 26)
  - Target API Level: Latest
  - Scripting Backend: IL2CPP
  - API Compatibility Level: .NET Standard 2.1

#### iOS Ayarları
- **File → Build Settings → Platform:** iOS
- **Player Settings:**
  - Bundle Identifier: com.companyname.campaingame
  - Target minimum iOS Version: iOS 12.0

### 3. Permission Ayarları

#### Android Permissions (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### iOS Permissions (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Oyun içinde kampanyaları bulmak için konum bilgisi gerekli</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Arka planda kampanyaları takip etmek için konum bilgisi gerekli</string>
```

## Unity Script Kurulumu

### Gerekli Scriptler

#### 1. API Client (API iletişimi)
#### 2. Location Manager (GPS konum)  
#### 3. Campaign Manager (Kampanyalar)
#### 4. UI Controller (Arayüz)

## İpucular

### Test İçin Backend URL
- Development: `http://YOUR_PC_IP:5000` (PC IP adresinizi kullanın)
- Production: `https://your-backend-url.com`

### Konum Testi
- Unity Editor: GPS simülasyon için mock location kullanın
- Mobil cihaz: Gerçek GPS kullanır

### AR Entegrasyonu
- **AR Foundation** kullanın (Unity Paket Manager)
- **Vuforia** veya **Niantic Lightship** (opsiyonel)

## Sonraki Adımlar

1. Unity projeyi oluşturun
2. Scriptleri ekleyin
3. Build ayarlarını yapın
4. Mobile cihazda test edin
