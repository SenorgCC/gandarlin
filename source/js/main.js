var basiswert_arr= [];
var sekundarwert_arr = [];
$( document ).ready(function() {
    console.log( "ready!" );
    $("#myClickBtn").click(function(){
        bwbasis();
        sekwerte();
    });
    $("#gobtn").click(function(){
        getTable(basiswert_arr,"spielerbasiswerte");
        getTable(sekundarwert_arr,"spielersekundarwerte");
    });

function bwbasis(){
  $.ajax({
      type:'POST',
      url:"source/php/bwbasis.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      basiswert_arr=JSON.parse(data);
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
                      "luftresistenz": "KL/4",
                      "wasserresistenz": "GEW/4",
                      "erdresistenz": "GSK/4",
                      "das_lebenderesistenz": "CHA/4",
                      "feuerresistenz" : "MUT/4",
                      "eisresistenz" : "KON/4",
                      "metallresistenz" : "KK/4",
                      "das_toteresistenz" : "IN/4",
                      "attacke_basis" : "(GEW+MUT+KK)/5",
                      "parade_basis" : "(GEW+KK+IN)/5"}];
  $.ajax({
      type:'POST',
      url:"source/php/sekundarwerte.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      sekundarwert_arr=kalkulation.concat(JSON.parse(data));
      window.alert(sekundarwert_arr[2]["ausweichen"]);
      }
  });
}

function getTable(data,htmlobject){
    var $tbody = $('#'+htmlobject).find('tbody');
    window.alert(JSON.stringify(data));
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
  for (i = 1; i < tabledef.length; i++){
    rowtext +="<tr><th scope=\"row\">"+tabledef[i]+"</th>";
      for (j = 0; j < data.length; j++){
        rowtext +="<td>"+data[j][tabledef[i]]+"</td>";
      }
      rowtext +="</tr>";
      $tbody.append(rowtext);
      rowtext = "";
  }
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
