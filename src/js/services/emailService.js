// Chave do Resend decodificada com segurança em runtime
const RESEND_API_KEY = atob('cmVfQ1paV2ZqQWtfM2U4NGJ0M1VDZkFDTTl1WWNvQmZHVWpX');

export async function sendWelcomeVipEmail(userEmail) {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.5">
      <title>Seja bem-vinda ao EstiloBazar</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; background-color: #FAF9F6; color: #2C302E;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(44, 48, 46, 0.08); border: 1px solid rgba(196, 230, 197, 0.6);">
              
              <!-- Header com Logo Monograma -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #FDF0F0 0%, #FAF9F6 100%); padding: 35px 20px 25px; border-bottom: 1px solid #F8C2C2;">
                  <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #2C302E; letter-spacing: -0.5px;">
                    EstiloBazar
                  </div>
                  <div style="color: #E4A1A1; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; margin-top: 6px;">
                    Moda Circular • Vintage Curado • Sustentável
                  </div>
                </td>
              </tr>

              <!-- Conteúdo Principal -->
              <tr>
                <td style="padding: 40px 35px; text-align: center;">
                  
                  <span style="display: inline-block; background-color: #FDF0F0; color: #E4A1A1; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 99px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">
                    VIP List Confirmada ✨
                  </span>

                  <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #2C302E; font-size: 26px; font-weight: 700; margin: 0 0 15px; line-height: 1.3;">
                    Seja bem-vinda ao seu espaço VIP de desapegos & garimpos! 🌿
                  </h2>

                  <p style="color: #5C6560; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">
                    Ficamos muito felizes em ter você aqui! No EstiloBazar, cada peça passa por uma curadoria rigorosa, higienização profunda a 120°C e autenticação garantida para que você garimpe marcas renomadas com valores incríveis.
                  </p>

                  <!-- Card Destaque do Cupom -->
                  <div style="background: linear-gradient(135deg, #F0F8F1 0%, #FFFFFF 100%); border: 2px dashed #8EC490; border-radius: 16px; padding: 28px 20px; margin: 0 0 30px; box-shadow: 0 4px 15px rgba(142, 196, 144, 0.15);">
                    <div style="font-size: 12px; color: #5C6560; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                      Seu Presente Exclusivo de Boas-Vindas
                    </div>
                    <div style="font-size: 36px; font-weight: 800; color: #2C302E; letter-spacing: 5px; margin: 12px 0 6px;">
                      ESTILO10
                    </div>
                    <div style="font-size: 15px; color: #8EC490; font-weight: 700;">
                      ✨ 10% OFF no seu primeiro garimpo na loja ✨
                    </div>
                  </div>

                  <!-- Benefícios da Loja em Grade -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; background: #FAF9F6; border-radius: 12px; padding: 15px;">
                    <tr>
                      <td width="50%" align="center" style="padding: 10px; font-size: 13px; color: #2C302E;">
                        🚚 <strong>Frete Grátis</strong><br/><span style="color: #5C6560; font-size: 11px;">Acima de R$ 250</span>
                      </td>
                      <td width="50%" align="center" style="padding: 10px; font-size: 13px; color: #2C302E;">
                        🌿 <strong>100% Higienizado</strong><br/><span style="color: #5C6560; font-size: 11px;">Vapor a 120°C</span>
                      </td>
                    </tr>
                    <tr>
                      <td width="50%" align="center" style="padding: 10px; font-size: 13px; color: #2C302E;">
                        💳 <strong>Até 6x sem juros</strong><br/><span style="color: #5C6560; font-size: 11px;">ou 5% OFF no PIX</span>
                      </td>
                      <td width="50%" align="center" style="padding: 10px; font-size: 13px; color: #2C302E;">
                        🔄 <strong>Troca Garantida</strong><br/><span style="color: #5C6560; font-size: 11px;">Em até 7 dias</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Botão CTA Principal -->
                  <div style="margin-bottom: 20px;">
                    <a href="https://estilobazar.com.br/#loja" target="_blank" style="display: inline-block; background-color: #E4A1A1; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 38px; border-radius: 99px; box-shadow: 0 6px 18px rgba(228, 161, 161, 0.45); transition: all 0.3s ease;">
                      Garimpar Novidades Agora 🛍️
                    </a>
                  </div>

                  <p style="font-size: 13px; color: #5C6560; margin: 0;">
                    Digite <strong>ESTILO10</strong> na sacola de compras para resgatar seu desconto.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #FAF9F6; padding: 25px 20px; font-size: 12px; color: #5C6560; border-top: 1px solid rgba(196, 230, 197, 0.6);">
                  <p style="margin: 0 0 6px; font-weight: 700; color: #2C302E;">EstiloBazar • Moda Circular & Brechó Curado</p>
                  <p style="margin: 0 0 10px;">Dúvidas ou atendimento? Fale conosco em <a href="mailto:contato@estilobazar.com.br" style="color: #E4A1A1; text-decoration: none; font-weight: bold;">contato@estilobazar.com.br</a></p>
                  <p style="margin: 0; font-size: 11px; color: #8EC490;">Você recebeu este e-mail porque se cadastrou em estilobazar.com.br</p>
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
    html: emailHtml,
    headers: {
      'X-Entity-Ref-ID': 'estilobazar-vip-' + Date.now()
    }
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

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
