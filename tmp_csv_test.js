const parseCSV=(text)=>{
    if(!text||!text.trim()) return [];
    const detectDelimiter=(text)=>{
        const lines=text.slice(0,1000).split('\n');
        let comma=0,semi=0,tab=0;
        for(const line of lines){
            comma+=(line.match(/,/g)||[]).length;
            semi+=(line.match(/;/g)||[]).length;
            tab+=(line.match(/\t/g)||[]).length;
        }
        if(tab>comma&&tab>semi) return '\t';
        if(semi>comma&&semi>tab) return ';';
        return ',';
    };
    const delimiter=detectDelimiter(text);
    const lines=[];
    let row=[''];
    let inQuotes=false;
    for(let i=0;i<text.length;i++){
        const char=text[i];
        const next=text[i+1];
        if(char==='"'){
            if(inQuotes&&next==='"'){row[row.length-1]+='"';i++;} else inQuotes=!inQuotes;
        } else if(char===delimiter && !inQuotes){
            row.push('');
        } else if((char==='\r'||char==='\n') && !inQuotes){
            if(char==='\r' && next==='\n') i++;
            lines.push(row);
            row=[''];
        } else {
            row[row.length-1]+=char;
        }
    }
    if(row.length>1||row[0] !== '') lines.push(row);
    return lines.map(r=>r.map(c=>c.trim())).filter(r=>r.some(c=>c!==''));
};
const parseTeamCsvEntries=(text)=>{
    const rows=parseCSV(text);
    if(rows.length===0) return [];
    const header=rows[0].map(cell=>cell.toLowerCase());
    const hasHeader=header.some(cell=>cell.includes('name')||cell.includes('email')||cell.includes('phone')||cell.includes('whatsapp')||cell.includes('wa'));
    let nameIdx=0,emailIdx=1,phoneIdx=2,whatsappIdx=3,startRow=0;
    if(hasHeader){
        startRow=1;
        const foundName=header.findIndex(cell=>cell.includes('name'));
        const foundEmail=header.findIndex(cell=>cell.includes('email')||cell.includes('e-mail'));
        const foundPhone=header.findIndex(cell=>cell.includes('phone')||cell.includes('mobile')||cell.includes('tel')||cell.includes('contact'));
        const foundWhatsapp=header.findIndex(cell=>cell.includes('whatsapp')||cell.includes('wa')||cell.includes('chat'));
        if(foundName!==-1) nameIdx=foundName;
        if(foundEmail!==-1) emailIdx=foundEmail;
        if(foundPhone!==-1) phoneIdx=foundPhone;
        if(foundWhatsapp!==-1) whatsappIdx=foundWhatsapp;
    }
    return rows.slice(startRow).map(row=>{
        const name=(row[nameIdx]||'').trim();
        const email=(row[emailIdx]||'').trim();
        const phone=(row[phoneIdx]||'').trim();
        const whatsapp=(row[whatsappIdx]||'').trim()||phone;
        return { name,email,phone,whatsapp };
    }).filter(entry=>entry.name);
};
const samples=[
`Name,Email,Phone,WhatsApp\nJohn Doe,john@example.com,1234567890,9876543210\nJane Smith,jane@example.com,0987654321,0123456789`,
`Name;Email;Phone;WhatsApp\nJohn Doe;john@example.com;1234567890;9876543210\nJane Smith;jane@example.com;0987654321;0123456789`,
`Name\nJohn Doe\nJane Smith`,
`John Doe,john@example.com,1234567890,9876543210\nJane Smith,jane@example.com,0987654321,0123456789`
];
samples.forEach((sample,idx)=>{
    console.log('--- sample',idx,'---');
    console.log(JSON.stringify(parseTeamCsvEntries(sample),null,2));
});
