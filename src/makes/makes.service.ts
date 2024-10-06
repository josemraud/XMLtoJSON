import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Make } from './make.schema';
import { parseString } from 'xml2js';
import axios from 'axios';

@Injectable()
export class MakesService {
  constructor(@InjectModel('Make') private readonly makeModel: Model<Make>) {}

  async fetchMakes(): Promise<any> {
    try {
      const makesXml = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');

      return new Promise((resolve, reject) => {
        parseString(makesXml.data, { explicitArray: false }, async (err, result) => {
          if (err) {
            return reject(err);
          }

          const makes = result.Response.Results.AllVehicleMakes;

          if (!makes || (Array.isArray(makes) && makes.length === 0)) {
            return resolve('No makes found');
          }

          const makesArray = Array.isArray(makes) ? makes : [makes];

          for (const make of makesArray) {
            if (!make.Make_ID) {
              continue;
            }

            try {
              const vehicleTypesXml = await axios.get(
                `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${make.Make_ID}?format=xml`
              );
              const vehicleTypesResult = await this.parseXml(vehicleTypesXml.data);
              const vehicleTypes = vehicleTypesResult.Response.Results;

              const vehicleTypesArray = Array.isArray(vehicleTypes) ? vehicleTypes : [vehicleTypes];

              const newMake = new this.makeModel({
                MakeId: make.Make_ID,
                MakeName: make.Make_Name,
                VehicleTypes: vehicleTypesArray.map((vt) => ({
                  TypeId: vt.VehicleTypesForMakeIds.VehicleTypeId ?? 0,
                  TypeName: vt.VehicleTypesForMakeIds.VehicleTypeName ?? 'Unknown',
                })),
              });
              console.log('Processing make: ', make.Make_ID);
              await newMake.save();
            } catch (error) {
              console.error(`Error processing vehicle types for make ${make.Make_Name}:`, error);
            }
          }

          return resolve('Makes processed');
        });
      });
    } catch (error) {
      throw new Error('Failed to fetch makes');
    }
  }

  private parseXml(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getAllMakes(): Promise<Make[]> {
    return this.makeModel.find().exec();
  }
}
