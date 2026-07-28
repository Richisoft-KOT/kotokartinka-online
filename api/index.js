const URL = 'https://supabase.co';
const KEY = 'sb_publishable_1Zxs_9yRDVRr1DTfyck8WA_v8VUst77';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  const { type, id } = req.query;

  try {
    // 1. СЕРВЕРНОЕ ЧТЕНИЕ ЛЕНТЫ ИЗ SUPABASE
    if (type === 'get_feed') {
      const sRes = await fetch(`${URL}/rest/v1/kotokartinka_posts?select=id,text,image&order=id.desc`, {
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Range': '0-24' }
      });
      const data = await sRes.json();
      return res.status(200).json(data);
    }

    // 2. СЕРВЕРНАЯ ПУБЛИКАЦИЯ В SUPABASE
    if (type === 'add_post') {
      const sRes = await fetch(`${URL}/rest/v1/kotokartinka_posts`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(req.body)
      });
      return res.status(200).json({ status: 'success' });
    }

    // 3. СЕРВЕРНОЕ УДАЛЕНИЕ ИЗ SUPABASE
    if (type === 'delete_post') {
      await fetch(`${URL}/rest/v1/kotokartinka_posts?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
      });
      return res.status(200).json({ status: 'success' });
    }

    return res.status(400).json({ error: 'bad_route' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
