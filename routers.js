//Auslagerung der POST Zugriffe von JQUERY
//Muss in der express Server.js eingebunden werden
//require('./routes')(app);


// Notwendige Vordefinitionen fuer den Datenbankzugriff
// Express app muss deklariert werden, sonst gibts laufzeitfehler
var express = require('express');
var app = module.exports = express();

var pg = require('pg');
var pool = new pg.Pool();
var conString = process.env.DATABASE_URL;

function selecttyp3(stmtobj1,stmtobj2,stmtobj3,callback){
  let row1,row2,row3;
  let temp_erg_array=[];
  pool.query(stmtobj1, function(err, result){
    if (err) { return console.error('error running query', err); }
    row1=result.rows;
    //erg_array.concat(result.rows);
    pool.query(stmtobj2, function(err, result) {
      if (err) { return console.error('error running query', err); }
      row2=result.rows;
      pool.query(stmtobj3, function(err, result) {
        if (err) { return console.error('error running query', err); }
        row3=result.rows;
          temp_erg_array=temp_erg_array.concat(row1,row2,row3);
          //Asynchroner return
          callback(err,temp_erg_array);
      });
    });
  });
}


function selecttyp2(stmtobj1,stmtobj2,callback){
  let row1,row2;
  let temp_erg_array=[];
    pool.query(stmtobj1,function(err,result){
      row1=result.rows;
      pool.query(stmtobj2,function(err,result){
        if (err) {return console.error('error fetching client from pool', err);}
        row2=result.rows;
        temp_erg_array=temp_erg_array.concat(row1,row2);
        // Asynchroner return
        callback(err,temp_erg_array);
      });
  });
}

function selecttyp1(stmtobj1,callback){
  let row1;
  let temp_erg_array=[];
  pool.query(stmtobj1,function(err,result){
    row1=result.rows;
    temp_erg_array=row1;
    // Asynchroner return
    callback(err,temp_erg_array);
  });
}

//Update,Insert und Delete liefern keine Rueckgabewert
//Koennen in einer Funktion genutzt werden
//uid3=>3 Statements hintereinander RI Abgehaengigkeiten
//uid2=>2 Statements
//uid1=>1 Statement
function uidtyp3(stmtobj1,stmtobj2,stmtobj3,callback){
  pool.query(stmtobj1, function(err, result){
    if (err) { return console.error('error fetching client from pool', err); }
    pool.query(stmtobj2, function(err, result){
      if (err) { return console.error('error fetching client from pool', err); }
      pool.query(stmtobj3, function(err, result){
        if (err) { return console.error('error fetching client from pool', err); }
        callback(err,"1");
      });
    });
  });
}
function uidtyp2(stmtobj1,stmtobj2,callback){
  pool.query(stmtobj1, function(err, result){
    if (err) { return console.error('error fetching client from pool', err); }
    pool.query(stmtobj2, function(err, result){
      if (err) { return console.error('error fetching client from pool', err); }
        console.log("TYP2: "+stmtobj2.values);
        callback(err,"1");
    });
  });
}
function uidtyp1(stmtobj1,callback){
  pool.query(stmtobj1, function(err, result){
    if (err) { return console.error('error fetching client from pool', err); }
      callback(err,"1");
  });
}

app.post('/bwbasis', function(req, res){
    let id = req.body.ID;
    const bwbasis1= {
        name: 'basiswert',
        text: 'select * from basiswerte.basis where ID = $1',
        values: [id]
    }
    const bwmod2= {
        name: 'mod',
        text: 'select * from basiswerte.modifikation where ID = $1',
        values: [id]
    }
    const bwfinal3= {
        name: 'final',
        text: 'select * from basiswerte.final where ID = $1',
        values: [id]
    }
    // Der Return der Datenbank ist asynchron und muss mit einem Callback
    // uebergeben werden. Normaler Return gibt undef zurueck
    // Datenbankfunktion kann ausgelagert werden
    selecttyp3(bwbasis1,bwmod2,bwfinal3,function(err, result){
        res.send(result);
    });
});

