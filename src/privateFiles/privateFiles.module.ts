import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { PrivateFilesService } from "./privateFiles.service";
import PrivateFile from "./privateFile.entity";

@Module({
	imports: [TypeOrmModule.forFeature([PrivateFile]), ConfigModule],
	providers: [PrivateFilesService],
	exports: [PrivateFilesService],
})
export class PrivateFilesModule {}
