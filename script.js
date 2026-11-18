(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var KEY="reliefrelay-v1",BASE={la:17.425,lo:78.45},NEEDMAP={BOAT:"Rescue Boat",MED:"Medical Aid",WATER:"Drinking Water",FOOD:"Food Packets"};
var ALERTS=["⚠️ RED ALERT: Musi river crest at 6.8 m, rising 0.3 m/hr","Mandatory evacuation for Riverside, Lower Basin and Green Lane wards","Relief boats staged at North High School camp","Avoid underpasses and low bridges · Stay on rooftops, do not enter flowing water"];
var NAMES=[["Rooftop, Riverside 12","Rescue Boat",5,17.4350,78.4380],["Green Lane 4","Rescue Boat",4,17.4320,78.4450],["Old Bridge Colony","Medical Aid",2,17.4280,78.4620],["Lower Basin Tower B","Food Packets",9,17.4190,78.4710],["Market Road","Rescue Boat",6,17.4410,78.4260],["Temple Street","Drinking Water",7,17.4120,78.4520],["Canal View Flats","Medical Aid",3,17.4390,78.4540],["Lakeside Hut Cluster","Rescue Boat",11,17.4230,78.4330],["Station Road","Food Packets",4,17.4450,78.4660],["School Lane 2","Drinking Water",8,17.4160,78.4310],["Mill Compound","Medical Aid",1,17.4340,78.4750],["East Gate Colony","Food Packets",12,17.4260,78.4800],["Tank Bund Road","Rescue Boat",3,17.4080,78.4640],["Garden Villas","Drinking Water",5,17.4470,78.4400]];
var CAMPS=[["North High School",17.4440,78.4500,200,138,60,70,40],["Community Hall A",17.4150,78.4400,120,112,25,30,20],["St. Mary’s Church",17.4300,78.4780,150,60,90,80,60],["Govt Junior College",17.4090,78.4750,180,95,45,55,35],["Sports Arena",17.4380,78.4300,250,70,85,90,75]];
var S=load();
function seed(){return {b:NAMES.map(function(n,i){return{id:"SOS-"+(i<9?"0":"")+(i+1),nm:n[0],need:n[1],hc:n[2],la:n[3],lo:n[4],ph:"98"+(10000000+i*7654321).toString().slice(0,8),st:"open",team:"",camp:""}}),
 c:CAMPS.map(function(c,i){return{id:i,nm:c[0],la:c[1],lo:c[2],cap:c[3],occ:c[4],water:c[5],rations:c[6],jackets:c[7]}}),q:[],mine:"",n:15}}
function load(){try{var d=JSON.parse(localStorage.getItem(KEY));if(d&&d.b)return d}catch(e){}return seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function esc(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML}
function urg(b){var n=b.need;return n.indexOf("Rescue Boat")>-1?"red":n.indexOf("Medical")>-1?"org":"yel"}
function xy(la,lo){return[(lo-78.40)*1000,(17.46-la)*1000]}
function dist(a,b,c,d){var x=(d-b)*105,y=(c-a)*111;return Math.sqrt(x*x+y*y)}
function show(el,t){el.textContent=t;el.style.display="block"}
var STAT={open:"Open - Awaiting Team",assigned:"Assigned - Team En Route",done:"Rescued - Transferred"};

function renderStats(){var o=S.b.filter(function(b){return b.st=="open"}).length,a=S.b.filter(function(b){return b.st=="assigned"}).length,d=S.b.filter(function(b){return b.st=="done"}).length,free=S.c.reduce(function(s,c){return s+c.cap-c.occ},0);
$("#stats").innerHTML='<div class="stat"><b>'+o+'</b>Open SOS</div><div class="stat"><b>'+a+'</b>En route</div><div class="stat"><b>'+d+'</b>Rescued</div><div class="stat"><b>'+free+'</b>Free beds</div><div class="stat"><b>'+S.q.length+'</b>Queued offline</div>'}

function renderMap(){var h='<path d="M0 8 C20 14,30 4,48 20 S72 34,100 30 L100 38 C74 42,52 30,40 28 S12 22,0 16Z" fill="var(--river)" opacity=".85"/><path d="M8 60 C20 48,30 44,36 34" stroke="var(--river)" stroke-width="3" fill="none" opacity=".6"/>';
S.c.forEach(function(c){var p=xy(c.la,c.lo);h+='<rect class="camp" x="'+(p[0]-1.6)+'" y="'+(p[1]-1.6)+'" width="3.2" height="3.2"><title>'+esc(c.nm)+'</title></rect><text x="'+(p[0]+2.4)+'" y="'+(p[1]+.8)+'" font-size="2.2" fill="var(--ink)">'+esc(c.nm)+'</text>'});
S.b.forEach(function(b){var p=xy(b.la,b.lo),cl=b.st=="done"?"done":urg(b),fl=b.st=="open"&&cl=="red"?" flash":"";
h+='<circle class="pin '+cl+fl+'" data-id="'+b.id+'" tabindex="0" role="button" aria-label="'+b.id+' '+esc(b.need)+'" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(b.st=="done"?1.2:1.9)+'"/>'});
$("#svg").innerHTML=h}
function pinInfo(id){var b=S.b.filter(function(x){return x.id==id})[0];if(!b)return;
$("#pininfo").textContent=b.id+" · "+b.nm+" · "+b.hc+" people · "+b.need+" · "+STAT[b.st]+(b.team?" ("+b.team+")":"")+" · Call "+b.ph}

function renderCamps(){var g="";S.c.forEach(function(c){function bar(v,m){var p=Math.min(100,Math.round(v/m*100));return'<div class="bar"><i class="'+(p<30?"d":p<55?"w":"")+'" style="width:'+p+'%"></i></div>'}
var occ=Math.round(c.occ/c.cap*100);
g+='<div class="camp-c"><h3>'+esc(c.nm)+'</h3><div class="m"><span>Beds</span><span>'+c.occ+' / '+c.cap+' ('+occ+'%)</span></div><div class="bar"><i class="'+(occ>90?"d":occ>75?"w":"")+'" style="width:'+occ+'%"></i></div>'
+'<div class="m"><span>Water</span><span>'+c.water+'</span></div>'+bar(c.water,100)+'<div class="m"><span>Dry rations</span><span>'+c.rations+'</span></div>'+bar(c.rations,100)+'<div class="m"><span>Life jackets</span><span>'+c.jackets+'</span></div>'+bar(c.jackets,100)+'</div>'});
$("#campgrid").innerHTML=g;
var low=S.c.slice().sort(function(a,b){return Math.min(a.water,a.rations,a.jackets)-Math.min(b.water,b.rations,b.jackets)});
$("#pc").innerHTML=low.map(function(c,i){return'<option value="'+c.id+'">'+esc(c.nm)+(i==0?" (most undersupplied)":"")+'</option>'}).join("")}

function suggestCamp(b){var c=S.c.filter(function(c){return c.cap-c.occ>=b.hc}).sort(function(x,y){return dist(b.la,b.lo,x.la,x.lo)-dist(b.la,b.lo,y.la,y.lo)});return c}
function renderBoard(){var all=$("#flt").value=="all",rk={red:0,org:1,yel:2};
var list=S.b.filter(function(b){return all||b.st!="done"}).sort(function(a,b){var s={open:0,assigned:1,done:2};return s[a.st]-s[b.st]||rk[urg(a)]-rk[urg(b)]||dist(BASE.la,BASE.lo,a.la,a.lo)-dist(BASE.la,BASE.lo,b.la,b.lo)});
$("#jobs").innerHTML=list.map(function(b){var d=dist(BASE.la,BASE.lo,b.la,b.lo).toFixed(1),dup=S.b.some(function(o){return o.id!=b.id&&Math.abs(o.la-b.la)<.0003&&Math.abs(o.lo-b.lo)<.0003}),a="";
if(b.st=="open")a='<button class="btn sm" data-claim="'+b.id+'">Claim Mission</button>';
else if(b.st=="assigned"){a='<select data-camp="'+b.id+'" aria-label="Relief camp">'+suggestCamp(b).map(function(c){return'<option value="'+c.id+'">'+esc(c.nm)+'</option>'}).join("")+'</select><button class="btn sm alt" data-done="'+b.id+'">Mark safely transferred</button>'}
return'<div class="job '+(b.st=="done"?"done":urg(b))+'"><div class="top"><span>'+b.id+' · '+esc(b.nm)+'</span><span class="badge">'+STAT[b.st]+'</span></div><div>'+b.hc+' people · '+esc(b.need)+' · '+d+' km from base · ☎ '+esc(b.ph)+'</div>'+(dup?'<span class="badge flag">⚠ Possible duplicate GPS</span>':"")+(b.team?'<div class="badge">'+esc(b.team)+(b.st=="assigned"?" · ETA 15 min":"")+(b.camp?" → "+esc(b.camp):"")+'</div>':"")+'<div class="acts">'+a+'</div></div>'}).join("")||"<p>No missions.</p>"}

function renderTrack(){var b=S.b.filter(function(x){return x.id==S.mine})[0];
$("#track").textContent=!b?"No SOS sent from this device yet.":b.st=="open"?b.id+": SOS received. Waiting for a rescue team.":b.st=="assigned"?b.id+": Rescue Team En Route (ETA 15 mins) · "+b.team:b.id+": You are safe. Transferred to "+b.camp+"."}
function all(){renderStats();renderMap();renderCamps();renderBoard();renderTrack();save()}

function addSOS(o){var dup=S.b.some(function(x){return Math.abs(x.la-o.la)<.0003&&Math.abs(x.lo-o.lo)<.0003});
var b={id:"SOS-"+(S.n<10?"0":"")+S.n++,nm:o.nm,need:o.need,hc:o.hc,la:o.la,lo:o.lo,ph:o.ph,st:"open",team:"",camp:""};S.b.push(b);S.mine=b.id;all();return{b:b,dup:dup}}
function flush(){if(!navigator.onLine||$("#off").checked||!S.q.length)return;var n=S.q.length;S.q.forEach(addSOS);S.q=[];all();show($("#sosmsg"),"Back online: "+n+" queued SOS request(s) synced.")}
function netState(){var off=!navigator.onLine||$("#off").checked;$("#net").textContent=off?"OFFLINE":"ONLINE";$("#net").style.background=off?"#6b7280":"var(--red)";if(!off)flush()}

// offline toggle for demo
var tg=document.createElement("label");tg.style.cssText="color:#fff;font-size:.8rem;margin:0;display:flex;gap:4px;align-items:center;font-weight:500";tg.innerHTML='<input type="checkbox" id="off"> Simulate offline';$("header").insertBefore(tg,$("#theme"));

$("#sosf").addEventListener("submit",function(e){e.preventDefault();
var needs=[].slice.call(document.querySelectorAll("#needs input:checked")).map(function(i){return i.value}),la=parseFloat($("#la").value),lo=parseFloat($("#lo").value),hc=parseInt($("#hc").value,10),ph=$("#ph").value.trim(),m=$("#sosmsg");
if(!needs.length)return show(m,"Select at least one critical need.");
if(isNaN(la)||isNaN(lo)||la<17.4||la>17.46||lo<78.4||lo>78.5)return show(m,"Demo map covers lat 17.40–17.46, lng 78.40–78.50.");
if(!hc||hc<1||ph.length<8)return show(m,"Headcount and a valid phone number are required.");
var o={nm:$("#nm").value.trim(),need:needs.join(", "),hc:hc,la:la,lo:lo,ph:ph};
if(!navigator.onLine||$("#off").checked){S.q.push(o);all();return show(m,"No signal. SOS saved on this device and will send automatically when you’re back online.")}
var r=addSOS(o);show(m,r.b.id+" broadcast."+(r.dup?" Flagged: another request exists at the same GPS point.":" Rescue teams have been alerted."));$("#sosf").reset();$("#hc").value=1;$("#la").value="17.4300";$("#lo").value="78.4500"});

$("#gps").addEventListener("click",function(){if(!navigator.geolocation)return show($("#sosmsg"),"GPS not available on this device.");
navigator.geolocation.getCurrentPosition(function(p){$("#la").value=p.coords.latitude.toFixed(4);$("#lo").value=p.coords.longitude.toFixed(4);show($("#sosmsg"),"GPS captured. Note: the demo map only shows lat 17.40–17.46, lng 78.40–78.50.")},function(){show($("#sosmsg"),"Couldn’t read GPS. Enter coordinates manually.")})});

$("#svg").addEventListener("click",function(e){if(e.target.dataset.id)pinInfo(e.target.dataset.id)});
$("#svg").addEventListener("keydown",function(e){if((e.key=="Enter"||e.key==" ")&&e.target.dataset.id){e.preventDefault();pinInfo(e.target.dataset.id)}});

$("#jobs").addEventListener("click",function(e){var t=e.target,id=t.dataset.claim||t.dataset.done;if(!id)return;var b=S.b.filter(function(x){return x.id==id})[0];
if(t.dataset.claim){if(b.st!="open")return all(); // atomic: only an open beacon can be claimed
b.st="assigned";b.team=$("#team").value}
else{var c=S.c.filter(function(x){return x.id==$('[data-camp="'+id+'"]').value})[0];if(!c||c.cap-c.occ<b.hc)return alert("That camp lacks free beds.");c.occ+=b.hc;b.st="done";b.camp=c.nm}
all()});
$("#flt").addEventListener("change",renderBoard);

$("#plf").addEventListener("submit",function(e){e.preventDefault();var c=S.c.filter(function(x){return x.id==$("#pc").value})[0],k=$("#pi").value,q=parseInt($("#pq").value,10);if(!c||!q)return;c[k]+=q;all();show($("#plmsg"),"Thank you, "+$("#pg").value.trim()+". "+q+" units added to "+c.nm+".");$("#plf").reset()});

$("#smsf").addEventListener("submit",function(e){e.preventDefault();var p=$("#smst").value.trim().toUpperCase().split(/\s+/),m=$("#smsmsg");
if(p[0]!="SOS"||p.length<6||!NEEDMAP[p[2]])return show(m,"Format: SOS <headcount> <BOAT|MED|WATER|FOOD> <lat> <lng> <phone>");
var la=parseFloat(p[3]),lo=parseFloat(p[4]),hc=parseInt(p[1],10);if(!hc||isNaN(la)||isNaN(lo)||la<17.4||la>17.46||lo<78.4||lo>78.5)return show(m,"Invalid headcount or coordinates (demo range lat 17.40–17.46, lng 78.40–78.50).");
var r=addSOS({nm:"SMS report",need:NEEDMAP[p[2]],hc:hc,la:la,lo:lo,ph:p[5]});show(m,"SMS accepted as "+r.b.id+(r.dup?" (flagged: duplicate GPS)":"")+".");$("#smsf").reset()});

$("#theme").addEventListener("click",function(){var r=document.documentElement,d=r.dataset.theme=="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark"});
$("#alerts").textContent=ALERTS.join("   •   ");
$("#off").addEventListener("change",netState);addEventListener("online",netState);addEventListener("offline",netState);
all();netState();
})();
