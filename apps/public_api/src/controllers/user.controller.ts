import { CreateClientUseCase } from '@core/useCases/client/CreateClient.useCase';
import { injectable } from 'tsyringe';
import { CreateClientRequestDto } from '@core/useCases/client/dtos/CreateClientRequest.dto';

@injectable()
export class UserController {
  private clientUseCase: CreateClientUseCase;

  constructor(clientUseCase: CreateClientUseCase) {
    this.clientUseCase = clientUseCase;
  }

  create(input: CreateClientRequestDto) {}
}
