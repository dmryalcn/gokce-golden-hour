const Security = {

sanitizeText(value){

return String(value ?? "")
.replace(/[<>]/g,"")
.replace(/javascript:/gi,"")
.replace(/onerror=/gi,"")
.replace(/onload=/gi,"")
.trim();

},

escapeHTML(value){

return String(value ?? "")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#39;");

},

validateName(name){

const clean =
this.sanitizeText(name);

if(clean.length < 2)
throw new Error("İsim çok kısa");

if(clean.length > 60)
throw new Error("İsim çok uzun");

return clean;

},

validateMessage(message){

const clean =
this.sanitizeText(message);

if(clean.length > 400)
throw new Error(
"Mesaj en fazla 400 karakter olabilir"
);

return clean;

},

isSafeCloudinaryUrl(url){

try{

const parsed =
new URL(url);

return (
parsed.protocol === "https:" &&
parsed.hostname.endsWith("cloudinary.com")
);

}catch{

return false;

}

},

validateFile(file){

const allowed = [

"image/jpeg",
"image/png",
"image/webp",

"video/mp4",
"video/webm",

"audio/webm"

];

if(
!allowed.includes(file.type)
){

throw new Error(
"Desteklenmeyen dosya türü"
);

}

return true;

},

safeText(element,value){

if(!element) return;

element.textContent =
String(value ?? "");

},

canSubmit(key,seconds=15){

const now = Date.now();

const last =
Number(
localStorage.getItem(key)
);

if(
last &&
(now-last) <
(seconds*1000)
){

return false;

}

localStorage.setItem(
key,
now
);

return true;

}

};

export default Security;
