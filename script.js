const $=id=>document.getElementById(id);
function tabs(host,out,items){
  items.forEach((it,i)=>{const b=document.createElement('button');b.textContent=it[0];b.setAttribute('role','tab');
    b.onclick=()=>{[...host.children].forEach(c=>c.setAttribute('aria-selected',c===b));out.textContent=it[1]};
    host.appendChild(b);if(i===0)b.click()});
}
tabs($('introTabs'),$('introOut'),[
 ['Nature','Mathematics is a precise language for describing structure, quantity and change. Programs are written in that same kind of exact language.'],
 ['History','Counting systems, Euclid’s algorithm, Boole’s algebra of logic and Turing’s computability all grew out of mathematics before electronic computers existed.'],
 ['Technology','Encryption uses number theory, graphics use geometry and linear algebra, search engines use graphs, and machine learning uses statistics.']]);
tabs($('polyaTabs'),$('polyaOut'),[
 ['1. Understand','Read the bug report. What input was given, what output was expected, and what actually happened?'],
 ['2. Plan','Pick a strategy: trace by hand, test smaller inputs, or work backwards from the wrong output.'],
 ['3. Carry out','Run the plan step by step and check each line against what you expected it to do.'],
 ['4. Look back','Does the fix work on other inputs? Add a test so the bug cannot return unnoticed.']]);

// Fibonacci
function fib(n){const a=[1,1];while(a.length<n)a.push(a[a.length-1]+a[a.length-2]);return a.slice(0,n)}
$('fibGo').onclick=()=>{
  let n=Math.max(2,Math.min(40,parseInt($('fibN').value)||12));const f=fib(n);
  const r=f[n-1]/f[n-2];
  $('fibOut').textContent=f.join(', ')+'\nRatio of last two terms: '+r.toFixed(8)+'  (φ ≈ 1.61803399)';
  $('fibOut').style.whiteSpace='pre-wrap';
};
let hi=0;const hf=fib(25);
setInterval(()=>{hi=(hi+1)%24;$('heroRatio').textContent=(hf[hi+1]/hf[hi]).toFixed(6)},500);
$('fibGo').click();

// Sets
const parse=s=>[...new Set(s.split(',').map(x=>x.trim()).filter(Boolean))];
$('setGo').onclick=()=>{
  const A=parse($('setA').value),B=parse($('setB').value);
  const show=s=>'{ '+s.join(', ')+' }';
  $('setOut').innerHTML='';
  [['Everything together (A ∪ B, union)','Every item that is in A or in B, with no repeats.',[...new Set([...A,...B])]],['Only the shared items (A ∩ B, intersection)','Items that appear in both A and B.',A.filter(x=>B.includes(x))],['Only in A (A − B, difference)','Items that are in A but not in B.',A.filter(x=>!B.includes(x))]]
  .forEach(([n,e,s])=>{const d=document.createElement('div');d.style.marginTop='8px';const b=document.createElement('b');b.textContent=n;const r=document.createElement('div');r.textContent=show(s);const p=document.createElement('small');p.style.color='var(--muted)';p.textContent=e;d.append(b,r,p);$('setOut').appendChild(d)});
};
$('setGo').click();

// Truth table
const ops={and:(p,q)=>p&&q,or:(p,q)=>p||q,xor:(p,q)=>p!==q,imp:(p,q)=>!p||q,iff:(p,q)=>p===q,nand:(p,q)=>!(p&&q)};
const names={and:'p ∧ q',or:'p ∨ q',xor:'p ⊕ q',imp:'p → q',iff:'p ↔ q',nand:'p ↑ q'};
function tt(){
  const o=$('op').value,t=$('tt');t.innerHTML='';
  const h=t.insertRow();['p','q',names[o]].forEach(x=>{const c=document.createElement('th');c.textContent=x;h.appendChild(c)});
  [[1,1],[1,0],[0,1],[0,0]].forEach(([p,q])=>{const r=t.insertRow();
    [p,q,ops[o](!!p,!!q)].forEach(v=>r.insertCell().textContent=v?'T':'F')});
}
$('op').onchange=tt;tt();