app.post('/sekundaerwerte',function(req,res){
    let id = req.body.ID;
    const seknormal={
      name: 'seknormal',
      text: 'select * from sekundaerwerte.normalwerte where ID = $1',
      values: [id]
    }
    const sekaktuell={
      name: 'sekaktuell',
      text: 'select * from sekundaerwerte.aktuell where ID = $1',
      values: [id]
    }
    selecttyp2(seknormal,sekaktuell,function(err,result){
      res.send(result);
    });
});

app.post('/anderewaffen',function(req,res){
    let id = req.body.ID;
    const anderekttw={
      name : 'anderekttw',
      text : 'select * from anderekampftalente.talentwert where ID = $1',
      values : [id]
    }
    const anderektmod={
      name: 'anderektmod',
      text: 'select * from anderekampftalente.modifikation where ID = $1',
      values: [id]
    }
    const anderektfinal={
      name: 'anderektfinal',
      text: 'select * from anderekampftalente.final where ID = $1',
      values: [id]
    }
    selecttyp3(anderekttw,anderektmod,anderektfinal,function(err,restult){
      res.send(restult);
    });
});

app.post('/einhandwaffen',function(req,res){
  let id= req.body.ID;
  const einhandtw={
    name: 'einhandtw',
    text: 'select * from einhandwaffen.talentwert where ID = $1',
    values: [id]
  }
  const einhandmod={
    name: 'einhandmod',
    text: 'select * from einhandwaffen.modifikation where ID = $1',
    values: [id]
  }
  const einhandfinal={
    name: 'einhandfinal',
    text: 'select * from einhandwaffen.final where ID = $1',
    values: [id]
  }
  selecttyp3(einhandtw,einhandmod,einhandfinal,function(err,result){
    res.send(result);
  });
});

app.post('/fernkampfwaffen',function(req,res){
  let id=req.body.ID;
  const ferntw={
    name: 'ferntw',
    text: 'select * from fernkampf.talentwert where ID = $1',
    values: [id]
  }
  const fernmod={
    name: 'fernmod',
    text: 'select * from fernkampf.modifikation where ID = $1',
    values: [id]
  }
  const fernfinal={
    name: 'fernfinal',
    text: 'select * from fernkampf.final where ID = $1',
    values: [id]
  }
  selecttyp3(ferntw,fernmod,fernfinal,function(err,result){
    res.send(result);
  });
});

app.post('/gesellschaftstalente',function(req,res){
  let id=req.body.ID;
  const geselltw={
    name: 'geselltw',
    text: 'select * from gesellschaftstalente.talentwert where ID = $1',
    values: [id]
  }
  const gesellmod={
    name: 'gesellmod',
    text: 'select * from gesellschaftstalente.modifikation where ID = $1',
    values: [id]
  }
  selecttyp2(geselltw,gesellmod,function(req,result){
    res.send(result);
  });
});

app.post('/getmaxruestid',function(req,res){
  let id=req.body.ID;
  const maxruestid={
    name: 'maxruestid',
    text: 'select max(id)+1 as id from spieler.ruestung',
    values: []
  }
  selecttyp1(maxruestid,function(req,result){
    res.send(result);
  });
});

app.post('/getmaxwaffenid',function(req,res){
  let id=req.body.ID;
  const maxwaffid={
    name: 'maxwaffid',
    text: 'select max(id)+1 as id from spieler.waffen',
    values: []
  }
  selecttyp1(maxwaffid,function(req,result){
    res.send(result);
  });
});

app.post('/handwerkstalente',function(req,res){
  let id=req.body.ID;
  const handwerkstw={
    name: 'handwerkstw',
    text: 'select * from handwerkstalente.talentwert where ID = $1',
    values: [id]
  }
  const handwerksmod={
    name: 'handwerksmod',
    text: 'select * from handwerkstalente.modifikation where ID = $1',
    values: [id]
  }
  selecttyp2(handwerkstw,handwerksmod,function(err,result){
    res.send(result);
  });
});

app.post('/koerpertalente',function(req,res){
  let id=req.body.ID;
  const koerpertw={
    name: 'koerpertw',
    text: 'select * from koerpertalente.talentwert where ID = $1',
    values: [id]
  }
  const koerpermod={
    name: 'koerpermod',
    text: 'select * from koerpertalente.modifikation where ID = $1',
    values: [id]
  }
  selecttyp2(koerpertw,koerpermod,function(err,result){
    res.send(result);
  });
});

