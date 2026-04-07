const fs = require('fs');
const path = require('path');
const dirs = [
  "c:\\Users\\Al Habib Trade\\Desktop\\sep-mern\\client\\src\\components",
  "c:\\Users\\Al Habib Trade\\Desktop\\sep-mern\\client\\src\\pages"
];

let changed = 0;
dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
  files.forEach(f => {
    let p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    let orig = c;
    
    // Gradients with Opacity
    c = c.replace(/from-yellow-[0-9]+\/[0-9]+/g, 'from-cyan-500/20');
    c = c.replace(/via-orange-[0-9]+\/[0-9]+/g, 'via-blue-500/20');
    c = c.replace(/to-orange-[0-9]+\/[0-9]+/g, 'to-blue-500/20');
    c = c.replace(/to-red-[0-9]+\/[0-9]+/g, 'to-indigo-500/20');
    
    c = c.replace(/from-purple-[0-9]+\/[0-9]+/g, 'from-cyan-500/20');
    c = c.replace(/via-yellow-[0-9]+\/[0-9]+/g, 'via-blue-500/20');

    // Gradients Solid
    c = c.replace(/from-yellow-[0-9]+/g, 'from-cyan-400');
    c = c.replace(/via-orange-[0-9]+/g, 'via-blue-500');
    c = c.replace(/to-orange-[0-9]+/g, 'to-blue-500');
    c = c.replace(/to-red-[0-9]+/g, 'to-indigo-500');
    
    c = c.replace(/from-purple-[0-9]+/g, 'from-cyan-400');
    c = c.replace(/via-yellow-[0-9]+/g, 'via-blue-500');
    
    // Background replacements
    c = c.replace(/bg-yellow-[0-9]+\/[0-9]+/g, 'bg-cyan-500/10');
    c = c.replace(/bg-yellow-[0-9]+/g, 'bg-cyan-500');
    c = c.replace(/bg-orange-[0-9]+\/[0-9]+/g, 'bg-blue-500/10');
    c = c.replace(/bg-orange-[0-9]+/g, 'bg-blue-500');
    
    // Shadow replacements
    c = c.replace(/shadow-yellow-[0-9]+\/[0-9]+/g, 'shadow-cyan-500/30');
    c = c.replace(/shadow-orange-[0-9]+\/[0-9]+/g, 'shadow-cyan-500/30');
    
    c = c.replace(/shadow-\[0_0_25px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_25px_rgba(34,211,238,0.4)]');
    c = c.replace(/shadow-\[0_0_30px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_30px_rgba(34,211,238,0.4)]');
    c = c.replace(/shadow-\[0_0_35px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_35px_rgba(34,211,238,0.4)]');
    c = c.replace(/shadow-\[0_0_40px_rgba\(255,165,0,0\.[0-9]\)\]/g, 'shadow-[0_0_40px_rgba(34,211,238,0.4)]');
    
    // Border replacements
    c = c.replace(/border-yellow-[0-9]+\/[0-9]+/g, 'border-cyan-500/30');
    c = c.replace(/border-orange-[0-9]+\/[0-9]+/g, 'border-cyan-500/30');
    c = c.replace(/border-yellow-[0-9]+/g, 'border-cyan-500');
    c = c.replace(/border-orange-[0-9]+/g, 'border-cyan-500');
    
    // Text replacements
    c = c.replace(/text-yellow-[0-9]+/g, 'text-cyan-400');
    c = c.replace(/text-orange-[0-9]+/g, 'text-cyan-500');

    // Hex replacements
    c = c.replace(/border-\[\#FDC700\]\/[0-9]+/g, 'border-blue-600/30');
    c = c.replace(/\#FDC700/g, '#2563eb');
    
    if(c !== orig) {
      fs.writeFileSync(p, c);
      changed++;
    }
  });
});
console.log('Modified ' + changed + ' files resolving remaining yellows');
