import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VehicleTypeDTO {
  @Field()
  TypeId: number;

  @Field()
  TypeName: string;
}

@ObjectType()
export class MakeDTO {
  @Field()
  MakeId: number;

  @Field()
  MakeName: string;

  @Field(() => [VehicleTypeDTO])
  VehicleTypes: VehicleTypeDTO[];
}
