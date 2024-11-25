import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  @Inject()
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('EMAIL_HOST'),
      port: configService.get('EMAIL_PORT'),
      secure: true,
      auth: {
        user: configService.get('EMAIL_FROM'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
      secret: configService.get('EMAIL_PASSWORD'),
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '轻记AI对话平台',
        address: this.configService.get('EMAIL_FROM'),
      },
      to,
      subject,
      html,
    });
  }
}
