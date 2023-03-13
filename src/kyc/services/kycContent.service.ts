import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KycContent } from '../entities/kycContent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KycContentService {
  constructor(
    @InjectRepository(KycContent)
    private kycContentRepository: Repository<KycContent>,
  ) {}
}
