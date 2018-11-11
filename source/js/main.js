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
var SpielerID;
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
    });

    $("#gobtn").click(function(){
      createAllTables();
        //dataTab("spielerruestungen",spielerruestungen_arr);
     //   getTable(handwerkstalente_arr,"handwerkstalente");
    });

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
      spielerwaffen();
      spielerruestungen();
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
                      "ee": "MUT+KL+KL+CHA",
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

/*var wuerfelwerte = [{ "id":"",
                      "schleichen": basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["gew"]+"(GEW), "+basiswert_arr[2]["kon"]+"(KON)",
                      "aufmerksamkeit": basiswert_arr[2]["mut"]+"(MUT), "+basiswert_arr[2]["int"]+"(IN), "+basiswert_arr[2]["gew"]+"(GEW)",
                      "robustheit": basiswert_arr[2]["gew"]+"(GEW), "+basiswert_arr[2]["kon"]+"(KON), "+basiswert_arr[2]["kk"]+"(KK)",
                      "fingerfertigkeit": basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["int"]+"(IN)",
                      "zechen": basiswert_arr[2]["mut"]+"(MUT), "+basiswert_arr[2]["kon"]+"(KON), "+basiswert_arr[2]["kon"]+"(KON)",
                      "taschendiebstahl": basiswert_arr[2]["gew"]+"(GEW), "+basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["int"]+"(IN)"
                    }];
                    */

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
          tempwaffen=([tempdata[i]["beschreibung"],
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

$(".editColumn").click(function(){
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
      var text=$(this).closest('th').attr('id');
      alert(text);
      getModaltab("modtabruestung",spielerruestungen_arr,2);
      $('#modalspielerruestungen').modal();
    }
  };
  var showmodal = tablemap[tablename];
  if (showmodal) showmodal();
});

$(document).on('click','.blussi', function(){
  var counter = $(this).closest('tr').find("input");
  var counterwert = counter.val();
  counterwert ++;
  counter.val(counterwert);
});

$(document).on('click','.minus', function(){
  var counter = $(this).closest('tr').find("input");
  var counterwert = counter.val();
  counterwert --;
  counter.val(counterwert);
});

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
$.ajax({
    type:'POST',
    url:"source/php/updateanderewaffen.php",
    data:{ID:SpielerID,
          SCH:schilde,
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
    text +="<td>"+dataarray[i][0]+"</td>";
    text +="<td> <input type=\"number\" value="+dataarray[i][index]+">";
    text +="<button type=\"button\" class=\"btn btn-success blussi\">+</button>";
    text +="<button type=\"button\" class=\"btn btn-danger minus\">-</button>";
    text +="</td></tr>";
  }
  $tbody.append(text);
  rowtext = "";
}

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
      sekundarwerte();
    });
  });

$(document).on('click','#editRuestwert', function(){
    getModaltab("modtabruestungwert",spielerruestungen_arr,1);
    $('#modspielerruestwert').modal();
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

});
