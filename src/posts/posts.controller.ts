import PostsService from "./posts.service";
import CreatePostDto from "./dto/createPost.dto";
import UpdatePostDto from "./dto/updatePost.dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseFilters,
	UseGuards,
	Req,
	Query,
} from "@nestjs/common";
import { JwtAuthenticationGuard } from "../authentication/jwt-authentication.guard";
import { ExceptionsLoggerFilter } from "../utils/exceptionsLogger.filter";
import { FindOneParams } from "../utils/findOneParams";
import { ApiTags } from "@nestjs/swagger";
import RequestWithUser from "../authentication/requestWithUser.interface";

@ApiTags("posts")
@Controller("posts")
export default class PostsController {
	constructor(private readonly postsService: PostsService) {}

	/**
	 * Gets posts with a search query
	 */
	@Get()
	getPosts(@Query("search") search: string) {
		if (search) {
			return this.postsService.searchForPosts(search);
		}
		return this.postsService.getAllPosts();
	}

	@Get(":id")
	@UseFilters(ExceptionsLoggerFilter)
	// One way
	getPostById(@Param("id") id: string) {
		return this.postsService.getPostById(Number(id));
	}

	@Post()
	@UseGuards(JwtAuthenticationGuard)
	async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
		return this.postsService.createPost(post, req.user);
	}

	@Put(":id")
	async replacePost(
		@Param() { id }: FindOneParams,
		@Body() post: UpdatePostDto,
	) {
		return this.postsService.replacePost(Number(id), post);
	}

	@Delete(":id")
	// Another way
	async deletePost(@Param() { id }: FindOneParams) {
		this.postsService.deletePost(Number(id));
	}
}