app.post('/naturtalente',function(req,res){
  let id=req.body.ID;
  const naturtw={
    name: 'naturtw',
    text: 'select * from naturtalente.talentwert where ID = $1',
    values: [id]
  }
  const naturmod={
    name: 'naturmod',
    text: 'select * from naturtalente.modifikation where ID = $1',
    values: [id]
  }
  selecttyp2(naturtw,naturmod,function(err,result){
    res.send(result)
  });
});

app.post('/spezialetalente',function(req,res){
  let id=req.body.ID;
  const spezialtw={
    name: 'spezialtw',
    text: 'select * from spezialtalente.talentwert where ID = $1',
    values: [id]
  }
  const spezialmod={
    name: 'spezialmod',
    text: 'select * from spezialtalente.modifikation where ID = $1',
    values: [id]
  }
  selecttyp2(spezialtw,spezialmod,function(err,result){
    res.send(result)
  });
});

app.post('/spielername',function(req,res){
  let id=req.body.ID;
  const getspielername={
    name: 'getspielername',
    text: 'select name from spieler.namen where id = $1',
    values: [id]
  }
  selecttyp1(getspielername,function(err,result){
    res.send(result)
  });
});

app.post('/spielerruestungen',function(req,res){
  let id=req.body.ID;
  const getspielerruest={
    name: 'getspielerruest',
    text: 'select * from spieler.ruestung where sp_id= $1 order by id',
    values: [id]
  }
  selecttyp1(getspielerruest,function(err,result){
    res.send(result)
  });
});

app.post('/spielerwaffen',function(req,res){
  let id=req.body.ID;
  let stmt = "select * from spieler.waffen a";
  stmt +=" inner join spieler.waffen_final b on (a.id = b.waffen_id)";
  stmt +=" inner join spieler.waffenart c on (a.id = c.id)";
  stmt +=" where b.sp_id = $1 order by a.id";
  const getspielerwaffen={
    name: 'getspielerwaffen',
    text: stmt,
    values: [id]
  }
  selecttyp1(getspielerwaffen,function(err,result){
    res.send(result)
  });
});

app.post('/spielerwaffenkampftalent',function(req,res){
  let id=req.body.ID;
  let stmt="select beschreibung,b.kampftalent_attacke,b.kampftalent_parade,a.id";
  stmt += " from spieler.waffen a inner join spieler.waffen_kampftalent b" ;
  stmt +=" on (a.id = b.id) where a.sp_id =$1";
  const getspwaffentw={
    name: 'getspwaffentw',
    text: stmt,
    values: [id]
  }
  selecttyp1(getspwaffentw,function(err,result){
    res.send(result)
  });
});

app.post('/wissenstalente',function(req,res){
  let id=req.body.ID;
  const wissenstw={
    name: 'wissenstw',
    text: 'select * from wissenstalente.talentwert where ID = $1',
    values: [id]
  }
  const wissensmod={
    name: 'wissensmod',
    text: 'select * from wissenstalente.modifikation where ID = $1',
    values: [id]
  }
  selecttyp2(wissenstw,wissensmod,function(err,result){
    res.send(result)
  });
});

app.post('/zweihandwaffen',function(req,res){
  let id=req.body.ID;
  const zweihandtw={
    name: 'zweihandtw',
    text: 'select * from zweihandwaffen.talentwert where ID = $1',
    values: [id]
  }
  const zweihandmod={
    name: 'zweihandmod',
    text: 'select * from zweihandwaffen.modifikation where ID = $1',
    values: [id]
  }
  const zweihandfinal={
    name: 'zweihandfinal',
    text: 'select * from zweihandwaffen.final where ID = $1',
    values: [id]
  }
  selecttyp3(zweihandtw,zweihandmod,zweihandfinal,function(err,result){
    res.send(result)
  });
});

