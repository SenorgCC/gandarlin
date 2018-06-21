$( document ).ready(function() {
    console.log( "ready!" );

Function psqlconnect(){
  $.ajax({
      url:"php/dbconnect.php",
      //Daten an den Server in JSON
      //data: {...},
      //datatype:"json",
      //Methode Post oder GET
      type:POST,
      //callback
      success: function(data){
        window.alert(data)
      }
  });
}

});
