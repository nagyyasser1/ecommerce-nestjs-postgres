import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async uploadImages(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<any[]> {
    return Promise.all(files.map((file) => this.uploadImage(file, folder)));
  }

  async createFolder(folderName: string): Promise<any> {
    return cloudinary.api
      .create_folder(folderName)
      .then((result) => result)
      .catch((error) => {
        throw new Error(`Failed to create folder: ${error.message}`);
      });
  }

  async getAllFolders(rootFolder: string = ''): Promise<any> {
    return cloudinary.api
      .sub_folders(rootFolder)
      .then((result) => result.folders)
      .catch((error) => {
        throw new Error(`Failed to retrieve folders: ${error.message}`);
      });
  }

  async getAllFilesInFolder(folderPath: string): Promise<string[]> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: 500,
      });
      return result.resources;
    } catch (error) {
      throw new Error(`Failed to retrieve files: ${error.message}`);
    }
  }

  async deleteImage(public_Id: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(public_Id);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async deleteFolder(folderPath: string): Promise<any> {
    try {
      const result = await cloudinary.api.delete_folder(folderPath);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete folder: ${error.message}`);
    }
  }

  async getImagesFromAllFolders(random: boolean = false): Promise<any[]> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 5,
      });

      let images = result.resources;
      if (random) {
        images = images.sort(() => 0.5 - Math.random());
      }

      return images.slice(0, 10);
    } catch (error) {
      throw new Error(`Failed to retrieve images: ${error.message}`);
    }
  }
}
