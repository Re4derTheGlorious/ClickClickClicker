    //interval of ticks
    var refreshInterval = 100;
    var tickInterval = 1000;
    var tickCurr = 0;
    

    function tick(){
        saveFile.data+=1;
        logStat("Elapsed days", 1);
        
        refreshSignal();
        
        countIncome();
        
        

        if(settings.autoSave){
            saveStuff();
        }
        saveStats();
        saveSettings();
        addLogEntry("");
    }
    
    function refresh(){
        refreshData();
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

    
    

    setInterval(tick, tickInterval);
    setInterval(refresh, refreshInterval);
    setInterval(refreshFloaters, refreshInterval/10);
        
    