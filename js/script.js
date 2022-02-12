const menuGame = document.getElementById("menuGame");

function start(){

    $("#menuGame").hide();

    $("#telaJogo").append("<div id='jogador' class='anima1'></div>");
    $("#telaJogo").append("<div id='inimigo1' class='anima2'></div>");
    $("#telaJogo").append("<div id='inimigo2'></div>");
    $("#telaJogo").append("<div id='amigo' class='anima3'></div>");
    $("#telaJogo").append("<div id='placar'></div>");
    $("#telaJogo").append("<div id='energia'></div>"); 
    
    var somDisparo  = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica      = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido  = document.getElementById("somPerdido");
    var somResgate  = document.getElementById("somResgate");
    
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();    
    
    let jogo = {};
        
    const TECLA = {W:87,S:83,D:68};

    // Posiciona inimigo inicialmente
    let posicaoInimigoY  = parseInt(Math.random( )*334);
    $("#inimigo1").css("top",posicaoInimigoY);     
    
    jogo.pressionou = {};
    jogo.podeAtirar = true;
    jogo.amigoMorto = false;
    jogo.fimJogo    = false;
    jogo.pontos     = 0;
    jogo.salvos     = 0;
    jogo.perdidos   = 0; 
    jogo.energia    = 3;
    jogo.velocidade = 5;   

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
        });
    
    
        $(document).keyup(function(e){
           jogo.pressionou[e.which] = false;
        });    

    jogo.time = setInterval(loop,15);

    function loop(){

        animacoesJogo();
        moveJogador(jogo,TECLA);
        moveInimigo1(jogo);
        moveInimigo2(jogo);
        moveAmigo(); 
        colisao(jogo);
        placar(jogo);
        energia(jogo);
        gameOver(jogo);

        if (!jogo.podeAtirar) {
          moveDisparo(jogo);
        }

        let inimigo2X = parseInt($("#inimigo2").css("left"));

        if ((jogo.amigoMorto) & (inimigo2X > 700)) {
            jogo.amigoMorto  = false;
            $("#telaJogo").append("<div id='amigo' class='anima3'></div>");
        }
    }
}

function animacoesJogo (){

   let esquerda =  parseInt($("#telaJogo").css("background-position"));
   $("#telaJogo").css("background-position", esquerda-1);
}

function moveJogador(jogo, TECLA) {   
	
	if (jogo.pressionou[TECLA.W]) {
		let topo = parseInt($("#jogador").css("top"));       
  	    $("#jogador").css("top",topo-10);

        if (topo < 0){
            $("#jogador").css("top",topo+10);
        }	
	}
	
	if (jogo.pressionou[TECLA.S]) {
		
		let topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top",topo+10);

        if (topo >= 430){
	    	$("#jogador").css("top",topo-10);	
        }
	}
	
	if (jogo.pressionou[TECLA.D]) {
		if (jogo.podeAtirar){

		  $("#telaJogo").append("<div id='disparo' ></div>");
          let topo = parseInt($("#jogador").css("top")); 

          $("#disparo").css("top",topo+37);
          let posicaoX = parseInt($("#jogador").css("left")); 

          $("#disparo").css("left",posicaoX+190);	          	
          jogo.podeAtirar = false;
          somDisparo.play();
        }  
	}
 }

 function moveInimigo1(jogo)
 {
    let posicaoX  = parseInt($("#inimigo1").css("left"));    
         
    $("#inimigo1").css("left",posicaoX-jogo.velocidade);    

    if (posicaoX <= 0) {
       let posicaoY  = parseInt(Math.random( )*334);       
       $("#inimigo1").css("top",posicaoY);
       $("#inimigo1").css("left",689);
    }
 }

 function moveInimigo2()
 {
    let velocidade = 3;    
    let posicaoX  = parseInt($("#inimigo2").css("left"));    
         
    $("#inimigo2").css("left",posicaoX-velocidade);
    if (posicaoX <= -9) {

        $("#inimigo2").css("left",775);   
    }   
} 

function moveAmigo()
{
   let velocidade = 1;    
   let posicaoX  = parseInt($("#amigo").css("left"));    
        
   $("#amigo").css("left",posicaoX+velocidade);
   if (posicaoX > 906) {
       $("#amigo").css("left",0);   
   }    
}

function moveDisparo(jogo)
{
   let velocidade = 10;    
   let posicaoX  = parseInt($("#disparo").css("left"));    
        
   $("#disparo").css("left",posicaoX+velocidade);
   if (posicaoX > 906) {
       jogo.podeAtirar = true;
       $("#disparo").remove();         
   }    
}

