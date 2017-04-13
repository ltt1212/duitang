/**
 * Created by liutingting_sx on 2017/4/12.
 */
var itemWidth = 220;
var limits = 50;
var heightArr = initArray(); //初始化一个各列的高度为0
var tId;


queryData().then(addItem);

var flag = 0;
$(window).scroll(function () {
    console.log('window scroll');
    throttle(function(){

        if(checkScroll()){ //判断滚动时是否符合加载条件
            queryData().then(addItem);
            console.log("scroll");
        }
    }, 100);

});
$(window).resize(function () {
    throttle(function () {
        console.log("resize");
        winResize();
    }, 100);
});


function queryData() {
    var opt = {
        include_fields: "top_comments,is_root,source_link,item,buyable,root_id,status,like_count,sender,album",
        limit: limits,  //一次获取的item数
        start: limits * flag, //下次获取的开始item
        h: 1491382220082
    };
    var url = "https://www.duitang.com/napi/index/hot/?include_fields=" + opt.include_fields
        +"&limit="+ opt.limit
        +"&start="+ opt.start
        +"&_="+ opt.h;
    var Deferred = $.Deferred();
    $.ajax({
        url: url,
        type: "get",
        // success: function(data){
        //     var itemData = data.data.object_list;
        //     // callback(itemData, limits * flag);
        //     flag ++;
        //     Deferred.resolve(itemData);
        //
        // }
    }).done(function (data) {
        var itemData = data.data.object_list;
        flag++;
        Deferred.resolve(itemData);
    });
    return Deferred.promise();
}

// 请求成功后的回调函数 用来添加item
function addItem(itemData) {
    console.log(itemData);
    for (var i = 0; i < itemData.length; i++) {

        var min = findMin(heightArr); //获取当前高度最低的列
        var imgSrc = itemData[i].photo.path;
        var itemTitle = itemData[i].msg;
        var picHeight = itemData[i].photo.height * 200 / itemData[i].photo.width; //item中图片的高度

        var $itemContent = $("<div class='item-content' id='item-content' style='top:"
            + (heightArr[min] + 10) +"px ;left:" + (min*210 + 10)
            +"px ;'><img class='lazy' style='height:"
            +  picHeight +"px' data-original='" + imgSrc +"' ><span>" + itemTitle + "</span></div>");

        $("#page").append($itemContent);
        $itemContent.find("img").lazyload({threshold :200, effect: "fadeIn"})
        heightArr[min] +=  $itemContent.height() + 10;
    }

}

// 初始化 一个个数等于列数的全是0的数组
function initArray() {
    var contentWidth = $(window).width();
    var cols = Math.floor(contentWidth/itemWidth); //列数
    var result = new Array(cols);
    for(let j = 0; j < cols; j++){
        result[j] = 0;
    }
    return result;
}

//获取数组中值最小的index
function findMin(arr) {
    return arr.indexOf(Math.min.apply(Math, arr));
}

//检查是否具备滚动时加载的条件
function  checkScroll() {
    var clientH = $(window).height();
    var currentTop =  heightArr[findMin(heightArr)];   //
    var currentH = $(document).scrollTop() ;
    if (currentTop - clientH - currentH <  50 ){
        return true;
    }
    return false;
}

//函数节流
function throttle(method, delay){
    clearTimeout(tId);
    tId=setTimeout(function(){
        method();
    }, delay);
}

//窗口大小改变重
function winResize() {
    var heightArr = initArray();
    var items = $(".item-content");
    for(var i = 0; i<items.length; i++){
        var min = findMin(heightArr); //获取当前高度最低的列
        items.eq(i).css({
            top: heightArr[min] + 10 + "px",
            left: min*210 + 10 +"px"
        });
        heightArr[min] +=   items.eq(i).height() + 10;
    }
}
