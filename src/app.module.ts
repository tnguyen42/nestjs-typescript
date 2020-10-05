import { Module } from "@nestjs/common";
import { PostsModule } from "./posts/posts.module";
import { CatsModule } from "./cats/cats.module";

@Module({
	imports: [PostsModule, CatsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