function colisao(jogo) {

    let colisao1 = ($("#jogador").collision($("#inimigo1"))); 
    let colisao2 = ($("#jogador").collision($("#inimigo2")));
    let colisao3 = ($("#disparo").collision($("#inimigo1")));
    let colisao4 = ($("#disparo").collision($("#inimigo2")));
    let colisao5 = ($("#jogador").collision($("#amigo")));        
    let colisao6 = ($("#inimigo2").collision($("#amigo"))); 
        
    if (colisao1.length>0) {
            
        let inimigo1X = parseInt($("#inimigo1").css("left"));
        let inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X,inimigo1Y);
    
        let posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left",694);
        $("#inimigo1").css("top",posicaoY);
        jogo.energia --;        
    }

    if (colisao2.length>0) {
	
        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        explosao2(inimigo2X,inimigo2Y);
                
        $("#inimigo2").remove();
            
        reposicionaInimigo2(jogo);
        jogo.energia --;    
    }    

	if (colisao3.length>0) {		
		
        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));
            
        explosao1(inimigo1X,inimigo1Y);
        
        jogo.pontos+=100;
        jogo.velocidade+=0.03;
            
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left",694);
        $("#inimigo1").css("top",posicaoY);
        $("#disparo").remove();
        jogo.podeAtirar = true;
            
    } 
    
	if (colisao4.length>0) {
		
        inimigo2X = parseInt($("#inimigo2").css("left"));
        inimigo2Y = parseInt($("#inimigo2").css("top"));
        $("#inimigo2").remove();
    
        explosao2(inimigo2X,inimigo2Y);

        jogo.pontos+=50;

        $("#disparo").css("left",950);
        
        reposicionaInimigo2(jogo);            
    } 
    
	if (colisao5.length>0) {
		$("#amigo").remove();
        reposicionaAmigo(jogo);        
        jogo.salvos++;
        somResgate.play();
    }    
    
    if (!jogo.amigoMorto) {

      let colisao6 = ($("#inimigo2").collision($("#amigo")));  

      if (colisao6.length>0) {
            
        let inimigo2X = parseInt($("#inimigo2").css("left"));
        let inimigo2Y = parseInt($("#inimigo2").css("top"));        
        explosao6(inimigo2X,inimigo2Y);           
        
        $("#amigo").remove();
        jogo.amigoMorto = true;
        jogo.perdidos++;
      }
   }   
}

function explosao1(inimigo1X,inimigo1Y) {

	$("#telaJogo").append("<div id='explosao1'></div");
	$("#explosao1").css("background-image", "url(midias_jogo/imgs/explosao.png)");
	let div=$("#explosao1");
	div.css("top", inimigo1Y);
	div.css("left", inimigo1X);
	div.animate({width:200, opacity:0}, "slow");
    somExplosao.play();
	
	let tempoExplosao=window.setInterval(removeExplosao, 1000);
	
	function removeExplosao() {
			
		div.remove();
		window.clearInterval(tempoExplosao);
		tempoExplosao=null;			
    }		
}

function explosao2(inimigo2X,inimigo2Y) {
	
	$("#telaJogo").append("<div id='explosao2'></div");
	$("#explosao2").css("background-image", "url(midias_jogo/imgs/explosao.png)");
	let div2=$("#explosao2");
	div2.css("top", inimigo2Y);
	div2.css("left", inimigo2X);
	div2.animate({width:200, opacity:0}, "slow");
	
	let tempoExplosao2=window.setInterval(removeExplosao2, 1000);
    somExplosao.play();
	function removeExplosao2() {
			
		div2.remove();
		window.clearInterval(tempoExplosao2);
		tempoExplosao2=null;			
	}		
}

function explosao6(inimigo2X,inimigo2Y) {

	$("#telaJogo").append("<div id='explosao2'></div");
	$("#explosao2").css("background-image", "url(midias_jogo/imgs/amigo_morte.png)");
	let div=$("#explosao2");
	div.css("top", inimigo2Y);
	div.css("left", inimigo2X);
	div.animate({width:200, opacity:0}, "slow");
	somPerdido.play();
	let tempoExplosao=window.setInterval(removeExplosao, 1000);
	
	function removeExplosao() {
			
		div.remove();
		window.clearInterval(tempoExplosao);
		tempoExplosao=null;			
	}		
} 

function reposicionaInimigo2(jogo) {
	
	let tempoColisao4=window.setInterval(reposiciona4, 5000);
		
	function reposiciona4() {

		window.clearInterval(tempoColisao4);
		tempoColisao4=null;
			
		if (!jogo.fimJogo) {
			
		  $("#telaJogo").append("<div id=inimigo2></div");			
		}			
	}	
}

function reposicionaAmigo(jogo) {
	
	let tempoAmigo=window.setInterval(reposiciona6, 8000);
	
	function reposiciona6() {
	  window.clearInterval(tempoAmigo);
	  tempoAmigo=null;
		
	  if (!jogo.fimJogo) {
		
		$("#telaJogo").append("<div id='amigo' class='anima3'></div>");
      }		
	}		
}

function placar(jogo) {
	
	$("#placar").html("<h2> Pontos: " + jogo.pontos + " Salvos: " + jogo.salvos + " Perdidos: " + jogo.perdidos + "</h2>");
	
} 

function energia(jogo) {

  switch (jogo.energia){    
    case 3 : $("#energia").css('background-image','url(midias_jogo/imgs/energia3.png'); break;
    case 2 : $("#energia").css('background-image','url(midias_jogo/imgs/energia2.png'); break;
    case 1 : $("#energia").css('background-image','url(midias_jogo/imgs/energia1.png'); break;
    default :  $("#energia").css('background-image','url(midias_jogo/imgs/energia0.png'); break;
  }   
};

function reiniciaJogo(){

    somGameover.pause();    
    $("#fim").remove();
    start();    
}

function gameOver(jogo)
{
    if ((jogo.energia === 0) & (!jogo.fimJogo)) {
       
       jogo.fimJogo = true;
       $("#disparo").remove();
       $("#jogador").remove();
       $("#amigo").remove();
       $("#inimigo1").remove();     
       $("#inimigo2").remove(); 
       $("#energia").remove();

       musica.pause(); 
       somGameover.play();

       window.clearInterval(jogo.time);
       jogo.time=null;      
        
       $("#telaJogo").append("<div id='fim'></div>");        
       $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + jogo.pontos + "</p>" + "<div id='reinicia'><h3>Jogar Novamente</h3></div>");
       jogo = null;

       const fim = document.getElementById("fim");
       fim.addEventListener('click',reiniciaJogo);
    }     
}

menuGame.addEventListener('click',start);
