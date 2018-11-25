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
var SpielerID;
var Spielernamen;
var modalid;

$( document ).ready(function() {
  function getAlldata(){
      SpielerID=$('#SpielerID').val();
      bwbasis();
      sekwerte();
      einhandwaffen();
      zweihandwaffen();
      fernkampfwaffen();
      anderewaffen();
  }

  function createAllTables(){
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

    $("#myClickBtn").click(function(){
      getAlldata();
      //createAllTables();
      $('#Spielerdaten').hide();
    });

    $("#gobtn").click(function(){
        //dataTab("spielerruestungen",spielerruestungen_arr);
     //   getTable(handwerkstalente_arr,"handwerkstalente");
    });
function getNamen(){
  $.ajax({
      type:'POST',
      url:"source/php/spielername.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        Spielernamen=(JSON.parse(data))["name"];
      }
    }).done(function(){
      createNavbar();
    });
}
function createNavbar(){
  $('#NavName').text("["+SpielerID+"] "+Spielernamen);
  $('#NavLeben').text("HP: "+sekundarwert_arr[2]["lebenspunkte"]);
  $('#NavAusdauer').text("Ausdauer: "+sekundarwert_arr[2]["ausdauer"]);
  $('#NavEE').text("EE: "+sekundarwert_arr[2]["ee"]);
  $('#navbarNavAltMarkup').collapse('show');
}

function bwbasis(){
  $.ajax({
      type:'POST',
      url:"source/php/bwbasis.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      basiswert_arr=JSON.parse(data);
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

function sekwerte(){
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
                      "das_toteresistenz" : "IN/4",}];
  $.ajax({
      type:'POST',
      url:"source/php/sekundarwerte.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      sekundarwert_arr=kalkulation.concat(JSON.parse(data));
      }
  }).done(function(){
    getTable(sekundarwert_arr,"spielersekundarwerte");
    getNamen();
  });
}

function getTable(data,htmlobject){
    var $tbody = $('#'+htmlobject).find('tbody');
    $tbody.empty();
    var tabledef = [];
    var tabledata = [];
    var tablerow = [];
    for (i =0 ; i< data.length; i++){
        if ( i == 0){
            $.each(data[i],function (k,v){
              tabledef.push(k);
            });
        }
    }
    var rowtext;
    var celltext;
    for (i = 1; i < tabledef.length; i++){
    rowtext +="<tr><th scope=\"row\">"+translate(tabledef[i])+"</th>";
    for (j = 0; j < data.length; j++){
      if (!data[j][tabledef[i]]){
          celltext = "Nicht erlernt";
      }else {
            celltext = data[j][tabledef[i]];
      }
      rowtext +="<td>"+celltext+"</td>";
    }
    rowtext +="</tr>";
    $tbody.append(rowtext);
    rowtext = "";
  }
}

function getrowTable(data,htmlobject){
  var $tbody = $('#'+htmlobject).find('tbody');
  $tbody.empty();
  var tabledata = [];
  var tablerow = [];
  var rowtext;
  var celltext = "";
  for (i = 0; i < data.length; i++){
    rowtext +="<tr>";
    for (j = 0; j < data[i].length; j++){
      celltext = data[i][j];
      rowtext +="<td>"+celltext+"</td>";
    }
    rowtext +="</tr>";
    $tbody.append(rowtext);
    rowtext = "";
  }
}

function translate (word){
  var kuerzel = {
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
      "betoeren":"Betören"
  };
  return kuerzel[word] || word;
  }

function korprtalente(){
var wuerfelwerte = [{ "id":"",
                      "schleichen": basiswert_arr[2]["gsk"]+" (GSK)",
                      "aufmerksamkeit": basiswert_arr[2]["mut"]+" (MUT)",
                      "robustheit": basiswert_arr[2]["gew"]+" (GEW)",
                      "fingerfertigkeit": basiswert_arr[2]["gsk"]+" (GSK)",
                      "zechen": basiswert_arr[2]["mut"]+" (MUT)",
                      "taschendiebstahl": basiswert_arr[2]["gew"]+" (GEW)"
                    },
          					{"id":"",
            					"schleichen": basiswert_arr[2]["gew"]+" (GEW)",
                      "aufmerksamkeit": basiswert_arr[2]["int"]+" (IN)",
                      "robustheit": basiswert_arr[2]["kon"]+" (KON)",
                      "fingerfertigkeit": basiswert_arr[2]["gsk"]+" (GSK)",
                      "zechen": basiswert_arr[2]["kon"]+" (KON)",
                      "taschendiebstahl": basiswert_arr[2]["gsk"]+" (GSK)"
                    },
          					{"id":"",
            					"schleichen":basiswert_arr[2]["kon"]+" (KON)",
                      "aufmerksamkeit":basiswert_arr[2]["gew"]+" (GEW)",
                      "robustheit":basiswert_arr[2]["kk"]+" (KK)",
                      "fingerfertigkeit":basiswert_arr[2]["int"]+" (IN)",
                      "zechen":basiswert_arr[2]["kon"]+" (KON)",
                      "taschendiebstahl":basiswert_arr[2]["int"]+" (IN)"
                    }];
      $.ajax({
      type:'POST',
      url:"source/php/koerpertalente.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        koerperttalente_arr=wuerfelwerte.concat(JSON.parse(data));
      }
    }).done(function(){
      getTable(koerperttalente_arr,"körpertalente");
    });
}

function wissenstalente(){
var wuerfelwerte = [{ "id":"",
                      "heilung": basiswert_arr[2]["kl"]+" (KL)",
                      "gifte": basiswert_arr[2]["kl"]+" (KL)",
                      "schriften": basiswert_arr[2]["kl"]+" (KL)",
                      "magie": basiswert_arr[2]["kl"]+" (KL)",
                      "gassenwissen": basiswert_arr[2]["kl"]+" (KL)",
                      "weltenkenntnis": basiswert_arr[2]["mut"]+" (MUT)",
                      "sprachen": basiswert_arr[2]["kl"]+" (KL)",
                      "anatomie": basiswert_arr[2]["kl"]+" (KL)"
                    },
                    { "id":"",
                      "heilung": basiswert_arr[2]["int"]+" (IN)",
                      "gifte": basiswert_arr[2]["kon"]+" (KON)",
                      "schriften": basiswert_arr[2]["gsk"]+" (GSK)",
                      "magie": basiswert_arr[2]["kl"]+" (KL)",
                      "gassenwissen": basiswert_arr[2]["cha"]+" (CHA)",
                      "weltenkenntnis": basiswert_arr[2]["int"]+" (IN)",
                      "sprachen": basiswert_arr[2]["cha"]+" (CHA)",
                      "anatomie": basiswert_arr[2]["gsk"]+" (GSK)"
                    },
                    { "id":"",
                      "heilung": basiswert_arr[2]["gsk"]+" (GSK)",
                      "gifte": basiswert_arr[2]["mut"]+" (MUT)",
                      "schriften": basiswert_arr[2]["gsk"]+" (GSK)",
                      "magie": basiswert_arr[2]["int"]+" (IN)",
                      "gassenwissen": basiswert_arr[2]["kk"]+" (KK)",
                      "weltenkenntnis": basiswert_arr[2]["mut"]+" (MUT)",
                      "sprachen": basiswert_arr[2]["int"]+" (IN)",
                      "anatomie": basiswert_arr[2]["mut"]+" (MUT)"
                    }];
      $.ajax({
      type:'POST',
      url:"source/php/wissenstalente.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        wissenstalente_arr=wuerfelwerte.concat(JSON.parse(data));
      }
    }).done(function(){
      getTable(wissenstalente_arr,"wissenstalente");
    });
}

