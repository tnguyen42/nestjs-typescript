import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { FilesService } from "./files.service";
import PublicFile from "./publicFile.entity";

@Module({
	imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
