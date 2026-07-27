// Глобальные настройки базы данных Supabase
var SUPABASE_URL = 'https://supabase.co';
var SUPABASE_KEY = 'sb_publishable_1Zxs_9yRDVRr1DTfyck8WA_v8VUst77';

// Получаем текущую сессию пользователя
var cUser = localStorage.getItem('koto_current_user');
var cId = parseInt(localStorage.getItem('koto_current_id')) || 0;

// ЖЕСТКАЯ ЗАЩИТА: Автоматический сброс сессии, если плохой дядя подделал ID в консоли смартфона
if (cUser) {
  var checkName = cUser.toLowerCase();
  if ((checkName === 'richisoft' && cId !== 1) || (checkName === 'тестер' && cId !== 2)) {
    localStorage.clear();
    alert('Система безопасности: Сессия подделана!');
    // Определяем имя текущего файла, чтобы не гонять по кругу
    var page = window.location.pathname.split("/").pop();
    if (page !== 'login.html' && page !== 'register.html') {
      window.location.href = 'login.html';
    }
  }
}

// Помощник для проверки, админ ли текущий пользователь
function isUserAdmin() {
  return (cId === 1 || cId === 2);
}

// Помощник для получения тега роли
function getRoleTag() {
  if (cId === 1) return ' [создатель]';
  if (cId === 2) return ' [тест]';
  return '';
}
