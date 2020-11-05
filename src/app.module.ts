import { Module } from "@nestjs/common";
import { PostsModule } from "./posts/posts.module";
import { CatsModule } from "./cats/cats.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [
		PostsModule,
		AuthenticationModule,
		CatsModule,
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				POSTGRES_HOST: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_DB: Joi.string().required(),
				AWS_REGION: Joi.string().required(),
				AWS_ACCESS_KEY_ID: Joi.string().required(),
				AWS_SECRET_ACCESS_KEY: Joi.string().required(),
				AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
				PORT: Joi.number(),
			}),
		}),
		DatabaseModule,
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
