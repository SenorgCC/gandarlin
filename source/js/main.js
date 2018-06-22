$( document ).ready(function() {
    console.log( "ready!" );
    $("#myClickBtn").click(function(){
      alert("HIER!");
      psqlconnect();
    });
function arrayToTable(tableData) {
        var table = $('<table></table>');
        $(tableData).each(function (i, rowData) {
            var row = $('<tr></tr>');
            $(rowData).each(function (j, cellData) {
                row.append($('<td>'+cellData+'</td>'));
            });
            table.append(row);
        });
        return table;
    }
function psqlconnect(){
  $.ajax({
      type:'POST',
      url:"source/php/dbconnect.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      datatype:"json",
      //callback
      success: function(data){
//       var antwort=$.parseJSON(data);
        var daten = JSON.parse(data);
        //daten[0]["id"];
        $('#spieler.basiswerte').append(arrayToTable(daten));
/*        var basiswerte=[];
        $.each(daten, function(i,item){
          basiswerte.push("<tr><td>"+item.kb)
        })*/
      }
  });
}
});
