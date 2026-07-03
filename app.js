const dataset = window.PROVA_PAULISTA_DATA;
const subjects = dataset.metadata.componentes;

const schoolSelect = document.querySelector("#schoolSelect");
const modeInputs = [...document.querySelectorAll("input[name='mode']")];

const els = {
  summaryPill: document.querySelector("#summaryPill"),
  students: document.querySelector("#kpiStudents"),
  studentsDelta: document.querySelector("#kpiStudentsDelta"),
  participation: document.querySelector("#kpiParticipation"),
  participationDelta: document.querySelector("#kpiParticipationDelta"),
  score: document.querySelector("#kpiScore"),
  scoreDelta: document.querySelector("#kpiScoreDelta"),
  best: document.querySelector("#kpiBest"),
  bestDelta: document.querySelector("#kpiBestDelta"),
  chartTitle: document.querySelector("#chartTitle"),
  chartSubtitle: document.querySelector("#chartSubtitle"),
  chartLegend: document.querySelector("#chartLegend"),
  chart: document.querySelector("#subjectChart"),
  detailHead: document.querySelector("#detailHead"),
  detailBody: document.querySelector("#detailBody"),
  tableSubtitle: document.querySelector("#tableSubtitle"),
};

function percent(value) {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) return "-";
  return value.toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function points(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  const signed = value > 0 ? "+" : "";
  return `${signed}${(value * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} p.p.`;
}

function integer(value) {
  return value.toLocaleString("pt-BR");
}

function selectedMode() {
  return modeInputs.find((input) => input.checked).value;
}

function recordsForSchool(schoolName) {
  return dataset.resultados
    .filter((item) => item.escola === schoolName)
    .sort((a, b) => a.bimestre - b.bimestre);
}

