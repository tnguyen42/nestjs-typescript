import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";
import Address from "./address.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User, Address])],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
