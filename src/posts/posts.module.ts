import { Module } from "@nestjs/common";
import PostsController from "./posts.controller";
import PostsService from "./posts.service";
import PostEntity from "./post.entity";
import Category from "../categories/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([PostEntity, Category])],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}
