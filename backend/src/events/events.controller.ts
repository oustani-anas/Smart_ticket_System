import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { EventService } from './events.service';
import { AuthGuard } from '@nestjs/passport';
// event.controller.ts

// @UseGuards(AuthGuard('jwt'))
@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create')
  async create(@Body() body: any) {
    console.log("Creating event with:", body);
    return this.eventService.createEvent(body);
  }

  @Get('/getall')
  async findAll() {
    return this.eventService.getAllEvents();
  }
}

