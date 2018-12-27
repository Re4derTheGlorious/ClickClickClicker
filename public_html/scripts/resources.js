    //saves
    var saveFile = {resources: 0, data: 0, surroundings: 0, workshop: 0, laboratory: 0, stats: []};
    var globalStats = [];
    
    //click power
    var clickPower = 1000;
    
    //signal
    var signalVisible = false;
    var signalChance = 10;
    var signalLength = 10;
    var signalCurr = 0;
    
    //misc
    var roundingPlace = 100;


    function initRes(){ 
        //load settings
        loadSettings();
        loadStats();
        
        
        
        //load stuff
        if(settings.autoLoad){
            loadSave();
        }
        else{
            loadStartSetup();
        }
        
        
        createCode();
        
        
    }
    
    function createCode(){
        //create htmlcode of resources
        document.getElementById("resources").innerHTML = "";
        for(var i = 0; i<saveFile.resources.length; i++){
            createTableRow(saveFile.resources[i]);
        }
        
        //create htmlcode of surroundings
        document.getElementById("surrFrame").innerHTML = "";
        for(var i = 0; i<saveFile.surroundings.length; i++){
            createButton(saveFile.surroundings[i], "surrFrame");
        }
        
        //create htmlcode of laboratory
        document.getElementById("labFrame").innerHTML = "";
        for(var i = 0; i<saveFile.laboratory.length; i++){
            createButton(saveFile.laboratory[i], "labFrame");
        }
        
        //create htmlcode of workshop
        document.getElementById("workFrame").innerHTML = "";
        for(var i = 0; i<saveFile.workshop.length; i++){
            createButton(saveFile.workshop[i], "workFrame");
        }
    }
    
    function createTableRow(res){
        var tableRow = document.createElement('tr');
        tableRow.id = res.name+"TD";
        
        //name
        var tableData = document.createElement('td');
        tableData.innerHTML = res.name;
        tableRow.appendChild(tableData);
        
        //amount
        tableData = document.createElement('td');
        tableData.id = res.name+"Curr";
        //tableData.align = "right";
        tableData.innerHTML = res.curr;
        tableRow.appendChild(tableData);
        
        //per
        tableData = document.createElement('td');;
        tableData.innerHTML = "/";
        tableRow.appendChild(tableData);
        
        //max amount
        tableData = document.createElement('td');
        tableData.id = res.name+"Max";
        tableData.innerHTML = res.max;
        tableRow.appendChild(tableData);
        
        //income
        tableData = document.createElement('td');
        tableData.id = res.name+"Inc";
        tableData.innerHTML = 0;
        tableRow.appendChild(tableData);
        
        //per second
        tableData = document.createElement('td');
        tableData.innerHTML = "/s";
        tableRow.appendChild(tableData);
        
        
        
        document.getElementById("resources").appendChild(tableRow);
    }
    
    function createButton(item, frame){
        var button = document.createElement("button");
        button.className = "upgradeButton";
        button.id = item.name+' upgradeButton';
        
        //load name
        button.innerHTML = item.name;
        if(frame=="surrFrame"){
            button.innerHTML+=" (<span id=\""+item.name+"Curr"+"\">"+item.curr+"</span>)";
        }
        
        
        document.getElementById(frame).appendChild(button).appendChild(createBubble(item));
        
        //create event
        if(frame=="labFrame"){
            document.getElementById(item.name+' upgradeButton').addEventListener('click', function() {upgradeButtonAction(item, "lab")} );
        }
        else if(frame=="surrFrame"){
            document.getElementById(item.name+' upgradeButton').addEventListener('click', function() {upgradeButtonAction(item, "surr" )});
        }
        else if(frame=="workFrame"){
            document.getElementById(item.name+' upgradeButton').addEventListener('click', function() {upgradeButtonAction(item, "work" )});
        }
    }
    
    function upgradeButtonAction(item, type){
        if(payResources(item.cost)==0){
            if(type=='lab'){
                //unlock upgrade
                item.unlocked = true;
                logStat("Technologies researched", 1);

                //unlock stuff
                for(var i = 0; i<item.unlocks.length; i++){
                    //unlock labs
                    for(var ii = 0; ii<saveFile.laboratory.length; ii++){
                        if(saveFile.laboratory[ii].name == item.unlocks[i].name){
                            saveFile.laboratory[ii].avaible = true;
                        }
                    }
                    //unlock surr
                    for(var ii = 0; ii<saveFile.surroundings.length; ii++){
                        if(saveFile.surroundings[ii].name == item.unlocks[i].name){
                            saveFile.surroundings[ii].avaible = true;
                        }
                    }
                    //unlock work
                    for(var ii = 0; ii<saveFile.workshop.length; ii++){
                        if(saveFile.workshop[ii].name == item.unlocks[i].name){
                            saveFile.workshop[ii].avaible = true;
                        }
                    }
                }
                //hard coded unlocks
                if(item.name=="Survival"){
                    for(var i = 0; i<saveFile.resources.length; i++){
                        if(saveFile.resources[i].name=="Supplies"){
                            saveFile.resources[i].startMax = 1000;
                            saveFile.resources[i].curr = 1000;
                        }
                        if(saveFile.resources[i].name=="Water"){
                            saveFile.resources[i].startMax = 1000;
                            saveFile.resources[i].curr = 1000;
                        }
                        if(saveFile.resources[i].name=="Oxygen"){
                            saveFile.resources[i].startMax = 1000;
                            saveFile.resources[i].curr = 1000;
                        }
                        if(saveFile.resources[i].name=="Crew"){
                            saveFile.resources[i].startMax = 1;
                            saveFile.resources[i].curr = 1;
                        }
                    }
                }
                else if(item.name=="Primitive Industry"){
                    for(var i = 0; i<saveFile.resources.length; i++){
                        if(saveFile.resources[i].name=="Matter"){
                            saveFile.resources[i].startMax = 100;
                            saveFile.resources[i].curr = 5;
                        }
                    }
                }
                else if(item.name=="Matter Handling"){
                    for(var i = 0; i<saveFile.resources.length; i++){
                        if(saveFile.resources[i].name=="Metal"){
                            saveFile.resources[i].startMax = 25;
                            saveFile.resources[i].curr = 0;
                        }
                        if(saveFile.resources[i].name=="Plastic"){
                            saveFile.resources[i].startMax = 50;
                            saveFile.resources[i].curr = 0;
                        }
                    }
                }
                
                addLogEntry("Technology researched");
            }
            else if(type=='surr'){
                item.curr++;
                logStat("Surroundings built", 1);
                
                for(var i = 0; i<item.cost.length; i++){
                    item.cost[i].amount*=item.ratio;
                }
                
                addLogEntry("Surrounding created");
            }
            else if(type=="work"){
                item.unlocked = true;
                logStat("Workshop upgrades unlocked", 1);
                
                addLogEntry("Upgrade unlocked");
            }
        }
    }
    
    function createBubble(item){
        var bubble = document.createElement("span");
        bubble.className = "tooltip";
        
        //load description
        bubble.innerHTML = item.description+"<br>";
        
        
        if(item.type_income==true){
            bubble.innerHTML+="<br>Income:<br>";
            for(var i = 0; i<item.income.length; i++){
                bubble.innerHTML+=item.income[i].resource+": ";
                if(item.income[i].amount>0){
                    bubble.innerHTML+="+";
                }
                bubble.innerHTML+=round(item.income[i].amount);
                bubble.innerHTML+="<br>";
            }
        }
        if(item.type_storage==true){
            bubble.innerHTML+="<br>Storage:<br>";
            for(var i = 0; i<item.storage.length; i++){
                bubble.innerHTML+=item.storage[i].resource+": +";
                bubble.innerHTML+=round(item.storage[i].amount);
                bubble.innerHTML+="<br>";
            }
        }
        
        bubble.innerHTML+="<br>Cost:<br>";
        for(var i = 0; i<item.cost.length; i++){
            bubble.innerHTML+=item.cost[i].resource+": ";
            bubble.innerHTML+="<span name=\"currRes\" id="+item.cost[i].resource+"Curr"+">"+getRes(item.cost[i].resource)+"</span>";
            bubble.innerHTML+="/<span name=\"currCost\" id=\""+item.name+item.cost[i].resource+"Cost\">"+round(item.cost[i].amount)+"</span><br>";
        }
        
        
        return bubble;
    }
    
    function addResource(resourceName, value){
        logStat("Resources gained", value);
        for(var i = 0; i<saveFile.resources.length; i++){
            if(saveFile.resources[i].name == resourceName){
                var result = 0;
                if(saveFile.resources[i].curr+value>saveFile.resources[i].max){
                    if(!settings.god){
                        saveFile.resources[i].curr = saveFile.resources[i].max;
                        result = 1;
                    }
                    else{
                        saveFile.resources[i].curr+=value;
                        result = 1;
                    }
                }
                else if(saveFile.resources[i].curr+value<0){
                    saveFile.resources[i].curr = 0;
                    result = -1;
                }
                else{
                    saveFile.resources[i].curr+= value;
                }
                return result;
            }
        }
    }
    
    function payResources(resources){
        result = true;
        for(var i = 0; i<resources.length; i++){
            if(getRes(resources[i].resource)-resources[i].amount<0){
                result = false;
            }
        }
        
        if(result){
            for(var i = 0; i<resources.length; i++){
                payResource(resources[i].resource, resources[i].amount);
            }
            return 0;
        }
        else{
            addLogEntry("Not Enough Resources");
            return -1;
        }
    }
    
    function getRes(name){
        for(var i = 0; i<saveFile.resources.length; i++){
            if(saveFile.resources[i].name == name){
                return saveFile.resources[i].curr;
            }
        }
    }
    
    function getResInc(name){
        for(var i = 0; i<saveFile.resources.length; i++){
            if(saveFile.resources[i].name == name){
                return saveFile.resources[i].inc;
            }
        }
    }
    
    function payResource(resourceName, value){
        logStat("Resources paid", value);
        for(var i = 0; i<saveFile.resources.length; i++){
            if(saveFile.resources[i].name == resourceName){
                var result = 0;
                if(saveFile.resources[i].curr-value<0){
                    result = -1;
                }
                else{
                    saveFile.resources[i].curr-= value;
                }
                return result;
            }
        }
    }
    
    function refreshResources(){
        for(var i = 0; i<saveFile.resources.length; i++){
            if(saveFile.resources[i].max>0){
                document.getElementById(saveFile.resources[i].name+"TD").style.display = 'table-row';
            }
            else{
                document.getElementById(saveFile.resources[i].name+"TD").style.display = 'none';
            }
            
            //curr
            document.getElementById(saveFile.resources[i].name+'Curr').innerHTML = shortenValue(round(saveFile.resources[i].curr));
            
            //max
            document.getElementById(saveFile.resources[i].name+'Max').innerHTML = shortenValue(round(saveFile.resources[i].max));
            
            //inc
            document.getElementById(saveFile.resources[i].name+'Inc').innerHTML = shortenValue(round(saveFile.resources[i].inc));
        }
        
        //reset income and storage
        for(var i = 0; i<saveFile.resources.length; i++){
            saveFile.resources[i].inc = 0;
            saveFile.resources[i].max = saveFile.resources[i].startMax;
        }

        
        //fill incomeCache
        var incomeCache = [];
        for(var i = 0; i<saveFile.resources.length; i++){
            var cacheEntry = {"name": saveFile.resources[i].name, "incAdd":saveFile.resources[i].inc, "surrIncGlobalMultiplier":1, "workIncGlobalMultiplier":1, "strAdd":saveFile.resources[i].startMax, "surrStrGlobalMultiplier":1, "workStrGlobalMultiplier":1};
            incomeCache.push(cacheEntry);
        }
        
        //conversion triggers
        var resourceCache = [];
        for(var i = 0; i<saveFile.resources.length; i++){
            var res = {name: saveFile.resources[i].name, curr: saveFile.resources[i].curr};
            resourceCache.push(res);
        }
        
        for(var i = 0; i<saveFile.surroundings.length; i++){
            if(saveFile.surroundings[i].curr>0){
                if(saveFile.surroundings[i].type_conversion){
                    saveFile.surroundings[i].activeFacilities = saveFile.surroundings[i].curr;;
                    
                    //check expenses
                    for(var n = 0; n<saveFile.surroundings[i].curr; n++){
                        var inactive = 0;
                        for(var ii = 0; ii<saveFile.surroundings[i].income.length; ii++){
                            for(var iii = 0; iii<resourceCache.length; iii++){
                                if(resourceCache[iii].name==saveFile.surroundings[i].income[ii].resource || saveFile.surroundings[i].income[ii].resource=="*all"){
                                    if(saveFile.surroundings[i].income[ii].amount<0){
                                        console.log("-");
                                        if(resourceCache[iii].curr+saveFile.surroundings[i].income[ii].amount<0){
                                            inactive = 1;
                                        }
                                        else{
                                            resourceCache[iii].curr-=saveFile.surroundings[i].income[ii].amount;
                                        }
                                    }
                                }
                            }
                        }
                        if(inactive){
                            saveFile.surroundings[i].activeFacilities--;
                            
                        }
                    }
                    
                    
                    
                }
            }
        }
        
        //local income add and multiplier
        for(var i = 0; i<saveFile.surroundings.length; i++){
            if(saveFile.surroundings[i].curr>0){
                //income
                if(saveFile.surroundings[i].type_income){
                    for(var ii = 0; ii<saveFile.surroundings[i].income.length; ii++){
                        for(var iii = 0; iii<incomeCache.length; iii++){
                            if(incomeCache[iii].name==saveFile.surroundings[i].income[ii].resource){
                                //basic income
                                var active = 0;
                                if(saveFile.surroundings[i].type_conversion){
                                    active = saveFile.surroundings[i].activeFacilities;
                                    console.log(saveFile.surroundings[i].activeFacilities);
                                }
                                else{
                                    active = saveFile.surroundings[i].curr;
                                }
                                var finalIncome = saveFile.surroundings[i].income[ii].amount*active;
                                var workshopBoost = 1;
                                var surroundingsBoost = 1;
                                //workshop boosts
                                for(var n = 0; n<saveFile.workshop.length; n++){
                                    if(saveFile.workshop[n].unlocked){
                                        if(saveFile.workshop[n].type_local_production_boost){
                                            for(var nn = 0; nn<saveFile.workshop[n].local_production_boost.length; nn++){
                                                if(saveFile.surroundings[i].name==saveFile.workshop[n].local_production_boost[nn].surrounding || saveFile.workshop[n].local_production_boost[nn].surrounding=="*all"){
                                                    for(var nnn = 0; nnn<saveFile.workshop[n].local_production_boost[nn].boost.length; nnn++){
                                                        if(saveFile.workshop[n].local_production_boost[nn].boost[nnn].resource==incomeCache[iii].name || saveFile.workshop[n].local_production_boost[nn].boost[nnn].resource=="*all"){
                                                            workshopBoost+=saveFile.workshop[n].local_production_boost[nn].boost[nnn].boost;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                //surroundings boosts
                                for(var n = 0; n<saveFile.surroundings.length; n++){
                                    if(saveFile.surroundings[n].curr>0){
                                        if(saveFile.surroundings[n].type_local_production_boost){
                                            for(var nn = 0; nn<saveFile.surroundings[n].local_production_boost.length; nn++){
                                                if(saveFile.surroundings[i].name==saveFile.surroundings[n].local_production_boost[nn].surrounding || saveFile.surroundings[n].local_production_boost[nn].surrounding=="*all"){
                                                    for(var nnn = 0; nnn<saveFile.surroundings[n].local_production_boost[nn].boost.length; nnn++){
                                                        if(saveFile.surroundings[n].local_production_boost[nn].boost[nnn].resource==incomeCache[iii].name || saveFile.surroundings[n].local_production_boost[nn].boost[nnn].resource=="*all"){
                                                            surroundingsBoost+=saveFile.surroundings[n].local_production_boost[nn].boost[nnn].boost*saveFile.surroundings[n].curr;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                
                                
                                //finalIncome
                                finalIncome*=workshopBoost;
                                finalIncome*=surroundingsBoost;
                                incomeCache[iii].incAdd+=finalIncome;
                            }
                        }
                    }
                }
                //storage
                if(saveFile.surroundings[i].type_storage){
                    for(var ii = 0; ii<saveFile.surroundings[i].storage.length; ii++){
                        for(var iii = 0; iii<incomeCache.length; iii++){
                            if(incomeCache[iii].name==saveFile.surroundings[i].storage[ii].resource){
                                //basic storage
                                var finalStorage = saveFile.surroundings[i].storage[ii].amount*saveFile.surroundings[i].curr;
                                var workshopBoost = 1;
                                var surroundingsBoost = 1;
                                //workshop boosts
                                for(var n = 0; n<saveFile.workshop.length; n++){
                                    if(saveFile.workshop[n].unlocked){
                                        if(saveFile.workshop[n].type_local_storage_boost){
                                            for(var nn = 0; nn<saveFile.workshop[n].local_storage_boost.length; nn++){
                                                if(saveFile.surroundings[i].name==saveFile.workshop[n].local_storage_boost[nn].surrounding || saveFile.workshop[n].local_storage_boost[nn].surrounding=="*all"){
                                                    for(var nnn = 0; nnn<saveFile.workshop[n].local_storage_boost[nn].boost.length; nnn++){
                                                        if(saveFile.workshop[n].local_storage_boost[nn].boost[nnn].resource==incomeCache[iii].name || saveFile.workshop[n].local_storage_boost[nn].boost[nnn].resource=="*all"){
                                                            workshopBoost+=saveFile.workshop[n].local_storage_boost[nn].boost[nnn].boost;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                //surroundings boosts
                                for(var n = 0; n<saveFile.surroundings.length; n++){
                                    if(saveFile.surroundings[n].curr>0){
                                        if(saveFile.surroundings[n].type_local_storage_boost){
                                            for(var nn = 0; nn<saveFile.surroundings[n].local_storage_boost.length; nn++){
                                                if(saveFile.surroundings[i].name==saveFile.surroundings[n].local_storage_boost[nn].surrounding || saveFile.surroundings[n].local_storage_boost[nn].surrounding=="*all"){
                                                    for(var nnn = 0; nnn<saveFile.surroundings[n].local_storage_boost[nn].boost.length; nnn++){
                                                        if(saveFile.surroundings[n].local_storage_boost[nn].boost[nnn].resource==incomeCache[iii].name || saveFile.surroundings[n].local_storage_boost[nn].boost[nnn].resource=="*all"){
                                                            surroundingsBoost+=saveFile.surroundings[n].local_storage_boost[nn].boost[nnn].boost*saveFile.surroundings[n].curr;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                
                                
                                //finalIncome
                                finalStorage*=workshopBoost;
                                finalStorage*=surroundingsBoost;
                                incomeCache[iii].strAdd+=finalStorage;
                            }
                        }
                    }
                }
            }
        }
        
        //surroudnings global boost
        for(var i = 0; i<saveFile.surroundings.length; i++){
            if(saveFile.surroundings[i].curr>0){
                if(saveFile.surroundings[i].type_global_production_boost){
                    for(var ii = 0; ii<saveFile.surroundings[i].global_production_boost.length; ii++){
                        for(var iii = 0; iii<incomeCache.length; iii++){
                            if(incomeCache[iii].name==saveFile.surroundings[i].global_production_boost[ii].resource || saveFile.surroundings[i].global_production_boost[ii].resource=="*all"){
                                incomeCache[iii].surrIncGlobalMultiplier+=saveFile.surroundings[i].globalProduction_boost[ii].boost*saveFile.surroundings[i].curr;
                            }
                        }
                    }
                }
            }
        }
        //workshop global boost
        for(var i = 0; i<saveFile.workshop.length; i++){
            if(saveFile.workshop[i].unlocked){
                if(saveFile.workshop[i].type_global_production_boost){
                    for(var ii = 0; ii<saveFile.workshop[i].global_production_boost.length; ii++){
                        for(var iii = 0; iii<incomeCache.length; iii++){
                            if(incomeCache[iii].name==saveFile.workshop[i].global_production_boost[ii].resource || saveFile.workshop[i].global_production_boost[ii].resource=="*all"){
                                incomeCache[iii].workIncGlobalMultiplier+=saveFile.workshop[i].globalProduction_boost[ii].boost;
                            }
                        }
                    }
                }
            }
        }
        
        
        //set final income and storage
        for(var i = 0; i<saveFile.resources.length; i++){
            for(var ii = 0; ii<incomeCache.length; ii++){
                if(saveFile.resources[i].name==incomeCache[ii].name){
                    var finalInc = incomeCache[ii].incAdd*incomeCache[ii].workIncGlobalMultiplier*incomeCache[ii].surrIncGlobalMultiplier;
                    var finalStr = incomeCache[ii].strAdd*incomeCache[ii].workStrGlobalMultiplier*incomeCache[ii].surrStrGlobalMultiplier;
                    saveFile.resources[i].inc = finalInc;
                    if(settings.god){
                        saveFile.resources[i].inc*=clickPower;
                    }
                    saveFile.resources[i].max = finalStr;
                }
            }
        }
    }
    
    function getResInc(name){
        for(var i = 0; i<saveFile.resources.length; i++){
            if(saveFile.resources[i].name==name){
                return saveFile.resources[i].inc;
            }
        }
    }
    
    function refreshData(){
        document.getElementById("tickCurr").innerHTML = shortenData(saveFile.data);
    }
    
    function refreshSurroundings(){
        if(saveFile.laboratory[1].unlocked){
            document.getElementById("surrButton").style.display = 'initial';
        }
        else{
            document.getElementById("surrButton").style.display = 'none';
        }
        
        if(document.getElementById("surrFrame").style.display != 'none'){
            for(var i = 0; i<saveFile.surroundings.length; i++){
                if(saveFile.surroundings[i].avaible == true){
                    document.getElementById(saveFile.surroundings[i].name+' upgradeButton').style.display = 'initial';
                }
                else{
                    document.getElementById(saveFile.surroundings[i].name+' upgradeButton').style.display = 'none';
                }
                document.getElementById(saveFile.surroundings[i].name+"Curr").innerHTML = saveFile.surroundings[i].curr;
                
                
                
                
                for(var ii = 0; ii<saveFile.surroundings[i].cost.length; ii++){
                    document.getElementById(saveFile.surroundings[i].name+saveFile.surroundings[i].cost[ii].resource+"Cost").innerHTML = round(saveFile.surroundings[i].cost[ii].amount);
                }
                
            }
        }
    }
    
    function refreshLaboratory(){
        if(document.getElementById("labFrame").style.display != 'none'){
            for(var i = 0; i<saveFile.laboratory.length; i++){
                if(saveFile.laboratory[i].unlocked == true ){
                    document.getElementById(saveFile.laboratory[i].name+' upgradeButton').disabled = true;;
                }
                else{
                    document.getElementById(saveFile.laboratory[i].name+' upgradeButton').disabled = false;
                }
                
                if(saveFile.laboratory[i].avaible == true){
                    document.getElementById(saveFile.laboratory[i].name+' upgradeButton').style.display = 'initial';
                }
                else{
                    document.getElementById(saveFile.laboratory[i].name+' upgradeButton').style.display = 'none';
                }

                if(settings.hide && saveFile.laboratory[i].unlocked){
                    document.getElementById(saveFile.laboratory[i].name+" upgradeButton").style.display = 'none';
                }
                else if(saveFile.laboratory[i].avaible){
                    document.getElementById(saveFile.laboratory[i].name+" upgradeButton").style.display = 'initial';
                }
            }
        }
    }
    
    function refreshWorkshop(){
        if(saveFile.laboratory[2].unlocked){
            document.getElementById("workButton").style.display = 'initial';
        }
        else{
            document.getElementById("workButton").style.display = 'none';
        }
        
        if(document.getElementById("workFrame").style.display != 'none'){
            for(var i = 0; i<saveFile.workshop.length; i++){
                if(saveFile.workshop[i].unlocked==true){
                    document.getElementById(saveFile.workshop[i].name+" upgradeButton").disabled = true;
                }
                else{
                    document.getElementById(saveFile.workshop[i].name+" upgradeButton").disabled = false;
                }
                
                if(saveFile.workshop[i].avaible == true){
                    document.getElementById(saveFile.workshop[i].name+' upgradeButton').style.display = 'initial';
                }
                else{
                    document.getElementById(saveFile.workshop[i].name+' upgradeButton').style.display = 'none';
                }
                
                if(settings.hide && saveFile.workshop[i].unlocked){
                    document.getElementById(saveFile.workshop[i].name+" upgradeButton").style.display = 'none';
                }
                else if(saveFile.workshop[i].avaible){
                    document.getElementById(saveFile.workshop[i].name+" upgradeButton").style.display = 'initial';
                }
            }
        }
    }
    
    function refreshSurface(){
        if(saveFile.laboratory[0].unlocked){
            document.getElementById("surfButton").style.display = 'initial';
        }
        else{
            document.getElementById("surfButton").style.display = 'none';
        }
    }
    
    function refreshStats(){
        if(document.getElementById("statsFrame").style.display != 'none'){
            //local stats
            document.getElementById("statsFrame").innerHTML = "Local stats:<br><br>";
            for(var i = 0; i<saveFile.stats.length; i++){
                var entry = document.createElement("span");
                entry.className = "stat";
                entry.innerHTML = saveFile.stats[i].name+": "+shortenValue(round(saveFile.stats[i].value));
                document.getElementById("statsFrame").appendChild(entry);
                document.getElementById("statsFrame").innerHTML+="<br>";
            }
            //global stats
            document.getElementById("statsFrame").innerHTML += "<br><br>Global stats:<br><br>";
            for(var i = 0; i<globalStats.length; i++){
                var entry = document.createElement("span");
                entry.className = "stat";
                entry.innerHTML = globalStats[i].name+": "+shortenValue(round(globalStats[i].value));
                document.getElementById("statsFrame").appendChild(entry);
                document.getElementById("statsFrame").innerHTML+="<br>";
            }
        }
    }
    
    function refreshOther(){
        for(var i = 0; i<document.getElementsByName("currRes").length; i++){
            document.getElementsByName("currRes")[i].innerHTML = round(getRes(document.getElementsByName("currRes")[i].id.replace("Curr", "")));               
        }
    }
    
    function loadSurroundings(){
        saveFile.surroundings = JSON.parse(getXML("res/JSONs/surroundings.json"));
    }

    function loadResources(){
        saveFile.resources = JSON.parse(getXML("res/JSONs/resources.json"));
    }
    
    function loadLaboratory(){
        saveFile.laboratory = JSON.parse(getXML("res/JSONs/laboratory.json"));
    }
    
    function loadWorkshop(){
        saveFile.workshop = JSON.parse(getXML('res/JSONs/workshop.json'));
    }

    function saveStuff(){
        localStorage.setItem("saveFile", JSON.stringify(saveFile));
    }
    
    function saveStats(){
        localStorage.setItem("statsFile", JSON.stringify(globalStats));
    }
    
    function loadSave(){
        if(localStorage.getItem("saveFile")!=null){
            loadStartSetup();
            saveFile = JSON.parse(localStorage.getItem("saveFile"));
        }
        else{
            loadStartSetup();
        }
        createCode();
    }
    
    function loadStats(){
        if(localStorage.getItem("statsFile")!=null){
            globalStats = JSON.parse(localStorage.getItem("statsFile"));
        }
        else{
            localStorage.setItem("statsFile", JSON.stringify(globalStats));
        }
    }
    
    function loadStartSetup(){
        saveFile.data = 0;
        saveFile.stats = [];
        loadResources();
        loadSurroundings();
        loadLaboratory();
        loadWorkshop();
    }
    
    function refreshSignal(){
        var finalSignalChance = signalChance;
        var finalSignalLength = signalLength;
        var chanceMultiplier = 1;
        var lengthMultiplier = 1;
        for(var i = 0; i<saveFile.workshop.length; i++){
            if(saveFile.workshop[i].unlocked){
                //chance
                if(saveFile.workshop[i].type_signal_chance_add){
                    finalSignalChance+=saveFile.workshop[i].signal_chance_add;
                }
                if(saveFile.workshop[i].type_signal_chance_multiply){
                    chanceMultiplier+=saveFile.workshop[i].signal_chance_multiply;
                }
                
                //length
                if(saveFile.workshop[i].type_signal_length_add){
                    finalSignalChance+=saveFile.workshop[i].signal_length_add;
                }
                if(saveFile.workshop[i].type_signal_length_multiply){
                    lengthMultiplier+=saveFile.workshop[i].signal_length_multiply;
                }
            }
        }
        finalSignalChance*=chanceMultiplier;
        finalSignalLength*=lengthMultiplier;
        
        if(signalVisible){
            signalCurr++;
            if(signalCurr>finalSignalLength){
                signalVisible = false;
                document.getElementById('signalButton').style.display = 'none';
                addLogEntry("Transmission lost");
                signalCurr = 0;
            }
        }
        
        if(!signalVisible){
            if(Math.random()*10000<finalSignalChance){
                signalVisible = true;
                document.getElementById('signalButton').style.display = 'initial';
                addLogEntry("Incoming transmission");
            }
        }
    }
    
    function reset(){
        saveFile.data = 0;
        loadStartSetup();
        createCode();
        addHighLogEntry('reset');
    }
    
    function prestige(){
        var prestigeValue = 0;
        loadStartSetup();
        createCode();
        addResource("Prestige Resource", prestigeValue);
        addLogEntry("Prestiged.");
    }
    
    initRes();
    
    document.getElementById('saveButton').addEventListener('click', saveStuff);
    document.getElementById('loadButton').addEventListener('click', loadSave);
    document.getElementById('resetButton').addEventListener('click', reset);