
export default async function handler(req, res){
  try{
    console.log('Webhook Mercado Pago:', req.method, req.body);
    return res.status(200).json({ ok:true });
  }catch(e){ return res.status(500).json({ ok:false, error: String(e) }); }
}
