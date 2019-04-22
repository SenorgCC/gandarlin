import "jquery";
//import { Spieler } from "/source/js/spieler";
var basiswert_arr= [];
var sekundarwert_arr = [];
var koerperttalente_arr = [];
var wissenstalente_arr = [];
var naturtalente_arr = [];
var gesellschaftstalente_arr = [];
var spezialetalente_arr = [];
var einhandwaffen_arr = [];
var zweihandwaffen_arr = [];
var fernkampfwaffen_arr = [];
var anderewaffen_arr = [];
var handwerkstalente_arr = [];
var spielerwaffen_ar = [[]];
var spielerruestungen_arr = [[]];
var spielerwaffenkampftalent_arr=[[]];
var SpielerID:number;
var Spielernamen:string;
//UNBENUTZT
var modalid:number;

$( document ).ready(function():void {
  function getAlldata():void{
      bwbasis();
      sekwerte();
      einhandwaffen();
      zweihandwaffen();
      fernkampfwaffen();
      anderewaffen();
  }

  //UNBENUTZT
  function createAllTables():void{
      getTable(basiswert_arr,"spielerbasiswerte");
      getTable(sekundarwert_arr,"spielersekundarwerte");
      getTable(koerperttalente_arr,"körpertalente");
      getTable(wissenstalente_arr,"wissenstalente");
      getTable(naturtalente_arr,"naturtalente");
      getTable(gesellschaftstalente_arr,"gesellschaftstalente");
      getTable(spezialetalente_arr,"spezialetalente");
      getTable(einhandwaffen_arr,"einhandwaffen");
      getTable(zweihandwaffen_arr,"zweihandwaffen");
      getTable(fernkampfwaffen_arr,"fernkampfwaffen");
      getTable(anderewaffen_arr,"anderewaffen");
      getrowTable(spielerwaffen_ar,"spielerwaffen");
      getrowTable(spielerruestungen_arr,"spielerruestungen");
  }

  $("#myClickBtn").click(function():void{
      SpielerID=$('#SpielerID').val();
      //IsNaN= Is not a number ist. Test, ob eine Zahl
      if($.isNumeric(SpielerID)){
          getAlldata();
          //createAllTables();
          $('#Spielerdaten').hide();
      }else{
        window.alert("Invalide ID!");
      }
  });

  $("#gobtn").click(function():void{
        //dataTab("spielerruestungen",spielerruestungen_arr);
     //   getTable(handwerkstalente_arr,"handwerkstalente");
  });
function getNamen():void{
  $.ajax({
      type:'POST',
      url:"/spielername",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        Spielernamen=data[0]["name"];
      }
    }).done(function(){
      createNavbar();
    });
}
function createNavbar():void{
  $('#NavName').text("["+SpielerID+"] "+Spielernamen);
  $('#NavLeben').text("HP: "+sekundarwert_arr[2]["lebenspunkte"]);
  $('#NavAusdauer').text("Ausdauer: "+sekundarwert_arr[2]["ausdauer"]);
  $('#NavEE').text("EE: "+sekundarwert_arr[2]["ee"]);
  $('#navbarNavAltMarkup').collapse('show');
}

function bwbasis():void{
  $.ajax({
      type:'POST',
      url:"/bwbasis",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      basiswert_arr=data;
      korprtalente();
      wissenstalente();
      naturtalente();
      gesellschaftstalente();
      spezialetalente();
      checkKKBonus();
      spielerwaffen();
      spielerruestungen();
      getspielerwaffenkampftalent();
      handwerkstalente();
      }
  }).done(function(){
    getTable(basiswert_arr,"spielerbasiswerte");
  });
}

function sekwerte():void{
  var kalkulation = [{"id":"",
                      "lebenspunkte": "KK+KON+KON",
                      "ausdauer":"KON+GEW+KK",
                      "ee": "(KL + KL + CHA + MUT) * 1,5",
                      "ausweichen": "((GSK +2 * GEW) /4) - Ausrüstungsmalus",
                      "ruestung": "Rüstungswert + Boni",
                      "initiative": "((MUT+GEW+2*IN)/5)+Aufmerksamkeit",
                      "attacke_basis" : "(GEW+MUT+KK)/5",
                      "parade_basis" : "(GEW+KK+IN)/5",
                      "luftresistenz": "KL/4",
                      "wasserresistenz": "GEW/4",
                      "erdresistenz": "GSK/4",
                      "das_lebenderesistenz": "CHA/4",
                      "feuerresistenz" : "MUT/4",
                      "eisresistenz" : "KON/4",
                      "metallresistenz" : "KK/4",
                      "das_toteresistenz" : "IN/4"}];
  $.ajax({
      type:'POST',
      url:"/sekundaerwerte",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      sekundarwert_arr=kalkulation.concat(data);
      }
  }).done(function(){
    getTable(sekundarwert_arr,"spielersekundarwerte");
    getNamen();
  });
}

function getTable(data:any,htmlobject:string):void{
    var $tbody:any = $('#'+htmlobject).find('tbody');
    $tbody.empty();
    var tabledef = [];
    $.each(data[0],function (k:number,v:any):void{
      tabledef.push(k);
    });
    var rowtext:string;
    var celltext:string;
    var classtext:string;
    //Dient zur erkennung ob eine Reihe "Nicht erlernt enthällt"
    let classflag:boolean;
    let classflag=false;
    for (let i:number = 1; i < tabledef.length; i++){
      rowtext +="<tr class=\"PLACEHOLDclasstext\"><th scope=\"row\">"+translate(tabledef[i])+"</th>";
      for (let j:number = 0; j < data.length; j++){
        if (JSON.stringify(data[j][tabledef[i]])=="null"){
            celltext = "Nicht erlernt";
            classflag=true;
        }else {
            celltext = data[j][tabledef[i]];
        }
      rowtext +="<td>"+celltext+"</td>";
    }
    if (classflag){
        rowtext=rowtext.replace("PLACEHOLDclasstext","nichterlernt");
    }else{
        rowtext=rowtext.replace("PLACEHOLDclasstext","");
    }
    classflag=false;
    rowtext +="</tr>";
    $tbody.append(rowtext);
    rowtext = "";
  }
}

function getrowTable(data:any,htmlobject:string){
  var $tbody:any = $('#'+htmlobject).find('tbody');
  $tbody.empty();
  var rowtext:string;
  var celltext = "";
  for (let i:number = 0; i < data.length; i++){
    rowtext +="<tr>";
    for (let j:number = 0; j < data[i].length; j++){
      celltext = data[i][j];
      rowtext +="<td>"+celltext+"</td>";
    }
    rowtext +="</tr>";
    $tbody.append(rowtext);
    rowtext = "";
  }
}

function translate (word:string):string{
  let kuerzel = {
      "ee":"Elementar Essenz",
      "kl":"Klugheit (KL)",
      "gsk":"Geschicklichkeit (GSK)",
      "gew":"Gewandheit (GEW)",
      "cha":"Charisma (CHA)",
      "mut":"Mut (MUT)",
      "kon":"Konstitution (KON)",
      "kk" :"Körperkraft (KK)",
      "int":"Intuition (IN)",
      "attacke_basis":"Attacke-Basiswert",
      "parade_basis":"Parade-Basiswert",
      "das_lebenderesistenz":"Das Lebenderesistenz",
      "das_toteresistenz":"Das Toteresistenz",
      "ueberleben":"Überleben",
      "kraeuterkunde":"Kräuterkunde",
      "ueberreden":"Überreden",
      "betoeren":"Betören",
      "dörfer_siedlungen":"Dörfer/Siedlungen",
      "anführen_Überreden":"Anführen/Überreden",
      "musik_poesie":"Musik/Poesie"

  };
  return kuerzel[word] || word;
  }

