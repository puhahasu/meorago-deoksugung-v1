const key = new URLSearchParams(location.search).get('place');
let p = places.find(p=>p.key===key)||places[0];
document.title='머라고';
const selector=document.getElementById('placeSelect');
places.forEach(place=>{
 const option=document.createElement('option');option.value=place.key;option.textContent=place.name;selector.append(option);
});
function renderPlace(){
 selector.value=p.key;
 document.getElementById('sentence').textContent=p.summary;
 const detail=document.getElementById('detail');detail.replaceChildren();
 p.paragraphs.forEach(text=>{const paragraph=document.createElement('p');paragraph.textContent=text;detail.append(paragraph);});
 const notes=document.getElementById('footnotes');notes.replaceChildren();
 (p.footnotes||[]).forEach(note=>{
  const section=document.createElement('details');const title=document.createElement('summary');title.textContent=note.title;
  const body=document.createElement('p');body.textContent=note.body;section.append(title,body);notes.append(section);
 });
}
renderPlace();

const input=document.getElementById('cameraInput');
const review=document.getElementById('photoReview');
const image=document.getElementById('capturedPhoto');
const error=document.getElementById('photoError');
let photoUrl;
input.addEventListener('change',()=>{
  const file=input.files[0];
  if(!file)return;
  error.hidden=true;
  if(file.type && !file.type.startsWith('image/')){
    error.textContent='사진 파일을 선택해 주세요.';error.hidden=false;input.value='';return;
  }
  const previousUrl=photoUrl;
  photoUrl=URL.createObjectURL(file);
  image.onload=()=>{
    if(previousUrl)URL.revokeObjectURL(previousUrl);
    review.hidden=false;
    document.querySelector('.capture-prompt').hidden=true;
    document.querySelector('label.primary-button').hidden=true;
  };
  image.onerror=()=>{
    error.textContent='사진을 열지 못했어요. 다른 사진으로 다시 시도해 주세요.';
    error.hidden=false;
  };
  image.src=photoUrl;
  input.value='';
});
document.getElementById('explainButton').addEventListener('click',()=>{
  document.getElementById('captureStage').hidden=true;
  document.getElementById('explanation').hidden=false;
  document.getElementById('sentence').setAttribute('tabindex','-1');
  document.getElementById('sentence').focus();
  window.scrollTo(0,0);
});
window.addEventListener('pagehide',()=>{if(photoUrl)URL.revokeObjectURL(photoUrl);});

const expandTranslation=document.getElementById('expandTranslation');
const fullTranslation=document.getElementById('fullTranslation');
expandTranslation.addEventListener('click',()=>{
  const open=expandTranslation.getAttribute('aria-expanded')!=='true';
  fullTranslation.hidden=!open;
  expandTranslation.setAttribute('aria-expanded',String(open));
  expandTranslation.innerHTML=(open?'접기':'더 자세히 읽기')+' <span aria-hidden="true"></span>';
});
function startOver(){
  document.getElementById('explanation').hidden=true;
  document.getElementById('captureStage').hidden=false;
  review.hidden=true;
  error.hidden=true;
  document.querySelector('.capture-prompt').hidden=false;
  document.querySelector('label.primary-button').hidden=false;
  fullTranslation.hidden=true;
  expandTranslation.setAttribute('aria-expanded','false');
  expandTranslation.innerHTML='더 자세히 읽기 <span aria-hidden="true"></span>';
  image.removeAttribute('src');
  if(photoUrl){URL.revokeObjectURL(photoUrl);photoUrl=undefined;}
  input.value='';
  window.scrollTo(0,0);
}
document.getElementById('homeTitle').addEventListener('click',startOver);
document.getElementById('startOver').addEventListener('click',startOver);

selector.addEventListener('change',()=>{
 p=places.find(place=>place.key===selector.value)||places[0];
 renderPlace();
 const url=new URL(location.href);url.searchParams.set('place',p.key);history.replaceState(null,'',url);
 startOver();
});
