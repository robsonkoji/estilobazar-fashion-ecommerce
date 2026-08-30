// Serverless Handler para Notificações de Pagamento (Webhooks do Mercado Pago / Gateway)
// Atualiza o status do pedido no Firestore de 'pending' para 'paid' em tempo real

import { db } from '../src/js/utils/firebase.js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { sendWelcomeVipEmail } from '../src/js/services/emailService.js';

export default async function handler(req, res) {
  // Trata requisições OPTIONS do navegador (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    console.log('⚡ Webhook de Pagamento Recebido:', body);

    // O Mercado Pago envia o ID do pagamento no query param 'id' ou no body 'data.id'
    const paymentId = req.query.id || (body.data && body.data.id) || body.id;
    const action = body.action || body.type;

    if (!paymentId) {
      return res.status(200).json({ status: 'ignored', message: 'Nenhum ID de pagamento informado' });
    }

    // Se for uma notificação de pagamento aprovado
    if (action === 'payment.created' || action === 'payment.updated' || body.status === 'approved') {
      const orderId = body.external_reference || body.order_id;

      if (orderId) {
        const orderRef = doc(db, 'orders', String(orderId));
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();

          // Atualiza o status para Aprovado no Firestore
          await updateDoc(orderRef, {
            status: 'paid',
            paymentStatus: 'approved',
            paidAt: new Date().toISOString()
          });

          // Dispara e-mail de confirmação para o cliente
          if (orderData.customerEmail) {
            await sendWelcomeVipEmail(orderData.customerEmail).catch(() => {});
          }

          console.log(`✅ Pedido #${orderId} atualizado para APROVADO via Webhook!`);
          return res.status(200).json({ success: true, orderId, status: 'paid' });
        }
      }
    }

    return res.status(200).json({ success: true, message: 'Webhook processado' });
  } catch (error) {
    console.warn('⚠️ Erro ao processar webhook de pagamento:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
