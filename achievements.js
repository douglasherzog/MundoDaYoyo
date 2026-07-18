/* ====== ACHIEVEMENTS SYSTEM — Badges, tracking, daily bonus ====== */
(function () {
    'use strict';

    var STORAGE_KEY = 'yoyo_achievements';
    var DAILY_KEY = 'yoyo_daily_bonus';
    var TRACK_KEY = 'yoyo_stats';

    /* ===== BADGE DEFINITIONS ===== */
    var BADGES = [
        { id: 'first_star', icon: '⭐', name: 'Primeira Estrela', desc: 'Ganhou sua primeira estrela!', condition: function (s) { return s.totalStars >= 1; } },
        { id: 'ten_stars', icon: '🌟', name: 'Dez Estrelas', desc: 'Juntou 10 estrelas!', condition: function (s) { return s.totalStars >= 10; } },
        { id: 'fifty_stars', icon: '✨', name: 'Colecionadora', desc: 'Juntou 50 estrelas!', condition: function (s) { return s.totalStars >= 50; } },
        { id: 'hundred_stars', icon: '💫', name: 'Centenária', desc: 'Juntou 100 estrelas!', condition: function (s) { return s.totalStars >= 100; } },
        { id: 'streak3', icon: '🔥', name: 'Três Seguidos', desc: 'Acertou 3 sem errar!', condition: function (s) { return s.maxStreak >= 3; } },
        { id: 'streak5', icon: '⚡', name: 'Cinco Seguidos', desc: 'Acertou 5 sem errar!', condition: function (s) { return s.maxStreak >= 5; } },
        { id: 'streak10', icon: '🏆', name: 'Imparável!', desc: 'Acertou 10 sem errar!', condition: function (s) { return s.maxStreak >= 10; } },
        { id: 'games5', icon: '🎮', name: 'Exploradora', desc: 'Jogou 5 jogos diferentes!', condition: function (s) { return Object.keys(s.gamesPlayed).length >= 5; } },
        { id: 'games10', icon: '🗺️', name: 'Aventureira', desc: 'Jogou 10 jogos diferentes!', condition: function (s) { return Object.keys(s.gamesPlayed).length >= 10; } },
        { id: 'games_all', icon: '👑', name: 'Rainha do Mundo', desc: 'Jogou todos os jogos!', condition: function (s) { return Object.keys(s.gamesPlayed).length >= 20; } },
        { id: 'daily3', icon: '📅', name: 'Constância', desc: 'Voltou 3 dias seguidos!', condition: function (s) { return s.dailyStreak >= 3; } },
        { id: 'daily7', icon: '🎖️', name: 'Semana Perfeita', desc: 'Voltou 7 dias seguidos!', condition: function (s) { return s.dailyStreak >= 7; } },
        { id: 'perfect_game', icon: '💯', name: 'Jogo Perfeito', desc: 'Completou um jogo sem errar!', condition: function (s) { return s.perfectGames >= 1; } },
        { id: 'perfect5', icon: '🎯', name: 'Perfeição', desc: '5 jogos perfeitos!', condition: function (s) { return s.perfectGames >= 5; } }
    ];

    /* ===== COLLECTIBLES (unicorn accessories) ===== */
    var COLLECTIBLES = [
        { id: 'mane_pink', icon: '💗', name: 'Crina Rosa', starsNeeded: 5 },
        { id: 'mane_rainbow', icon: '🌈', name: 'Crina Arco-íris', starsNeeded: 15 },
        { id: 'crown', icon: '👑', name: 'Coroa Dourada', starsNeeded: 25 },
        { id: 'wings', icon: '🦋', name: 'Asas Mágicas', starsNeeded: 40 },
        { id: 'star_horn', icon: '🌟', name: 'Chifre Estelar', starsNeeded: 60 },
        { id: 'rainbow_tail', icon: '✨', name: 'Rabo Arco-íris', starsNeeded: 80 },
        { id: 'sparkle_aura', icon: '💫', name: 'Aura Brilhante', starsNeeded: 100 },
        { id: 'golden_hooves', icon: '🏅', name: 'Cascos Dourados', starsNeeded: 150 }
    ];

    /* ===== STORAGE HELPERS ===== */
    function loadStats() {
        try {
            var data = JSON.parse(localStorage.getItem(TRACK_KEY));
            if (!data) return { totalStars: 0, maxStreak: 0, gamesPlayed: {}, dailyStreak: 0, perfectGames: 0, lastVisit: null };
            return data;
        } catch (e) {
            return { totalStars: 0, maxStreak: 0, gamesPlayed: {}, dailyStreak: 0, perfectGames: 0, lastVisit: null };
        }
    }

    function saveStats(stats) {
        try { localStorage.setItem(TRACK_KEY, JSON.stringify(stats)); } catch (e) {}
    }

    function loadEarnedBadges() {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return data || [];
        } catch (e) { return []; }
    }

    function saveEarnedBadges(badges) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(badges)); } catch (e) {}
    }

    /* ===== TRACKING ===== */
    function trackGamePlayed(gameId) {
        var stats = loadStats();
        if (!stats.gamesPlayed) stats.gamesPlayed = {};
        stats.gamesPlayed[gameId] = (stats.gamesPlayed[gameId] || 0) + 1;
        saveStats(stats);
        checkBadges(stats);
    }

    function trackStars(totalStars) {
        var stats = loadStats();
        stats.totalStars = totalStars;
        saveStats(stats);
        checkBadges(stats);
    }

    function trackStreak(currentStreak) {
        var stats = loadStats();
        if (currentStreak > (stats.maxStreak || 0)) {
            stats.maxStreak = currentStreak;
            saveStats(stats);
            checkBadges(stats);
        }
    }

    function trackPerfectGame() {
        var stats = loadStats();
        stats.perfectGames = (stats.perfectGames || 0) + 1;
        saveStats(stats);
        checkBadges(stats);
    }

    /* ===== DAILY BONUS ===== */
    function checkDailyBonus() {
        var stats = loadStats();
        var today = new Date().toDateString();
        var lastVisit = stats.lastVisit;

        if (lastVisit === today) return null;

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var yesterdayStr = yesterday.toDateString();

        if (lastVisit === yesterdayStr) {
            stats.dailyStreak = (stats.dailyStreak || 0) + 1;
        } else {
            stats.dailyStreak = 1;
        }

        stats.lastVisit = today;
        saveStats(stats);
        checkBadges(stats);

        var bonus = Math.min(stats.dailyStreak * 2, 10);
        if (typeof adicionarEstrelas === 'function') {
            adicionarEstrelas(bonus);
        }
        return { streak: stats.dailyStreak, bonus: bonus };
    }

    /* ===== BADGE CHECKING ===== */
    function checkBadges(stats) {
        var earned = loadEarnedBadges();
        var newBadges = [];

        BADGES.forEach(function (badge) {
            if (earned.indexOf(badge.id) === -1 && badge.condition(stats)) {
                earned.push(badge.id);
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            saveEarnedBadges(earned);
            newBadges.forEach(function (badge, i) {
                setTimeout(function () { showBadgePopup(badge); }, i * 1200);
            });
        }
    }

    function showBadgePopup(badge) {
        var popup = document.createElement('div');
        popup.style.cssText = [
            'position:fixed', 'top:50%', 'left:50%', 'transform:translate(-50%,-50%)',
            'background:linear-gradient(135deg,#6c5ce7,#a29bfe)', 'color:#fff',
            'padding:25px 40px', 'border-radius:25px', 'z-index:99999',
            'text-align:center', 'box-shadow:0 10px 40px rgba(108,92,231,0.5)',
            'animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1)'
        ].join(';');
        popup.innerHTML =
            '<div style="font-size:4rem;margin-bottom:10px">' + badge.icon + '</div>' +
            '<div style="font-size:1.5rem;font-weight:bold;margin-bottom:5px">Nova Conquista!</div>' +
            '<div style="font-size:1.3rem;margin-bottom:5px">' + badge.name + '</div>' +
            '<div style="font-size:1rem;opacity:0.9">' + badge.desc + '</div>';
        document.body.appendChild(popup);

        if (typeof YoyoMascot !== 'undefined') {
            YoyoMascot.setMood('celebrate');
            YoyoMascot.say('Nova conquista! ' + badge.name + '!');
        }
        if (typeof playVictory === 'function') playVictory();

        setTimeout(function () {
            popup.style.transition = 'opacity 0.5s, transform 0.5s';
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%,-50%) scale(0.5)';
            setTimeout(function () { popup.remove(); }, 500);
        }, 3000);
    }

    /* ===== BADGES PANEL (for menu page) ===== */
    function createBadgesPanel() {
        var stats = loadStats();
        var earned = loadEarnedBadges();
        var collected = getEarnedCollectibles(stats.totalStars);

        var panel = document.createElement('div');
        panel.id = 'yoyo-badges-panel';
        panel.style.cssText = [
            'margin-top:30px', 'padding:25px', 'background:rgba(255,255,255,0.85)',
            'border-radius:25px', 'box-shadow:0 5px 15px rgba(0,0,0,0.08)'
        ].join(';');

        var html = '<h2 style="text-align:center;color:#6c5ce7;font-size:2rem;margin-bottom:15px">🏆 Minhas Conquistas</h2>';

        html += '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:20px">';
        BADGES.forEach(function (badge) {
            var has = earned.indexOf(badge.id) !== -1;
            html += '<div title="' + badge.name + ': ' + badge.desc + '" style="' +
                'width:70px;height:70px;border-radius:15px;display:flex;align-items:center;justify-content:center;' +
                'font-size:2.2rem;cursor:help;transition:transform 0.2s;' +
                (has ? 'background:linear-gradient(135deg,#fff9c4,#ffd54f);box-shadow:0 3px 10px rgba(255,213,79,0.4)' : 'background:rgba(200,200,200,0.3);filter:grayscale(1);opacity:0.4') +
                '" onmouseover="this.style.transform=\'scale(1.15)\'" onmouseout="this.style.transform=\'scale(1)\'">' +
                badge.icon + '</div>';
        });
        html += '</div>';

        html += '<h2 style="text-align:center;color:#6c5ce7;font-size:1.8rem;margin-bottom:15px">🦄 Acessórios do Unicórnio</h2>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">';
        COLLECTIBLES.forEach(function (item) {
            var has = collected.indexOf(item.id) !== -1;
            html += '<div title="' + item.name + ' (' + item.starsNeeded + ' estrelas)" style="' +
                'width:65px;height:65px;border-radius:15px;display:flex;align-items:center;justify-content:center;' +
                'font-size:2rem;cursor:help;transition:transform 0.2s;' +
                (has ? 'background:linear-gradient(135deg,#e1bee7,#f8bbd0);box-shadow:0 3px 10px rgba(225,190,231,0.5)' : 'background:rgba(200,200,200,0.3);filter:grayscale(1);opacity:0.4') +
                '" onmouseover="this.style.transform=\'scale(1.15)\'" onmouseout="this.style.transform=\'scale(1)\'">' +
                item.icon + '</div>';
        });
        html += '</div>';

        if (stats.dailyStreak > 0) {
            html += '<div style="text-align:center;margin-top:15px;font-size:1.2rem;color:#FF6B9D">📅 ' + stats.dailyStreak + ' dia' + (stats.dailyStreak > 1 ? 's' : '') + ' seguidos voltando!</div>';
        }

        panel.innerHTML = html;

        var footer = document.querySelector('footer');
        if (footer) footer.parentNode.insertBefore(panel, footer);
        else document.querySelector('.container').appendChild(panel);
    }

    function getEarnedCollectibles(totalStars) {
        return COLLECTIBLES.filter(function (c) { return totalStars >= c.starsNeeded; }).map(function (c) { return c.id; });
    }

    /* ===== DAILY BONUS POPUP ===== */
    function showDailyBonusPopup(info) {
        var popup = document.createElement('div');
        popup.style.cssText = [
            'position:fixed', 'top:50%', 'left:50%', 'transform:translate(-50%,-50%)',
            'background:linear-gradient(135deg,#ff9a9e,#fad0c4)', 'color:#fff',
            'padding:30px 50px', 'border-radius:30px', 'z-index:99999',
            'text-align:center', 'box-shadow:0 10px 40px rgba(255,154,158,0.5)',
            'animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1)'
        ].join(';');
        popup.innerHTML =
            '<div style="font-size:3.5rem;margin-bottom:10px">🎁</div>' +
            '<div style="font-size:1.8rem;font-weight:bold;margin-bottom:8px">Bônus Diário!</div>' +
            '<div style="font-size:1.3rem;margin-bottom:5px">Você voltou ' + info.streak + ' dia' + (info.streak > 1 ? 's' : '') + ' seguidos!</div>' +
            '<div style="font-size:2rem;font-weight:bold">+' + info.bonus + ' ⭐</div>';
        document.body.appendChild(popup);

        if (typeof YoyoMascot !== 'undefined') {
            YoyoMascot.say('Que bom que você voltou! Ganhou ' + info.bonus + ' estrelas de bônus!');
        }

        setTimeout(function () {
            popup.style.transition = 'opacity 0.5s, transform 0.5s';
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%,-50%) scale(0.5)';
            setTimeout(function () { popup.remove(); }, 500);
        }, 4000);
    }

    /* ===== INIT ===== */
    var badgeStyle = document.createElement('style');
    badgeStyle.textContent = '@keyframes badgePop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}';
    document.head.appendChild(badgeStyle);

    function init() {
        var isMenu = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

        if (isMenu) {
            createBadgesPanel();
            var bonus = checkDailyBonus();
            if (bonus) {
                setTimeout(function () { showDailyBonusPopup(bonus); }, 1500);
            }
        }

        var gameMatch = window.location.pathname.match(/\/([a-z-]+)\.html/i);
        if (gameMatch && gameMatch[1] !== 'index') {
            trackGamePlayed(gameMatch[1]);
        }

        var stars = typeof carregarEstrelas === 'function' ? carregarEstrelas() : 0;
        trackStars(stars);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ===== GLOBAL API ===== */
    window.YoyoAchievements = {
        trackGamePlayed: trackGamePlayed,
        trackStars: trackStars,
        trackStreak: trackStreak,
        trackPerfectGame: trackPerfectGame,
        checkDailyBonus: checkDailyBonus,
        getStats: loadStats,
        getBadges: function () { return BADGES; },
        getEarnedBadges: loadEarnedBadges,
        getCollectibles: function () { return COLLECTIBLES; },
        getEarnedCollectibles: function () { return getEarnedCollectibles(loadStats().totalStars); }
    };
})();
