import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
	OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import Address from "./address.entity";
import Post from "../posts/post.entity";
import PublicFile from "../files/publicFile.entity";

@Entity()
class User {
	// This constructor is made for e2e tests, so these can return an instance of a class with given user data inside
	constructor(obj?: Partial<User>) {
		Object.assign(this, obj);
	}

	@PrimaryGeneratedColumn()
	@Exclude()
	public id?: number;

	@Column({ unique: true })
	public email: string;

	@Column()
	public name: string;

	@Column()
	@Exclude()
	public password: string;

	@OneToOne(() => Address, { eager: true, cascade: true })
	@JoinColumn()
	public address: Address;

	@OneToMany(() => Post, (post: Post) => post.author)
	public posts?: Post[];

	@JoinColumn()
	@OneToOne(() => PublicFile, { eager: true, nullable: true })
	public avatar?: PublicFile;
}

export default User;
