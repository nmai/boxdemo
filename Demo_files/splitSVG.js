var splitSVG = (function ($) {
    "use strict";

    function splitSVG($svg, maxSplits) {
        $svg = $svg.clone();

        var $svglayer,
            $children = $svg.children(),
            childrenArr = $.makeArray($children),
            numSplits = 0,
            splits = [];

        // put it in the DOM so we can get the width/height of elements
        $('<div>').append($svg).appendTo(document.body).css({left: -10000, top: -10000 });

        // sort the child elements by descending area
        childrenArr.sort(function (a, b) {
            return getArea(b) - getArea(a);
        });

        // pick the first <maxSplits> children as "split" elements
        $(childrenArr.slice(0, Math.min(childrenArr.length - 1, maxSplits - 1))).attr('data-split-el', true);

        // organize elements into layers
        $children.each(function (i, el) {
            // ignore style and defs tags
            if (el.tagName == 'style') return;
            if (el.tagName == 'defs') return;
            var $el = $(el), cls = $el.attr('class');
            $el.attr('class', (cls || '') + ' layer-el-'+numSplits);
            if ($el.attr('data-split-el')) numSplits++;
        });

        for (var i = 0; i <= numSplits; ++i) {
            // clone the base svg
            $svglayer = $svg.clone();
            $svglayer.attr('data-split', i);
            // remove elements from other splits
            removeObjectsFromOtherSplits($svglayer, numSplits, i);
            // IE9 Hack
            fixStylesAndDefs($svglayer);
            splits.push($svglayer);
        }

        // remove it from DOM
        $svg.parent().remove().css({ left: '', top: '' });
        return $(splits);
    }

    function removeObjectsFromOtherSplits($svgRoot, numSplits, splitNum) {
        for (var i = 0; i < numSplits+1; ++i) {
            if (i === splitNum) continue;
            $('.layer-el-'+i, $svgRoot).each(removeEl);
        }
    }

    function removeEl(i, el) {
        el.parentNode.removeChild(el);
    }

    function getArea(el) {
        if (el) {
            var rect = el.getBoundingClientRect() || el.getBBox && el.getBBox();
            if (rect) return rect.width * rect.height;
        }
        return 0;
    }

    // force svg <style> and <def> to work when cloning svg docs (IE 9)
    // requires https://code.google.com/p/innersvg/
    function fixStylesAndDefs($svg) {
        $('style, def', $svg).each(function (i, s) {
            s.innerHTML = s.innerHTML + ' ';
        });
    }

    return splitSVG;
})(jQuery);
