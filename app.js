const $ = (id) => document.getElementById(id);
const fields = ["businessName","businessType","businessBio","whatsapp","location","services","website"];
const defaults = {businessName:"Your Business Name",businessType:"YOUR BUSINESS CATEGORY",businessBio:"Your introduction will appear here. Tell customers what you do and why they should choose you.",location:"Add your location",services:"Your services"};
let generated = false;

function cleanPhone(value){return value.replace(/\D/g,"");}
function updatePreview(){
  const name = $("businessName").value.trim() || defaults.businessName;
  const type = $("businessType").value.trim() || defaults.businessType;
  const bio = $("businessBio").value.trim() || defaults.businessBio;
  const location = $("location").value.trim() || defaults.location;
  const services = $("services").value.split(",").map(s=>s.trim()).filter(Boolean).slice(0,8);
  $("previewName").textContent = name;
  $("previewType").textContent = type.toUpperCase();
  $("previewBio").textContent = bio;
  $("previewLocation").innerHTML = "⌖ <span></span>";
  $("previewLocation").querySelector("span").textContent = location;
  $("previewMonogram").textContent = name === defaults.businessName ? "B" : name.charAt(0).toUpperCase();
  $("bioCount").textContent = $("businessBio").value.length;
  const serviceBox = $("previewServices");
  serviceBox.replaceChildren();
  (services.length ? services : [defaults.services]).forEach(service=>{
    const tag = document.createElement("span"); tag.textContent = service; serviceBox.appendChild(tag);
  });
  const phone = cleanPhone($("whatsapp").value);
  const wa = $("previewWhatsapp");
  wa.href = phone.length >= 10 ? "https://wa.me/" + phone : "#";
  wa.setAttribute("aria-label", phone.length >= 10 ? "Contact on WhatsApp" : "Add a valid WhatsApp number");
  const site = $("previewWebsite");
  const url = $("website").value.trim();
  site.href = url || "#";
  site.style.display = url ? "block" : "none";
  if(generated) buildShareKit();
}
fields.forEach(id=>$(id).addEventListener("input",updatePreview));

function buildShareKit(){
  const name = $("businessName").value.trim();
  if(!name){return;}
  const url = window.location.href.split("#")[0] + "#builder";
  const share = $("sharePanel");
  share.classList.add("generated");
  share.innerHTML = "";
  const copyArea = document.createElement("div"); copyArea.className = "share-copy";
  copyArea.innerHTML = '<span class="step-label">03 / YOUR SHARE KIT</span><h3>Ready to be discovered.</h3><p>Your profile preview is ready. Deploy this page to give customers a public link.</p>';
  const link = document.createElement("div"); link.className="share-link"; link.textContent=url; copyArea.appendChild(link);
  const actions = document.createElement("div"); actions.className="share-actions";
  const copy = document.createElement("button"); copy.className="small-action"; copy.textContent="Copy page link";
  copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(url);copy.textContent="Copied!";}catch(e){copy.textContent="Copy unavailable";}});
  const shareBtn = document.createElement("button"); shareBtn.className="small-action"; shareBtn.textContent="Share profile";
  shareBtn.addEventListener("click",async()=>{if(navigator.share){try{await navigator.share({title:name+" | LINKMATE AI",text:"Check out "+name,url});}catch(e){}}else{copy.click();}});
  actions.append(copy,shareBtn);copyArea.appendChild(actions);
  const qr = document.createElement("div");qr.className="qr-wrap";
  const img=document.createElement("img");img.alt="QR code for the current LINKMATE AI page";img.src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+encodeURIComponent(url);qr.appendChild(img);
  share.append(copyArea,qr);
}
$("businessForm").addEventListener("submit",event=>{
  event.preventDefault();
  if(!$("businessName").value.trim()){ $("businessName").focus(); return; }
  generated=true;
  buildShareKit();
  $("sharePanel").scrollIntoView({behavior:"smooth",block:"nearest"});
});
updatePreview();