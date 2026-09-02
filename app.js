/* STUDIO_LOCAL_AI — motor de geração e edição 100% local, sem APIs */
(() => {
"use strict";
const D=window.STUDIO_DATA;
const $=s=>document.querySelector(s);
const state={category:"hamburgueria",style:"Moderno",goal:"Vendas",name:"",command:"",seed:0,html:"",history:[],future:[],memory:{}};

const semantic={
 moderno:["moderno","moderna","contemporaneo","contemporânea","atual","urbano","clean","modern"],
 luxuoso:["luxuoso","luxuosa","elegante","sofisticado","sofisticada","premium","exclusivo","exclusiva","luxury"],
 barato:["barato","barata","economico","econômico","acessivel","acessível","preco justo","bom custo beneficio","bom custo-beneficio"],
 rapido:["rapido","rápido","agil","ágil","pratico","prático","fast"],
 vendas:["vendas","venda","pedido","pedir","comprar","compra","promocao","promoção","oferta","sales"],
 agendamento:["agendamento","agendar","marcar","marque","horario","horário","reservar","reserva","appointment"],
 hamburgueria:["hamburgueria","hamburgueri","burgueria","burguer","burger","hamburger","hamburguer"],
 pizzaria:["pizzaria","pizaria","pissaria","pisaria","pizzariaa","pizza","pizzas"],
 restaurante:["restaurante","restalrante","restauramte","restaurant"],
 clinica:["clinica","clínica","clinicaa","clinicas","clínicas","clinic"],
 barbearia:["barbearia","barbeari","barber","barbershop"],
 mercado:["mercado","mercadoo","market","supermercado"],
 preco:["preco","preços","precos","preço","valor","valores","price","prices","cost"],
 remover:["remover","remove","removerr","removeu","remober","tirar","tira","retirar","retira","apagar","apaga","excluir","exclui","deletar","delete","deleta","hide","sem","sumir","esconder","ocultar"],
 adicionar:["adicionar","add","adiciona","colocar","coloca","botar","bota","por","pôr","inserir","insere","criar","cria","acrescentar","insert"],
 alterar:["mudar","muda","trocar","troca","alterar","altera","modificar","modifica","editar","edita","substituir","substitui","change","edit","replace"],
 desfazer:["desfazer","desfaz","volta","voltar","undo"],
 refazer:["refazer","refaz","redo","novamente"],
 design:["bonito","bonita","lindo","linda","brabo","braba","maneiro","maneira","sinistro","chave","impactante","bonitao","beautiful","profissional","melhora","melhorar","arruma","ajeita"],
 botao:["botao","botão","botoes","botões","button","buttons"],
 hero:["hero","capa","banner","cabecalho","cabeçalho","principal","imagem maior","hero maior"],
 menu:["menu","cardapio","cardápio","catalogo","catálogo"],
 contato:["contato","contact","fale conosco"],
 secao:["secao","seção","parte","bloco","section","bagulho","parada","negocio","negócio","treco","isso","this"],
 produto:["produto","produtos","item","itens","product","products"],
 servico:["servico","serviço","servicos","serviços","service","services"],
 imagem:["imagem","imagens","image","images","foto","fotos","imgem","imajem"],
 fundo:["fundo","background","bg"],
 fonte:["fonte","font","tipografia","typeface"],
 cor:["cor","cores","color","colors"],
 tamanho:["tamanho","size","maior","menor","bigger","smaller"],
 localizacao:["localizacao","localização","endereco","endereço","mapa","maps","location"],
 horario:["horario","horários","horarios","hours","opening"],
 depoimento:["depoimento","depoimentos","testimonial","testimonials"],
 faq:["faq","duvidas","dúvidas","perguntas"],
 galeria:["galeria","gallery"],
 promocao:["promocao","promoção","promocoes","promoções","oferta","offers"],
 animacao:["animacao","animação","animacoes","animações","animation","animations"],
 ordem:["ordem","order","reordenar","reorganizar","organizar"],
 duplicar:["duplicar","duplica","outro igual","duplicate","copy"],
 gira:["mano","irmão","irmao","cara","cria","pô","po","mó","mo","tá ligado","ta ligado","bota aí","bota ai","tira aí","tira ai","faz aí","faz ai","manda ver","deixa chave","deixa brabo","bagulho","parada","treco"]
};
const typoMap={renover:"remover",renove:"remover",renovei:"remover",remober:"remover",removerr:"remover",pizaria:"pizzaria",pissaria:"pizzaria",pisaria:"pizzaria",pizzariaa:"pizzaria",burgueria:"hamburgueria",burgueri:"hamburgueria",hamburgueri:"hamburgueria",barbeari:"barbearia",clinicaa:"clinica",restalrante:"restaurante",mercadoo:"mercado",precoo:"preco",precooo:"preco",precos:"preco",preços:"preco",valores:"preco",prices:"preco",boto:"botao",botao:"botao",secao:"secao",seção:"secao",imajem:"imagem",imgem:"imagem",subtitulo:"subtitulo",titulo:"titulo",endereco:"endereco",localizacao:"localizacao",contatoo:"contato",wats:"whatsapp",wpp:"whatsapp",whats:"whatsapp",zap:"whatsapp",zapzap:"whatsapp",modern:"moderno",moderna:"moderno"};

function normalize(s){return String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/(.)\1{2,}/g,"$1$1").replace(/[^\w\s$.:\/@?&=+\-#%]/g," ").replace(/\s+/g," ").trim()}
function tokenize(s){return normalize(s).split(/\s+/).filter(Boolean)}
function levenshtein(a,b){const prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));for(let j=0;j<cur.length;j++)prev[j]=cur[j]}return prev[b.length]}
function canonicalize(text){return tokenize(text).map(t=>{if(typoMap[t])return typoMap[t];let best=t,bd=99;for(const [k,v] of Object.entries(typoMap)){const d=levenshtein(t,k);if(k.length>=5 && t.length>=5 && d<=Math.max(1,Math.floor(k.length*.25))&&d<bd){bd=d;best=v}}return best}).join(" ")}
function has(text,...terms){const n=canonicalize(text);return terms.some(t=>{const q=normalize(t);return q.includes(" ")?n.includes(q):new RegExp("(^|\\s)"+q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|\\s)").test(n)})}
function semanticScore(text,key){const n=canonicalize(text),words=semantic[key]||[];return words.reduce((s,w)=>s+(n.includes(normalize(w))?1:0),0)}
function detectCategory(n){for(const c of ["hamburgueria","pizzaria","restaurante","clinica","barbearia","mercado"])if(semanticScore(n,c))return c;return null}
function extractUrl(text){const m=String(text||"").match(/https?:\/\/[^\s]+/i);return m?m[0].replace(/[),.;]+$/g,""):null}
function extractPhone(text){const m=String(text||"").match(/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[\s.-]?\d{4}/);return m?m[0].replace(/\D/g,""):null}
function extractPhones(text){const r=/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[\s.-]?\d{4}/g;return [...String(text||"").matchAll(r)].map(m=>m[0].replace(/\D/g,"")).filter((v,i,a)=>a.indexOf(v)===i)}
function extractEmail(text){const m=String(text||"").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);return m?m[0]:null}
function extractQuoted(text){const q=String(text||"").match(/["“”']([^"“”']+)["“”']/);return q?q[1].trim():null}
function socialFromText(n){const map=[
 ["whatsapp",/(whatsapp|wpp|wats|zap|zapzap)/],["instagram",/(instagram|insta)/],["facebook",/(facebook|face)/],["tiktok",/(tiktok|tik tok)/],["youtube",/(youtube|yt)/],["telegram",/telegram/],["linkedin",/linkedin/],["x",/(x|twitter)/],["threads",/threads/],["discord",/discord/],["pinterest",/pinterest/],["google maps",/google maps|maps/],["site",/(site|website|nosso site)/]
 ];return map.filter(x=>x[1].test(n)).map(x=>x[0])}
function contactKind(n){if(/\b(whatsapp|wpp|wats|zap|zapzap)\b/.test(n))return "whatsapp";if(/\b(telefone|fone|celular|phone)\b/.test(n))return "telefone";if(/\b(email|e-mail|mail)\b/.test(n))return "email";const s=socialFromText(n);return s[0]||null}
function detectElement(text){const n=canonicalize(text);if(semanticScore(n,"preco"))return "preços";if(semanticScore(n,"botao"))return "botão";if(semanticScore(n,"hero"))return "hero";if(semanticScore(n,"menu"))return "menu";if(semanticScore(n,"contato"))return "contato";if(semanticScore(n,"imagem"))return "imagens";if(semanticScore(n,"fundo"))return "fundo";if(semanticScore(n,"fonte"))return "fonte";if(semanticScore(n,"localizacao"))return "localização";if(semanticScore(n,"produto"))return "produtos";if(semanticScore(n,"servico"))return "serviços";if(semanticScore(n,"secao"))return "seção";return null}

function learnFromCommand(text){const raw=String(text||"");const m=raw.match(/quando eu falar\s+["“”]?([\w-]+)["“”]?\s+(?:quero dizer|significa)\s+(.+)/i);if(!m)return false;const key=normalize(m[1]),meaning=normalize(m[2].trim());state.memory[key]=meaning;localStorage.setItem("studio_ai_memory",JSON.stringify(state.memory));return true}
function applyLearnedTerms(text){let n=normalize(text);for(const [k,v] of Object.entries(state.memory||{})){if(k)n=n.replace(new RegExp("(^|\\s)"+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|\\s)","g"),"$1"+v+"$2")}return canonicalize(n)}
function loadMemory(){try{state.memory=JSON.parse(localStorage.getItem("studio_ai_memory")||"{}")}catch{state.memory={}}}
function removeEntity(n,entity){return new RegExp('(?:remove|remover|tira|tirar|apaga|apagar|exclui|excluir|deleta|deletar|sem|retira|retirar|hide|oculta|ocultar)\\s+(?:o|a|os|as)?\\s*(?:'+entity+')\\b').test(n)||new RegExp('\\b(?:'+entity+')\\b\\s+(?:remove|remover|tira|tirar|apaga|apagar|exclui|excluir|deleta|deletar)').test(n)}
function interpretCommand(text){
 const raw=String(text||'');
 if(learnFromCommand(raw)) return {raw,normalized:applyLearnedTerms(raw),action:'learn',ops:[],confidence:1};
 const n=applyLearnedTerms(raw), ops=[];
 const cat=detectCategory(n);
 const add=/\b(adiciona|adicionar|adiciona|coloca|colocar|bota|bote|botar|põe|por|cria|criar|crie|faz|fazer|quero|add)\b/.test(n);
 const rem=/\b(remove|remover|tira|tirar|apaga|apagar|exclui|excluir|deleta|deletar|sem|retira|retirar|hide|oculta|ocultar)\b/.test(n);
 const chg=/\b(muda|mudar|troca|trocar|altera|alterar|modifica|modificar|edita|editar|substitui|substituir|change|replace)\b/.test(n);
 const phones=extractPhones(raw), phone=phones[0]||null, email=extractEmail(raw), url=extractUrl(raw);
 const isWA=/\b(whatsapp|wpp|wats|zap|zapzap)\b/.test(n);
 const socials=['instagram','facebook','tiktok','youtube','telegram','threads','linkedin','pinterest','discord'];
 const social=Array.from(new Set(socials.filter(x=>new RegExp('\\b'+x+'\\b').test(n)).concat(/\b(insta)\b/.test(n)?['instagram']:[])));
 const style=semanticScore(n,'luxuoso')?'Luxuoso':semanticScore(n,'moderno')?'Moderno':semanticScore(n,'design')?'Moderno':null;
 const goal=semanticScore(n,'agendamento')?'Agendamento':semanticScore(n,'vendas')?'Vendas':null;
 if(cat) ops.push({action:'set_category',category:cat});
 if(rem && semanticScore(n,'preco')) ops.push({action:'remove',element:'preços'});
 const wantsImages=semanticScore(n,'imagem') || /\b(fotos?|imagens?)\b/.test(n);
 const imageAdd=/\b(coloca|colocar|adiciona|adicionar|bota|botar|quero|cria|criar|com)\b[^,.;]{0,18}\b(fotos?|imagens?)\b/.test(n) && !/\b(muda|mudar|troca|trocar)\b[^,.;]{0,18}\b(fotos?|imagens?)\b/.test(n);
 const heroCtx=/\b(no inicio|no começo|no topo|logo quando abrir|na primeira parte|na primeira secao|na primeira seção|na capa|hero|começo|inicio)\b/.test(n);
 if(wantsImages && !removeEntity(n,'imagem|imagens|foto|fotos') && (!chg || imageAdd)){
   const qtyMatch=n.match(/\b(\\d+)\\s+(?:fotos?|imagens?)\b/); const qty=qtyMatch?Math.min(12,Math.max(1,+qtyMatch[1])):3;
   ops.push({action:'images',category:cat||state.category,qty,hero:heroCtx||/\b(fundo|background)\b/.test(n)});
 } else if(cat && /\b(cria|criar|crie|faz|faca|fazer|quero)\b/.test(n)){

   ops.push({action:'images',category:cat,qty:3,hero:true});
 }
 if((/\b(fundo|background|bg)\b/.test(n) || /\b(profissional|premium|luxuoso|luxuosa|chique|sofisticado)\b/.test(n)) && (!rem || cat)){
   let value=/\b(profissional|premium|luxuoso|luxuosa|chique|sofisticado)\b/.test(n)?'luxury':'professional';
   if(/\b(preto e dourado|preto.*dourado|dourado.*preto)\b/.test(n)) value='black-gold';
   else if(/\b(luxuoso|luxuosa|premium|elegante|sofisticado)\b/.test(n)) value='luxury';
   else if(cat==='pizzaria' || /\b(pizzaria|pizza)\b/.test(n)) value='pizza';
   else { const m=n.match(/(?:para|por|de)\s+(preto|branco|azul|verde|vermelho|escuro|claro)/); if(m)value=m[1]; }
   ops.push({action:'background',value});
 }
 if(phone){
   const msg=(n.match(/\bmensagem\s+(.+?)(?:$)/)||[])[1]||null;
   ops.push({action:'contact',kind:'whatsapp',mode:'set',value:phone,message:msg});
   if(/\btelefone\b/.test(n) && !isWA) ops.push({action:'contact',kind:'telefone',mode:'set',value:phone});
 }
 if(email) ops.push({action:'contact',kind:'email',mode:'set',value:email});
 if(url){
   let kind=null;
   if(/instagram\.com/.test(url))kind='instagram'; else if(/facebook\.com/.test(url))kind='facebook'; else if(/tiktok\.com/.test(url))kind='tiktok'; else if(/youtube\.com|youtu\.be/.test(url))kind='youtube'; else if(/t\.me|telegram\./.test(url))kind='telegram'; else if(/linkedin\.com/.test(url))kind='linkedin'; else if(/twitter\.com|x\.com/.test(url))kind='x';
   ops.push({action:'contact',kind:kind||'custom',mode:'set',value:url,label:extractQuoted(raw)||null});
 }
 if(removeEntity(n,'telefone|fone|celular|phone')) ops.push({action:'contact',kind:'telefone',mode:'remove'});
 if(social.length) social.filter(k=>removeEntity(n,k+'|insta|face|zap|wpp')).forEach(k=>ops.push({action:'contact',kind:k,mode:'remove'}));
 if(/\b(deixa so|deixa apenas|somente|apenas)\b/.test(n) && social.length) ops.push({action:'contact_only',kinds:social.concat(isWA?['whatsapp']:[])});
 if(chg && /\b(nome|logo)\b/.test(n)){let v=extractQuoted(raw); if(!v){const m=raw.match(/(?:nome|logo)\s+(?:para|como|por)\s+([^,.;]+)/i);v=m?m[1].trim():null} if(v)ops.push({action:'change',element:'nome',value:v});}
 if(chg && /\b(titulo|title)\b/.test(n)){const v=extractQuoted(raw)||((raw.match(/(?:titulo|title)\s+(?:para|como|por)\s+(.+)/i)||[])[1]);if(v)ops.push({action:'change',element:'título',value:v.trim()});}
 if(chg && /\b(subtitulo|subtitle)\b/.test(n)){const v=extractQuoted(raw)||((raw.match(/(?:subtitulo|subtitle)\s+(?:para|como|por)\s+(.+)/i)||[])[1]);if(v)ops.push({action:'change',element:'subtítulo',value:v?.trim()});}
 if(add && /\b(botao|botão|button)\b/.test(n)){let label=extractQuoted(raw);if(!label){const m=raw.match(/(?:botao|botão|button)\s+(.+)/i);label=m?m[1].split(/,|\s+e\s+|\s+sem\s+/i)[0].trim():null}ops.push({action:'add',element:'botão',value:label||'Pedir agora'});}
 if(removeEntity(n,'botao|botão|button') && !/pdf/.test(n)) ops.push({action:'remove',element:'botão'});
 if(/\bpdf\b/.test(n) && (add||chg||/baixar/.test(n))) ops.push({action:'pdf'});
 if(/\b(baixar site|download site)\b/.test(n) && /pdf/.test(n)) ops.push({action:'pdf',replaceDownload:true});
 if(removeEntity(n,'endereco|endereço|localizacao|localização|mapa')) ops.push({action:'remove',element:'localização'});
 if(add && /\b(endereco|endereço)\b/.test(n)){const m=raw.match(/(?:endereco|endereço)\s*[:=]?\s*([^,;.]+?)(?:\s*(?:,|$))/i);if(m)ops.push({action:'location',value:m[1].trim()});}
 if(style)ops.push({action:'style',element:'site',value:style==='Luxuoso'?'luxuoso':'moderno'});
 if(/\b(mais profissional|profissional|top|brabo|chique|sofisticado|premium)\b/.test(n))ops.push({action:'style',element:'site',value:'luxuoso'});
 if(/\b(preto e dourado|preto.*dourado|dourado.*preto)\b/.test(n))ops.push({action:'palette',value:'black-gold'});
 if(/\b(muda a foto|troca a foto|troque a foto|troca ela)\b/.test(n))ops.push({action:'images',category:cat||state.category,qty:1,hero:true,replace:true});
 if(/\b(desfaz|desfazer|undo)\b/.test(n))ops.push({action:'undo',count:1});
 if(/\b(refaz|refazer|redo)\b/.test(n))ops.push({action:'redo',count:1});
 if(!ops.length && cat)ops.push({action:'generate'});
 return {raw,normalized:n,action:ops[0]?.action||'generate',ops,category:cat,style,goal,element:detectElement(n),confidence:Math.min(1,.25+(cat?.2:0)+(phone?.2:0)+(url?.15:0)+(ops.length?.2:0))};
}
function inferCommand(){const parsed=interpretCommand(state.command);state.lastIntent=parsed;if(parsed.category)state.category=parsed.category;if(parsed.style)state.style=parsed.style;if(parsed.goal)state.goal=parsed.goal;return parsed}

function cleanText(s){return String(s??"").replace(/\\n/g," ").replace(/\s+/g," ").trim()}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
function pick(a,n){return a[(state.seed+n)%a.length]}
function localAI(){
 inferCommand();
 const cat=D.categories[state.category]||D.categories.hamburgueria;
 const name=cleanText(state.name)||cat.label.replace(/s$/,'')+' '+((state.seed%90)+1);
 const color=pick(cat.colors,2), hero=pick(cat.hero,1), sub=pick(cat.sub,3);
 const cta=state.goal==='Agendamento'?'AGENDAR HORÁRIO':state.goal==='Informação'?'CONHECER SERVIÇOS':'QUERO PEDIR';
 const prices=[29,34,39,44,49,54,59,64].map((x,i)=>x+(state.seed+i)%7);
 const items=cat.items.map((x,i)=>({name:x,price:prices[i]}));
 const layout=D.layouts[state.seed%D.layouts.length];
 return buildSite({cat,name,hero,sub,cta,items,layout,color,style:normalize(state.style),category:state.category,images:[1,2,3].map(i=>localAsset(state.category,i)),prices:true,background:'auto',contacts:{},address:null,pdf:false});
}
function localAsset(category,index=1){const map={hamburgueria:'hamburguer',pizzaria:'pizza',restaurante:'restaurante',clinica:'clinica',barbearia:'barbearia',mercado:'mercado'};const folder=map[category]||'pizza';return `./images/${folder}/${folder}-${String(((index-1)%3)+1).padStart(2,'0')}.jpg`;}
function buildSite(o){
 const accent=o.color[0], dark=['dark','bold'].includes(normalize(o.layout))||o.background==='dark';
 const imgs=(o.images&&o.images.length?o.images:[localAsset(o.category||'pizzaria',1),localAsset(o.category||'pizzaria',2),localAsset(o.category||'pizzaria',3)]);
 const bg=o.background==='black-gold'?'linear-gradient(135deg,rgba(5,5,5,.92),rgba(44,32,5,.86)),url("'+localAsset(o.category||'pizzaria',1)+'")':o.background==='luxury'||o.background==='pizza'||o.background==='professional'?'linear-gradient(135deg,rgba(8,8,10,.78),rgba(25,12,8,.55)),url("'+imgs[0]+'")':'linear-gradient(135deg,#111827,#0b0d10)';
 const cards=(o.items||[]).slice(0,6).map((it,i)=>`<article class="card"><img src="${imgs[i%imgs.length]}" alt="Imagem de ${escapeHTML(it.name)}"><div class="tag">${i%2?'ESPECIAL':'DESTAQUE'}</div><h3>${escapeHTML(it.name)}</h3><p>${escapeHTML(o.cat.sub[i%o.cat.sub.length])}</p>${o.prices!==false?`<strong class="price">R$ ${it.price},90</strong>`:''}</article>`).join('');
 const benefits=o.cat.benefits.map(x=>`<li>✓ ${escapeHTML(x)}</li>`).join('');
 const gallery=imgs.map((im,i)=>`<img src="${im}" alt="Pizza e detalhes do negócio ${i+1}">`).join('');
 const darkBg=dark||o.background==='black-gold'||o.background==='luxury';
 const radius=normalize(o.layout)==='rounded'?'28px':'14px';
 const contactButtons=(o.contacts&&Object.entries(o.contacts).map(([k,v])=>{if(!v)return '';let href=v; if(k==='whatsapp')href=`https://wa.me/${normalizeWaNumber(v.number||v)}${v.message?`?text=${encodeURIComponent(v.message)}`:''}`;if(k==='telefone')href=`tel:${String(v).replace(/\D/g,'')}`;if(k==='email')href=`mailto:${v}`;return `<a class="btn contact" data-contact="${escapeHTML(k)}" href="${escapeHTML(href)}" target="${/^https?:/.test(href)?'_blank':'_self'}" rel="noopener">${escapeHTML(v.label||contactLabel(k))}</a>`}).join(''))||'';
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(o.name)}</title><style>*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:${darkBg?'#090a0c':'#f7f7f5'};color:${darkBg?'#f8fafc':'#171717'}.site{min-height:100vh}.nav{padding:20px 6vw;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${darkBg?'#ffffff18':'#00000012'}}.logo{font-weight:900;font-size:20px}.hero{min-height:620px;padding:80px 7vw;display:grid;grid-template-columns:1fr 1fr;gap:42px;align-items:center;background-image:${bg};background-size:cover;background-position:center}.hero h1{font-size:clamp(44px,6vw,82px);line-height:.94;letter-spacing:-3px;margin:15px 0}.hero p{font-size:18px;line-height:1.7;max-width:680px;color:${darkBg?'#d0d5dd':'#555b66'}.eyebrow,.tag{font-size:10px;letter-spacing:2px;font-weight:900;color:${accent}}.btn{display:inline-block;margin-top:18px;padding:14px 20px;background:${accent};color:#fff;text-decoration:none;border-radius:${radius};font-weight:800}.hero img,.gallery img,.card img{width:100%;display:block;object-fit:cover}.hero-visual img{height:390px;border-radius:${radius};box-shadow:0 24px 70px #0008}.section{padding:70px 7vw}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{padding:0 0 22px;border:1px solid ${darkBg?'#ffffff18':'#e5e7eb'};background:${darkBg?'#111318':'#fff'};border-radius:${radius};overflow:hidden}.card img{height:210px}.card>*:not(img){margin-left:20px;margin-right:20px}.card .tag{margin-top:18px}.card h3{margin-top:10px}.card p{line-height:1.6;color:${darkBg?'#b7beca':'#646873'}.price{font-size:20px}.benefits{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.benefits li{padding:18px;background:${darkBg?'#111318':'#fff'};border-radius:${radius}}.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.gallery img{height:240px;border-radius:${radius}}.contact-actions{display:flex;flex-wrap:wrap;gap:10px}.about{background:${darkBg?'#0f1115':'#eef1f3'}}footer{padding:28px 7vw;border-top:1px solid ${darkBg?'#ffffff18':'#00000012'};display:flex;justify-content:space-between;gap:20px}@media(max-width:760px){.hero{grid-template-columns:1fr;padding:55px 6vw}.grid,.gallery,.benefits{grid-template-columns:1fr}.hero-visual img{height:300px}.section{padding:52px 6vw}.nav{padding:17px 6vw}}</style></head><body class="site ${normalize(o.layout)}"><header class="nav"><div class="logo">${escapeHTML(o.name)}</div><div>${escapeHTML(o.cat.label.replace(/s$/,''))}</div></header><main><section class="hero" data-section="hero"><div><div class="eyebrow">EXPERIÊNCIA ${escapeHTML(String(o.style||'MODERNO').toUpperCase())}</div><h1>${escapeHTML(o.hero)}</h1><p>${escapeHTML(o.sub)}</p><a class="btn" href="#contato">${escapeHTML(o.cta)}</a></div><div class="hero-visual"><img src="${imgs[0]}" alt="Imagem profissional de ${escapeHTML(o.cat.label.replace(/s$/,''))}"></div></section><section class="section" data-section="produtos"><div class="eyebrow">SELEÇÃO</div><h2>Feito para dar vontade de voltar.</h2><div class="grid">${cards}</div></section><section class="section about" data-section="sobre"><div class="eyebrow">SOBRE</div><h2>Detalhes que fazem a diferença.</h2><p>${escapeHTML(o.sub)}</p></section><section class="section" data-section="galeria"><div class="eyebrow">GALERIA</div><h2>Veja de perto.</h2><div class="gallery">${gallery}</div></section><section class="section" data-section="beneficios"><div class="eyebrow">DIFERENCIAIS</div><h2>Uma experiência pensada para você.</h2><ul class="benefits">${benefits}</ul></section>${o.address?`<section class="section" data-section="localizacao"><div class="eyebrow">LOCALIZAÇÃO</div><h2>Onde estamos</h2><p class="address">${escapeHTML(o.address)}</p></section>`:''}<section class="section" id="contato" data-section="contato"><div class="eyebrow">CONTATO</div><h2>Vamos conversar?</h2><div class="contact-actions">${contactButtons}</div></section></main><footer><b>${escapeHTML(o.name)}</b>${o.pdf?'<button class="btn" data-pdf="1">Baixar site em PDF</button>':''}<span>Site criado localmente pelo STUDIO SITES.</span></footer><script>document.querySelectorAll('[data-pdf]').forEach(function(b){b.addEventListener('click',function(){window.parent.postMessage({type:'STUDIO_PDF'},'*')})})</script></body></html>`;
}
function parseDoc(html){return new DOMParser().parseFromString(html,"text/html")}
function cssColor(v){const m={preto:"#0d0f12",escuro:"#0d0f12",branco:"#ffffff",claro:"#fafafa",azul:"#2563eb",verde:"#16a34a",vermelho:"#dc2626"};return m[v]||null}
function findSection(doc,key){const sections=[...doc.querySelectorAll("[data-section],section")];const k=normalize(key);return sections.find(s=>{const ds=normalize(s.dataset.section||"");const tx=normalize(s.textContent||"");return ds===k||tx.includes(k)})}
function addSection(doc,kind){if(doc.querySelector(`[data-section="${kind}"]`))return;const main=doc.querySelector("main");if(!main)return;const el=doc.createElement("section");el.dataset.section=kind;const content={promocoes:["PROMOÇÕES","Ofertas especiais para aproveitar agora."],galeria:["GALERIA","Veja alguns momentos e detalhes do nosso trabalho."],localizacao:["LOCALIZAÇÃO","Encontre nosso endereço e veja como chegar."],contato:["CONTATO","Vamos conversar?"],sobre:["SOBRE NÓS","Conheça nossa história, nosso jeito de atender e o que fazemos melhor."],banner:["NOVIDADE","Uma mensagem de destaque para chamar atenção."],depoimentos:["DEPOIMENTOS","Quem conhece recomenda."],faq:["FAQ","Dúvidas rápidas."]}[kind]||[kind.toUpperCase(),"Conteúdo adicionado pelo STUDIO LOCAL AI."];el.innerHTML=`<div class="section-label">${escapeHTML(content[0])}</div><h2>${escapeHTML(content[1])}</h2><p>Conteúdo editável localmente. Você pode pedir para mudar, remover ou reorganizar esta seção.</p>`;main.appendChild(el)}
function removeSection(doc,key){const k=normalize(key);[...doc.querySelectorAll("[data-section],section")].forEach(s=>{const ds=normalize(s.dataset.section||""),tx=normalize(s.textContent||"");if(ds===k||(k==="galeria"&&tx.includes("galeria"))||(k==="promocao"&&tx.includes("promocao"))||(k==="banner"&&tx.includes("novidade")))s.remove()})}
function addButton(doc,label){const area=doc.querySelector(".contact-actions")||doc.querySelector(".hero");if(!area)return;const a=doc.createElement("a");a.className="btn";a.href="#contato";a.textContent=label||"FAZER PEDIDO";area.appendChild(a)}
function contactLabel(kind){return ({whatsapp:"Falar no WhatsApp",instagram:"Instagram",facebook:"Facebook",tiktok:"TikTok",youtube:"YouTube",telegram:"Telegram",linkedin:"LinkedIn",x:"X / Twitter",threads:"Threads",discord:"Discord",pinterest:"Pinterest","google maps":"Google Maps",site:"Nosso Site",telefone:"Ligar",email:"Enviar e-mail"})[kind]||kind}
function normalizeWaNumber(v){let n=String(v||"").replace(/\D/g,"");if(n.startsWith("00"))n=n.slice(2);if(n.length===10||n.length===11)n="55"+n;return n}
function addContact(doc,kind,value,message,label,addMode){const area=doc.querySelector(".contact-actions");if(!area)return;const old=[...area.querySelectorAll(`[data-contact="${CSS.escape(kind)}"]`)];if(value){if(!addMode)old.forEach(x=>x.remove());const a=doc.createElement("a");a.className="btn";a.dataset.contact=kind;a.textContent=label||contactLabel(kind);if(kind==="whatsapp"){const n=normalizeWaNumber(value);a.href=`https://wa.me/${n}${message?`?text=${encodeURIComponent(message)}`:""}`;a.target="_blank";a.rel="noopener"}else if(/^https?:\/\//i.test(value)){a.href=value;a.target="_blank";a.rel="noopener"}else if(kind==="telefone")a.href=`tel:${String(value).replace(/\D/g,"")}`;else if(kind==="email")a.href=`mailto:${value}`;else a.href="#contato";area.appendChild(a)}else old.forEach(x=>x.remove())}
function onlyContacts(doc,kinds){const area=doc.querySelector(".contact-actions");if(!area)return;const keep=new Set(kinds);[...area.querySelectorAll("[data-contact]")].forEach(a=>{if(!keep.has(a.dataset.contact))a.remove()})}
function setHeroBackground(doc,value){const hero=doc.querySelector('.hero');if(!hero)return;const img=hero.querySelector('img');const src=img?.getAttribute('src')||'./images/pizza/pizza-01.jpg';const map={luxury:`linear-gradient(135deg,rgba(5,5,5,.82),rgba(44,32,5,.70)),url("${src}")`,professional:`linear-gradient(135deg,rgba(8,8,10,.72),rgba(25,12,8,.55)),url("${src}")`,pizza:`linear-gradient(135deg,rgba(8,8,10,.68),rgba(90,18,10,.42)),url("${src}")`,'black-gold':`linear-gradient(135deg,rgba(0,0,0,.92),rgba(55,42,8,.82)),url("${src}")`,dark:'#0b0b0d',preto:'#090a0c',branco:'#fff',claro:'#fafafa'};hero.style.backgroundImage=map[value]||map.professional;hero.style.backgroundSize='cover';hero.style.backgroundPosition='center';}
function applyImageOps(doc,op){const cat=op.category||state.category||'pizzaria';const imgs=Array.from({length:Math.max(1,Math.min(12,op.qty||1))},(_,i)=>localAsset(cat,i+1));const hero=doc.querySelector('.hero');if(op.hero&&hero){const image=hero.querySelector('img');if(image)image.src=imgs[0];setHeroBackground(doc,'professional');}const gallery=doc.querySelector('.gallery');if(gallery){if(op.replace&&op.hero){const image=doc.querySelector('.hero img');if(image)image.src=imgs[0];}else if(op.qty>0){gallery.innerHTML=imgs.map((src,i)=>`<img src="${src}" alt="Imagem local ${i+1}">`).join('');}}}
function applyOperation(doc,op){
 if(op.action==="set_category"){const imgs=doc.querySelectorAll('.hero img,.gallery img,.card img');let i=0;imgs.forEach(x=>x.src=localAsset(op.category,++i));return}
 if(op.action==="images"){applyImageOps(doc,op);return}
 if(op.action==="background"){setHeroBackground(doc,op.value);return}
 if(op.action==="palette"){setHeroBackground(doc,"black-gold");doc.body.style.background="#090a0c";return}
 if(op.action==="location"){let el=doc.querySelector(".address");let sec=doc.querySelector(`[data-section="localizacao"]`);if(!sec){const main=doc.querySelector("main");if(main){sec=doc.createElement("section");sec.className="section";sec.dataset.section="localizacao";sec.innerHTML='<div class="eyebrow">LOCALIZAÇÃO</div><h2>Onde estamos</h2>';main.appendChild(sec)}}if(sec&&!el){el=doc.createElement("p");el.className="address";sec.appendChild(el)}if(el)el.textContent=op.value;return}
 if(op.action==="pdf"){let b=doc.querySelector("[data-pdf]");if(!b){const f=doc.querySelector("footer");if(f){b=doc.createElement("button");b.className="btn";b.dataset.pdf="1";b.textContent="Baixar site em PDF";f.insertBefore(b,f.firstChild)}}return}
 if(op.action==="remove"&&op.element==="preços"){doc.querySelectorAll(".card strong").forEach(x=>x.remove());return}
 if(op.action==="remove"&&op.element==="botão"){doc.querySelectorAll(".btn").forEach(x=>x.remove());return}
 if(op.action==="remove"&&op.element==="subtítulo"){const p=doc.querySelector(".hero > div p");if(p)p.remove();return}
 if(op.action==="remove"&&op.element==="imagens"){doc.querySelectorAll(".hero-visual,.gallery").forEach(x=>x.remove());return}
 if(op.action==="add"&&op.element==="botão"){addButton(doc,op.value||"FAZER PEDIDO");return}
 if(op.action==="add"&&op.element==="galeria"){addSection(doc,"galeria");return}
 if(op.action==="add"&&op.element==="promocoes"){addSection(doc,"promocoes");return}
 if(op.action==="add"&&op.element==="localização"){addSection(doc,"localizacao");return}
 if(op.action==="add"&&op.element==="contato"){addSection(doc,"contato");return}
 if(op.action==="add_products"){const grid=doc.querySelector(".grid");if(!grid)return;const base=[...grid.querySelectorAll(".card")];for(let i=0;i<op.count;i++){const c=(base[i%Math.max(1,base.length)]||doc.createElement("article")).cloneNode(true);if(c.querySelector("h3"))c.querySelector("h3").textContent=`Novo produto ${i+1}`;grid.appendChild(c)}return}
 if(op.action==="add_testimonials"){addSection(doc,"depoimentos");return}
 if(op.action==="remove"&&["galeria","promocao","localizacao","depoimento","faq","secao","banner"].includes(op.element)){removeSection(doc,op.element);return}
 if(op.action==="change"&&op.element==="nome"){doc.title=op.value;doc.querySelectorAll(".logo,footer b").forEach(x=>x.childNodes[0].nodeValue=op.value+" ");return}
 if(op.action==="change"&&op.element==="título"){const h=doc.querySelector(".hero h1");if(h)h.textContent=op.value;return}
 if(op.action==="change"&&op.element==="subtítulo"){const p=doc.querySelector(".hero > div p");if(p)p.textContent=op.value;return}
 if(op.action==="change"&&op.element==="imagens"){const img=doc.querySelector(".hero img");if(img&&op.value)img.src=op.value;return}
 if(op.action==="style"&&op.element==="fundo"){const c=cssColor(op.value);if(c)doc.body.style.background=c;return}
 if(op.action==="style"&&op.element==="botão"){doc.querySelectorAll(".btn").forEach(x=>x.style.padding="18px 28px");return}
 if(op.action==="style"&&op.element==="hero"){const h=doc.querySelector(".hero");if(h)h.style.minHeight=op.value==="menor"?"360px":"600px";return}
 if(op.action==="style"&&op.element==="site"){if(op.value==="dark"){doc.body.classList.add("dark");doc.body.style.background="#08090b";doc.body.style.color="#fff";doc.querySelector(".hero")?.style.setProperty("backgroundColor","#0b0c0f")}if(op.value==="minimal")doc.body.classList.add("minimal");if(op.value==="luxuoso"){doc.body.style.letterSpacing=".2px";doc.querySelector(".hero")?.style.setProperty("boxShadow","inset 0 -80px 140px #0008");doc.querySelectorAll(".card").forEach(x=>{x.style.borderRadius="20px";x.style.boxShadow="0 18px 50px #0003"})}if(op.value==="moderno"){doc.body.style.letterSpacing=".1px";doc.querySelectorAll(".card").forEach(x=>x.style.borderRadius="18px")};return}
 if(op.action==="move"){const s=findSection(doc,op.from);if(!s)return;if(op.position==="start")doc.querySelector("main").prepend(s);else if(op.position==="end")doc.querySelector("main").appendChild(s);else{const target=findSection(doc,"contato");if(target)target.parentNode.insertBefore(s,target)}return}
 if(op.action==="duplicate"){const s=findSection(doc,op.element)||doc.querySelector("section");if(s)s.parentNode.insertBefore(s.cloneNode(true),s.nextSibling);return}
 if(op.action==="contact" ){if(op.mode==="remove")addContact(doc,op.kind,null);else addContact(doc,op.kind,op.value||"#",op.message,op.label,op.mode==="add");return}
 if(op.action==="contact_only"){onlyContacts(doc,op.kinds);return}
}
function applyIntentToSite(html,intent){if(!intent||!intent.ops)return html;if(intent.ops.some(x=>x.action==="learn"))return html;const doc=parseDoc(html);intent.ops.filter(x=>x.action!=="undo"&&x.action!=="redo"&&x.action!=="generate").forEach(op=>applyOperation(doc,op));return "<!doctype html>"+doc.documentElement.outerHTML}

function validate(html){const errors=[];["undefined","NaN","Lorem ipsum","Seu texto aqui","Digite aqui"].forEach(x=>{if(html.toLowerCase().includes(x.toLowerCase()))errors.push(x)});if((html.match(/<html\b/gi)||[]).length!==1||!/<\/html>/i.test(html))errors.push("html");if((html.match(/<script\b/gi)||[]).length!==(html.match(/<\/script>/gi)||[]).length)errors.push("script");if(/\\n/.test(html))errors.push("newline");if(!/<body\b/i.test(html)||!/<main\b/i.test(html))errors.push("estrutura");return [...new Set(errors)]}
function pushHistory(){if(state.html){state.history.push(state.html);if(state.history.length>50)state.history.shift();state.future=[]}}
function render(){state.html=state.html.replace(/<!doctype html>\s*<!doctype html>/i,"<!doctype html>");$("#preview").srcdoc=state.html;$("#emptyPreview").style.display="none"}
function save(){const projects=JSON.parse(localStorage.getItem("studio_projects")||"[]");projects.unshift({at:new Date().toISOString(),...state,history:undefined,future:undefined});localStorage.setItem("studio_projects",JSON.stringify(projects.slice(0,30)));updateMemory()}
function performCommand(command){state.command=command;const parsed=interpretCommand(command);if(parsed.action==="learn"){return parsed}if(parsed.ops.some(o=>o.action==="undo")){const count=parsed.ops.find(o=>o.action==="undo").count||1;for(let i=0;i<count;i++)if(state.history.length){state.future.push(state.html);state.html=state.history.pop()}render();save();return parsed}if(parsed.ops.some(o=>o.action==="redo")){if(state.future.length){state.history.push(state.html);state.html=state.future.pop();render();save()}return parsed}if(!state.html||parsed.ops.some(o=>o.action==="generate")||(parsed.category&&parsed.category!==state.category)){state.category=parsed.category||$("#category").value;state.style=parsed.style||$("#style").value;state.goal=parsed.goal||$("#goal").value;state.name=$("#siteName").value;state.seed=state.seed||((Date.now()+Math.random()*100000)>>>0);state.html=localAI();pushHistory();state.html=applyIntentToSite(state.html,parsed)}else{pushHistory();state.html=applyIntentToSite(state.html,parsed)}const errs=validate(state.html);if(errs.length){state.html=state.history.pop()||state.html;$("#resultInfo").textContent="A alteração foi bloqueada na validação: "+errs.join(", ");render();return parsed}render();$("#resultInfo").textContent=`STUDIO_LOCAL_AI executou ${parsed.ops.length||1} operação(ões) localmente • validado`;save();return parsed}
function generate(){state.seed=((Date.now()+Math.floor(Math.random()*100000))>>>0);state.html="";performCommand($("#command").value||`Crie uma ${$("#category").value} ${$("#style").value}`)}
function regenerate(){state.seed++;state.html="";performCommand($("#command").value||`Crie uma ${$("#category").value} ${$("#style").value}`)}
function updateMemory(){const p=JSON.parse(localStorage.getItem("studio_projects")||"[]");$("#memoryCount").textContent=p.length}
function renderFilters(){const f=$("#filters");f.innerHTML="";["Todas",...D.layouts,...Object.keys(D.categories)].forEach(x=>{const b=document.createElement("button");b.textContent=x==="Todas"?"Todas":D.categories[x]?.label||x;b.dataset.filter=x;b.onclick=()=>{document.querySelectorAll(".filters button").forEach(z=>z.classList.remove("active"));b.classList.add("active");renderGrid()};f.appendChild(b)});f.firstChild.classList.add("active")}
function renderGrid(){const active=document.querySelector(".filters button.active")?.dataset.filter||"Todas",q=normalize($("#search").value);const list=D.models.filter(m=>(active==="Todas"||m.layout===active||m.category===active)&&(!q||normalize(m.id+" "+m.name+" "+m.categoryLabel+" "+m.layout).includes(q)));$("#modelGrid").innerHTML=list.map(m=>`<article class="model-card"><img src="images/${m.image}.svg" alt=""><div class="mc"><h3>${m.id} — ${m.layout}</h3><p>${m.categoryLabel} • variante ${m.variant}</p><button data-model="${m.id}">VER MODELO</button></div></article>`).join("");$("#modelGrid").querySelectorAll("button").forEach(b=>b.onclick=()=>loadModel(b.dataset.model))}
function loadModel(id){const m=D.models.find(x=>x.id===id);if(!m)return;$("#category").value=m.category;$("#style").value=m.layout==="Elegant"?"Elegante":m.layout==="Minimal"?"Minimalista":m.layout;$("#siteName").value="Meu "+m.categoryLabel.replace(/s$/i,"");$("#command").value=`Crie uma ${m.category} ${m.layout.toLowerCase()}`;state.seed=hash(id);state.html="";performCommand($("#command").value);location.hash="gerador"}
function pdfEscape(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function buildSimplePDF(textLines){const lines=(textLines||[]).map(cleanText).filter(Boolean).slice(0,35);let y=790;let stream='BT /F1 18 Tf 50 '+y+' Td ('+pdfEscape(lines[0]||'STUDIO SITES')+') Tj';for(let i=1;i<lines.length;i++){y-=22;stream+=' 0 -22 Td ('+pdfEscape(lines[i].slice(0,110))+') Tj'}stream+=' ET';const objs=[];objs.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');objs.push('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj');objs.push('3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj');objs.push('4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');objs.push('5 0 obj << /Length '+stream.length+' >> stream\n'+stream+'\nendstream endobj');let pdf='%PDF-1.4\n',offs=[0];for(const o of objs){offs.push(pdf.length);pdf+=o+'\n'}const x=pdf.length;pdf+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n';for(let i=1;i<offs.length;i++)pdf+=String(offs[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer << /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF';return new Blob([pdf],{type:'application/pdf'})}
function downloadPDF(){if(!state.html)return;const d=parseDoc(state.html);const lines=[d.title||'STUDIO SITES',d.querySelector('.hero h1')?.textContent||'',d.querySelector('.hero p')?.textContent||'',...Array.from(d.querySelectorAll('section h2')).map(x=>x.textContent),d.querySelector('.address')?.textContent||'',...Array.from(d.querySelectorAll('.contact')).map(x=>x.textContent+' — '+x.getAttribute('href'))];const blob=buildSimplePDF(lines),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='site-studio-sites.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
window.addEventListener('message',e=>{if(e.data&&e.data.type==='STUDIO_PDF')downloadPDF()});
$("#generate").onclick=generate;$("#regenerate").onclick=regenerate;$("#copy").onclick=async()=>{if(state.html){await navigator.clipboard.writeText(state.html);$("#resultInfo").textContent="Código copiado para a área de transferência."}};$("#download").onclick=downloadPDF;$("#search").oninput=renderGrid;$("#clearMemory").onclick=()=>{localStorage.removeItem("studio_projects");localStorage.removeItem("studio_ai_memory");state.memory={};updateMemory()};loadMemory();renderFilters();renderGrid();updateMemory();
window.STUDIO_LOCAL_AI={generate,validate,semantic,interpretCommand,canonicalize,applyIntentToSite,performCommand,learnFromCommand};
})();
