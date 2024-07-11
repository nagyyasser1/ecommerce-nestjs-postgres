import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const saltOrRounds = 10;
    const password = event.entity.password;

    event.entity.password = await bcrypt.hash(password, saltOrRounds);
  }

  async afterUpdate(event: UpdateEvent<User>) {
    // Perform actions after user update (optional)
    // Example: send notification, sync cache
  }
}
