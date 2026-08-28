const SPREADSHEET_ID='1dR217eo8zGw5jP0spT2MDrcZEW6MDiijPzdc8BFaXiA';
const SHEET_NAME=''; // Kosong = tab pertama.

const HEADERS=['Timestamp','ID Pendaftaran','Tahun','Nama Lengkap','Kelas','Jenis Kelamin','Nomor HP','Alasan Masuk Menjadi Anggota'];

function sheet_(){
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  return SHEET_NAME?ss.getSheetByName(SHEET_NAME):ss.getSheets()[0];
}

function setupSheet(){
  const s=sheet_();
  if(s.getLastRow()===0)s.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  else{
    const h=s.getRange(1,1,1,HEADERS.length).getValues()[0];
    if(h.every(x=>x===''))s.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  }
  s.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setFontColor('#fff').setBackground('#7f1027');
  s.setFrozenRows(1);
  s.getRange('G:G').setNumberFormat('@');
  [150,150,80,220,110,130,160,450].forEach((w,i)=>s.setColumnWidth(i+1,w));
  s.getRange('H:H').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  if(!s.getFilter())s.getRange(1,1,Math.max(s.getLastRow(),1),HEADERS.length).createFilter();
  return 'OK';
}

function id_(){
  const d=new Date(),tz=Session.getScriptTimeZone()||'Asia/Jakarta';
  return 'KRM-2026-'+Utilities.formatDate(d,tz,'yyyyMMdd-HHmmss')+'-'+Math.floor(100+Math.random()*900);
}

function doPost(e){
  try{
    const p=e.parameter||{};
    if(p.action!=='register')return out_({ok:false,message:'Action tidak dikenal.'});
    const nama=String(p.nama||'').trim(),kelas=String(p.kelas||'').trim(),
      gender=String(p.jenisKelamin||'').trim(),hp=String(p.nomorHP||'').trim(),
      alasan=String(p.alasan||'').trim(),tahun=String(p.tahun||'2026').trim();
    if(!nama||!kelas||!gender||!hp||!alasan)return out_({ok:false,message:'Data wajib belum lengkap.'});
    if(nama.length>100||alasan.length>500)return out_({ok:false,message:'Data terlalu panjang.'});
    const s=sheet_();
    if(s.getLastRow()===0)setupSheet();
    s.appendRow([new Date(),id_(),tahun,nama,kelas,gender,hp,alasan]);
    const r=s.getLastRow();s.getRange(r,7).setNumberFormat('@');s.getRange(r,8).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    return out_({ok:true,message:'Pendaftaran berhasil disimpan.'});
  }catch(err){return out_({ok:false,message:err.message})}
}

function doGet(e){
  const p=e.parameter||{}, callback=p.callback||'';
  const s=sheet_(), last=s.getLastRow();
  let data=[];
  if(last>=2){
    const values=s.getRange(2,1,last-1,8).getDisplayValues();
    data=values.map(r=>({timestamp:r[0],id:r[1],tahun:r[2],nama:r[3],kelas:r[4],jenisKelamin:r[5],nomorHP:r[6],alasan:r[7]}));
  }
  const payload=JSON.stringify({ok:true,data:data});
  if(callback && /^[A-Za-z_$][\w$]*$/.test(callback)){
    return ContentService.createTextOutput(callback+'('+payload+')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return out_({ok:true,app:'KURMA 2026 API',count:data.length});
}

function out_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
