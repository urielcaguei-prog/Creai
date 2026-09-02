/* STUDIO_LOCAL_AI — motor de geração 100% local */
(() => {
"use strict";
const D=window.STUDIO_DATA;
const $=s=>document.querySelector(s);
const state={category:"hamburgueria",style:"Moderno",goal:"Vendas",name:"",command:"",seed:0,html:""};
const semantic={
 "moderno":["moderno","contemporâneo","atual","urbano","clean"],
 "luxuoso":["luxuoso","elegante","sofisticado","premium","exclusivo"],
 "barato":["barato","econômico","acessível","preço justo","bom custo-benefício"],
 "rápido":["rápido","ágil","prático","sem complicação"],
 "vendas":["vendas","pedido","comprar","promoção","oferta"],
 "agendamento":["agendamento","horário","marcar","reservar"],
 "hamburgueria":["hamburgueria","burger","hambúrguer","lanche","blend"],
 "pizzaria":["pizzaria","pizza","forno","massa","fatia"],
 "restaurante":["restaurante","menu","chef","gastronomia","prato"],
 "clínica":["clínica","consulta","atendimento","cuidado","especialidade"],
 "barbearia":["barbearia","corte","barba","degradê","barbeiro"],
 "mercado":["mercado","ofertas","compras","hortifruti","mercearia"]
};
function normalize(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function cleanText(s){
 s=String(s??"").replace(/\\n/g," ").replace(/\s+/g," ").trim();
 const bad=["undefined","null","NaN","Lorem ipsum","Seu texto aqui","Digite aqui"];
 bad.forEach(x=>{if(normalize(s)===normalize(x))s=""});
 return s;
}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
function pick(a,n){return a[(state.seed+n)%a.length]}
function inferCommand(){
 const c=normalize(state.command);
 for(const [key,words] of Object.entries(semantic)){
   if(words.some(w=>c.includes(normalize(w)))){
     if(["hamburgueria","pizzaria","restaurante","clinica","barbearia","mercado"].includes(key)) state.category=key;
     else if(key==="moderno")state.style="Moderno";
     else if(key==="luxuoso")state.style="Luxuoso";
     else if(key==="vendas")state.goal="Vendas";
     else if(key==="agendamento")state.goal="Agendamento";
   }
 }
}
function localAI(){
 inferCommand();
 const cat=D.categories[state.category]; const style=normalize(state.style);
 const name=cleanText(state.name)||cat.label.replace(/s$/,"")+" "+(state.seed%80+1);
 const color=pick(cat.colors,2);
 const hero=pick(cat.hero,1), sub=pick(cat.sub,3);
 const cta=state.goal==="Agendamento"?"AGENDAR HORÁRIO":state.goal==="Informação"?"CONHECER SERVIÇOS":"QUERO CONHECER";
 const prices=[29,34,39,44,49,54,59,64].map((x,i)=>({x:x+(state.seed+i)%7}));
 const items=cat.items.map((x,i)=>({name:x,price:prices[i].x}));
 const layout=D.layouts[state.seed%D.layouts.length];
 return buildSite({cat,name,hero,sub,cta,items,layout,color,style});
}
function localImage(key){
 const c={"burger":"#ff6b35","pizza":"#d62828","restaurant":"#8b5e34","clinic":"#2563eb","barber":"#111827","market":"#16a34a"}[key]||"#6366f1";
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${c}"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><circle cx="960" cy="150" r="180" fill="white" opacity=".08"/><circle cx="180" cy="690" r="260" fill="white" opacity=".06"/><text x="80" y="370" font-family="Arial" font-size="72" font-weight="700" fill="white">STUDIO SITES</text><text x="84" y="440" font-family="Arial" font-size="30" fill="white" opacity=".82">${String(key).toUpperCase()} • IMAGEM LOCAL</text></svg>`;
}
function buildSite(o){
 const img="data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(localImage(o.cat.image))));
 const accent=o.color[0], ink=o.color[1];
 const cards=o.items.slice(0,4).map((it,i)=>`<article class="card"><div class="tag">${i%2?"ESPECIAL":"DESTAQUE"}</div><h3>${escapeHTML(it.name)}</h3><p>${escapeHTML(o.cat.sub[i%o.cat.sub.length])}</p><strong>R$ ${it.price},90</strong></article>`).join("");
 const benefits=o.cat.benefits.map(x=>`<li>✓ ${escapeHTML(x)}</li>`).join("");
 const faqs=["Como funciona o atendimento?","Quais são os horários?","Como faço meu pedido ou agendamento?"].map(q=>`<details><summary>${q}</summary><p>Entre em contato para receber informações atualizadas e combinar o melhor atendimento.</p></details>`).join("");
 let layoutClass=normalize(o.layout);
 let heroLayout=layoutClass==="split"?`<div class="hero-media"><img src="${img}" alt="Imagem local do segmento"></div>`:`<div class="hero-art"><img src="${img}" alt="Imagem local do segmento"></div>`;
 if(layoutClass==="minimal") heroLayout="";
 const sectionOrder=layoutClass==="magazine"?["sobre","cards","benefits","faq"]:["cards","sobre","benefits","faq"];
 const sections=sectionOrder.map(s=>{
   if(s==="cards")return `<section><div class="section-label">SELEÇÃO DA CASA</div><h2>Feito para dar vontade de voltar.</h2><div class="grid">${cards}</div></section>`;
   if(s==="sobre")return `<section class="about"><div><div class="section-label">SOBRE</div><h2>Detalhes que fazem a diferença.</h2><p>${escapeHTML(o.sub)}</p><a class="btn" href="#contato">${o.cta}</a></div>${heroLayout}</section>`;
   if(s==="benefits")return `<section><div class="section-label">POR QUE ESCOLHER</div><h2>Uma experiência pensada para você.</h2><ul class="benefits">${benefits}</ul></section>`;
   return `<section><div class="section-label">FAQ</div><h2>Dúvidas rápidas.</h2>${faqs}</section>`;
 }).join("");
 const compact=layoutClass==="compact"?" compact":"";
 const glass=layoutClass==="glass"?" glass":"";
 const rounded=layoutClass==="rounded"?" rounded":"";
 const dark=["dark","bold"].includes(layoutClass)||ink==="#171717";
 const bodyClass=`site ${layoutClass}${compact}${glass}${rounded}`;
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(o.name)}</title><style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:${dark?"#0d0f12":"#fafafa"};color:${dark?"#f7f7f7":"#171717"}.site{--a:${accent};min-height:100vh}.nav{padding:22px 7vw;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${dark?"#ffffff18":"#00000010"}}.logo{font-weight:900}.nav span{color:${accent}}.hero{min-height:480px;padding:70px 7vw;display:grid;grid-template-columns:1fr .8fr;gap:50px;align-items:center;background:linear-gradient(135deg,${dark?"#111827":"#fff"},${dark?"#0d0f12":"#f5f5f5"})}.hero h1{font-size:clamp(44px,6vw,78px);line-height:.95;letter-spacing:-4px;margin:15px 0}.hero p{font-size:18px;line-height:1.7;color:${dark?"#b9c0cc":"#5b606b"};max-width:650px}.btn{display:inline-block;margin-top:18px;padding:13px 18px;background:${accent};color:#fff;border-radius:${rounded?"22px":"9px"};font-weight:800}.hero-art img,.hero-media img{width:100%;border-radius:${rounded?"32px":"16px"};display:block}.hero-art{align-self:stretch;display:flex;align-items:center}.hero-art img{max-height:330px;object-fit:cover}section{padding:70px 7vw}.section-label{font-size:10px;letter-spacing:2px;font-weight:900;color:${accent}}section h2{font-size:clamp(30px,4vw,48px);letter-spacing:-2px;margin:9px 0 28px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.card{padding:22px;border:1px solid ${dark?"#ffffff18":"#e4e4e7"};background:${glass?"#ffffff12":dark?"#15181d":"#fff"};border-radius:${rounded?"28px":"12px"};${glass?"backdrop-filter:blur(10px)":""}}.card .tag{font-size:9px;font-weight:900;color:${accent};letter-spacing:1px}.card h3{margin:18px 0 8px}.card p,.about p,details p{line-height:1.65;color:${dark?"#b9c0cc":"#646873"}}.card strong{font-size:20px}.about{display:grid;grid-template-columns:1fr .8fr;gap:50px;align-items:center;background:${dark?"#11151a":"#f1f3f5"}}.benefits{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.benefits li{padding:18px;background:${dark?"#15181d":"#fff"};border-radius:${rounded?"22px":"10px"};font-weight:700}details{padding:18px 0;border-bottom:1px solid ${dark?"#ffffff18":"#00000012"}}summary{cursor:pointer;font-weight:800}footer{padding:30px 7vw;border-top:1px solid ${dark?"#ffffff18":"#00000010"};display:flex;justify-content:space-between;gap:20px;color:${dark?"#aeb5c0":"#666"}}.split .hero{grid-template-columns:.8fr 1fr}.minimal .hero{grid-template-columns:1fr;max-width:1000px}.minimal .hero-art{display:none}.magazine .hero{grid-template-columns:1.2fr .8fr}.bold .hero h1{font-weight:1000}.compact section{padding:45px 7vw}.compact .hero{min-height:400px;padding:50px 7vw}.glass{background:radial-gradient(circle at 20% 0,#ffffff18,transparent 30%),#0f172a}.glass .nav{border-color:#ffffff18}.rounded .card,.rounded .benefits{border-radius:28px}@media(max-width:750px){.hero,.about,.split .hero,.minimal .hero,.magazine .hero{grid-template-columns:1fr}.grid{grid-template-columns:1fr 1fr}.benefits{grid-template-columns:1fr}.hero{padding:50px 6vw}.hero h1{letter-spacing:-2px}section{padding:50px 6vw}}@media(max-width:480px){.grid{grid-template-columns:1fr}.nav{padding:18px 6vw}}
</style></head><body class="${bodyClass}"><header class="nav"><div class="logo">${escapeHTML(o.name)} <span>●</span></div><div>${o.cat.label.replace(/s$/,"")}</div></header><main><div class="hero"><div><div class="section-label">EXPERIÊNCIA ${escapeHTML(o.style.toUpperCase())}</div><h1>${escapeHTML(o.hero)}</h1><p>${escapeHTML(o.sub)}</p><a class="btn" href="#contato">${escapeHTML(o.cta)}</a></div>${o.layout!=="Minimal"?heroLayout:""}</div>${sections}<section id="contato"><div class="section-label">CONTATO</div><h2>Vamos conversar?</h2><p>Rua Principal, 100 • Centro<br>Seg a Sáb • 09h às 20h</p><a class="btn" href="mailto:contato@exemplo.local">ENTRAR EM CONTATO</a></section></main><footer><b>${escapeHTML(o.name)}</b><span>Site criado localmente pelo STUDIO SITES.</span></footer></body></html>`;
}
function validate(html){
 const errors=[];
 ["undefined","NaN","Lorem ipsum","Seu texto aqui","Digite aqui"].forEach(x=>{if(html.toLowerCase().includes(x.toLowerCase()))errors.push(x)});
 if((html.match(/<html\b/gi)||[]).length!==1||!/<\/html>/i.test(html))errors.push("html");
 if((html.match(/<script\b/gi)||[]).length!==(html.match(/<\/script>/gi)||[]).length)errors.push("script");
 if(/\\n/.test(html))errors.push("newline");
 return errors;
}
function save(){
 const projects=JSON.parse(localStorage.getItem("studio_projects")||"[]");
 projects.unshift({at:new Date().toISOString(),...state,html:state.html});
 localStorage.setItem("studio_projects",JSON.stringify(projects.slice(0,30)));
 updateMemory();
}
function generateWithSeed(){
 state.category=$("#category").value;state.style=$("#style").value;state.goal=$("#goal").value;state.name=$("#siteName").value;state.command=$("#command").value;
 let html=localAI(), errs=validate(html), attempts=0;
 while(errs.length&&attempts<3){state.seed++;html=localAI();errs=validate(html);attempts++}
 if(errs.length){$("#resultInfo").textContent="Não foi possível validar o site.";return}
 state.html=html;$("#preview").srcdoc=html;$("#emptyPreview").style.display="none";
 $("#resultInfo").textContent=`Modelo ${state.seed>>>0} gerado localmente • ${D.categories[state.category].label} • ${D.layouts[state.seed%D.layouts.length]} • validado`;
 save();
}
function generate(){
 state.category=$("#category").value;state.style=$("#style").value;state.goal=$("#goal").value;state.name=$("#siteName").value;state.command=$("#command").value;
 state.seed=(Date.now()+Math.floor(Math.random()*100000))>>>0;
 let html=localAI(), errs=validate(html), attempts=0;
 while(errs.length&&attempts<3){state.seed++;html=localAI();errs=validate(html);attempts++}
 if(errs.length){$("#resultInfo").textContent="Não foi possível validar o site.";return}
 state.html=html;$("#preview").srcdoc=html;$("#emptyPreview").style.display="none";
 $("#resultInfo").textContent=`Gerado localmente • ${D.categories[state.category].label} • ${D.layouts[state.seed%D.layouts.length]} • validado`;
 save();
}
function updateMemory(){const p=JSON.parse(localStorage.getItem("studio_projects")||"[]");$("#memoryCount").textContent=p.length}
function renderFilters(){
 const f=$("#filters"); f.innerHTML="";
 ["Todas",...D.layouts,...Object.keys(D.categories)].forEach(x=>{const b=document.createElement("button");b.textContent=x==="Todas"?"Todas":D.categories[x]?.label||x;b.dataset.filter=x;b.onclick=()=>{document.querySelectorAll(".filters button").forEach(z=>z.classList.remove("active"));b.classList.add("active");renderGrid()};f.appendChild(b)});
 f.firstChild.classList.add("active");
}
function renderGrid(){
 const active=document.querySelector(".filters button.active")?.dataset.filter||"Todas",q=normalize($("#search").value);
 const list=D.models.filter(m=>(active==="Todas"||m.layout===active||m.category===active)&&(!q||normalize(m.id+" "+m.name+" "+m.categoryLabel+" "+m.layout).includes(q)));
 $("#modelGrid").innerHTML=list.map(m=>`<article class="model-card"><img src="images/${m.image}.svg" alt=""><div class="mc"><h3>${m.id} — ${m.layout}</h3><p>${m.categoryLabel} • variante ${m.variant}</p><button data-model="${m.id}">VER MODELO</button></div></article>`).join("");
 $("#modelGrid").querySelectorAll("button").forEach(b=>b.onclick=()=>loadModel(b.dataset.model));
}
function loadModel(id){const m=D.models.find(x=>x.id===id);if(!m)return;$("#category").value=m.category;$("#style").value=m.layout==="Elegant"?"Elegante":m.layout==="Minimal"?"Minimalista":m.layout;$("#siteName").value="Meu "+m.categoryLabel.replace(/s$/,"");$("#command").value=`Crie uma ${m.category} ${m.layout.toLowerCase()}`;state.seed=hash(id);generateWithSeed();location.hash="gerador"}
$("#generate").onclick=generate;$("#regenerate").onclick=()=>{state.seed++;generate()};$("#copy").onclick=async()=>{if(state.html){await navigator.clipboard.writeText(state.html);$("#resultInfo").textContent="Código copiado para a área de transferência."}};$("#download").onclick=()=>{if(!state.html)return;const blob=new Blob([state.html],{type:"text/html;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="site-studio-sites.html";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
$("#search").oninput=renderGrid;$("#clearMemory").onclick=()=>{localStorage.removeItem("studio_projects");updateMemory()};
renderFilters();renderGrid();updateMemory();
window.STUDIO_LOCAL_AI={generate,validate,semantic};
})();