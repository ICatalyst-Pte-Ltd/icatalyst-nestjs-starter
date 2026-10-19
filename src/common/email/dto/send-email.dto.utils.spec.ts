import { SendEmailDto } from './send-email.dto.js';

export function sendEmailDto({
  to = 'test@email.com',
  subject = 'subject',
  text = 'text',
  html = '<html></html>',
}: Partial<SendEmailDto>): SendEmailDto {
  return {
    to,
    subject,
    text,
    html,
  };
}
