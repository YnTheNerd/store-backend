import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configuration Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Augmenter le timeout et ajouter des options de configuration
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'products', // Optionnel : organiser par dossier
          resource_type: 'auto',
          timeout: 1800000, // Timeout de 60 secondes
        },
        (error, result) => {
          if (error) {
            console.error('Erreur Cloudinary:', error);
            return reject(error);
          }
          resolve(result);
        },
      );

      // Vérifier si le fichier a un buffer
      if (!file || !file.buffer) {
        return reject(new Error('Fichier invalide ou buffer manquant'));
      }

      // Convertir le buffer en stream et uploader
      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }
}