// Graph
$('graphGo').onclick=()=>{
  const E=$('edges').value.split('\n').map(l=>l.trim().split(/\s*-\s*/)).filter(a=>a.length===2&&a[0]&&a[1]);
  const adj={};E.forEach(([a,b])=>{(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a)});
  const V=Object.keys(adj);const out=$('graphOut');
  if(!V.length){out.textContent='Enter at least one edge such as A-B.';return}
  const seen=new Set([V[0]]),q=[V[0]];
  while(q.length){const v=q.pop();adj[v].forEach(w=>{if(!seen.has(w)){seen.add(w);q.push(w)}})}
  const connected=seen.size===V.length;
  const odd=V.filter(v=>adj[v].length%2);
  let verdict='No Euler path or circuit: '+odd.length+' vertices have an odd number of edges.';
  if(!connected)verdict='No Euler path or circuit: the graph is not connected.';
  else if(odd.length===0)verdict='Euler circuit exists: every vertex has an even degree.';
  else if(odd.length===2)verdict='Euler path exists, starting and ending at '+odd.join(' and ')+'.';
  out.textContent='Vertices: '+V.length+', edges: '+E.length+'. Degrees: '+V.map(v=>v+'='+adj[v].length).join(', ')+'. '+verdict;
};
$('graphGo').click();

// Stats
$('statGo').onclick=()=>{
  const x=$('nums').value.split(',').map(s=>parseFloat(s)).filter(n=>!isNaN(n)).sort((a,b)=>a-b);
  const o=$('statOut');
  if(!x.length){o.textContent='Enter numbers separated by commas.';return}
  const n=x.length,mean=x.reduce((a,b)=>a+b,0)/n;
  const med=n%2?x[(n-1)/2]:(x[n/2-1]+x[n/2])/2;
  const cnt={};x.forEach(v=>cnt[v]=(cnt[v]||0)+1);const mx=Math.max(...Object.values(cnt));
  const mode=mx===1?'none':Object.keys(cnt).filter(k=>cnt[k]===mx).join(', ');
  const sd=Math.sqrt(x.reduce((a,b)=>a+(b-mean)**2,0)/n);
  const f=v=>Number.isInteger(v)?String(v):v.toFixed(2);
  const sum=x.reduce((a,b)=>a+b,0);
  const lines=[
    ['Average (mean): '+f(mean),'Add all '+n+' numbers (the total is '+f(sum)+') and divide by '+n+'.'],
    ['Middle (median): '+f(med),'Put the numbers in order. This is the one in the middle.'],
    ['Most common (mode): '+(mx===1?'none':mode),mx===1?'Every number appears only once.':'It appears '+mx+' times.'],
    ['Range: '+f(x[n-1]-x[0]),'The gap between the smallest ('+f(x[0])+') and the biggest ('+f(x[n-1])+').'],
    ['Spread (standard deviation): '+f(sd),'About how far the numbers usually are from the average. A small number means they are close together.']];
  const W=Math.max(300,Math.min(640,n*48+40)),H=200,top=26,bot=28,ch=H-top-bot;
  const lo=Math.min(0,x[0]),hi=Math.max(0,x[n-1]),sp=(hi-lo)||1,Y=v=>top+(hi-v)/sp*ch;
  const step=(W-40)/n,bw=Math.max(2,Math.min(40,step-8));
  let svg='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Bar chart of your numbers with a dashed line at the average of '+f(mean)+'" style="max-width:100%;height:auto">';
  svg+='<line x1="10" x2="'+(W-10)+'" y1="'+Y(0)+'" y2="'+Y(0)+'" stroke="currentColor" stroke-width="1.5"/>';
  x.forEach((v,i)=>{const bx=20+i*step+(step-bw)/2,y0=Y(0),y1=Y(v);
    svg+='<rect x="'+bx+'" y="'+Math.min(y0,y1)+'" width="'+bw+'" height="'+Math.max(2,Math.abs(y1-y0))+'" rx="3" fill="#ff8a78"/>';
    if(n<=20)svg+='<text x="'+(bx+bw/2)+'" y="'+(v>=0?y1-5:y1+14)+'" text-anchor="middle" font-size="12" fill="currentColor">'+f(v)+'</text>'});
  svg+='<line x1="10" x2="'+(W-10)+'" y1="'+Y(mean)+'" y2="'+Y(mean)+'" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="7 5"/>';
  svg+='<text x="'+(W-12)+'" y="'+(Y(mean)-6)+'" text-anchor="end" font-size="13" font-weight="700" fill="#ffd166" style="paint-order:stroke;stroke:#04202e;stroke-width:3px">average '+f(mean)+'</text></svg>';
  o.innerHTML='';
  const chart=document.createElement('div');chart.className='scroll';chart.innerHTML=svg;o.appendChild(chart);
  const cap=document.createElement('div');cap.style.cssText='color:var(--muted);font-size:14px';cap.textContent='Each bar is one of your numbers, from smallest to largest. The dashed line is the average.';o.appendChild(cap);
  lines.forEach(([h,e])=>{const d=document.createElement('div');d.style.marginTop='10px';const b=document.createElement('b');b.textContent=h;const p=document.createElement('div');p.style.cssText='color:var(--muted);font-size:15px';p.textContent=e;d.append(b,p);o.appendChild(d)});
};
$('statGo').click();
function bits(){const n=Math.max(1,Math.min(1000000,parseInt($('bitN').value)||1));let b=0;while(Math.pow(2,b)<n)b++;b=Math.max(1,b);
  $('bitOut').textContent=n+' items need '+b+' bits, because 2^'+b+' = '+Math.pow(2,b)+', which is at least '+n+'.'}
