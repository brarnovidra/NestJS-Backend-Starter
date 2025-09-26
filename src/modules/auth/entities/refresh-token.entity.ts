import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tokenId: string; // lookup key
  @Column()
  tokenHash: string; // hash of signature
  @Column({ type: 'timestamptz' })
  expiresAt: Date;
  @Column({ default: false })
  revoked: boolean;
  @ManyToOne(() => User, u => u.refreshTokens)
  user: User;
}
