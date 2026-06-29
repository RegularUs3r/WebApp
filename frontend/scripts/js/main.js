import { filterData } from './filter.js';
import { choices } from './choice.js';
import { saveSettings } from './setts.js';
import { addTarget, fetchData} from './requests.js'
import { showContent, runtimeFilter, addMore, killCron, fireCron, updateSetts } from './frontend-magic-tricks.js';

document.body.addEventListener('load', fetchData())
document.getElementById("recon").addEventListener('click', addTarget);
document.getElementById("add").addEventListener('click', addMore)
document.body.addEventListener('load', runtimeFilter())

window.runtimeFilter = runtimeFilter;
window.filterData = filterData;
window.killCron = killCron;
window.fireCron = fireCron;
window.updateSetts = updateSetts
