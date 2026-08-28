/*
  Isi URL hasil Deploy > Web app Google Apps Script di bawah.
*/
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwVfbKYhg1wvFZ97zz1HseM6A6y-NP8hi5XJulQknaErzC3RCrrx1Y8_Af68ijIOTukoQ/exec";

const form=document.querySelector("#registrationForm");
const msg=document.querySelector("#msg");
const btn=document.querySelector("#submitBtn");
const alasan=document.querySelector("#alasan");
const nomorHP=document.querySelector("#nomorHP");
const count=document.querySelector("#count");
const tbody=document.querySelector("#dataTable tbody");
const search=document.querySelector("#search");
const filterClass=document.querySelector("#filterClass");
const filterGender=document.querySelector("#filterGender");
let records=[];

alasan.addEventListener("input",()=>count.textContent=alasan.value.length);
nomorHP.addEventListener("input",()=>nomorHP.value=nomorHP.value.replace(/[^\d+\-\s]/g,""));

function notice(text,type){msg.textContent=text;msg.className="msg "+type}
function phoneOK(v){const d=v.replace(/\D/g,"");return d.length>=9&&d.length<=15}

form.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  if(!phoneOK(nomorHP.value)){notice("Nomor HP harus berisi 9–15 digit.","error");return}
  if(WEB_APP_URL==="PASTE_WEB_APP_URL_DI_SINI"){notice("WEB_APP_URL belum diisi. Lihat README.txt untuk konfigurasi Google Apps Script.","error");return}
  btn.disabled=true;btn.querySelector("span").textContent="Mengirim...";
  try{
    await fetch(WEB_APP_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams(new FormData(form)).toString()});
    form.reset();count.textContent="0";notice("Pendaftaran berhasil dikirim. Terima kasih sudah bergabung dengan KURMA 2026!","success");
    setTimeout(loadData,1200);
  }catch(err){console.error(err);notice("Pengiriman gagal. Periksa koneksi dan URL Apps Script.","error")}
  finally{btn.disabled=false;btn.querySelector("span").textContent="Kirim Pendaftaran"}
});

function jsonp(url){
  return new Promise((resolve,reject)=>{
    const cb="kurma_cb_"+Date.now()+"_"+Math.random().toString(36).slice(2);
    const script=document.createElement("script");
    const timer=setTimeout(()=>{cleanup();reject(new Error("Timeout"))},12000);
    function cleanup(){clearTimeout(timer);delete window[cb];script.remove()}
    window[cb]=data=>{cleanup();resolve(data)};
    script.onerror=()=>{cleanup();reject(new Error("JSONP error"))};
    script.src=url+(url.includes("?")?"&":"?")+"callback="+cb+"&action=list";
    document.body.appendChild(script);
  })
}

async function loadData(){
  if(WEB_APP_URL==="PASTE_WEB_APP_URL_DI_SINI"){
    tbody.innerHTML='<tr><td colspan="8" class="empty">Isi WEB_APP_URL untuk menampilkan data spreadsheet.</td></tr>';
    return;
  }
  tbody.innerHTML='<tr><td colspan="8" class="empty">Memuat data…</td></tr>';
  try{
    const result=await jsonp(WEB_APP_URL);
    if(!result.ok)throw new Error(result.message||"Gagal");
    records=Array.isArray(result.data)?result.data:[];
    render();
    document.querySelector("#updated").textContent=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
  }catch(err){
    console.error(err);
    tbody.innerHTML='<tr><td colspan="8" class="empty">Data belum dapat dimuat. Pastikan Web App dapat diakses dan fungsi GET aktif.</td></tr>';
  }
}

function render(){
  const q=search.value.trim().toLowerCase();
  const cls=filterClass.value, gender=filterGender.value;
  const filtered=records.filter(r=>{
    const hay=[r.nama,r.kelas,r.jenisKelamin,r.nomorHP,r.alasan,r.id].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(!cls||r.kelas===cls)&&(!gender||r.jenisKelamin===gender);
  });
  tbody.innerHTML="";
  if(!filtered.length)tbody.innerHTML='<tr><td colspan="8" class="empty">Tidak ada data yang sesuai.</td></tr>';
  filtered.forEach((r,i)=>{
    const tr=document.createElement("tr");
    [i+1,r.id,r.nama,r.kelas,r.jenisKelamin,r.nomorHP,r.alasan,r.timestamp].forEach(v=>{
      const td=document.createElement("td");td.textContent=v??"—";tr.appendChild(td)
    });
    tbody.appendChild(tr);
  });
  document.querySelector("#shown").textContent=`${filtered.length} dari ${records.length} data`;
  updateStats();
}

function updateStats(){
  document.querySelector("#total").textContent=records.length;
  document.querySelector("#male").textContent=records.filter(r=>r.jenisKelamin==="Laki-laki").length;
  document.querySelector("#female").textContent=records.filter(r=>r.jenisKelamin==="Perempuan").length;
  const counts={X:0,XI:0,XII:0};records.forEach(r=>{if(counts[r.kelas]!=null)counts[r.kelas]++});
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  document.querySelector("#topClass").textContent=records.length?top[0]:"—";
  document.querySelector("#topClassSub").textContent=records.length?`${top[1]} pendaftar`:"Belum ada data";
}

[search,filterClass,filterGender].forEach(x=>x.addEventListener("input",render));
document.querySelector("#refresh").addEventListener("click",loadData);

document.querySelector("#export").addEventListener("click",()=>{
  const q=search.value.trim().toLowerCase(),cls=filterClass.value,gender=filterGender.value;
  const rows=records.filter(r=>{
    const hay=[r.nama,r.kelas,r.jenisKelamin,r.nomorHP,r.alasan,r.id].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(!cls||r.kelas===cls)&&(!gender||r.jenisKelamin===gender);
  });
  const headers=["No","ID Pendaftaran","Nama Lengkap","Kelas","Jenis Kelamin","Nomor HP","Alasan Masuk Menjadi Anggota","Waktu"];
  const esc=s=>`"${String(s??"").replace(/"/g,'""')}"`;
  const csv="\ufeff"+[headers,...rows.map((r,i)=>[i+1,r.id,r.nama,r.kelas,r.jenisKelamin,r.nomorHP,r.alasan,r.timestamp])].map(row=>row.map(esc).join(";")).join("\r\n");
  const blob=new Blob([csv],{type:"application/vnd.ms-excel;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`KURMA_2026_Pendaftar_${new Date().toISOString().slice(0,10)}.xls`;a.click();URL.revokeObjectURL(a.href);
});

loadData();
