const URL = 'https://supabase.com';
const KEY = 'sb_publishable_1Zxs_9yRDVRr1DTfyck8WA_v8VUst77';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  const { type, id } = req.query;

  try {
    if (type === 'get_feed') {
      const sRes = await fetch(`${URL}/rest/v1/kotokartinka_posts?select=id,text,image&order=id.desc`, {
        method: 'GET',
        headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY }
      });
      const data = await sRes.json();
      return res.status(200).json(data);
    }

    if (type === 'add_post') {
      await fetch(`${URL}/rest/v1/kotokartinka_posts`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(req.body)
      });
      return res.status(200).json({ status: 'success' });
    }

    if (type === 'delete_post') {
      await fetch(`${URL}/rest/v1/kotokartinka_posts?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY }
      });
      return res.status(200).json({ status: 'success' });
    }

    return res.status(400).json({ error: 'bad_route' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