app.post('/updatebasismod',function(req,res){
  let id=req.body.ID;
  let kl=req.body.KL;
  let gew=req.body.GEW;
  let gsk=req.body.GSK;
  let cha=req.body.CHA;
  let mut=req.body.MUT;
  let kon=req.body.KON;
  let kk=req.body.KK;
  let int=req.body.INT;
  let stmt="UPDATE basiswerte.modifikation SET KL = $1, GEW= $2,";
      stmt +=" GSK= $3, CHA= $4, mut= $5, kon= $6,";
      stmt +=" kk= $7, int= $8 where ID = $9";
  const updatebwmod={
    name: 'updatebwmod',
    text: stmt,
    values: [kl,gew,gsk,cha,mut,kon,kk,int,id]
  }
  uidtyp1(updatebwmod,function(err,result){
    res.send(result);
  });
});

app.post('/updateeinhandwaffen',function(req,res){
  let id=req.body.ID;
  let sch=req.body.SCH;
  let bei=req.body.BEI;
  let fle=req.body.FLE;
  let dol=req.body.DOL;
  let stmt="UPDATE einhandwaffen.modifikation SET schwerter = $1,";
      stmt+=" Beile= $2,";
      stmt+=" flegel= $3,";
      stmt+=" dolche= $4";
      stmt+=" where ID = $5;";
  const uptehwaff={
    name: 'uptehwaff',
    text: stmt,
    values: [sch,bei,fle,dol,id]
  }
  uidtyp1(uptehwaff,function(err,result){
    res.send(result);
  });
});

app.post('/updatefernkampf',function(req,res){
  let id=req.body.ID;
  let wur=req.body.WUR;
  let boe=req.body.BOE;
  let arm=req.body.ARM;
  let stmt="UPDATE fernkampf.modifikation SET wurfwaffen = $1,";
      stmt+=" boegen= $2,";
      stmt+=" armbrueste= $3";
      stmt+=" where ID = $4;";
  const upfernmod={
    name: 'upfernmod',
    text: stmt,
    values: [wur,boe,arm,id]
  }
  uidtyp1(upfernmod,function(err,result){
    res.send(result);
  });
});

// TODO: MODAL UND JS Fehlen noch
app.post('/updategesellschaftstalente',function(req,res){
  let id=req.body.ID;
  let fei=req.body.FEI;
  let eins=req.body.EINS;
  let bet=req.body.BET;
  let eti=req.body.ETI;
  let men=req.body.MEN;
  let lut=req.body.LUT;
  let auu=req.body.AUU;
  let stmt="UPDATE gesellschaftstalente.modifikation set feilschen=$1,";
      stmt+=" einschüchtern=$2, betoeren=$3, etikette=$4, menschenkenntnis=$5,";
      stmt+=" lügen_täuschen=$6, anführen_Überreden=$7 where id=$8";
  const upgesellmod={
    name: 'upgesellmod',
    text: stmt,
    values: [fei,eins,bet,eti,men,lut,auu,id]
  }
  uidtyp1(upgesellmod,function(err,result){
    res.send(result);
  });
});

app.post('/updatehandwerkstalente',function(req,res){
  let id=req.body.ID;
  let sch=req.body.SCH;
  let led=req.body.LED;
  let hol=req.body.HOL;
  let koc=req.body.KOC;
  let leh=req.body.LEH;
  let stmt="UPDATE handwerkstalente.modifikation SET schmieden = $1,";
      stmt+=" Lederverarbeitung= $2,";
      stmt+=" holzverarbeitung= $3,";
      stmt+=" Koch= $4,";
      stmt+=" lehren= $5";
      stmt+=" where ID = $6;";
  const uphandwmod={
    name: 'uphandwmod',
    text: stmt,
    values:[sch,led,hol,koc,leh,id]
  }
  uidtyp1(uphandwmod,function(err,result){
    res.send(result);
  });
});

app.post('/updatekkbonus',function(req,res){
  let id=req.body.ID;
  let kkb=req.body.KKB;
  const updtkkbonus={
    name: 'updtkkbonus',
    text: "update spieler.waffen set kk_bonus=$1 where sp_id=$2",
    values: [kkb,id]
  }
  uidtyp1(updtkkbonus,function(err,result){
    res.send(result);
  });
});

