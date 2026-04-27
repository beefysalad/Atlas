import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { InventoryModule } from "./inventory/inventory.module"
import { UsersModule } from "./users/users.module"
import { WebhooksModule } from "./webhooks/webhooks.module"

@Module({
  imports: [InventoryModule, UsersModule, WebhooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
