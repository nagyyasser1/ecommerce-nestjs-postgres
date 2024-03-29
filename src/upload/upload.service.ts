import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async saveFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadedFileNames = [];
    for (const file of files) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'images',
        file.originalname,
      );
      await fs.promises.writeFile(filePath, file.buffer);
      uploadedFileNames.push(file.originalname);
    }
    return uploadedFileNames;
  }

  async deleteFile(url: string): Promise<void> {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'images',
      path.basename(url),
    );
    try {
      await fs.promises.stat(filePath); // Check if file exists
      await fs.promises.unlink(filePath); // Delete the file
    } catch (error) {
      console.error('Error deleting file:', error);
      // Handle the error appropriately, such as throwing a custom exception
      throw new Error('File not found or could not be deleted');
    }
  }

  async getAllFileUrls(): Promise<string[]> {
    const imageDir = path.join(__dirname, '..', '..', 'public', 'images');
    const fileUrls = [];

    try {
      const files = await fs.promises.readdir(imageDir);
      for (const file of files) {
        fileUrls.push(path.join('/images', file)); // Adjust base path as needed
      }
    } catch (error) {
      console.error('Error reading image directory:', error);
      // Handle the error appropriately, such as returning an empty array
      return [];
    }

    return fileUrls;
  }
}