$('bitGo').onclick=bits;bits();

// Dive design
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const zones=[['intro','Surface','0 m'],['patterns','Shell zone','10 m'],['logic','Glass bubbles','25 m'],['reasoning','Dive log','50 m'],['graphs','Island map','100 m'],['stats','Deep sea','200 m']];
zones.forEach(z=>{const a=document.createElement('a');a.href='#'+z[0];const s=document.createElement('span');s.textContent=z[1]+', '+z[2];a.appendChild(s);a.setAttribute('aria-label',z[1]+', '+z[2]+' deep');$('depth').appendChild(a)});
for(let i=0;i<12;i++){const b=document.createElement('span');b.className='bit';b.textContent=Math.random()<.5?'0':'1';b.style.cssText='left:'+(4+Math.random()*92)+'%;animation-duration:'+(8+Math.random()*8)+'s;animation-delay:-'+Math.random()*12+'s';$('bits').appendChild(b)}
const sw={p:false,q:false};
function swRender(){const o=$('op').value,r=ops[o](sw.p,sw.q);
  $('swP').textContent='p '+(sw.p?'on':'off');$('swQ').textContent='q '+(sw.q?'on':'off');
  $('swP').setAttribute('aria-pressed',sw.p);$('swQ').setAttribute('aria-pressed',sw.q);
  $('bulb').classList.toggle('lit',r);$('swOut').textContent=names[o]+' is '+(r?'true':'false')}
$('swP').onclick=()=>{sw.p=!sw.p;swRender()};$('swQ').onclick=()=>{sw.q=!sw.q;swRender()};
$('op').addEventListener('change',swRender);swRender();
const logLis=[...document.querySelectorAll('#logList li')];let logN=calm?4:1;
function logShow(){logLis.forEach((l,i)=>l.classList.toggle('done',i<logN))}
logShow();if(!calm)setInterval(()=>{logN=logN%4+1;logShow()},1800);

// Pages and navigation
const topics=[['intro','Introduction to Mathematics','What mathematics is, where it came from, and its role in technology.'],['patterns','Patterns and Numbers','Fibonacci, the Golden Ratio, and patterns in algorithms.'],['logic','Mathematical Language and Logic','Sets, Venn diagrams, and truth tables for programming decisions.'],['reasoning','Problem Solving and Reasoning','Polya’s 4 steps and reasoning that helps you debug.'],['graphs','Graphs and Networks','Vertices, edges, Euler circuits, and computer networks.'],['stats','Statistics and Data Analysis','Averages, spread, probability, and risk in data projects.']];
const pages=[['home','Home'],['about-us','About Us'],...topics.map(t=>[t[0],t[1]]),['glossary','Glossary'],['login','Log in']];
topics.forEach(t=>{const a=document.createElement('a');a.className='card';a.href='#'+t[0];
  const b=document.createElement('b');b.textContent=t[1];const s=document.createElement('span');s.textContent=t[2];
  a.append(b,s);$('cards').appendChild(a)});
