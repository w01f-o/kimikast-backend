import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import { StaticLocation } from '../enums/StaticLocation.enum';

@Injectable()
export class StorageService {
  private readonly STATIC_FOLDER_NAME = 'static';

  private getStaticFolderPath(location: StaticLocation) {
    return path.join(__dirname, '..', '..', this.STATIC_FOLDER_NAME, location);
  }

  private generateFileName(file: Express.Multer.File) {
    return `${Date.now()}-${file.originalname}`;
  }

  public async saveFile(file: Express.Multer.File, location: StaticLocation) {
    const fileName = this.generateFileName(file);
    const filePath = path.join(this.getStaticFolderPath(location), fileName);

    await fs.writeFile(filePath, file.buffer);

    return fileName;
  }
}
