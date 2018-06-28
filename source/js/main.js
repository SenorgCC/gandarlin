var basiswert_arr= [];
var sekundarwert_arr = [];
var koerperttalente_arr = [];
var SpielerID;
$( document ).ready(function() {
    $("#myClickBtn").click(function(){
      SpielerID=$('#SpielerID').val();
      bwbasis();
      sekwerte();
    });

    $("#gobtn").click(function(){
        getTable(basiswert_arr,"spielerbasiswerte");
        getTable(sekundarwert_arr,"spielersekundarwerte");
        getTable(koerperttalente_arr,"körpertalente");
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
      }
  });
}


function sekwerte(){
  var kalkulation = [{"lebenspunkte": "KK+KON+KON",
                      "ausdauer":"KON+GEW+KK",
                      "ee": "MUT+KL+KL",
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
//              tablerow.push(v);
            });
        /*}else{
          $.each(data[i],function (k,v){
            tablerow.push(v);
          });
        }
        tabledata.push(tablerow);
        */
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
      "das_toteresistenz":"Das Toteresistenz"
    };
    return kuerzel[word] || word;
  }
}

function korprtalente(){
var wuerfelwerte = [{ "id":"",
                      "schleichen": basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["gew"]+"(GEW), "+basiswert_arr[2]["kon"]+"(KON)",
                      "aufmerksamkeit": basiswert_arr[2]["mut"]+"(MUT), "+basiswert_arr[2]["int"]+"(IN), "+basiswert_arr[2]["gew"]+"(GEW)",
                      "robustheit": basiswert_arr[2]["gew"]+"(GEW), "+basiswert_arr[2]["kon"]+"(KON), "+basiswert_arr[2]["kk"]+"(KK)",
                      "fingerfertigkeit": basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["int"]+"(IN)",
                      "zechen": basiswert_arr[2]["mut"]+"(MUT), "+basiswert_arr[2]["kon"]+"(KON), "+basiswert_arr[2]["kon"]+"(KON)",
                      "taschendiebstahl": basiswert_arr[2]["gew"]+"(GEW), "+basiswert_arr[2]["gsk"]+"(GSK), "+basiswert_arr[2]["int"]+"(IN)"
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
    });
}

function getSekundarWerte(){

}
});
/*
      var $tbody =$('#spielerbasiswerte').find('tbody');
    JSON.parse(data,function(k,b) {

        $tbody.append('<tr><td>'+k+'</td><td>'+b+'</td><td>'+m+'</td><td>'+f+'</tr>');
        });
*/
