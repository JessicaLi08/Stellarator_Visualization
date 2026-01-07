// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output
// https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

let rbc = {};
let zbs = {};
let currentModel = null;

const presetFiles = {
  w7x: "/static/input.W7-X_without_coil_ripple_beta0p05_d23p4_tm",
  qa_reactorscale: "/static/input.LandremanPaul2021_QA_reactorscale_lowres",
  qh_reactorscale: "/static/input.LandremanPaul2021_QH_reactorScale_lowres"
};

function parseVmec(text) {
  let nfp = 1;
  let rbcData = {};
  let zbsData = {};
  
  // parsing written by claude
  nfp = Number(text.match(/NFP\s*=\s*(\d+)/i)[1]);
  
  let rbcMatches = text.matchAll(/rbc\(\s*(-?\d+)\s*,\s*(\d+)\s*\)\s*=\s*([+-]?[\d.eE+-]+)/gi);
  for (let match of rbcMatches) {
    let n = String(Number(match[1]));
    let m = String(Number(match[2]));
    let val = Number(match[3]);
    rbcData[n + "," + m] = val;
  }
  
  let zbsMatches = text.matchAll(/zbs\s*\(\s*(-?\d+)\s*,\s*(\d+)\s*\)\s*=\s*([+-]?[\d.eE+-]+)/gi);
  for (let match of zbsMatches) {
    let n = String(Number(match[1]));
    let m = String(Number(match[2]));
    let val = Number(match[3]);
    zbsData[n + "," + m] = val;
  }
  
  return { nfp: nfp, rbc: rbcData, zbs: zbsData };
}

let currentColormap = 'bwr';
let colormapData = {};

async function loadColormaps() {
  const response = await fetch('/get_colormaps');
  colormapData = await response.json();
}

function updateColorbarGradient() {
  const gradient = document.getElementById('colorbarGradient');
  const colors = colormapData[currentColormap];
  const stops = colors.map((color, i) => `rgb(${color[0]},${color[1]},${color[2]}) ${(i / (colors.length - 1) * 100).toFixed(1)}%`).join(', ');
  gradient.style.background = `linear-gradient(to right, ${stops})`;
}

