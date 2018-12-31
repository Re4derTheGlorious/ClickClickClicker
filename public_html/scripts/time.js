    //interval of ticks
    var refreshInterval = 100;
    var tickInterval = 1000;
    var tickCurr = 0;
    

    function tick(){
        saveFile.date+=1;
        logStat(localize("%stat_time_elapsed%"), 1);
        
        refreshSignal();
        
        countIncome();
        advanceJourney();
        advanceScan();

        if(settings.autoSave){
            saveStuff();
        }
        saveStats();
        addLogEntry("");
    }
    
    function refresh(){
        refreshDate();
        refreshResources();
        refreshLaboratory();
        refreshSurroundings();
        refreshWorkshop();
        refreshStats();
        refreshOther();
        refreshSurface();
    }
    
    function countIncome(){
        //add income
        for(var i = 0; i<saveFile.resources.length; i++){
            addResource(saveFile.resources[i].name, saveFile.resources[i].inc);
        }
    }

    function advanceScan(){
        if(saveFile.map.length>1){
            if(saveFile.map[saveFile.map.length-1].type=='scanIndicator'){
                if(saveFile.map[saveFile.map.length-1].progress<saveFile.map[saveFile.map.length-1].required){
                    saveFile.map[saveFile.map.length-1].progress+=settings.god ? getRes(saveFile.map[saveFile.map.length-1].scanResource)*clickPower : getRes(saveFile.map[saveFile.map.length-1].scanRes);
                }
                else{
                    endScan();
                }
                drawProgressBar(saveFile.map[saveFile.map.length-1].required, saveFile.map[saveFile.map.length-1].progress, getRes(saveFile.map[saveFile.map.length-1].scanRes));
            }
        }
    }

    function advanceJourney(){
        if(saveFile.map.length==2){
            if(saveFile.map[1].type=='planet'){
                if(saveFile.map[1].progress<saveFile.map[1].distance){
                    saveFile.map[1].progress+=settings.god ? getRes('velocity')*clickPower : getRes('velocity');
                }
                else{
                    endJourney();
                }
                drawProgressBar(saveFile.map[1].distance, saveFile.map[1].progress, getRes('velocity'));
            }
        }
    }
    

    setInterval(tick, tickInterval);
    setInterval(refresh, refreshInterval);
    setInterval(refreshFloaters, refreshInterval/10);
        
    