function naturtalente(){
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
      url:"source/php/naturtalente.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        naturtalente_arr=wuerfelwerte.concat(JSON.parse(data));
      }
    }).done(function(){
        getTable(naturtalente_arr,"naturtalente");
    });
}

function gesellschaftstalente(){
var wuerfelwerte =[{ "id":"",
                    "feilschen": basiswert_arr[2]["mut"]+" (MUT)",
                    "ueberreden": basiswert_arr[2]["mut"]+" (MUT)",
                    "betoeren": basiswert_arr[2]["cha"]+" (CHA)",
                    "etikette": basiswert_arr[2]["cha"]+" (CHA)",
                    "menschenkenntnis": basiswert_arr[2]["cha"]+" (CHA)"
                    },
                  { "id":"",
                    "feilschen": basiswert_arr[2]["int"]+" (IN)",
                    "ueberreden": basiswert_arr[2]["cha"]+" (CHA)",
                    "betoeren": basiswert_arr[2]["cha"]+" (CHA)",
                    "etikette": basiswert_arr[2]["mut"]+" (MUT)",
                    "menschenkenntnis": basiswert_arr[2]["int"]+" (IN)"
                  },
                  { "id":"",
                    "feilschen": basiswert_arr[2]["cha"]+" (CHA)",
                    "ueberreden": basiswert_arr[2]["kl"]+" (KL)",
                    "betoeren": basiswert_arr[2]["mut"]+" (MUT)",
                    "etikette": basiswert_arr[2]["kl"]+" (KL)",
                    "menschenkenntnis": basiswert_arr[2]["kl"]+" (KL)"
                  }];
      $.ajax({
      type:'POST',
      url:"source/php/gesellschaftstalente.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        gesellschaftstalente_arr=wuerfelwerte.concat(JSON.parse(data));
      }
    }).done(function(){
      getTable(gesellschaftstalente_arr,"gesellschaftstalente");
    });
}

