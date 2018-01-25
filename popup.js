document.addEventListener('DOMContentLoaded', () => {
  var btSplit = document.getElementById('btSplit');
  var urlList = [];
  var windowsList = [];
  btSplit.addEventListener('click', () => {

    var checkedBoxes = document.querySelectorAll('input[name=urlcb]:checked');

    checkedBoxes.forEach(function (e) {
      urlList.push(e.value);
    })

    //creates a window
    if (urlList != null) {
      chrome.windows.create({
        url: urlList,
        type: "normal"
      });
    }
  })

  chrome.windows.getAll({ populate: true }, function (windows) {
    var cbList = document.getElementById("cbList");

    windows.forEach(function (window) {
      let color = getRandomColor();
      let listId = "list_" + window.id;
      windowsList.push(listId);

      let list = document.createElement("div");
      list.setAttribute('id', listId);
      list.classList.add("listMain")
      cbList.appendChild(list);

      let ul = document.createElement("ul");
      // ul.classList.add("list");  
      ul.setAttribute('id', "list");
      ul.setAttribute('style', 'background-color: #f0ffee!important;border-color: #2196F3!important;border-left: 6px solid ' + color + '!important;')
      list.appendChild(ul);

      window.tabs.forEach(function (tab) {

        // main tag
        // active:false
        // audible:true

        let li = document.createElement("li");
        let urlText = document.createElement("span");
        let icon = document.createElement("img");
        let checkbox = document.createElement("input");
        let close = document.createElement("input");
        icon.setAttribute("src", tab.favIconUrl);
        icon.setAttribute("width", "16");
        icon.setAttribute("height", "16");
        icon.setAttribute("class", "urlIcon")
        close.setAttribute('class','cclose');
        urlText.setAttribute("class", "item");
        urlText.textContent = tab.title.substring(0, 35);
        urlText.title = tab.title;
        close.value = 'X';
        close.type = 'button';
        close.id = tab.id;
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "urlcb");
        checkbox.setAttribute("class", "cb");
        checkbox.value = tab.url;
        // make it bold
        if(tab.active){
          urlText.style.fontWeight =  "bold";
        }
        if(tab.audible){
          let audioIcon = document.createElement("img");
          audioIcon.setAttribute("src", "\\img\\SoundIcon.png");
          audioIcon.setAttribute('class','audio')
          audioIcon.setAttribute("width", "16");
          audioIcon.setAttribute("height", "16");
          li.appendChild(audioIcon);

          audioIcon.addEventListener('click',function(e){
            muteTab(e.path[1].lastChild.id);
            console.log(e.path[1].lastChild.id)
        });
        }
        // append tags
        li.appendChild(checkbox);
        li.appendChild(icon);
        li.appendChild(urlText);
        li.appendChild(close);
        ul.appendChild(li);

        close.addEventListener('click',function(e){
              closeTab(e.path[0].id);
          });

          urlText.addEventListener('click',function(e){
            // ev.stopPropagation();
            // ev.preventDefault();
            // console.log(e.path[0].id)
                console.log(e)
                selectTab(e.path[1].childNodes[3].id);
            });
         
      });
    });

  });

  $(".search").keyup(function () {
    search();
  });
  
   
});

function muteTab(e){
  let tabId = Number(e);
  chrome.tabs.get(tabId,function(tab){ 
     chrome.tabs.update(tabId, { muted: !tab.mutedInfo.muted });

     $("#"+tabId).siblings(".audio").attr("src", tab.mutedInfo.muted? "\\img\\SoundIcon.png": "\\img\\MuteIcon.png")
  })
  
}

function selectTab(e){
  var tabId = Number(e);
  chrome.tabs.update(tabId, { active: true });
}

// close the tab
function closeTab(e) {
  var tabId = Number(e);
  chrome.tabs.remove(tabId);
  $( "#" + e ).parent().remove();
	e.stopPropagation();
	e.preventDefault();
}

// generates a random color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// search through the item tags
function search() {
  var input, filter, ul, li, a, i;
  input = document.getElementsByClassName('search');
  filter = input[0].value.toUpperCase();
  ul = document.getElementsByClassName("listMain");
  for (t = 0; t < ul.length; t++) {
    li = ul[t].getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("span")[0];
      if (a.title.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

}