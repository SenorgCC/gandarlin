$( document ).ready(function() {
    console.log( "ready!" );
    $("#myClickBtn").click(function(){
      alert("HIER!");
      psqlconnect();
    });

function psqlconnect(){
  $.ajax({
      type:'POST',
      url:"php/dbconnect.php",
      //Daten an den Server in JSON
      //data: {test:1,a:2},
      //datatype:"json",
      //Methode Post oder GET
      //callback
      success: function(data){
        window.alert(data)
      }
  });
}
});
