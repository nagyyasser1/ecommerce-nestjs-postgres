import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/admins/entities/admin.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private ClientRepo: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client | undefined> {
    const existingClient = await this.findOneByEmail(createClientDto.email);

    if (existingClient) {
      throw new ConflictException(
        `email: ${createClientDto.email}, aready exists!`,
      );
    }

    const newClient = new Client();

    newClient.fname = createClientDto.fname;
    newClient.lname = createClientDto.lname;
    newClient.email = createClientDto.email;
    newClient.password = createClientDto.password;
    newClient.verified = createClientDto.verified || false;

    try {
      return await this.ClientRepo.save(newClient);
    } catch (error) {
      console.error('Error creating Client:', error);
      return undefined;
    }
  }

  async findOneById(id: number): Promise<Client | undefined> {
    try {
      return await this.ClientRepo.findOneBy({ id });
    } catch (error) {
      console.log('Error finding Client', error);
      return undefined;
    }
  }

  async findOneByEmail(email: string): Promise<Client | undefined> {
    try {
      return await this.ClientRepo.findOneBy({ email });
    } catch (error) {
      console.log('Error finding Client', error);
      return undefined;
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      return await this.ClientRepo.find();
    } catch (error) {
      console.log('Error finding Clients: ', error);
    }
  }

  async update(client: Client | Admin): Promise<Client> {
    return await this.ClientRepo.save(client);
  }
}
