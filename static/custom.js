
var get_state = function() {
    if (Cookies.get("state")) {
        return JSON.parse(Cookies.get("state"));
    }
    return {};
};

var save_state = function(state) {
    Cookies.set("state", JSON.stringify(state));
}

var trim_cookie = function(state) {
    var min_date = Date.now();
    var min_date_key = "";
    for(var key in state) {
        var value = state[key];
        if (!$.isArray(value) || value.length != 2) {
            delete state[key];
        } else if(min_date > value[1]) {
            min_date = value[1];
            min_date_key = key;
        }
    }

    if (Object.keys(state).length > 30) {
        delete state[min_date_key];
    }
};

var sync_cookie = function() {
    var state = get_state();
    trim_cookie(state);

    let player = mejs.players.mep_0;
    let current_src = player.media.currentSrc;
    let current_time = mejs.players.mep_0.media.currentTime;
    if (current_src != null) {
        state[current_src] = [current_time, Date.now()];
        save_state(state);
    };

    if (current_src && current_src.endsWith("mp3")) {
        let image = current_src.substring(0, current_src.length-3) + "jpg";
        if (player.media.poster != image) {
            player.setPoster(image);
        }
    }
};

$(function() {
    $.each($("a"), function () {
        if (this.href.endsWith("webm") ||
            this.href.endsWith("mkv") ||
            this.href.endsWith("mp3") ||
            this.href.endsWith("mp4") ||
            this.href.endsWith("m4v")) {
            let src = $("<source>")
                .attr("src", this.href)
                .attr("title", this.innerText)
                .attr("type", "video/webm");
            $("#player3").append(src);
        }
    });

    $('video.mep-playlist').mediaelementplayer({
        "features": ['playlistfeature',
                     'prevtrack',
                     'playpause',
                     'nexttrack',
                     'loop',
                     'shuffle',
                     'current',
                     'progress',
                     'duration',
                     'volume',
                     'playlist',
                     'fullscreen'],
        "shuffle": false,
        "loop": true,
        "continuous": true
    });

    $("li span").css("height", "100%");


    $("a").on("click", function() {
        let url = this.href;

        if (url.endsWith(".mp3") ||
            url.endsWith(".m4a") ||
            url.endsWith(".mp4") ||
            url.endsWith(".m4v") ||
            url.endsWith(".webm") ||
            url.endsWith(".mkv")) {
            var player = mejs.players.mep_0;

            if (player && (player.media.currentTime == 0 ||
                           player.media.currentSrc != url)) {

                player.media.src = url;

                let cookie = get_state()[url];
                if (cookie != null) {
                    player.media.currentTime = cookie[0];
                }

                player.options.defaultSeekBackwardInterval = (media) => 60;
                player.options.defaultSeekForwardInterval = (media) => 60;
            }
            $("#videoModal").modal();
            $("#videoModalLabel").text($(this).text());
            $("#thumbnail").attr("src", this.href.substring(
                0, this.href.length-3) + "jpg");

            player.play();
            sync_cookie();

            return false;

        };

        return null;
    });

    $("title").text("Directory " + window.location.pathname);
    $("#title").text("Directory " + window.location.pathname);

    // Sync the current time for each src into the cookie.
    var intervalID = setInterval(function() {
        sync_cookie();
    }, 10000);

    $.each($("a"), function() {
        if (this.href.endsWith("mp3") ||
            this.href.endsWith("m4a")) {
            let a = $(this);
            let thumb = $("<div class='thumb_container'>").append(
                $("<img>")
                    .attr("src", this.href.substring(
                        0, this.href.length-3) + "jpg")
                    .attr("onerror", "this.src='/static/music.jpg'")
                    .addClass("mp3_thumbnail")
                    .on("click", function() {
                        a.click();
                    }));

            $(this).prev("img").replaceWith(thumb);
        };
    });
});
