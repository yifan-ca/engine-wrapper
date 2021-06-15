import { IsArray, IsInt, IsPositive, IsString } from 'class-validator';

export class MoveRequestDto {
  @IsString()
  position: string;

  @IsInt()
  @IsPositive()
  movetime: number;

  @IsArray()
  moves: string[];
}
