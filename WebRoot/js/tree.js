var Tree = function (file) {
    this.clickedFileNode; //点击目录树中的文件时，将点击的div存储到该变量
    this.clickedFolderNode = rootDirNode;; //点击目录树中的文件夹时，将点击的div存储到该变量
    this.file = file;

    var self = this;
    this.file.openFolder(this.clickedFolderNode.title, function (data) {
        self.setChildrenNode(data);
    });
}

Tree.prototype = {
    init: function () {
        var self = this;
        this.clickedFolderNode = rootDirNode;
        this.file.openFolder(this.clickedFolderNode.title, function (data) {
            self.setChildrenNode(data);
        });
    },

    //树中文件夹展开收起的状态变化
    transformFolderNodeStatus: function () {
        var e = this.clickedFolderNode;
        if (e.getAttribute("childrenSum") > 0) {
            if (e.getAttribute("state") === "off") {
                e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
                e.nextElementSibling.style.display = "block";
                e.setAttribute("state", "on");
            } else {
                e.firstElementChild.setAttribute("src", "WebRoot/image/ztri.png");
                e.nextElementSibling.style.display = "none";
                e.setAttribute("state", "off");
            }
        }
    },

    //建立某文件夹下所有子文件夹结点
    setChildrenNode: function (data) {
        var self = this;
        var e = this.clickedFolderNode;
        data = JSON.parse(data);
        var ul = document.createElement("ul");
        for (var j = 0, len = data.files.length; j < len; j++) {
            if (data.files[j].directory == true)
                ul.appendChild(this.setNode(data.files[j]));
        }
        for (var j = 0, len = data.files.length; j < len; j++) {
            if (data.files[j].directory == false)
                ul.appendChild(this.setNode(data.files[j]));
        }
        e.parentNode.appendChild(ul);
        e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
        e.nextElementSibling.style.display = "block";
        e.setAttribute("state", "on");
        e.setAttribute("asked", "yes");
        e.setAttribute("state", "on");
        if (e.title == ".") {
            e.addEventListener("click", function (e) {
                self.clickedFolderNode = this;
                self.transformFolderNodeStatus();
                self.highlightNode(this);
            });
            this.file.openAddressBarFile(
                function (data) {
                    self.setAddressBarFileNode(data);
                });
        }
    },

    //建立具体的某个单个文件（夹）结点
    setNode: function (node) {
        var self = this;
        var li = document.createElement("li");
        var div = document.createElement("div");
        var img = document.createElement('img');
       
        if (node.directory == true) {
            if (node.childrenSum != 0) {
                img.setAttribute("src", "WebRoot/image/ztri.png");
            } else {
                div.style.marginLeft = "16px";
                img.setAttribute("src", "");
            } 
            div.setAttribute("asked", "no");
            div.appendChild(img);
            img = document.createElement('img');
            div.setAttribute("state", "off");
            img.setAttribute("src", "WebRoot/image/dir.png");
            div.setAttribute("childrenSum", node.childrenSum);
            div.addEventListener("click", function () {
                self.clickedFolderNode = this;
                if (this.getAttribute("asked") == "no" && this.getAttribute("childrenSum") != 0)
                    self.file.openFolder(self.clickedFolderNode.title, function (data) {
                        self.setChildrenNode(data);
                    });
                else {
                    self.transformFolderNodeStatus();
                }
                self.highlightNode(this);
                self.showRightClickMenu(this);
            });
        } else {
            div.style.marginLeft = "16px";
            img.setAttribute("src", "WebRoot/image/file.png");
            div.addEventListener("click", function () {
                self.clickedFileNode = this;
                self.clickedFolderNode = this.parentNode.parentNode.previousElementSibling;
                self.file.openFile(this.title);
                showFileContent(this);
                self.highlightNode(this);
            });
        }
        div.appendChild(img);
        var span = document.createElement("span");
        span.innerHTML = node.fileName;
        div.setAttribute("title", node.filePath);
        div.appendChild(span);
        li.appendChild(div);
        return li;
    },

    //  显示右键菜单
    showRightClickMenu: function (e1) {
        var self = this;
        document.oncontextmenu = function () {
            return false;
        }
        e1.oncontextmenu = function () {
            if (document.getElementById("right_click_menu"))
                document.body.removeChild(right_click_menu);
            var div = document.createElement("div");
            div.setAttribute("id", "right_click_menu");
            var li;
            li = document.createElement("li");
            li.setAttribute("id", "right_click_menu_new_childdir");
            li.innerHTML = "新建子目录";
            div.appendChild(li);
            li = document.createElement("li");
            li.setAttribute("id", "right_click_menu_newfile");
            li.innerHTML = "新建文件";
            div.appendChild(li);
            li = document.createElement("li");
            li.setAttribute("id", "right_click_menu_deletedir");
            li.innerHTML = "删除目录";
            div.appendChild(li);
            document.body.appendChild(div);

            right_click_menu_new_childdir.addEventListener("click", function () {
                self.newFileInputNode(this);
            });
            right_click_menu_newfile.addEventListener("click", function () {
                self.newFileInputNode(this);
            });
            right_click_menu_deletedir.addEventListener("click", function () {
                self.file.deleteFolder(self.clickedFolderNode.title, self.deleteFolderNode());
                modifyAddressBarAddress(self.clickedFolderNode.parentNode.parentNode.previousElementSibling); ///////
            });

            var e = event || window.event;
            div.style.left = e.clientX + "px";
            div.style.top = e.clientY + "px";
            div.style.display = "block";
        }
    },

    //建立新建文件（夹）时的输入框结点
    newFileInputNode: function (e) {
        var self = this;
        if (this.clickedFolderNode.getAttribute("state") == "off")
            this.transformFolderNodeStatus();
        var right_click_menu = document.getElementById("right_click_menu");
        right_click_menu.style.display = "none";
        var li = document.createElement("li");
        li.setAttribute("id", "temp_li");
        var input = document.createElement("input");
        input.setAttribute("id", "temp_input");
        var cancel_button = document.createElement("button");
        cancel_button.setAttribute("id", "cancel_button");
        cancel_button.innerHTML = "取消";
        var ensure_button = document.createElement("button");
        ensure_button.setAttribute("id", "ensure_button");
        ensure_button.innerHTML = "确定";
        li.appendChild(input);
        li.appendChild(ensure_button);
        li.appendChild(cancel_button);
        cancel_button.addEventListener("click", function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
        });
        if (this.clickedFolderNode.getAttribute("childrenSum") != 0) {
            if (e.id == "right_click_menu_new_childdir") {

                ensure_button.addEventListener("click", function () {
                    self.file.newFolder(temp_input.value, self.clickedFolderNode.title, function (data) {
                        self.newFolderNode(data);
                    });
                });
                this.clickedFolderNode.nextElementSibling.insertBefore(li, this.clickedFolderNode.nextElementSibling.firstElementChild);
            } else {
                this.clickedFolderNode.nextElementSibling.appendChild(li);
                ensure_button.addEventListener("click", function () {
                    var newFile = document.getElementById("temp_input").value;
                    if (newFile.indexOf(".") == -1) {
                        newFile = newFile + '.txt';
                    }
                    self.file.newFile(newFile, self.clickedFolderNode.title,
                        function (data) {
                            tree.newFileNode(data);
                        });
                });
            }
        } else {
            var ul = document.createElement("ul");
            ul.appendChild(li);
            this.clickedFolderNode.parentNode.appendChild(ul);
            if (e.id == "right_click_menu_new_childdir") {
                ensure_button.setAttribute("aim", "newdir");
                ensure_button.addEventListener("click", function () {
                    self.file.newFolder(temp_input.value, self.clickedFolderNode.title, function (data) {
                        self.newFolderNode(data);
                    });
                });
            } else {
                ensure_button.setAttribute("aim", "newfile");
                ensure_button.addEventListener("click", function () {
                    var newFile = document.getElementById("temp_input").value;
                    if (newFile.indexOf(".") == -1) {
                        newFile = newFile + '.txt';
                    }
                    self.file.newFile(newFile, self.clickedFolderNode.title,
                        function (data) {
                            self.newFileNode(data);
                        });
                });
            }
        }
    },

    //新建文件夹结点
    newFolderNode: function (data) {
        var newChildDir = temp_input.value;
        data = JSON.parse(data);
        if (data.msg === true) {
            temp_li.parentNode.removeChild(temp_li);
            alert("成功新建文件夹：" + newChildDir);
            var li = this.setNode({
                directory: true,
                fileName: newChildDir,
                filePath: this.clickedFolderNode.getAttribute("title") + "\\" + newChildDir,
                childrenSum: 0
            });
            this.clickedFolderNode.firstElementChild.src = "WebRoot/image/dtri.png";
            this.clickedFolderNode.style.marginLeft = "";
            this.clickedFolderNode.setAttribute("asked", "yes");
            this.clickedFolderNode.setAttribute("childrenSum",Number( this.clickedFolderNode.getAttribute("childrenSum") )+ 1);
            this.clickedFolderNode.nextElementSibling.insertBefore(li, this.clickedFolderNode.nextElementSibling.firstElementChild);
        } else {
            alert("新建文件夹失败：文件夹名重复，无效或者太长");
        }
    },

    //新建文件结点
    newFileNode: function (data) {
        var newFile = document.getElementById("temp_input").value;
        if (newFile.indexOf(".") == -1) {
            newFile = newFile + '.txt';
        }
        data = JSON.parse(data);
        if (data.msg === true) {
            temp_li.parentNode.removeChild(temp_li);
            alert("成功新建文件：" + newFile);
            var li = this.setNode({
                directory: false,
                fileName: newFile,
                filePath: this.clickedFolderNode.getAttribute("title") + "\\" + newFile,
                childrenSum: 0
            });
            this.clickedFolderNode.firstElementChild.src = "WebRoot/image/dtri.png";
            this.clickedFolderNode.style.marginLeft = "";
            this.clickedFolderNode.setAttribute("asked", "yes");
            this.clickedFolderNode.setAttribute("childrenSum", Number(this.clickedFolderNode.getAttribute("childrenSum") )+ 1);
            this.clickedFolderNode.nextElementSibling.appendChild(li);
        } else {
            alert("新建文件失败：文件名重复，无效或者太长");
        }
    },

    //建立上传文件之后的结点
    setUploadFileNode: function (data) {
        if (this.clickedFolderNode.getAttribute("state") == "off")
            this.transformFolderNodeStatus(this.clickedFolderNode);
        data = JSON.parse(data);
        if (data.msg == true) {
            alert("上传文件成功！");
            var li = this.setNode({
                directory: false,
                fileName: data.fileName,
                filePath: this.clickedFolderNode.getAttribute("title") + "\\" + data.fileName,
                childrenSum: 0
            });
            this.clickedFolderNode.setAttribute("state", "on");
            this.clickedFolderNode.firstElementChild.src = "WebRoot/image/dtri.png";
            this.clickedFolderNode.style.marginLeft = "";
            if (!this.clickedFolderNode.nextElementSibling) {
                var ul = document.createElement("ul");
                this.clickedFolderNode.parentNode.appendChild(ul);
                
            }
            this.clickedFolderNode.nextElementSibling.appendChild(li);
            this.clickedFolderNode.setAttribute("childrenSum", Number(this.clickedFolderNode.getAttribute("childrenSum")) + 1);
            this.clickedFileNode = li.firstElementChild;
            this.file.openFile(this.clickedFileNode.title);
            showFileContent(this.clickedFileNode);
            this.highlightNode(this.clickedFileNode);
        } else
            alert("重复！请重命名文件名");
    },

    //删除文件夹结点
    deleteFolderNode: function () {
        var self = this;
        return function () {
            var parentDir = self.clickedFolderNode.parentNode.parentNode.previousElementSibling;
            parentDir.style.background = "#6699FF";
            parentDir.setAttribute("childrenSum", parentDir.getAttribute("childrenSum") - 1);
            if (parentDir.getAttribute("childrenSum") == 0) {
                parentDir.firstElementChild.src = "";
                parentDir.style.marginLeft = "16px";
            }
            self.clickedFolderNode.parentNode.parentNode.removeChild(self.clickedFolderNode.parentNode);
            alert("成功删除文件夹：" + self.clickedFolderNode.getAttribute("title"));
        };
    },

    //删除文件结点
    deleteFileNode: function (data) {
        var delete_file = this.clickedFileNode.getAttribute("title");
        data = JSON.parse(data);
        if (data.msg == true) {
            var tools = document.getElementById("tools");
            tools.style.display = "none";
            var show_img_div = document.getElementById("show_img_div");
            show_img_div.style.display = "none";
            var show_text = document.getElementById("show_text");
            show_text.style.display = "none";
            var welcome_div = document.getElementById("welcome_div");
            welcome_div.innerHTML = "欢迎访问赛思文件管理系统";
            welcome_div.style.display = "block";
            var fileparentdiv = this.clickedFileNode.parentNode.parentNode.previousElementSibling;
            fileparentdiv.setAttribute("childrenSum", fileparentdiv.getAttribute("childrenSum") - 1);
            if (fileparentdiv.getAttribute("childrenSum") == 0) {
                fileparentdiv.firstElementChild.src = "";
                fileparentdiv.style.marginLeft = "16px";
            }
            this.clickedFileNode.parentNode.parentNode.removeChild(this.clickedFileNode.parentNode);
            alert("成功删除文件：" + delete_file);
            this.highlightNode(fileparentdiv);
            modifyAddressBarAddress(fileparentdiv);
        }
    },

    //高亮被点击的结点
    highlightNode: function (e) {
        document.getElementById("rootDirNode").style.background = "";
        var div = result.getElementsByTagName("div");
        for (var i = 0; i < div.length; i++)
            div[i].style.background = "";
        e.style.background = "#6699FF";
    },

    //建立地址栏上文件在树中的结点
    setAddressBarFileNode: function (data) {
        data = JSON.parse(data);
        var result = document.getElementById("result");
        for (var i = data.dirs.length - 1; i >= 0; i--) {
            var div = result.getElementsByTagName("div");
            for (var j = 0; j < div.length; j++) {
                if (div[j].getAttribute("title") == (data.dirs[i].replace(new RegExp("/", "g"), "\\"))) {
                    if ((i == 0 && div[j].getAttribute("state")) || i > 0) {
                        var ul = document.createElement("ul");
                        div[j].setAttribute("asked", "yes");
                        div[j].setAttribute("state", "on");
                        if (div[j].getAttribute("childrenSum") != 0)
                            div[j].firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
                        for (var k = 0; k < data.filess[i].length; k++) {
                            if (data.filess[i][k].directory === true) {
                                ul.appendChild(this.setNode(data.filess[i][k]));
                            }
                        }
                        for (var k = 0; k < data.filess[i].length; k++) {
                            if (data.filess[i][k].directory === false) {
                                ul.appendChild(this.setNode(data.filess[i][k]));
                            }
                        }
                        div[j].parentNode.appendChild(ul);
                    } else if (i == 0) {
                        this.clickedFileNode = div[j];
                        this.clickedFolderNode = div[j].parentNode.parentNode.previousElementSibling;
                        this.file.openFile(this.clickedFileNode.title);
                        showFileContent(this.clickedFileNode);
                        this.highlightNode(this.clickedFileNode);
                    }
                    if (div[j].getAttribute("state")) {
                        this.highlightNode(div[j]);
                        this.clickedFolderNode = div[j];
                    }
                    result = div[j].nextElementSibling;
                }
            }
        }
    }
}