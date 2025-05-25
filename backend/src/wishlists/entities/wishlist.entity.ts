import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column({ length: 1500, nullable: true })
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, { nullable: false })
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishLists, { onDelete: 'CASCADE' })
  @JoinTable()
  items: Wish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
