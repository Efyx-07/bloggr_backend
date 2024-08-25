import { NestFactory } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AppModule } from './src/app.module';
import { hashPassword } from './src/admins/utils/hashPassword';
import { AdminEntity } from './src/entities/admin.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// Script pour initialiser l'Admin en BDD
// ===========================================================================================
async function setupAdmin() {
  try {
    console.log('Starting application context setup...');
    const app = await NestFactory.createApplicationContext(AppModule);
    console.log('Application context created.');

    // Récupérer le repository pour AdminEntity
    const adminRepository = app.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );
    console.log('AdminRepository loaded.');

    // Récupérer les variables d'environnement directement avec process.env
    const adminFirstName = process.env.ADMIN_FIRSTNAME;
    console.log('Admin first name from environment:', adminFirstName);
    const adminLastName = process.env.ADMIN_LASTNAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(adminPassword);

    // Créer l'admin
    const admin = adminRepository.create({
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      password: hashedPassword,
    });

    // Sauvegarder l'admin dans la base de données
    await adminRepository.save(admin);

    console.log('Admin successfully created.');

    await app.close();
  } catch (err) {
    console.error('Error bootstrapping application:', err);
  }
}

setupAdmin();

// type to initialize the Admin: npx ts-node initAdmin.ts
