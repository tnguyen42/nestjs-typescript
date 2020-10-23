import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import PostEntity from "../posts/post.entity";

@Entity()
class Category {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public name: string;

	@ManyToMany(() => PostEntity, (post: PostEntity) => post.categories)
	public posts: PostEntity[];
}

export default Category;
