import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

@Module({
  controllers: [InventoryController],
  providers: [PrismaService, InventoryRepository, InventoryService],
  exports: [InventoryRepository, InventoryService],
})
export class InventoryModule {}
