    //autosave-load
    var settings = {autoSave:false, autoLoad:false, hide:false, god:false, locale:"en"};
    var locale = 0;
    var daysPerCycle = 100;
    
    function shortenValue(value){
        var shortened = value;
        var postFix = '';
        
        if(value/1000000000000>=1){
            shortened/=1000000000000;
            postFix = 'T+';
        }
        else if(value/1000000000>=1){
            shortened/=1000000000;
            postFix = 'G';
        }
        else if(value/1000000>=1){
            shortened/=1000000;
            postFix = 'M';
        }
        else if(value/1000>=1){
            shortened/=1000;
            postFix = 'k';
        }
        
        shortened = round(shortened);
        shortened+=postFix;
        return shortened;
    }
    
    function addLogEntry(entry){
        var element = document.createElement('span');
        element.className = 'msg';
        element.innerHTML = localize(entry);
        var firstElement = document.getElementById('logFrame').firstChild;
        document.getElementById('logFrame').insertBefore(element, firstElement);
    }
    
    function addHighLogEntry(entry){
        var element = document.createElement('span');
        element.className = 'msgHigh';
        element.innerHTML = localize(entry);
        var firstElement = document.getElementById('logFrame').firstChild;
        document.getElementById('logFrame').insertBefore(element, firstElement);
    }
    
    function getXML(location){
        var response = 'test';
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = xhttp.responseText;
            }
        };
        xhttp.open("GET", location, false);
        xhttp.send();
        return response;
    }
    
    function loadSettings(){
        if(localStorage.getItem("settingsFile")){
            settings = JSON.parse(localStorage.getItem("settingsFile"));
        }
        
        
        if(settings.autoSave){
            document.getElementById("autoSaveButton").style.opacity = '1';
        }
        else{
            document.getElementById("autoSaveButton").style.opacity = '0.5';
        }
        
        if(settings.autoLoad){
            document.getElementById("autoLoadButton").style.opacity = '1';
        }
        else{
            document.getElementById("autoLoadButton").style.opacity = '0.5';
        }
        
        if(settings.hide){
            document.getElementById("hideButton").style.opacity = '1';
        }
        else{
            document.getElementById("hideButton").style.opacity = '0.5';
        }
        
        if(settings.god){
            document.getElementById("godButton").style.opacity = '1';
        }
        else{
            document.getElementById("godButton").style.opacity = '0.5';
        }
        
    }
    
    function localize(message){
        if(locale==0){
            loadLocale();
        }
        
        if(message.startsWith('%') && message.endsWith('%')){
            for(var i = 0; i<locale.locale.length; i++){
                if('%'+locale.locale[i][0]+'%'==message){
                    return locale.locale[i][1];
                }
            }
        }
        return message;
    }
    
    function refreshButtons(){
        document.getElementById('godButton').innerHTML = localize('%interface_god%');
        document.getElementById('resetButton').innerHTML = localize('%interface_reset%');
        document.getElementById('hideButton').innerHTML = localize('%interface_hide%');
        document.getElementById('saveButton').innerHTML = localize('%interface_save%');
        document.getElementById('autoSaveButton').innerHTML = localize('%interface_auto_save%');
        document.getElementById('loadButton').innerHTML = localize('%interface_load%');
        document.getElementById('autoLoadButton').innerHTML = localize('%interface_auto_load%');
        
        document.getElementById('workButton').innerHTML = localize('%interface_workshop%');
        document.getElementById('labButton').innerHTML = localize('%interface_laboratory%');
        document.getElementById('surfButton').innerHTML = localize('%interface_surface%');
        document.getElementById('surrButton').innerHTML = localize('%interface_surroundings%');
        document.getElementById('presButton').innerHTML = localize('%interface_prestige%');
        document.getElementById('statsButton').innerHTML = localize('%interface_stats%');
    }
    
    function loadLocale(){
        locale = JSON.parse(getXML('res/locale/'+settings.locale+'.json'));
        refreshButtons();
    }
    
    function saveSettings(){
        localStorage.setItem("settingsFile", JSON.stringify(settings));
    }
    
    function round(number){
        return (Math.round(number*roundingPlace)/roundingPlace);
    }
    
    function surrButtonClick(){
        document.getElementById('surrFrame').style.display = 'initial';
        document.getElementById('labFrame').style.display = 'none';
        document.getElementById('workFrame').style.display = 'none';
        document.getElementById('surfFrame').style.display = 'none';
        document.getElementById('statsFrame').style.display = 'none';
        document.getElementById('presFrame').style.display = 'none';
    }
    
    function labButtonClick(){
        document.getElementById('surrFrame').style.display = 'none';
        document.getElementById('labFrame').style.display = 'initial';
        document.getElementById('workFrame').style.display = 'none';
        document.getElementById('surfFrame').style.display = 'none';
        document.getElementById('statsFrame').style.display = 'none';
        document.getElementById('presFrame').style.display = 'none';
    }
    
    function workButtonClick(){
        document.getElementById('surrFrame').style.display = 'none';
        document.getElementById('labFrame').style.display = 'none';
        document.getElementById('workFrame').style.display = 'initial';
        document.getElementById('surfFrame').style.display = 'none';
        document.getElementById('statsFrame').style.display = 'none';
        document.getElementById('presFrame').style.display = 'none';
    }
    
    function surfButtonClick(){
        document.getElementById('surrFrame').style.display = 'none';
        document.getElementById('labFrame').style.display = 'none';
        document.getElementById('workFrame').style.display = 'none';
        document.getElementById('surfFrame').style.display = 'initial';
        document.getElementById('statsFrame').style.display = 'none';
        document.getElementById('presFrame').style.display = 'none';
    }
    
    function presButtonClick(){
        document.getElementById('surrFrame').style.display = 'none';
        document.getElementById('labFrame').style.display = 'none';
        document.getElementById('workFrame').style.display = 'none';
        document.getElementById('surfFrame').style.display = 'none';
        document.getElementById('statsFrame').style.display = 'none';
        document.getElementById('presFrame').style.display = 'initial';
    }
    
    function statsButtonClick(){
        document.getElementById('surrFrame').style.display = 'none';
        document.getElementById('labFrame').style.display = 'none';
        document.getElementById('workFrame').style.display = 'none';
        document.getElementById('surfFrame').style.display = 'none';
        document.getElementById('statsFrame').style.display = 'initial';
        document.getElementById('presFrame').style.display = 'none';
    }
    
    function signalButtonClick(){
        logStat("%stat_signal_captured%", 1);
        var clickCache = [];
        
        for(var i = 0; i<saveFile.resources.length; i++){
            var cacheObject = {name:saveFile.resources[i].name, add:0, multiply:1};
            if(cacheObject.name=="Knowledge"){
                cacheObject.add = 10;
            }
            clickCache.push(cacheObject);
        }

        for(var i = 0; i<saveFile.workshop.length; i++){
            if(saveFile.workshop[i].type_signal_gain_add && saveFile.workshop[i].unlocked){
                for(var ii = 0; ii<saveFile.workshop[i].signal_gain_add.length; ii++){
                    for(var iii = 0; iii<clickCache.length; iii++){
                        if(clickCache[iii].name==saveFile.workshop[i].signal_gain_add[ii].resource){
                            clickCache[iii].add+=saveFile.workshop[i].signal_gain_add[ii].amount;
                        }
                    }
                }
            }
            if(saveFile.workshop[i].type_signal_gain_multiply && saveFile.workshop[i].unlocked){
                for(var ii = 0; ii<saveFile.workshop[i].signal_gain_multiply.length; ii++){
                    for(var iii = 0; iii<clickCache.length; iii++){
                        if(clickCache[iii].name==saveFile.workshop[i].signal_gain_multiply[ii].resource){
                            clickCache[iii].multiply+=saveFile.workshop[i].signal_gain_multiply[ii].amount;
                        }
                    }
                }
            }
        }

        for(var i = 0; i<clickCache.length; i++){
            var toAdd = clickCache[i].add*clickCache[i].multiply;
            addResource(clickCache[i].name, toAdd);
        }
        
        addLogEntry("%log_captured_transmission%");
        signalVisible = false;
        signalCurr = 0;
        document.getElementById('signalButton').style.display = 'none';
    }
    
    function mainButtonClick(event){
        logStat("%stat_main_button_clicked%", 1);
        

        var clickCache = [];
        
        for(var i = 0; i<saveFile.resources.length; i++){
            var cacheObject = {name:saveFile.resources[i].name, add:0, multiply:1};
            if(cacheObject.name=="resource_knowledge"){
                cacheObject.add = 1;
            }
            clickCache.push(cacheObject);
        }
        
        



        for(var i = 0; i<saveFile.workshop.length; i++){
            if(saveFile.workshop[i].type_click_power_add && saveFile.workshop[i].unlocked){
                for(var ii = 0; ii<saveFile.workshop[i].click_power_add.length; ii++){
                    for(var iii = 0; iii<clickCache.length; iii++){
                        if(clickCache[iii].name==saveFile.workshop[i].click_power_add[ii].resource){
                            clickCache[iii].add+=saveFile.workshop[i].click_power_add[ii].amount;
                        }
                    }
                }
            }
            if(saveFile.workshop[i].type_click_power_multiply && saveFile.workshop[i].unlocked){
                for(var ii = 0; ii<saveFile.workshop[i].click_power_multiply.length; ii++){
                    for(var iii = 0; iii<clickCache.length; iii++){
                        if(clickCache[iii].name==saveFile.workshop[i].click_power_multiply[ii].resource){
                            clickCache[iii].multiply+=saveFile.workshop[i].click_power_multiply[ii].amount;
                        }
                    }
                }
            }
        }

        for(var i = 0; i<clickCache.length; i++){
            var toAdd = clickCache[i].add*clickCache[i].multiply;
            if(settings.god){
                toAdd*=clickPower;
            }
            addResource(clickCache[i].name, toAdd);
            if(toAdd>0){
                spawnFloater(event.clientX, event.clientY, toAdd);
            }
        }
    }
    
    function godButtonClick(){
        var button = document.getElementById("godButton");
        settings.god = !settings.god;
        if(settings.god){
            button.style.opacity = '1';
        }
        else{
            button.style.opacity = '0.5';
        }
        saveSettings();
    }
    
    function hideButtonClick(){
        var button = document.getElementById("hideButton");
        settings.hide = !settings.hide;
        if(settings.hide){
            button.style.opacity = '1';
        }
        else{
            button.style.opacity = '0.5';
        }
        saveSettings();
    }
    
    function autoSaveClick(){
        var button = document.getElementById("autoSaveButton");
        settings.autoSave = !settings.autoSave;
        if(settings.autoSave){
            button.style.opacity = '1';
        }
        else{
            button.style.opacity = '0.5';
        }
        saveSettings();
    }
    
    function autoLoadClick(){
        var button = document.getElementById("autoLoadButton");
        settings.autoLoad = !settings.autoLoad;
        if(settings.autoLoad){
            button.style.opacity = '1';
        }
        else{
            button.style.opacity = '0.5';
        }
        saveSettings();
    }
    
    function shortenData(number){
        var shortened = '';
        var day = number%daysPerCycle;
        var cycle = (number-day)/daysPerCycle;
        shortened = localize("%time_cycle%")+" "+cycle+", "+localize('%time_day%')+" "+day;
        
        return shortened;
        
    }
    
    function logStat(name, increase){
        var exists = 0;
        
        //look if already exists globally
        for(var i = 0; i<globalStats.length; i++){
            if(globalStats[i].name==name){
                globalStats[i].value+=increase;
                exists = 1;
            }
        }
        if(!exists){
            var statsEntry = {name: name, value: 0};
            statsEntry.value+=increase;
            globalStats.push(statsEntry);
        }
        //and locally
        exists = 0;
        for(var i = 0; i<saveFile.stats.length; i++){
            if(saveFile.stats[i].name==name){
                saveFile.stats[i].value+=increase;
                exists = 1;
            }
        }
        if(!exists){
            var statsEntry = {name: name, value: 0};
            statsEntry.value+=increase;
            saveFile.stats.push(statsEntry);
        }
    }
    
    function refreshFloaters(){
        var speed = 2;
        var decay = 0.01;
        var floaters = document.getElementsByClassName("floater");
        for(var i = 0; i<floaters.length; i++){
            //decrease opacity
            floaters[i].style.opacity-=decay;
            
            //set y position
            var posY = floaters[i].style.top;
            posY = posY.slice(0, posY.length-2)-speed;
            floaters[i].style.top = posY+"px";

            //despawn
            if(floaters[i].style.opacity<=0){
                document.getElementById("background").removeChild(floaters[i]);
            }
        }
    }
    
    function spawnFloater(x, y, value){
        var floater = document.createElement("button");
        var scatter = 150;
        var finalX = x+(Math.random()-0.5)*scatter;
        var finalY = y+(Math.random()-0.5)*scatter;
        floater.className = "floater";
        floater.innerHTML = shortenValue(round(value));
        floater.style.opacity = 1;
        floater.style.left = finalX+"px";
        floater.style.top = finalY+"px";
        
        document.getElementById("background").appendChild(floater);
    }
    
    document.getElementById("autoSaveButton").addEventListener('click', autoSaveClick);
    document.getElementById("autoLoadButton").addEventListener('click', autoLoadClick);
    document.getElementById("hideButton").addEventListener('click', hideButtonClick);
    document.getElementById("godButton").addEventListener('click', godButtonClick);
    document.getElementById('mainButton').addEventListener('click', mainButtonClick);
    document.getElementById('signalButton').addEventListener('click', signalButtonClick);
    document.getElementById('labButton').addEventListener('click', labButtonClick);
    document.getElementById('surrButton').addEventListener('click', surrButtonClick);
    document.getElementById('workButton').addEventListener('click', workButtonClick);
    document.getElementById('surfButton').addEventListener('click', surfButtonClick);
    document.getElementById('presButton').addEventListener('click', presButtonClick);
    document.getElementById('statsButton').addEventListener('click', statsButtonClick);