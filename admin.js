(function () {
    const ADMIN_URL = "http://127.0.0.1:8765";
    let painel = null;

    function criarPainel() {
        if (painel) return painel;

        painel = document.createElement("div");
        painel.id = "admin-panel";
        painel.innerHTML = `
            <div class="admin-content">
                <h2>Configurações do Adulto</h2>
                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="settings">⚙️ Config</button>
                    <button class="admin-tab" data-tab="progress">📊 Progresso</button>
                </div>
                <div class="admin-tab-content" id="admin-tab-settings">
                    <div class="admin-volume">
                        <label for="admin-volume-slider">Volume do sistema</label>
                        <input type="range" id="admin-volume-slider" min="0" max="100" value="70">
                        <span id="admin-volume-value">70%</span>
                    </div>
                    <div class="admin-buttons">
                        <button id="admin-terminal" class="admin-btn admin-terminal">🖥️ Terminal</button>
                        <button id="admin-reboot" class="admin-btn admin-reboot">🔄 Reiniciar</button>
                        <button id="admin-shutdown" class="admin-btn admin-shutdown">⏻ Desligar</button>
                        <button id="admin-close" class="admin-btn admin-close">Fechar</button>
                    </div>
                </div>
                <div class="admin-tab-content" id="admin-tab-progress" style="display:none">
                    <div id="admin-progress-content"></div>
                    <div class="admin-buttons">
                        <button id="admin-close2" class="admin-btn admin-close">Fechar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(painel);

        const slider = painel.querySelector("#admin-volume-slider");
        const valor = painel.querySelector("#admin-volume-value");

        slider.addEventListener("input", () => {
            valor.textContent = `${slider.value}%`;
        });

        slider.addEventListener("change", () => {
            ajustarVolume(parseInt(slider.value, 10));
        });

        painel.querySelector("#admin-terminal").addEventListener("click", () => {
            enviarComando("/terminal");
            esconderPainel();
        });

        painel.querySelector("#admin-shutdown").addEventListener("click", () => {
            if (confirm("Desligar o computador?")) {
                enviarComando("/shutdown");
            }
        });

        painel.querySelector("#admin-reboot").addEventListener("click", () => {
            if (confirm("Reiniciar o computador?")) {
                enviarComando("/reboot");
            }
        });

        painel.querySelector("#admin-close").addEventListener("click", esconderPainel);
        painel.querySelector("#admin-close2").addEventListener("click", esconderPainel);

        painel.querySelectorAll(".admin-tab").forEach(function (tab) {
            tab.addEventListener("click", function () {
                painel.querySelectorAll(".admin-tab").forEach(function (t) { t.classList.remove("active"); });
                tab.classList.add("active");
                var tabName = tab.dataset.tab;
                painel.querySelector("#admin-tab-settings").style.display = tabName === "settings" ? "" : "none";
                painel.querySelector("#admin-tab-progress").style.display = tabName === "progress" ? "" : "none";
                if (tabName === "progress") renderProgress();
            });
        });

        painel.addEventListener("click", (evento) => {
            if (evento.target === painel) esconderPainel();
        });

        return painel;
    }

    function mostrarPainel() {
        criarPainel();
        painel.classList.add("visible");
    }

    function esconderPainel() {
        if (painel) painel.classList.remove("visible");
    }

    function enviarComando(rota, corpo) {
        fetch(ADMIN_URL + rota, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: corpo ? JSON.stringify(corpo) : "{}"
        }).catch(() => {
            console.log("Servidor admin nao respondeu. Verifique se ele esta rodando.");
        });
    }

    function ajustarVolume(nivel) {
        enviarComando("/volume", { nivel });
    }

    function renderProgress() {
        var container = document.getElementById("admin-progress-content");
        if (!container) return;

        var stats = {};
        try { stats = JSON.parse(localStorage.getItem("yoyo_stats")) || {}; } catch (e) {}
        var earned = [];
        try { earned = JSON.parse(localStorage.getItem("yoyo_achievements")) || []; } catch (e) {}
        var stars = 0;
        try { stars = parseInt(localStorage.getItem("mundodayoyo_estrelas"), 10) || 0; } catch (e) {}

        var gamesPlayed = stats.gamesPlayed || {};
        var gameCount = Object.keys(gamesPlayed).length;
        var totalPlays = Object.values(gamesPlayed).reduce(function (a, b) { return a + b; }, 0);
        var maxStreak = stats.maxStreak || 0;
        var dailyStreak = stats.dailyStreak || 0;
        var perfectGames = stats.perfectGames || 0;

        var badgeCount = earned.length;

        var gameNames = {
            'silabas': 'Palavras', 'numeros': 'Números', 'contar': 'Contar Objetos',
            'alfabeto': 'Alfabeto', 'frases': 'Frases', 'memorias': 'Memória',
            'magical': 'Mundo Mágico', 'cores': 'Cores', 'formas': 'Formas',
            'animais': 'Animais', 'letra-inicial': 'Letra Inicial',
            'maiusculas': 'Maiúsculas/Minúsculas', 'rimas': 'Rimas',
            'palavras': 'Formar Palavras', 'sequencia': 'Sequência Lógica',
            'ordem': 'Ordem Alfabética', 'ditado': 'Ditado', 'antonimos': 'Opostos',
            'relogio': 'Horas', 'corpo': 'Meu Corpo', 'desenhar': 'Desenhar/Colorir',
            'frutas': 'Frutas e Vegetais', 'emocoes': 'Emoções', 'tamanhos': 'Grande/Pequeno',
            'bichinhos': 'Caça Bichinhos', 'mesmo-diferente': 'Mesmo/Diferente',
            'nao-encaixa': 'O que não encaixa', 'antes-depois': 'Antes e Depois',
            'unicornio': 'Meu Unicórnio', 'semana': 'A Semana da Yoyo',
            'meu-amigo-jesus': 'Meu Amigo Jesus', 'pescar': 'Pescaria',
            'vestir': 'Vestir Boneco', 'domino': 'Dominó', 'formar-numeros': 'Formar Números'
        };

        var html = '<div style="margin-bottom:20px">';
        html += '<div style="display:flex;gap:15px;flex-wrap:wrap;margin-bottom:15px">';
        html += '<div class="admin-stat-card"><div class="admin-stat-num">⭐ ' + stars + '</div><div class="admin-stat-label">Estrelas</div></div>';
        html += '<div class="admin-stat-card"><div class="admin-stat-num">🎮 ' + gameCount + '</div><div class="admin-stat-label">Jogos diferentes</div></div>';
        html += '<div class="admin-stat-card"><div class="admin-stat-num">🔥 ' + maxStreak + '</div><div class="admin-stat-label">Maior sequência</div></div>';
        html += '<div class="admin-stat-card"><div class="admin-stat-num">🏆 ' + badgeCount + '</div><div class="admin-stat-label">Conquistas</div></div>';
        html += '<div class="admin-stat-card"><div class="admin-stat-num">📅 ' + dailyStreak + '</div><div class="admin-stat-label">Dias seguidos</div></div>';
        html += '<div class="admin-stat-card"><div class="admin-stat-num">💯 ' + perfectGames + '</div><div class="admin-stat-label">Jogos perfeitos</div></div>';
        html += '</div>';

        if (gameCount > 0) {
            html += '<h3 style="color:#6c5ce7;margin-bottom:10px">Jogos mais jogados</h3>';
            var sorted = Object.keys(gamesPlayed).sort(function (a, b) { return gamesPlayed[b] - gamesPlayed[a]; });
            sorted.forEach(function (g) {
                var name = gameNames[g] || g;
                var plays = gamesPlayed[g];
                var barWidth = Math.min(plays / sorted.reduce(function (m, k) { return Math.max(m, gamesPlayed[k]); }, 1) * 100, 100);
                html += '<div style="margin-bottom:8px"><span style="font-size:0.9rem">' + name + '</span>';
                html += '<div style="background:#e0e0e0;border-radius:10px;height:18px;overflow:hidden;margin-top:3px">';
                html += '<div style="background:linear-gradient(90deg,#6c5ce7,#a29bfe);height:100%;width:' + barWidth + '%;border-radius:10px"></div></div>';
                html += '<span style="font-size:0.8rem;color:#999">' + plays + ' vez' + (plays > 1 ? 'es' : '') + '</span></div>';
            });
        } else {
            html += '<p style="color:#999;text-align:center">A Yoyo ainda não jogou nada. Deixe ela explorar! 🦄</p>';
        }

        html += '</div>';
        container.innerHTML = html;
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.ctrlKey && evento.shiftKey && evento.key.toLowerCase() === "a") {
            evento.preventDefault();
            mostrarPainel();
        }
    });
})();
