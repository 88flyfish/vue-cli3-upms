export default {
    bind(el, binding, vnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');

        dialogHeaderEl.style.cssText += ';cursor:move;';
        dragDom.style.cssText += ';top:0px';

        //获取原生的属性，非行内样式
        const getStyle = (function() {
            //兼容IE
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr];
            } else {
                return (dom, attr) => getComputedStyle(dom, null)[attr];
            }
        })();

        dialogHeaderEl.onmousedown = (e) => {
            //计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;
            //计算拖拽dom的块大小
            // offsetWidth =  border  + 元素内容宽度 + padding
            //             =  border-left-width  + padding-left- width + width + padding-right-width + border-right-width
            // offsetHeight = border  + 元素内容高度 + padding
            //             = border-left-height+ padding-left- height+ height+ padding-height-width + border-right-height
            const dragDomWidth = dragDom.offsetWidth;
            const dragDomHeight = dragDom.offsetHeight;
            //计算屏幕可视区的宽度高度
            const screenWidth = document.body.clientWidth;
            const screenHeight = document.body.clientHeight;

            const minDragDomLeft = dragDom.offsetLeft;
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

            const minDragDomTop = dragDom.offsetTop;
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

            let styleLeft = getStyle(dragDom, 'left');
            let styleTop = getStyle(dragDom, 'right');

            if (styleLeft.includes('%')) {
                /* eslint-disable */
                styleLeft += document.body.clientWidth * (+styleLeft.replace(/\%/g, '') / 100);
                styleTop += document.body.clientHeight * (+styleTop.replace(/\%/g, '') / 100);
            } else {
                /* eslint-disable */
                styleLeft = +styleLeft.replace(/\px/g, '');
                styleTop = +styleTop.replace(/\px/g, '');
            }

            document.onmousemove = function(e) {
                let left = e.clientX - disX;
                let top = e.clientY - disY;
                if (-left > minDragDomLeft) {
                    left = -minDragDomLeft;
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft;
                }

                if (-top > minDragDomTop) {
                    top = -minDragDomTop;
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop;
                }

                //移动当前元素
                dragDom.style.cssText += `;left:${left + styleLeft}px;top:${top + styleTop}px`;
                console.log(vnode);
                vnode.child.$emit('dragDialog');
            };

            document.onmouseup = function() {
                document.onmouseup = null;
                document.onmousemove = null;
            };
        };
    }
};