function getColor(value) {
  if (value === 0) return "rgb(255,255,255)";
  
  let sign = (value > 0);
  let absValue = Math.abs(value);
  
  let logValue = Math.log10(absValue);
  let logMax = Math.log10(15); 
  let logMin = Math.log10(0.000001); 
  
  let normalized = (logValue - logMin) / (logMax - logMin);
  normalized = Math.max(0, Math.min(1, normalized));
  
  const colors = colormapData[currentColormap];
  const numColors = colors.length;
  
  const index = normalized * (numColors - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;
  
  const colorLower = colors[lower];
  const colorUpper = colors[upper];
  
  const r = Math.round(colorLower[0] + (colorUpper[0] - colorLower[0]) * fraction);
  const g = Math.round(colorLower[1] + (colorUpper[1] - colorLower[1]) * fraction);
  const b = Math.round(colorLower[2] + (colorUpper[2] - colorLower[2]) * fraction);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function showTables() {
  let container = document.getElementById("tablesContainer");
  container.innerHTML = "";
  
  let keys = Object.keys(rbc);
  
  let rbcDiv = document.createElement("div");
  rbcDiv.innerHTML = "<h3>RBC</h3>";
  let rbcTable = document.createElement("table");
  rbcTable.innerHTML = "<tr><th>n</th><th>m</th><th>value</th></tr>";
  
  for (let key of keys) {
    let parts = key.split(",");
    let n = parts[0];
    let m = parts[1];
    
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${n}</td><td>${m}</td>`;
    tr.style.backgroundColor = getColor(rbc[key]);
    
    let td = document.createElement("td");
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "-15";
    slider.max = "15";
    slider.step = "0.01";
    slider.value = rbc[key];
    
    let output = document.createElement("output");
    output.textContent = rbc[key];
    
    slider.oninput = function() {
      rbc[key] = Number(slider.value);
      output.textContent = slider.value;
      tr.style.backgroundColor = getColor(rbc[key]);
      show2DTables();
    };
    
    td.appendChild(slider);
    td.appendChild(output);
    tr.appendChild(td);
    rbcTable.appendChild(tr);
  }
  
  rbcDiv.appendChild(rbcTable);
  container.appendChild(rbcDiv);
  
  let zbsDiv = document.createElement("div");
  zbsDiv.innerHTML = "<h3>ZBS</h3>";
  let zbsTable = document.createElement("table");
  zbsTable.innerHTML = "<tr><th>n</th><th>m</th><th>value</th></tr>";
  
  for (let key of keys) {
    let parts = key.split(",");
    let n = parts[0];
    let m = parts[1];
    
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${n}</td><td>${m}</td>`;
    tr.style.backgroundColor = getColor(zbs[key]);
    
    let td = document.createElement("td");
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "-15";
    slider.max = "15";
    slider.step = "0.01";
    slider.value = zbs[key];
    
    let output = document.createElement("output");
    output.textContent = zbs[key];
    
    slider.oninput = function() {
      zbs[key] = Number(slider.value);
      output.textContent = slider.value;
      tr.style.backgroundColor = getColor(zbs[key]);
      show2DTables();
    };
    
    td.appendChild(slider);
    td.appendChild(output);
    tr.appendChild(td);
    zbsTable.appendChild(tr);
  }
  
  zbsDiv.appendChild(zbsTable);
  container.appendChild(zbsDiv);
  
  show2DTables();
}

function show2DTables() {
  let container = document.getElementById("tables2DContainer");
  container.innerHTML = "";
  
  let keys = Object.keys(rbc);
  
  let nValues = new Set();
  let mValues = new Set();
  
  for (let key of keys) {
    let parts = key.split(",");
    nValues.add(Number(parts[0]));
    mValues.add(Number(parts[1]));
  }
  
  let nArray = Array.from(nValues).sort((a, b) => a - b);
  let mArray = Array.from(mValues).sort((a, b) => a - b);
  
  let rbcDiv = document.createElement("div");
  rbcDiv.innerHTML = "<h3>RBC</h3>";
  let rbcTable = document.createElement("table");
  rbcTable.className = "table-2d";
  
  let headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>n\\m</th>";
  for (let m of mArray) {
    headerRow.innerHTML += `<th>${m}</th>`;
  }
  rbcTable.appendChild(headerRow);
  
  for (let n of nArray) {
    let tr = document.createElement("tr");
    tr.innerHTML = `<th>${n}</th>`;
    
    for (let m of mArray) {
      let key = n + "," + m;
      let td = document.createElement("td");
      
      if (rbc[key] !== undefined) {
        td.style.backgroundColor = getColor(rbc[key]);
        td.textContent = rbc[key].toFixed(6);
      } else {
        td.textContent = "-";
      }
      
      tr.appendChild(td);
    }
    
    rbcTable.appendChild(tr);
  }
  
  rbcDiv.appendChild(rbcTable);
  container.appendChild(rbcDiv);
  
  let zbsDiv = document.createElement("div");
  zbsDiv.innerHTML = "<h3>ZBS</h3>";
  let zbsTable = document.createElement("table");
  zbsTable.className = "table-2d";
  
  headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>n\\m</th>";
  for (let m of mArray) {
    headerRow.innerHTML += `<th>${m}</th>`;
  }
  zbsTable.appendChild(headerRow);
  
  for (let n of nArray) {
    let tr = document.createElement("tr");
    tr.innerHTML = `<th>${n}</th>`;
    
    for (let m of mArray) {
      let key = n + "," + m;
      let td = document.createElement("td");
      
      if (zbs[key] !== undefined) {
        td.style.backgroundColor = getColor(zbs[key]);
        td.textContent = zbs[key].toFixed(6);
      } else {
        td.textContent = "-";
      }
      
      tr.appendChild(td);
    }
    
    zbsTable.appendChild(tr);
  }
  
  zbsDiv.appendChild(zbsTable);
  container.appendChild(zbsDiv);
}

async function loadPreset(presetName) {
  const response = await fetch(presetFiles[presetName]);
  const text = await response.text();
  loadVmecText(text);
}

function loadVmecText(text) {
  let data = parseVmec(text);
  rbc = data.rbc;
  zbs = data.zbs;
  document.getElementById("nfpInput").value = data.nfp;
  showTables();
}

document.getElementById("colormapSelect").addEventListener("change", function(e) {
  currentColormap = e.target.value;
  updateColorbarGradient();
  showTables();
});

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.onclick = function() {
    let preset = btn.getAttribute('data-preset');
    loadPreset(preset);
  };
});

document.getElementById("vmecFileInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", function(event) {
    loadVmecText(event.target.result);
  });
  reader.readAsText(file);
});

const dropZone = document.getElementById("vmecDropZone");

dropZone.addEventListener("dragover", function(e) {
  e.preventDefault();
});

dropZone.addEventListener("dragleave", function(e) {
  e.preventDefault();
});

dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", function(event) {
    loadVmecText(event.target.result);
  });
  reader.readAsText(file);
});

dropZone.addEventListener("click", function() {
  document.getElementById("vmecFileInput").click();
});

document.getElementById("generateBtn").onclick = function() {
  let n = Number(document.getElementById("nInput").value);
  let m = Number(document.getElementById("mInput").value);

  rbc = {};
  zbs = {};
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      rbc[i + "," + j] = 0;
      zbs[i + "," + j] = 0;
    }
  }
  
  showTables();
};

// flask code done by chatgpt, i had no idea how to do this...
document.getElementById("generateModelBtn").onclick = function() {
  let nfp = Number(document.getElementById("nfpInput").value);
  
  fetch("/draw_stel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nfp: nfp, rbc: rbc, zbs: zbs })
  })
  .then(response => response.json())
  .then(() => {
    reloadModel();
  });
};

// https://threejs.org/docs/#Scene
// https://www.youtube.com/watch?v=aOQuuotM-Ww (this helped out a lot!!)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(600, 600);
document.getElementById('visualizationContainer').appendChild(renderer.domElement);
const light = new THREE.AmbientLight('white');
scene.add(light);
const loader = new GLTFLoader();
const controls = new OrbitControls(camera, renderer.domElement);

// chatgpt helped with the loader
function reloadModel() {
  scene.remove(currentModel);
  loader.load(
    "/static/stellarator.glb?t=" + Date.now(),
    function(gltf) {
      currentModel = gltf.scene;
      scene.add(currentModel);
      camera.position.set(0, 0, 30);
      camera.lookAt(0, 0, 0);
    }
  );
}

reloadModel();

loadColormaps().then(() => {
  updateColorbarGradient();
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