// CORREÇÃO: Função de média atualizada para ignorar null, NaN, e zero (prova não realizada)
function average(records, getter) {
  const values = records.map(getter).filter((value) => 
    value !== null && 
    value !== undefined && 
    !Number.isNaN(value) && 
    value > 0 // Considera apenas valores reais positivos
  );
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function aggregateByBimester(bimester) {
  const records = dataset.resultados.filter((item) => item.bimestre === bimester);
  const totalAlunos = records.reduce((sum, item) => sum + item.totalAlunos, 0);
  const componentes = {};

  subjects.forEach((subject) => {
    componentes[subject] = average(records, (item) => item.componentes[subject]);
  });

  return {
    bimestre: bimester,
    escola: "Todas as escolas",
    codigo: "",
    totalAlunos,
    participacao: average(records, (item) => item.participacao),
    acertos: average(records, (item) => item.acertos),
    componentes,
  };
}

function currentRecords() {
  const selected = schoolSelect.value;
  if (selected === "__all__") {
    return [aggregateByBimester(1), aggregateByBimester(2)];
  }
  return recordsForSchool(selected);
}

function bestSubject(record) {
  if (!record || !record.componentes) return null;
  const ranked = subjects
    .map((subject) => ({ subject, value: record.componentes[subject] }))
    .filter((item) => item.value !== null && item.value > 0)
    .sort((a, b) => b.value - a.value);
  return ranked[0] || null;
}

function setDelta(el, value, suffix = "") {
  el.className = "";
  if (value === null || value === undefined || Number.isNaN(value)) {
    el.textContent = "-";
    return;
  }
  el.textContent = `${points(value)}${suffix}`;
  if (value > 0) el.classList.add("delta-up");
  if (value < 0) el.classList.add("delta-down");
}

function renderKpis(records, mode) {
  const first = records.find((item) => item.bimestre === 1);
  const second = records.find((item) => item.bimestre === 2);
  const active = mode === "1" ? first : second;

  if (!active) return; // Proteção se não houver dados

  if (mode !== "compare") {
    const best = bestSubject(active);
    els.students.textContent = integer(active.totalAlunos);
    els.participation.textContent = percent(active.participacao);
    els.score.textContent = percent(active.acertos);
    els.best.textContent = best ? best.subject : "-";
    els.studentsDelta.textContent = `${mode}º bimestre`;
    els.participationDelta.textContent = "";
    els.scoreDelta.textContent = "";
    els.bestDelta.textContent = best ? percent(best.value) : "";
    els.bestDelta.className = "";
    return;
  }

  const best = bestSubject(second);
  els.students.textContent = `${integer(first.totalAlunos)} → ${integer(second.totalAlunos)}`;
  els.participation.textContent = percent(second.participacao);
  els.score.textContent = percent(second.acertos);
  els.best.textContent = best ? best.subject : "-";

  const studentDiff = second.totalAlunos - first.totalAlunos;
  els.studentsDelta.className = studentDiff >= 0 ? "delta-up" : "delta-down";
  els.studentsDelta.textContent = `${studentDiff >= 0 ? "+" : ""}${integer(studentDiff)} alunos`;
  
  // Tratamento de segurança para cálculos de delta
  const partDiff = (second.participacao && first.participacao) ? second.participacao - first.participacao : null;
  const acertosDiff = (second.acertos && first.acertos) ? second.acertos - first.acertos : null;
  
  setDelta(els.participationDelta, partDiff);
  setDelta(els.scoreDelta, acertosDiff);
  setDelta(
    els.bestDelta,
    (best && second.componentes[best.subject] && first.componentes[best.subject]) 
        ? second.componentes[best.subject] - first.componentes[best.subject] 
        : null,
    best ? ` em ${best.subject}` : ""
  );
}

function renderLegend(mode) {
  if (mode === "compare") {
    els.chartLegend.innerHTML =
      "<span><i style='background: var(--blue)'></i>1º bimestre</span><span><i style='background: var(--green)'></i>2º bimestre</span>";
    return;
  }
  els.chartLegend.innerHTML = "<span><i style='background: var(--amber)'></i>Bimestre selecionado</span>";
}

function renderChart(records, mode) {
  const first = records.find((item) => item.bimestre === 1);
  const second = records.find((item) => item.bimestre === 2);
  const active = mode === "1" ? first : second;

  els.chartTitle.textContent =
    mode === "compare" ? "Desempenho por componente" : `Desempenho por componente - ${mode}º bimestre`;
  els.chartSubtitle.textContent =
    mode === "compare"
      ? "Comparação entre o 1º e o 2º bimestres."
      : "Percentual de acertos por componente curricular.";

  renderLegend(mode);
  els.chart.innerHTML = "";

  subjects.forEach((subject) => {
    const val1 = first ? first.componentes[subject] : 0;
    const val2 = second ? second.componentes[subject] : 0;
    const valActive = active ? active.componentes[subject] : 0;

    const row = document.createElement("div");
    row.className = "chart-row";
    const label = document.createElement("div");
    label.className = "subject";
    label.textContent = subject;

    const bars = document.createElement("div");
    bars.className = "bars";

    if (mode === "compare") {
      [
        ["bim1", val1],
        ["bim2", val2],
      ].forEach(([className, value]) => {
        const track = document.createElement("div");
        track.className = "bar-track";
        const bar = document.createElement("div");
        bar.className = `bar ${className}`;
        bar.style.width = `${Math.max(0, value || 0) * 100}%`;
        track.appendChild(bar);
        bars.appendChild(track);
      });
    } else {
      const track = document.createElement("div");
      track.className = "bar-track";
      const bar = document.createElement("div");
      bar.className = "bar single";
      bar.style.width = `${Math.max(0, valActive || 0) * 100}%`;
      track.appendChild(bar);
      bars.appendChild(track);
    }

    const value = document.createElement("div");
    value.className = "value";
    value.textContent =
      mode === "compare"
        ? points( (val1 && val2) ? (val2 - val1) : null)
        : percent(valActive);

    row.append(label, bars, value);
    els.chart.appendChild(row);
  });
}

function renderTable(records, mode) {
  const first = records.find((item) => item.bimestre === 1);
  const second = records.find((item) => item.bimestre === 2);
  const active = mode === "1" ? first : second;

  if (mode === "compare") {
    els.tableSubtitle.textContent = "Variação positiva ou negativa entre o 1º e o 2º bimestres.";
    els.detailHead.innerHTML = "<tr><th>Componente</th><th>1º bimestre</th><th>2º bimestre</th><th>Variação</th></tr>";
    els.detailBody.innerHTML = subjects
      .map((subject) => {
        const val1 = first ? first.componentes[subject] : null;
        const val2 = second ? second.componentes[subject] : null;
        
        // Verifica se há valores válidos para calcular diferença
        const diff = (val1 !== null && val2 !== null) ? (val2 - val1) : null;
        const cls = diff !== null ? (diff > 0 ? "delta-up" : diff < 0 ? "delta-down" : "") : "";
        
        return `<tr><td>${subject}</td><td>${percent(val1)}</td><td>${percent(
          val2
        )}</td><td class="${cls}">${points(diff)}</td></tr>`;
      })
      .join("");
    return;
  }

  els.tableSubtitle.textContent = `Indicadores do ${mode}º bimestre.`;
  els.detailHead.innerHTML = "<tr><th>Componente</th><th>Acertos</th></tr>";
  els.detailBody.innerHTML = subjects
    .map((subject) => `<tr><td>${subject}</td><td>${percent(active ? active.componentes[subject] : null)}</td></tr>`)
    .join("");
}

function render() {
  const mode = selectedMode();
  const records = currentRecords();
  if(!records || records.length === 0) return;

  const selectedLabel =
    schoolSelect.value === "__all__"
      ? "Todas as escolas"
      : dataset.escolas.find((school) => school.nome === schoolSelect.value).label;

  els.summaryPill.textContent = selectedLabel;
  renderKpis(records, mode);
  renderChart(records, mode);
  renderTable(records, mode);
}

function init() {
  schoolSelect.innerHTML =
    "<option value='__all__'>Todas as escolas</option>" +
    dataset.escolas.map((school) => `<option value="${school.nome}">${school.label}</option>`).join("");

  schoolSelect.addEventListener("change", render);
  modeInputs.forEach((input) => input.addEventListener("change", render));
  render();
}

init();