topics.forEach((t,i)=>{return;const sec=$(t[0]);const p=document.createElement('div');p.className='pager';
  const prev=document.createElement('a');prev.className='btn alt';prev.href='#'+(i?topics[i-1][0]:'home');prev.textContent=i?'Back: '+topics[i-1][1]:'Back to home';
  const next=document.createElement('a');next.className='btn';next.href='#'+(i<topics.length-1?topics[i+1][0]:'home');next.textContent=i<topics.length-1?'Next: '+topics[i+1][1]:'Finish and return home';
  p.append(prev,next);sec.appendChild(p)});
function route(){
  let id=location.hash.slice(1);if(!pages.some(p=>p[0]===id))id='home';
  const authed=!!getUser();document.body.classList.toggle('authed',authed);
  if(!authed&&id!=='home'&&id!=='about-us'&&id!=='login'){wanted=id;id='login';showTab('login')}
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.title=(id==='home'?'':pages.find(p=>p[0]===id)[1]+' · ')+'Mathematics for Computing';
  window.scrollTo(0,0);
  const zi=zones.findIndex(z=>z[0]===id);
  document.body.classList.toggle('in-topic',zi>=0);
  document.documentElement.style.setProperty('--dark',zi>=0?zi*0.1:0);
  document.querySelectorAll('#depth a').forEach(a=>{if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
addEventListener('hashchange',route);route();
const oc=document.querySelector('.ocean');
for(let i=0;i<14;i++){const b=document.createElement('span');b.className='bub';const z=6+Math.random()*16;
  b.style.cssText='width:'+z+'px;height:'+z+'px;left:'+Math.random()*100+'%;animation-duration:'+(10+Math.random()*14)+'s;animation-delay:-'+Math.random()*20+'s';oc.appendChild(b)}
const jump=$('jump');
topics.forEach(t=>{const o=document.createElement('option');o.value=t[0];o.textContent=t[1];jump.appendChild(o)});
try{const last=localStorage.getItem('lastTopic');if(last)jump.value=last}catch(e){}
$('jumpGo').onclick=()=>{location.hash='#'+jump.value};
addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(topics.some(t=>t[0]===id)){try{localStorage.setItem('lastTopic',id)}catch(e){}}});

// ---- Extended content, quizzes and glossary ----
const h=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e};
const X={
intro:{terms:[['Bit','The smallest unit of data in a computer: 0 or 1.'],['Algorithm','A clear, step-by-step procedure for solving a problem.'],['Number theory','The branch of mathematics about whole numbers; it underlies encryption.']],
 ex:['Worked example: bits for 100 items','With 6 bits you get 2^6 = 64 codes, which is not enough. With 7 bits you get 2^7 = 128 codes, which covers 100 items. So 7 bits are needed.'],
 pr:[['How many bits are needed to give 1,000 items their own code?','10 bits, because 2^9 = 512 is too small and 2^10 = 1,024 is enough.'],['How many different items can 8 bits label?','2^8 = 256 items.']],
 quiz:[['How many bits are needed to give 50 items their own code?',['5','6','7','50'],1,'2^5 = 32 is too small, 2^6 = 64 is enough.'],['Whose algebra of logic became the basis of digital circuits?',['Euclid','Boole','Pascal','Euler'],1,'George Boole developed the algebra of logic that later guided digital circuit design.'],['Which area of mathematics underlies encryption?',['Number theory','Geometry','Statistics','Set drawing'],0,'Encryption relies on properties of whole numbers, especially primes.']]},
patterns:{terms:[['Fibonacci sequence','1, 1, 2, 3, 5, 8, ... where each term is the sum of the two before it.'],['Golden ratio','About 1.618; the ratio of consecutive Fibonacci numbers approaches it.'],['Symmetry','A shape or pattern that looks the same after a flip, turn or slide.'],['Recursion','A function that solves a problem by calling itself on a smaller one.']],
 ex:['Worked example: adding Fibonacci terms','The first 6 terms are 1, 1, 2, 3, 5, 8 and they add up to 20. The next term after 8 is 13, then 21. Notice 20 = 21 − 1: the sum of the first n terms is always the term two places later, minus 1.'],
 pr:[['What is the 10th term of 1, 1, 2, 3, 5, ...?','55. The terms are 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.'],['Write fib(n) as a recursive rule.','fib(n) = fib(n−1) + fib(n−2), with fib(1) = 1 and fib(2) = 1 as the base cases.']],
 quiz:[['What comes after 1, 1, 2, 3, 5, 8 in the Fibonacci sequence?',['11','12','13','16'],2,'5 + 8 = 13.'],['The ratio of consecutive Fibonacci numbers approaches which value?',['1','1.618','2','3.14'],1,'It approaches the golden ratio, about 1.618.'],['Which technique stores answers to overlapping subproblems so they are not recomputed?',['Dynamic programming','Sorting','Encryption','Compression'],0,'Dynamic programming reuses stored results, which makes Fibonacci fast.']]},
logic:{terms:[['Set','A group of different items, like {1, 2, 3}.'],['Union (A ∪ B)','Everything that is in A or in B.'],['Intersection (A ∩ B)','Only the items in both A and B.'],['Truth table','A table listing the result of a logical statement for every true/false input.'],['Connective','A word like AND, OR or IMPLIES that joins statements.']],
 ex:['Worked example: p IMPLIES q','Take "if it rains (p), I bring an umbrella (q)". The only way this promise is broken is when it rains and I bring no umbrella: p true, q false. In every other row the statement is true.'],
 pr:[['A = {a, b, c} and B = {c, d}. Find A ∩ B and A − B.','A ∩ B = {c} and A − B = {a, b}.'],['What is p AND q when p is true and q is false?','False. AND needs both to be true.']],
 quiz:[['If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, how many items are in A ∪ B?',['4','6','8','2'],1,'The union is {1, 2, 3, 4, 5, 6}, which has 6 items.'],['When is p IMPLIES q false?',['p false, q true','p true, q false','both true','both false'],1,'Only when p is true and q is false.'],['When is p XOR q true?',['When both are true','When both are false','When exactly one is true','Always'],2,'XOR means one or the other, but not both.']]},
reasoning:{terms:[['Polya’s 4 steps','Understand the problem, make a plan, carry out the plan, look back.'],['Inductive reasoning','Concluding a general rule from examples. It is likely, not certain.'],['Deductive reasoning','Concluding from rules that are known to be true. It is certain if the rules hold.'],['Heuristic','A rule of thumb that usually helps, such as testing a smaller input.'],['Loop invariant','A fact that stays true on every pass through a loop.']],
 ex:['Worked example: a crashing average function','Report: average([]) crashes. Understand: the input is an empty list and the code divides by its length, which is 0. Plan: add a check for an empty list. Carry out: return 0 (or an error message) when the list is empty. Look back: test [], [5] and [1, 2, 3], and keep the tests.'],
 pr:[['"The sort worked on 5 lists, so it is correct." Inductive or deductive?','Inductive. It generalizes from examples and could still fail on a list nobody tried.'],['Name one heuristic for finding a bug.','Test smaller inputs, trace by hand, or work backwards from the wrong output.']],
 quiz:[['What is the second step in Polya’s process?',['Understand the problem','Devise a plan','Carry out the plan','Look back'],1,'The order is understand, plan, carry out, look back.'],['A function works on three test inputs, so you conclude it is correct. This is:',['Deductive reasoning','Inductive reasoning','A proof','A loop invariant'],1,'Generalizing from examples is inductive.'],['Showing a loop invariant holds and the loop ends so the result is correct is:',['Deductive reasoning','Inductive reasoning','Guessing','A heuristic'],0,'It follows by logic from facts that are known to hold.']]},
graphs:{terms:[['Vertex','A point or node in a graph.'],['Edge','A line joining two vertices.'],['Degree','The number of edges touching a vertex.'],['Euler circuit','A walk that uses every edge once and ends where it started.'],['Hamiltonian circuit','A cycle that visits every vertex exactly once.']],
 ex:['Worked example: the default graph','Edges A-B, B-C, C-D, D-A, A-C give degrees A = 3, B = 2, C = 3, D = 2. The sum is 10, which is twice the 5 edges. Exactly two vertices (A and C) are odd, so an Euler path exists from A to C but not an Euler circuit.'],
 pr:[['A triangle has 3 vertices all joined to each other. Is there an Euler circuit?','Yes. Every vertex has degree 2 (even) and the graph is connected.'],['The path A-B-C has edges A-B and B-C. Euler path or circuit?','An Euler path from A to C (A and C have degree 1), but no circuit.']],
 quiz:[['An Euler circuit exists when the graph is connected and:',['every vertex has even degree','every vertex has odd degree','it has no edges','it has 4 vertices'],0,'All degrees must be even.'],['The Königsberg landmasses have degrees 3, 3, 5, 3. Is there a walk crossing each bridge once?',['Yes, a circuit','Yes, a path','No','Only from A'],2,'Four vertices are odd, and at most two are allowed for an Euler path.'],['The sum of all degrees in a graph equals:',['the number of vertices','the number of edges','twice the number of edges','zero'],2,'Each edge adds 1 to the degree of both its ends.']]},
stats:{terms:[['Mean','The average: the total divided by how many numbers there are.'],['Median','The middle value once the numbers are in order.'],['Mode','The value that appears most often.'],['Standard deviation','About how far values typically sit from the mean.'],['Probability','A number from 0 to 1 saying how likely an event is.']],
 ex:['Worked example: 12, 15, 15, 18, 22, 30','The total is 112 and there are 6 numbers, so the mean is 112 ÷ 6 ≈ 18.67. The middle two values are 15 and 18, so the median is 16.5. The mode is 15 (it appears twice). The range is 30 − 12 = 18.'],
 pr:[['What is the mode of 2, 3, 3, 5, 7?','3, because it appears twice.'],['What is the range of 4, 9, 15?','15 − 4 = 11.']],
 quiz:[['What is the mean of 2, 4, 6, 8?',['4','5','6','20'],1,'Total 20 divided by 4 numbers is 5.'],['What is the median of 7, 1, 9, 3, 5, 11?',['5','6','7','9'],1,'Sorted: 1, 3, 5, 7, 9, 11. The middle two are 5 and 7, so the median is 6.'],['Which measure describes how spread out the data is?',['Mode','Median','Standard deviation','Total'],2,'Standard deviation measures spread around the mean.']]}
};
const names2={intro:'Introduction to Mathematics',patterns:'Patterns and Numbers',logic:'Mathematical Language and Logic',reasoning:'Problem Solving and Reasoning',graphs:'Graphs and Networks',stats:'Statistics and Data Analysis'};
function bestKey(id){return 'best-'+id}
Object.keys(X).forEach(id=>{
  const d=X[id],sec=$(id),box=h('div',null,'extra');
  const cols=h('div',null,'cols');
  const left=h('div');left.appendChild(h('h3','Key terms'));
  const dl=h('dl');d.terms.forEach(([t,x])=>{dl.appendChild(h('dt',t));dl.appendChild(h('dd',x))});left.appendChild(dl);
  const right=h('div','','tool');right.removeChild&&0;
  right.appendChild(h('h3',d.ex[0]));right.appendChild(h('p',d.ex[1]));
  right.appendChild(h('h3','Practice problems'));
  d.pr.forEach(([q,a],i)=>{const de=h('details');de.appendChild(h('summary',(i+1)+'. '+q));de.appendChild(h('p','Answer: '+a,'ans'));right.appendChild(de)});
  cols.append(left,right);box.appendChild(cols);
  const qz=h('div',null,'tool quiz');qz.style.marginTop='20px';
  qz.appendChild(h('h3','Quiz: '+names2[id]));
  const form=h('div');
  d.quiz.forEach(([q,opts,ci,why],qi)=>{
    const fs=h('fieldset'),lg=h('legend',(qi+1)+'. '+q);fs.appendChild(lg);
    opts.forEach((o,oi)=>{const lb=h('label',null,'opt');const r=document.createElement('input');r.type='radio';r.name=id+'-q'+qi;r.value=oi;lb.append(r,document.createTextNode(o));fs.appendChild(lb)});
    fs.appendChild(h('div','','fb'));form.appendChild(fs)});
  qz.appendChild(form);
  const chk=h('button','Check answers'),rst=h('button','Try again','alt'),res=h('div','','out');res.setAttribute('aria-live','polite');
  const best=h('div','','best');
  try{const b=localStorage.getItem(bestKey(id));if(b)best.textContent='Best score on this device: '+b+' / '+d.quiz.length}catch(e){}
  chk.onclick=()=>{let score=0,unanswered=0;
    [...form.children].forEach((fs,qi)=>{const ci=d.quiz[qi][2],sel=fs.querySelector('input:checked');
      fs.querySelectorAll('.opt').forEach(l=>l.classList.remove('right','wrong'));
      const fb=fs.querySelector('.fb');
      if(!sel){unanswered++;fb.textContent='Choose an answer.';return}
      const ok=+sel.value===ci;if(ok)score++;
      fs.querySelectorAll('.opt')[ci].classList.add('right');
      if(!ok)sel.parentElement.classList.add('wrong');
      fb.textContent=(ok?'Correct. ':'Not quite. ')+d.quiz[qi][3]});
    res.textContent=unanswered?'Answer all '+d.quiz.length+' questions to see your score.':'You scored '+score+' out of '+d.quiz.length+'.';
    if(!unanswered){try{const b=+localStorage.getItem(bestKey(id))||0;if(score>=b){localStorage.setItem(bestKey(id),score);best.textContent='Best score on this device: '+score+' / '+d.quiz.length}}catch(e){}}};
  rst.onclick=()=>{form.querySelectorAll('input').forEach(i=>i.checked=false);form.querySelectorAll('.opt').forEach(l=>l.classList.remove('right','wrong'));form.querySelectorAll('.fb').forEach(f=>f.textContent='');res.textContent=''};
  qz.append(chk,rst,res,best);box.appendChild(qz);
  sec.appendChild(box);
});
// Glossary
(function(){
  const all=[];Object.keys(X).forEach(id=>X[id].terms.forEach(([t,x])=>all.push([t,x,id])));
  all.push(['Venn diagram','A picture of sets as overlapping circles.','logic']);
  all.sort((a,b)=>a[0].localeCompare(b[0]));
  const dl=$('glList');
  all.forEach(([t,x,id])=>{dl.appendChild(h('dt',t));const dd=h('dd',x+' ');const a=h('a','See '+names2[id]);a.href='#'+id;dd.appendChild(a);dl.appendChild(dd)});
  const c=h('a',null,'card');c.href='#glossary';c.append(h('b','Glossary'),h('span','Every key term from the six topics in one place, A to Z.'));$('cards').appendChild(c);
})();

