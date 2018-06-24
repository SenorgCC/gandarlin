var basiswert_final ;
var basiswert_basis ;
var basiswert_mod ;
var basiswert_arr= [];
$( document ).ready(function() {
    console.log( "ready!" );
    $("#myClickBtn").click(function(){
        bwbasis();
        bwmod();
        bwfinal();
    });
    $("#gobtn").click(function(){
        getTable(basiswert_arr);
    });
function bwfinal(){
  $.ajax({
      type:'POST',
      url:"source/php/bwfinal.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      basiswert_final = JSON.parse(data)[0];
        basiswert_arr[2] = basiswert_final;
      }
  });
}

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
      basiswert_basis = JSON.parse(data)[0];
        basiswert_arr[0] = basiswert_basis;
      }
  });
}

function bwmod(){
  $.ajax({
      type:'POST',
      url:"source/php/bwmod.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      datatype:"json",
      //callback
      success: function(data){
      //daten[0]["id"];
      basiswert_mod = JSON.parse(data)[0];
        basiswert_arr[1]=basiswert_mod;
      }
  });
}
function getTable(data){
    var htmlobject="spielerbasiswerte";
    var $tbody = $('#'+htmlobject).find('tbody');
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
  window.alert("TB: "+tabledef.length+"B: "+data.length);
  for (i = 1; i < tabledef.length; i++){
    rowtext +="<tr><td>"+tabledef[i]+"</td>";
      for (j = 0; j < data.length; j++){
        rowtext +="<td>"+data[j][tabledef[i]]+"</td>";
      }
      rowtext +="</tr>";
      console.log(rowtext);
      $tbody.append(rowtext);
      rowtext = "";
  }
}
});
/*
      var $tbody =$('#spielerbasiswerte').find('tbody');
    JSON.parse(data,function(k,b) {

        $tbody.append('<tr><td>'+k+'</td><td>'+b+'</td><td>'+m+'</td><td>'+f+'</tr>');
        });
*/
