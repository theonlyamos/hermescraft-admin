var Customers = function () {
  return {
    init: function () {
      var a, r;
      0 !== $("#m_datatable_latest_orders").length && $(".m_datatable").mDatatable({
        data: {
          type: "remote",
          source: {
            read: {
                url: "/orders/latest"
            }
          },
          pageSize: 10,
          saveState: {
            cookie: !1,
            webstorage: !0
          },
          serverPaging: !0,
          serverFiltering: !0,
          serverSorting: !0
        },
        layout: {
          theme: "default",
          class: "",
          scroll: !0,
          height: 400,
          footer: !1
        },
        sortable: !0,
        filterable: !1,
        pagination: !0,
        columns: [{
          field: "RecordID",
          title: "#",
          sortable: !1,
          width: 40,
          selector: {
            class: "m-checkbox--solid m-checkbox--brand"
          },
          textAlign: "center"
        }, {
          field: "orderID",
          title: "Order ID",
          sortable: "asc",
          filterable: !1,
          width: 150,
        },
        {
          field: "items_count",
          title: "ItemsCount",
          sortable: "asc",
          filterable: !1,
          width: 150,
        }, {
          field: "total",
          title: "Total",
          sortable: "asc",
          filterable: !1,
          width: 150,
          responsive: {
            visible: "lg"
          }
        }, {
          field: "updatedAt",
          title: "Date"
        }, {
          field: "status",
          title: "Status",
          width: 100,
          template: function (e) {
            var t = {
              pending: {
                title: "Pending",
                class: "m-badge--brand"
              },
              cancelled: {
                title: "Canceled",
                class: " m-badge--primary"
              },
              complete: {
                title: "Success",
                class: " m-badge--success"
              }
            };
            return '<span class="m-badge ' + t[e.status].class + ' m-badge--wide">' + t[e.status].title + "</span>"
          }
        },
         {
          field: "Actions",
          width: 110,
          title: "Actions",
          sortable: !1,
          overflow: "visible",
          template: function (e, t, a) {
            return '<div class="dropdown ' + (a.getPageSize() - t <= 4 ? "dropup" : "") + '">                            <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">                                <i class="la la-ellipsis-h"></i>                            </a>                            <div class="dropdown-menu dropdown-menu-right">                                <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>                                <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>                                <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>                            </div>                        </div>                        <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">                            <i class="la la-edit"></i>                        </a>                        <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">                            <i class="la la-trash"></i>                        </a>                    '
          }
        }]
      })
    }
  }
}();
jQuery(document).ready(function () {
  Customers.init()
});
