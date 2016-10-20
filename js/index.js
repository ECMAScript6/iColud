
var app=angular.module("icloud",[]);

//这里是数据的、、、。。。，
app.controller("mainCtrl",['$scope',function ($scope){
    $scope.color=["cheng","lv","lan","huang","he","hong","shenhuang"];
    $scope.cards=[
        {id:1001,titie:"新列表1",theme:"cheng",todos:[{id:1,title:"买车",status:1},{id:2,title:"买房",status:0}]},
        {id:1002,titie:"新列表2",theme:"lv",todos:[{id:1,title:"买车",status:1},{id:2,title:"买房",status:0}]},
        {id:1003,titie:"新列表3",theme:"lan",todos:[{id:1,title:"买车",status:1},{id:2,title:"买房",status:0}]},
    ]
    $scope.add=function () {
        var max_id=-Infinity;
        //这个是无限最小数。
        $scope.cards.forEach(function (v,i) {
            if(v.id>max_id){
                max_id=v.id;
            }
        })
        var obj={
            id:max_id+1,
            titie:"新列表"+($scope.cards.length+1)+"",
            theme:$scope.color[$scope.cards.length%7],
            todos:[]    
        }
        $scope.cards.push(obj)
    };
    $scope.current=$scope.cards[0];
    $scope.setcurrent=function (v) {
        $scope.current=v;
    }
    $scope.index=0;
    $scope.current.todos.forEach(function (v,i) {
        if(v.status==1){
            $scope.index+=1;
        }
    })
    $scope.adds=function() {
        $scope.index-=1;
    }
    $scope.jianyi=function() {
                $scope.index+=1;
    }
    $scope.clear=function () {
        $scope.current.todos=$scope.current.todos.filter(function (v,i) {
            return v.status !==1
        })
        $scope.index=0;
    }
    $scope.delete=function (id) {
        $scope.current.todos=$scope.current.todos.filter(function (v,i) {
            return v.id !==id
        })
    }
    $scope.dianji=function () {
        $(".right-bottom-top .bianji").toggleClass("dianji")
    }
    $scope.qu=function () {
     $(".bianji").removeClass("dianji")
    }
    $scope.xiaoshi=function () {
        $(".box .right .right-bottom .yiwancheng ol .span1").toggleClass("active")
       $(".box .right .right-bottom .yiwancheng .content").slideToggle(200)
    }
     $(".right-bottom-bottom").on("mouseup",function () {
         $(".bianji").removeClass("dianji")
         $(".right-bottom-bottom").find("ul li").removeClass("active bianji");
     });
    $(".right-bottom-bottom").on("click","ul li",function (e) {
        $(".right-bottom-bottom").find("ul li").removeClass("active bianji");
        $(this).addClass("active");
    })
    $("body").on("keyup",function (e) {
       if(e.keyCode===13){
           var title=$(".jia input").val();
           if(title==""){
               $(".jia").removeClass("active bianji")
               return;
           }
           var id=-Infinity;
           $scope.current.todos.forEach(function (v,i) {
               if(v.id>id){
                   id=v.id;
               }
           })
           var mens={
               id:id+1,
               title:title,
               status:0
           }
           $scope.current.todos.push(mens);
           $(".jia").removeClass("active bianji")
       }
    })
    $(".right-bottom-bottom").on("dblclick","ul li",function () {
        var input=$(this).find("input")
        $(this).closest("li").addClass("bianji");
        input.val(input.val()).focus();
    })
}])

//这里是交互的；；；；
app.directive('cardList',[function () {
    return{
        restrict:"AE",
        template:"<ul class='left-inner'><div ng-transclude></div></ul>",
        replace:true,
        transclude:true,
        link:function (scope,el) {
            $(el).on("click","li",function () {
                $(".left-inner").find("li").removeClass("dianzhong bianji");
                $(this).addClass("dianzhong");
                if(scope.current.todos.length == 0){
                    scope.index=0;
                }else{
                    scope.index=0;
                    scope.current.todos.forEach(function (v,i) {
                        if(v.status==1){
                            scope.index+=1;
                        }
                    })
                }
                scope.$apply()
            });
            $(el).on("mousedown",function () {
                $(".bianji").removeClass("dianji")
                $(".left-inner").find("li").removeClass("dianzhong bianji");
            });
            $(el).on("dblclick","li",function () {
                $(this).addClass("bianji")
                $(this).find("input").val($(this).find("input").val()).focus();
            })
            $(el).on("blur","li input",function () {
                var obj=$(this).val();//内容
                var id=parseInt( $(this).closest("li").attr("data-id") ) ;
                var dui= scope.cards.find(function (v,i) {
                    return v.id==id;
                })
                dui.titie=obj;
                $(el).removeClass("bianji");
                 scope.$apply();
           //    加上这个才会重回页面，这个就是检测页面跟数组的不同，
           })
            $(document).on("keyup",function (e) {
                if(e.keyCode===46){
                    var id =parseInt($(".dianzhong").attr("data-id"));
                    scope.$apply(function () {
                        scope.cards=scope.cards.filter(function (v,i) {
                            return  v.id !==id;
                        })
                    })
                }
            })
        }
    }
}])

app.directive("bianJi",[function () {
    return{
        restrict:"AE",
        replace:true,
        template:"<div class='bianji'><div ng-transclude></div></div>",
        transclude:true,
        link:function (scope,el){
            $(el).find(".xia-box .delete").on("click",function (id) {
                var id= scope.current.id;
                scope.cards=scope.cards.filter(function (v,i) {
                    return  v.id !== id;
                })
                scope.current=scope.cards[0];
                scope.$apply();
            })
        }
    }
}])
app.directive("myXinceng",[function () {
    return{
        restrict:"AE",
        replace:true,
        template:"<div class=''><div ng-transclude></div></div>",
        transclude:true,
        link:function (scope,el) {
            $(el).find(".xinceng").on("click",function () {
                $(".jia").addClass("active bianji").find("input").focus();
            })
            $(el).find(".jia input").on("blur",function () {
                var obj=$(this).val();
                 $(this).val("")
                if(obj !== ""){
                    var id=-Infinity;
                    scope.current.todos.forEach(function (v,i) {
                        if(v.id>id){
                            id=v.id;
                        }
                    })
                    menu={
                        id:id+1,
                        title:obj,
                        status:0
                    }
                    scope.current.todos.push(menu)
                    scope.$apply();
                }
                $(".jia").removeClass("active bianji")
            })
        }
    }
}])