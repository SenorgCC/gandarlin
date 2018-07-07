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
var spielerruestungen_arr = [[]]
var SpielerID;
$( document ).ready(function() {
    $("#myClickBtn").click(function(){
      SpielerID=$('#SpielerID').val();
      bwbasis();
      sekwerte();
      einhandwaffen();
      zweihandwaffen();
      fernkampfwaffen();
      anderewaffen();
    });

    $("#gobtn").click(function(){
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
        getrowTable(spielerruestungen_arr,"spielerruestungen")
        $('#spielerbasiswerte').editableTableWidget();
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
    //  handwerkstalente();
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
                      "sprachen": basiswert_arr[2]["in"]+" (INT)",
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
  });
}

function handwerkstalente(){
/*var wuerfelwerte =[{ "id":"",
                    "schmieden": (basiswert_arr[2]["kk"]+basiswert_arr[2]["kk"]+basiswert_arr[2]["kon"])/5+<br>+"(KK+KK+KON)/5",
                    "lederverarbeitung": (basiswert_arr[2]["gsk"]+basiswert_arr[2]["gsk"]+basiswert_arr[2]["kon"])/5+<br>+"(GSK+GSK+KON)/5",
                    "holzverarbeitung": (basiswert_arr[2]["gsk"]+basiswert_arr[2]["kon"]+basiswert_arr[2]["kk"])/5+<br>+"(GSK+KON+KK)/5",
                    "koch": (basiswert_arr[2]["kl"]+basiswert_arr[2]["gew"]+basiswert_arr[2]["kon"])/5+<br>+"(KL+GEW+KON)/5",
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
    });
    */
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
    });
  }
//#######################################
//plugins
//#######################################
$.fn.editableTableWidget = function (options) {
	'use strict';
	return $(this).each(function () {
		var buildDefaultOptions = function () {
				var opts = $.extend({}, $.fn.editableTableWidget.defaultOptions);
				opts.editor = opts.editor.clone();
				return opts;
			},
			activeOptions = $.extend(buildDefaultOptions(), options),
			ARROW_LEFT = 37, ARROW_UP = 38, ARROW_RIGHT = 39, ARROW_DOWN = 40, ENTER = 13, ESC = 27, TAB = 9,
			element = $(this),
			editor = activeOptions.editor.css('position', 'absolute').hide().appendTo(element.parent()),
			active,
			showEditor = function (select) {
				active = element.find('td:focus');
				if (active.length) {
					editor.val(active.text())
						.removeClass('error')
						.show()
						.offset(active.offset())
						.css(active.css(activeOptions.cloneProperties))
						.width(active.width())
						.height(active.height())
						.focus();
					if (select) {
						editor.select();
					}
				}
			},
			setActiveText = function () {
				var text = editor.val(),
					evt = $.Event('change'),
					originalContent;
				if (active.text() === text || editor.hasClass('error')) {
					return true;
				}
				originalContent = active.html();
				active.text(text).trigger(evt, text);
				if (evt.result === false) {
					active.html(originalContent);
				}
			},
			movement = function (element, keycode) {
				if (keycode === ARROW_RIGHT) {
					return element.next('td');
				} else if (keycode === ARROW_LEFT) {
					return element.prev('td');
				} else if (keycode === ARROW_UP) {
					return element.parent().prev().children().eq(element.index());
				} else if (keycode === ARROW_DOWN) {
					return element.parent().next().children().eq(element.index());
				}
				return [];
			};
		editor.blur(function () {
			setActiveText();
			editor.hide();
		}).keydown(function (e) {
			if (e.which === ENTER) {
				setActiveText();
				editor.hide();
				active.focus();
				e.preventDefault();
				e.stopPropagation();
			} else if (e.which === ESC) {
				editor.val(active.text());
				e.preventDefault();
				e.stopPropagation();
				editor.hide();
				active.focus();
			} else if (e.which === TAB) {
				active.focus();
			} else if (this.selectionEnd - this.selectionStart === this.value.length) {
				var possibleMove = movement(active, e.which);
				if (possibleMove.length > 0) {
					possibleMove.focus();
					e.preventDefault();
					e.stopPropagation();
				}
			}
		})
		.on('input paste', function () {
			var evt = $.Event('validate');
			active.trigger(evt, editor.val());
			if (evt.result === false) {
				editor.addClass('error');
			} else {
				editor.removeClass('error');
			}
		});
		element.on('click keypress dblclick', showEditor)
		.css('cursor', 'pointer')
		.keydown(function (e) {
			var prevent = true,
				possibleMove = movement($(e.target), e.which);
			if (possibleMove.length > 0) {
				possibleMove.focus();
			} else if (e.which === ENTER) {
				showEditor(false);
			} else if (e.which === 17 || e.which === 91 || e.which === 93) {
				showEditor(true);
				prevent = false;
			} else {
				prevent = false;
			}
			if (prevent) {
				e.stopPropagation();
				e.preventDefault();
			}
		});

		element.find('td').prop('tabindex', 1);

		$(window).on('resize', function () {
			if (editor.is(':visible')) {
				editor.offset(active.offset())
				.width(active.width())
				.height(active.height());
			}
		});
	});

};
$.fn.editableTableWidget.defaultOptions = {
	cloneProperties: ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
					  'text-align', 'font', 'font-size', 'font-family', 'font-weight',
					  'border', 'border-top', 'border-bottom', 'border-left', 'border-right'],
	editor: $('<input>')
};

});
