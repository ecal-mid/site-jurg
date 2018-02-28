(function ($, root, undefined) {
  $(function () {
    //
    $(".container").each(function() {
      //var info = $(this).children("iframe").attr('info');
      //$(this).children("iframe").attr("src", info);
      $(this).children("iframe").attr("src", "assets/empty.html");
    });
    //
    function loadLine(_this) {
      //alert(_this);
      $(".container").each(function() {
        //  alert("ss");
        $(this).children(".locked").show();
        $(this).children("iframe").attr("src", "assets/empty.html");
      });
      _this.hide();
      var info = _this.parent().children("iframe").attr('info');
      console.log(info);
      _this.parent().children("iframe").attr("src", info);
    }
    //
    $(".locked").click(function(){
      loadLine($(this));

    });
    //
    function scroll() {
      var scrollTop = $(window).scrollTop();
      $(".container").each(function() {
        var posTop = $(this).offset().top;
        var diff = Math.abs(posTop-scrollTop);
        if(diff<200) {
          //window.location = "#tamara";
          var id = $(this).parent().attr("id");
          var stateObj = { name: id };
          history.replaceState(stateObj, id, "#"+id);
          if($(this).children(".locked").is(":visible")) {
            loadLine($(this).children(".locked"));
          }
        }
      });
    }
    scroll();
    $( window ).scroll(function() {
      scroll();
    });
    $( window ).resize(function() {
      changeSize();
    });
    function changeSize() {
      $(".container").each(function() {
        //var containerW = $(".container").width();
        var containerW = $(this).width();
        var iframeW = $(this).children("iframe").width();
        //console.log("cW: "+containerW);
        //var iframeW = $("iframe").width();
        var s = containerW/iframeW;

        $(this).children("iframe").css({transform: ' scale('+s+')'});
        //$("iframe").css({transform: ' scale('+s+')'});
      });
    }
    changeSize();
    //
  });
})(jQuery, this);