//TODO: UPDATE WILLENSKRAFT IN MAIN EINFÜGEN
app.post('/updatekoerpertalente',function(req,res){
  let id=req.body.ID;
  let schl=req.body.SCHL;
  let auf=req.body.AUF;
  let rob=req.body.ROB;
  let fin=req.body.FIN;
  let zec=req.body.ZEC;
  let tas=req.body.TAS;
  let wil=req.body.WIL;
  let stmt="UPDATE koerpertalente.modifikation SET schleichen = $1,";
      stmt+="aufmerksamkeit= $2,";
      stmt+="robustheit= $3,";
      stmt+="fingerfertigkeit= $4,";
      stmt+="zechen= $5,";
      stmt+="taschendiebstahl= $6,";
      stmt+="willenskraft=$7";
      stmt+=" where ID = $8;";
  const updtkoertalent={
    name: 'updtkoertalent',
    text: stmt,
    values: [schl,auf,rob,fin,zec,tas,wil,id]
  }
  uidtyp1(updtkoertalent,function(err,result){
    res.send(result);
  });
});
app.post('/updatenaturtalente',function(req,res){
  let id=req.body.ID;
  let kra=req.body.KRA;
  let goe=req.body.GOE;
  let ueb=req.body.UEB;
  let ori=req.body.ORI;
  let fae=req.body.FAE;
  let stmt="UPDATE naturtalente.modifikation SET kraeuterkunde = $1,";
      stmt+="geographie= $2,";
      stmt+="ueberleben= $3,";
      stmt+="orientierung= $4,";
      stmt+="faehrtenlesen= $5";
      stmt+=" where ID = $6;";
  const updtnatmod={
    name: 'updtnatmod',
    text: stmt,
    values: [kra,goe,ueb,ori,fae,id]
  }
  uidtyp1(updtnatmod,function(err,result){
    res.send(result);
  });
});

app.post('/updatesekundaraktuell',function(req,res){
  let id=req.body.ID;
  let hp=req.body.HP;
  let ausd=req.body.AUSD;
  let ee=req.body.EE;
  let ausw=req.body.AUSW;
  let rue=req.body.RUE;
  let init=req.body.INIT;
  let atkb=req.body.ATKB;
  let pab=req.body.PAB;
  let lr=req.body.LR;
  let wr=req.body.WR;
  let er=req.body.ER;
  let lebr=req.body.LEBR;
  let fr=req.body.FR;
  let eisr=req.body.EISR;
  let mr=req.body.MR;
  let dtr=req.body.DTR;
  let stmt="UPDATE sekundaerwerte.aktuell SET lebenspunkte = $1,";
      stmt+="ausdauer= $2,";
      stmt+="ee= $3,";
      stmt+="ausweichen= $4,";
      stmt+="ruestung = $5,";
      stmt+="initiative= $6,";
      stmt+="luftresistenz= $7,";
      stmt+="wasserresistenz= $8,";
      stmt+="erdresistenz =$9,";
      stmt+="das_lebenderesistenz =$10,";
      stmt+="feuerresistenz = $11,";
      stmt+="eisresistenz= $12,";
      stmt+="metallresistenz = $13,";
      stmt+="das_toteresistenz =$14,";
      stmt+="attacke_basis =$15,";
      stmt+="parade_basis = $16";
      stmt+=" where ID = $17";
  const updtsekwerte={
    name: 'updtsekwerte',
    text: stmt,
    values: [hp,ausd,ee,ausw,rue,init,atkb,pab,lr,wr,er,lebr,fr,eisr,mr,dtr,id]
  }
  uidtyp1(updtsekwerte,function(err,result){
    res.send(result);
  });
});

app.post('/updatespezialtalente',function(req,res){
  let id=req.body.ID;
  let rei=req.body.REI;
  let sch=req.body.SCH;
  let kle=req.body.KLE;
  let unt=req.body.UNT;
  let mup=req.body.MUP;
  let schau=req.body.SCHAU;
  let gau=req.body.GAU;
  let see=req.body.SEE;
  let stmt="UPDATE spezialtalente.modifikation set REITEN=$1,";
      stmt+=" schwimmen=$2,klettern=$3,unterhaltungskunst=$4,";
      stmt+=" musik_poesie=$5,schauspiel=$6,gaukelei=$7,seefahrt=$9";
      stmt+=" where id=$9";
  const updtspezmod={
    name: 'updtspezmod',
    text: stmt,
    values: [rei,sch,kle,unt,mup,schau,gau,see,id]
  }
  uidtyp1(updtspezmod,function(err,result){
    res.send(result);
  });
});

