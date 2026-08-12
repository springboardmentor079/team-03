/**
 * seedDatabase.js
 *
 * Populates a fresh deployment with:
 *   - 1 Master Admin user
 *   - 5 default Vendor profiles
 *   - 3 base Project Templates
 *
 * SAFETY: This script clears existing data before seeding. It refuses to
 * run against anything that isn't clearly the staging cluster. Do not
 * remove or weaken the guard below.
 *
 * Usage:
 *   npm run db:seed
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Model paths match your actual /backend/models filenames (lowercase).
const User = require('../models/user');
const Vendor = require('../models/vendor');
const Project = require('../models/project');
// NOTE: there is no dedicated ProjectTemplate model in this codebase.
// Templates are stored as Project documents with isTemplate: true.
// If you later add a real ProjectTemplate model, swap this out and
// update seedProjectTemplates() below accordingly.

const MONGO_URI = process.env.MONGODB_URI;

// ---------------------------------------------------------------------------
// Safety guard: refuse to run destructive seeding against production.
// Customize this check to whatever reliably distinguishes your clusters
// (e.g. cluster name, a dedicated STAGING_CONFIRM env var, etc).
// ---------------------------------------------------------------------------
function assertStagingEnvironment(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Aborting.');
  }

  const lowerUri = uri.toLowerCase();
  const looksLikeProd = lowerUri.includes('prod') || lowerUri.includes('production');
  const looksLikeStaging = lowerUri.includes('staging') || lowerUri.includes('stage') || lowerUri.includes('dev');

  if (looksLikeProd) {
    throw new Error(
      'Refusing to run: MONGODB_URI appears to point at a PRODUCTION cluster. ' +
      'This script clears data and must only run against staging.'
    );
  }

  if (!looksLikeStaging) {
    throw new Error(
      'Refusing to run: MONGODB_URI does not clearly indicate a staging cluster. ' +
      'Set SEED_CONFIRM=STAGING in your environment to override once you have ' +
      'manually verified the target, or rename your staging URI to include "staging".'
    );
  }

  // Extra explicit opt-in for defense in depth. Require this flag to be set
  // in the staging .env / shell before the script will proceed.
  if (process.env.SEED_CONFIRM !== 'STAGING') {
    throw new Error(
      'Refusing to run: SEED_CONFIRM env var is not set to "STAGING". ' +
      'Set SEED_CONFIRM=STAGING to confirm you intend to wipe and reseed this database.'
    );
  }
}

async function seedAdminUser() {
  // IMPORTANT: do NOT hash the password here. user.js has a pre('save')
  // hook that hashes automatically whenever the password field is set on
  // a new/modified document. Hashing it manually too would double-hash it
  // and silently break login (bcrypt.compare would never match).
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  const admin = await User.create({
    fullName: 'Master Admin',
    email: 'admin@buildtrack.com',
    password: plainPassword,
    role: 'Administrator',
  });

  console.log(`  ✓ Admin user created: ${admin.email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log('    (using default password — set SEED_ADMIN_PASSWORD env var to override)');
  }
}

async function seedVendors() {
  const vendors = [
    { vendorName: 'Apex Building Supplies', contactEmail: 'contact@apexsupplies.com', contactPhone: '555-010-1001', category: 'Materials' },
    { vendorName: 'Ironclad Steelworks', contactEmail: 'sales@ironcladsteel.com', contactPhone: '555-010-1002', category: 'Structural' },
    { vendorName: 'Summit Electrical Co.', contactEmail: 'info@summitelectrical.com', contactPhone: '555-010-1003', category: 'Electrical' },
    { vendorName: 'BluePipe Plumbing Supply', contactEmail: 'orders@bluepipe.com', contactPhone: '555-010-1004', category: 'Plumbing' },
    { vendorName: 'GreenScape Landscaping', contactEmail: 'hello@greenscape.com', contactPhone: '555-010-1005', category: 'Landscaping' },
  ];

  await Vendor.insertMany(vendors);
  console.log(`  ✓ ${vendors.length} vendor profiles created`);
}

async function seedProjectTemplates() {
  // Stored as Project documents flagged isTemplate: true.
  //
  // REQUIRES a small schema change in models/project.js — add this field:
  //   isTemplate: { type: Boolean, default: false }
  // Without it, Mongoose (strict mode, the default) silently drops
  // isTemplate on save, so these docs become indistinguishable from real
  // projects and the clear step below will never find them again on rerun.
  //
  // Field names below match project.js exactly: title, description,
  // startDate, endDate (must be after startDate), budget (min 1),
  // category (must be one of the schema's enum values), status.
  const templates = [
    {
      title: 'Residential Build - Standard',
      description: 'Default template for single-family residential construction projects.',
      startDate: new Date('2000-01-01'),
      endDate: new Date('2000-06-01'),
      budget: 1,
      category: 'Residential',
      status: 'Planning',
      isTemplate: true,
    },
    {
      title: 'Commercial Fit-Out',
      description: 'Template for interior commercial build-outs and renovations.',
      startDate: new Date('2000-01-01'),
      endDate: new Date('2000-06-01'),
      budget: 1,
      category: 'Commercial',
      status: 'Planning',
      isTemplate: true,
    },
    {
      title: 'Infrastructure - Small Scale',
      description: 'Template for small civil/infrastructure projects (roads, utilities).',
      startDate: new Date('2000-01-01'),
      endDate: new Date('2000-06-01'),
      budget: 1,
      category: 'Infrastructure',
      status: 'Planning',
      isTemplate: true,
    },
  ];

  await Project.insertMany(templates);
  console.log(`  ✓ ${templates.length} project templates created (Project docs, isTemplate: true)`);
}

async function run() {
  console.log('--- BuildTrack Database Seed Script ---');

  try {
    assertStagingEnvironment(MONGO_URI);
  } catch (err) {
    console.error(`\n✗ ${err.message}\n`);
    process.exit(1);
  }

  console.log('Connecting to MongoDB (staging)...');
  await mongoose.connect(MONGO_URI);
  console.log('  ✓ Connected');

  try {
    console.log('\nClearing existing seed-relevant data (staging only)...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      // Only remove template Project docs, not real project data that may
      // already exist in staging (e.g. from manual QA testing).
      Project.deleteMany({ isTemplate: true }),
    ]);
    console.log('  ✓ Cleared: all Users, all Vendors, Project docs where isTemplate=true');

    console.log('\nSeeding data...');
    await seedAdminUser();
    await seedVendors();
    await seedProjectTemplates();

    console.log('\n✓ Seed complete.');
  } catch (err) {
    console.error('\n✗ Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();