    //interval of ticks
    var refreshInterval = 100;
    var tickInterval = 1000;
    var tickCurr = 0;
    

    function tick(){
        saveFile.date+=1;
        logStat(localize("%stat_time_elapsed%"), 1);
        
        refreshSignal();
        
        countIncome();
        advanceJourney()

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

    function advanceJourney(){
        if(saveFile.map.length==1){
            if(saveFile.map[0].progress<saveFile.map[0].distance){
                saveFile.map[0].progress+=settings.god ? getRes('velocity')*clickPower : getRes('velocity');
                if(saveFile.map[0].progress>=saveFile.map[0].distance){
                    endJourney();
                }
            }
            drawJourney(saveFile.map[0].distance, saveFile.map[0].progress, getRes('velocity'));
        }
    }
    

    setInterval(tick, tickInterval);
    setInterval(refresh, refreshInterval);
    setInterval(refreshFloaters, refreshInterval/10);
        
    