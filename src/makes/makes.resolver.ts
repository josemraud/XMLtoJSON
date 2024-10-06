import { Resolver, Query } from '@nestjs/graphql';
import { MakesService } from './makes.service';
import { MakeDTO } from './make.dto';

@Resolver('Makes')
export class MakesResolver {
  constructor(private readonly makesService: MakesService) {}

  @Query(() => String)
  async fetchAndStoreMakes() {
    return this.makesService.fetchMakes();
  }

  @Query(() => [MakeDTO])
  async getMakes() {
    return this.makesService.getAllMakes();
  }
}
