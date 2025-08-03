import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import dbConnect from "../lib/mongodb.js";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import UserOrder from "../models/UserOrder.js";
import Notification from "../models/Notification.js";

async function seedAdminData() {
  try {
    await dbConnect();
    console.log("✅ Connected to database!");

    // Clear all existing data for a fresh start
    await Promise.all([
      Admin.deleteMany({}),
      User.deleteMany({}),
      Customer.deleteMany({}),
      Order.deleteMany({}),
      UserOrder.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("🧹 Cleared all existing data from Admin, User, Customer, Order, UserOrder, and Notification collections.");

    // Seed Admins
    const admins = [
      {
        email: "admin@dinarexchange.co.nz",
        password: "admin123!",
        firstName: "Super",
        lastName: "Admin",
        role: "admin",
        permissions: {
          canViewOrders: true,
          canEditOrders: true,
          canDeleteOrders: true,
          canViewCustomers: true,
          canEditCustomers: true,
          canViewAnalytics: true,
          canManageAdmins: true,
          canViewAuditLog: true,
        },
        isActive: true,
      },
      {
        email: "manager@dinarexchange.co.nz",
        password: "manager123!",
        firstName: "John",
        lastName: "Manager",
        role: "manager",
        permissions: {
          canViewOrders: true,
          canEditOrders: true,
          canDeleteOrders: false,
          canViewCustomers: true,
          canEditCustomers: true,
          canViewAnalytics: true,
          canManageAdmins: false,
          canViewAuditLog: true,
        },
        isActive: true,
      },
      {
        email: "support@dinarexchange.co.nz",
        password: "support123!",
        firstName: "Jane",
        lastName: "Support",
        role: "support",
        permissions: {
          canViewOrders: true,
          canEditOrders: false,
          canDeleteOrders: false,
          canViewCustomers: true,
          canEditCustomers: false,
          canViewAnalytics: false,
          canManageAdmins: false,
          canViewAuditLog: false,
        },
        isActive: true,
      },
    ];

    await Admin.insertMany(admins);
    console.log("✅ Seeded admin users.");

    // Seed Users
    const users = [
      {
        email: "john.doe@gmail.com",
        trustedIPs: ["192.168.1.100"],
        magicKey: "user-1-magic-key",
      },
      {
        email: "jane.smith@yahoo.com",
        trustedIPs: ["192.168.1.101"],
        magicKey: "user-2-magic-key",
      },
      {
        email: "mike.johnson@hotmail.com",
        trustedIPs: ["192.168.1.102"],
        magicKey: "user-3-magic-key",
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Seeded users.");

    // Seed Customers
    const customers = [
      {
        userId: createdUsers[0]._id,
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: new Date("1985-05-15"),
          nationality: "New Zealand",
          phoneNumber: "+64 21 123 4567",
        },
        address: {
          street: "123 Queen Street",
          city: "Auckland",
          state: "Auckland",
          country: "New Zealand",
          postalCode: "1010",
        },
        verification: {
          isVerified: true,
          verificationLevel: "enhanced",
          kycStatus: "approved",
        },
        riskProfile: {
          riskLevel: "low",
        },
        accountMetrics: {
          totalOrders: 5,
          totalVolume: 25000,
          averageOrderValue: 5000,
        },
        flags: {
          isVIP: true,
        },
        accountStatus: "active",
      },
      {
        userId: createdUsers[1]._id,
        personalInfo: {
          firstName: "Jane",
          lastName: "Smith",
          dateOfBirth: new Date("1990-08-22"),
          nationality: "New Zealand",
          phoneNumber: "+64 21 234 5678",
        },
        address: {
          street: "456 Ponsonby Road",
          city: "Auckland",
          state: "Auckland",
          country: "New Zealand",
          postalCode: "1011",
        },
        verification: {
          isVerified: false,
          verificationLevel: "basic",
          kycStatus: "pending",
        },
        riskProfile: {
          riskLevel: "medium",
        },
        accountMetrics: {
          totalOrders: 2,
          totalVolume: 3000,
          averageOrderValue: 1500,
        },
        flags: {
          requiresApproval: true,
        },
        accountStatus: "active",
      },
      {
        userId: createdUsers[2]._id,
        personalInfo: {
          firstName: "Mike",
          lastName: "Johnson",
          dateOfBirth: new Date("1978-12-03"),
          nationality: "Australia",
          phoneNumber: "+64 21 345 6789",
        },
        address: {
          street: "789 Lambton Quay",
          city: "Wellington",
          state: "Wellington",
          country: "New Zealand",
          postalCode: "6011",
        },
        verification: {
          isVerified: false,
          verificationLevel: "none",
          kycStatus: "under_review",
        },
        riskProfile: {
          riskLevel: "high",
          riskFactors: [
            {
              factor: "large_cash_transactions",
              severity: "medium",
              notes: "Multiple large cash transactions detected",
            },
          ],
        },
        accountMetrics: {
          totalOrders: 1,
          totalVolume: 15000,
          averageOrderValue: 15000,
        },
        flags: {
          isSuspicious: true,
        },
        accountStatus: "active",
      },
    ];

    const createdCustomers = await Customer.insertMany(customers);
    console.log("✅ Seeded customers.");

    // Seed Orders
    const orders = [
      {
        customer: createdCustomers[0]._id,
        orderType: "buy_dinar",
        currency: {
          from: "NZD",
          to: "IQD",
        },
        amount: {
          fromAmount: 5000,
          toAmount: 6500000,
          exchangeRate: 1300,
          fees: 50,
          totalAmount: 5050,
        },
        paymentDetails: {
          method: "bank_transfer",
          status: "completed",
          transactionId: "TXN-001",
        },
        deliveryDetails: {
          method: "bank_transfer",
          status: "delivered",
        },
        orderStatus: "completed",
        priority: "normal",
        flags: {
          isHighValue: true,
        },
      },
      {
        customer: createdCustomers[1]._id,
        orderType: "buy_zimbabwe_dollar",
        currency: {
          from: "NZD",
          to: "ZWL",
        },
        amount: {
          fromAmount: 1500,
          toAmount: 150000000,
          exchangeRate: 100000,
          fees: 25,
          totalAmount: 1525,
        },
        paymentDetails: {
          method: "credit_card",
          status: "pending",
          transactionId: "TXN-002",
        },
        deliveryDetails: {
          method: "courier",
          status: "processing",
        },
        orderStatus: "processing",
        priority: "normal",
      },
      {
        customer: createdCustomers[2]._id,
        orderType: "buy_dinar",
        currency: {
          from: "NZD",
          to: "IQD",
        },
        amount: {
          fromAmount: 15000,
          toAmount: 19500000,
          exchangeRate: 1300,
          fees: 150,
          totalAmount: 15150,
        },
        paymentDetails: {
          method: "cash",
          status: "pending",
          transactionId: "TXN-003",
        },
        deliveryDetails: {
          method: "pickup",
          status: "pending",
        },
        orderStatus: "pending",
        priority: "high",
        flags: {
          isSuspicious: true,
          isHighValue: true,
          requiresVerification: true,
        },
      },
    ];

    await Order.insertMany(orders);
    console.log("✅ Seeded orders.");

    // Seed Notifications
    const notifications = [
      {
        title: "High Value Transaction Alert",
        message: "Order DNR-12345 exceeds the high-value threshold of $10,000 NZD",
        type: "high_value_transaction",
        priority: "high",
        category: "order_management",
        targetAudience: "all_admins",
        isActive: true,
      },
      {
        title: "Suspicious Activity Detected",
        message: "Customer Mike Johnson has been flagged for suspicious activity",
        type: "suspicious_activity",
        priority: "urgent",
        category: "security",
        targetAudience: "all_admins",
        isActive: true,
      },
      {
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance window: Sunday 2 AM - 4 AM NZST",
        type: "system",
        priority: "medium",
        category: "system",
        targetAudience: "all_admins",
        isActive: true,
      },
    ];

    await Notification.insertMany(notifications);
    console.log("✅ Seeded notifications.");

    // Seed User Orders
    const userOrders = [
      {
        fullName: "Sarah Wilson",
        email: "sarah.wilson@gmail.com",
        mobile: "+64 21 456 7890",
        country: "New Zealand",
        address: "789 Karangahape Road",
        city: "Auckland",
        state: "Auckland",
        postcode: "1010",
        currency: "IQD",
        quantity: 1000000,
        idFileUrl: "https://example.com/id1.jpg",
        acceptTerms: true,
        paymentMethod: "bank_transfer",
        status: "pending",
        comments: "First time customer, please process quickly",
      },
      {
        fullName: "David Chen",
        email: "david.chen@yahoo.com",
        mobile: "+64 21 567 8901",
        country: "New Zealand",
        address: "456 Dominion Road",
        city: "Auckland",
        state: "Auckland",
        postcode: "1024",
        currency: "ZWL",
        quantity: 50000000,
        idFileUrl: "https://example.com/id2.jpg",
        acceptTerms: true,
        paymentMethod: "online_payment",
        paymentReceiptUrl: "https://example.com/receipt2.jpg",
        status: "processing",
      },
    ];

    await UserOrder.insertMany(userOrders);
    console.log("✅ Seeded user orders.");

    // Final Success Message
    console.log("\n🎉 Admin data seeding completed successfully!");
    console.log("\nCreated admin accounts:");
    admins.forEach(a => console.log(`- ${a.email} / ${a.password}`));
    console.log("\nYou can now login to the admin panel at /admin/login");

  } catch (error) {
    console.error("❌ Error seeding admin data:", error);
  } finally {
    process.exit(0);
  }
}

seedAdminData();
