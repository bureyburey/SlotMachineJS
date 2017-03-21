function randVal(min, max) {
    return (Math.floor(Math.random()*(max - min + 1) + min));
}

function shuffle (array) {
  var i=0,j=0,temp=null;
  for (i=array.length-1;i>0;i-=1){
    j = Math.floor(Math.random()*(i+1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    temp=array[i].x;
    array[i].x=array[j].x;
    array[j].x=temp;
  }
  return array;
}

function start(){
    // get elements from the HTML page
    with(document){
        var myCanvas=getElementById("myCanvas");
        var raiseBet1Btn=getElementById("raiseBet1");
        var raiseBet10Btn=getElementById("raiseBet10");
        var raiseBet50Btn=getElementById("raiseBet50");
        var allInBtn=getElementById("allIn");
        var lowerBet1Btn=getElementById("lowerBet1");
        var lowerBet10Btn=getElementById("lowerBet10");
        var lowerBet50Btn=getElementById("lowerBet50");
        var spinBtn=getElementById("spinBtn");
        var showScoreboardBtn=getElementById("showScoreboardBtn");
    }
    // set width/height ratio variables
    var widthRatio=0.95;
    var heightRatio=0.65;
    // apply width/ratio settings to the canvas
    myCanvas.width = window.innerWidth*widthRatio;
    myCanvas.height = window.innerHeight*heightRatio;
    
    var handler = function (evt) {
        if(!touchActive){
            return;
        }
        evt.preventDefault();
        var pos=myCanvas.getBoundingClientRect();
        if(evt.touches)
            var touch=evt.touches[0];
        var xTouch = (evt.clientX-pos.left) || (touch.clientX-pos.left);
        var yTouch = (evt.clientY-pos.top) || (touch.clientY-pos.top)
        currentLeverY=yTouch;
        
        if(!spinInterval)
        spinAnimation();
        
        if(!spinInterval)
        drawLever(defaultLeverX,yTouch);
    }

    function handlerStart(evt){
        touchActive=true;
    }

    function handlerEnd(){
        touchActive=false;
        if(currentLeverY>spinLeverY){
           spin();
        }
        currentLeverY=minLeverY;
        if(!spinInterval)
        spinAnimation();
    }
    
    myCanvas.ontouchstart = handlerStart;
    myCanvas.ontouchmove = handler;
    myCanvas.ontouchend = handlerEnd;
    myCanvas.addEventListener('mousedown',handlerStart);
    myCanvas.addEventListener('mousemove',handler);
    myCanvas.addEventListener('mouseup',handlerEnd);

    var scoreboard = new Scoreboard(); 
    
    // get 2D context from the canvas
    var ctx=myCanvas.getContext("2d");
    // define spin interval variable for machine spin animation
    var spinInterval=null;
    // define frame rate variable
    var frameRate=33;
    var coinsAmount=50;
    var coinsBet=1;
    var totalWon=0;
    var stoppedIcons=[];
    var leverRadius=25;
    var minLeverY=40;
    var maxLeverY=160;
    var currentLeverY=minLeverY;
    var spinLeverY=maxLeverY-minLeverY/2;
    var defaultLeverX=280;
    var touchActive=false;
    var prize=0;
    var coinsArr=[];
    
    // define visible area of emojis
    var visibleArea={
        x:myCanvas.width*0.15,
        y:myCanvas.height*0.1,
        width:myCanvas.width*0.6,
        height:150,
        lineWidth:2,
        middleLineWidth:10
    }
    
    var prizeSlotArea={
        x:visibleArea.x,
        y:visibleArea.y+visibleArea.height+10,
        width:myCanvas.width*0.6,
        lineWidth:5
    }
    
    var colors={
       bg:"green",
       concealer:"green",
       innerFrame:"gray",
       prizeLine:"blue"
    }
    
    var prizeWeights={
     " 7":50,
     "🍒":5,
     "🍓":5,
     "🔔":5,
     "🍌":5,
     "🍋":3,
     "🍫":3,
     "🍉":3,
     "🍇":3,
     "🍍":1
     };
    var iconSrc=[" 7","🍒","🍒","🍓","🍓","🔔","🔔","🍌","🍌","🍋","🍋","🍋","🍫","🍫","🍫","🍉","🍉","🍉","🍇","🍇","🍇","🍍","🍍","🍍","🍍"];
    
    function drawPrizeTable(){
        col="blue";
        siz=16;
        fon="Times New Roman";
        xOffset=-2;
        yOffset=10;
        xCol1=5+xOffset;
        xCol2=95+xOffset;
        xCol3=185+xOffset;
        xCol4=265+xOffset;
drawMsg("77 x"+prizeWeights[" 7"],xCol1,210+yOffset,col,siz,fon);
drawMsg("777 x"+prizeWeights[" 7"]*2,xCol1,230+yOffset,col,siz,fon);
drawMsg("🍒🍒 x"+prizeWeights["🍒"],xCol1,250+yOffset,col,siz,fon);
drawMsg("🍒🍒🍒 x"+prizeWeights["🍒"]*2,xCol1,270+yOffset,col,siz,fon);
drawMsg("🍓🍓 x"+prizeWeights["🍓"],xCol1,290+yOffset,col,siz,fon);
drawMsg("🍓🍓🍓 x"+prizeWeights["🍓"]*2,xCol1,310+yOffset,col,siz,fon);

drawMsg("🔔🔔 x"+prizeWeights["🔔"],xCol2,210+yOffset,col,siz,fon);
drawMsg("🔔🔔🔔 x"+prizeWeights["🔔"]*2,xCol2,230+yOffset,col,siz,fon);
drawMsg("🍌🍌 x"+prizeWeights["🍌"],xCol2,250+yOffset,col,siz,fon);
drawMsg("🍌🍌🍌 x"+prizeWeights["🍌"]*2,xCol2,270+yOffset,col,siz,fon);
drawMsg("🍋🍋 x"+prizeWeights["🍋"],xCol2,290+yOffset,col,siz,fon);
drawMsg("🍋🍋🍋 x"+prizeWeights["🍋"]*2,xCol2,310+yOffset,col,siz,fon);

drawMsg("🍫🍫 x"+prizeWeights["🍫"],xCol3,210+yOffset,col,siz,fon);
drawMsg("🍫🍫🍫 x"+prizeWeights["🍫"]*2,xCol3,230+yOffset,col,siz,fon);
drawMsg("🍉🍉 x"+prizeWeights["🍉"],xCol3,250+yOffset,col,siz,fon);
drawMsg("🍉🍉🍉 x"+prizeWeights["🍉"]*2,xCol3,270+yOffset,col,siz,fon);
drawMsg("🍇🍇 x"+prizeWeights["🍇"],xCol3,290+yOffset,col,siz,fon);
drawMsg("🍇🍇🍇 x"+prizeWeights["🍇"]*2,xCol3,310+yOffset,col,siz,fon);

drawMsg("🍍🍍 x"+prizeWeights["🍍"],xCol4,250+yOffset,col,siz,fon);
drawMsg("🍍🍍🍍 x"+prizeWeights["🍍"]*2,xCol4,270+yOffset,col,siz,fon);
    }
    
    var iconMargins=[];
    for(i=0;i<iconSrc.length;i++){
       iconMargins.push(i*50);
    }
     
    // define slot reel strips
    var strips={
        x_margin:5,
        y_margin:50,
        minSpinSpeed:15,
        maxSpinSpeed:30,
        speedReduce:0.1,
        fontSize:40,
        fontColor:"blue",
        sepColor:"black",
        strip1:{
            x:visibleArea.x+10,
            y:myCanvas.width*0.4,
            speed:0,
            icons:Object.create(iconSrc),
            yPositions:Object.create(iconMargins)
        },
        strip2:{
            x:visibleArea.x+10+60,
            y:myCanvas.width*0.4,
            speed:0,
            icons:Object.create(iconSrc),
yPositions:Object.create(iconMargins)
        },
        strip3:{
            x:visibleArea.x+10+120,
            y:myCanvas.width*0.4,
            speed:0,
            icons:Object.create(iconSrc),
            yPositions:Object.create(iconMargins)
        }
    }
    var bottomStripY=strips.strip1.icons.length*(50);
strips.strip1.icons=shuffle(strips.strip1.icons);
strips.strip2.icons=shuffle(strips.strip2.icons);
strips.strip3.icons=shuffle(strips.strip3.icons);
    
    raiseBet1Btn.onclick=function(){
        raiseBet(1);
    }
    raiseBet10Btn.onclick=function(){
        raiseBet(10);
    }
    raiseBet50Btn.onclick=function(){
        raiseBet(50);
    }
    allInBtn.onclick=allIn;
    lowerBet1Btn.onclick=function(){
        lowerBet(1);
    }
    lowerBet10Btn.onclick=function(){
        lowerBet(10);
    }
    lowerBet50Btn.onclick=function(){
        lowerBet(50);
    }
    spinBtn.onclick=spin;
    showScoreboardBtn.onclick=scoreboard.showScoreBoard;
    
    
    function drawLever(xTo,yTo){
        if(yTo<minLeverY){
           yTo=minLeverY; 
        }
        if(yTo>maxLeverY){
           yTo=maxLeverY; 
        }
       ctx.beginPath();
       ctx.lineWidth=4;
       ctx.strokeStyle="black";
       ctx.moveTo(visibleArea.x+visibleArea.width,visibleArea.y+visibleArea.height/2);
       ctx.lineTo(visibleArea.x+visibleArea.width+10,visibleArea.y+visibleArea.height/2);
       ctx.lineTo(xTo,yTo);
       ctx.stroke();
       ctx.closePath();
       
       ctx.beginPath();
       ctx.fillStyle="red";
       ctx.arc(xTo,yTo,leverRadius,0,2*Math.PI,false);
       ctx.fill();
       ctx.closePath();
       
       ctx.beginPath();
       ctx.globalAlpha=0.4;
      ctx.fillStyle="black"; ctx.arc(xTo,yTo,leverRadius*0.8,0,2*Math.PI,false);
      ctx.fill();
      ctx.globalAlpha=1.0;
       ctx.closePath();
       
       if(yTo<spinLeverY)
       drawMsg("PULL",xTo-leverRadius*0.8,yTo+leverRadius*0.2,"black",15,"Times New Roman");
       else
       drawMsg("RELEASE",xTo-leverRadius*0.8,yTo+leverRadius*0.2,"black",9,"Times New Roman");
    }
    
    function drawMsg(msg,x,y,color,size,font,contRec,contRecCol){
        contRec=contRec || false;
        contRecCol=contRecCol || "black";
        
        if(contRec){
            ctx.beginPath();
            ctx.fillStyle=contRecCol;
            ctx.fillRect(x-siz/2,y-siz*1.3,msg.length*siz*0.7,siz*1.7);
            ctx.fill();
            ctx.closePath();
        }
        
        ctx.beginPath();
        ctx.font=size+"px "+font;
        ctx.fillStyle=color;
        ctx.fillText(msg,x,y);
        ctx.closePath();
    }
    
    function drawBackground(){
    myCanvas.width = window.innerWidth*widthRatio;
    myCanvas.height = window.innerHeight*heightRatio;
        ctx.fillStyle=colors.bg;
        ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
    }
    
    function drawInnerFrame(){
        ctx.lineWidth=visibleArea.lineWidth;
        ctx.beginPath();
        ctx.fillStyle=colors.innerFrame;
        ctx.fillRect(visibleArea.x,visibleArea.y,visibleArea.width,visibleArea.height);
        ctx.fill();
        ctx.closePath();
    }
    
    function drawOuterFrameBorder(){
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.rect(visibleArea.x,visibleArea.y,visibleArea.width,visibleArea.height);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.lineWidth=visibleArea.middleLineWidth;
        ctx.strokeStyle=colors.prizeLine;
        ctx.globalAlpha = 0.3;
        ctx.moveTo(visibleArea.x,visibleArea.y+visibleArea.height/2);
        ctx.lineTo(visibleArea.x+visibleArea.width,visibleArea.y+visibleArea.height/2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.closePath();
        
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.lineWidth=prizeSlotArea.lineWidth;
        ctx.moveTo(prizeSlotArea.x,prizeSlotArea.y);
        ctx.lineTo(prizeSlotArea.x+prizeSlotArea.width,prizeSlotArea.y);
        ctx.stroke();
        ctx.closePath();
    }
    
    function drawUpperLowerConcealers(){
    // hide top & bottom portions of canvas to create the reel spinning effect
        ctx.beginPath();
        ctx.fillStyle=colors.concealer;
        ctx.rect(0,0,myCanvas.width,visibleArea.y);
        
        ctx.rect(0,visibleArea.y+visibleArea.height,myCanvas.width,myCanvas.height);
        ctx.fill();
        ctx.closePath();
    }
    
    function getStoppedIcon(strip){
    // find out which icon is in the middle once the current reel stopped
        middleY=visibleArea.y+visibleArea.height/2;
        ind=0;
        minDistance=Math.abs(middleY-strip.yPositions[ind]);
        for(i=0;i<strip.icons.length;i++){

            yPosition=strip.yPositions[i]-10;
                 
            if(Math.abs(middleY-yPosition) < minDistance){
                minDistance=Math.abs(middleY-yPosition);
                ind=i; 
            }
        }
        stoppedIcons.push(strip.icons[ind]);
       // re-arrange all icons by aligning stopped icons in the middle
        offset=((middleY>strip.yPositions[ind]-10)? 1:-1);
        for(i=0;i<strip.icons.length;i++){
        
            strip.yPositions[i]+=minDistance*offset;
        }
    }
    
    function drawStrip(strip){
        updateStrip(strip);
        
        for(i=0;i<strip.icons.length;i++){
             
             /*ctx.fillStyle="black";
            ctx.rect(strip.x,strip.yPositions[i]-10,1,1);
             ctx.fill();
             */
            
            icon=strip.icons[i];
            yPosition=strip.yPositions[i];
            drawMsg("  "+icon,strip.x,yPosition,strips.fontColor,strips.fontSize,"Times New Roman");
             drawMsg("|",strip.x,yPosition,strips.sepColor,strips.fontSize,"Times New Roman");

            strip.yPositions[i]+=strip.speed;
            
    if(strip.yPositions[i]>=bottomStripY){
               // reset icon position (place it back at the start)
                strip.yPositions[i]=strip.yPositions[i]%bottomStripY;
            }
        }
    }
    
    function drawStrips(){
        drawStrip(strips.strip1);
        drawStrip(strips.strip2);
        drawStrip(strips.strip3);
    }
    
    function drawInfo(){
        drawMsg("💰: "+coinsAmount+"   💲: "+coinsBet+"    Won: "+totalWon,20,20,"black",20,"Times New Roman");
    }
    
    function updateStrip(strip){
        if(strip.speed==0){
            return;
        }
        strip.speed=Math.max(strip.speed-strips.speedReduce,0);
        if(strip.speed==0){
            getStoppedIcon(strip);
        }
    }
    
    function checkSpinStopped(){
        return (
        strips.strip1.speed == 0 &&
        strips.strip2.speed == 0 &&
        strips.strip3.speed == 0);
    }
    
    function spinAnimation(){
        drawBackground();
        drawInnerFrame();
        
        drawStrips();
        
        drawUpperLowerConcealers();
        drawOuterFrameBorder();
        drawInfo();
        drawPrizeTable();
        drawLever(defaultLeverX,currentLeverY);
        if(checkSpinStopped() && spinInterval){
            clearInterval(spinInterval);
            spinInterval=null;
            claimPrize(stoppedIcons);
        }
    }
    
    function randomizeSpinSpeeds(){
        strips.strip1.speed=randVal(strips.minSpinSpeed,strips.maxSpinSpeed);
        strips.strip2.speed=strips.strip1.speed+2;
        strips.strip3.speed=strips.strip2.speed+2;
    }
    
    function drawPrizeAnimation(){
        spinAnimation();
        for(i=0;i<coinsArr.length;i++){
            drawMsg("💲",coinsArr[i].x,coinsArr[i].y,"green",20,"Times New Roman");
            
            coinsArr[i].y+=coinsArr[i].speed;
            if(coinsArr[i].y > myCanvas.height+30){
                coinsArr.splice(i,1);
                coinsAmount++;
                totalWon++;
            }
        }
        if(coinsArr.length==0){
            clearInterval(prizeAnimationInterval);
            prizeAnimationInterval=null;
            spinAnimation();
        }  
    }
    
    function prizeAnimation(prize){
        while(prize>0){
            coinsArr.push({
               x:randVal(prizeSlotArea.x,prizeSlotArea.x+prizeSlotArea.width),
               y:prizeSlotArea.y,
               speed:randVal(3,8),
            });
            prize--;
        }
        prizeAnimationInterval=setInterval(drawPrizeAnimation,frameRate);
    }
    
    function claimPrize(iconsArr){
// create unique elements array
        /*var unique = iconsArr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
});*/
    prize=0;
    var counts = {};
    iconsArr.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    // document.getElementById("debugIcons").innerHTML="Icons:<br />";

    for (var c in counts){
        prize+=prizeWeights[c]*(counts[c]-1);
    //   str=(c+" x"+counts[c])+"<br />"; document.getElementById("debugIcons").innerHTML+=str;
    }
    // coinsAmount+=prize*coinsBet;
        
        str=((prize>0)? ("Won "+prize*coinsBet+" coins!"):("No Dinero..."));
        document.getElementById("winInfo").innerHTML=str;
        prize*=coinsBet;
        coinsBet=Math.min(coinsBet,coinsAmount+prize);
        spinAnimation();
        if(prize>0){
            prizeAnimation(prize);
        }
        else if(prize==0 && coinsAmount==0){
            // add score method
            scoreboard.submitNewScoreDialog(totalWon);
            coinsAmount=50;
            coinsBet=1;
            totalWon=0;
            spinAnimation();
            
            drawMsg("Game Over!!!",prizeSlotArea.x+20,prizeSlotArea.y+30,"red",20,"Times New Roman",true,"black");
        }
    }
    
    function raiseBet(bet){
        if(spinInterval){
           return; 
        }
        if(coinsBet+bet>coinsAmount){
          drawMsg("Insufficent Funds!!!",prizeSlotArea.x,prizeSlotArea.y+30,"red",20,"Times New Roman",true,"black");
           return;
        }
        coinsBet+=bet; 
        spinAnimation();
    }
    
    function allIn(){
        if(spinInterval){
           return; 
        }
        coinsBet=coinsAmount;
        spinAnimation();
    }
    
    function lowerBet(bet){
        if(spinInterval){
           return; 
        }
 
        if(coinsBet-bet<1){
            if(coinsAmount>0){
                drawMsg("Cannot Bet Zero Coins!!!",prizeSlotArea.x,prizeSlotArea.y+30,"red",20,"Times New Roman",true,"black");
            }
           return;
        }
        coinsBet-=bet;
        spinAnimation();
    }
    
    function spin(){
        if(!spinInterval && coinsAmount>0 && coinsBet>0){
            coinsAmount-=coinsBet;
            stoppedIcons=[];
            randomizeSpinSpeeds();
            spinInterval=setInterval(spinAnimation,frameRate);
        }
    }
    
    startup=5;
    startupInterval=setInterval(function(){
    startup--;
        myCanvas.width = window.innerWidth*widthRatio;
    myCanvas.height = window.innerHeight*heightRatio;
    visibleArea={
        x:myCanvas.width*0.15,
        y:myCanvas.height*0.1,
        width:myCanvas.width*0.6,
        height:150,
        lineWidth:3,
        middleLineWidth:20
    }
    prizeSlotArea={
        x:visibleArea.x,
        y:visibleArea.y+visibleArea.height+10,
        width:myCanvas.width*0.6,
        lineWidth:5
    }
    spinAnimation();
    if(startup<0){
        clearInterval(startupInterval);
        
        //drawMsg("Pull and release the lever to spin",prizeSlotArea.x,prizeSlotArea.y+30,"blue",15,"Times New Roman",true,"white");
        //drawMsg("Or click Spin!",prizeSlotArea.x,prizeSlotArea.y+50,"blue",15,"Times New Roman",true,"white");
        }
    },200);  
}

// call start function once the HTML is loaded
window.onload=start;
