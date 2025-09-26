import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserPublisher } from '../../events/user.publisher';

const REFRESH_DAYS = Number(process.env.REFRESH_EXPIRES_DAYS || 30);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private rtRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private publisher: UserPublisher
  ) { }

  async register(payload: { email: string; password: string; fullName?: string }) {
    const existing = await this.userRepo.findOne({ where: { 'email': payload.email } });
    if (existing) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Email already registered',
        data: null,
      });
    }

    const hashed = await bcryptjs.hash(payload.password, 10);
    const user = this.userRepo.create({ ...payload, password: hashed });
    await this.userRepo.save(user);
    
    // publish event (fire-and-forget)
    this.publisher.publishUserCreated({ userId: user.id, email: user.email }).catch(() => { });
    const tokens = await this.createTokens(user.id);
    return { user: { id: user.id, email: user.email, fullName: user.fullName }, ...tokens };
  }

  async login({ email, password }) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcryptjs.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.createTokens(user.id);
    return { user: { id: user.id, email: user.email }, ...tokens };
  }

  private async createTokens(userId: string) {
    const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
    // tokenId.scheme: tokenId.signature (store tokenId in DB, store hash of signature)
    const tokenId = uuidv4();
    const signature = uuidv4() + uuidv4();
    const plain = tokenId + '.' + signature;
    const sigHash = await bcryptjs.hash(signature, 10);
    const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
    const record = this.rtRepo.create({ tokenId, tokenHash: sigHash, expiresAt, user: { id: userId } as any });
    await this.rtRepo.save(record);
    return { accessToken, refreshToken: plain };
  }

  private splitToken(t: string) {
    const parts = t.split('.');
    if (parts.length < 2) return null;
    const tokenId = parts[0];
    const signature = parts.slice(1).join('.');
    return { tokenId, signature };
  }

  async refresh(refreshTokenPlain: string) {
    const parsed = this.splitToken(refreshTokenPlain);
    if (!parsed) throw new UnauthorizedException('Invalid token');
    const { tokenId } = parsed;
    const signature = parsed.signature;
    const found = await this.rtRepo.findOne({ where: { tokenId }, relations: ['user'] });
    if (!found) throw new UnauthorizedException('Invalid token');
    if (found.revoked || found.expiresAt < new Date()) throw new UnauthorizedException('Token expired');
    const ok = await bcryptjs.compare(signature, found.tokenHash);
    if (!ok) throw new UnauthorizedException('Invalid token');
    // rotate: revoke old, create new
    found.revoked = true;
    await this.rtRepo.save(found);
    return this.createTokens(found.user.id);
  }

  async logout(refreshTokenPlain: string) {
    const parsed = this.splitToken(refreshTokenPlain);
    if (!parsed) return { success: true };
    const found = await this.rtRepo.findOne({ where: { tokenId: parsed.tokenId } });
    if (found) { found.revoked = true; await this.rtRepo.save(found); }
    return { success: true };
  }
}
