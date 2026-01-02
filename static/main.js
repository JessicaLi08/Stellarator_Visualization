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

const presets = {
  // input.W7-X_without_coil_ripple_beta0p05_d23p4_tm
  w7x: `NFP = 5, rbc(-2,  1)=  -1.7050E-03,  zbs(-2,  1)=  -1.7050E-03,
 rbc(-1,  1)=  -1.2100E-02,  zbs(-1,  1)=  -1.2100E-02,
 rbc(-1,  2)=   1.3750E-03,  zbs(-1,  2)=   1.3750E-03,
 rbc( 0,  0)=   5.5000E+00,  zbs( 0,  0)=   0.0000E+00,
 rbc( 0,  1)=   4.7685E-01,  zbs( 0,  1)=   6.2315E-01,
 rbc( 0,  2)=   6.1600E-02,  zbs( 0,  2)=   6.4350E-02,
 rbc( 0,  3)=   2.0350E-04,  zbs( 0,  3)=   2.0350E-04,
 rbc( 1,  0)=   2.3540E-01,  zbs( 1,  0)=  -1.1550E-01,
 rbc( 1,  1)=  -2.2330E-01,  zbs( 1,  1)=   2.2330E-01,
 rbc( 1,  2)=   1.0065E-01,  zbs( 1,  2)=   1.3200E-01,
 rbc( 1,  3)=   1.1165E-02,  zbs( 1,  3)=  -1.1165E-02,
 rbc( 2,  0)=   1.2650E-02,  zbs( 2,  0)=  -1.2650E-02,
 rbc( 2,  1)=  -3.1350E-02,  zbs( 2,  1)=   3.1350E-02,
 rbc( 2,  2)=   5.5000E-02,  zbs( 2,  2)=  -5.5000E-02,
 rbc( 2,  3)=   6.4350E-03,  zbs( 2,  3)=   6.4350E-03,
 rbc( 2,  4)=  -6.8750E-03,  zbs( 2,  4)=  -6.8750E-03,
 rbc( 3,  0)=   1.9800E-03,  zbs( 3,  0)=  -1.9800E-03,
 rbc( 3,  2)=  -1.8700E-03,  zbs( 3,  2)=   1.7600E-03,
 rbc( 3,  3)=  -6.7650E-03,  zbs( 3,  3)=   6.7650E-03,
 rbc( 3,  4)=  -2.7390E-03,  zbs( 3,  4)=   2.7390E-03,
 rbc( 4,  2)=  -1.7600E-03,  zbs( 4,  2)=   1.7600E-03,
 rbc( 4,  3)=   1.2650E-03,  zbs( 4,  3)=  -1.2650E-03,`,
  // input.LandremanPaul2021_QA_reactorscale_lowres
  qa_reactorscale: `NFP = 2,
rbc(0,0) = 1.012658382028E+001, zbs(0,0) = 0.000000000000E+000,
rbc(1,0) = 1.656442246637E+000, zbs(1,0) = -1.269527884010E+000,
rbc(2,0) = 1.168065396338E-001, zbs(2,0) = -1.157570635450E-001,
rbc(3,0) = 1.681848906918E-003, zbs(3,0) = -1.859955209758E-003,
rbc(4,0) = -4.344142209654E-004, zbs(4,0) = 6.460740786144E-004,
rbc(5,0) = -7.178092442796E-005, zbs(5,0) = 6.506076688604E-005,
rbc(-5,1) = -1.250523900045E-005, zbs(-5,1) = 1.671593720258E-005,
rbc(-4,1) = 5.960412998346E-004, zbs(-4,1) = 7.845776908340E-004,
rbc(-3,1) = 1.192612929656E-002, zbs(-3,1) = 8.879234742430E-003,
rbc(-2,1) = 6.194886954255E-002, zbs(-2,1) = 7.005027786691E-002,
rbc(-1,1) = 3.742783485244E-001, zbs(-1,1) = 3.400206123943E-001,
rbc(0,1)  = 1.679774143201E+000, zbs(0,1)  = 2.181203441748E+000,
rbc(1,1)  = -1.102571811326E+000, zbs(1,1)  = 8.105522673578E-001,
rbc(2,1)  = -2.155805264092E-001, zbs(2,1)  = 1.966385492229E-001,
rbc(3,1)  = -2.329273845974E-002, zbs(3,1)  = 2.069175208826E-002,
rbc(4,1)  = -2.661237318218E-004, zbs(4,1)  = 9.636272685192E-004,
rbc(5,1)  = -3.670631879823E-005, zbs(5,1)  = 2.265932688630E-005,
rbc(-5,2) = 3.473389706292E-006, zbs(-5,2) = 3.699307142425E-005,
rbc(-4,2) = 4.912086813127E-004, zbs(-4,2) = 2.613952319580E-004,
rbc(-3,2) = -1.650091111779E-004, zbs(-3,2) = 9.372934311218E-004,
rbc(-2,2) = 6.572506820813E-003, zbs(-2,2) = 4.002721688287E-003,
rbc(-1,2) = 3.489234562081E-004, zbs(-1,2) = -1.348294789692E-002,
rbc(0,2)  = 1.602596115905E-001, zbs(0,2)  = 1.581142854112E-001,
rbc(1,2)  = 2.579026786227E-001, zbs(1,2)  = 8.515829474462E-004,
rbc(2,2)  = 3.635432233409E-002, zbs(2,2)  = -7.253576144831E-002,
rbc(3,2)  = 2.048904025366E-002, zbs(3,2)  = -1.644076893936E-002,
rbc(4,2)  = 1.351013065632E-003, zbs(4,2)  = -2.171973960015E-003,
rbc(5,2)  = 7.590720843726E-005, zbs(5,2)  = -3.080501850148E-005,
rbc(-5,3) = 2.628832174986E-005, zbs(-5,3) = 7.641923854311E-006,
rbc(-4,3) = -2.787430121400E-004, zbs(-4,3) = -1.310287213145E-004,
rbc(-3,3) = -6.968320714789E-004, zbs(-3,3) = -1.161154377680E-003,
rbc(-2,3) = 1.874492796226E-003, zbs(-2,3) = 2.060514452732E-003,
rbc(-1,3) = -9.619402016515E-003, zbs(-1,3) = -1.209237167999E-002,
rbc(0,3)  = 6.875154340249E-003, zbs(0,3)  = 2.101177453522E-002,
rbc(1,3)  = 1.294437252868E-003, zbs(1,3)  = 1.472181704879E-002,
rbc(2,3)  = 1.232040919148E-003, zbs(2,3)  = 1.774116385019E-002,
rbc(3,3)  = -8.936328881911E-003, zbs(3,3) = 4.338128864939E-003,
rbc(0,4) = -3.191042298440E-003, zbs(0,4) = 9.438118148131E-004,
rbc(0,5) = 2.719607218643E-004, zbs(0,5) = 4.061345747065E-004`,
  // input.LandremanPaul2021_QH_reactorScale_lowres
  qh_reactorscale: `NFP = 4, rbc( 000,000) =    1.367375147766E+001    zbs( 000,000) =    0.000000000000E+000
  rbc( 001,000) =    2.458811088284E+000    zbs( 001,000) =    2.087809952337E+000
  rbc( 002,000) =    2.372329091047E-001    zbs( 002,000) =    2.551979044092E-001
  rbc( 003,000) =    3.523944757399E-002    zbs( 003,000) =    1.640455405466E-002
  rbc( 004,000) =   -2.239610058463E-003    zbs( 004,000) =    9.550219792542E-004
  rbc( 005,000) =   -3.316302012241E-004    zbs( 005,000) =   -3.484833707189E-004
  rbc(-005,001) =   -1.172891142384E-003    zbs(-005,001) =    2.796952906580E-004
  rbc(-004,001) =   -4.613589269547E-003    zbs(-004,001) =    6.900936651125E-003
  rbc(-003,001) =   -4.979105145863E-002    zbs(-003,001) =    5.172083717870E-002
  rbc(-002,001) =   -3.343003913181E-001    zbs(-002,001) =    3.319884811820E-001
  rbc(-001,001) =   -1.193959494238E+000    zbs(-001,001) =    6.176721078449E-001
  rbc( 000,001) =    1.887511629365E+000    zbs( 000,001) =    1.792585070922E+000
  rbc( 001,001) =    3.969748602910E-001    zbs( 001,001) =    4.471578733064E-001
  rbc( 002,001) =    9.401042030899E-002    zbs( 002,001) =    9.303041096194E-002
  rbc( 003,001) =    1.114488176302E-002    zbs( 003,001) =    1.175169476452E-002
  rbc( 004,001) =   -3.888445102044E-004    zbs( 004,001) =   -1.609774846436E-004
  rbc( 005,001) =    2.500873812304E-004    zbs( 005,001) =   -2.208606573753E-004
  rbc(-005,002) =    2.991444392846E-004    zbs(-005,002) =   -1.011921788627E-003
  rbc(-004,002) =    1.147708525686E-002    zbs(-004,002) =   -6.131141323267E-003
  rbc(-003,002) =    2.696174566065E-002    zbs(-003,002) =   -4.341286997869E-002
  rbc(-002,002) =    7.205801299407E-002    zbs(-002,002) =   -9.726361389574E-002
  rbc(-001,002) =    2.894642478614E-001    zbs(-001,002) =    2.550978449509E-001
  rbc( 000,002) =    2.100364675213E-001    zbs( 000,002) =    1.292325414648E-001
  rbc( 001,002) =   -1.609502453632E-002    zbs( 001,002) =   -6.008853156679E-003
  rbc( 002,002) =    1.778839808673E-002    zbs( 002,002) =    1.397982953330E-002
  rbc( 003,002) =    3.756695795525E-004    zbs( 003,002) =   -8.614906220464E-004
  rbc( 004,002) =    1.276351022476E-003    zbs( 004,002) =    8.959625788496E-004
  rbc( 005,002) =   -7.681122004966E-005    zbs( 005,002) =   -2.528069567306E-006
  rbc(-005,003) =    3.930144897455E-005    zbs(-005,003) =    1.075890317063E-003
  rbc(-004,003) =   -2.603315575112E-003    zbs(-004,003) =    5.035365770564E-004
  rbc(-003,003) =    3.036129934725E-004    zbs(-003,003) =    8.589410639810E-003
  rbc(-002,003) =   -1.480145412461E-002    zbs(-002,003) =    8.813872115569E-003
  rbc(-001,003) =    8.799578974345E-004    zbs(-001,003) =    1.560654534427E-002
  rbc( 000,003) =    1.462294459199E-003    zbs( 000,003) =    5.199929737940E-003
  rbc( 001,003) =    6.814970719862E-003    zbs( 001,003) =    9.358252016759E-003
  rbc( 002,003) =    4.546887392291E-003    zbs( 002,003) =    3.274915427664E-003
  rbc( 003,003) =   -1.145935652702E-003    zbs( 003,003) =   -3.908787494710E-005
  rbc( 004,003) =    1.116974368241E-003    zbs( 004,003) =    5.235215882911E-004
  rbc( 005,003) =   -1.603874518889E-004    zbs( 005,003) =   -3.510808935320E-006
  rbc(-005,004) =    2.639941928257E-004    zbs(-005,004) =    7.997384801817E-005
  rbc(-004,004) =    8.087263486072E-004    zbs(-004,004) =   -1.336953822527E-003
  rbc(-003,004) =   -2.099839582050E-003    zbs(-003,004) =   -2.691620048604E-003
  rbc(-002,004) =    1.265505108246E-003    zbs(-002,004) =   -1.715979913932E-003
  rbc(-001,004) =    3.032178576699E-003    zbs(-001,004) =    9.753931940415E-004
  rbc( 000,004) =    6.322332213688E-003    zbs( 000,004) =    4.561763184144E-003
  rbc( 001,004) =   -6.610823086742E-004    zbs( 001,004) =   -2.713711235770E-004
  rbc( 002,004) =    1.982117968414E-003    zbs( 002,004) =    4.711445679698E-004
  rbc( 003,004) =   -7.370713133332E-004    zbs( 003,004) =   -8.263510173517E-004
  rbc( 004,004) =   -3.767350282858E-004    zbs( 004,004) =   -4.422365940715E-004
  rbc( 005,004) =   -1.410486346676E-004    zbs( 005,004) =   -1.141331244167E-004
  rbc(-005,005) =   -1.125394635239E-004    zbs(-005,005) =   -6.785534181825E-006
  rbc(-004,005) =   -5.856768005525E-004    zbs(-004,005) =    3.493202560578E-004
  rbc(-003,005) =    9.806370018962E-005    zbs(-003,005) =    6.032755666345E-004
  rbc(-002,005) =    2.305942363495E-004    zbs(-002,005) =   -7.998114339313E-005
  rbc(-001,005) =   -4.247530107429E-005    zbs(-001,005) =    2.022420756102E-005
  rbc( 000,005) =   -4.248290092659E-004    zbs( 000,005) =   -6.229177562600E-004
  rbc( 001,005) =   -2.894739047193E-004    zbs( 001,005) =    6.774144048711E-005
  rbc( 002,005) =    1.920402595905E-005    zbs( 002,005) =    3.994646750689E-005
  rbc( 003,005) =   -2.038807166485E-004    zbs( 003,005) =   -1.828397894803E-004
  rbc( 004,005) =   -1.452176687737E-004    zbs( 004,005) =   -1.420015297700E-004
  rbc( 005,005) =   -4.178619587655E-005    zbs( 005,005) =   -3.596593433452E-005`
};

