import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async list(limit: number, sinceId?: number, offset = 0) {
    const qb = this.itemsRepository
      .createQueryBuilder('item')
      .orderBy('item.id', 'ASC')
      .take(limit)
      .skip(offset);

    if (sinceId) {
      qb.andWhere('item.id >= :sinceId', { sinceId });
    }

    return qb.getMany();
  }

  count(): Promise<number> {
    return this.itemsRepository.count();
  }

  async findOne(id: any) {
    const numId = Number(id);
    if (!Number.isInteger(numId)) {
      throw new BadRequestException('Invalid ID');
    }

    const item = await this.itemsRepository.findOne({
      where: { id: numId },
    });

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    return item;
  }
}
