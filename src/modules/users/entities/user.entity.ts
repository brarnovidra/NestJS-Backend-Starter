import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  fullName: string;
  @OneToMany(() => RefreshToken, rt => rt.user)
  refreshTokens: RefreshToken[];
}
