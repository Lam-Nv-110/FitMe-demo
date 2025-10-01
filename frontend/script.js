/* ---------- Demo data: small inline SVG thumbnails as data URLs ---------- */
const sampleProducts = [
  { id: 'p1', title: 'Navy Blazer', subtitle: 'Formal – Interview', color: '#16324a', svg: svgCard('#16324a','Navy Blazer') },
  { id: 'p2', title: 'Red Dress', subtitle: 'Party – Evening', color: '#b51d2a', svg: svgCard('#b51d2a','Red Dress') },
  { id: 'p3', title: 'Denim Jacket', subtitle: 'Casual – Street', color: '#2b5f95', svg: svgCard('#2b5f95','Denim') },
  { id: 'p4', title: 'Trench Coat', subtitle: 'Travel – Stylish', color: '#7a5a2c', svg: svgCard('#7a5a2c','Trench') },
];

function svgCard(bg, text){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
  <rect rx='14' width='100%' height='100%' fill='${bg}'/>
  <text x='50%' y='50%' fill='#fff' font-size='36' text-anchor='middle' font-family='Arial' dy='12'>${text}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}

/* ---------- Render product tiles ---------- */
const productsEl = document.getElementById('products');
sampleProducts.forEach(p=>{
  const div = document.createElement('div'); div.className='product';
  div.innerHTML = `
    <div class="thumb" style="background-image:url('${p.svg}')"></div>
    <div style="width:100%;text-align:center">
      <div class="p-title">${p.title}</div>
      <div class="p-sub">${p.subtitle}</div>
    </div>
    <div style="display:flex;gap:8px;width:100%;justify-content:center;margin-top:6px">
      <button class="chip" data-action="try" data-id="${p.id}">Try</button>
      <button class="chip" data-action="suggest" data-id="${p.id}">Suggest</button>
    </div>`;
  productsEl.appendChild(div);
});

/* ---------- Chat bot (rule-based) ---------- */
const messages = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

const quicks = document.querySelectorAll('.chip[data-intent]');
quicks.forEach(b=>b.addEventListener('click',()=>processIntent(b.dataset.intent)));

sendBtn.addEventListener('click', () => handleSend());
userInput.addEventListener('keydown', e => { if(e.key==='Enter') handleSend(); });

function appendMessage(text, who='bot'){
  const el = document.createElement('div'); el.className = 'msg ' + (who==='bot'?'bot':'user');
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping(){
  const t = document.createElement('div'); t.className='msg bot'; t.innerHTML = '<div class="typing"></div>';
  messages.appendChild(t); messages.scrollTop = messages.scrollHeight;
  return t;
}

function handleSend(){
  const text = userInput.value.trim(); if(!text) return;
  appendMessage(text,'user'); userInput.value='';
  respondTo(text);
}

function respondTo(text){
  const typing = showTyping();
  setTimeout(()=> {
    typing.remove();
    const intent = detectIntent(text);
    const reply = generateReply(intent, text);
    appendMessage(reply,'bot');
    if(intent && intent.products){
      const prodLine = intent.products.map(id => {
        const p = sampleProducts.find(x=>x.id===id);
        return `[${p.title}]`;
      }).join(' ');
      appendMessage('Suggested: ' + prodLine,'bot');
    }
  }, 700 + Math.random()*800);
}

function detectIntent(text){
  text = text.toLowerCase();
  if(/interview|job|resume|cv|office|meeting/.test(text)) return {name:'interview', products:['p1']};
  if(/party|dress|evening|date/.test(text)) return {name:'party', products:['p2']};
  if(/casual|weekend|street|jean/.test(text)) return {name:'casual', products:['p3']};
  if(/travel|trip|vacation|coat/.test(text)) return {name:'travel', products:['p4']};
  if(/upload|photo|try on|try-on|try/.test(text)) return {name:'try', products:[]};
  return {name:'unknown', products:['p3','p1']};
}

function generateReply(intent, raw){
  switch(intent.name){
    case 'interview':
      return "For an interview, choose a smart blazer + tailored pants. Neutral tones (navy, gray) convey professionalism. I suggest: Navy Blazer.";
    case 'party':
      return "For a party, pick something bold and comfortable — a red dress or statement jacket. Try: Red Dress.";
    case 'casual':
      return "Casual look: denim jacket, clean tee, sneakers. Comfortable but stylish. Try: Denim Jacket.";
    case 'travel':
      return "Travel outfit: lightweight trench or versatile jacket, comfortable shoes. Try: Trench Coat.";
    case 'try':
      return "You can upload a front-facing photo on the right panel and click 'Try' on any product to overlay a sample.";
    default:
      return "I can help suggest outfits for interview, party, casual, or travel. Ask me: 'What should I wear to a job interview?'";
  }
}

function processIntent(intent){
  const mapping = { 
    interview: "What should I wear to a job interview?", 
    party: "I need an outfit for a party tonight.", 
    casual: "Casual weekend outfit.", 
    travel: "What to wear for travel?"
  };
  userInput.value = mapping[intent]; handleSend();
}

/* Product buttons (try / suggest) */
productsEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if(action === 'try') productTry(id);
  if(action === 'suggest') productSuggest(id);
});

