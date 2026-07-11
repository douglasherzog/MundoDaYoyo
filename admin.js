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

    document.addEventListener("keydown", (evento) => {
        if (evento.ctrlKey && evento.shiftKey && evento.key.toLowerCase() === "a") {
            evento.preventDefault();
            mostrarPainel();
        }
    });
})();