app.post('/updatespielerruestung',function(req,res){
  let sp_id=req.body.SP_ID;
  let wp_id=req.body.WP_ID;
  let wname=req.body.WNAME;
  let rwert=req.body.RWERT;
  let mod=req.body.MOD;
  let stmt="UPDATE spieler.ruestung SET  name_beschreibung= $1,";
      stmt+=" ruestungswert= $2,";
      stmt+=" ausruestungsmodifikation= $3";
      stmt+=" where ID = $4 and sp_id=$5;";
  const updtspruestung={
    name: 'updtspruestung',
    text: stmt,
    values: [wname,rwert,mod,wp_id,sp_id]
  }
  uidtyp1(updtspruestung,function(err,result){
    res.send(result);
  });
});

app.post('/updatespielerwaffen',function(req,res){
  let sp_id=req.body.SP_ID;
  let wp_id=req.body.WP_ID;
  let wname=req.body.WNAME;
  let wafrt=req.body.WAFRT;
  let wafexo=req.body.WAFEXO;
  let besch=req.body.BESCH;
  let wueschaden=req.body.WUESCHADEN;
  let zschaden=req.body.ZSCHADEN;
  let atbonus=req.body.ATBONUS;
  let pabonus=req.body.PABONUS;
  let wartname=req.body.WARTNAME;
  let stmt ="UPDATE spieler.waffen set";
      stmt+=" beschreibung = $1,";
      stmt+=" schaden_wuerfel = $2,";
      stmt+=" schaden = $3,";
      stmt+=" attackebonus = $4,";
      stmt+=" paradebonus = $5";
      stmt+=" where id = $6 and sp_id = $7;";
  const upspwaff={
    name: 'upspwaff',
    text: stmt,
    values: [besch,wueschaden,zschaden,atbonus,pabonus,wp_id,sp_id]
  }
  let stmt1="update spieler.waffenart set";
      stmt1+=" name = $1,";
      stmt1+=" art = $2,";
      stmt1+=" art_id = $3,";
      stmt1+=" exotisch = $4";
      stmt1+=" where id =$5;";
  const upspwart={
    name: 'upspwart',
    text: stmt1,
    values: [wname,wartname,wafrt,wafexo,wp_id]
  }
  uidtyp2(upspwaff,upspwart,function(err,result){
    res.send(result);
  });
});

app.post('/updatespielerruestungen',function(req,res){
let id=req.body.ID;
  let mod_array=[];
  let name_array=[];
  let data=[];
  var upruestungenmod={};
  mod_array=req.body.VALUEARRAY;
  name_array=req.body.NAMEARRAY;
  let stmt="UPDATE spieler.ruestung set ausruestungsmodifikation= $1";
      stmt+=" where name_beschreibung=$2";
      stmt+=" and id=$3";
  for (let i=0; i<mod_array.length;i++){
    name_i="upruestungenmod"+i;
    upruestungenmod={
      name: name_i,
      text: stmt,
      values: [mod_array[i],name_array[i],id]
    }
    uidtyp1(upruestungenmod,function(err,result){
      if (i == mod_array.length -1){
        res.send(result);
      }
    });
  }
});
//TODO: TESTEN! -> Kontrolle beim echten ...
app.post('/updatespielerruestungenwert',function(req,res){
  let id=req.body.ID;
  let mod_array=[];
  let name_array=[];
  let data=[];
  var upruestungenw={};
  mod_array=req.body.VALUEARRAY;
  name_array=req.body.NAMEARRAY;
  let stmt="UPDATE spieler.ruestung set ruestungswert= $1";
      stmt+=" where name_beschreibung=$2";
      stmt+=" and id=$3";
  for (let i=0; i<mod_array.length;i++){
    name_i="upruestungenw"+i;
    upruestungenw={
      name: name_i,
      text: stmt,
      values: [mod_array[i],name_array[i],id]
    }
    uidtyp1(upruestungenw,function(err,result){
      if (i == mod_array.length -1){
        res.send(result);
      }
    });
  }
});


