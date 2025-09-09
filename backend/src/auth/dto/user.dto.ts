
import { IsEmail,
  IsString,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  Matches } from 'class-validator';

export class EventSummaryDto {
  name: string;
  date: Date;
}

export class TicketSummaryDto {
  id: string;
  event: EventSummaryDto;
}

export class UserProfileResponseDto {
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  tickets: TicketSummaryDto[];
}