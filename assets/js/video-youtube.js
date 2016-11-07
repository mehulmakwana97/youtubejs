(function($) {
  var players = new Array();
  $.extend($.base, {
    video : {
      init: function() {
        var script = document.createElement("script");
        script.src = "//www.youtube.com/player_api";
        var element = document.getElementsByTagName("script")[0];
        element.parentNode.insertBefore(script, element);

        window.onYouTubeIframeAPIReady = function() {
          var $frames = $.base.video.frames();
          $.base.video.enableYoutubeAPI({ frames: $frames });
        }
      },
      frames: function() {
        var $frames = $('.full-video .video-frame[data-video="youtube"]');
        $frames.length > 0 && $.base.video.player({ frames: $frames });
        return $frames;
      },
      player: function(params) {
        params.frames.each(function(key, frame) {
          players.push(new YT.Player($(frame).attr('id'), {
            width: '560',
            height: '315',
            videoId: $(frame).data('video-id'),
            events: {
              'onReady': $.base.video.onPlayerReady
            }
          }));
        });
      },
      onPlayerReady: function(event) {
        $.each(players, function(key, player) {
          var _video_data = player.getVideoData();
          var _video_id = _video_data['video_id'];

          $(".full-video-modal.modal").on("hidden.bs.modal", function() {
            player.pauseVideo();
          });

          $(document).on('click', '#video-play-'+ _video_id, function(e) {
            e.preventDefault();
            player.playVideo();
          });

          $(document).on('click', '#video-pause-'+ _video_id, function(e) {
            e.preventDefault();
            player.pauseVideo();
          });
        });
      },
      parseUrl: function(params) {
        return /\?/.test(params.uri) ? "&" : "?"
      },
      addParams: function(params) {
        var originalSrc = params.element.attr("src");
        element.attr("src", originalSrc + $.base.video.parseUrl(originalSrc) + params.attr);
      },
      enableYoutubeAPI: function(params) {
        params.frames.each(function(key, frame) {
          $(frame).find('iframe[src*="youtube.com/embed/"]').each(function() {
              $.base.video.addParams({
                element: $(this),
                attr: "enablejsapi=1"
              });
          });
        });
      }
    }
  })
})(jQuery);