var Settings = function () {
  return {
    init: function () {
      var a, r;
      ! function () {
        if (0 != $("#m_dashboard_daterangepicker").length) {
          var e = $("#m_dashboard_daterangepicker"),
            t = moment(),
            a = moment();
          e.daterangepicker({
            direction: mUtil.isRTL(),
            startDate: t,
            endDate: a,
            opens: "left",
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
            }
          }, r), r(t, a, "")
        }

        function r(t, a, r) {
          var o = "",
            n = "";
          a - t < 100 || "Today" == r ? (o = "Today:", n = t.format("MMM D")) : "Yesterday" == r ? (o = "Yesterday:", n = t.format("MMM D")) : n = t.format("MMM D") + " - " + a.format("MMM D"), e.find(".m-subheader__daterange-date").html(n), e.find(".m-subheader__daterange-title").html(o)
        }
      }()
    }
  }
}();
jQuery(document).ready(function () {
  Settings.init()
});