// ---- Login and accounts (demo, front-end only) ----
var memUser='',memAccts=[],wanted;
function getUser(){let u='';try{u=localStorage.getItem('mfcUser')||''}catch(e){}return u||memUser}
function setUser(n){memUser=n;try{if(n)localStorage.setItem('mfcUser',n);else localStorage.removeItem('mfcUser')}catch(e){}}
function getAccts(){try{const a=JSON.parse(localStorage.getItem('mfcAccts')||'null');if(Array.isArray(a))return a}catch(e){}return memAccts}
function saveAccts(a){memAccts=a;try{localStorage.setItem('mfcAccts',JSON.stringify(a))}catch(e){}}
function showTab(t){const su=t==='signup';
  $('tabLogin').setAttribute('aria-selected',!su);$('tabSignup').setAttribute('aria-selected',su);
  $('panelLogin').hidden=su;$('panelSignup').hidden=!su;$('loginMsg').textContent='';$('suMsg').textContent=''}
$('tabLogin').onclick=()=>showTab('login');$('tabSignup').onclick=()=>showTab('signup');
$('toSignup').onclick=()=>showTab('signup');$('toLogin').onclick=()=>showTab('login');
$('heroSignup').addEventListener('click',()=>showTab('signup'));
$('heroLogin').addEventListener('click',()=>{if(!getUser())showTab('login')});
document.querySelector('.nav .loginbtn').addEventListener('click',()=>{if(!getUser())showTab('login')});
function renderAuth(){
  const u=getUser(),nb=document.querySelector('.nav .loginbtn'),hb=$('heroLogin'),wb=document.querySelector('.welcome h3');
  nb.textContent=u?'Log out':'Login';nb.setAttribute('href',u?'#home':'#login');
  hb.textContent=u?'Log out':'Log in';hb.setAttribute('href',u?'#home':'#login');
  $('newHere').hidden=!!u;
  wb.textContent=u?'Welcome back, '+u:'Welcome back';document.body.classList.toggle('authed',!!u);
}
[document.querySelector('.nav .loginbtn'),$('heroLogin')].forEach(a=>a.addEventListener('click',e=>{
  if(getUser()){e.preventDefault();setUser('');renderAuth();if(location.hash==='#home')route();else location.hash='#home'}}));
