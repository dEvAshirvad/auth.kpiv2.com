import fs from 'fs/promises';
import path from 'path';
import { db } from '@/configs/db/mongodb';
import { MemberModel } from './members.model';
import logger from '@/configs/logger';
import { ObjectId } from 'mongodb';

export class MembersSeeder {
  static async importMembersData() {
    try {
      logger.info('🌱 Starting members seeding...');

      // Read the JSON data
      const jsonPath = path.join(
        process.cwd(),
        'src',
        'seeders',
        'mongo',
        'kpiv2.tbl_members.json'
      );
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const members = JSON.parse(jsonData);

      // Transform MongoDB Extended JSON to native types
      const transformedMembers = members.map((member: any) => {
        const transformed: any = {
          userId: member.userId,
          departmentSlug: member.departmentSlug,
          role: member.role,
          metadata: member.metadata || {},
        };

        // Convert MongoDB ObjectId
        if (member._id && member._id.$oid) {
          transformed._id = new ObjectId(member._id.$oid);
        }

        // Convert MongoDB dates
        if (member.createdAt && member.createdAt.$date) {
          transformed.createdAt = new Date(member.createdAt.$date);
        }

        if (member.updatedAt && member.updatedAt.$date) {
          transformed.updatedAt = new Date(member.updatedAt.$date);
        }

        return transformed;
      });

      // Clear existing members
      await MemberModel.deleteMany({});
      logger.info('🗑️  Cleared existing members');

      // Insert new members
      const insertedMembers = await MemberModel.insertMany(transformedMembers);
      logger.info(`✅ Successfully seeded ${insertedMembers.length} members`);

      return insertedMembers;
    } catch (error) {
      logger.error('❌ Failed to seed members:', error);
      throw error;
    }
  }

  static async importUsers() {
    try {
      logger.info('🌱 Starting users seeding...');

      // Read the JSON data
      const jsonPath = path.join(
        process.cwd(),
        'src',
        'seeders',
        'mongo',
        'kpiv2.user.json'
      );
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const users = JSON.parse(jsonData);

      // Transform MongoDB Extended JSON to native types
      const transformedUsers = users.map((user: any) => {
        const transformed: any = {
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        };

        // Convert MongoDB ObjectId
        if (user._id && user._id.$oid) {
          transformed._id = new ObjectId(user._id.$oid);
        }

        // Convert MongoDB dates
        if (user.createdAt && user.createdAt.$date) {
          transformed.createdAt = new Date(user.createdAt.$date);
        }

        if (user.updatedAt && user.updatedAt.$date) {
          transformed.updatedAt = new Date(user.updatedAt.$date);
        }

        return transformed;
      });

      // Clear existing users
      await db.collection('user').deleteMany({});
      logger.info('🗑️  Cleared existing users');

      // Insert new users
      const result = await db.collection('user').insertMany(transformedUsers);
      logger.info(
        `✅ Successfully seeded ${Object.keys(result.insertedIds).length} users`
      );

      return result;
    } catch (error) {
      logger.error('❌ Failed to seed users:', error);
      throw error;
    }
  }

  static async importAccounts() {
    try {
      logger.info('🌱 Starting accounts seeding...');

      // Read the JSON data
      const jsonPath = path.join(
        process.cwd(),
        'src',
        'seeders',
        'mongo',
        'kpiv2.account.json'
      );
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const accounts = JSON.parse(jsonData);

      // Transform MongoDB Extended JSON to native types
      const transformedAccounts = accounts.map((account: any) => {
        const transformed: any = {
          accountId: account.accountId,
          providerId: account.providerId,
          userId: account.userId,
          password: account.password,
        };

        // Convert MongoDB ObjectId
        if (account._id && account._id.$oid) {
          transformed._id = new ObjectId(account._id.$oid);
        }

        if (account.userId && account.userId.$oid) {
          transformed.userId = new ObjectId(account.userId.$oid);
        }

        // Convert MongoDB dates
        if (account.createdAt && account.createdAt.$date) {
          transformed.createdAt = new Date(account.createdAt.$date);
        }

        if (account.updatedAt && account.updatedAt.$date) {
          transformed.updatedAt = new Date(account.updatedAt.$date);
        }

        return transformed;
      });

      // Clear existing accounts
      await db.collection('account').deleteMany({});
      logger.info('🗑️  Cleared existing accounts');

      // Insert new accounts
      const result = await db
        .collection('account')
        .insertMany(transformedAccounts);
      logger.info(
        `✅ Successfully seeded ${Object.keys(result.insertedIds).length} accounts`
      );

      return result;
    } catch (error) {
      logger.error('❌ Failed to seed accounts:', error);
      throw error;
    }
  }

  static async importDepartments() {
    try {
      logger.info('🌱 Starting departments seeding...');

      // Read the JSON data
      const jsonPath = path.join(
        process.cwd(),
        'src',
        'seeders',
        'mongo',
        'kpiv2.tbl_departments.json'
      );
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const departments = JSON.parse(jsonData);

      // Transform MongoDB Extended JSON to native types
      const transformedDepartments = departments.map((dept: any) => {
        const transformed: any = {
          name: dept.name,
          slug: dept.slug,
          logo: dept.logo,
          metadata:
            typeof dept.metadata === 'string'
              ? JSON.parse(dept.metadata)
              : dept.metadata,
        };

        // Convert MongoDB ObjectId
        if (dept._id && dept._id.$oid) {
          transformed._id = new ObjectId(dept._id.$oid);
        }

        // Convert MongoDB dates
        if (dept.createdAt && dept.createdAt.$date) {
          transformed.createdAt = new Date(dept.createdAt.$date);
        }

        if (dept.updatedAt && dept.updatedAt.$date) {
          transformed.updatedAt = new Date(dept.updatedAt.$date);
        }

        return transformed;
      });

      // Clear existing departments
      await db.collection('tbl_departments').deleteMany({});
      logger.info('🗑️  Cleared existing departments');

      // Insert new departments
      const result = await db
        .collection('tbl_departments')
        .insertMany(transformedDepartments);
      logger.info(
        `✅ Successfully seeded ${Object.keys(result.insertedIds).length} departments`
      );

      return result;
    } catch (error) {
      logger.error('❌ Failed to seed departments:', error);
      throw error;
    }
  }

  static async seed() {
    try {
      logger.info('🚀 Starting comprehensive seeding...');

      // Seed in order to maintain referential integrity
      logger.info('📋 Seeding departments...');
      await this.importDepartments();
      logger.info('👥 Seeding users...');
      await this.importUsers();
      logger.info('🔐 Seeding accounts...');
      await this.importAccounts();
      logger.info('👤 Seeding members...');
      await this.importMembersData();

      logger.info('🎉 All seeding completed successfully!');
    } catch (error) {
      logger.error('❌ Comprehensive seeding failed:', error);
      throw error;
    }
  }

  static async clear() {
    try {
      logger.info('🗑️  Clearing all seeded data...');

      await Promise.all([
        MemberModel.deleteMany({}),
        db.collection('user').deleteMany({}),
        db.collection('account').deleteMany({}),
        db.collection('tbl_departments').deleteMany({}),
      ]);

      logger.info('✅ All seeded data cleared successfully');
    } catch (error) {
      logger.error('❌ Failed to clear seeded data:', error);
      throw error;
    }
  }
}
