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
  $.ajax({
      type:'POST',
      url:"source/php/sekundarwerte.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      sekundarwert_arr=JSON.parse(data);
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
