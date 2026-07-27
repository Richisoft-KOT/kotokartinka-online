// Временное серверное хранилище в памяти сервера Vercel
let koto_users = [
  { id: 1, username: 'Richisoft', password: 'kirill2015' }, // Напиши свой пароль
  { id: 2, username: 'тест', password: 'richi2020' }
];
let koto_posts = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  const { type } = req.query;

  try {
    // 1. Регистрация пользователей
    if (type === 'register') {
      const { user, pass, key } = req.body;
      const lowerUser = user.toLowerCase();

      if ((lowerUser === 'richisoft' && key !== 'richi2020') || (lowerUser === 'тест' && key !== 'richi2020')) {
        return res.status(200).json({ status: 'wrong_key' });
      }
      if (koto_users.some(u => u.username.toLowerCase() === lowerUser)) {
        return res.status(200).json({ status: 'occupied' });
      }

      const newId = koto_users.length + 1;
      koto_users.push({ id: newId, username: user, password: pass });
      return res.status(200).json({ status: 'success' });
    }

    // 2. Вход (Жесткая проверка пароля на сервере Vercel!)
    if (type === 'login') {
      const { user, pass } = req.body;
      const found = koto_users.find(u => u.username.toLowerCase() === user.toLowerCase() && u.password === pass);
      if (found) {
        return res.status(200).json({ status: 'success', id: found.id, username: found.username });
      }
      return res.status(200).json({ status: 'invalid' });
    }

    // 3. Получение ОБЩЕЙ ленты картинок
    if (type === 'get_feed') {
      return res.status(200).json(koto_posts);
    }

    // 4. Добавление мема в ОБЩУЮ ленту
    if (type === 'add_post') {
      const { title, image } = req.body;
      koto_posts.unshift({ id: Date.now(), title, image });
      if (koto_posts.length > 25) koto_posts.pop(); // Ограничение в 25 постов для лимита памяти
      return res.status(200).json({ status: 'success' });
    }

    return res.status(400).json({ error: 'bad_route' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
