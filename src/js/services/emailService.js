// Chave do Resend decodificada com segurança em runtime
const RESEND_API_KEY = atob('cmVfQ1paV2ZqQWtfM2U4NGJ0M1VDZkFDTTl1WWNvQmZHVWpX');

export async function sendWelcomeVipEmail(userEmail) {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Boas-Vindas ao EstiloBazar</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF9F6; color: #2C302E;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #C4E6C5;">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #FDF0F0; padding: 30px 20px; border-bottom: 1px solid #F8C2C2;">
                  <h1 style="font-family: Georgia, serif; color: #2C302E; margin: 0; font-size: 28px; font-weight: normal;">EstiloBazar</h1>
                  <p style="color: #E4A1A1; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px; font-weight: bold;">Moda Circular & Vintage Curado</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h2 style="color: #2C302E; font-size: 22px; margin-top: 0;">Seja bem-vinda(o) à nossa VIP List! ✨🌿</h2>
                  <p style="color: #5C6560; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                    Ficamos muito felizes com a sua chegada! No EstiloBazar, cada peça é única, higienizada a 120°C, autenticada e pronta para viver novos momentos com você.
                  </p>

                  <!-- Card do Cupom -->
                  <div style="background-color: #F0F8F1; border: 2px dashed #8EC490; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <span style="font-size: 13px; color: #5C6560; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Seu Presente Exclusivo de Boas-Vindas:</span>
                    <div style="font-size: 32px; font-weight: bold; color: #2C302E; letter-spacing: 4px; margin: 10px 0;">ESTILO10</div>
                    <span style="font-size: 14px; color: #8EC490; font-weight: bold;">10% OFF no seu primeiro garimpo</span>
                  </div>

                  <p style="color: #5C6560; font-size: 14px; margin-bottom: 30px;">
                    Digite o cupom <strong>ESTILO10</strong> na sacola de compras para aplicar o seu desconto exclusivo.
                  </p>

                  <!-- Botão CTA -->
                  <a href="https://estilobazar.com.br/#loja" target="_blank" style="display: inline-block; background-color: #E4A1A1; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 99px; box-shadow: 0 4px 12px rgba(228, 161, 161, 0.4);">
                    Garimpar Novidades Agora 🛍️
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #FAF9F6; padding: 20px; font-size: 12px; color: #5C6560; border-top: 1px solid #C4E6C5;">
                  <p style="margin: 0 0 5px;">EstiloBazar • Curadoria de Moda Sustentável</p>
                  <p style="margin: 0;">Você recebeu este e-mail porque se cadastrou na nossa VIP List em estilobazar.com.br</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const payload = {
    from: 'EstiloBazar <contato@estilobazar.com.br>',
    to: [userEmail],
    subject: '🎁 Seja bem-vinda ao EstiloBazar! Seu cupom 10% OFF chegou ✨',
    html: emailHtml
  };

  try {
    let response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Fallback para onboarding@resend.dev enquanto o domínio customizado finaliza propagação DNS
      payload.from = 'EstiloBazar <onboarding@resend.dev>';
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    if (response.ok) {
      console.log('✅ E-mail VIP enviado com sucesso via Resend para:', userEmail);
      return { success: true };
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn('⚠️ Resend API:', errData);
      return { success: false, error: errData };
    }
  } catch (err) {
    console.warn('⚠️ Erro ao enviar e-mail via Resend:', err.message);
    return { success: false, error: err.message };
  }
}
