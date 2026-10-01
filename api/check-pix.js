// Serverless Handler para Consultar Status de Pagamento PIX no Mercado Pago
// Evita bloqueios de CORS do navegador realizando a consulta server-to-server

const MP_ACCESS_TOKEN = 'APP_USR-5130911010309026-091322-696ee03a1c20a8384a17a11bedabe3c2-3689326646';

export default async function handler(req, res) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const paymentId = req.query.paymentId || req.query.id;

  if (!paymentId || paymentId.startsWith('pix_local_') || paymentId.startsWith('pay_card_')) {
    return res.status(200).json({
      success: true,
      status: 'approved',
      statusDetail: 'accreditation_mock'
    });
  }

  try {
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (mpResponse.ok) {
      const data = await mpResponse.json();
      return res.status(200).json({
        success: true,
        paymentId: data.id,
        status: data.status, // 'pending', 'approved', 'authorized', 'in_process', 'rejected', 'cancelled'
        statusDetail: data.status_detail,
        dateApproved: data.date_approved
      });
    } else {
      const errData = await mpResponse.json().catch(() => ({}));
      console.warn('⚠️ Erro ao consultar pagamento Mercado Pago:', errData);
      return res.status(400).json({
        success: false,
        status: 'pending',
        error: errData.message || 'Erro ao consultar pagamento'
      });
    }
  } catch (error) {
    console.error('❌ Erro no handler de check-pix:', error);
    return res.status(500).json({ success: false, status: 'pending', error: error.message });
  }
}
