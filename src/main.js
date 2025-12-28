// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output
// https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event

const nInput = document.getElementById("nInput");
const mInput = document.getElementById("mInput");
const nfpInput = document.getElementById("nfpInput");
const generateBtn = document.getElementById("generateBtn");
const tablesContainer = document.getElementById("tablesContainer");


function createTable(name, data) {
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
      slider.step = "0.0001";
      slider.value = data[i][j];

      const output = document.createElement("output");
      output.textContent = Number(slider.value).toFixed(3);

      slider.addEventListener("input", function (event) {
        const value = Number(event.target.value);
        data[i][j] = value;
        output.textContent = value.toFixed(3);
      });

      td.appendChild(slider);
      td.appendChild(output);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  const title = document.createElement("h2");
  title.textContent = name;

  const container = document.createElement("div");
  container.appendChild(title);
  container.appendChild(table);

  return container;
}

generateBtn.addEventListener("click", function () {
  const n = Number(nInput.value);
  const m = Number(mInput.value);
  const nfp = Number(nfpInput.value);

  rbc = [];
  zbs = [];

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
