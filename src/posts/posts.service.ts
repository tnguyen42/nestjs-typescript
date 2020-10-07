import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import CreatePostDto from "./dto/createPost.dto";
// import Post from "./post.interface";
import { PostEntity } from "./post.entity";
import UpdatePostDto from "./dto/updatePost.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export default class PostService {
	constructor(
		@InjectRepository(PostEntity)
		private postsRepository: Repository<PostEntity>,
	) {}

	getAllPosts() {
		return this.postsRepository.find();
	}

	async getPostById(id: number) {
		const post = this.postsRepository.findOne(id);
		if (post) {
			return post;
		}

		throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
	}

	async replacePost(id: number, post: UpdatePostDto) {
		await this.postsRepository.update(id, post);
		const updatedPost = await this.postsRepository.findOne(id);

		if (updatedPost) {
			return updatedPost;
		}
		throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
	}

	async createPost(post: CreatePostDto) {
		const newPost = await this.postsRepository.create(post);
		await this.postsRepository.save(newPost);
		return newPost;
	}

	async deletePost(id: number) {
		const deleteResponse = await this.postsRepository.delete(id);
		if (!deleteResponse.affected) {
			throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
		}
	}
}