function korprtalente():void{
var wuerfelwerte = [{ "id":"",
                      "schleichen": basiswert_arr[2]["gsk"]+" (GSK)",
                      "aufmerksamkeit": basiswert_arr[2]["mut"]+" (MUT)",
                      "robustheit": basiswert_arr[2]["gew"]+" (GEW)",
                      "willenskraft": basiswert_arr[2]["kl"]+" (KL)",
                      "fingerfertigkeit": basiswert_arr[2]["gsk"]+" (GSK)",
                      "zechen": basiswert_arr[2]["mut"]+" (MUT)",
                      "taschendiebstahl": basiswert_arr[2]["gew"]+" (GEW)"
                    },
                            {"id":"",
                                "schleichen": basiswert_arr[2]["gew"]+" (GEW)",
                      "aufmerksamkeit": basiswert_arr[2]["int"]+" (IN)",
                      "robustheit": basiswert_arr[2]["kon"]+" (KON)",
                      "willenskraft": basiswert_arr[2]["cha"]+" (CHA)",
                      "fingerfertigkeit": basiswert_arr[2]["gsk"]+" (GSK)",
                      "zechen": basiswert_arr[2]["kon"]+" (KON)",
                      "taschendiebstahl": basiswert_arr[2]["gsk"]+" (GSK)"
                    },
                            {"id":"",
                                "schleichen":basiswert_arr[2]["kon"]+" (KON)",
                      "aufmerksamkeit":basiswert_arr[2]["gew"]+" (GEW)",
                      "robustheit":basiswert_arr[2]["kk"]+" (KK)",
                      "willenskraft":basiswert_arr[2]["kon"]+" (KON)",
                      "fingerfertigkeit":basiswert_arr[2]["int"]+" (IN)",
                      "zechen":basiswert_arr[2]["kon"]+" (KON)",
                      "taschendiebstahl":basiswert_arr[2]["int"]+" (IN)"
                    }];
      $.ajax({
      type:'POST',
      url:"/koerpertalente",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        koerperttalente_arr=wuerfelwerte.concat(data);
      }
    }).done(function():any{
      getTable(koerperttalente_arr,"körpertalente");
    });
}

function wissenstalente():void{
var wuerfelwerte = [{ "id":"",
                      "heilung": basiswert_arr[2]["kl"]+" (KL)",
                      "gifte": basiswert_arr[2]["kl"]+" (KL)",
                      "schriften": basiswert_arr[2]["kl"]+" (KL)",
                      "magielehre": basiswert_arr[2]["kl"]+" (KL)",
                      "magietheorie":" ",
                      "magiegespür":" ",
                      "gassenwissen": basiswert_arr[2]["kl"]+" (KL)",
                      "dörfer_siedlungen":" ",
                      "städte":" ",
                      "weltenkenntnis": basiswert_arr[2]["mut"]+" (MUT)",
                      "geschichte":" ",
                      "kulturen": " ",
                      "sprachen": basiswert_arr[2]["kl"]+" (KL)",
                      "anatomie": basiswert_arr[2]["kl"]+" (KL)",
                      "spiritualität": basiswert_arr[2]["kl"]+" (KL)"
                    },
                    { "id":"",
                      "heilung": basiswert_arr[2]["int"]+" (IN)",
                      "gifte": basiswert_arr[2]["kon"]+" (KON)",
                      "schriften": basiswert_arr[2]["gsk"]+" (GSK)",
                      "magielehre": basiswert_arr[2]["kl"]+" (KL)",
                      "magietheorie": " ",
                      "magiegespür":" ",
                      "gassenwissen": basiswert_arr[2]["cha"]+" (CHA)",
                      "dörfer_siedlungen":" ",
                      "städte":" " ,
                      "weltenkenntnis": basiswert_arr[2]["int"]+" (IN)",
                      "geschichte":" ",
                      "kulturen": " ",
                      "sprachen": basiswert_arr[2]["cha"]+" (CHA)",
                      "anatomie": basiswert_arr[2]["gsk"]+" (GSK)",
                      "spiritualität":basiswert_arr[2]["cha"]+" (CHA)"
                    },
                    { "id":"",
                      "heilung": basiswert_arr[2]["gsk"]+" (GSK)",
                      "gifte": basiswert_arr[2]["mut"]+" (MUT)",
                      "schriften": basiswert_arr[2]["gsk"]+" (GSK)",
                      "magielehre": basiswert_arr[2]["int"]+" (IN)",
                      "magietheorie":" ",
                      "magiegespür":" ",
                      "gassenwissen": basiswert_arr[2]["kk"]+" (KK)",
                      "dörfer_siedlungen":" ",
                      "städte":" ",
                      "weltenkenntnis": basiswert_arr[2]["mut"]+" (MUT)",
                      "geschichte":" ",
                      "kulturen": " ",
                      "sprachen": basiswert_arr[2]["int"]+" (IN)",
                      "anatomie": basiswert_arr[2]["mut"]+" (MUT)",
                      "spiritualität":basiswert_arr[2]["mut"]+" (MUT)"
                    }];
      $.ajax({
      type:'POST',
      url:"/wissenstalente",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        wissenstalente_arr=wuerfelwerte.concat(data);
      }
    }).done(function():void{
      getTable(wissenstalente_arr,"wissenstalente");
    });
}

function naturtalente():void{
var wuerfelwerte = [{ "id":"",
                      "kraeuterkunde": basiswert_arr[2]["kl"]+" (KL)",
                      "tierkunde": basiswert_arr[2]["mut"]+" (MUT)",
                      "geographie": basiswert_arr[2]["kl"]+" (KL)",
                      "ueberleben": basiswert_arr[2]["int"]+" (IN)",
                      "orientierung": basiswert_arr[2]["mut"]+" (MUT)",
                      "faehrtenlesen": basiswert_arr[2]["gsk"]+" (GSK)"
                    },
                    { "id":"",
                      "kraeuterkunde": basiswert_arr[2]["int"]+" (IN)",
                      "tierkunde": basiswert_arr[2]["gew"]+" (GEW)",
                      "geographie": basiswert_arr[2]["int"]+" (IN)",
                      "ueberleben": basiswert_arr[2]["gew"]+" (GEW)",
                      "orientierung": basiswert_arr[2]["int"]+" (IN)",
                      "faehrtenlesen": basiswert_arr[2]["gew"]+" (GEW)"
                    },
                    { "id":"",
                      "kraeuterkunde": basiswert_arr[2]["gsk"]+" (GSK)",
                      "tierkunde": basiswert_arr[2]["int"]+" (IN)",
                      "geographie": basiswert_arr[2]["kk"]+" (KK)",
                      "ueberleben": basiswert_arr[2]["kon"]+" (KON)",
                      "orientierung": basiswert_arr[2]["gsk"]+" (GSK)",
                      "faehrtenlesen": basiswert_arr[2]["int"]+" (IN)"
                    }];
      $.ajax({
      type:'POST',
      url:"/naturtalente",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        naturtalente_arr=wuerfelwerte.concat(data);
      }
    }).done(function():any{
        getTable(naturtalente_arr,"naturtalente");
    });
}

function gesellschaftstalente():void{
var wuerfelwerte =[{ "id":"",
                    "feilschen": basiswert_arr[2]["mut"]+" (MUT)",
                    "einschüchtern": basiswert_arr[2]["mut"]+" (MUT)",
                    "lügen_täuschen": basiswert_arr[2]["cha"]+" (CHA)",
                    "betoeren": basiswert_arr[2]["cha"]+" (CHA)",
                    "anführen_Überreden": basiswert_arr[2]["cha"]+" (CHA)",
                    "etikette": basiswert_arr[2]["cha"]+" (CHA)",
                    "menschenkenntnis": basiswert_arr[2]["kl"]+" (KL)"
                    },
                  { "id":"",
                    "feilschen": basiswert_arr[2]["int"]+" (IN)",
                    "einschüchtern": basiswert_arr[2]["kk"]+" (KK)",
                    "lügen_täuschen": basiswert_arr[2]["mut"]+" (MUT)",
                    "betoeren": basiswert_arr[2]["cha"]+" (CHA)",
                    "anführen_Überreden": basiswert_arr[2]["mut"]+" (MUT)",
                    "etikette": basiswert_arr[2]["mut"]+" (MUT)",
                    "menschenkenntnis": basiswert_arr[2]["cha"]+" (CHA)"
                  },
                  { "id":"",
                    "feilschen": basiswert_arr[2]["cha"]+" (CHA)",
                    "einschüchtern": basiswert_arr[2]["kk"]+" (KK)",
                    "lügen_täuschen": basiswert_arr[2]["int"]+" (IN)",
                    "betoeren": basiswert_arr[2]["mut"]+" (MUT)",
                    "anführen_Überreden": basiswert_arr[2]["kk"]+" (KK)",
                    "etikette": basiswert_arr[2]["kl"]+" (KL)",
                    "menschenkenntnis": basiswert_arr[2]["int"]+" (IN)"
                  }];
      $.ajax({
      type:'POST',
      url:"/gesellschaftstalente",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        gesellschaftstalente_arr=wuerfelwerte.concat(data);
      }
    }).done(function():any{
      getTable(gesellschaftstalente_arr,"gesellschaftstalente");
    });
}

