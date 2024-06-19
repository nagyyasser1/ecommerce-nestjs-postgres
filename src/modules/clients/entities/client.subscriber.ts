import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './client.entity';

@EventSubscriber()
export class ClientSubscriber implements EntitySubscriberInterface<Client> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Client;
  }

  async beforeInsert(event: InsertEvent<Client>) {
    // Validate Client data before insert (optional)
    const saltOrRounds = 10;
    const password = event.entity.password;

    event.entity.password = await bcrypt.hash(password, saltOrRounds);
  }

  async afterUpdate(event: UpdateEvent<Client>) {
    // Perform actions after user update (optional)
    // Example: send notification, sync cache
  }
}
