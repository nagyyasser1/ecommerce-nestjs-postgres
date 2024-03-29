import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000000 }),
          new FileTypeValidator({ fileType: '/*' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    const uploadedFileNames = await this.uploadService.saveFiles(files);
    return {
      uploadedFiles: uploadedFileNames,
    };
  }

  @Delete()
  async deleteFile(@Body('fileUrl') fileUrl: string) {
    await this.uploadService.deleteFile(fileUrl);
  }

  @Get()
  async getAllFilesUrls() {
    return await this.uploadService.getAllFileUrls();
  }
}
