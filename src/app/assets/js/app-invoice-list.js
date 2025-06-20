/**
 * App Invoice List (jquery)
 */

'use strict';

$(function () {
  // Variable declaration for table
  var dt_invoice_table = $('.invoice-list-table');

  // Invoice datatable
  if (dt_invoice_table.length) {
    var dt_invoice = dt_invoice_table.DataTable({
      ajax: assetsPath + 'json/invoice-list.json', // JSON file to add data
      columns: [
        // columns according to JSON
        { data: 'invoice_id' },
        { data: 'invoice_id' },
        { data: 'invoice_id' },
        { data: 'invoice_status' },
        { data: 'issued_date' },
        { data: 'client_name' },
        { data: 'total' },
        { data: 'balance' },
        { data: 'invoice_status' },
        { data: 'action' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          responsivePriority: 2,
          searchable: false,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },

        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          checkboxes: {
            selectAllRender: '<input type="checkbox" className="form-check-input">'
          },
          render: function () {
            return '<input type="checkbox" className="dt-checkboxes form-check-input">';
          },
          searchable: false
        },
        {
          // Invoice ID
          targets: 2,
          render: function (data, type, full, meta) {
            var $invoice_id = full['invoice_id'];
            // Creates full output for row
            var $row_output = '<a href="app-invoice-preview.html"><span>#' + $invoice_id + '</span></a>';
            return $row_output;
          }
        },
        {
          // Invoice status
          targets: 3,
          render: function (data, type, full, meta) {
            var $invoice_status = full['invoice_status'],
              $due_date = full['due_date'],
              $balance = full['balance'];
            var roleBadgeObj = {
              Sent: '<span className="avatar avatar-sm"> <span className="avatar-initial rounded-circle bg-label-secondary"><i className="ri-save-line ri-16px"></i></span></span>',
              Draft:
                '<span className="avatar avatar-sm"> <span className="avatar-initial rounded-circle bg-label-primary"><i className="ri-mail-line ri-16px"></i></span></span>',
              'Past Due':
                '<span className="avatar avatar-sm"> <span className="avatar-initial rounded-circle bg-label-danger"><i className="ri-error-warning-line ri-16px"></i></span></span>',
              'Partial Payment':
                '<span className="avatar avatar-sm"> <span className="avatar-initial rounded-circle bg-label-success"><i className="ri-check-line ri-16px"></i></span></span>',
              Paid: '<span className="avatar avatar-sm"> <span className="avatar-initial rounded-circle bg-label-warning"><i className="ri-line-chart-line ri-16px"></i></span></span>',
              Downloaded:
                '<span className="avatar avatar-sm"> <span className="avatar-initial rounded-circle bg-label-info"><i className="ri-arrow-down-line ri-16px"></i></span></span>'
            };
            return (
              "<div className='d-inline-flex' data-bs-toggle='tooltip' data-bs-html='true' title='<span>" +
              $invoice_status +
              '<br> <span className="fw-medium">Balance:</span> ' +
              $balance +
              '<br> <span className="fw-medium">Due Date:</span> ' +
              $due_date +
              "</span>'>" +
              roleBadgeObj[$invoice_status] +
              '</div>'
            );
          }
        },
        {
          // Client name and Service
          targets: 4,
          responsivePriority: 4,
          render: function (data, type, full, meta) {
            var $name = full['client_name'],
              $service = full['service'],
              $image = full['avatar_image'],
              $rand_num = Math.floor(Math.random() * 11) + 1,
              $user_img = $rand_num + '.png';
            if ($image === true) {
              // For Avatar image
              var $output =
                '<img src="' + assetsPath + 'img/avatars/' + $user_img + '" alt="Avatar" className="rounded-circle">';
            } else {
              // For Avatar badge
              var stateNum = Math.floor(Math.random() * 6),
                states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'],
                $state = states[stateNum],
                $name = full['client_name'],
                $initials = $name.match(/\b\w/g) || [];
              $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
              $output = '<span className="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
            }
            // Creates full output for row
            var $row_output =
              '<div className="d-flex justify-content-start align-items-center">' +
              '<div className="avatar-wrapper">' +
              '<div className="avatar avatar-sm me-3">' +
              $output +
              '</div>' +
              '</div>' +
              '<div className="d-flex flex-column">' +
              '<a href="pages-profile-user.html" className="text-truncate text-heading"><p className="mb-0 fw-medium">' +
              $name +
              '</p></a>' +
              '<small className="text-truncate">' +
              $service +
              '</small>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          // Total Invoice Amount
          targets: 5,
          render: function (data, type, full, meta) {
            var $total = full['total'];
            return '<span>$' + $total + '</span>';
          }
        },
        {
          // Due Date
          targets: 6,
          render: function (data, type, full, meta) {
            var $due_date = new Date(full['due_date']);
            // Creates full output for row
            var $row_output =
              '<span className="d-none">' +
              moment($due_date).format('YYYYMMDD') +
              '</span>' +
              moment($due_date).format('DD MMM YYYY');
            $due_date;
            return $row_output;
          }
        },
        {
          // Client Balance/Status
          targets: 7,
          orderable: false,
          render: function (data, type, full, meta) {
            var $balance = full['balance'];
            if ($balance === 0) {
              var $badge_class = 'bg-label-success';
              return '<span className="badge rounded-pill ' + $badge_class + '" text-capitalized> Paid </span>';
            } else {
              return '<span className="text-heading">' + $balance + '</span>';
            }
          }
        },
        {
          targets: 8,
          visible: false
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div className="d-flex align-items-center">' +
              '<a href="javascript:;" data-bs-toggle="tooltip" className="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record" data-bs-placement="top" title="Delete Invoice"><i className="ri-delete-bin-7-line ri-20px"></i></a>' +
              '<a href="app-invoice-preview.html" data-bs-toggle="tooltip" className="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill"  data-bs-placement="top" title="Preview Invoice"><i className="ri-eye-line ri-20px"></i></a>' +
              '<div className="dropdown">' +
              '<a href="javascript:;" className="btn btn-icon btn-sm btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown"><i className="ri-more-2-line ri-20px"></i></a>' +
              '<div className="dropdown-menu dropdown-menu-end">' +
              '<a href="javascript:;" className="dropdown-item">Download</a>' +
              '<a href="app-invoice-edit.html" className="dropdown-item">Edit</a>' +
              '<a href="javascript:;" class="dropdown-item">Duplicate</a>' +
              '</div>' +
              '</div>' +
              '</div>'
            );
          }
        }
      ],
      order: [[2, 'desc']],
      dom:
        '<"row mx-1"' +
        '<"col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-4 mt-md-0 mt-5"l<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start"B>>' +
        '<"col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-4"f<"invoice_status mb-5 mb-md-0">>' +
        '>t' +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: 'Show _MENU_',
        search: '',
        searchPlaceholder: 'Search Invoice'
      },
      // Buttons with Dropdown
      buttons: [
        {
          text: '<i class="ri-add-line ri-16px me-md-2 align-baseline"></i><span class="d-md-inline-block d-none">Create Invoice</span>',
          className: 'btn btn-primary waves-effect waves-light',
          action: function (e, dt, button, config) {
            window.location = 'app-invoice-add.html';
          }
        }
      ],
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['full_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      },
      initComplete: function () {
        // Adding role filter once table initialized
        this.api()
          .columns(8)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="UserRole" class="form-select"><option value=""> Select Status </option></select>'
            )
              .appendTo('.invoice_status')
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? '^' + val + '$' : '', true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
              });
          });
      }
    });
  }

  // On each datatable draw, initialize tooltip
  dt_invoice_table.on('draw.dt', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: document.body
      });
    });
  });

  // Delete Record
  $('.invoice-list-table tbody').on('click', '.delete-record', function () {
    // To hide tooltip on clicking delete icon
    $(this).closest($('[data-bs-toggle="tooltip"]').tooltip('hide'));
    // To delete the whole row
    dt_invoice.row($(this).parents('tr')).remove().draw();
  });

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.invoice_status .form-select').addClass('form-select-sm');
  }, 300);
});