function goAfter(){const t='#'+(wanted||'home');wanted=undefined;if(location.hash===t)route();else location.hash=t}
function doLogin(){
  const n=$('loginName').value.trim(),m=$('loginMsg');
  if(!n||!$('loginPass').value){m.textContent='Enter your name or email and your password.';return}
  const k=n.toLowerCase(),acc=getAccts().find(a=>a.email.toLowerCase()===k||a.name.toLowerCase()===k);
  setUser(acc?acc.name:n);$('loginPass').value='';renderAuth();goAfter()}
function doSignup(){
  const name=$('suName').value.trim(),email=$('suEmail').value.trim(),p1=$('suPass').value,p2=$('suPass2').value,m=$('suMsg');
  if(!name){m.textContent='Enter your full name.';return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){m.textContent='Enter a valid email address.';return}
  if(p1.length<6){m.textContent='Use a password with at least 6 characters.';return}
  if(p1!==p2){m.textContent='The two passwords do not match.';return}
  const list=getAccts();
  if(list.some(a=>a.email.toLowerCase()===email.toLowerCase())){m.textContent='That email already has an account on this device. Try logging in.';return}
  list.push({name:name,email:email});saveAccts(list);
  setUser(name);['suName','suEmail','suPass','suPass2'].forEach(id=>$(id).value='');renderAuth();goAfter()}
