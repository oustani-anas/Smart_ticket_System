
import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus, TicketType } from '@prisma/client';
import * as QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PaymentService } from 'src/payment/payment.service';
import { promises as fs } from 'fs';
import * as path from 'path';
import { format } from 'date-fns';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService, 
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService) {}

  async validateTicket(ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.expiration < new Date()) {
      return { valid: false };
    }

    return { valid: true };
  }

  // async generateTicketPdf(
  //   ticketId: string,
  //   user: { firstname: string; lastname: string },
  //   event: { name: string; location: string; startTime: Date },
  //   ticketType: string,
  //   expiration: Date,
  // ): Promise<Buffer> {
  //   const pdfDoc = await PDFDocument.create();
  //   const page = pdfDoc.addPage([400, 600]);
  //   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  //   const drawText = (text: string, y: number) => {
  //     page.drawText(text, {
  //       x: 50,
  //       y,
  //       size: 12,
  //       font,
  //       color: rgb(0, 0, 0),
  //     });
  //   };

  //   drawText(`Smart Ticket System`, 550);
  //   drawText(`Ticket ID: ${ticketId}`, 520);
  //   drawText(`Name: ${user.firstname} ${user.lastname}`, 490);
  //   drawText(`Event: ${event.name}`, 460);
  //   drawText(`Location: ${event.location}`, 430);
  //   drawText(`Start Time: ${event.startTime.toLocaleString()}`, 400);
  //   drawText(`Ticket Type: ${ticketType}`, 370);
  //   drawText(`Expires: ${expiration.toLocaleString()}`, 340);

  //   const qrDataUrl = await QRCode.toDataURL(ticketId);
  //   const qrImage = await pdfDoc.embedPng(qrDataUrl);
  //   page.drawImage(qrImage, {
  //     x: 120,
  //     y: 180,
  //     width: 150,
  //     height: 150,
  //   });

  //   drawText(`Scan QR at entry`, 150);

  //   const pdfBytes = await pdfDoc.save();
  //   //const filePath = join(__dirname, `../../../tickets/${ticketId}.pdf`);
  //   // writeFileSync(filePath, pdfBytes);

  //   return Buffer.from(pdfBytes); // Optional return if you want to email it
  // }


  async generateTicketPdf(
  ticketId: string,
  user: { firstname: string; lastname: string },
  event: { name: string; location: string; startTime: Date },
  ticketType: string,
  expiration: Date,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 650]); // Made the page a bit taller
  const { width, height } = page.getSize();

  // --- 1. Load Fonts and Assets ---
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Load icon images from the assets folder
  const iconPath = path.join(process.cwd(), 'src/assets/icons');
  const calendarIconBytes = await fs.readFile(path.join(iconPath, 'calendar.png'));
  const clockIconBytes = await fs.readFile(path.join(iconPath, 'clock.png'));
  const locationIconBytes = await fs.readFile(path.join(iconPath, 'location.png'));

  const calendarIcon = await pdfDoc.embedPng(calendarIconBytes);
  const clockIcon = await pdfDoc.embedPng(clockIconBytes);
  const locationIcon = await pdfDoc.embedPng(locationIconBytes);

  // Define our brand color
  const brandColor = rgb(46 / 255, 125 / 255, 50 / 255); // Your app's primary green

  // --- 2. Draw Header ---
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: brandColor,
  });

  page.drawText('Smart Ticket System', {
    x: 30,
    y: height - 65,
    font: helveticaBoldFont,
    size: 24,
    color: rgb(1, 1, 1), // White
  });

  // --- 3. Draw Event Details Section ---
  const eventName = event.name;
  const eventNameWidth = helveticaBoldFont.widthOfTextAtSize(eventName, 26);
  page.drawText(eventName, {
    x: (width - eventNameWidth) / 2, // Center the text
    y: height - 140,
    font: helveticaBoldFont,
    size: 26,
    color: brandColor,
  });

  // A helper function to draw text with an icon
  const drawTextWithIcon = (icon: any, text: string, y: number) => {
    page.drawImage(icon, { x: 40, y: y - 2, width: 15, height: 15 });
    page.drawText(text, { x: 65, y, font: helveticaFont, size: 14 });
  };

  // Format dates using date-fns for a cleaner look
  drawTextWithIcon(calendarIcon, format(event.startTime, 'EEEE, MMMM dd, yyyy'), height - 180);
  drawTextWithIcon(clockIcon, format(event.startTime, 'hh:mm a'), height - 205);
  drawTextWithIcon(locationIcon, event.location, height - 230);
  
  // --- 4. Draw Ticket Holder Info ---
  page.drawLine({
    start: { x: 30, y: height - 260 },
    end: { x: width - 30, y: height - 260 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8), // Light grey
  });

  page.drawText('Ticket Holder:', { x: 30, y: height - 280, font: helveticaBoldFont, size: 12 });
  page.drawText(`${user.firstname} ${user.lastname}`, { x: 30, y: height - 295, font: helveticaFont, size: 16 });

  page.drawText('Ticket Type:', { x: 250, y: height - 280, font: helveticaBoldFont, size: 12 });
  page.drawText(ticketType, { x: 250, y: height - 295, font: helveticaFont, size: 16 });

  // --- 5. Draw QR Code Section ---
  page.drawRectangle({
    x: 30,
    y: 80,
    width: width - 60,
    height: 180,
    borderColor: brandColor,
    borderWidth: 1.5,
  });

  const qrDataUrl = await QRCode.toDataURL(ticketId, { width: 200 });
  const qrImage = await pdfDoc.embedPng(qrDataUrl);
  page.drawImage(qrImage, {
    x: (width - 140) / 2,
    y: 120,
    width: 140,
    height: 140,
  });

  page.drawText('Scan QR Code at Entry', {
    x: (width - helveticaFont.widthOfTextAtSize('Scan QR Code at Entry', 12)) / 2,
    y: 95,
    font: helveticaFont,
    size: 12,
  });

  // --- 6. Draw Footer with Ticket ID ---
  const footerText = `ID: ${ticketId} - Valid until ${format(expiration, 'MMM dd, yyyy, hh:mm a')}`;
  page.drawText(footerText, {
    x: (width - helveticaFont.widthOfTextAtSize(footerText, 9)) / 2,
    y: 30,
    font: helveticaFont,
    size: 9,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

  async getTicketPdf(ticketId: string, userId: string): Promise<Buffer | null> {
  
    const tticket = await this.prisma.ticket.findFirst({
        where: { id: ticketId, userId: userId }
    });

    if (!tticket) {
        throw new NotFoundException('Ticket not found or you do not have permission to access it.');
    }

    const ticket = await this.prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: true,
      event: true,
    },
  });

  if (!ticket) return null;

  return await this.generateTicketPdf(
    ticket.id,
    {
      firstname: ticket.user.firstname,
      lastname: ticket.user.lastname,
    },
    {
      name: ticket.event.name,
      location: ticket.event.location,
      startTime: ticket.event.startTime,
    },
    ticket.type,
    ticket.expiration,
  );
}

  async getTicketIdBySessionId(sessionId: string): Promise<string> {
  const session = await this.paymentService.getSession(sessionId);

  if (
    session.payment_status !== 'paid' ||
    !session.metadata?.userId ||
    !session.metadata?.eventId
  ) {
    throw new Error('Invalid or incomplete session');
  }

  const ticket = await this.prisma.ticket.findFirst({
    where: {
      userId: session.metadata.userId,
      eventId: session.metadata.eventId,
    },
  });

  if (!ticket) {
    throw new Error('Ticket not found for this session');
  }

  return ticket.id;
}

async getMyTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: {userId: userId},
      include: {
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  }
}