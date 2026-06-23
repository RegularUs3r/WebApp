import { filterData } from './filter.js';
import { choices } from './choice.js';
import { saveSettings } from './setts.js';
import { addTarget, liveEnumeration, fetchData } from './requests.js'
import { showContent, runtimeFilter, addMore } from './frontend-magic-tricks.js';

document.body.addEventListener('load', fetchData())
document.getElementById("enum").addEventListener('click', liveEnumeration);
document.getElementById("recon").addEventListener('click', addTarget);
document.getElementById("add").addEventListener('click', addMore)
document.body.addEventListener('load', runtimeFilter())
window.runtimeFilter = runtimeFilter;
window.filterData = filterData;