function productSuggest(id){
  const p = sampleProducts.find(x=>x.id===id);
  appendMessage(`Suggested product: ${p.title} — ${p.subtitle}`,'bot');
}

/* ---------- Try-on logic ---------- */
const photoUpload = document.getElementById('photoUpload');
const userPhoto = document.getElementById('userPhoto');
const overlayImg = document.getElementById('overlayImg');
const canvas = document.getElementById('canvas');
const scaleRange = document.getElementById('scaleRange');
const opacityRange = document.getElementById('opacityRange');
const clearPhoto = document.getElementById('clearPhoto');

let currentOverlaySrc = null;

photoUpload.addEventListener('change', async (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const url = URL.createObjectURL(file);
  userPhoto.src = url; userPhoto.style.display='block';
  canvas.querySelectorAll('div[style]').forEach(d=>d.style.display='none');
  overlayImg.style.display = currentOverlaySrc ? 'block' : 'none';
  fitUserPhoto();
});

clearPhoto.addEventListener('click', ()=>{
  userPhoto.src=''; userPhoto.style.display='none';
  overlayImg.src=''; overlayImg.style.display='none';
  canvas.querySelectorAll('div[style]').forEach(d=>d.style.display='block');
  photoUpload.value='';
  currentOverlaySrc = null;
});

function fitUserPhoto(){
  userPhoto.style.position='relative';
  userPhoto.style.maxWidth='60%';
  userPhoto.style.maxHeight='60%';
  userPhoto.style.left='0';
  userPhoto.style.top='0';
}

scaleRange.addEventListener('input', () => updateOverlayTransform());
opacityRange.addEventListener('input', () => overlayImg.style.opacity = Number(opacityRange.value)/100);

function productTry(id){
  const p = sampleProducts.find(x=>x.id===id);
  const w = 600, h = 800;
  const overlaySvg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <rect x='80' y='140' rx='40' ry='40' width='440' height='560' fill='${p.color}' opacity='0.9'/>
    <text x='50%' y='90%' fill='white' font-size='40' font-family='Arial' text-anchor='middle'>${p.title}</text>
  </svg>`;
  const overlayDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(overlaySvg);
  currentOverlaySrc = overlayDataUrl;
  overlayImg.src = overlayDataUrl;
  overlayImg.style.display = 'block';
  overlayImg.style.pointerEvents = 'none';
  overlayImg.style.opacity = Number(opacityRange.value)/100;
  updateOverlayTransform();
  appendMessage(`Placed ${p.title} on the try-on canvas. Use sliders to adjust size/opacity.`, 'bot');
}

function updateOverlayTransform(){
  if(!currentOverlaySrc) return;
  const scale = Number(scaleRange.value)/100;
  const canvasRect = canvas.getBoundingClientRect();
  const baseW = canvasRect.width * 0.6;
  const baseH = canvasRect.height * 0.6;
  overlayImg.style.width = (baseW * scale) + 'px';
  overlayImg.style.height = 'auto';
  overlayImg.style.left = ((canvasRect.width - parseFloat(overlayImg.style.width || baseW)) / 2) + 'px';
  overlayImg.style.top = ((canvasRect.height - (parseFloat(overlayImg.style.height) || baseH)) / 2) + 'px';
}

/* Welcome message */
appendMessage("Hello! I'm Fitme Assistant — tell me the occasion (interview, party, casual, travel) or upload a photo and try outfits on the right.", 'bot');

/* Keep scroll at bottom */
const obs = new MutationObserver(()=> messages.scrollTop = messages.scrollHeight);
obs.observe(messages,{childList:true,subtree:true});