$('loginGo').addEventListener('click',doLogin);$('suGo').addEventListener('click',doSignup);
[['loginName',doLogin],['loginPass',doLogin],['suName',doSignup],['suEmail',doSignup],['suPass',doSignup],['suPass2',doSignup]].forEach(([id,f])=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();f()}}));
renderAuth();

// ---- Home summary card (shown before login) ----
(function(){
  const lv=[['Introduction','Surface',0,'What mathematics is and why computers need it'],['Patterns','Shell zone',10,'Fibonacci, the golden ratio and recursion'],['Logic','Glass bubbles',25,'Sets and truth tables behind every if statement'],['Reasoning','Dive log',50,'Polya’s steps for finding and fixing bugs'],['Graphs','Island map',100,'Networks, Euler circuits and the Königsberg puzzle'],['Statistics','Deep sea',200,'Turn raw numbers into the story in the data']];
  const terms=$('glList').children.length/2,qs=Object.keys(X).reduce((n,k)=>n+X[k].quiz.length,0);
  const box=$('summary');
  box.appendChild(h('h3','Your dive at a glance'));
  box.appendChild(h('p','From a single bit to the deep sea of data.','tag'));
  const st=h('div',null,'stats4');
  [[lv.length,'topics'],[6,'tools'],[qs,'questions'],[terms,'terms']].forEach(([n,t])=>{const d=h('div');d.append(h('b',String(n)),h('span',t));st.appendChild(d)});
  box.appendChild(st);
  const ol=h('ul',null,'dives');
  lv.forEach((l,i)=>{const li=h('li');li.style.setProperty('--i',i);
    const r=h('div',null,'row');r.append(h('b',l[0]),h('i',l[1]+' · '+l[2]+' m'));
    const b=h('div',null,'bar2');const e=document.createElement('em');e.style.width=Math.max(4,l[2]/2)+'%';b.appendChild(e);
    li.append(r,h('small',l[3]),b);ol.appendChild(li)});
  box.appendChild(ol);
})();
