// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output
// https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const nInput = document.getElementById("nInput");
const mInput = document.getElementById("mInput");
const nfpInput = document.getElementById("nfpInput");
const generateBtn = document.getElementById("generateBtn");
const generateModelBtn = document.getElementById("generateModelBtn");
const tablesContainer = document.getElementById("tablesContainer");

let currentModel = null;

let rbc = [];
let zbs = [];

function createTable(name, data) {
  const container = document.createElement("div");

  const title = document.createElement("h2");
  title.textContent = name;
  container.appendChild(title);

  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));

  for (let j = 0; j < data[0].length; j++) {
    const th = document.createElement("th");
    th.textContent = j + 1;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement("tr");

    const rowLabel = document.createElement("th");
    rowLabel.textContent = i + 1;
    tr.appendChild(rowLabel);

    for (let j = 0; j < data[i].length; j++) {
      const td = document.createElement("td");
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "-10";
      slider.max = "2";
      slider.step = "0.001";
      slider.value = data[i][j];

      const output = document.createElement("output");
      output.textContent = Number(slider.value);

      slider.addEventListener("input", function (event) {
        const value = Number(event.target.value);
        data[i][j] = value;
        output.textContent = value;
      });

      td.appendChild(slider);
      td.appendChild(output);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  container.appendChild(table);
  return container;
}

generateBtn.addEventListener("click", function () {
  const n = Number(nInput.value);
  const m = Number(mInput.value);

  for (let i = 0; i < n; i++) {
    rbc[i] = [];
    zbs[i] = [];

    for (let j = 0; j < m; j++) {
      rbc[i][j] = 0;
      zbs[i][j] = 0;
    }
  }
  tablesContainer.innerHTML = "";
  tablesContainer.appendChild(createTable("RBC", rbc));
  tablesContainer.appendChild(createTable("ZBS", zbs));
});

// flask code done by chatgpt, i had no idea how to do this...
function generateModel() {
  console.log("Generate model clicked");

  fetch("/draw_stel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nfp: Number(nfpInput.value),
      rbc: rbc,
      zbs: zbs
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Flask error");
      }
      return response.json();
    })
    .then(() => {
      reloadModel();
    })
    .catch(err => {
      console.error("Model generation failed:", err);
    });
}

// https://threejs.org/docs/#Scene
// https://www.youtube.com/watch?v=aOQuuotM-Ww (this helped out a lot!!)
generateModelBtn.addEventListener("click", generateModel);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(600, 600);
document.body.appendChild(renderer.domElement);
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

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
