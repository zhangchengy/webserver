//该函数用来获取当前目录下所有文件(夹)
var count = 0;
var tree = function () {};
tree.rootTree = function () { //初始化树
    ajax({
        url: "DirList.Action",
        type: "POST",
        async: true,
        data: {
            dirPath: "."
        },
        success: tree.showTree
    });
}

/** 
 * @param {JSON} data 
 */
tree.showTree = function (data) { //显示树的目录
    data = JSON.parse(data);
    Tree = document.getElementById("tree");
    for (var j = 0, len = data.files.length; j < len; j++) {
        if (data.files[j].directory === true)
            Tree.appendChild(tree.setNode(data, j));
    }
    for (var j = 0, len = data.files.length; j < len; j++) {
        if (data.files[j].directory !== true)
            Tree.appendChild(tree.setNode(data, j));
    }
    file.clickDir = document.getElementById("rootDirNode");
    addressBar.getAddressBarNode();
}

/** 
 * @param {JSON} data 
 * @param {number}  j
 */
tree.setNode = function (data, j) {
    var li = document.createElement("li");
    var div = document.createElement("div");
    var img = document.createElement('img');
    if (data.files[j].directory === true) {
        if (data.files[j].childrenSum !=0) {
            img.setAttribute("src", "WebRoot/image/ztri.png");          
        } else {
            div.style.marginLeft="16px";
            img.setAttribute("src", ""); 
        } 
        div.setAttribute("childrenSum", data.files[j].childrenSum);
        div.appendChild(img);
        img = document.createElement('img');
        div.setAttribute("onclick", "tree.opendir(this);");
        div.setAttribute("state", "off");
        div.setAttribute("asked", "no");
        img.setAttribute("src", "WebRoot/image/dir.png");
    } else {
        div.style.marginLeft="16px";
        div.setAttribute("onclick", "file.fileOpen(this);");
        img.setAttribute("src", "WebRoot/image/file.png");
    }
    div.appendChild(img);
    var span = document.createElement("span");
    span.innerHTML = data.files[j].fileName;
    div.setAttribute("title", data.files[j].filePath);
    div.appendChild(span);
    li.appendChild(div);
    return li;
}

/** 
 * 
 * @param {Element} e
 */
tree.opendir = function (e) {
    file.clickDir = e;
    document.getElementById("rootDirNode").style.background = ""; 
    document.getElementById("right_click_menu").style.display = "none";   
    //当点击文件夹选中后，会发生监听鼠标右键事件，可以在右键选择新建子文件夹，删除本文件夹，在文件夹下建立新文件
    var div = result.getElementsByTagName("div");
    for (var i = 0; i < div.length; i++)
        div[i].style.background = "";
    e.style.background = "#AAAAAA";
    document.oncontextmenu = function () {
        return false;
    }
    e.oncontextmenu = function () {
        file.showRightClickMenu(e);
    }
    addressBar.modifyAddress(e);
    if (e.getAttribute("childrenSum") !=0) {
        if (e.getAttribute("asked") === "no") {
            e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
            ajax({
                url: "DirList.Action",
                type: "POST",
                async: true,
                data: {
                    dirPath: e.getAttribute("title")
                },
                success: openChildDir
            });
            /**       
             * @param {JSON} data 
             */
            function openChildDir(data) {
                data = JSON.parse(data);
                var ul = document.createElement("ul");
                for (var j = 0, len = data.files.length; j < len; j++) {
                    if (data.files[j].directory === true)
                        ul.appendChild(tree.setNode(data, j));
                }
                for (var j = 0, len = data.files.length; j < len; j++) {
                    if (data.files[j].directory !== true)
                        ul.appendChild(tree.setNode(data, j));
                }
                e.parentNode.appendChild(ul);
            }
            e.setAttribute("asked", "yes");
            e.setAttribute("state", "on");
        } else {
            if (e.getAttribute("state") === "off") {
                e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
                e.nextElementSibling.style.display = "block";
                e.setAttribute("state", "on");
            } else {
                e.firstElementChild.setAttribute("src", "WebRoot/image/ztri.png");
                e.nextSibling.style.display = "none";
                e.setAttribute("state", "off");
            }
        }
    }
}

/**       
 * @param {Element} e
 */
tree.rootDirNode = function (e) {
    var right_click_menu = document.getElementById("right_click_menu");
    right_click_menu.style.display = "none";
    var div = document.getElementById("tree").getElementsByTagName("div");
    for (var i = 0; i < div.length; i++)
        div[i].style.background = "";
    e.style.background = "#AAAAAA";
    if (e.getAttribute("state") === "on") {
        document.getElementById("tree").style.display = "none";
        e.firstElementChild.setAttribute("src", "WebRoot/image/ztri.png");
        e.setAttribute("state", "off");
    } else {
        document.getElementById("tree").style.display = "block";
        e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
        e.setAttribute("state", "on");
    }
    document.oncontextmenu = function () {
        return false;
    }
    e.oncontextmenu = function () {
        file.showRightClickMenu(e);
    }
    addressBar.modifyAddress(e);
    file.clickDir = e;
}

window.onload = function () {
    tree.rootTree();
    var body = document.getElementsByTagName("body");
    document.ondrop = function (e) {
        e.preventDefault();
    }
    // 这个阻止默认事件是为了让drop事件得以触发
    document.ondragover = function (e) {
        e.preventDefault();
    }

    body[0].ondrop = function (e) {
        // 得到拖拽过来的文件
        file.uploadFile(e);
    }
    body[0].onclick=function(){
       document.getElementById("right_click_menu").style.display = "none";
    }
}