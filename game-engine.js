/* ====== GAME ENGINE — Shared lifecycle for all mini-games ====== */
/* Improves gameplay: adaptive difficulty, auto-hints, wrong answer
   elimination, auto-advance, progress bar, perfect game tracking. */
(function () {
    'use strict';

    function shuffle(arr) {
        var n = arr.slice();
        for (var i = n.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = n[i]; n[i] = n[j]; n[j] = t;
        }
        return n;
    }

    function create(config) {
        var state = {
            data: config.data,
            getData: config.getData || null,
            round: 0,
            totalRounds: config.totalRounds || 10,
            score: 0,
            streak: 0,
            maxStreak: 0,
            wrongCount: 0,
            perfectGame: true,
            current: null,
            locked: false,
            minOptions: config.minOptions || 2,
            maxOptions: config.maxOptions || 4,
            currentOptions: config.minOptions || 2,
            consecutiveCorrect: 0,
            consecutiveWrong: 0,
            id: config.id || 'game',
            onRound: config.onRound || null,
            onCorrect: config.onCorrect || null,
            onWrong: config.onWrong || null,
            onVictory: config.onVictory || null,
            getQuestion: config.getQuestion || null,
            matchFn: config.matchFn || function (a, b) { return a === b; },
            renderOption: config.renderOption || null,
            optionKey: config.optionKey || function (item) { return item; },
            speakQuestion: config.speakQuestion || null,
            speakCorrect: config.speakCorrect || null,
            speakWrong: config.speakWrong || null,
            containerSelector: config.containerSelector || '#options',
            feedbackSelector: config.feedbackSelector || '#feedback',
            progressSelector: config.progressSelector || null,
            displaySelector: config.displaySelector || null,
            autoAdvance: config.autoAdvance !== false,
            autoAdvanceDelay: config.autoAdvanceDelay || 1800
        };

        var container = document.querySelector(state.containerSelector);
        var feedback = document.querySelector(state.feedbackSelector);
        var progressBar = state.progressSelector ? document.querySelector(state.progressSelector) : null;
        var display = state.displaySelector ? document.querySelector(state.displaySelector) : null;

        function pickItem() {
            if (state.getData) return state.getData();
            return state.data[Math.floor(Math.random() * state.data.length)];
        }

        function generateOptions(correct) {
            var count = state.currentOptions;
            var pool = shuffle(state.data.filter(function (d) {
                return !state.matchFn(state.optionKey(d), state.optionKey(correct));
            }));
            var opts = [correct];
            for (var i = 0; i < pool.length && opts.length < count; i++) {
                opts.push(pool[i]);
            }
            return shuffle(opts);
        }

        function adaptDifficulty() {
            if (state.consecutiveCorrect >= 2 && state.currentOptions < state.maxOptions) {
                state.currentOptions++;
                state.consecutiveCorrect = 0;
            }
            if (state.consecutiveWrong >= 3 && state.currentOptions > state.minOptions) {
                state.currentOptions--;
                state.consecutiveWrong = 0;
            }
        }

        function updateProgress() {
            if (progressBar) {
                var pct = (state.round / state.totalRounds) * 100;
                progressBar.style.width = pct + '%';
                progressBar.textContent = state.round + ' / ' + state.totalRounds;
            }
        }

        function startRound() {
            state.round++;
            if (state.round > state.totalRounds) {
                victory();
                return;
            }
            state.wrongCount = 0;
            state.locked = false;
            state.current = pickItem();

            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }

            if (display) {
                display.classList.remove('celebration');
            }

            if (state.onRound) state.onRound(state.current);

            var options = generateOptions(state.current);
            if (container) container.innerHTML = '';

            options.forEach(function (opt) {
                var btn = document.createElement('button');
                btn.className = 'game-option';
                if (state.renderOption) {
                    state.renderOption(btn, opt);
                } else {
                    btn.textContent = state.optionKey(opt);
                }
                btn.dataset.value = state.optionKey(opt);
                btn.addEventListener('click', function () { handleAnswer(btn, opt); });
                if (container) container.appendChild(btn);
            });

            updateProgress();

            if (state.speakQuestion) {
                setTimeout(function () { state.speakQuestion(state.current); }, 300);
            }
        }

        function handleAnswer(btn, chosen) {
            if (state.locked) return;

            var isCorrect = state.matchFn(state.optionKey(chosen), state.optionKey(state.current));

            if (isCorrect) {
                state.locked = true;
                state.score += Math.max(10 - state.wrongCount * 2, 3);
                state.streak++;
                if (state.streak > state.maxStreak) state.maxStreak = state.streak;
                state.consecutiveCorrect++;
                state.consecutiveWrong = 0;

                btn.classList.add('correct');
                if (display) display.classList.add('celebration');

                if (feedback) {
                    feedback.textContent = '🎉 Muito bem!';
                    feedback.className = 'feedback success';
                }

                if (state.onCorrect) state.onCorrect(state.current, btn);
                if (state.speakCorrect) state.speakCorrect(state.current);

                if (typeof playSuccess === 'function') playSuccess();

                if (state.autoAdvance) {
                    setTimeout(function () { startRound(); }, state.autoAdvanceDelay);
                }
            } else {
                state.wrongCount++;
                state.streak = 0;
                state.consecutiveWrong++;
                state.consecutiveCorrect = 0;
                state.perfectGame = false;

                btn.classList.add('shake', 'disabled');
                btn.disabled = true;
                setTimeout(function () { btn.classList.remove('shake'); }, 500);

                if (feedback) {
                    feedback.textContent = 'Quase! Tenta de novo! 💪';
                    feedback.className = 'feedback error';
                }

                if (state.onWrong) state.onWrong(state.current, btn);
                if (state.speakWrong) state.speakWrong(state.current);

                if (typeof playError === 'function') playError();

                if (state.wrongCount === 2) {
                    showHint();
                }
                if (state.wrongCount >= 3) {
                    eliminateWrong();
                }
            }
        }

        function showHint() {
            if (!container) return;
            var correctKey = state.optionKey(state.current);
            var buttons = container.querySelectorAll('.game-option:not(.disabled)');
            buttons.forEach(function (b) {
                if (b.dataset.value === correctKey) {
                    b.classList.add('hint-pulse');
                }
            });
            if (typeof YoyoMascot !== 'undefined') {
                YoyoMascot.say('Olha a opção que está piscando! ✨');
            }
        }

        function eliminateWrong() {
            if (!container) return;
            var correctKey = state.optionKey(state.current);
            var wrongButtons = [];
            container.querySelectorAll('.game-option:not(.disabled)').forEach(function (b) {
                if (b.dataset.value !== correctKey) wrongButtons.push(b);
            });
            if (wrongButtons.length > 0) {
                var toRemove = wrongButtons[Math.floor(Math.random() * wrongButtons.length)];
                toRemove.style.transition = 'opacity 0.4s, transform 0.4s';
                toRemove.style.opacity = '0';
                toRemove.style.transform = 'scale(0)';
                setTimeout(function () { toRemove.style.display = 'none'; }, 400);
            }
        }

        function victory() {
            if (state.onVictory) state.onVictory(state);

            if (typeof YoyoAchievements !== 'undefined' && state.perfectGame) {
                YoyoAchievements.trackPerfectGame();
            }

            if (typeof YoyoMascot !== 'undefined') {
                YoyoMascot.celebrate();
            }

            if (container) container.innerHTML = '';
            if (feedback) {
                feedback.innerHTML = '<div style="font-size:2rem">🏆 Parabéns! Você completou o jogo!</div>';
                feedback.className = 'feedback success';
            }

            if (display) {
                display.innerHTML = '🎉';
                display.classList.add('celebration');
            }

            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.textContent = state.totalRounds + ' / ' + state.totalRounds + ' ✅';
            }

            if (typeof adicionarEstrelas === 'function') {
                adicionarEstrelas(3);
            }

            if (typeof falar === 'function') {
                falar('Parabéns! Você completou o jogo!');
            }

            var playAgain = document.createElement('button');
            playAgain.className = 'game-option play-again-btn';
            playAgain.textContent = '🔄 Brincar de novo!';
            playAgain.addEventListener('click', function () { reset(); });
            if (container) container.appendChild(playAgain);
        }

        function reset() {
            state.round = 0;
            state.score = 0;
            state.streak = 0;
            state.maxStreak = 0;
            state.perfectGame = true;
            state.currentOptions = state.minOptions;
            state.consecutiveCorrect = 0;
            state.consecutiveWrong = 0;
            if (typeof YoyoMascot !== 'undefined') YoyoMascot.resetStreak();
            startRound();
        }

        function next() {
            if (!state.autoAdvance) startRound();
        }

        return {
            start: startRound,
            next: next,
            reset: reset,
            state: state
        };
    }

    window.GameEngine = { create: create, shuffle: shuffle };
    window.embaralhar = shuffle;
})();
