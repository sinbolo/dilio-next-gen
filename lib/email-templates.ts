export const getWelcomeEmailHtml = (logoUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 60px 40px; text-align: center; }
    .logo { width: 120px; margin-bottom: 40px; filter: contrast(1.5) brightness(1.1); }
    h1 { text-transform: uppercase; letter-spacing: 0.3em; font-size: 20px; margin-bottom: 30px; font-weight: 700; }
    p { font-size: 13px; letter-spacing: 0.15em; line-height: 2; color: #444; margin-bottom: 40px; text-transform: uppercase; }
    .footer { border-top: 1px solid #f0f0f0; padding-top: 30px; font-size: 9px; color: #999; letter-spacing: 0.4em; text-transform: uppercase; }
    .highlight { color: #000; font-weight: 700; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${logoUrl}" alt="DILIO" class="logo">
    <h1>Confirmado</h1>
    <p>
      Ya formas parte de nuestra <span class="highlight">lista exclusiva</span>.<br>
      Recibirás noticias sobre próximos sets, lanzamientos y merch antes que nadie.
    </p>
    <div class="footer">
      Exploración del Sonido // DILIO
    </div>
  </div>
</body>
</html>
`;

export const getBookingEmailHtml = (logoUrl: string, data: { email: string, message: string }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; }
    .logo { width: 80px; margin-bottom: 30px; }
    h1 { text-transform: uppercase; letter-spacing: 0.2em; font-size: 16px; border-bottom: 2px solid #000; padding-bottom: 10px; display: inline-block; }
    .field { margin-bottom: 25px; }
    .label { font-size: 10px; letter-spacing: 0.2em; color: #888; text-transform: uppercase; margin-bottom: 5px; }
    .value { font-size: 14px; line-height: 1.6; }
    .message-box { background: #f9f9f9; padding: 20px; border-left: 4px solid #000; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${logoUrl}" alt="DILIO" class="logo">
    <br>
    <h1>Nueva Solicitud de Booking</h1>
    
    <div class="field">
      <div class="label">Contacto</div>
      <div class="value"><strong>${data.email}</strong></div>
    </div>
    
    <div class="field">
      <div class="label">Mensaje / Detalles</div>
      <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
    </div>

    <div style="font-size: 10px; color: #ccc; margin-top: 40px; letter-spacing: 0.1em;">
      Enviado desde dilio.es
    </div>
  </div>
</body>
</html>
`;
