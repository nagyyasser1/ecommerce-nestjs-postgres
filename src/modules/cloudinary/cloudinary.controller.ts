import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { multerOptions } from '../../config/multer.config';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('cloudinary')
@UseGuards(AdminGuard)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string,
  ) {
    return this.cloudinaryService.uploadImages(files, folder);
  }

  @Delete('delete-file')
  async deleteFile(@Body('public_Id') public_Id: string) {
    return this.cloudinaryService.deleteImage(public_Id);
  }

  @Post('create-folder')
  async createFolder(@Body('folderName') folderName: string) {
    return this.cloudinaryService.createFolder(folderName);
  }

  @Delete('remove-folder/:folderPath')
  async deleteFolder(@Param('folderPath') folderPath: string) {
    return this.cloudinaryService.deleteFolder(folderPath);
  }

  @Get('folders')
  async getFolders() {
    return this.cloudinaryService.getAllFolders();
  }

  @Get('folder/:folderName/images')
  async getImagesInFolder(@Param('folderName') folderName: string) {
    return this.cloudinaryService.getAllFilesInFolder(folderName);
  }

  @Get('images')
  async getImages(@Param('random') random: boolean) {
    return this.cloudinaryService.getImagesFromAllFolders(random);
  }
}
