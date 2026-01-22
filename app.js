const rowCountInput = document.getElementById('row_count');
const stitchCountInput = document.getElementById('stitch_count');
const settingStitchCountInput = document.getElementById('setting_stitch_count');
const settingStitchInput = document.getElementById('setting_stitch');
const doneButton = document.getElementById('done_button');
const resetButton = document.getElementById('reset_button');
const rowGroup = document.getElementById('row_group');
const stitchChangeIndicator = document.getElementById('stitch_change_indicator');
const memoField = document.getElementById('memo_field');

const STORAGE_KEY = 'knitting_counter_data';

function updateStitchIndicator() {
    const currentRow = parseInt(rowCountInput.value) || 0;
    const stitchChange = parseInt(settingStitchCountInput.value) || 0;
    const stitchInterval = parseInt(settingStitchInput.value) || 1;

    if (stitchInterval > 0 && currentRow > 0 && currentRow % stitchInterval === 0) {
        if (stitchChange > 0) {
            rowGroup.classList.remove('decrease');
            rowGroup.classList.add('increase');
            stitchChangeIndicator.textContent = `+${stitchChange}目`;
            stitchChangeIndicator.className = 'stitch-indicator';
            stitchChangeIndicator.style.display = 'flex';
        } else if (stitchChange < 0) {
            rowGroup.classList.remove('increase');
            rowGroup.classList.add('decrease');
            stitchChangeIndicator.textContent = `${stitchChange}目`;
            stitchChangeIndicator.className = 'stitch-indicator';
            stitchChangeIndicator.style.display = 'flex';
        } else {
            rowGroup.classList.remove('increase', 'decrease');
            stitchChangeIndicator.style.display = 'none';
        }
    } else {
        rowGroup.classList.remove('increase', 'decrease');
        stitchChangeIndicator.style.display = 'none';
    }
}

function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const data = JSON.parse(savedData);
        rowCountInput.value = data.rowCount || 0;
        stitchCountInput.value = data.stitchCount || 0;
        settingStitchCountInput.value = data.settingStitchCount || 0;
        settingStitchInput.value = data.settingStitch || 1;
        memoField.value = data.memo || '';
    }
    updateStitchIndicator();
}

function saveData() {
    const data = {
        rowCount: parseInt(rowCountInput.value) || 0,
        stitchCount: parseInt(stitchCountInput.value) || 0,
        settingStitchCount: parseInt(settingStitchCountInput.value) || 0,
        settingStitch: parseInt(settingStitchInput.value) || 1,
        memo: memoField.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateStitchIndicator();
}

function handleDone() {
    const currentRow = parseInt(rowCountInput.value) || 0;
    const currentStitch = parseInt(stitchCountInput.value) || 0;
    const stitchChange = parseInt(settingStitchCountInput.value) || 0;
    const stitchInterval = parseInt(settingStitchInput.value) || 1;

    const newRow = currentRow + 1;
    rowCountInput.value = newRow;

    if (stitchInterval > 0 && newRow % stitchInterval === 0) {
        const newStitch = Math.max(0, currentStitch + stitchChange);
        stitchCountInput.value = newStitch;
    }

    saveData();

    doneButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        doneButton.style.transform = 'scale(1)';
    }, 100);
}

function handleReset() {
    if (confirm('カウンターをリセットしますか？')) {
        rowCountInput.value = 0;
        stitchCountInput.value = 0;
        settingStitchCountInput.value = 0;
        settingStitchInput.value = 1;
        memoField.value = '';
        saveData();
    }
}

doneButton.addEventListener('click', handleDone);
resetButton.addEventListener('click', handleReset);

rowCountInput.addEventListener('input', saveData);
stitchCountInput.addEventListener('input', saveData);
settingStitchCountInput.addEventListener('input', saveData);
settingStitchInput.addEventListener('input', saveData);
memoField.addEventListener('input', saveData);

loadData();
