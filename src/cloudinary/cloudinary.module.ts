// src/cloudinary/cloudinary.module.ts (CORRIGÉ)

import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
// Si vous n'avez pas de contrôleur pour Cloudinary (ce qui est souvent le cas pour un service utilitaire), vous pouvez retirer cette ligne.
// import { CloudinaryController } from './cloudinary.controller'; 

@Module({
    // controllers: [CloudinaryController], // Retirez si vous ne l'utilisez pas
    providers: [CloudinaryService], 
    // EXPORTER : Rendre CloudinaryService disponible pour les autres modules (comme ProductModule)
    exports: [CloudinaryService], 
})
export class CloudinaryModule {}
