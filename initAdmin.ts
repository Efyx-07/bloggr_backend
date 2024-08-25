import { NestFactory } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AppModule } from './src/app.module';
import { AdminEntity } from './src/entities/admin.entity';
import { hashPassword } from './src/admins/utils/hashPassword';
import { getRepositoryToken } from '@nestjs/typeorm';

// Initialise l'Admin en BDD
// ===========================================================================================
async function setupAdmin() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    // Récupére le repository pour AdminEntity
    const adminRepository = app.get<Repository<AdminEntity>>(
      getRepositoryToken(AdminEntity),
    );

    // Récupére les variables d'environnement avec process.env
    const adminFirstName = process.env.ADMIN_FIRSTNAME;
    const adminLastName = process.env.ADMIN_LASTNAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Hache le mot de passe
    const hashedPassword = await hashPassword(adminPassword);

    // Crée l'admin
    const admin = adminRepository.create({
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      password: hashedPassword,
    });
    await adminRepository.save(admin);

    console.log('Admin successfully created.');

    await app.close();
  } catch (err) {
    console.error('Error bootstrapping application:', err);
  }
}

setupAdmin();

// type to initialize the Admin: npx ts-node initAdmin.ts
