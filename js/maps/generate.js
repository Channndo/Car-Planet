function generateEmptyMap(){let m=[];for(let y=0;y<MAP_ROWS;y++){let r=[];for(let x=0;x<MAP_COLS;x++){r.push((y===0||y===MAP_ROWS-1||x===0||x===MAP_COLS-1)?1:0);}m.push(r);}return m;}
