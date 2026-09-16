import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [ClientsModule, CatalogModule],
  exports: [ClientsModule, CatalogModule],
})
export class BusinessModule {}
