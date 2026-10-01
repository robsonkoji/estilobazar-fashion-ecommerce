// Serviço de Cálculo Inteligente de Frete (Origem: Guarulhos - SP)
// Integração ViaCEP + Zonas de Distância Geográfica

const GUARULHOS_CEP_PREFIX = ['070', '071', '072', '073'];

/**
 * Busca dados de endereço pelo CEP na API pública ViaCEP
 * @param {string} cep 
 * @returns {Promise<Object|null>}
 */
export async function fetchAddressByCep(cep) {
  const cleanCep = (cep || '').replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (response.ok) {
      const data = await response.json();
      if (!data.erro) {
        return {
          cep: data.cep,
          street: data.logradouro,
          bairro: data.bairro,
          city: data.localidade,
          uf: data.uf
        };
      }
    }
  } catch (error) {
    console.warn('⚠️ Erro ao consultar ViaCEP:', error.message);
  }
  return null;
}

/**
 * Calcula opções de frete inteligentes com base na distância de Guarulhos - SP
 * @param {string} cep CEP do destinatário
 * @param {number} subtotal Valor total das peças no carrinho
 * @returns {Promise<Object>} Resultado do frete
 */
export async function calculateSmartShipping(cep, subtotal = 0) {
  const cleanCep = (cep || '').replace(/\D/g, '');
  const isFreeShippingThreshold = subtotal >= 250;

  // Consulta endereço via ViaCEP para determinar cidade e UF
  const addressInfo = await fetchAddressByCep(cleanCep);
  const city = addressInfo ? addressInfo.city : '';
  const uf = addressInfo ? addressInfo.uf : 'SP';
  const prefix3 = cleanCep.slice(0, 3);
  const prefix2 = cleanCep.slice(0, 2);

  let zone = 'norte';
  let zoneLabel = 'Região Norte';

  // 1. Zona 1: Guarulhos (Mesmo Município)
  if (GUARULHOS_CEP_PREFIX.includes(prefix3) || (city && city.toLowerCase() === 'guarulhos')) {
    zone = 'guarulhos';
    zoneLabel = 'Guarulhos (Local)';
  }
  // 2. Zona 2: Grande São Paulo & Capital (CEPs 01000 a 09999)
  else if (uf === 'SP' && (['01', '02', '03', '04', '05', '06', '08', '09'].includes(prefix2) || (city && (city.toLowerCase().includes('são paulo') || city.toLowerCase().includes('sao paulo') || city.toLowerCase().includes('osasco') || city.toLowerCase().includes('santo andré') || city.toLowerCase().includes('bernardo'))))) {
    zone = 'grande_sp';
    zoneLabel = 'Grande São Paulo & Capital';
  }
  // 3. Zona 3: Interior & Litoral de SP (Outros CEPs de SP)
  else if (uf === 'SP') {
    zone = 'interior_sp';
    zoneLabel = 'Interior & Litoral de SP';
  }
  // 4. Zona 4: Sudeste & Sul (RJ, MG, ES, PR, SC, RS)
  else if (['RJ', 'MG', 'ES', 'PR', 'SC', 'RS'].includes(uf)) {
    zone = 'sudeste_sul';
    zoneLabel = `Região ${['RJ', 'MG', 'ES'].includes(uf) ? 'Sudeste' : 'Sul'} (${uf})`;
  }
  // 5. Zona 5: Centro-Oeste & Nordeste (DF, GO, MT, MS, BA, PE, CE, MA, PB, RN, AL, SE, PI)
  else if (['DF', 'GO', 'MT', 'MS', 'BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'SE, PI'].includes(uf)) {
    zone = 'centro_nordeste';
    zoneLabel = `Região ${['DF', 'GO', 'MT', 'MS'].includes(uf) ? 'Centro-Oeste' : 'Nordeste'} (${uf})`;
  }
  // 6. Zona 6: Norte (AM, PA, AP, RO, RR, AC, TO)
  else {
    zone = 'norte';
    zoneLabel = `Região Norte (${uf})`;
  }

  // Tabela de Preços e Prazos baseada na Zona de Distância de Guarulhos
  let options = [];

  switch (zone) {
    case 'guarulhos':
      options = [
        {
          id: 'retirada_loja',
          name: '🛍️ Retirar no Brechó (Guarulhos - SP)',
          desc: 'Retirada gratuita agendada em Guarulhos',
          time: 'Pronto em até 2h',
          price: 0,
          originalPrice: 0,
          isFree: true
        },
        {
          id: 'local_express',
          name: '⚡ Entrega Expressa Brechó Guarulhos',
          desc: 'Entrega local via moto-delivery saindo da nossa central em Guarulhos',
          time: 'Chega hoje ou amanhã (Até 24h)',
          price: isFreeShippingThreshold ? 0 : 9.90,
          originalPrice: 9.90,
          isFree: isFreeShippingThreshold
        },
        {
          id: 'sedex_local',
          name: '📦 Correios SEDEX Local Guarulhos',
          desc: 'Postagem expressa nos Correios de Guarulhos',
          time: '1 dia útil',
          price: 14.90,
          originalPrice: 14.90,
          isFree: false
        }
      ];
      break;

    case 'grande_sp':
      options = [
        {
          id: 'retirada_loja',
          name: '🛍️ Retirar no Brechó (Guarulhos - SP)',
          desc: 'Retirada gratuita agendada em Guarulhos',
          time: 'Pronto em até 2h',
          price: 0,
          originalPrice: 0,
          isFree: true
        },
        {
          id: 'pac_sp',
          name: '📦 Correios PAC Grande SP',
          desc: 'Envio econômico de Guarulhos para Grande SP/Capital',
          time: '1 a 2 dias úteis',
          price: isFreeShippingThreshold ? 0 : 12.90,
          originalPrice: 12.90,
          isFree: isFreeShippingThreshold
        },
        {
          id: 'sedex_sp',
          name: '⚡ Correios SEDEX Expresso',
          desc: 'Postagem prioritária no mesmo dia',
          time: '1 dia útil',
          price: 17.90,
          originalPrice: 17.90,
          isFree: false
        }
      ];
      break;

    case 'interior_sp':
      options = [
        {
          id: 'pac_interior',
          name: '📦 Correios PAC SP Interior/Litoral',
          desc: 'Envio de Guarulhos para todo o estado de SP',
          time: '2 a 3 dias úteis',
          price: isFreeShippingThreshold ? 0 : 16.90,
          originalPrice: 16.90,
          isFree: isFreeShippingThreshold
        },
        {
          id: 'sedex_interior',
          name: '⚡ Correios SEDEX Expresso',
          desc: 'Postagem rápida de Guarulhos para o interior de SP',
          time: '1 a 2 dias úteis',
          price: 23.90,
          originalPrice: 23.90,
          isFree: false
        }
      ];
      break;

    case 'sudeste_sul':
      options = [
        {
          id: 'pac_sudeste_sul',
          name: `📦 Correios PAC Nacional (${uf})`,
          desc: `Envio de Guarulhos para ${uf}`,
          time: '3 a 5 dias úteis',
          price: isFreeShippingThreshold ? 0 : 21.90,
          originalPrice: 21.90,
          isFree: isFreeShippingThreshold
        },
        {
          id: 'sedex_sudeste_sul',
          name: '⚡ Correios SEDEX Expresso',
          desc: 'Envio expresso para outros estados',
          time: '2 a 3 dias úteis',
          price: 34.90,
          originalPrice: 34.90,
          isFree: false
        }
      ];
      break;

    case 'centro_nordeste':
      options = [
        {
          id: 'pac_centro_nordeste',
          name: `📦 Correios PAC Nacional (${uf})`,
          desc: `Envio de Guarulhos para ${uf}`,
          time: '4 a 7 dias úteis',
          price: isFreeShippingThreshold ? 0 : 27.90,
          originalPrice: 27.90,
          isFree: isFreeShippingThreshold
        },
        {
          id: 'sedex_centro_nordeste',
          name: '⚡ Correios SEDEX Expresso',
          desc: 'Envio prioritário via aéreo/terrestre',
          time: '2 a 4 dias úteis',
          price: 44.90,
          originalPrice: 44.90,
          isFree: false
        }
      ];
      break;

    case 'norte':
    default:
      options = [
        {
          id: 'pac_norte',
          name: `📦 Correios PAC Norte (${uf})`,
          desc: `Envio de Guarulhos para ${uf}`,
          time: '6 a 10 dias úteis',
          price: isFreeShippingThreshold ? 0 : 35.90,
          originalPrice: 35.90,
          isFree: isFreeShippingThreshold
        },
        {
          id: 'sedex_norte',
          name: '⚡ Correios SEDEX Aéreo Expresso',
          desc: 'Envio prioritário via transporte aéreo',
          time: '3 a 5 dias úteis',
          price: 64.90,
          originalPrice: 64.90,
          isFree: false
        }
      ];
      break;
  }

  return {
    success: true,
    cep: cleanCep,
    addressInfo,
    zone,
    zoneLabel,
    originCity: 'Guarulhos - SP',
    isFreeShippingThreshold,
    options
  };
}
