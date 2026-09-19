const { connect } = require('./db');
const User = require('./models/User');
const Plan = require('./models/Plan');
const bcrypt = require('bcryptjs');

async function seed() {
  await connect();
  console.log('Seeding DB...');

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

  const plans = [
    { id: 'plan_basic', title: '1GB', price: 1.5, currency: 'GHS', validityDays: 7, description: '1GB data for 7 days' },
    { id: 'plan_standard', title: '3GB', price: 3.5, currency: 'GHS', validityDays: 30, description: '3GB data for 30 days' },
    { id: 'plan_premium', title: '10GB', price: 10.0, currency: 'GHS', validityDays: 30, description: '10GB data for 30 days' }
  ];

  for (const p of plans) {
    const exists = await Plan.findOne({ id: p.id });
    if (!exists) {
      await new Plan(p).save();
      console.log('Created plan', p.id);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