app.post('/updatespielerwaffenkampftalent',function(req,res){
  let id=req.body.ID;
  let wpid=[];
  let at=[];
  let pa=[];
  wpid=req.body.WIDARRAY;
  at=req.body.ATARRAY;
  pa=req.body.PAARRAY;
  var upspwaffkt={};
  let stmt ="UPDATE spieler.waffen_kampftalent set kampftalent_attacke= $1,";
      stmt+=" kampftalent_parade=$2";
      stmt+=" where id=$3";
      stmt+=" and sp_id=$4";
  for (let i=0;i<wpid.length;i++){
    name_i="upspwaffkt"+i,
    upspwaffkt={
      name: name_i,
      text: stmt,
      values: [at[i],pa[i],wpid[i],id]
    }
    uidtyp1(upspwaffkt,function(err,result){
      if (i == wpid.length -1){
        res.send(result);
      }
    });
  }
});

//TODO: ACHTUNG GEANDERT! Blatt anschauen
app.post('/updatewissenstalente',function(req,res){
  let id=req.body.ID;

});

app.post('/updatezweihandwaffen',function(req,res){
  let id=req.body.ID;
  let zws=req.body.ZWS;
  let aex=req.body.AEX;
  let kol=req.body.KOL;
  let sta=req.body.STA;
  let sgn=req.body.SGN;
  let stmt="UPDATE zweihandwaffen.modifikation SET schwerter = $1,";
      stmt+=" aexte= $2,";
      stmt+=" kolben= $3,";
      stmt+=" staebe= $4,";
      stmt+=" stangenwaffen= $5";
      stmt+=" where ID = $6;";
  const updtzhwaff={
    name: 'updtzhwaff',
    text: stmt,
    values: [zws,aex,kol,sta,sgn,id]
  }
});

app.post('/addnewwaffe',function(req,res){
  let sp_id=req.body.SP_ID;
  let wp_id=req.body.WP_ID;
  let wname=req.body.WNAME;
  let wafrt=req.body.WAFRT;
  let wartname=req.body.WARTNAME;
  let wafexo=req.body.WAFEXO;
  let besch=req.body.BESCH;
  let wueschaden=req.body.WUESCHADEN;
  let zschaden=req.body.ZSCHADEN;
  let atbonus=req.body.ATBONUS;
  let pabonus=req.body.PABONUS;
  let kkbonus=req.body.KKBONUS;
  const addspwaff={
    name: 'addspwaff',
    text: 'insert into spieler.waffen values($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    values: [wp_id,sp_id,wafrt,besch,wueschaden,zschaden,kkbonus,atbonus,pabonus]
  }
  const addspwart={
    name: 'addspwart',
    text: 'insert into spieler.waffenart values($1,$2,$3,$4,$5)',
    values: [wp_id,wname,wartname,wafrt,wafexo]
  }
  const addspwafkt={
    name: 'addspwafkt',
    text: 'insert into spieler.waffen_kampftalent values($1,$2,$3,$4,$5)',
    values: [wp_id,sp_id,wafrt,0,0]
  }
  uidtyp3(addspwaff,addspwart,addspwafkt,function(err,result){
    res.send(result)
  });
});

app.post('/addruest',function(req,res){
  //SP_ID = SpielerID
  //ID ist die neue RuestungsID
  let sp_id=req.body.SP_ID;
  let id=req.body.ID;
  let ruesw=req.body.RUESW;
  let mod=req.body.MOD;
  let ruesn=req.body.RUESN;
  const addruest={
    name: 'addruest',
    text: 'insert into spieler.ruestung values($1,$2,$3,$4,$5)',
    values: [id,sp_id,ruesn,ruesw,mod]
  }
  uidtyp1(addruest,function(err,result){
    res.send(result);
  });
});

