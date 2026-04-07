const fs = require('fs');
const path = require('path');
const dir = "c:\\Users\\Al Habib Trade\\Desktop\\sep-mern\\client\\src\\components";
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
let changed = 0;
files.forEach(f => {
  let p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  let orig = c;
  
  c = c.replace(/from-yellow-[0-9]+/g, 'from-cyan-400');
  c = c.replace(/via-orange-[0-9]+/g, 'via-blue-500');
  c = c.replace(/to-orange-[0-9]+/g, 'to-blue-500');
  c = c.replace(/to-red-[0-9]+/g, 'to-indigo-500');
  
  c = c.replace(/shadow-yellow-[0-9]+\/[0-9]+/g, 'shadow-cyan-500/30');
  c = c.replace(/shadow-orange-[0-9]+\/[0-9]+/g, 'shadow-cyan-500/30');
  
  c = c.replace(/shadow-\[0_0_25px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_25px_rgba(34,211,238,0.4)]');
  c = c.replace(/shadow-\[0_0_30px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_30px_rgba(34,211,238,0.4)]');
  c = c.replace(/shadow-\[0_0_35px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_35px_rgba(34,211,238,0.4)]');
  
  c = c.replace(/border-yellow-[0-9]+\/[0-9]+/g, 'border-cyan-500/30');
  c = c.replace(/border-orange-[0-9]+\/[0-9]+/g, 'border-cyan-500/30');
  
  c = c.replace(/text-yellow-[0-9]+/g, 'text-cyan-400');
  c = c.replace(/text-orange-[0-9]+/g, 'text-cyan-500');
  
  if(c !== orig) {
    fs.writeFileSync(p, c);
    changed++;
  }
});
console.log('Modified ' + changed + ' components');
