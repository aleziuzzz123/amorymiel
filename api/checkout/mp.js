
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const token = process.env.MP_ACCESS_TOKEN;
  const pref = {
    items: (req.body.items||[]).map(i=>({ title: i.title, quantity: i.quantity, currency_id: 'MXN', unit_price: i.unit_price, picture_url: i.picture_url })),
    back_urls: { success: process.env.SUCCESS_URL || 'https://your-domain/success', failure: process.env.FAIL_URL || 'https://your-domain/failure', pending: process.env.PENDING_URL || 'https://your-domain/pending' },
    auto_return: 'approved',
    notification_url: process.env.MP_WEBHOOK_URL || 'https://your-domain/api/fulfill'
  };
  const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method:'POST', headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(pref)
  });
  const data = await r.json();
  res.status(200).json({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point, id: data.id });
}
