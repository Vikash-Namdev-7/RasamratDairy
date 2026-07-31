require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const Category = require('./models/Category');
const Product = require('./models/Product');
const Zone = require('./models/Zone');
const Customer = require('./models/Customer');
const Admin = require('./models/Admin');
const Order = require('./models/Order');
const Subscription = require('./models/Subscription');

const seedData = async () => {
  try {
    console.log('🔄 Connecting to Database for Seeding...');
    await connectDB();

    console.log('🧹 Clearing old MongoDB collections...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Zone.deleteMany({});
    await Customer.deleteMany({});
    await Admin.deleteMany({});
    await Order.deleteMany({});
    await Subscription.deleteMany({});

    console.log('🌱 Inserting Categories...');
    const insertedCategories = await Category.insertMany([
      { name: 'Doodh', slug: 'doodh', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', tagline: 'Roz subah farm se seedha packed taaza doodh' },
      { name: 'Dahi', slug: 'dahi', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80', tagline: 'Gada, mitha aur shuddh desi dahi' },
      { name: 'Paneer', slug: 'paneer', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80', tagline: 'Soft & fresh malai paneer' },
      { name: 'Desi Ghee', slug: 'ghee', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80', tagline: 'Danedar aur khushboodar gaay ka ghee' },
      { name: 'Makhan', slug: 'makhan', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80', tagline: 'Ghar jaisa safed aur peela fresh makhan' }
    ]);

    const categoryMap = {};
    insertedCategories.forEach((c) => {
      categoryMap[c.slug] = c._id;
    });

    console.log('🌱 Inserting Delivery Zones...');
    const insertedZones = await Zone.insertMany([
      { name: 'Nazdeek Area (0-1 km)', distanceLabel: '0-1 km', minOrderAmount: 100, deliveryFee: 0, isActive: true, description: 'Farm-local fast delivery, minimum order ₹100.' },
      { name: 'Madhyam Doori (1-2 km)', distanceLabel: '1-2 km', minOrderAmount: 150, deliveryFee: 15, isActive: true, description: 'City neighborhood delivery, minimum order ₹150.' },
      { name: 'Door Ke Gaon (2 km+)', distanceLabel: '2 km+', minOrderAmount: 200, deliveryFee: 25, isActive: true, description: 'Extended regional delivery, minimum order ₹200.' }
    ]);

    console.log('🌱 Inserting Products...');
    const insertedProducts = await Product.insertMany([
      {
        name: 'Full Cream Doodh',
        categorySlug: 'doodh',
        categoryId: categoryMap['doodh'],
        price: 32,
        unit: '500ml',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 42,
        inStock: true,
        badge: 'Bestseller',
        description: 'Shuddh aur gaadha full cream doodh (6.0% Fat).'
      },
      {
        name: 'Toned Doodh',
        categorySlug: 'doodh',
        categoryId: categoryMap['doodh'],
        price: 26,
        unit: '500ml',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        reviewCount: 28,
        inStock: true,
        description: 'Light aur healthy toned milk (3.0% Fat).'
      },
      {
        name: 'Desi Gaay Ka Doodh',
        categorySlug: 'doodh',
        categoryId: categoryMap['doodh'],
        price: 35,
        unit: '500ml',
        image: 'https://images.unsplash.com/photo-1527153857715-3908f2bf5bf8?auto=format&fit=crop&w=400&q=80',
        rating: 4.95,
        reviewCount: 35,
        inStock: true,
        badge: 'A2 Quality',
        description: 'Pure A2 Desi cow milk directly from local dairy farms.'
      },
      {
        name: 'Taaza Dahi',
        categorySlug: 'dahi',
        categoryId: categoryMap['dahi'],
        price: 28,
        unit: '250g',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 19,
        inStock: true,
        badge: 'Fresh Daily',
        description: 'Traditional matka dahi with rich creamy layer.'
      },
      {
        name: 'Taaza Malai Paneer',
        categorySlug: 'paneer',
        categoryId: categoryMap['paneer'],
        price: 90,
        unit: '250g',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
        rating: 4.85,
        reviewCount: 54,
        inStock: true,
        badge: 'Soft & Fresh',
        description: 'Handcrafted soft cottage cheese for delicious recipes.'
      },
      {
        name: 'Shuddh Desi Ghee',
        categorySlug: 'ghee',
        categoryId: categoryMap['ghee'],
        price: 340,
        unit: '500ml',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
        rating: 4.98,
        reviewCount: 88,
        inStock: true,
        badge: 'Pure Bilona',
        description: 'Aromatic golden ghee made using traditional Vedic bilona method.'
      }
    ]);

    console.log('🔑 Hashing passwords for customers & admin...');
    const testPasswordHash = await bcrypt.hash('customer123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    console.log('🌱 Inserting Admin Account...');
    await Admin.create({
      name: 'Dukaan Admin',
      email: 'admin@rasamrat.com',
      passwordHash: adminPasswordHash,
      role: 'super-admin'
    });

    console.log('🌱 Inserting Customers...');
    const insertedCustomers = await Customer.insertMany([
      {
        name: 'Test Customer',
        email: 'customer@rasamrat.com',
        phone: '9876543210',
        passwordHash: testPasswordHash,
        addresses: [{ label: 'Home', fullAddress: '123, Nayapura Main Road, Indore', zoneId: insertedZones[0]._id }]
      },
      {
        name: 'Rekha Sharma',
        email: 'rekha@rasamrat.com',
        phone: '+91 98260 12345',
        passwordHash: testPasswordHash,
        addresses: [{ label: 'Home', fullAddress: '123, Nayapura Main Road, Indore', zoneId: insertedZones[0]._id }]
      },
      {
        name: 'Suresh Patel',
        email: 'suresh@rasamrat.com',
        phone: '+91 94250 67890',
        passwordHash: testPasswordHash,
        addresses: [{ label: 'Home', fullAddress: '45, Scheme No 54, Vijay Nagar, Indore', zoneId: insertedZones[1]._id }]
      }
    ]);

    console.log('🌱 Inserting Orders...');
    await Order.insertMany([
      {
        orderNumber: 'ORD-1082',
        customerId: insertedCustomers[1]._id,
        customerName: 'Rekha Sharma',
        customerPhone: '+91 98260 12345',
        items: [
          { productId: insertedProducts[0]._id, name: 'Full Cream Doodh', price: 32, qty: 2 },
          { productId: insertedProducts[3]._id, name: 'Taaza Dahi', price: 28, qty: 1 }
        ],
        subtotal: 92,
        deliveryFee: 0,
        totalPayable: 92,
        zoneId: insertedZones[0]._id,
        zoneName: 'Nazdeek Area (0-1 km)',
        address: '123, Nayapura Main Road, Indore',
        status: 'pending'
      },
      {
        orderNumber: 'ORD-1081',
        customerId: insertedCustomers[2]._id,
        customerName: 'Suresh Patel',
        customerPhone: '+91 94250 67890',
        items: [
          { productId: insertedProducts[5]._id, name: 'Shuddh Desi Ghee', price: 340, qty: 1 },
          { productId: insertedProducts[4]._id, name: 'Taaza Malai Paneer', price: 90, qty: 1 }
        ],
        subtotal: 430,
        deliveryFee: 15,
        totalPayable: 445,
        zoneId: insertedZones[1]._id,
        zoneName: 'Madhyam Doori (1-2 km)',
        address: '45, Scheme No 54, Vijay Nagar, Indore',
        status: 'accepted',
        deliveryTime: '45 minutes me'
      }
    ]);

    console.log('🌱 Inserting Subscriptions...');
    await Subscription.insertMany([
      {
        customerId: insertedCustomers[1]._id,
        customerName: 'Rekha Sharma',
        customerPhone: '+91 98260 12345',
        address: '123, Nayapura Main Road, Indore',
        productId: insertedProducts[0]._id,
        milkTypeId: 'milk-full-cream',
        milkTypeName: 'Full Cream Doodh',
        litres: 1.5,
        slot: 'morning',
        status: 'active',
        pausedDates: []
      },
      {
        customerId: insertedCustomers[2]._id,
        customerName: 'Suresh Patel',
        customerPhone: '+91 94250 67890',
        address: '45, Scheme No 54, Vijay Nagar, Indore',
        productId: insertedProducts[1]._id,
        milkTypeId: 'milk-toned',
        milkTypeName: 'Toned Doodh',
        litres: 1,
        slot: 'morning',
        status: 'active',
        pausedDates: []
      }
    ]);

    console.log(`✅ Database Seeding Complete!`);
    console.log(`👤 Customer Test Login: customer@rasamrat.com / customer123`);
    console.log(`🛡️ Admin Test Login: admin@rasamrat.com / admin123`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();
