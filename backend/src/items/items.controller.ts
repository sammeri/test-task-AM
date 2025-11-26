import { Controller, Get, Query, Param } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ListItemsDto } from './dto/list-items.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // GET /items?limit=&offset=&sinceId=
  @Get()
  async listItems(@Query() query: ListItemsDto) {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    return this.itemsService.list(limit, query.sinceId, offset);
  }

  // GET /items/count
  @Get('count')
  async getCount() {
    const count = await this.itemsService.count();
    return { count };
  }

  // GET /items/:id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }
}
