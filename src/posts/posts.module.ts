import { Module } from "@nestjs/common";
import PostsController from "./posts.controller";
import PostsService from "./posts.service";
import PostEntity from "./post.entity";
import Category from "../categories/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchModule } from "src/search/search.module";
import PostSearchService from "./postsSearch.service";

@Module({
	imports: [TypeOrmModule.forFeature([PostEntity, Category]), SearchModule],
	controllers: [PostsController],
	providers: [PostsService, PostSearchService],
})
export class PostsModule {}
