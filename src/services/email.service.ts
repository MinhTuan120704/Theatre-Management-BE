import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  static async sendBookingConfirmation(email: string, orderDetails: any) {
    const {
      customerName,
      movieTitle,
      cinemaName,
      cinemaAddress,
      roomName,
      ticketPrice,
      showtime,
      tickets,
      products,
      totalPrice
    } = orderDetails;

    const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(Number(v));

    const ticketRows = tickets.map((ticket: any) => `
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;background:#FFD700;color:#fff">${ticket.seat}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;background:#FFD700;color:#fff">${fmt(ticket.price)} VND</td>
      </tr>
    `).join('');

    const productRows = products && products.length > 0
      ? products.map((product: any) => `
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd">${product.name}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${product.quantity}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">${fmt(product.price)} VND</td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">${fmt(Number(product.price) * Number(product.quantity))} VND</td>
        </tr>
      `).join('')
      : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Xác nhận đặt vé thành công',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;border-radius:10px;">
          <div style="text-align:center;background:#7B3FBF;color:#fff;padding:20px;border-radius:10px 10px 0 0;">
            <h2 style="margin:0;">Đặt vé thành công!</h2>
          </div>
          <div style="background:#fff;padding:20px;border-radius:0 0 10px 10px;">
            <p><strong>Khách hàng:</strong> ${customerName || 'Khách hàng'}</p>
            <p><strong>Tên phim:</strong> ${movieTitle}</p>
            <p><strong>Rạp chiếu:</strong> ${cinemaName}</p>
            <p><strong>Địa chỉ:</strong> ${cinemaAddress}</p>
            <p><strong>Phòng:</strong> ${roomName}</p>
            <p><strong>Suất chiếu:</strong> ${showtime || 'Unknown'}</p>
            <p><strong>Giá vé:</strong> ${fmt(ticketPrice)} VND</p>

            <h3 style="color:#7B3FBF;text-align:center;">Danh sách vé</h3>
            <table style="border-collapse:collapse;width:100%;max-width:600px;margin:0 auto;">
              <thead>
                  <tr>
                    <th style="padding:8px 10px;border:1px solid #ddd;text-align:center;background:#7B3FBF;color:#fff">Ghế</th>
                    <th style="padding:8px 10px;border:1px solid #ddd;text-align:center;background:#7B3FBF;color:#fff">Giá</th>
                  </tr>
              </thead>
              <tbody>
                ${ticketRows}
              </tbody>
            </table>

            <h3 style="color:#7B3FBF;text-align:center;">Danh sách đồ ăn</h3>
            ${productRows ? `
              <table style="border-collapse:collapse;width:100%;max-width:600px;margin:0 auto;">
                <thead>
                  <tr>
                    <th style="padding:8px 10px;border:1px solid #ddd;text-align:center;background:#7B3FBF;color:#fff">Sản phẩm</th>
                    <th style="padding:8px 10px;border:1px solid #ddd;text-align:center;background:#7B3FBF;color:#fff">Số lượng</th>
                    <th style="padding:8px 10px;border:1px solid #ddd;text-align:center;background:#7B3FBF;color:#fff">Giá</th>
                    <th style="padding:8px 10px;border:1px solid #ddd;text-align:center;background:#7B3FBF;color:#fff">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
              <p style="text-align:right;"><strong>Tổng tiền:</strong> ${fmt(totalPrice)} VND</p>
            ` : '<p style="text-align:center;">Không có đồ ăn</p>'}

            <p style="text-align:center;color:#7B3FBF;font-weight:bold;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default EmailService;