function spezialetalente():void{
var wuerfelwerte =[{ "id":"",
                    "reiten": basiswert_arr[2]["kk"]+" (KK)",
                    "schwimmen": basiswert_arr[2]["kon"]+" (KON)",
                    "klettern": basiswert_arr[2]["kk"]+" (KK)",
                    "unterhaltungskunst": basiswert_arr[2]["gsk"]+" (GSK)",
                    "musik_poesie":" ",
                    "schauspiel":" ",
                    "gaukelei":" ",
                    "seefahrt": basiswert_arr[2]["kl"]+" (KL)"
                  },
                  { "id":"",
                    "reiten": basiswert_arr[2]["gew"]+" (GEW)",
                    "schwimmen": basiswert_arr[2]["gsk"]+" (GSK)",
                    "klettern": basiswert_arr[2]["gew"]+" (GEW)",
                    "unterhaltungskunst": basiswert_arr[2]["cha"]+" (CHA)",
                    "musik_poesie":" ",
                    "schauspiel":" ",
                    "gaukelei":" ",
                    "seefahrt": basiswert_arr[2]["mut"]+" (MUT)"
                    },
                  { "id":"",
                    "reiten": basiswert_arr[2]["kon"]+" (KON)",
                    "schwimmen": basiswert_arr[2]["kk"]+" (KK)",
                    "klettern": basiswert_arr[2]["gsk"]+" (GSK)",
                    "unterhaltungskunst": basiswert_arr[2]["int"]+" (IN)",
                    "musik_poesie":" ",
                    "schauspiel":" ",
                    "gaukelei":" ",
                    "seefahrt": basiswert_arr[2]["int"]+" (IN)"
                  }];
      $.ajax({
      type:'POST',
      url:"/spezialetalente",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        spezialetalente_arr=wuerfelwerte.concat(data);
      }
    }).done(function():any{
        getTable(spezialetalente_arr,"spezialetalente");
    });
}

function einhandwaffen():void{
  $.ajax({
      type:'POST',
      url:"/einhandwaffen",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      einhandwaffen_arr=data;
      }
  }).done(function(){
    getTable(einhandwaffen_arr,"einhandwaffen");
  });
}

function getspielerwaffenkampftalent():void{
  let tempdata:any;
  let wk=[];
  var tempwk=[];
  $.ajax({
    type:'POST',
    url:"/spielerwaffenkampftalent",
    data: {ID:SpielerID},
    datatype:"json",
    success: function(data:any){
        tempdata=data;
        for (let i:number=0; i< tempdata.length; i++){
          tempwk = [];
          tempwk =(     [tempdata[i]["beschreibung"],
                        tempdata[i]["kampftalent_attacke"],
                        tempdata[i]["kampftalent_parade"],
                        tempdata[i]["id"]
                        ]);
          wk[i] = tempwk;
        }
        spielerwaffenkampftalent_arr=wk;
      }
    });
}

function zweihandwaffen():void{
  $.ajax({
      type:'POST',
      url:"/zweihandwaffen",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      zweihandwaffen_arr=data;
      }
  }).done(function():any{
    getTable(zweihandwaffen_arr,"zweihandwaffen");
  });
}

function fernkampfwaffen():void{
  $.ajax({
      type:'POST',
      url:"/fernkampfwaffen",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      fernkampfwaffen_arr=data;
      }
  }).done(function():any{
    getTable(fernkampfwaffen_arr,"fernkampfwaffen");
  });
}

function anderewaffen():void{
  $.ajax({
      type:'POST',
      url:"/anderewaffen",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      anderewaffen_arr=data;
      }
  }).done(function():any{
    getTable(anderewaffen_arr,"anderewaffen");
  });
}

function handwerkstalente():any{
      var wuerfelwerte =[{ "id":"",
                    "schmieden": (parseInt(basiswert_arr[2]["kk"])+parseInt(basiswert_arr[2]["kk"])+parseInt(basiswert_arr[2]["kon"]))/5+'<br>'+"(KK+KK+KON)/5",
                    "lederverarbeitung": (parseInt(basiswert_arr[2]["gsk"])+parseInt(basiswert_arr[2]["gsk"])+parseInt(basiswert_arr[2]["kon"]))/5+'<br>'+"(GSK+GSK+KON)/5",
                    "holzverarbeitung": (parseInt(basiswert_arr[2]["gsk"])+parseInt(basiswert_arr[2]["kon"])+parseInt(basiswert_arr[2]["kk"]))/5+'<br>'+"(GSK+KON+KK)/5",
                    "koch": (parseInt(basiswert_arr[2]["kl"])+parseInt(basiswert_arr[2]["gew"])+parseInt(basiswert_arr[2]["kon"]))/5+'<br>'+"(KL+GEW+KON)/5",
                    "lehren": " "
                  }];
      $.ajax({
      type:'POST',
      url:"/handwerkstalente",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        handwerkstalente_arr=wuerfelwerte.concat(data);
      }
    }).done(function():void{
      getTable(handwerkstalente_arr,"handwerkstalente");
    });
  }

function checkKKBonus():void{
  let kk = basiswert_arr[2]["kk"];
  var kkbonus=0;
  if( kk >= 10 && kk <14){
    kkbonus=1;
  }else if (kk >=14 && kk <18 ) {
    kkbonus=2
  }else if (kk >= 18){
    kkbonus=3
  }
  $.ajax({
    type:'POST',
    url:"/updatekkbonus",
    data:{ID:SpielerID,
          KKB:kkbonus},
    datatype:"json",
    success:function(data:any){
    }
  }).done(function():void{
    spielerwaffen();
  });
}

function spielerwaffen():void{
      var tempwaffen= [];
      var waffen = [[]];
      var tempdata:any;
      $.ajax({
      type:'POST',
      url:"/spielerwaffen",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        tempdata=data;
        for (let i:number =0; i< tempdata.length; i++){
          tempwaffen = [];
          tempwaffen=([tempdata[i]["id"],
                        tempdata[i]["name"],
                        tempdata[i]["beschreibung"],
                        tempdata[i]["art_id"],
                        tempdata[i]["exotisch"],
                        tempdata[i]["schaden_wuerfel"]+"+"+tempdata[i]["schaden"],
                        tempdata[i]["kk_bonus"],
                        tempdata[i]["attackebonus"],
                        tempdata[i]["paradebonus"],
                        tempdata[i]["final_at"],
                        tempdata[i]["final_pa"]]);
          waffen[i] = tempwaffen;
        }
        spielerwaffen_ar=waffen;
      }
    }).done(function():any{
      getrowTable(spielerwaffen_ar,"spielerwaffen");
    });
  }

function spielerruestungen():void{
      var tempruestung= [];
      var ruestung= [[]];
      var tempdata:any;
      $.ajax({
      type:'POST',
      url:"/spielerruestungen",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
        tempdata=data;
        for (let i:number=0; i< tempdata.length; i++){
          tempruestung = [];
          tempruestung =([tempdata[i]["id"],
                        tempdata[i]["name_beschreibung"],
                        tempdata[i]["ruestungswert"],
                        tempdata[i]["ausruestungsmodifikation"]
                        ]);
          ruestung[i] = tempruestung;
        }
        spielerruestungen_arr=ruestung;
      }
    }).done(function():void{
      getrowTable(spielerruestungen_arr,"spielerruestungen");
    });
  }

function addEditable(tablename:string,colname:string):void{
  let columnTh:any = $("#"+tablename+" th:contains('"+colname+"')");
  let columnIndex:number = columnTh.index() +1;
  $('#'+tablename+' tr td:nth-child('+columnIndex+')').css("color","#F00");
}

