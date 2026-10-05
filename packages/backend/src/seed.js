const { connect } = require('./db');
const User = require('./models/User');
const Bundle = require('./models/Bundle');
const bcrypt = require('bcryptjs');

async function seed() {
  await connect();
  console.log('Seeding CelluLite Data database...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@cellulite.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMeNow@99!';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    admin = new User({ name: 'Admin', email: adminEmail, passwordHash, roles: ['Admin'] });
    await admin.save();
    console.log('Created admin user:', adminEmail);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  const bundleSeed = [
    { bundleId: 'mtn-1gb', network: 'MTN', size: '1GB', validity: '7 Days', price: 6.0, providerCost: 4.5, isPopular: false },
    { bundleId: 'mtn-5gb', network: 'MTN', size: '5GB', validity: '30 Days', price: 15.0, providerCost: 10.5, isPopular: true },
    { bundleId: 'mtn-10gb', network: 'MTN', size: '10GB', validity: '30 Days', price: 20.0, providerCost: 14.5, isPopular: true },
    { bundleId: 'telecel-3gb', network: 'Telecel', size: '3GB', validity: '14 Days', price: 10.0, providerCost: 7.0, isPopular: false },
    { bundleId: 'telecel-8gb', network: 'Telecel', size: '8GB', validity: '30 Days', price: 22.5, providerCost: 16.0, isPopular: true },
    { bundleId: 'airtel-2gb', network: 'AirtelTigo', size: '2GB', validity: '7 Days', price: 7.0, providerCost: 5.0, isPopular: false },
    { bundleId: 'airtel-12gb', network: 'AirtelTigo', size: '12GB', validity: '30 Days', price: 32.0, providerCost: 23.0, isPopular: true },
  ];

  for (const bundle of bundleSeed) {
    const exists = await Bundle.findOne({ bundleId: bundle.bundleId });
    if (!exists) {
      await new Bundle({ ...bundle, active: true }).save();
      console.log('Created bundle', bundle.bundleId);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
