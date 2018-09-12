// The following converts img to data URIs and replace them.
// This does not work on file:// documents.
function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
        canvas.getContext('2d').drawImage(this, 0, 0);
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}
function get_styles(doc) {
    var css= [];

    for (var sheeti= 0; sheeti<doc.styleSheets.length; sheeti++) {
        var sheet= doc.styleSheets[sheeti];
        var rules= ('cssRules' in sheet)? sheet.cssRules : sheet.rules;
        for (var rulei= 0; rulei<rules.length; rulei++) {
            var rule= rules[rulei];
            if ('cssText' in rule)
                css.push(rule.cssText);
            else
                css.push(rule.selectorText+' {\n'+rule.style.cssText+'\n}\n');
        }
    }

    return css.join('\n');
}


document.body = document.createElement("body")
for (var i = 0; i<window.bData.spine.length; i++) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", window.bData.spine[i].path)
    document.body.appendChild(iframe)
}


function Convert() {
    var new_body = document.createElement("body");
    var styles;
    var iframes = document.getElementsByTagName("iframe");
    for (let i=0; i<iframes.length; i++) {
        styles = get_styles(iframes[i].contentDocument);
        let imgs = iframes[i].contentDocument.body.getElementsByTagName("img")
        for (let j=0; j<imgs.length; j++) {
            let img = imgs[j];
            getDataUri(img.src, function(dataUri) {
                img.src = dataUri;
            });
        }

        let sections = iframes[i].contentDocument.body.childNodes;
        while(sections.length > 0) {
            new_body.appendChild(sections[0]);
        }
    }
    document.body = new_body;
    document.head.innerHTML = "<style>" + styles + "</style>";
}
