var AddressBar = function () {};
AddressBar.modifyAddress = function () {//根据点击树的结点来改变地址栏url的显示

}

AddressBar.findAddressNode=function() {//根据输入到地址的url来展开树
    var uri = decodeURI(window.location.href);
    var n = uri.indexOf("/");
    for (var i = 0; i < num; i++) {
        n = str.indexOf(cha, n + 1);
    }
    var regExp = new RegExp("/", "g");
    uri = uri.substring(n).replace(regExp, "\\").substring(1);
    var uris = new Array();
    uris[0] = ".";
    var i, c;
    for (i = 1; c = uri.indexOf("\\"), c != -1; i++) {
        uris[i] = uris[i - 1] + "\\" + uri.substring(0, c);
        uri = uri.substring(c + 1);
    }
    uris[i] = uris[i - 1] + "\\" + uri;
    var result = document.getElementById("result"),
        n = 1
    div;
    div = result.getElementsByTagName("div");
    for (i = 0; i < div.length; i++) {
        if (div[i].getAttribute("title") === uris[1]) {
            if (div[i].getAttribute("onclick") != "File.fileOpen(this);") {
                Tree.opendir(div[i], uris, n + 1);
                break;
            } else {
                File.fileOpen(div[i]);
            }
        }
    }
}