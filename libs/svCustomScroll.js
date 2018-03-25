
function svCustomScroll( options ) {
    let defaultOptions = {
        scrollWidth: 50,
        trackColor: '#c6dde8',
        barColor: '#8fb7c7',
        mouthWheelDelta: 50,
        borderRadius: 10,
    };
    let $content = $('body');
    let userOptions = options;
    let contentHeight = 0;
    let viewHeight = 0;
    let barHeight = 0;
    let barHeightKoeff = 0;
    let $track = $('<div class="custom-scroll__track"></div>');
    let $bar = $('<div class="custom-scroll__bar"></div>');
    let barPosition = 0;
    let minMargin = 0;

    function init() {
        applySettings(options);
        createStructure();
        adjustScroll();
        eventHandlers();
    }
    function applySettings(options) {
        if (options !== undefined && typeof options === 'object') {
            let optionsKey = Object.keys(options);
            for (let i = 0; i < optionsKey.length; i++) {
                for (let key in defaultOptions) {
                    if (key === optionsKey[i]) defaultOptions[key] = options[optionsKey[i]];
                }
            }
        }
    }
    function adjustScroll() {
        contentHeight = $content.height();
        viewHeight  = $(window).height();
        barHeightKoeff = (viewHeight/contentHeight);
        barHeight = viewHeight*barHeightKoeff;
        minMargin = -(contentHeight - viewHeight);
        $content.css({
            'overflow':'hidden',
            'padding-right': defaultOptions.scrollWidth + 'px'
        });

        $track.css({
            'width': defaultOptions.scrollWidth + 'px',
            'background': defaultOptions.trackColor,
        });
        $bar.css({
            'width': defaultOptions.scrollWidth + 'px',
            'background': defaultOptions.barColor,
            'height': barHeight + 'px',
            'border-radius': defaultOptions.borderRadius + 'px'
        });
    }

    function createStructure() {
        $track.append($bar);
        $content.append($track);
    }

    function scrollDragable() {
        $bar.draggable({
            containment: 'window',
            axis: 'y',
            drag: function () {
                barPosition = $bar.position().top;
                moveContent(barPosition/barHeightKoeff, 0);
            }
        });
    }

    function eventHandlers() {
        $(window).resize(function () {
            adjustScroll();
        });
        $track.click(function (e) {
            console.log(e);
            if(e.clientY < $bar.position().top){
                moveContent(defaultOptions.mouthWheelDelta*6, 1);
            } else if (e.clientY > ($bar.position().top + barHeight)) {
                moveContent(defaultOptions.mouthWheelDelta*6, -1);
            }
        });
        scrollDragable();
        $(window).on('mousewheel DOMMouseScroll', function(e){
            if(typeof e.originalEvent.detail == 'number' && e.originalEvent.detail !== 0) {
                if(e.originalEvent.detail > 0) {
                    moveContent(defaultOptions.mouthWheelDelta, -1);
                } else if(e.originalEvent.detail < 0){
                    moveContent(defaultOptions.mouthWheelDelta, 1);
                }
            } else if (typeof e.originalEvent.wheelDelta == 'number') {
                if(e.originalEvent.wheelDelta < 0) {
                    moveContent(defaultOptions.mouthWheelDelta, -1);
                } else if(e.originalEvent.wheelDelta > 0) {
                    moveContent(defaultOptions.mouthWheelDelta, 1);
                }
            }
        });
    }

    function moveContent(delta, direction) {
        if (direction == 0){
            $content.css({
                'margin-top': '-'+delta+'px'
            });
        } else {
            let currentMargin = parseInt($content.css('margin-top'));
            let resultMargin = currentMargin+delta*direction;

            if(resultMargin <= 0 && resultMargin > minMargin){
                $content.css('margin-top',resultMargin +'px');
                $bar.css('top',-(resultMargin*barHeightKoeff)+'px');
            } else if(resultMargin >= 0) {
                $content.css('margin-top',0 +'px');
                $bar.css('top', 0);
            } else if(resultMargin <= minMargin){
                $content.css('margin-top', minMargin +'px');
                $bar.css('top',-(minMargin*barHeightKoeff)+'px');
            }

        }
    }

    init();
}