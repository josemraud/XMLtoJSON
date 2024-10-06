import { Test, TestingModule } from '@nestjs/testing';
import { MakesService } from './makes.service';
import { getModelToken } from '@nestjs/mongoose';
import axios from 'axios';

jest.mock('axios');

const mockMakeModel = {
  create: jest.fn(),
  find: jest.fn(),
};

describe('MakesService', () => {
  let service: MakesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakesService,
        {
          provide: getModelToken('Make'),
          useValue: mockMakeModel,
        },
      ],
    }).compile();

    service = module.get<MakesService>(MakesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle cases where no makes are found', async () => {
    const xmlResponse = `
      <Response>
        <Results>
          <AllVehicleMakes></AllVehicleMakes>
        </Results>
      </Response>
    `;

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: xmlResponse });

    const result = await service.fetchMakes();

    expect(result).toBe('No makes found');
    expect(mockMakeModel.create).not.toHaveBeenCalled();
  });

  it('should skip makes with no Make_ID', async () => {
    const xmlResponse = `
      <Response>
        <Results>
          <AllVehicleMakes>
            <Make_Name>Test Make</Make_Name>
          </AllVehicleMakes>
        </Results>
      </Response>
    `;

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: xmlResponse });

    await service.fetchMakes();

    expect(mockMakeModel.create).not.toHaveBeenCalled();
  });
});