function spezialetalente(){
var wuerfelwerte =[{ "id":"",
                    "reiten": basiswert_arr[2]["kk"]+" (KK)",
                    "schwimmen": basiswert_arr[2]["kon"]+" (KON)",
                    "klettern": basiswert_arr[2]["kk"]+" (KK)",
                    "gaukeleien": basiswert_arr[2]["cha"]+" (CHA)",
                    "seefahrt": basiswert_arr[2]["kl"]+" (KL)"
                  },
                  { "id":"",
                    "reiten": basiswert_arr[2]["gew"]+" (GEW)",
                    "schwimmen": basiswert_arr[2]["gsk"]+" (GSK)",
                    "klettern": basiswert_arr[2]["gew"]+" (GEW)",
                    "gaukeleien": basiswert_arr[2]["gsk"]+" (GSK)",
                    "seefahrt": basiswert_arr[2]["mut"]+" (MUT)"
                    },
                  { "id":"",
                    "reiten": basiswert_arr[2]["kon"]+" (KON)",
                    "schwimmen": basiswert_arr[2]["kk"]+" (KK)",
                    "klettern": basiswert_arr[2]["gsk"]+" (GSK)",
                    "gaukeleien": basiswert_arr[2]["int"]+" (IN)",
                    "seefahrt": basiswert_arr[2]["int"]+" (IN)"
                  }];
      $.ajax({
      type:'POST',
      url:"source/php/spezialetalente.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        spezialetalente_arr=wuerfelwerte.concat(JSON.parse(data));
      }
    }).done(function(){
        getTable(spezialetalente_arr,"spezialetalente");
    });
}

function einhandwaffen(){
  $.ajax({
      type:'POST',
      url:"source/php/einhandwaffen.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      einhandwaffen_arr=JSON.parse(data);
      }
  }).done(function(){
    getTable(einhandwaffen_arr,"einhandwaffen");
  });
}

function getspielerwaffenkampftalent(){
  var tempwkt;
  var tempdata;
  var wk=[];
  $.ajax({
    type:'POST',
    url:"source/php/spielerwaffenkampftalent.php",
    data: {ID:SpielerID},
    datatype:"json",
    success: function(data){
        tempdata=JSON.parse(data);
        for (i=0; i< tempdata.length; i++){
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

function zweihandwaffen(){
  $.ajax({
      type:'POST',
      url:"source/php/zweihandwaffen.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      zweihandwaffen_arr=JSON.parse(data);
      }
  }).done(function(){
    getTable(zweihandwaffen_arr,"zweihandwaffen");
  });
}

function fernkampfwaffen(){
  $.ajax({
      type:'POST',
      url:"source/php/fernkampfwaffen.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      fernkampfwaffen_arr=JSON.parse(data);
      }
  }).done(function(){
    getTable(fernkampfwaffen_arr,"fernkampfwaffen");
  });
}

function anderewaffen(){
  $.ajax({
      type:'POST',
      url:"source/php/anderewaffen.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      anderewaffen_arr=JSON.parse(data);
      }
  }).done(function(){
    getTable(anderewaffen_arr,"anderewaffen");
  });
}

function handwerkstalente(){
      var wuerfelwerte =[{ "id":"",
                    "schmieden": (parseInt(basiswert_arr[2]["kk"])+parseInt(basiswert_arr[2]["kk"])+parseInt(basiswert_arr[2]["kon"]))/5+'<br>'+"(KK+KK+KON)/5",
                    "lederverarbeitung": (parseInt(basiswert_arr[2]["gsk"])+parseInt(basiswert_arr[2]["gsk"])+parseInt(basiswert_arr[2]["kon"]))/5+'<br>'+"(GSK+GSK+KON)/5",
                    "holzverarbeitung": (parseInt(basiswert_arr[2]["gsk"])+parseInt(basiswert_arr[2]["kon"])+parseInt(basiswert_arr[2]["kk"]))/5+'<br>'+"(GSK+KON+KK)/5",
                    "koch": (parseInt(basiswert_arr[2]["kl"])+parseInt(basiswert_arr[2]["gew"])+parseInt(basiswert_arr[2]["kon"]))/5+'<br>'+"(KL+GEW+KON)/5",
                    "lehren": " "
                  }];
      $.ajax({
      type:'POST',
      url:"source/php/handwerkstalente.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        handwerkstalente_arr=wuerfelwerte.concat(JSON.parse(data));
      }
    }).done(function(){
      getTable(handwerkstalente_arr,"handwerkstalente");
    });
  }

function checkKKBonus(){
  var kk = basiswert_arr[2]["kk"];
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
    url:"source/php/updatekkbonus.php",
    data:{ID:SpielerID,
          KKB:kkbonus},
    datatype:"json",
    success:function(data){
    }
  }).done(function(){
    spielerwaffen();
  });
}
function spielerwaffen(){
      var tempwaffen= [];
      var waffen = [[]];
      var tempdata;
      $.ajax({
      type:'POST',
      url:"source/php/spielerwaffen.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        tempdata=JSON.parse(data);
        for (i=0; i< tempdata.length; i++){
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
    }).done(function(){
      getrowTable(spielerwaffen_ar,"spielerwaffen");
    });
  }

function spielerruestungen(){
      var tempruestung= [];
      var  ruestung= [[]];
      var tempdata;
      $.ajax({
      type:'POST',
      url:"source/php/spielerruestungen.php",
      //Daten an den Server in JSON
      data: {ID:SpielerID},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
        tempdata=JSON.parse(data);
        for (i=0; i< tempdata.length; i++){
          tempruestung = [];
          tempruestung =([tempdata[i]["name_beschreibung"],
                        tempdata[i]["ruestungswert"],
                        tempdata[i]["ausruestungsmodifikation"]
                        ]);
          ruestung[i] = tempruestung;
        }
        spielerruestungen_arr=ruestung;
      }
    }).done(function(){
      getrowTable(spielerruestungen_arr,"spielerruestungen");
    });
  }

