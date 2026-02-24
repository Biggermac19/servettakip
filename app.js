// 1440x900 sahneyi ekranın ortasında "oran bozmadan" scale eden motor
const STAGE_W = 1440;
const STAGE_H = 900;

const stage = document.getElementById("stage");

function fitStage(){
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Oranı koru
  const scale = Math.min(vw / STAGE_W, vh / STAGE_H);

  // Pixel snap: bulanıklığı azaltır
  const snapped = Math.floor(scale * 1000) / 1000;

  stage.style.transform = `scale(${snapped})`;
}
window.addEventListener("resize", fitStage);
fitStage();

// Panel
const panel = document.getElementById("panel");
const btnChartChange = document.getElementById("btnChartChange");
const btnChartSettings = document.getElementById("btnChartSettings");
const btnAddAsset = document.getElementById("btnAddAsset");

const btnClose = document.getElementById("btnClose");
const btnApply = document.getElementById("btnApply");

function openPanel(){ panel.classList.add("open"); }
function closePanel(){ panel.classList.remove("open"); }

btnChartChange.addEventListener("click", openPanel);
btnChartSettings.addEventListener("click", openPanel);
btnAddAsset.addEventListener("click", openPanel);
btnClose.addEventListener("click", closePanel);

// Format helpers (TR)
function fmtTL(x){
  if (!isFinite(x)) return "0₺";
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 0 })
    .format(x) + "₺";
}
function fmtPct(x){
  if (!isFinite(x)) return "%0";
  return "%" + Math.round(x);
}

const inGayri = document.getElementById("inGayri");
const inBorsa = document.getElementById("inBorsa");
const inAltin = document.getElementById("inAltin");
const inActive = document.getElementById("inActive");
const inPassive = document.getElementById("inPassive");

const pctBorsa = document.getElementById("pctBorsa");
const pctAltin = document.getElementById("pctAltin");
const pctGayri = document.getElementById("pctGayri");

const totalWealth = document.getElementById("totalWealth");
const activeWealth = document.getElementById("activeWealth");
const passiveWealth = document.getElementById("passiveWealth");

function valOf(inp){
  const v = parseFloat(String(inp.value || "").replace(",", "."));
  return isFinite(v) ? v : 0;
}

function apply(){
  const gayri = valOf(inGayri);
  const borsa = valOf(inBorsa);
  const altin = valOf(inAltin);

  const total = gayri + borsa + altin;

  // yüzdeler
  const pB = total > 0 ? (borsa / total) * 100 : 0;
  const pA = total > 0 ? (altin / total) * 100 : 0;
  const pG = total > 0 ? (gayri / total) * 100 : 0;

  pctBorsa.textContent = fmtPct(pB);
  pctAltin.textContent = fmtPct(pA);
  pctGayri.textContent = fmtPct(pG);

  // servis satırları
  totalWealth.textContent = `Servetim: ${fmtTL(total)}`;

  const act = valOf(inActive);
  const pas = valOf(inPassive);

  if (act > 0 || pas > 0){
    activeWealth.textContent = `Aktif Servetim: ${fmtTL(act)}`;
    passiveWealth.textContent = `Pasif Servetim: ${fmtTL(pas)}`;
  } else {
    // Basit MVP: gayrimenkul pasif, borsa+altın aktif gibi varsayım
    const active = borsa + altin;
    const passive = gayri;
    activeWealth.textContent = `Aktif Servetim: ${fmtTL(active)}`;
    passiveWealth.textContent = `Pasif Servetim: ${fmtTL(passive)}`;
  }

  closePanel();
}

btnApply.addEventListener("click", apply);

// Panel dışına tıklayınca kapat
panel.addEventListener("click", (e) => {
  if (e.target === panel) closePanel();
});
