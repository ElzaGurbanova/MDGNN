import {
    saveToLocalStorage,
    getFromLocalStorage,
    STORAGE_KEYS
} from './storage.js';
const PieceManager = function PieceManager() {
    const v12 = STORAGE_KEYS.PIECE_SET;
    const v13 = getFromLocalStorage(v12, 'horsey');
    this.selectedSet = v13;
};
const getSelectedSet = function getSelectedSet() {
    const v14 = this.selectedSet;
    return v14;
};
PieceManager.getSelectedSet = getSelectedSet;
const loadSet = async function loadSet(setName) {
    try {
        const v15 = /^[a-zA-Z0-9_-]+$/.test(setName);
        const v16 = !v15;
        if (v16) {
            const v17 = `Invalid piece set name: ${ setName }`;
            const v18 = console.error(v17);
            v18;
            return null;
        }
        const pieceCodes = [
            'wK',
            'wQ',
            'wR',
            'wB',
            'wN',
            'wP',
            'bK',
            'bQ',
            'bR',
            'bB',
            'bN',
            'bP'
        ];
        const pieces = {};
        let code;
        for (code of pieceCodes) {
            pieces[code] = `/pieces/${ setName }/${ code }.svg`;
        }
        this.selectedSet = setName;
        const v19 = STORAGE_KEYS.PIECE_SET;
        const v20 = saveToLocalStorage(v19, setName);
        v20;
        return pieces;
    } catch (error) {
        const v21 = `Failed to load piece set "${ setName }":`;
        const v22 = console.error(v21, error);
        v22;
        return null;
    }
};
PieceManager.loadSet = loadSet;
PieceManager['is_class'] = true;
export default PieceManager;