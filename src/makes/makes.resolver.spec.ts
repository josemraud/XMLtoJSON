import { Test, TestingModule } from '@nestjs/testing';
import { MakesResolver } from './makes.resolver';
import { MakesService } from './makes.service';

const mockMakesService = {
  fetchMakes: jest.fn(),
  getAllMakes: jest.fn(),
};

describe('MakesResolver', () => {
  let resolver: MakesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakesResolver,
        {
          provide: MakesService,
          useValue: mockMakesService,
        },
      ],
    }).compile();

    resolver = module.get<MakesResolver>(MakesResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call fetchMakes and return response', async () => {
    mockMakesService.fetchMakes.mockResolvedValue('Makes processed');
    const result = await resolver.fetchAndStoreMakes();
    expect(result).toEqual('Makes processed');
  });

  it('should return all makes', async () => {
    const mockMakes = [
      { MakeId: 1, MakeName: 'Make1', VehicleTypes: [{VehicleTypeId: 0, VehicleTypeName: 'Test'}] },
      { MakeId: 2, MakeName: 'Make2', VehicleTypes: [{VehicleTypeId: 0, VehicleTypeName: 'Test'}] },
    ];
    mockMakesService.getAllMakes.mockResolvedValue(mockMakes);

    const result = await resolver.getMakes();
    expect(result).toEqual(mockMakes);
  });
});