app.post('/sekundarwertefullreset',function(req,res){
      let id=req.body.ID;
      let stmt ="update sekundaerwerte.aktuell set (id,lebenspunkte,ausdauer,ee,";
          stmt+="ausweichen,ruestung,initiative,luftresistenz,wasserresistenz,";
          stmt+="erdresistenz,das_lebenderesistenz,feuerresistenz,eisresistenz,";
          stmt+="metallresistenz,das_toteresistenz,attacke_basis,parade_basis) ";
          stmt+=" =(select * from sekundaerwerte.normalwerte where id = $1) ";
          stmt+="where id =$1";
      const sekfullres={
              name: 'sekfullres',
              text: stmt,
              values: [id]
            }
      uidtyp1(sekfullres,function(err,result){
              res.send(result);
      });
});

app.post('/deletespielerwaffe',function(req,res){
    let sp_id=req.body.SP_ID;
    let wp_id=req.body.WP_ID;
    const delspwaffen={
        name: 'delspwaffen',
        text: 'delete from spieler.waffen where id=$1 and sp_id=$2',
        values: [wp_id,sp_id]
    }
    const delspwaffenkampft={
        name: 'delspwaffenkampft',
        text: 'delete from spieler.waffen_kampftalent where id=$1 and sp_id=$2',
        values: [wp_id,sp_id]
    }
    const delspwaffenart={
        name: 'delspwaffenart',
        text: 'delete from spieler.waffenart where id=$1',
        values: [wp_id]
    }
    uidtyp3(delspwaffenkampft,delspwaffenart,delspwaffen,function(err,result){
        res.send(result);
    });
});

app.post('/deletespielerruestung',function(req,res){
    let sp_id=req.body.SP_ID;
    let wp_id=req.body.WP_ID;
    const delspruest={
        name: 'delspruest',
        text: 'delete from spieler.ruestung where id=$1 and sp_id=$2',
        values: [wp_id,sp_id]
    }
    uidtyp1(delspruest,function(err,result){
        res.send(result);
    });
});

app.post('/updezkoerper',function(req,res){
    let sp_id=req.body.SP_ID;
  	let talentname=req.body.TAN;
  	let talentwert=req.body.TAW;
  	let stmt="update koerpertalente.talentwert set "+talentname+"=$1 where ID = $2";
  	const uptkoerpertal={
  		name: 'uptkoerpertal',
  		text: stmt,
  		values: [talentwert,sp_id]
  	}
  	uidtyp1(uptkoerpertal,function(err,result){
  		res.send(result);
  	});
});

app.post('/updeznatur',function(req,res){
    let sp_id=req.body.SP_ID;
  	let talentname=req.body.TAN;
  	let talentwert=req.body.TAW;
  	let stmt="update naturtalente.talentwert set "+talentname+"=$1 where ID = $2";
  	const uptnaturtal={
  		name: 'uptnaturtal',
  		text: stmt,
  		values: [talentwert,sp_id]
  	}
  	uidtyp1(uptnaturtal,function(err,result){
  		res.send(result);
  	});
});

app.post('/updezgesell',function(req,res){
    let sp_id=req.body.SP_ID;
  	let talentname=req.body.TAN;
  	let talentwert=req.body.TAW;
  	let stmt="update gesellschaftstalente.talentwert set "+talentname+"=$1 where ID = $2";
  	const uptgesell={
  		name: 'uptgesell',
  		text: stmt,
  		values: [talentwert,sp_id]
  	}
  	uidtyp1(uptgesell,function(err,result){
  		res.send(result);
  	});
});

app.post('/updezspeziale',function(req,res){
    let sp_id=req.body.SP_ID;
  	let talentname=req.body.TAN;
  	let talentwert=req.body.TAW;
  	let stmt="update spezialtalente.talentwert set "+talentname+"=$1 where ID = $2";
  	const uptspeziale={
  		name: 'uptspeziale',
  		text: stmt,
  		values: [talentwert,sp_id]
  	}
  	uidtyp1(uptspeziale,function(err,result){
  		res.send(result);
  	});
});

app.post('/gettalentable',function(req,res){
    let talenttablename=req.body.TAN;
    let stmt="select column_name from information_schema.columns where table_schema =$1 and table_name='talentwert';"
    const getcolnames={
      name:'getcolnames',
      text:stmt,
      values:[talenttablename]
    }
    selecttyp1(getcolnames,function(err,result){
      res.send(result);
    });
});
