var $ = global.jQuery;

module.exports = VideoSize;

function VideoSize(opts) {
  if (!(this instanceof VideoSize)) {
    return new VideoSize(opts);
  }

  if ( ! opts ) opts = {}

  var headerSelector = opts.headerSelector
  var videoModuleSelector = opts.videoModuleSelector
  var videoContainerSelector = opts.videoContainerSelector

  console.log(opts);


  var headerHeight;
  var videoModule;
  var videoBox;
  var windowHeight;
  var videoModuleHeight;

  setVideoSize();

  $(window).resize(function() {
    setVideoSize();
  });

  function setVideoSize() {
    headerHeight = $(headerSelector).outerHeight();
    videoModule = $(videoModuleSelector);
    videoBox = $(videoContainerSelector)
    windowHeight = $(window).height();
    videoModuleHeight = windowHeight - headerHeight;

    videoModule.css({
      height: videoModuleHeight,
      marginTop: -headerHeight
    })

    videoBox.css({
      height: videoModuleHeight,
      top: headerHeight
    });
  }

}
