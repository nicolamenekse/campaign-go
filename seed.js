require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Raffle = require('./models/Raffle');
const FoundCampaign = require('./models/FoundCampaign');

const seedDatabase = async () => {
  try {
    // Veritabanı bağlantısı
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut verileri temizle
    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Raffle.deleteMany({});
    await FoundCampaign.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Kullanıcı oluştur
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        score: 0
      },
      {
        username: 'oyuncu1',
        email: 'oyuncu1@example.com',
        password: 'oyuncu123',
        score: 0
      },
      {
        username: 'oyuncu2',
        email: 'oyuncu2@example.com',
        password: 'oyuncu123',
        score: 0
      }
    ]);
    console.log('Kullanıcılar oluşturuldu');

    // Çekilişler oluştur
    const raffles = await Raffle.create([
      {
        title: 'iPhone 15 Çekilişi',
        description: 'En aktif oyunculara özel iPhone 15 çekilişi',
        prize: 'iPhone 15 Pro',
        totalWinners: 3,
        drawDate: new Date('2025-12-31T23:59:59Z')
      },
      {
        title: 'Yıllık Abonelik Çekilişi',
        description: 'Premium abonelik kazananları belirlenecek',
        prize: '1 Yıllık Premium Üyelik',
        totalWinners: 10,
        drawDate: new Date('2025-06-30T23:59:59Z')
      },
      {
        title: 'Sürpriz Hediye Çekilişi',
        description: 'Kampanya bulanlara özel sürpriz çekiliş',
        prize: '500 TL Hediye Çeki',
        totalWinners: 5,
        drawDate: new Date('2025-09-15T23:59:59Z')
      }
    ]);
    console.log('Çekilişler oluşturuldu');

    // Kampanyalar oluştur
    const campaigns = await Campaign.create([
      {
        title: 'İstanbul Kafe Kampanyası',
        description: 'En sevdiğimiz kafede özel kampanya',
        businessName: 'Starbucks Kadıköy',
        location: {
          type: 'Point',
          coordinates: [29.0292, 40.9901],
          address: 'Caferağa, Bahariye Cd. No:2, 34710 Kadıköy/İstanbul'
        },
        reward: 'Ücretsiz içecek kuponu',
        raffle: raffles[0]._id,
        difficulty: 'medium',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      {
        title: 'Ankara Restoran Kampanyası',
        description: 'Türk mutfağının en iyileri',
        businessName: 'Hamdi Restaurant',
        location: {
          type: 'Point',
          coordinates: [32.8616, 39.9334],
          address: 'Kalaba, Kültür Sk. No:5, 06050 Altındağ/Ankara'
        },
        reward: '%20 indirim kuponu',
        raffle: raffles[1]._id,
        difficulty: 'easy',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      {
        title: 'İzmir Sahil Kampanyası',
        description: 'Ege\'nin en güzel mekanları',
        businessName: 'Mavi Butik Hotel',
        location: {
          type: 'Point',
          coordinates: [27.1384, 38.4237],
          address: 'Alsancak, 1371 Sk. No:16, 35210 Konak/İzmir'
        },
        reward: 'Ücretsiz oda gece',
        raffle: raffles[2]._id,
        difficulty: 'hard',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      {
        title: 'Antik Dönüşüm Kampanyası',
        description: 'Tarihi keşfetme kampanyası',
        businessName: 'Müze On İki',
        location: {
          type: 'Point',
          coordinates: [27.1427, 38.4257],
          address: 'Kültür, 1463 Sk. No:4, 35210 Konak/İzmir'
        },
        reward: 'Ücretsiz müze giriş',
        raffle: raffles[0]._id,
        difficulty: 'medium',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      },
      {
        title: 'Capital Mall Kampanyası',
        description: 'Alışveriş severler için özel kampanya',
        businessName: 'Capital Mall Ankara',
        location: {
          type: 'Point',
          coordinates: [32.8496, 39.8994],
          address: 'Çukurambar, Barış Blv. No:5, 06530 Çankaya/Ankara'
        },
        reward: '100 TL alışveriş çeki',
        raffle: raffles[1]._id,
        difficulty: 'easy',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    ]);
    console.log('Kampanyalar oluşturuldu');

    console.log('\n✅ Seed data başarıyla eklendi!');
    console.log(`📊 ${users.length} kullanıcı oluşturuldu`);
    console.log(`🎁 ${raffles.length} çekiliş oluşturuldu`);
    console.log(`📍 ${campaigns.length} kampanya oluşturuldu`);

    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
};

seedDatabase();
