ascending = () => {
    var button = document.getElementById("sort_button");
    var rows = document.querySelectorAll("tbody tr");
    var table = document.getElementById("main_table");
    console.log(button.innerHTML)
    if(button.innerHTML=='↓'){
        names = [];
        prices = [];
        tags = [];
        stars = []
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            tags.push(rows[i].children[1].innerHTML)
            prices.push(parseInt(rows[i].children[2].innerHTML));
            stars.push(parseFloat(rows[i].children[3].innerHTML));
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
            var cell4 = document.createElement("td");
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = tags[indices[i]];
            cell3.innerHTML = prices[indices[i]];
            cell4.innerHTML = stars[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4)
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "&uarr;";
    }
    else{
        names = [];
        prices = [];
        tags = [];
        stars = [];
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            tags.push(rows[i].children[1].innerHTML)
            prices.push(parseInt(rows[i].children[2].innerHTML));
            stars.push(parseFloat(rows[i].children[3].innerHTML));
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
            var cell4 = document.createElement("td")
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = tags[indices[i]];
            cell3.innerHTML = prices[indices[i]];
            cell4.innerHTML = stars[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "&darr;";
    }
}


myascending = () => {
    var button = document.getElementById("review_sort_button");
    var rows = document.querySelectorAll("tbody tr");
    var table = document.getElementById("main_table");
    console.log(button.innerHTML)
    if(button.innerHTML=='↓'){
        names = [];
        prices = [];
        tags = [];
        stars = []
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            tags.push(rows[i].children[1].innerHTML)
            prices.push(parseInt(rows[i].children[2].innerHTML));
            stars.push(parseFloat(rows[i].children[3].innerHTML));
        }
        indices = []
        for(i=0;i<names.length;i++){
            indices.push(i);
        }
        indices.sort((x,y)=>stars[x]<stars[y]?-1:1);
        for(i=0;i<names.length;i++){
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            var cell4 = document.createElement("td");
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = tags[indices[i]];
            cell3.innerHTML = prices[indices[i]];
            cell4.innerHTML = stars[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4)
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "&uarr;";
    }
    else{
        names = [];
        prices = [];
        tags = [];
        stars = [];
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            tags.push(rows[i].children[1].innerHTML)
            prices.push(parseInt(rows[i].children[2].innerHTML));
            stars.push(parseFloat(rows[i].children[3].innerHTML));
        }
        indices = []
        for(i=0;i<names.length;i++){
            indices.push(i);
        }
        indices.sort((x,y)=>stars[x]>stars[y]?-1:1);
        for(i=0;i<names.length;i++){
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            var cell4 = document.createElement("td")
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = tags[indices[i]];
            cell3.innerHTML = prices[indices[i]];
            cell4.innerHTML = stars[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "&darr;";
    }
}





mymyascending = () => {
    var button = document.getElementById("sort_button");
    var rows = document.querySelectorAll("#main_table tr");
    var table = document.getElementById("main_table");
    console.log(button.innerHTML)
    if(button.innerHTML=='↓'){
        names = [];
        stars = [];
        reviews = [];
        for(var i=0;i<rows.length;i++){
            console.log(rows[i]);
            names.push(rows[i].children[0].innerHTML);
            stars.push(rows[i].children[1].innerHTML)
            reviews.push(rows[i].children[2].innerHTML);
        }
        indices = []
        for(i=0;i<names.length;i++){
            indices.push(i);
        }
        indices.sort((x,y)=>stars[x]<stars[y]?-1:1);
        for(i=0;i<names.length;i++){
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = stars[indices[i]];
            cell3.innerHTML = reviews[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "&uarr;";
    }
    else{
        names = [];
        stars = [];
        reviews = [];
        for(var i=0;i<rows.length;i++){
            names.push(rows[i].children[0].innerHTML);
            stars.push(rows[i].children[1].innerHTML)
            reviews.push((rows[i].children[2].innerHTML));
        }
        indices = []
        for(i=0;i<names.length;i++){
            indices.push(i);
        }
        indices.sort((x,y)=>stars[x]>stars[y]?-1:1);
        for(i=0;i<names.length;i++){
            var row = document.createElement("tr");
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            cell1.innerHTML = names[indices[i]];
            cell2.innerHTML = stars[indices[i]];
            cell3.innerHTML = reviews[indices[i]];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.style.display = rows[indices[i]].style.display;
            rows[i].remove();
            table.appendChild(row);
        }
        button.innerHTML = "&darr;";
    }
}



filter = function(temp_tag){
    var all_btns = document.querySelectorAll('.modal-body button');
    for(i=0;i<all_btns.length;i++){
        all_btns[i].disabled = true;
    }
    filter_helper(temp_tag);
    for(i=0;i<all_btns.length;i++){
        all_btns[i].disabled = false;
    }
}

filter_helper = function(temp_tag){
    var rows = document.querySelectorAll("tbody tr");
    var table = document.getElementById("main_table");
    var btn = document.getElementById(temp_tag);
    var all_btns = document.querySelectorAll('.modal-body button');
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
    for(i=0;i<all_btns.length;i++){
        if(all_btns[i].style.textDecoration==='line-through'&&all_btns[i].innerHTML!==temp_tag){
            all_btns[i].style.textDecoration='';
            filter_helper(all_btns[i].innerHTML);
        }
    }
}


search = function(){
    que = document.getElementById("search").value;
    que.replace(" ","");
    if(que===""){
        return;
    }
    var pattern = new RegExp(que,'i');
    console.log(que);
    var rows = document.querySelectorAll("tbody tr");
    for(var i=0;i<rows.length;i++){
        rows[i].style.display = "";
    }
    var all_btns = document.querySelectorAll('.modal-body button');
        for(i=0;i<all_btns.length;i++){
            all_btns[i].style.textDecoration="";
        }
    for(var i=0;i<rows.length;i++){
        id = rows[i].children[0].innerText;
        if(!id.match(pattern)){
            rows[i].style.display = "none";
        }
    }
}