$(".editColumn").click(function(event:JQueryEventObject):void{
  var tablename:any = $(this).closest('table').attr('id');
  var tablemap = {
    'spielerbasiswerte': function():void{
      $('#editKL').val(basiswert_arr[1]["kl"]);
      $('#editGEW').val(basiswert_arr[1]["gew"]);
      $('#editGSK').val(basiswert_arr[1]["gsk"]);
      $('#editCHA').val(basiswert_arr[1]["cha"]);
      $('#editMUT').val(basiswert_arr[1]["mut"]);
      $('#editKON').val(basiswert_arr[1]["kon"]);
      $('#editKK').val(basiswert_arr[1]["kk"]);
      $('#editIN').val(basiswert_arr[1]["int"]);
      $("#modalspielerbasiswerte").modal();
    },
    'spielersekundarwerte': function():void{
      $('#editHP').val(sekundarwert_arr[2]["lebenspunkte"]);
      $('#editAUSD').val(sekundarwert_arr[2]["ausdauer"]);
      $('#editEE').val(sekundarwert_arr[2]["ee"]);
      $('#editAUSW').val(sekundarwert_arr[2]["ausweichen"]);
      $('#editRUE').val(sekundarwert_arr[2]["ruestung"]);
      $('#editINIT').val(sekundarwert_arr[2]["initiative"]);
      $('#editATKB').val(sekundarwert_arr[2]["attacke_basis"]);
      $('#editPAB').val(sekundarwert_arr[2]["parade_basis"]);
      $('#editLR').val(sekundarwert_arr[2]["luftresistenz"]);
      $('#editWR').val(sekundarwert_arr[2]["wasserresistenz"]);
      $('#editER').val(sekundarwert_arr[2]["erdresistenz"]);
      $('#editLEBR').val(sekundarwert_arr[2]["das_lebenderesistenz"]);
      $('#editFR').val(sekundarwert_arr[2]["feuerresistenz"]);
      $('#editEISR').val(sekundarwert_arr[2]["eisresistenz"]);
      $('#editMR').val(sekundarwert_arr[2]["metallresistenz"]);
      $('#editDTR').val(sekundarwert_arr[2]["das_toteresistenz"]);
      $('#modalsekundaerwerte').modal();
    },
    'körpertalente':function():void{
      $('#editSchleichen').val(koerperttalente_arr[4]["schleichen"]);
      $('#editAufm').val(koerperttalente_arr[4]["aufmerksamkeit"]);
      $('#editRobustheit').val(koerperttalente_arr[4]["robustheit"]);
      $('#editFingerF').val(koerperttalente_arr[4]["fingerfertigkeit"]);
      $('#editZechen').val(koerperttalente_arr[4]["zechen"]);
      $('#editTaschenD').val(koerperttalente_arr[4]["taschendiebstahl"]);
      $('#modalkoerpertalente').modal();
    },
    'wissenstalente':function():void{
      $('#editHeilung').val(wissenstalente_arr[4]["heilung"]);
      $('#editGifte').val(wissenstalente_arr[4]["gifte"]);
      $('#editSchriften').val(wissenstalente_arr[4]["schriften"]);
      $('#editMagie').val(wissenstalente_arr[4]["magie"]);
      $('#editGassenwissen').val(wissenstalente_arr[4]["gassenwissen"]);
      $('#editWeltenkenntnis').val(wissenstalente_arr[4]["weltenkenntnis"]);
      $('#editSprachen').val(wissenstalente_arr[4]["sprachen"]);
      $('#editAnatomie').val(wissenstalente_arr[4]["anatomie"]);
      $('#modalwissenstalente').modal();
    },
    'einhandwaffen':function():void{
      $('#editEinhandschwerter').val(einhandwaffen_arr[1]["schwerter"]);
      $('#editBeile').val(einhandwaffen_arr[1]["beile"]);
      $('#editFlegel').val(einhandwaffen_arr[1]["flegel"]);
      $('#editDolche').val(einhandwaffen_arr[1]["dolche"]);
      $('#modaleinhandwaffen').modal();
    },
    'zweihandwaffen':function():void{
      $('#editzweihandschwerter').val(zweihandwaffen_arr[1]["schwerter"]);
      $('#editaexte').val(zweihandwaffen_arr[1]["aexte"]);
      $('#editkolben').val(zweihandwaffen_arr[1]["kolben"]);
      $('#editstaebe').val(zweihandwaffen_arr[1]["staebe"]);
      $('#editstangenwaffen').val(zweihandwaffen_arr[1]["stangenwaffen"]);
      $('#modalzweihandwaffen').modal();
    },
    'naturtalente': function():void{
      $('#editkraeuter').val(naturtalente_arr[4]["kraeuterkunde"]);
      $('#edittierkunde').val(naturtalente_arr[4]["tierkunde"]);
      $('#editgeographie').val(naturtalente_arr[4]["geographie"]);
      $('#editueberleben').val(naturtalente_arr[4]["ueberleben"]);
      $('#editorientierung').val(naturtalente_arr[4]["orientierung"]);
      $('#editfaehrtenlesen').val(naturtalente_arr[4]["faehrtenlesen"]);
      $('#modalnaturtalente').modal();
    },
    'fernkampfwaffen': function():void{
      $('#editwurfwaffen').val(fernkampfwaffen_arr[1]["wurfwaffen"]);
      $('#editboegen').val(fernkampfwaffen_arr[1]["boegen"]);
      $('#editarmbrueste').val(fernkampfwaffen_arr[1]["armbrueste"]);
      $('#modalfernkampf').modal();
    },
    'anderewaffen': function():void{
      $('#editschilde').val(anderewaffen_arr[1]["schilde"]);
      $('#editexotische').val(anderewaffen_arr[1]["exotische_waffen"]);
      $('#editunbewaffnet').val(anderewaffen_arr[1]["unbewaffnet"]);
      $('#modalanderewaffen').modal();
    },
    'handwerkstalente': function():void{
      $('#editschmieden').val(handwerkstalente_arr[2]["schmieden"]);
      $('#editlederverarbeitung').val(handwerkstalente_arr[2]["lederverarbeitung"]);
      $('#editholzverarbeitung').val(handwerkstalente_arr[2]["holzverarbeitung"]);
      $('#editkoch').val(handwerkstalente_arr[2]["koch"]);
      $('#editlehren').val(handwerkstalente_arr[2]["lehren"]);
      $('#modalhandwerkstalente').modal();
    },
    'spielerruestungen': function():void{
      var text=$(event.target).closest("th").attr('id');
      if(text == "Ruestwert"){
        getModaltab("modtabruestungwert",spielerruestungen_arr,2);
        $('#modspielerruestwert').modal();
      }else{
        getModaltab("modtabruestung",spielerruestungen_arr,3);
        $('#modalspielerruestungen').modal();
      }
    }
  };
  var showmodal = tablemap[tablename];
  if (showmodal) showmodal();
});
//Aktuelle Sekundärwerte werden auf die Normalwert zurückgesetzt
$(document).on('click',"#fullrest", function():void{
  $.ajax({
    type:'POST',
    url:"/sekundarwertefullreset",
    data:{ID:SpielerID},
    datatype:"json",
    success:function(data:any){
    }
  }).done(function():void{
    sekwerte();
  });
});
//---------------------------------------------------
// Skillinteraktion +/-
//---------------------------------------------------
//Ermittelt die ID des offen modals
$('.modal').on('shown.bs.modal', function():void{
    modalid = $(this).attr('id');
});
$(document).on('click','.blussi', function():void{
  var counter:any = $(this).closest('tr').find("input");
  var counterwert:number = counter.val();
  counterwert ++;
  counter.val(counterwert);
});
$(document).on('click','.minus', function():void{
  //var id=$(event.target).closest("th").attr('id');
  var counter:any = $(this).closest('tr').find("input");
  var counterwert:number = counter.val();
  counterwert --;
  counter.val(counterwert);
});
$(document).on('click','.atminus', function():void{
  //var id=$(event.target).closest("th").attr('id');
  var at:any = $(this).closest('tr').find(".atwert");
  var talentpunkte:any = $(this).closest('tr').find(".Waffentalent");
  var atwert:number = at.text();
  var talentpunktewert:number = talentpunkte.text();
  if(atwert > 0){
    atwert --;
    talentpunktewert ++;
  }
  at.text(atwert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('click','.atblussi', function():void{
  //var id=$(event.target).closest("th").attr('id');
  var at:any = $(this).closest('tr').find(".atwert");
  var talentpunkte:any = $(this).closest('tr').find(".Waffentalent");
  var atwert:number = at.text();
  var talentpunktewert:number = talentpunkte.text();
  atwert ++;
  talentpunktewert --;
  at.text(atwert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('click','.paminus', function():void{
  //var id=$(event.target).closest("th").attr('id');
  var pa:any = $(this).closest('tr').find(".pawert");
  var talentpunkte:any = $(this).closest('tr').find(".Waffentalent");
  var pawert:number = pa.text();
  var talentpunktewert:number = talentpunkte.text();
  if(pawert >0){
    pawert --;
    talentpunktewert ++;
  }
  pa.text(pawert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('click','.pablussi', function():void{
  //var id=$(event.target).closest("th").attr('id');
  var pa:any = $(this).closest('tr').find(".pawert");
  var talentpunkte:any = $(this).closest('tr').find(".Waffentalent");
  var pawert:number = pa.text();
  var talentpunktewert:number = talentpunkte.text();
  pawert ++;
  //if (check)
  talentpunktewert --;
  pa.text(pawert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('change','.Waffentalent', function():void{
  var pa:any = $(this).closest('tr').find(".pawert");
  var at:any = $(this).closest('tr').find(".atwert");
  var pawert:number= pa.text();
  var atwert:number = at.text();
  var talentpunktewert:number = $(this).text();
  if (talentpunktewert == 0){
    at.closest('tr').find('.atblussi').prop("disabled",true);
    at.closest('tr').find('.atminus').prop("disabled",false);
    pa.closest('tr').find('.pablussi').prop("disabled",true);
    pa.closest('tr').find('.paminus').prop("disabled",false);
  //Wenn AT Kampftalent um 5 hoeher ist als PA, muss at+ geblockt werden
  }else if ((atwert - pawert)>=5) {
    at.closest('tr').find('.atblussi').prop("disabled",true);
    at.closest('tr').find('.atminus').prop("disabled",false);
    pa.closest('tr').find('.pablussi').prop("disabled",false);
    pa.closest('tr').find('.paminus').prop("disabled",true);
  //Same fuer PA
}else if ((pawert - atwert)>=5) {
    at.closest('tr').find('.atblussi').prop("disabled",false);
    at.closest('tr').find('.atminus').prop("disabled",true);
    pa.closest('tr').find('.pablussi').prop("disabled",true);
    pa.closest('tr').find('.paminus').prop("disabled",false);
  }else{
    at.closest('tr').find('.atblussi').prop("disabled",false);
    at.closest('tr').find('.atminus').prop("disabled",false);
    pa.closest('tr').find('.pablussi').prop("disabled",false);
    pa.closest('tr').find('.paminus').prop("disabled",false);
  }
});
$(document).on('click','.editfinal', function():void{
  var idtext:any = $(this).closest('th').attr("id");
  var idmap = {
    'Final_AT': function():void{
      getModalATPAtab("modtabATPA",spielerwaffen_ar,spielerwaffenkampftalent_arr);
      $('#modalFinalATPA').modal();
    },
    'Final_PA': function():void{
      getModalATPAtab("modtabATPA",spielerwaffen_ar,spielerwaffenkampftalent_arr);
      $('#modalFinalATPA').modal();
    }
  }
  var showmodal = idmap[idtext];
  if(showmodal) showmodal();
});
//---------------------------------------------------
//Modalsubmitfunktionen ab hier
//---------------------------------------------------
$('#submitBasiswerte').click(function():void{
      let kl:number = $('#editKL').val();
      let gew:number= $('#editGEW').val();
      let gsk:number= $('#editGSK').val();
      let cha:number= $('#editCHA').val();
      let mut:number= $('#editMUT').val();
      let kon:number= $('#editKON').val();
      let kk:number = $('#editKK').val();
      let int:number= $('#editIN').val();
  $.ajax({
      type:'POST',
      url:"/updatebasismod",
      //Daten an den Server in JSON
      data: {ID:SpielerID,
            KL:kl,
            GEW:gew,
            GSK:gsk,
            CHA:cha,
            MUT:mut,
            KON:kon,
            KK:kk,
            INT:int},
      datatype:"json",
      //callback
      success: function(data:any){
      //daten[0]["id"];
      $('#modalspielerbasiswert').modal('toggle');
    }
  }).done(function():any{
    bwbasis();
  });
});

$('#submitSekwerte').click(function():void{
  let hp:number         = $('#editHP').val();
  let ausdauer:number   = $('#editAUSD').val();
  let ee:number         = $('#editEE').val();
  let ausweichen:number = $('#editAUSW').val();
  let rue:number        = $('#editRUE').val();
  let init:number       = $('#editINIT').val();
  let atkb:number       = $('#editATKB').val();
  let pab:number        = $('#editPAB').val();
  let lr:number         = $('#editLR').val();
  let wr:number         = $('#editWR').val();
  let er:number         = $('#editER').val();
  let lebr:number       = $('#editLEBR').val();
  let fr:number         = $('#editFR').val();
  let eisr:number       = $('#editEISR').val();
  let mr:number         = $('#editMR').val();
  let dtr:number        = $('#editDTR').val();
  $.ajax({
    type:'POST',
    url:"/updatesekundaraktuell",
    data:{ID:SpielerID,
          HP:hp,
          AUSD:ausdauer,
          EE:ee,
          AUSW:ausweichen,
          RUE:rue,
          INIT:init,
          ATKB:atkb,
          PAB:pab,
          LR:lr,
          WR:wr,
          ER:er,
          LEBR:lebr,
          FR:fr,
          EISR:eisr,
          MR:mr,
          DTR:dtr},
    datatype:"json",
    success:function(data:any){
      $('#modalsekundaerwerte').modal('toggle');
    }
  }).done(function():void{
  sekwerte();
  });
});

$('#submitKörpertalente').click(function():void{
let schleichen:number       = $('#editSchleichen').val();
let aufmerksamkeit:number   = $('#editAufm').val();
let robustheit:number       = $('#editRobustheit').val();
let fingerfertigkeit:number = $('#editFingerF').val();
let zechen:number           = $('#editZechen').val();
let taschendiebstahl:number = $('#editTaschenD').val();
$.ajax({
    type:'POST',
    url:"/updatekoerpertalente",
    data:{ID:SpielerID,
          SCHL:schleichen,
          AUF:aufmerksamkeit,
          ROB:robustheit,
          FIN:fingerfertigkeit,
          ZEC:zechen,
          TAS:taschendiebstahl},
    datatype:"json",
    success:function(data:any){
      $('#modalkoerpertalente').modal('toggle');
      }
    }).done(function():void{
      korprtalente();
  });
});

$('#submitwissenstalente').click(function():void{
let heilung:number        =  $('#editHeilung').val();
let gifte:number          =  $('#editGifte').val();
let schriften:number      =  $('#editSchriften').val();
let magie:number          =  $('#editMagie').val();
let gassenwissen:number   =  $('#editGassenwissen').val();
let weltenkenntnis:number =  $('#editWeltenkenntnis').val();
let sprachen:number       =  $('#editSprachen').val();
let anatomie:number       = $('#editAnatomie').val();
$.ajax({
    type:'POST',
    url:"/updatewissenstalente",
    data:{ID:SpielerID,
          HEI:heilung,
          GIF:gifte,
          SCH:schriften,
          MAG:magie,
          GAS:gassenwissen,
          WEL:weltenkenntnis,
          SPR:sprachen,
          ANA:anatomie},
    datatype:"json",
    success:function(data:any){
      $('#modalwissenstalente').modal('toggle');
    }
  }).done(function():void{
      wissenstalente();
    });
  });

$('#submiteinhandwaffen').click(function():void{
let schwerter:number = $('#editEinhandschwerter').val();
let beile:number     = $('#editBeile').val();
let flegel:number    = $('#editFlegel').val();
let dolche:number    = $('#editDolche').val();
$.ajax({
    type:'POST',
    url:"/updateeinhandwaffen",
    data:{ID:SpielerID,
          SCH:schwerter,
          BEI:beile,
          FLE:flegel,
          DOL:dolche
        },
    datatype:"json",
    success:function(data:any){
      $('#modaleinhandwaffen').modal('toggle');
    }
  }).done(function():void{
      einhandwaffen();
    });
  });

$('#submitnaturtalente').click(function():void{
let kraeuter:number      = $('#editkraeuter').val();
let geographie:number    = $('#editgeographie').val();
let ueberleben:number    = $('#editueberleben').val();
let orientierung:number  = $('#editorientierung').val();
let faehrtenlesen:number = $('#editfaehrtenlesen').val();
$.ajax({
    type:'POST',
    url:"/updatenaturtalente",
    data:{ID:SpielerID,
          KRA:kraeuter,
          GEO:geographie,
          UEB:ueberleben,
          ORI:orientierung,
          FAE:faehrtenlesen
        },
    datatype:"json",
    success:function(data:any){
      $('#modalnaturtalente').modal('toggle');
    }
  }).done(function():void{
      naturtalente();
    });
  });

$('#submitzweihandwaffen').click(function():void{
let zweihandschwerter:number= $('#editzweihandschwerter').val();
let kolben:number           = $('#editaexte').val();
let aexte:number            = $('#editaexte').val();
let staebe:number           = $('#editstaebe').val();
let stangenwaffen:number    = $('#editstangenwaffen').val();
$.ajax({
    type:'POST',
    url:"/updatezweihandwaffen",
    data:{ID:SpielerID,
          ZWS:zweihandschwerter,
          KOL:kolben,
          AEX:aexte,
          STA:staebe,
          SGN:stangenwaffen
        },
    datatype:"json",
    success:function(data:any){
      $('#modalzweihandwaffen').modal('toggle');
    }
  }).done(function():void{
      zweihandwaffen();
    });
  });

$('#submitfernkampf').click(function():void{
let wurfwaffen:number= $('#editwurfwaffen').val();
let boegen:number    = $('#editboegen').val();
let armbrueste:number= $('#editarmbrueste').val();
$.ajax({
    type:'POST',
    url:"/updatefernkampf",
    data:{ID:SpielerID,
          WUR:wurfwaffen,
          BOE:boegen,
          ARM:armbrueste
        },
    datatype:"json",
    success:function(data:any){
      $('#modalfernkampf').modal('toggle');
    }
  }).done(function():void{
      fernkampfwaffen();
    });
  });

$('#submitanderewaffen').click(function():void{
let schilde:number     = $('#editschilde').val();
let exotische:number   = $('#editexotische').val();
let unbewaffnet:number = $('#editunbewaffnet').val();
$.ajax({
    type:'POST',
    url:"/updateanderewaffen",
    data:{ID:SpielerID,
          SCH:schilde,
          UNB:unbewaffnet,
          EXO:exotische
        },
    datatype:"json",
    success:function(data:any){
      $('#modalanderewaffen').modal('toggle');
    }
  }).done(function():void{
      anderewaffen();
    });
  });

$('#submithandwerkstalente').click(function():void{
let schmieden:number         = $('#editschmieden').val();
let lederverarbeitung:number = $('#editlederverarbeitung').val();
let holzverarbeitung:number  = $('#editholzverarbeitung').val();
let koch:number              = $('#editkoch').val();
let lehren:number            = $('#editlehren').val();
$.ajax({
    type:'POST',
    url:"/updatehandwerkstalente",
    data:{ID:SpielerID,
          SCH:schmieden,
          LED:lederverarbeitung,
          HOL:holzverarbeitung,
          KOC:koch,
          LEH:lehren
        },
    datatype:"json",
    success:function(data){
      $('#modalhandwerkstalente').modal('toggle');
    }
    }).done(function(){
      handwerkstalente();
    });
  });

function getModaltab (modtabid:string,dataarray:any,index:number):any{
  var $tbody:any = $('#'+modtabid).find('tbody');
  $tbody.empty();
  var text:string;
  for (let i:number = 0; i < dataarray.length; i++){
    text +="<tr>";
    text +="<td>"+dataarray[i][1]+"</td>";
    text +="<td> <input type=\"number\" value="+dataarray[i][index]+">";
    text +="<button type=\"button\" class=\"btn btn-success blussi\">+</button>";
    text +="<button type=\"button\" class=\"btn btn-danger minus\">-</button>";
    text +="</td></tr>";
  }
  $tbody.append(text);
  text = "";
}

function getModalATPAtab(modtabid:string,dataarray:any,kampftalentarray:any):void{
  $('#titelATPA').text("Final AT/PA Modifikation");
  var $tbody = $('#'+modtabid).find('tbody');
  let text:string;
  let atwert:number;
  let pawert:number;
  let wert:number;
  let disable:string;
  let waffentalent=[];
  $tbody.empty();
  for (let i:number = 0; i < dataarray.length; i++){
    waffentalent= getwaffentalent(dataarray[i][3],dataarray[i][4]);
    atwert=kampftalentarray[i][1];
    pawert=kampftalentarray[i][2];
    wert = (waffentalent[0]-atwert-pawert);
    if (wert == 0){
      disable = "disabled";
    }else{
      disable="";
    }
    text +="<tr>";
    text +="<td>"+dataarray[i][1]+"<h6>Talent: "+waffentalent[1]+"</h6><h6 class=\"Waffentalent\">"+wert+"</h6></td>";
    text +="<td><span>AT: <h5 class=\"atwert\">"+atwert+"</h5></span>";
    text +="<button "+disable+" type=\"button\" class=\"btn btn-success atblussi\">+</button>";
    text +="<button type=\"button\" class=\"btn btn-danger atminus\">-</button>";
    text +="<td><span>PA: <h5 class=\"pawert\">"+pawert+"</h5></span>";
    text +="<button "+disable+" type=\"button\" class=\"btn btn-success pablussi\">+</button>";
    text +="<button type=\"button\" class=\"btn btn-danger paminus\">-</button>";
    text +="</td></tr>";
  }
  $tbody.append(text);
}

function getwaffentalent(id:number,exotic:number):any[]{
  if (exotic == 1){
    return [anderewaffen_arr[2]["exotische_waffen"],"Exotische Waffe"];
  }
 var art = {
  1: [einhandwaffen_arr[2]["schwerter"],"Einhandschwerter"] ,
  2: [einhandwaffen_arr[2]["beile"],"Beile"] ,
  3: [einhandwaffen_arr[2]["flegel"],"Flegel"] ,
  4: [einhandwaffen_arr[2]["dolche"],"Dolche"] ,
  5: [zweihandwaffen_arr[2]["schwerter"],"Schwerter"] ,
  6: [zweihandwaffen_arr[2]["aexte"],"Äxte"] ,
  7: [zweihandwaffen_arr[2]["kolben"],"Kolben"] ,
  8: [zweihandwaffen_arr[2]["staebe"],"Stäbe"] ,
  9: [zweihandwaffen_arr[2]["stangenwaffen"],"Stangenwaffen"] ,
  10: [anderewaffen_arr[2]["schilde"],"Schilde"] ,
  11: [anderewaffen_arr[2]["unbewaffnet"],"Unbewaffnet"]
};
  return art[id];
};

$('#submitspielerruesungen').click(function():void{
  //Finde alle Inputs der ID und gebe die Werte durch die Map funktion wieder
  let inputsruestungsmod = $('#modtabruestung').find("input").map(function():number{
    return $(this).val();
  }).toArray();
  let ruestungname = $('#modtabruestung td:even').map(function():string{
    return $(this).text();
  }).toArray();
  $.ajax({
    type:'POST',
    url:"/updatespielerruestungen",
    data:{VALUEARRAY:inputsruestungsmod,
          NAMEARRAY:ruestungname,
          ID:SpielerID
        },
    datatype:"json",
    success:function(data:any){
      $('#modalspielerruestungen').modal('toggle');
    }
  }).done(function():void{
      spielerruestungen();
      sekwerte();
    });
});

$('#submitspielerruesungswert').click(function():void{
  //Finde alle Inputs der ID und gebe die Werte durch die Map funktion wieder
  let inputsruestungswert= $('#modtabruestungwert').find("input").map(function():number{
    return $(this).val();
  }).toArray();
  let ruestungname = $('#modtabruestungwert td:even').map(function():string{
    return $(this).text();
  }).toArray();
  $.ajax({
    type:'POST',
    url:"/updatespielerruestungenwert",
    data:{VALUEARRAY:inputsruestungswert,
          NAMEARRAY:ruestungname,
          ID:SpielerID
        },
    datatype:"json",
    success:function(data:any){
      $('#modspielerruestwert').modal('toggle');
    }
  }).done(function():void{
      spielerruestungen();
      sekwerte();
  });
});

$('#submitfinalATPA').click(function():void{
  //Finde alle Inputs der ID und gebe die Werte durch die Map funktion wieder
  let atwert= $('#modtabATPA').find(".atwert").map(function():number{
    return $(this).text();
  }).toArray();
  let pawert= $('#modtabATPA').find(".pawert").map(function():string{
    return $(this).text();
  }).toArray();
  let waffenids=[];
  for (let i:number=0; i< spielerwaffenkampftalent_arr.length; i++){
    waffenids.push(spielerwaffenkampftalent_arr[i][3]);
  }
  $.ajax({
    type:'POST',
    url:"/updatespielerwaffenkampftalent",
    data:{ATARRAY:atwert,
          PAARRAY:pawert,
          WIDARRAY:waffenids,
          ID:SpielerID
        },
    datatype:"json",
    success:function(data:any){
      $('#modalFinalATPA').modal('toggle');
    }
  }).done(function():void{
      spielerwaffen();
      getspielerwaffenkampftalent();
    });
});

//---------------------------------------------------
// Neue Ausruestung hinzufügen /Modifizieren
//---------------------------------------------------
// Waffen hinzufügen
$(document).on('click',"#addWaffe",function():void{
  $('#modaladdwaffe').modal("toggle");
});
$(document).on('click',"#addRuestung",function():void{
  $('#modaladdrues').modal("toggle");
});
$(document).on('click',"#submitNeueWaffe",function():void{
  let newwaffenid:number;
  let waffenname:string=$('#Waffenname').val();
  let waffenart:number=$('#Waffenartauswahl').val();
  let waffenexo:number=$('.WaffenexoRadio').val();
  let beschreibung:string=$('#Waffenbeschreibung').val();
  let wuerfelschaden:string=$('#WaffenWuerfel').val();
  let zusatzschaden:number=$('#WaffenZschaden').val();
  let atbonus:number = $('#WaffeATKBonus').val();
  let pabonus:number = $('#WaffePABonus').val();
  let kk:number = basiswert_arr[2]["kk"];
  let kkbonus=0;
  if( kk >= 10 && kk <14){
    kkbonus=1;
  }else if (kk >=14 && kk <18 ) {
    kkbonus=2
  }else if (kk >= 18){
    kkbonus=3
  }
  let artname:string = getWaffenartname(waffenart);
  $.ajax({
    type:"POST",
    url:"/getmaxwaffenid",
    datatype:"json",
    success:function(data:any){
        newwaffenid=parseInt(data[0]["id"]);
    }
  }).done(function():void{
    $.ajax({
      type:"POST",
      url:"/addnewwaffe",
      data:{SP_ID:SpielerID,
            WP_ID:newwaffenid,
            WNAME:waffenname,
            WAFRT: waffenart,
            WARTNAME:artname,
            WAFEXO:waffenexo,
            BESCH:beschreibung,
            WUESCHADEN:wuerfelschaden,
            ZSCHADEN:zusatzschaden,
            ATBONUS:atbonus,
            PABONUS:pabonus,
            KKBONUS:kkbonus},
      datatype:"json",
      success:function(data:any){
      }
    }).done(function():void{
      spielerwaffen();
      getspielerwaffenkampftalent();
    });
  });
});
// Waffe Modifikation
//FUNKTIONIERT NOCH NICHT!
$('.spielerinventar').on('click','tbody td', function(e:JQueryEventObject):void{
  let rowdata=[];
  let header=[];
  //TODO: Titel finden
  let title:string=$(this).closest('div').find('h2').text();
  let $row:any=$(e.target).closest('tr'),
  $tds =$row.find('td');
  $.each($tds,function():void{
    rowdata.push($(this).text());
  });
  $.each($(this).closest('table').find('.eqheader th'),function():void{
    header.push($(this).text());
  });
  createInventarmodal(title,header,rowdata);
  $('#modalInventaredit').modal("toggle");
});

 function createInventarmodal(title:string,header:any,rowdata:any){
  $('#titelInventar').text(title+" Modifikation");
  var $tbody = $('#modtabInventar').find('tbody');
  let type:string="text";
  let text:string;
  let disable:string;
  let checked:string;
  let unchecked:string;
  let reg:any= /^\d+$/;
  $tbody.empty();
  //Erstes Element ist die id... Die soll nicht veränderbar sein
  for (let i:number = 0; i < header.length; i++){
    if(header[i].includes("Final AT")  || header[i].includes("Final PA") || header[i].includes("KK-Bonus")){
      continue;
    }
    if (i == 0){
      disable = "disabled";
    }else{
      disable="";
    }
    if(reg.test(rowdata[i])){
      type="number";
    }else{
      type="text";
    }
    text +="<tr>";
    text +="<td>"+header[i]+"</td>";
    text +="<td>";
    if(header[i]=="Exotisch"){
      if(rowdata[i]=="1"){
        checked="checked";
        unchecked="";
      }else{
        checked="";
        unchecked="checked";
      }
      text +="<div class=\"form-check-inline\"";
      text +="<label class=\"form-check-label\">";
      text +="<input type=\"radio\" class=\"form-check-input inventarinput\" value=\"1\" name=\"optradio\" "+checked+">Ja";
      text +="</label>";
      text +="</div>";
      text +="<div class=\"form-check-inline\">";
      text +="<label class=\"form-check-label\">";
      text +="<input type=\"radio\" class=\"form-check-input inventarinput\" value=\"0\" name=\"optradio\" "+unchecked+">Nein";
      text +="</label></div>";
    }else if(header[i]=="Art"){
      text +="<div class=\"input-group mb-3\">";
        text+="<select class=\"custom-select\" id=\"Changewaffenartauswahl\">";
          text+="<option value=\"1\">Einhandschwer</option>";
          text+="<option value=\"2\">Beil</option>";
          text+="<option value=\"3\">Flegel</option>";
          text+="<option value=\"4\">Dolch</option>";
          text+="<option value=\"5\">Zweihandschwert</option>";
          text+="<option value=\"6\">Axt</option>";
          text+="<option value=\"7\">Kolben</option>";
          text+="<option value=\"8\">Stab</option>";
          text+="<option value=\"9\">Stangenwaffe</option>";
          text+="<option value=\"10\">Schild</option>";
          text+="<option value=\"11\">Unbewaffnet</option>";
          text+="<option value=\"12\">Bogen</option>";
          text+="<option value=\"13\">Armbrust</option>";
          text+="<option value=\"14\">Wurfwaffe</option>";
      text+="</select>";
    text+="</div>";
    //QOL setzt "selected" bei der richtigen Waffenartid
    text = text.replace("<option value=\""+rowdata[i]+"\">","<option selected value=\""+rowdata[i]+"\">");
    }else{
      text +="<input "+disable+" type=\""+type+"\" class=\"inventarinput form-control\" value=\""+rowdata[i]+"\">";
      text +="</td></tr>";
    }
  }
  $tbody.append(text);
 }

 $(document).on('click','#submitInventaredit',function():void{
   var titel=$('#titelInventar').text().split(" ")[0];
     titel=titel.replace("+","");
     titel=titel.replace("-","");
     titel = titel.replace(/\s+/g, "");
	console.log("Titel: "+titel);
   //MUss als Objekt angelegt werden! sonst wird exotisch nicht richtig aufgeloest
   var dataobj={};
   var key:string;
   var value:any;
   var artname:string;
   var gesschaden=[];
   var wschaden:string;
   var zschaden:number;
   var attributarr=$('#modtabInventar').find('tr').each(function():void{
     key=$(this).find("td:eq(0)").text();
     //Das Wort EDIT hängt noch in der Zeile ... kommt später weg
     key = key.replace(' Edit',"");
     if(key == "Exotisch"){
        value=$("input[name='optradio']:checked").val();
     }else if(key=="Art"){
        value=$("#Changewaffenartauswahl").val();
     }
     else{
       //selector für die zweite Spalte in der Tabellenreie
        value=$(this).find("td:nth-child(2) input").val();
     }
     dataobj[key]=value;
   });
   var inventarsub = {
  'Waffen': function():void{
    artname=getWaffenartname(dataobj["Art"]);
    //Der Waffenschaden wird in der Gesamtsumme dargestellt
    gesschaden=dataobj["Schaden (mit KK)"].split('+');
    wschaden=gesschaden[0];
    //KK-Bonus wird in der DB bereits verrechnet ... Muss abgezogen werden
    zschaden=parseInt(gesschaden[1])-parseInt(spielerwaffen_ar[0][6]);
 $.ajax({
    type:"POST",
    url:"/updatespielerwaffen",
    data:{SP_ID:SpielerID,
          WP_ID:dataobj["id"],
          WNAME:dataobj["Name"],
          WAFRT: dataobj["Art"],
          WARTNAME:artname,
          WAFEXO:dataobj["Exotisch"],
          BESCH:dataobj["Beschreibung"],
          WUESCHADEN:wschaden,
          ZSCHADEN:zschaden,
          ATBONUS:dataobj["Attackebonus"],
          PABONUS:dataobj["Paradebonus"]
        },
    datatype:"json",
    success:function(data:any){
    }
  }).done(function():void{
  spielerwaffen();
  });
},
  'Rüstungen':function():void{
   $.ajax({
      type:"POST",
      url:"/updatespielerruestung",
      data:{SP_ID:SpielerID,
            WP_ID:dataobj["id"],
            WNAME:dataobj["Name+Beschreibung"],
            RWERT: dataobj["Rüstungswert"],
            MOD:dataobj["Ausrüstungsmalus / Bonus"]
          },
      datatype:"json",
      success:function(data:any){
      }
    }).done(function():void{
      spielerruestungen();
      sekwerte();
    });
  },
  //TODO: Musik/Poesie kontrollieren
  'Körper':function():void{
  	let talentname:any;
  	let talentwert:number;
  	talentname=Object.keys(dataobj);
  	talentwert=dataobj[talentname];
  	$.ajax({
  	type:"POST",
  	url:"/updezkoerper",
  	data:{SP_ID:SpielerID,
  		  TAN:talentname,
  		  TAW:talentwert
      },
  	datatype:"json",
  	success:function(data:any){
  	}
   }).done(function():void{
    	korprtalente();
    	sekwerte();
   });
  },
  'Natur':function():void{
  	let talentname:any;
  	let talentwert:number;
  	talentname=Object.keys(dataobj);
  	talentwert=dataobj[talentname];
  	$.ajax({
  	type:"POST",
  	url:"/updeznatur",
  	data:{SP_ID:SpielerID,
  		  TAN:talentname,
  		  TAW:talentwert
      },
  	datatype:"json",
  	success:function(data:any){
  	}
   }).done(function():void{
    	naturtalente();
   });
   },
   'Gesellschafts':function():void{
  	let talentname:any;
  	let talentwert:number;
  	talentname=Object.keys(dataobj);
  	talentwert=dataobj[talentname];
  	$.ajax({
  	type:"POST",
  	url:"/updezgesell",
  	data:{SP_ID:SpielerID,
  		  TAN:talentname,
  		  TAW:talentwert
      },
  	datatype:"json",
  	success:function(data:any){
  	}
   }).done(function():void{
    	gesellschaftstalente();
   });
   },
  'Speziale':function():void{
  	let talentname:any;
  	let talentwert:number;
  	talentname=Object.keys(dataobj);
  	talentwert=dataobj[talentname];
  	$.ajax({
  	type:"POST",
  	url:"/updezspeziale",
  	data:{SP_ID:SpielerID,
  		  TAN:talentname,
  		  TAW:talentwert
      },
  	datatype:"json",
  	success:function(data:any){
  	}
   }).done(function():void{
    	gesellschaftstalente();
   });
  }
  }
  var submitinv = inventarsub[titel];
  if (submitinv) submitinv();
  });

  $(document).on('click','#deleteItem',function():void{
    var titel=$('#titelInventar').text().split(" ")[0];
      titel=titel.replace("+","");
      titel=titel.replace("-","");
      titel = titel.replace(/\s+/g, "");
    //MUss als Objekt angelegt werden! sonst wird exotisch nicht richtig aufgeloest
    var dataobj={};
    var key:string;
    var value:any;
    var attributarr=$('#modtabInventar').find('tr').each(function():void{
      key=$(this).find("td:eq(0)").text();
      key = key.replace(' Edit',"");
      if(key == "Exotisch"){
         value=$("input[name='optradio']:checked").val();
      }else if(key=="Art"){
         value=$("#Changewaffenartauswahl").val();
      }
      else{
        //selector für die zweite Spalte in der Tabellenreie
         value=$(this).find("td:nth-child(2) input").val();
      }
      dataobj[key]=value;
    });
    var inventarsub = {
   'Waffen': function():void{
  $.ajax({
     type:"POST",
     url:"/deletespielerwaffe",
     data:{SP_ID:SpielerID,
           WP_ID:dataobj["id"]
         },
     datatype:"json",
     success:function(data:any){
     }
   }).done(function():void{
   spielerwaffen();
   });
 },
   'Rüstungen':function():void{
    $.ajax({
       type:"POST",
       url:"/deletespielerruestung",
       data:{SP_ID:SpielerID,
             WP_ID:dataobj["id"]
           },
       datatype:"json",
       success:function(data:any){
       }
     }).done(function():void{
       spielerruestungen();
       sekwerte();
     });
   }
   }
   var submitinv = inventarsub[titel];
   if (submitinv) submitinv();
});


 $(document).on('click',"#submitNeueRues",function():void{
   let ruesname:string = $('#ADDruestungsname').val();
   let rueswert:number = $('#Addruestwert').val();
   let mod:string      = $('#AddruestAM').val();
   let newruestid:number;
   $.ajax({
    type:"POST",
    url:"/getmaxruestid",
    datatype:"json",
    success:function(data:any){
        newruestid=parseInt(data[0]["id"]);
    }
  }).done(function():void{
   $.ajax({
     type:"POST",
     url:"/addruest",
     data:{SP_ID:SpielerID,
           RUESN:ruesname,
           RUESW:rueswert,
           MOD:mod,
           ID:newruestid
         },
     datatype:"json",
     success:function(data:any){
     }
   }).done(function():void{
      spielerruestungen();
      sekwerte();
    });
 });
 });

 function getWaffenartname(nummer:number):string{
  var artname = {
  1: "Einhandschwerter" ,
  2: "Beil" ,
  3: "Flegel" ,
  4: "Dolch" ,
  5: "Schwerter" ,
  6: "Axt" ,
  7: "Kolben" ,
  8: "Stab" ,
  9: "Stangenwaffe" ,
  10: "Schild" ,
  11: "Unbewaffnet",
  12: "Bogen",
  13: "Armbrust",
  14: "Wurfwaffe"
  };
  return artname[nummer];
 }

 // Tabelle verstecken oder anzeige)n
$(document).on('click','.toggletablespan', function(e:JQueryEventObject):void{
  $(this).parent().find('.toggletablespan').toggle();
  var table=$(this).parent().next('.table');
  table.toggle();
});

//TODO: Abgeklemmpt... da noch nicht fertig
$('.tablenttable').on('click','tbody tr td:nth-last-child(2)', function(e:JQueryEventObject):void{
  let rowdata=[];
  let header=[];
  let title:string=$(this).closest('div').find('h1').text();
  let $row:any=$(e.target).closest('tr'),
  $tds =$row.find('td');
  $.each($tds,function():void{
    rowdata.push($(this).text());
  });
  let talent:string=$row.find('th').text();
  let talentwert:any=rowdata[rowdata.length-2];
//  $.each($(this).closest('table').find('.eqheader th'),function():void{
//   header.push($(this).text());
//  });
  createTalentmodal(title,talent,talentwert);
  $('#modalInventaredit').modal("toggle");
});
function createTalentmodal(title:string,talent:string,wert:any){
	$('#titelInventar').text(title+" Modifikation");
	var $tbody = $('#modtabInventar').find('tbody');
	let text:string="";
  $tbody.empty();
	text+="<tr>";
	text+=	"<td>"+talent+"</td>";
	text+="<td>";
	text+=	"<input type=\"number\" class=\"talentmodalinput\" value=\""+wert+"\"/>";
	text+="</td></tr>";
  $tbody.append(text);
}
// Funktionsteil Kampfsheet beginnt hier
// Kontrolle ob Charaktersheet oder Kampfsheet
// Blende Kampfsheet aus
  $(document).on('click', "#navFightbtn", function () {
    $('#Spielersheet').hide();
    $('#Kampfsheet').show();
  });
//Blende Charaktersheet aus
$(document).on('click', "#navSheetbtn", function () {
  $('#Spielersheet').show();
  $('#Kampfsheet').hide();
});
/*
// -----------------------------------------------------------------------------
// --- Framework Teil
// -----------------------------------------------------------------------------
// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Shape(x, y, w, h, fill) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';

}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

function CanvasState(canvas) {
  // **** First some setup! ****

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****

  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;

  // **** Then events! ****

  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    var l = shapes.length;
    for (var i = l-1; i >= 0; i--) {
      if (shapes[i].contains(mx, my)) {
        var mySel = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;
      myState.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
  }, true);
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
  }, true);

  // **** Options! ****

  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();

    // ** Add stuff you want drawn in the background all the time here **

    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }

    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }

    // ** Add stuff you want drawn on top all the time here **

    this.valid = true;
  }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
init();

function init() {
  var s = new CanvasState(document.getElementById('canvas'));
  s.addShape(new Shape(40,40,50,50)); // The default is gray
  s.addShape(new Shape(60,140,40,60, 'lightskyblue'));
  // Lets make some partially transparent
  s.addShape(new Shape(80,150,60,30, 'rgba(127, 255, 212, .5)'));
  s.addShape(new Shape(125,80,30,80, 'rgba(245, 222, 179, .7)'));
  let img=new Image();
  img.src="source/images/ArrowDown.svg";
  s.drawImage(img, 100, 0, 200, 200);
}

*/
$(document).on('click', "#saveKObjCanvas", function (){
  //canvas objekt ins kampffeld uebertragen
  let canvasbild:String = $('#objektcanvas').getCanvasImage('png');
  console.log("Test: "+canvasbild);
  $('#canvas').drawImage({
    layer: true,
    draggable: true,
    bringToFront: true,
    width:100,
    height:100,
    source:"source/kampffeld/Symbole/frendlyMeele.png",
    x:150,y:150
  });
});


$(document).on('click', "#resetObjCanvas", function () {
  //canvas objekt ins kampffeld uebertragen
  $('#objektcanvas').drawRect({
    fillStyle: '#6c1',
    x: 100, y: 100,
    width: 50, height: 50
  });
});

$(document).on('change',"#Schlachtfeldselect",function(){
  let backgroundval:any = $('#Schlachtfeldselect').val();
  let imageUrl:string=getImageurl(backgroundval);
  $('#canvas').css("background", "url('"+imageUrl+"')");
});

function getImageurl(nummer:number):string{
    var url = {
    1: "/source/kampffeld/hintergrund/Brucke.jpg" ,
    2: "/source/kampffeld/hintergrund/Dorf.jpg" ,
    3: "/source/kampffeld/hintergrund/Sand.jpg" ,
    4: "/source/kampffeld/hintergrund/Schnee.jpg" ,
    5: "/source/kampffeld/hintergrund/Stadt.jpg" ,
    6: "/source/kampffeld/hintergrund/Stein.jpg" ,
    7: "/source/kampffeld/hintergrund/Wiese.jpg"
    };
    return url[nummer];
 }
 // Canvas Responsive machen
    var c = $('#canvas');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();

    //Run function when browser resizes
    $(window).resize( respondCanvas );

    function respondCanvas(){
        c.attr('width', $(container).width() ); //max width
        c.attr('height', $(container).height() ); //max height

        //Call a function to redraw other content (texts, images etc)
    }

    //Initial call
    respondCanvas();});
