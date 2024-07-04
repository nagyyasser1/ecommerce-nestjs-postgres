import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';

@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<Admin> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Admin;
  }

  async beforeInsert(event: InsertEvent<Admin>) {
    // Validate Admin data before insert (optional)
    const saltOrRounds = 10;
    const password = event.entity.password;

    event.entity.password = await bcrypt.hash(password, saltOrRounds);
  }

  async beforeUpdate(event: UpdateEvent<Admin>): Promise<any> {
    const saltOrRounds = 10;
    const password = event.entity.password;

    event.entity.password = await bcrypt.hash(password, saltOrRounds);
  }

  async afterUpdate(event: UpdateEvent<Admin>) {
    // Perform actions after user update (optional)
    // Example: send notification, sync cache
  }
}
