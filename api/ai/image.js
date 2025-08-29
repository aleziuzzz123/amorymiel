
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body||{};
  // Placeholder image URL so the Admin "Generar" button works out-of-the-box
  return res.status(200).json({ image_url: `https://picsum.photos/seed/${Math.random().toString(16).slice(2)}/800/600` });
}