function parseVmec(text) {
  let nfp = 1;
  let rbcData = {};
  let zbsData = {};
  
  // parsing written by claude
  nfp = Number(text.match(/NFP\s*=\s*(\d+)/i)[1]);
  
  let rbcMatches = text.matchAll(/rbc\(\s*(-?\d+)\s*,\s*(\d+)\s*\)\s*=\s*([+-]?[\d.eE+-]+)/gi);
  for (let match of rbcMatches) {
    let n = match[1];
    let m = match[2];
    let val = Number(match[3]);
    rbcData[n + "," + m] = val;
  }
  
  let zbsMatches = text.matchAll(/zbs\(\s*(-?\d+)\s*,\s*(\d+)\s*\)\s*=\s*([+-]?[\d.eE+-]+)/gi);
  for (let match of zbsMatches) {
    let n = match[1];
    let m = match[2];
    let val = Number(match[3]);
    zbsData[n + "," + m] = val;
  }
  
  return { nfp: nfp, rbc: rbcData, zbs: zbsData };
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
    
    let td = document.createElement("td");
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "-10";
    slider.max = "2";
    slider.step = "0.01";
    slider.value = rbc[key];
    
    let output = document.createElement("output");
    output.textContent = rbc[key];
    
    slider.oninput = function() {
      rbc[key] = Number(slider.value);
      output.textContent = slider.value;
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
    
    let td = document.createElement("td");
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "-10";
    slider.max = "2";
    slider.step = "0.01";
    slider.value = zbs[key];
    
    let output = document.createElement("output");
    output.textContent = zbs[key];
    
    slider.oninput = function() {
      zbs[key] = Number(slider.value);
      output.textContent = slider.value;
    };
    
    td.appendChild(slider);
    td.appendChild(output);
    tr.appendChild(td);
    zbsTable.appendChild(tr);
  }
  
  zbsDiv.appendChild(zbsTable);
  container.appendChild(zbsDiv);
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.onclick = function() {
    let preset = btn.getAttribute('data-preset');
    let data = parseVmec(presets[preset]);
    rbc = data.rbc;
    zbs = data.zbs;
    document.getElementById("nfpInput").value = data.nfp;
    showTables();
  };
});

document.getElementById("parseVmecBtn").onclick = function() {
  let text = document.getElementById("vmecInput").value;
  let data = parseVmec(text);
  rbc = data.rbc;
  zbs = data.zbs;
  document.getElementById("nfpInput").value = data.nfp;
  showTables();
};

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
