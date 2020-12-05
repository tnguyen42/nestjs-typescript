import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import CreatePostDto from "./dto/createPost.dto";
import PostEntity from "./post.entity";
import UpdatePostDto from "./dto/updatePost.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PostNotFoundException } from "./exception/postNotFound.exception";

import User from "../users/user.entity";
import PostSearchService from "./postsSearch.service";

@Injectable()
export default class PostService {
	constructor(
		@InjectRepository(PostEntity)
		private postsRepository: Repository<PostEntity>,
		private postsSearchService: PostSearchService,
	) {}

	getAllPosts() {
		return this.postsRepository.find({ relations: ["author"] });
	}

	async getPostById(id: number) {
		const post = this.postsRepository.findOne(id, { relations: ["author"] });
		if (post) {
			return post;
		}

		throw new PostNotFoundException(id);
	}

	async replacePost(id: number, post: UpdatePostDto) {
		await this.postsRepository.update(id, post);
		const updatedPost = await this.postsRepository.findOne(id, {
			relations: ["author"],
		});

		if (updatedPost) {
			await this.postsSearchService.update(updatedPost);
			return updatedPost;
		}
		throw new PostNotFoundException(id);
	}

	async createPost(post: CreatePostDto, user: User) {
		const newPost = await this.postsRepository.create({
			...post,
			author: user,
		});
		await this.postsRepository.save(newPost);
		this.postsSearchService.indexPost(newPost);
		return newPost;
	}

	async deletePost(id: number) {
		const deleteResponse = await this.postsRepository.delete(id);
		if (!deleteResponse.affected) {
			throw new HttpException("Post not found", HttpStatus.NOT_FOUND); // This is the usual way to call an exception
		}
		await this.postsSearchService.remove(id);
	}

	async searchForPosts(text: string) {
		const results = await this.postsSearchService.search(text);
		const ids = results.map((result) => result.id);
		if (!ids.length) {
			return [];
		}
		return this.postsRepository.find({ where: { id: In(ids) } });
	}
}
