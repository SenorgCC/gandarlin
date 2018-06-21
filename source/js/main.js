$( document ).ready(function() {
    console.log( "ready!" );
    $("#myClickBtn").click(function(){
      alert("HIER!");
      psqlconnect();
    });

Function psqlconnect(){
  $.ajax({
      url:"php/dbconnect.php",
      //Daten an den Server in JSON
      data: {test:1,a:2},
      datatype:"json",
      //Methode Post oder GET
      type:POST,
      //callback
      success: function(data){
        window.alert(data)
      }
  });
}

});
