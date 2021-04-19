ascending = () => {
    var button = document.getElementById("sort_button");
    var rows = document.querySelectorAll("tbody tr");
    var table = document.getElementById("main_table");
    if(button.innerHTML=="Sort by ascending order of price"){
        names = [];
        prices = [];
        tags = [];
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            tags.push(rows[i].children[1].innerHTML)
            prices.push(parseInt(rows[i].children[2].innerHTML));
        }
        indices = []
        for(i=0;i<names.length;i++){
            indices.push(i);
        }
        indices.sort((x,y)=>prices[x]<prices[y]?-1:1);
        for(i=0;i<names.length;i++){
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = tags[indices[i]];
            cell3.innerHTML = prices[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "Sort by descending order of price";
    }
    else{
        names = [];
        prices = [];
        tags = [];
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            tags.push(rows[i].children[1].innerHTML)
            prices.push(parseInt(rows[i].children[2].innerHTML));
        }
        indices = []
        for(i=0;i<names.length;i++){
            indices.push(i);
        }
        indices.sort((x,y)=>prices[x]>prices[y]?-1:1);
        for(i=0;i<names.length;i++){
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = tags[indices[i]];
            cell3.innerHTML = prices[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "Sort by ascending order of price";
    }
}

filter = function(temp_tag){
    var rows = document.querySelectorAll("tbody tr");
    var table = document.getElementById("main_table");
    var btn = document.getElementById(temp_tag);
    if(btn.style.textDecoration!=="line-through"){
        btn.style.textDecoration="line-through";
        for(var i=0;i<rows.length;i++){
            mytags = rows[i].children[1].innerHTML;
            temp = mytags.split(",");
            if(temp.indexOf(temp_tag)!==-1){
                rows[i].style.display = 'none';
            }
        }
        return;
    }
    if(btn.style.textDecoration==="line-through"){
        btn.style.textDecoration='';
        for(var i=0;i<rows.length;i++){
            mytags = rows[i].children[1].innerHTML;
            temp = mytags.split(",");
            if(temp.indexOf(temp_tag)!==-1){
                rows[i].style.display = '';
            }
        }
    }
    else{
        var all_btns = document.querySelectorAll('#main_drop_down button');
        for(i=0;i<all_btns.length;i++){
            if(all_btns[i].style.textDecoration==='line-through'&&all_btns[i].innerHTML!==temp_tag){
                all_btns[i].style.textDecoration='';
                console.log(all_btns[i].innerHTML)
                filter(all_btns[i].innerHTML);
            }
        }
    }
}


search = function(){
    que = document.getElementById("search").value;
    que.replace(" ","");
    if(que===""){
        return;
    }
    var pattern = new RegExp(que);
    var rows = document.querySelectorAll("tbody tr");
    for(var i=0;i<rows.length;i++){
        rows[i].style.display = "";
    }
    var all_btns = document.querySelectorAll('#main_drop_down button');
        for(i=0;i<all_btns.length;i++){
            all_btns[i].style.textDecoration="";
        }
    for(var i=0;i<rows.length;i++){
        id = rows[i].children[0].innerHTML;
        if(!id.match(pattern)){
            rows[i].style.display = "none";
        }
    }
}