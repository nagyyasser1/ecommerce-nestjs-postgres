import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private ClientRepo: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client | null> {
    const newClient = new Client();
    newClient.fname = createClientDto.fname;
    newClient.lname = createClientDto.lname;
    newClient.email = createClientDto.email;
    newClient.password = createClientDto.password;

    newClient.deviceToken = createClientDto.deviceToken || '';

    try {
      return await this.ClientRepo.save(newClient);
    } catch (error) {
      console.error('Error creating Client:', error);
      return null;
    }
  }

  async findOne(id: number): Promise<Client | null> {
    try {
      return await this.ClientRepo.findOneBy({ id });
    } catch (error) {
      console.log('Error finding Client', error);
      return null;
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      return await this.ClientRepo.find();
    } catch (error) {
      console.log('Error finding Clients: ', error);
    }
  }
}
