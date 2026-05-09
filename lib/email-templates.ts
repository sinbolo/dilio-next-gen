export const getWelcomeEmailHtml = (logoUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 80px 40px; text-align: center; }
    .logo { width: 140px; margin-bottom: 50px; }
    h1 { text-transform: uppercase; letter-spacing: 0.5em; font-size: 18px; margin-bottom: 30px; font-weight: 700; color: #22c55e; }
    p { font-size: 12px; letter-spacing: 0.2em; line-height: 2.2; color: #a1a1aa; margin-bottom: 40px; text-transform: uppercase; }
    .footer { border-top: 1px solid #27272a; padding-top: 40px; font-size: 8px; color: #52525b; letter-spacing: 0.5em; text-transform: uppercase; }
    .highlight { color: #ffffff; font-weight: 700; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${logoUrl}" alt="DILIO" class="logo">
    <h1>CONFIRMADO</h1>
    <p>
      TE HAS UNIDO A NUESTRA <span class="highlight">LISTA EXCLUSIVA</span>.<br>
      RECIBIRÁS ACCESO PRIORITARIO A PRÓXIMOS DESTINOS, LANZAMIENTOS Y EXPERIENCIAS LIMITADAS ANTES QUE NADIE.
    </p>
    <div class="footer">
      DILIO // EXPLORACIÓN DEL SONIDO & ARTE
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
    .container { max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #000; }
    .logo { width: 100px; margin-bottom: 40px; }
    h1 { text-transform: uppercase; letter-spacing: 0.3em; font-size: 14px; border-bottom: 3px solid #000; padding-bottom: 15px; display: block; margin-bottom: 40px; }
    .field { margin-bottom: 35px; }
    .label { font-size: 9px; letter-spacing: 0.3em; color: #888; text-transform: uppercase; margin-bottom: 10px; font-weight: 700; }
    .value { font-size: 13px; line-height: 1.8; letter-spacing: 0.05em; }
    .message-box { background: #fcfcfc; padding: 30px; border: 1px solid #eee; font-style: normal; color: #333; }
    .footer { margin-top: 60px; font-size: 8px; color: #aaa; letter-spacing: 0.2em; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${logoUrl}" alt="DILIO" class="logo">
    <h1>NUEVA SOLICITUD DE BOOKING</h1>
    
    <div class="field">
      <div class="label">CONTACTO DIRECTO</div>
      <div class="value"><strong>${data.email}</strong></div>
    </div>
    
    <div class="field">
      <div class="label">DETALLES DE LA SOLICITUD</div>
      <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
    </div>

    <div class="footer">
      ENVIADO DESDE EL PORTAL OFICIAL DILIO.ES
    </div>
  </div>
</body>
</html>
`;

export const getBookingConfirmationEmailHtml = (logoUrl: string, originalMessage: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 80px 40px; }
    .logo { width: 120px; margin-bottom: 60px; }
    h1 { text-transform: uppercase; letter-spacing: 0.4em; font-size: 16px; margin-bottom: 40px; font-weight: 700; color: #22c55e; }
    p { font-size: 12px; letter-spacing: 0.15em; line-height: 2; color: #a1a1aa; margin-bottom: 40px; text-transform: uppercase; }
    .message-copy { border-left: 1px solid #27272a; padding-left: 20px; margin: 40px 0; color: #52525b; font-size: 11px; }
    .footer { border-top: 1px solid #27272a; padding-top: 40px; font-size: 8px; color: #52525b; letter-spacing: 0.4em; text-transform: uppercase; text-align: center; }
    .highlight { color: #ffffff; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${logoUrl}" alt="DILIO" class="logo">
    <h1>SOLICITUD RECIBIDA</h1>
    <p>
      HEMOS RECIBIDO TU SOLICITUD DE <span class="highlight">BOOKING</span> CORRECTAMENTE.<br><br>
      NUESTRO EQUIPO DE MANAGEMENT REVISARÁ LOS DETALLES CON LA MÁXIMA PRIORIDAD Y NOS PONDREMOS EN CONTACTO CONTIGO A LA BREVEDAD POSIBLE PARA GESTIONAR LA DISPONIBILIDAD.
    </p>
    
    <div class="label" style="font-size: 8px; letter-spacing: 0.3em; color: #52525b; text-transform: uppercase;">Copia de tu mensaje:</div>
    <div class="message-copy">
      ${originalMessage.replace(/\n/g, '<br>')}
    </div>

    <p style="font-size: 10px; color: #52525b;">
      GRACIAS POR TU INTERÉS EN LA PROPUESTA ARTÍSTICA DE DILIO.
    </p>

    <div class="footer">
      DILIO // MANAGEMENT GLOBAL
    </div>
  </div>
</body>
</html>
`;