function addEditable(tablename,colname){
  columnTh = $("#"+tablename+" th:contains('"+colname+"')");
  columnIndex = columnTh.index() +1;
  $('#'+tablename+' tr td:nth-child('+columnIndex+')').css("color","#F00");
}

$(".editColumn").click(function(event){
  var tablename = $(this).closest('table').attr('id');
  var tablemap = {
    'spielerbasiswerte': function(){
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
    'spielersekundarwerte': function(){
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
    'körpertalente':function(){
      $('#editSchleichen').val(koerperttalente_arr[4]["schleichen"]);
      $('#editAufm').val(koerperttalente_arr[4]["aufmerksamkeit"]);
      $('#editRobustheit').val(koerperttalente_arr[4]["robustheit"]);
      $('#editFingerF').val(koerperttalente_arr[4]["fingerfertigkeit"]);
      $('#editZechen').val(koerperttalente_arr[4]["zechen"]);
      $('#editTaschenD').val(koerperttalente_arr[4]["taschendiebstahl"]);
      $('#modalkoerpertalente').modal();
    },
    'wissenstalente':function(){
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
    'einhandwaffen':function(){
      $('#editEinhandschwerter').val(einhandwaffen_arr[1]["schwerter"]);
      $('#editBeile').val(einhandwaffen_arr[1]["beile"]);
      $('#editFlegel').val(einhandwaffen_arr[1]["flegel"]);
      $('#editDolche').val(einhandwaffen_arr[1]["dolche"]);
      $('#modaleinhandwaffen').modal();
    },
    'zweihandwaffen':function(){
      $('#editzweihandschwerter').val(zweihandwaffen_arr[1]["schwerter"]);
      $('#editaexte').val(zweihandwaffen_arr[1]["aexte"]);
      $('#editkolben').val(zweihandwaffen_arr[1]["kolben"]);
      $('#editstaebe').val(zweihandwaffen_arr[1]["staebe"]);
      $('#editstangenwaffen').val(zweihandwaffen_arr[1]["stangenwaffen"]);
      $('#modalzweihandwaffen').modal();
    },
    'naturtalente': function(){
      $('#editkraeuter').val(naturtalente_arr[4]["kraeuterkunde"]);
      $('#edittierkunde').val(naturtalente_arr[4]["tierkunde"]);
      $('#editgeographie').val(naturtalente_arr[4]["geographie"]);
      $('#editueberleben').val(naturtalente_arr[4]["ueberleben"]);
      $('#editorientierung').val(naturtalente_arr[4]["orientierung"]);
      $('#editfaehrtenlesen').val(naturtalente_arr[4]["faehrtenlesen"]);
      $('#modalnaturtalente').modal();
    },
    'fernkampfwaffen': function(){
      $('#editwurfwaffen').val(fernkampfwaffen_arr[1]["wurfwaffen"]);
      $('#editboegen').val(fernkampfwaffen_arr[1]["boegen"]);
      $('#editarmbrueste').val(fernkampfwaffen_arr[1]["armbrueste"]);
      $('#modalfernkampf').modal();
    },
    'anderewaffen': function(){
      $('#editschilde').val(anderewaffen_arr[1]["schilde"]);
      $('#editexotische').val(anderewaffen_arr[1]["exotische_waffen"]);
      $('#editunbewaffnet').val(anderewaffen_arr[1]["unbewaffnet"]);
      $('#modalanderewaffen').modal();
    },
    'handwerkstalente': function(){
      $('#editschmieden').val(handwerkstalente_arr[2]["schmieden"]);
      $('#editlederverarbeitung').val(handwerkstalente_arr[2]["lederverarbeitung"]);
      $('#editholzverarbeitung').val(handwerkstalente_arr[2]["holzverarbeitung"]);
      $('#editkoch').val(handwerkstalente_arr[2]["koch"]);
      $('#editlehren').val(handwerkstalente_arr[2]["lehren"]);
      $('#modalhandwerkstalente').modal();
    },
    'spielerruestungen': function(){
      var text=$(event.target).closest("th").attr('id');
      if(text == "Ruestwert"){
        getModaltab("modtabruestungwert",spielerruestungen_arr,1);
        $('#modspielerruestwert').modal();
      }else{
        getModaltab("modtabruestung",spielerruestungen_arr,2);
        $('#modalspielerruestungen').modal();
      }
    }
  };
  var showmodal = tablemap[tablename];
  if (showmodal) showmodal();
});
//Aktuelle Sekundärwerte werden auf die Normalwert zurückgesetzt
$(document).on('click',"#fullrest", function(){
  $.ajax({
    type:'POST',
    url:"source/php/sekundarwertefullreset.php",
    data:{ID:SpielerID},
    datatype:"json",
    success:function(data){
    }
  }).done(function(){
    sekwerte();
  });
});
//---------------------------------------------------
// Skillinteraktion +/-
//---------------------------------------------------
//Ermittelt die ID des offen modals
$('.modal').on('shown.bs.modal', function(){
    modalid = $(this).attr('id');
});
$(document).on('click','.blussi', function(){
  var counter = $(this).closest('tr').find("input");
  var counterwert = counter.val();
  counterwert ++;
  counter.val(counterwert);
});
$(document).on('click','.minus', function(){
  //var id=$(event.target).closest("th").attr('id');
  var counter = $(this).closest('tr').find("input");
  var counterwert = counter.val();
  counterwert --;
  counter.val(counterwert);
});
$(document).on('click','.atminus', function(){
  //var id=$(event.target).closest("th").attr('id');
  var at = $(this).closest('tr').find(".atwert");
  var talentpunkte = $(this).closest('tr').find(".Waffentalent");
  var atwert = at.text();
  var talentpunktewert = talentpunkte.text();
  if(atwert > 0){
    atwert --;
    talentpunktewert ++;
  }
  at.text(atwert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('click','.atblussi', function(){
  //var id=$(event.target).closest("th").attr('id');
  var at = $(this).closest('tr').find(".atwert");
  var talentpunkte = $(this).closest('tr').find(".Waffentalent");
  var atwert = at.text();
  var talentpunktewert = talentpunkte.text();
  atwert ++;
  talentpunktewert --;
  at.text(atwert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('click','.paminus', function(){
  //var id=$(event.target).closest("th").attr('id');
  var pa = $(this).closest('tr').find(".pawert");
  var talentpunkte = $(this).closest('tr').find(".Waffentalent");
  var pawert = pa.text();
  var talentpunktewert = talentpunkte.text();
  if(pawert >0){
    pawert --;
    talentpunktewert ++;
  }
  pa.text(pawert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('click','.pablussi', function(){
  //var id=$(event.target).closest("th").attr('id');
  var pa = $(this).closest('tr').find(".pawert");
  var talentpunkte = $(this).closest('tr').find(".Waffentalent");
  var pawert = pa.text();
  var talentpunktewert = talentpunkte.text();
  pawert ++;
  //if (check)
  talentpunktewert --;
  pa.text(pawert);
  talentpunkte.text(talentpunktewert);
  $('.Waffentalent').trigger("change");
});
$(document).on('change','.Waffentalent', function(){
  var pa = $(this).closest('tr').find(".pawert");
  var at = $(this).closest('tr').find(".atwert");
  var pawert= pa.text();
  var atwert= at.text();
  var talentpunktewert = $(this).text();
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
$(document).on('click','.editfinal', function(){
  var idtext = $(this).closest('th').attr("id");
  var idmap = {
    'Final_AT': function(){
      getModalATPAtab("modtabATPA",spielerwaffen_ar,spielerwaffenkampftalent_arr);
      $('#modalFinalATPA').modal();
    },
    'Final_PA': function(){
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
$('#submitBasiswerte').click(function(){
      var kl=  $('#editKL').val();
      var gew= $('#editGEW').val();
      var gsk= $('#editGSK').val();
      var cha= $('#editCHA').val();
      var mut= $('#editMUT').val();
      var kon= $('#editKON').val();
      var kk=  $('#editKK').val();
      var int= $('#editIN').val();
  $.ajax({
      type:'POST',
      url:"source/php/updatebasismod.php",
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
      success: function(data){
      //daten[0]["id"];
      $('#modalspielerbasiswert').modal('toggle');
    }
  }).done(function(){
    bwbasis();
  });

});

$('#submitSekwerte').click(function(){
  var hp= $('#editHP').val();
  var ausdauer= $('#editAUSD').val();
  var ee= $('#editEE').val();
  var ausweichen= $('#editAUSW').val();
  var rue= $('#editRUE').val();
  var init= $('#editINIT').val();
  var atkb=$('#editATKB').val();
  var pab= $('#editPAB').val();
  var lr=  $('#editLR').val();
  var wr=  $('#editWR').val();
  var er=  $('#editER').val();
  var lebr=$('#editLEBR').val();
  var fr=  $('#editFR').val();
  var eisr=$('#editEISR').val();
  var mr=  $('#editMR').val();
  var dtr= $('#editDTR').val();
  $.ajax({
    type:'POST',
    url:"source/php/updatesekundaraktuell.php",
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
    success:function(data){
      $('#modalsekundaerwerte').modal('toggle');
    }
  }).done(function(){
  sekwerte();
  });
});

$('#submitKörpertalente').click(function(){
var schleichen=  $('#editSchleichen').val();
var aufmerksamkeit=  $('#editAufm').val();
var robustheit=  $('#editRobustheit').val();
var fingerfertigkeit=  $('#editFingerF').val();
var zechen=  $('#editZechen').val();
var taschendiebstahl= $('#editTaschenD').val();
$.ajax({
    type:'POST',
    url:"source/php/updatekoerpertalente.php",
    data:{ID:SpielerID,
          SCHL:schleichen,
          AUF:aufmerksamkeit,
          ROB:robustheit,
          FIN:fingerfertigkeit,
          ZEC:zechen,
          TAS:taschendiebstahl},
    datatype:"json",
    success:function(data){
      $('#modalkoerpertalente').modal('toggle');
      }
    }).done(function(){
      korprtalente();
  });
});

$('#submitwissenstalente').click(function(){
var heilung=  $('#editHeilung').val();
var gifte=  $('#editGifte').val();
var schriften=  $('#editSchriften').val();
var magie=  $('#editMagie').val();
var gassenwissen=  $('#editGassenwissen').val();
var weltenkenntnis=  $('#editWeltenkenntnis').val();
var sprachen=  $('#editSprachen').val();
var anatomie= $('#editAnatomie').val();
$.ajax({
    type:'POST',
    url:"source/php/updatewissenstalente.php",
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
    success:function(data){
      $('#modalwissenstalente').modal('toggle');
    }
    }).done(function(){
      wissenstalente();
    });
  });

$('#submiteinhandwaffen').click(function(){
var schwerter=  $('#editEinhandschwerter').val();
var beile = $('#editBeile').val();
var flegel = $('#editFlegel').val();
var dolche = $('#editDolche').val();
$.ajax({
    type:'POST',
    url:"source/php/updateeinhandwaffen.php",
    data:{ID:SpielerID,
          SCH:schwerter,
          BEI:beile,
          FLE:flegel,
          DOL:dolche
        },
    datatype:"json",
    success:function(data){
      $('#modaleinhandwaffen').modal('toggle');
    }
    }).done(function(){
      einhandwaffen();
    });
  });

$('#submitnaturtalente').click(function(){
var kraeuter=  $('#editkraeuter').val();
var geographie=  $('#editgeographie').val();
var ueberleben=  $('#editueberleben').val();
var orientierung=  $('#editorientierung').val();
var faehrtenlesen=  $('#editfaehrtenlesen').val();
$.ajax({
    type:'POST',
    url:"source/php/updatenaturtalente.php",
    data:{ID:SpielerID,
          KRA:kraeuter,
          GEO:geographie,
          UEB:ueberleben,
          ORI:orientierung,
          FAE:faehrtenlesen
        },
    datatype:"json",
    success:function(data){
      $('#modalnaturtalente').modal('toggle');
    }
    }).done(function(){
      naturtalente();
    });
  });

$('#submitzweihandwaffen').click(function(){
var zweihandschwerter=  $('#editzweihandschwerter').val();
var kolben = $('#editaexte').val();
var aexte = $('#editaexte').val();
var staebe = $('#editstaebe').val();
var stangenwaffen = $('#editstangenwaffen').val();
$.ajax({
    type:'POST',
    url:"source/php/updatezweihandwaffen.php",
    data:{ID:SpielerID,
          ZWS:zweihandschwerter,
          KOL:kolben,
          AEX:aexte,
          STA:staebe,
          SGN:stangenwaffen
        },
    datatype:"json",
    success:function(data){
      $('#modalzweihandwaffen').modal('toggle');
    }
    }).done(function(){
      zweihandwaffen();
    });
  });

$('#submitfernkampf').click(function(){
var wurfwaffen=  $('#editwurfwaffen').val();
var boegen=  $('#editboegen').val();
var armbrueste=  $('#editarmbrueste').val();
$.ajax({
    type:'POST',
    url:"source/php/updatefernkampf.php",
    data:{ID:SpielerID,
          WUR:wurfwaffen,
          BOE:boegen,
          ARM:armbrueste
        },
    datatype:"json",
    success:function(data){
      $('#modalfernkampf').modal('toggle');
    }
    }).done(function(){
      fernkampfwaffen();
    });
  });

$('#submitanderewaffen').click(function(){
var schilde=  $('#editschilde').val();
var exotische=  $('#editexotische').val();
var unbewaffnet=  $('#editunbewaffnet').val();
$.ajax({
    type:'POST',
    url:"source/php/updateanderewaffen.php",
    data:{ID:SpielerID,
          SCH:schilde,
          UNB:unbewaffnet,
          EXO:exotische
        },
    datatype:"json",
    success:function(data){
      $('#modalanderewaffen').modal('toggle');
    }
    }).done(function(){
      anderewaffen();
    });
  });

$('#submithandwerkstalente').click(function(){
var schmieden=  $('#editschmieden').val();
var lederverarbeitung = $('#editlederverarbeitung').val();
var holzverarbeitung = $('#editholzverarbeitung').val();
var koch = $('#editkoch').val();
var lehren = $('#editlehren').val();
$.ajax({
    type:'POST',
    url:"source/php/updatehandwerkstalente.php",
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

function getModaltab (modtabid,dataarray,index){
  var $tbody = $('#'+modtabid).find('tbody');
  $tbody.empty();
  var text;
  for (i = 0; i < dataarray.length; i++){
    text +="<tr>";
    text +="<td>"+dataarray[i][1]+"</td>";
    text +="<td> <input type=\"number\" value="+dataarray[i][index]+">";
    text +="<button type=\"button\" class=\"btn btn-success blussi\">+</button>";
    text +="<button type=\"button\" class=\"btn btn-danger minus\">-</button>";
    text +="</td></tr>";
  }
  $tbody.append(text);
  rowtext = "";
}

function getModalATPAtab(modtabid,dataarray,kampftalentarray){
  $('#titelATPA').text("Final AT/PA Modifikation");
  var $tbody = $('#'+modtabid).find('tbody');
  var atvalue=sekundarwert_arr[2]["attacke_basis"];
  var pavalue=sekundarwert_arr[2]["parade_basis"];
  var text;
  var atwert;
  var pawert;
  var wert;
  var disable;
  var waffentalent=[];
  $tbody.empty();
  for (i = 0; i < dataarray.length; i++){
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
  rowtext = "";
}

function getwaffentalent(id,exotic){
  if (exotic == 1){
    return [anderewaffen_arr[2]["exotische_waffen"],"Exotische Waffe"];
  }
 var art = {
  1: [einhandwaffen_arr[2]["schwerter"],"Einhandschwerter"]
  ,
  2: [einhandwaffen_arr[2]["beile"],"Beile"]
  ,
  3: [einhandwaffen_arr[2]["flegel"],"Flegel"]
  ,
  4: [einhandwaffen_arr[2]["dolche"],"Dolche"]
  ,
  5: [zweihandwaffen_arr[2]["schwerter"],"Schwerter"]
  ,
  6: [zweihandwaffen_arr[2]["aexte"],"Äxte"]
  ,
  7: [zweihandwaffen_arr[2]["kolben"],"Kolben"]
  ,
  8: [zweihandwaffen_arr[2]["staebe"],"Stäbe"]
  ,
  9: [zweihandwaffen_arr[2]["stangenwaffen"],"Stangenwaffen"]
  ,
  10: [anderewaffen_arr[2]["schilde"],"Schilde"]
  ,
  11: [anderewaffen_arr[2]["unbewaffnet"],"Unbewaffnet"]
};

  return art[id];
};

$('#submitspielerruesungen').click(function(){
  //Finde alle Inputs der ID und gebe die Werte durch die Map funktion wieder
  var inputsruestungsmod= $('#modtabruestung').find("input").map(function(){
    return $(this).val();
  }).toArray();
  var ruestungname = $('#modtabruestung td:even').map(function(){
    return $(this).text();
  }).toArray();
  $.ajax({
    type:'POST',
    url:"source/php/updatespielerruestungen.php",
    data:{VALUEARRAY:inputsruestungsmod,
          NAMEARRAY:ruestungname,
          ID:SpielerID
        },
    datatype:"json",
    success:function(data){
      $('#modalspielerruestungen').modal('toggle');
    }
    }).done(function(){
      spielerruestungen();
      sekwerte();
    });
  });

$('#submitspielerruesungswert').click(function(){
  //Finde alle Inputs der ID und gebe die Werte durch die Map funktion wieder
  var inputsruestungswert= $('#modtabruestungwert').find("input").map(function(){
    return $(this).val();
  }).toArray();
  var ruestungname = $('#modtabruestungwert td:even').map(function(){
    return $(this).text();
  }).toArray();
  $.ajax({
    type:'POST',
    url:"source/php/updatespielerruestungenwert.php",
    data:{VALUEARRAY:inputsruestungswert,
          NAMEARRAY:ruestungname,
          ID:SpielerID
        },
    datatype:"json",
    success:function(data){
      $('#modspielerruestwert').modal('toggle');
    }
    }).done(function(){
      spielerruestungen();
      sekundarwerte();
    });
  });

$('#submitfinalATPA').click(function(){
  //Finde alle Inputs der ID und gebe die Werte durch die Map funktion wieder
  var atwert= $('#modtabATPA').find(".atwert").map(function(){
    return $(this).text();
  }).toArray();
  var pawert= $('#modtabATPA').find(".pawert").map(function(){
    return $(this).text();
  }).toArray();
  var waffenids=[];
  for (i=0; i< spielerwaffenkampftalent_arr.length; i++){
    waffenids.push(spielerwaffenkampftalent_arr[i][3]);
  }
  $.ajax({
    type:'POST',
    url:"source/php/updatespielerwaffenkampftalent.php",
    data:{ATARRAY:atwert,
          PAARRAY:pawert,
          WIDARRAY:waffenids,
          ID:SpielerID
        },
    datatype:"json",
    success:function(data){
      $('#modalFinalATPA').modal('toggle');
    }
    }).done(function(){
      spielerwaffen();
      getspielerwaffenkampftalent();
    });
  });

//---------------------------------------------------
// Neue Ausruestung hinzufügen /Modifizieren
//---------------------------------------------------
// Waffen hinzufügen
$(document).on('click',"#addWaffe",function(){
  $('#modaladdwaffe').modal("toggle");
});
$(document).on('click',"#submitNeueWaffe",function(){
  var newwaffenid;
  var waffenname=$('#Waffenname').val();
  var waffenart=$('#Waffenartauswahl').val();
  var waffenexo=$('.WaffenexoRadio').val();
  var beschreibung=$('#Waffenbeschreibung').val();
  var wuerfelschaden=$('#WaffenWuerfel').val();
  var zusatzschaden=$('#WaffenZschaden').val();
  var atbonus = $('#WaffeATKBonus').val();
  var pabonus = $('#WaffePABonus').val();
  var kk = basiswert_arr[2]["kk"];
  var kkbonus=0;
  if( kk >= 10 && kk <14){
    kkbonus=1;
  }else if (kk >=14 && kk <18 ) {
    kkbonus=2
  }else if (kk >= 18){
    kkbonus=3
  }
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
alert("Waffenart:"+waffenart+"Name:"+artname[waffenart]);
  $.ajax({
    type:"POST",
    url:"source/php/getmaxwaffenid.php",
    datatype:"json",
    success:function(data){
      newwaffenid=parseInt(JSON.parse(data));
    }
  }).done(function(){
    $.ajax({
      type:"POST",
      url:"source/php/addnewwaffe.php",
      data:{SP_ID:SpielerID,
            WP_ID:newwaffenid,
            WNAME:waffenname,
            WAFRT: waffenart,
            WARTNAME:artname[waffenart],
            WAFEXO:waffenexo,
            BESCH:beschreibung,
            WUESCHADEN:wuerfelschaden,
            ZSCHADEN:zusatzschaden,
            ATBONUS:atbonus,
            PABONUS:pabonus,
            KKBONUS:kkbonus},
      datatype:"json",
      success:function(data){
      }
    }).done(function(){
      spielerwaffen();
      getspielerwaffenkampftalent();
    });
  });

});
// Waffe Modifikation
//FUNKTIONIERT NOCH NICHT!
$('#spielerwaffen').on('click','tbody td', function(e){
  var testtext=$(e.target).closest('tr').map(function(){
    return $(this).text();
  }).toArray();
  alert (testtext[0]);
});
 $(document).on('click','#editWaffe',function(event){
   $('#modaleditwaffe').modal("toggle");

 });
});
