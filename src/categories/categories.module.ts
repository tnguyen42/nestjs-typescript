import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Category from "./category.entity";
import PostEntity from "../posts/post.entity";
import CategoriesController from "./categories.controller";
import CategoriesService from "./categories.service";

@Module({
	imports: [TypeOrmModule.forFeature([Category, PostEntity])],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
export class CategoriesModule {}
