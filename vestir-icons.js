function shadeColor(hex, percent) {
    const num = parseInt(hex.replace('#',''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function iconHead(id) {
    const s = (i) => '<svg viewBox="0 0 44 44"><circle cx="22" cy="26" r="16" fill="#ffccbc" stroke="#e0a999" stroke-width="1.5"/>' + i + '</svg>';
    switch(id) {
        case 'bone': return s('<path d="M6 22 Q6 12 22 10 Q38 12 38 22 L38 24 L6 24 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="1.5"/><path d="M38 22 Q42 23 42 27 L38 27 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="1"/>');
        case 'boina': return s('<ellipse cx="22" cy="20" rx="18" ry="9" fill="#5c6bc0" stroke="#283593" stroke-width="1.5"/><circle cx="22" cy="16" r="3" fill="#3f51b5"/>');
        case 'flores': return s('<circle cx="12" cy="20" r="5" fill="#f48fb1"/><circle cx="12" cy="20" r="2" fill="#fff176"/><circle cx="22" cy="16" r="5" fill="#ce93d8"/><circle cx="22" cy="16" r="2" fill="#fff176"/><circle cx="32" cy="20" r="5" fill="#81c784"/><circle cx="32" cy="20" r="2" fill="#fff176"/>');
        case 'coroa': return s('<path d="M8 22 L11 10 L16 17 L22 8 L28 17 L33 10 L36 22 Z" fill="#ffd700" stroke="#f57f17" stroke-width="1.5"/><rect x="8" y="20" width="28" height="4" rx="2" fill="#ffd700" stroke="#f57f17" stroke-width="1"/><circle cx="22" cy="14" r="2" fill="#e91e63"/>');
        case 'cowboy': return s('<ellipse cx="22" cy="22" rx="20" ry="5" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/><path d="M14 22 Q14 10 22 8 Q30 10 30 22 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/>');
        case 'pirata': return s('<path d="M6 22 Q6 10 22 8 Q38 10 38 22 L38 24 L6 24 Z" fill="#212121" stroke="#000" stroke-width="1.5"/><circle cx="22" cy="16" r="5" fill="#fff"/>');
        case 'laco': return s('<path d="M12 20 Q6 16 8 12 Q14 10 16 16 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1"/><path d="M32 20 Q38 16 36 12 Q30 10 28 16 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1"/><circle cx="22" cy="18" r="4" fill="#ec407a" stroke="#c2185b" stroke-width="1"/>');
        case 'gorro': return s('<path d="M8 24 Q8 8 22 6 Q36 8 36 24 Z" fill="#e53935" stroke="#c62828" stroke-width="1.5"/><circle cx="22" cy="8" r="3" fill="#fff"/><rect x="6" y="22" width="32" height="4" rx="2" fill="#fff" opacity="0.8"/>');
        case 'orelhas': return s('<path d="M10 22 L6 8 L14 14 Z" fill="#ffccbc" stroke="#e0a999" stroke-width="1"/><path d="M34 22 L38 8 L30 14 Z" fill="#ffccbc" stroke="#e0a999" stroke-width="1"/><path d="M11 18 L9 12 L13 15 Z" fill="#f48fb1"/><path d="M33 18 L35 12 L31 15 Z" fill="#f48fb1"/>');
        case 'nenhum': return s('<circle cx="22" cy="22" r="12" fill="none" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="3,3"/><line x1="16" y1="16" x2="28" y2="28" stroke="#e0e0e0" stroke-width="2"/>');
        default: return s('');
    }
}

function iconTrunk(id) {
    const s = (i) => '<svg viewBox="0 0 44 44">' + i + '</svg>';
    const shirt = (c, d) => '<path d="M12 8 Q10 6 14 6 L30 6 Q34 6 32 8 L34 36 L10 36 Z" fill="' + c + '" stroke="' + d + '" stroke-width="1.5"/>';
    switch(id) {
        case 'rosa': return s(shirt('#f48fb1','#e91e63')+'<circle cx="22" cy="20" r="2" fill="#fff" opacity="0.5"/>');
        case 'verde': return s(shirt('#66bb6a','#2e7d32')+'<circle cx="22" cy="20" r="2" fill="#fff" opacity="0.5"/>');
        case 'azul': return s(shirt('#42a5f5','#1565c0')+'<circle cx="22" cy="20" r="2" fill="#fff" opacity="0.5"/>');
        case 'amarela': return s(shirt('#ffeb3b','#f9a825')+'<circle cx="22" cy="20" r="2" fill="#fff" opacity="0.5"/>');
        case 'roxo': return s(shirt('#ab47bc','#6a1b9a')+'<circle cx="22" cy="20" r="2" fill="#fff" opacity="0.5"/>');
        case 'vestido': return s('<path d="M14 6 L30 6 L32 16 L36 38 L8 38 L12 16 Z" fill="#ef5350" stroke="#c62828" stroke-width="1.5"/><path d="M14 6 L22 14 L30 6" fill="none" stroke="#c62828" stroke-width="1"/>');
        case 'casaco': return s('<path d="M10 8 Q8 6 14 4 L30 4 Q36 6 34 8 L38 38 L6 38 Z" fill="#5c6bc0" stroke="#283593" stroke-width="1.5"/><line x1="22" y1="6" x2="22" y2="36" stroke="#283593" stroke-width="1.5"/><circle cx="22" cy="16" r="1.5" fill="#283593"/><circle cx="22" cy="24" r="1.5" fill="#283593"/>');
        case 'moletom': return s(shirt('#78909c','#37474f')+'<path d="M10 30 L34 30 L36 36 L8 36 Z" fill="#90a4ae" stroke="#37474f" stroke-width="1"/><path d="M14 6 L22 14 L30 6" fill="none" stroke="#37474f" stroke-width="1"/>');
        case 'jaqueta': return s('<path d="M10 8 Q8 6 14 4 L30 4 Q36 6 34 8 L38 38 L6 38 Z" fill="#37474f" stroke="#263238" stroke-width="1.5"/><path d="M14 4 L22 12 L30 4" fill="none" stroke="#90a4ae" stroke-width="1.5"/><rect x="18" y="16" width="8" height="3" rx="1" fill="#ffd700"/>');
        case 'regata': return s('<path d="M16 6 L18 4 L26 4 L28 6 L34 36 L10 36 Z" fill="#26c6da" stroke="#00838f" stroke-width="1.5"/><path d="M16 6 L22 12 L28 6" fill="none" stroke="#00838f" stroke-width="1"/>');
        default: return s('<rect x="10" y="6" width="24" height="30" rx="4" fill="#ccc"/>');
    }
}

function iconLegs(id) {
    const s = (i) => '<svg viewBox="0 0 44 44">' + i + '</svg>';
    const pants = (c, d) => '<path d="M14 4 L30 4 L32 20 L28 40 L24 40 L22 20 L20 40 L16 40 L12 20 Z" fill="' + c + '" stroke="' + d + '" stroke-width="1.5"/>';
    switch(id) {
        case 'jeans': return s(pants('#5c6bc0','#283593')+'<line x1="22" y1="4" x2="22" y2="20" stroke="#283593" stroke-width="1" opacity="0.5"/>');
        case 'preto': return s(pants('#424242','#212121'));
        case 'bege': return s(pants('#a1887f','#5d4037'));
        case 'verde': return s(pants('#66bb6a','#2e7d32'));
        case 'vermelha': return s(pants('#ef5350','#c62828'));
        case 'short': return s('<path d="M14 4 L30 4 L32 18 L28 24 L24 24 L22 18 L20 24 L16 24 L12 18 Z" fill="#ff7043" stroke="#e64a19" stroke-width="1.5"/>');
        case 'calca_grossa': return s('<path d="M12 4 L32 4 L34 20 L30 40 L26 40 L24 20 L20 40 L16 40 L14 20 Z" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/><rect x="12" y="6" width="20" height="3" fill="#5d4037"/>');
        case 'legging': return s('<path d="M16 4 L28 4 L29 20 L27 40 L24 40 L22 20 L20 40 L17 40 L15 20 Z" fill="#26a69a" stroke="#00695c" stroke-width="1.5"/>');
        case 'saia_longa': return s('<path d="M16 4 L28 4 L36 40 L8 40 Z" fill="#ec407a" stroke="#c2185b" stroke-width="1.5"/><path d="M16 4 L22 12 L28 4" fill="none" stroke="#c2185b" stroke-width="1"/>');
        case 'bermuda': return s('<path d="M14 4 L30 4 L32 16 L28 28 L24 28 L22 16 L20 28 L16 28 L12 16 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/>');
        default: return s('<rect x="14" y="4" width="16" height="36" rx="3" fill="#ccc"/>');
    }
}

function iconFeet(id) {
    const s = (i) => '<svg viewBox="0 0 44 44">' + i + '</svg>';
    switch(id) {
        case 'sapatilha': return s('<path d="M6 28 Q6 18 22 16 Q38 18 38 28 L38 32 Q38 36 34 36 L10 36 Q6 36 6 32 Z" fill="#f48fb1" stroke="#e91e63" stroke-width="1.5"/><circle cx="22" cy="22" r="2" fill="#fff" opacity="0.5"/>');
        case 'tenis_branco': return s('<path d="M6 30 Q6 20 22 18 Q38 20 38 30 L38 34 L6 34 Z" fill="#f5f5f5" stroke="#9e9e9e" stroke-width="1.5"/><path d="M6 30 L38 30" stroke="#bdbdbd" stroke-width="1"/><path d="M14 22 L14 28 M22 20 L22 28 M30 22 L30 28" stroke="#e0e0e0" stroke-width="1.5"/>');
        case 'bota_marrom': return s('<path d="M8 16 L30 16 L32 30 L38 34 L38 38 L8 38 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/><path d="M8 20 L30 20" stroke="#5d4037" stroke-width="1"/>');
        case 'sandalia': return s('<path d="M8 30 Q8 20 22 18 Q36 20 36 30 L36 34 L8 34 Z" fill="#ab47bc" stroke="#6a1b9a" stroke-width="1.5"/><path d="M14 18 L14 30 M22 16 L22 30 M30 18 L30 30" stroke="#6a1b9a" stroke-width="1.5"/>');
        case 'salto': return s('<path d="M8 24 Q8 16 22 14 Q36 16 36 24 L36 28 L8 28 Z" fill="#e91e63" stroke="#880e4f" stroke-width="1.5"/><rect x="16" y="28" width="6" height="8" fill="#e91e63"/><rect x="26" y="28" width="6" height="8" fill="#e91e63"/>');
        case 'galocha': return s('<path d="M8 12 L30 12 L32 30 L38 34 L38 38 L8 38 Z" fill="#ff7043" stroke="#e64a19" stroke-width="1.5"/><path d="M8 16 L30 16" stroke="#e64a19" stroke-width="1"/>');
        case 'chinelo': return s('<path d="M8 30 Q8 22 22 20 Q36 22 36 30 L36 34 L8 34 Z" fill="#26c6da" stroke="#00838f" stroke-width="1.5"/><path d="M16 20 L14 14 M28 20 L30 14 M14 14 L30 14" stroke="#00838f" stroke-width="2" fill="none"/>');
        case 'tenis_fechado': return s('<path d="M6 28 Q6 18 22 16 Q38 18 38 28 L38 34 L6 34 Z" fill="#42a5f5" stroke="#1565c0" stroke-width="1.5"/><path d="M6 28 L38 28" stroke="#1565c0" stroke-width="1"/><path d="M14 20 L14 26 M22 18 L22 26 M30 20 L30 26" stroke="#1565c0" stroke-width="1.5"/>');
        case 'papete': return s('<path d="M8 26 Q8 18 22 16 Q36 18 36 26 L36 32 L8 32 Z" fill="#558b2f" stroke="#33691e" stroke-width="1.5"/><path d="M12 22 L32 22" stroke="#33691e" stroke-width="1"/>');
        case 'crocs': return s('<path d="M8 28 Q8 20 22 18 Q36 20 36 28 L36 34 L8 34 Z" fill="#ff7043" stroke="#e64a19" stroke-width="1.5"/><circle cx="14" cy="24" r="1.5" fill="#e64a19"/><circle cx="22" cy="22" r="1.5" fill="#e64a19"/><circle cx="30" cy="24" r="1.5" fill="#e64a19"/>');
        default: return s('<rect x="8" y="20" width="28" height="14" rx="4" fill="#ccc"/>');
    }
}

function iconAcc(id) {
    const s = (i) => '<svg viewBox="0 0 44 44">' + i + '</svg>';
    switch(id) {
        case 'relogio': return s('<circle cx="22" cy="24" r="10" fill="#333" stroke="#ffd700" stroke-width="2"/><circle cx="22" cy="24" r="6" fill="#fff"/><line x1="22" y1="24" x2="22" y2="18" stroke="#333" stroke-width="1.5"/><line x1="22" y1="24" x2="26" y2="24" stroke="#333" stroke-width="1.5"/><rect x="20" y="10" width="4" height="6" fill="#ffd700"/><rect x="20" y="32" width="4" height="6" fill="#ffd700"/>');
        case 'pulseira': return s('<ellipse cx="22" cy="22" rx="14" ry="6" fill="none" stroke="#ffd700" stroke-width="3"/><circle cx="22" cy="16" r="3" fill="#e91e63"/>');
        case 'cachecol': return s('<path d="M8 14 Q22 18 36 14 L36 22 Q22 26 8 22 Z" fill="#e53935" stroke="#c62828" stroke-width="1.5"/><path d="M30 20 L34 36 L26 34 Z" fill="#e53935" stroke="#c62828" stroke-width="1"/>');
        case 'luvas': return s('<rect x="8" y="14" width="12" height="18" rx="4" fill="#42a5f5" stroke="#1565c0" stroke-width="1.5"/><rect x="24" y="14" width="12" height="18" rx="4" fill="#42a5f5" stroke="#1565c0" stroke-width="1.5"/>');
        case 'touca': return s('<ellipse cx="22" cy="22" rx="16" ry="10" fill="#66bb6a" stroke="#2e7d32" stroke-width="1.5"/><circle cx="22" cy="16" r="4" fill="#fff"/>');
        case 'oculos': return s('<circle cx="15" cy="22" r="8" fill="rgba(33,33,33,0.3)" stroke="#333" stroke-width="2"/><circle cx="29" cy="22" r="8" fill="rgba(33,33,33,0.3)" stroke="#333" stroke-width="2"/><line x1="23" y1="22" x2="21" y2="22" stroke="#333" stroke-width="2"/>');
        case 'mochila': return s('<rect x="10" y="8" width="24" height="30" rx="6" fill="#66bb6a" stroke="#2e7d32" stroke-width="1.5"/><rect x="14" y="14" width="16" height="10" rx="3" fill="#fff" opacity="0.4"/>');
        case 'cinto': return s('<rect x="4" y="18" width="36" height="6" rx="2" fill="#5d4037" stroke="#3e2723" stroke-width="1"/><rect x="18" y="16" width="8" height="10" rx="2" fill="#ffd700" stroke="#f57f17" stroke-width="1"/>');
        case 'cola': return s('<circle cx="30" cy="14" r="5" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/><path d="M28 18 L26 36 L30 38 L34 36 L32 18" fill="#4caf50" stroke="#2e7d32" stroke-width="1"/>');
        case 'nada': return s('<circle cx="22" cy="22" r="12" fill="none" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="3,3"/><line x1="16" y1="16" x2="28" y2="28" stroke="#e0e0e0" stroke-width="2"/>');
        default: return s('');
    }
}

const TRONCO_COLORS = { rosa:'#f48fb1', verde:'#66bb6a', azul:'#42a5f5', amarela:'#ffeb3b', roxo:'#ab47bc', vestido:'#ef5350', casaco:'#5c6bc0', moletom:'#78909c', jaqueta:'#37474f', regata:'#26c6da' };
const PERNAS_COLORS = { jeans:'#5c6bc0', preto:'#424242', bege:'#a1887f', verde:'#66bb6a', vermelha:'#ef5350', short:'#ff7043', calca_grossa:'#6d4c41', legging:'#26a69a', saia_longa:'#ec407a', bermuda:'#8d6e63' };
const PES_COLORS = { sapatilha:'#f48fb1', tenis_branco:'#f5f5f5', bota_marrom:'#8d6e63', sandalia:'#ab47bc', salto:'#e91e63', galocha:'#ff7043', chinelo:'#26c6da', tenis_fechado:'#42a5f5', papete:'#558b2f', crocs:'#ff7043' };

function getTroncoColor(id) { return TRONCO_COLORS[id] || '#ccc'; }
function getPernasColor(id) { return PERNAS_COLORS[id] || '#ccc'; }
function getPesColor(id) { return PES_COLORS[id] || '#ccc'; }
