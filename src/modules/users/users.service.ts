import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>){}
  create(payload: Partial<User>){ const u = this.repo.create(payload); return this.repo.save(u); }
  findOneByEmail(email: string){ return this.repo.findOne({ where: { email } }); }
  findOne(id: string){ return this.repo.findOneBy({ id }); }
}
