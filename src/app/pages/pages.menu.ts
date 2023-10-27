//companyType:0 for regular,1 for pharma,
//menuType:0 for all,
// 1 for central,
// 2 for superdistributer,
//3 for distributor,
// 4 for retailer,
// 5 for fitindia,
// 6=superstockist
// 7=wdb,
// 8 for ak,
// 9=ck
// 10=pms
// 15=isHeadoffice
// 16=Stand Alone Outlets
// 17=Outlet Permission
// 25=IsEnableHCategory from Setting Table

export const PAGES_MENU = [
  {
    companyType: [0],
    path: "pages",
    menuType: [0],
    children: [
      {
        companyType: [0],
        path: "",
        menuType: [0],
        data: {
          menu: {
            title: "IMSPOS",
            icon: "ion-android-home",
            selected: true,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            companyType: [0],
            path: "dashboard",
            menuType: [0],
            data: {
              menu: {
                title: "Dashboard",
                icon: "ion-navicon-round",
                selected: true,
                expanded: false,
                order: 0
              }
            }
          }
          // {
          // companyType:[0],
          // path: "terminal",
          //   menuType: [],
          //   data: {
          //     menu: {
          //       title: "Terminal Setup",
          //       icon: "ion-gear-b",
          //       selected: false,
          //       expanded: false,
          //       order: 700
          //     }
          //   }
          // },
          // {
          // companyType:[0],
          //            path: "backup-restore",
          //   menuType: [],
          //   isOnlyCentral: true,
          //   data: {
          //     menu: {
          //       title: "Backup & Restore",
          //       icon: "ion-android-upload",
          //       selected: false,
          //       expanded: false,
          //       order: 0
          //     }
          //   }
          // }
        ]
      },
      {
        companyType: [0],
        path: "masters",
        menuType: [0],
        data: {
          menu: {
            title: "Masters",
            icon: "ion-edit",
            selected: false,
            expanded: false,
            order: 2
          }
        },
        children: [
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Settings",
                icon: "ion-gear-b",
                selected: false,
                expanded: false
              }
            },
            children: [
              // {
              // companyType:[0],//
              // path: "ruchisoyaconfiguration",
              //   menuType: [0],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Ruchi Soya Configuration"
              //     }
              //   }
              // },
              // {
              // companyType:[0],//
              // path: "deliveryordertransfer",
              //   menuType: [1],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Delivery Order Transfer"
              //     }
              //   }
              // },
              // {
              // companyType:[0],//
              // path: "batchpricinglist",
              //   menuType: [],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Batch Pricing"
              //     }
              //   }
              // },
              {
                companyType: [0],

                menuType: [],
                data: {
                  menu: {
                    title: "Brand",
                    selected: false,
                    expanded: false
                  }
                },
                children: [
                  // {
                  //   path: "brandtype",
                  //   data: {
                  //     menu: {
                  //       title: "Brand Type",
                  //       selected: false,
                  //       expanded: false
                  //     }
                  //   }
                  // },
                  {
                    companyType: [0],
                    path: "brand",
                    menuType: [],
                    isOnlyCentral: true,
                    data: {
                      menu: {
                        title: "Brand",
                        selected: false,
                        expanded: false
                      }
                    }
                  },
                ]
              },

              {
                companyType: [0],
                path: "BranchList",
                menuType: [],
                isOnlyCentral: true,
                data: {
                  menu: {
                    title: "Company"
                  }
                }
              },
              // {
              // companyType:[0],//
              // path: "cost-center",
              //   menuType: [],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "CostCenter"
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "category",
                menuType: [],
                isOnlyCentral: true,
                data: {
                  menu: {
                    title: "Category"
                  }
                }
              },
              {
                companyType: [0],
                path: "scheme-view",
                menuType: [0],
                isOnlyCentral: false,
                data: {
                  menu: {
                    title: "Scheme View"
                  }
                }
              },

              // {
              //   path: "customer-info",
              //   data: {
              //     menu: {
              //       title: "Customer Info"
              //     }
              //   }
              // },
              // {
              // companyType:[0],//
              // path: "channel",
              //   menuType: [],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Channel"
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "divisionList",
                menuType: [0],
                isOnlyCentral: true,
                data: {
                  menu: {
                    title: "Division"
                  }
                }
              },
              // {
              //   companyType: [0],
              //   path: "deliveryBoyList",
              //   menuType: [0],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "DeliveryBoy Master"
              //     }
              //   }
              // },
              //companyType:[0], {

              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Organisation",
              //       selected: false,
              //       expanded: false
              //     }
              //   },
              //   children: [
              //     {
              // companyType:[0],//
              // path: "organizationhierarchy",
              //       menuType: [],
              //       isOnlyCentral: true,
              //       data: {
              //         menu: {
              //           title: "Organization Hierarchy",
              //           selected: false,
              //           expanded: false
              //         }
              //       }
              //     },
              //     {
              // companyType:[0],//
              // path: "organizationtype",
              //       menuType: [],
              //       isOnlyCentral: true,
              //       data: {
              //         menu: {
              //           title: "Organization Type",
              //           selected: false,
              //           expanded: false
              //         }
              //       }
              //     }
              //   ]
              // },
              // {
              // companyType:[0],//
              // path: "productHierarchy",
              //   menuType: [],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Product Hierarchy"
              //     }
              //   }
              // },

              // {
              // companyType:[0],//
              // path: "routemaster",
              //   menuType: [1],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Router Master"
              //     }
              //   }
              // },
              {
                companyType: [0],

                menuType: [0],
                data: {
                  menu: {
                    title: "sales",
                    selected: false,
                    expanded: false
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: "salesarealist",
                    menuType: [1],
                    isOnlyCentral: true,
                    data: {
                      menu: {
                        title: "Sales Areas",
                        selected: false,
                        expanded: false
                      }
                    }
                  },
                  // {
                  // companyType:[0],//
                  // path: "sales-man-type",
                  //   menuType: [1],
                  //   isOnlyCentral: true,
                  //   data: {
                  //     menu: {
                  //       title: "Salesman Type",
                  //       selected: false,
                  //       expanded: false
                  //     }
                  //   }
                  // },
                  {
                    companyType: [0],
                    path: "salesman",
                    menuType: [0],
                    isOnlyCentral: true,
                    data: {
                      menu: {
                        title: "Sales Man",
                        selected: false,
                        expanded: false
                      }
                    }
                  },
                  // {
                  // companyType:[0],//
                  // path: "sales-terminal",
                  //   menuType: [1],
                  //   isOnlyCentral: true,
                  //   data: {
                  //     menu: {
                  //       title: "Sales Terminal",
                  //       selected: false,
                  //       expanded: false
                  //     }
                  //   }
                  // },
                  {
                    companyType: [0],
                    path: "salesHierarchy",
                    menuType: [1],
                    isOnlyCentral: true,
                    data: {
                      menu: {
                        title: "Sales Hierarchy",
                        selected: false,
                        expanded: false
                      }
                    }
                  },
                  // {
                  // companyType:[0],//
                  // path: "geograhphicalHeirarchy",
                  //   menuType: [1],
                  //   isOnlyCentral: true,
                  //   data: {
                  //     menu: {
                  //       title: "Sales Officer Master",
                  //       selected: false,
                  //       expanded: false
                  //     }
                  //   }
                  // },

                  // {
                  // companyType:[0],//
                  // path: "salesareatype",
                  //   menuType: [1],
                  //   isOnlyCentral: true,
                  //   data: {
                  //     menu: {
                  //       title: "Sales Area Type",
                  //       selected: false,
                  //       expanded: false
                  //     }
                  //   }
                  // },

                  // {
                  // companyType:[0],//
                  // path: "salesorganization",
                  //   menuType: [1],
                  //   isOnlyCentral: true,
                  //   data: {
                  //     menu: {
                  //       title: "Sales Organization",
                  //       selected: false,
                  //       expanded: false
                  //     }
                  //   }
                  // },
                ]
              },
              // {
              // companyType:[0],//
              // path: "statelist",
              //   menuType: [1],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "State List"
              //     }
              //   }
              // },
              // {
              //   path: "SchemeMasterTable",
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Scheme"
              //     }
              //   }
              // },


              // {
              // companyType:[0],//
              // path: "TaxGroupTable",
              //   menuType: [],
              //   isOnlyCentral: true,
              //   data: {
              //     menu: {
              //       title: "Tax Group"
              //     }
              //   }
              // }
            ]
          },
          {
            companyType: [0],
            path: "PartyLedger",
            menuType: [0],
            data: {
              menu: {
                title: "Customer",
                icon: "nb-compose"
              }
            },
            children: [
              {
                companyType: [0],
                path: "CustomerList",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customer"
                  }
                }
              },
              {
                companyType: [0],
                path: "customercategoryList",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customer Category"
                  }
                }
              }
            ]
          },

          {
            companyType: [0],
            path: "PartyLedger",
            menuType: [0],
            data: {
              menu: {
                title: "Supplier",
                icon: "nb-compose"
              }
            },
            children: [
              {
                companyType: [0],
                path: "SupplierList",
                menuType: [0],
                data: {
                  menu: {
                    title: "Supplier"
                  }
                }
              },
              {
                companyType: [0],
                path: "suppliervsitem",
                menuType: [0],
                data: {
                  menu: {
                    title: "Item Vs Supplier"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "employee-master",
            menuType: [0],
            data: {
              menu: {
                title: "Employee Master",
                icon: "nb-compose"
              }
            },
            children: [
              {
                companyType: [0],
                path: "list",
                menuType: [0],
                data: {
                  menu: {
                    title: "Employee master"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "addDeliveryBoy",
            menuType: [0],
            data: {
              menu: {
                title: "Delivery Boy Master",
                icon: "nb-compose"
              }
            },
            children: [
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "DeliveryBoy"
                  }
                }
              }
            ]
          },
          {
            companyType: [1],
            path: "doctor-master",
            menuType: [0],
            data: {
              menu: {
                title: "Doctor Master",
                icon: "nb-compose"
              }
            },
            children: [
              {
                companyType: [1],
                path: "list",
                menuType: [0],
                data: {
                  menu: {
                    title: "Doctor master"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "tPartyLedger",
            menuType: [0],
            data: {
              menu: {
                title: "Inter Company Party",
                icon: "nb-compose"
              }
            },
            children: [
              {
                companyType: [0],
                path: "tCustomerList",
                menuType: [0],
                data: {
                  menu: {
                    title: "Inter Company Party"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "utility",
            menuType: [0],
            data: {
              menu: {
                title: "Utility",
                icon: "nb-coffee-maker"
              }
            },
            children: [
              {
                companyType: [0],
                path: "transporter",
                menuType: [0],
                data: {
                  menu: {
                    title: "Transporter"
                  }
                }
              },
              {
                companyType: [0],
                path: "loyalty",
                menuType: [0],
                data: {
                  menu: {
                    title: "Loyalty"
                  }
                }

              },
              {
                companyType: [0],
                path: "customerwisemaxqtylist",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customerwise max quantity"
                  }
                }

              },
              {
                companyType: [0],
                path: "customer-item-mapping",
                menuType: [2],
                data: {
                  menu: {
                    title: "Customer Item Mapping"
                  }
                }
              }
            ]
          },


          {
            companyType: [0],
            path: "item",
            menuType: [0],
            data: {
              menu: {
                title: "Item",
                icon: "nb-coffee-maker"
              }
            },
            children: [
              {
                companyType: [0],
                path: "itempricechange",
                menuType: [0],
                data: {
                  menu: {
                    title: "Item Price Change"
                  }
                }
              },
              {
                companyType: [0],
                path: "priceDrop",
                menuType: [0],
                data: {
                  menu: {
                    title: "Price Drop"
                  }
                }
              },
              {
                companyType: [0],
                path: "item-property-setting",
                menuType: [2],
                data: {
                  menu: {
                    title: "Item Property Setting"
                  }
                }
              }
            ]
          },





          {
            companyType: [0],
            path: "inventory-info",
            menuType: [0],
            data: {
              menu: {
                title: "Inventory Info",
                icon: "nb-coffee-maker"
              }
            },
            children: [
              {
                companyType: [0],
                path: "productmaster",
                menuType: [0],
                data: {
                  menu: {
                    title: "Product Master"
                  }
                }
              },

              {
                companyType: [0],
                path: "departmentvscategory",
                menuType: [0],
                data: {
                  menu: {
                    title: "Department Vs Categories"
                  }
                }
              },
              {
                companyType: [0],
                path: "categorymaster",
                menuType: [0],
                data: {
                  menu: {
                    title: "Category Master"
                  }
                }
              },
              {
                companyType: [0],
                path: "hcategorymaster",
                menuType: [0],
                data: {
                  menu: {
                    title: "Hierarchical Category Master"
                  }
                }
              },
              {
                companyType: [0],
                path: "unit-list",
                menuType: [0],
                data: {
                  menu: {
                    title: "Unit Of Measurement"
                  }
                }
              },
              {
                companyType: [0],
                path: "comboItem",
                menuType: [0],
                data: {
                  menu: {
                    title: "Combo Mapping"
                  }
                }
              },
              {
                companyType: [0],
                path: "kit-config",
                menuType: [0],
                data: {
                  menu: {
                    title: "Combo Packing"
                  }
                }
              },
              {
                companyType: [0],
                path: "kit-configQualityCheck",
                menuType: [0],
                data: {
                  menu: {
                    title: "Packing Quality Check"
                  }
                }
              },
              {
                companyType: [0],
                path: "unpack",
                menuType: [0],
                data: {
                  menu: {
                    title: "UnPacking"
                  }
                }
              },
              {
                companyType: [0],
                path: "taxslab",
                menuType: [0],
                data: {
                  menu: {
                    title: "Tax-Slab Rate Master"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "tendertype",
            menuType: [0],
            data: {
              menu: {
                title: "Tender"
              }
            }
          },
          // {
          // companyType:[0],//
          // path: "item-master",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Item Master"
          //     }
          //   }
          // }
        ]
      }
      ,


      {
        companyType: [0],
        path: "transaction",
        menuType: [0],
        data: {
          menu: {
            title: "Transaction",
            icon: "ion-stats-bars",
            selected: false,
            expanded: false,
            order: 3
          }
        },
        children: [
          {
            companyType: [0],
            path: "sales",
            menuType: [0],
            data: {
              menu: {
                title: "Sales",
                icon: "ion-social-usd",
                selected: false,
                expanded: false,
                order: 5
              }
            },
            children: [
              {
                companyType: [0],
                path: "sales-order",
                menuType: [0],
                data: {
                  menu: {
                    title: "Sales Order"
                  }
                }
              },
              {
                companyType: [0],
                path: "performa-invoice",
                menuType: [0],
                data: {
                  menu: {
                    title: "Proforma Invoice"
                  }
                }
              },
              {
                companyType: [0],
                path: "delivery-challaan",
                menuType: [0],
                data: {
                  menu: {
                    title: "Delivery Challan"
                  }
                }
              },
              {
                companyType: [0],
                path: "quotationinvoice",
                menuType: [0],
                data: {
                  menu: {
                    title: "Quotation Invoice"
                  }
                }
              },
              {
                companyType: [0],
                path: "cash-handover",
                menuType: [0],
                data: {
                  menu: {
                    title: "Cash Handover"
                  }
                }
              },
              // {
              //   companyType: [0],
              //   path: "session-management",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Session Management"
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: 'addsientry',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Sales Invoice'
                  }
                }
              },
              {
                companyType: [0],
                path: "add-creditnote-itembase",
                menuType: [0],
                data: {
                  menu: {
                    title: "Sales Return"
                  }
                }
              },
              {
                path: "transfer-out",
                data: {
                  menu: {
                    title: "Inter Company Transfer Out"
                  }
                }
              },


              {
                companyType: [0],
                path: "loadchart",
                menuType: [0],
                data: {
                  menu: {
                    title: "Load Sheet"
                  }
                }
              }
              ,
              {
                companyType: [0],//
                path: "salesinvoicedelivery",
                menuType: [0],
                data: {
                  menu: {
                    title: "Invoice Delivery"
                  }
                }
              },
              {
                companyType: [0],//
                path: "discountcouponmaster",
                menuType: [0],
                data: {
                  menu: {
                    title: "Discount Coupon"
                  }
                }
              },
              {
                companyType: [0],//
                path: "couponcreation",
                menuType: [0],
                data: {
                  menu: {
                    title: "Coupon Creation"
                  }
                }
              },
              {
                companyType: [0],//
                path: "couponallotement",
                menuType: [0],
                data: {
                  menu: {
                    title: "Coupon Allotment"
                  }
                }
              },
              {
                companyType: [0],//
                path: "coupontouser",
                menuType: [0],
                data: {
                  menu: {
                    title: "Coupon Issue"
                  }
                }
              },

            ]
          },
          {
            companyType: [0],
            path: "purchases",
            menuType: [0],
            data: {
              menu: {
                title: "Purchase",
                icon: "ion-arrow-graph-up-right",

                selected: false,
                expanded: false,
                order: 4
              }
            },
            children: [
              {
                companyType: [0],
                path: "indent",
                menuType: [0],
                data: {
                  menu: {
                    title: "Indent"
                  }
                }
              },
              {
                companyType: [0],
                path: "add-RFQ-order",
                menuType: [15, 16],
                data: {
                  menu: {
                    title: "RFQ"
                  }
                }
              },
              {
                companyType: [0],
                path: "indent-approval",
                menuType: [17],
                data: {
                  menu: {

                    title: "Indent Approval/Indent Delivery"
                  }
                }
              },
              {
                companyType: [0],
                path: "supplier-response-detail",
                menuType: [15],
                data: {
                  menu: {

                    title: "supplier response detail"
                  }
                }
              },
              {
                companyType: [0],
                path: "add-purchase-order",
                menuType: [0],
                data: {
                  menu: {
                    title: "Purchase Order"
                  }
                }
              },
              {
                companyType: [0],
                path: "add-purchase-invoice",
                menuType: [0],
                data: {
                  menu: {
                    title: "Purchase Invoice"
                  }
                }
              },
              {
                companyType: [0],
                path: "add-debitnote-itembase",
                menuType: [0],
                data: {
                  menu: {
                    title: "Purchase Return"
                  }
                }
              },
              {
                path: "transfer-in",
                data: {
                  menu: {
                    title: "Inter Company Transfer In"
                  }
                }
              },
              {
                companyType: [0],
                path: "purchase-order-delivery",
                menuType: [0],
                data: {
                  menu: {
                    title: "PO Delivery"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "inventory",
            menuType: [0],
            data: {
              menu: {
                title: "Inventory"
              }
            },
            children: [
              {
                companyType: [0],
                path: "add-stock-issue",
                menuType: [0],
                data: {
                  menu: {
                    title: "Stock Issue"
                  }
                }
              },
              {
                companyType: [0],
                path: "StockSettlementEntry",
                menuType: [0],
                data: {
                  menu: {
                    title: "Stock Settlement Entry"
                  }
                }
              },
              {
                companyType: [0],
                path: "StockSettlementEntryApproval",
                menuType: [0],
                data: {
                  menu: {
                    title: "Stock Settlement Approval"
                  }
                }
              },

              {
                companyType: [0],
                path: "openingstockentry",
                menuType: [0],
                data: {
                  menu: {
                    title: "Opening stock entry"
                  }
                }
              },
              {
                path: "branch-in",
                data: {
                  menu: {
                    title: "Transfer In"
                  }
                }
              },
              {
                path: "branch-out",
                data: {
                  menu: {
                    title: "Transfer Out"
                  }
                }
              }

              ,
              {
                companyType: [0],
                path: "repackentry",
                menuType: [0],
                data: {
                  menu: {
                    title: "Repack Entry"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "multiple-mobile-so",
            menuType: [3],
            data: {
              menu: {
                title: "Multiple SO"
              }
            }

          },
          // {
          // companyType:[0],//
          // path: "reorders",
          // //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Reorders",
          //       icon: "",
          //       selected: false,
          //       expanded: false,
          //       order: 5
          //     }
          //   },
          //   children: [
          //     {
          // companyType:[0],//
          // path: "reorder",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "ReOrder"
          //         }
          //       }
          //     },
          //   ]
          // },
          // {
          // companyType:[0],//
          // path: "multipleproformatosi",
          //   menuType: [5],
          //   data: {
          //     menu: {
          //       title: "Proforma To Tax Invoice"
          //     }
          //   }

          // },
          // {
          // companyType:[0],//
          // path: "pickinglist",
          //   menuType: [4, 5, 8, 9, 10],
          //   data: {
          //     menu: {
          //       title: "Picking List"
          //     }
          //   }

          // },
          {
            companyType: [0],
            path: "multiple-print",
            menuType: [0],
            data: {
              menu: {
                title: "Multiple Voucher Print"
              }
            }
          },
          {
            companyType: [0],
            path: "production",
            menuType: [0],
            data: {
              menu: {
                title: "Production Management"
              }
            },
            children: [
              {
                companyType: [0],
                path: "bom",
                menuType: [0],
                data: {
                  menu: {
                    title: "BOM Mapping"
                  }
                }
              },
              {
                companyType: [0],
                path: "production-target",
                menuType: [0],
                data: {
                  menu: {
                    title: "Production Target"
                  }
                }
              },
              {
                companyType: [0],
                path: "production-entry",
                menuType: [0],
                data: {
                  menu: {
                    title: "Production Entry"
                  }
                }
              },

              {
                companyType: [0],
                path: "production-quality-check",
                menuType: [0],
                data: {
                  menu: {
                    title: "Production Quality Check"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        companyType: [0],
        path: "wms",
        menuType: [0],
        data: {
          menu: {
            title: "WMS",
            icon: "ion-ios-list-outline",
            selected: false,
            expanded: false,
            order: 1
          }
        },
        children: [

          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Inbound",
                selected: false,
                expanded: false
              }
            },
            children: [

              {
                companyType: [0],
                path: "gate-pass",
                menuType: [0],
                data: {
                  menu: {
                    title: "Gate Pass",
                    selected: false,
                    expanded: false
                  }
                }

              },
              {
                companyType: [0],
                path: "mr",
                menuType: [0],
                data: {
                  menu: {
                    title: "MR",
                    selected: false,
                    expanded: false
                  }
                }

              }
            ]
          }
        ]
      },
      {
        companyType: [0],
        path: "reports",
        menuType: [0],
        data: {
          menu: {
            title: "Report",
            icon: "ion-ios-list-outline",
            selected: false,
            expanded: false,
            order: 1
          }
        },

        children: [

          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Inventory Reports",
                selected: false,
                expanded: false
              }
            },
            children: [
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Analysis Reports",
                    selected: false,
                    expanded: false
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: "closingStock",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Closing Stock Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "ClosingStockSummaryReport",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Closing Stock Summary Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "SupplierWiseStock",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Supplier Wise Stock"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'ItemTransactionHistoryStandAlone',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Item Batch Register Report'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Stock Update Reports",
                    selected: false,
                    expanded: false
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: "opening-stock-report",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Opening Stock"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'stockSettlementreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Stock Settlement'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Movement Reports",
                    selected: false,
                    expanded: false
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'TransactionReport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Transaction Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "STOCKISSUEREPORT",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Stock Issue Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'TransactionwiseStockReport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Transaction wise Stock Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "povsintransit",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "PO vs Intransit"
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Expire Reports",
                    selected: false,
                    expanded: false
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'itemexpiryreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Item Expiry Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "agewiseexpiryReport",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Agewise Expiry Report"
                      }
                    }
                  },
                ]
              },

              // Reports
              {
                companyType: [0],
                path: "partialsalesbill",
                menuType: [1],
                data: {
                  menu: {
                    title: "Partial Sales Bill"
                  }
                }
              },





              //{
              // companyType: [0],
              //path: "closingstockcentral",
              // menuType: [15],
              // data: {
              //  menu: {
              //  title: "Closing Stock Central"
              // }
              // }
              //  },


              //{
              // companyType: [0],
              // path: "STOCKISSUEREPORTCENTRAL",
              // menuType: [0],
              // data: {
              //   menu: {
              //   title: "Stock Issue Central Report"
              // }
              //  }
              //},


              // {
              // companyType:[0],//
              // path: 'intransitreport',
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: 'Intransit Report'
              //     }
              //   }
              // },
              // {
              // companyType:[0],//
              // path: 'delordstatusreport',
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: 'Delivery Order Status Report'
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: 'ordermestatus',
                menuType: [5],
                data: {
                  menu: {
                    title: 'Supplier Order Status Report'
                  }
                }
              }
              ,

              {
                companyType: [0],
                path: 'IndentVsReplenishedReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Indent Vs Replenished Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'DeliveryStatusReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Delivery Status Report'
                  }
                }
              },


              {
                companyType: [0],
                path: "ShortExpiryReport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Short Expiry Report"
                  }
                }
              },

              // {
              // companyType:[0],//
              // path: "supplierstockreport",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Supplier Stock Report"
              //     }
              //   }
              // },

              // {
              // companyType:[0],//
              // path: "povspivsintransit",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "PO VS PI VS INTRANSIT"
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "transferin",
                menuType: [0],
                data: {
                  menu: {
                    title: "Transfer In Report"
                  }
                }
              },
              {
                companyType: [0],
                path: "transferout",
                menuType: [0],
                data: {
                  menu: {
                    title: "Transfer Out Report"
                  }
                }
              }
            ]
          },


          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Sales Reports",
                selected: false,
                expanded: false,
                order: 1
              }
            },
            children: [
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Analysis",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'dailysalesreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Daily Sales Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "StockandSalesItemSummary",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Stock & Sale Item Summary"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'salesRegisterReport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Sales Register Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "billwiseitemsalesreport",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Bill Wise Item Sales Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "GROSSMARGINREPORT",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Gross Margin Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "GROSSMARGINREPORTMONTHWISE",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "MonthWise Gross Margin Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "MocWiseSales",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Moc Wise Sales Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'itemwisestockandsalessummary',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Item Stock Ledger Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "areasalesourstandinreport",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Area Sales Outstanding Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "BESTBUYCUSTOMERREPORT",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Best Buy Customer Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "BESTBUYPRODUCTREPORT",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Best Buy Product  Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'hoursalesreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Hour Sales Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'holdbillreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Hold Bill Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'LoadSheetDetail',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Load Sheet detail Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "CUSTOMERITEMTRACKREPORT",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Customer Item Tracking  Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'customerwiseitemsales',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Customer Wise Item Sales Report'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Cancel Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'salesbillcancelreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Sales Bill Cancel Report'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "GST Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'GstSalesSummaryTaxSlabReport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'GST Sales Summary Report'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Proforma Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: "proformadetailreport",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Proforma Detail Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "proformasummaryreport",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Proforma Summary Report"
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Sales Order Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: "sales-order",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Sales Order Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'salesordersummary',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Sales Order Summary'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'sovssi',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'SO VS SI Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'sovspo',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'SO VS PO Report'
                      }
                    }
                  }
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Sales Return Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'customerwisesalesreturnreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Customerwise Sales Return Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'salesreturnreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Sales Return Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'salesreturnsummary',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Sales Return Summary'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Salesman Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: "salesman",
                    menuType: [0],
                    isOnlyCentral: true,
                    data: {
                      menu: {
                        title: "Sales Man",
                        selected: false,
                        expanded: false
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Tender Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'dailycollectionreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Daily Collection Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'monthlycollectionreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Monthly Collection Report'
                      }
                    }
                  },
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [0],
                data: {
                  menu: {
                    title: "Transfer Out Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'transferoutcentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Transfer Out Central Report'
                      }
                    }
                  },
                ]
              },
            ]
          },

          {
            companyType: [0],
            path: "",
            menuType: [15],
            data: {
              menu: {
                title: "Central Reports",
                selected: false,
                expanded: false,
                order: 1
              }
            },
            children: [
              //   companyType: [0],
              //   path: 'FASTMOVINGPRODUCT',
              //   menuType: [15],
              //   data: {
              //     menu: {
              //       title: 'Fast Moving Product Central Report'
              //     }
              //   }
              // }, 
              // {
              //   companyType: [0],
              //   path: "currentstockitemwisesummarycentral",
              //   menuType: [15],
              //   data: {
              //     menu: {
              //       title: "Current Stock Itemwise Summary Central Report Filter"
              //     }
              //   }
              // },
              // {
              //   companyType: [0],
              //   path: "ClosingStockSummaryReportCentral",
              //   menuType: [15],
              //   data: {
              //     menu: {
              //       title: "Closing Stock Summary Report Central"
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "",
                menuType: [15],
                data: {
                  menu: {
                    title: "Sales Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'HourSalesCentralReport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Hourly Sales Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'SALESRETURNREPORTCENTRAL',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Sales Return Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "itemwisesalescentralreport",
                    menuType: [15],
                    data: {
                      menu: {
                        title: "Item  Wise Sales Central Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "itemwisecategorysalescentralreport",
                    menuType: [15],
                    data: {
                      menu: {
                        title: "Category Wise Sales Summary Central"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'dailycollectioncentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Daily Collection Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'monthlycollectioncentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Monthly Collection Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'BillWiseItemWiseSalesCentralReport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Bill Wise Item Wise Sales Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'SalesItemWiseSummaryCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Sales Item Wise Summary Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'CategoryStockItemWiseSalesCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Category Wise Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'HourlySalesItemwiseCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Hourly Item Wise Sales Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'dailysalescentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Daily Sales Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "STOCKISSUEREPORTCENTRAL",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Stock Issue Central Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "StockandSalesCategorySummary",
                    menuType: [15],
                    data: {
                      menu: {
                        title: "Stock & Sale Category Summary"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "StockandSalesItemSummaryCentral",
                    menuType: [15],
                    data: {
                      menu: {
                        title: "Stock & Sale Item Summary"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'SalesVsGRNAnalysis',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Sales Vs GRN Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'PushSalesItemList',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Push Sales Item List Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'ItemSalesHistory',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Item Sales History Central Report'
                      }
                    }
                  }
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [15],
                data: {
                  menu: {
                    title: "Purchase Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'PurchaseSummaryCategoryReportCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Purchase Summary Category Report Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'IndentCentralReport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Indent Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'purchaseRegisterReportCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Purchase Register Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'materialreceiptcentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Material Receipt Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'MRvsPIReportCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'MR vs PI Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'IndentVSPOReportCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Indent VS PO Report Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'POVSMRReportCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'PO vs MR Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'purchaseinvoicedetailcentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Purchase Invoice Detail Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'purchaseordercentraldetailreport',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Purchase Order Detail Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'POvsPICentralReport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Po vs PI Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'ExpectedPOVsActualPurchase',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Expected PO Vs Actual Purchase Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'SuggestedPOQtybasedonlastdaySale',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Suggested PO Qty based on lastday Sale Central Report'
                      }
                    }
                  }
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [15],
                data: {
                  menu: {
                    title: "Analysis Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'FastMovingOutletWise',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Fast Moving Item Wise Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'SlowMovingOutletWise',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Slow Moving Item Wise Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'ItemCorelation',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Item Correlation Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'ItemCorelationFiltered',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Item Correlation Filtered Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "SLOWBUYPRODUCTREPORT",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Slow Buy Product Central Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'BestBuyProductReportCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Best Buy Product Report Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'auditcentral-report',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Audit Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'ItemTransactionHistory',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Item Transaction History Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'UserLoginDetailsCentralReport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'User Login Details Central Report'
                      }
                    }
                  }
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [15],
                data: {
                  menu: {
                    title: "Inventory Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'currentstockcategorywisecentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Current Stock Category Wise Report Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'itemexpiryreportcentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Item Expiry Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'OpeningStockCentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Opening Stock Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'AvailableStockForDay',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Available Stock For Day Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'transferincentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Transfer In Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'transferoutcentralreport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Transfer Out Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "closingstockcentral",
                    menuType: [15],
                    data: {
                      menu: {
                        title: "Current Stock Item Summary Central"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'StockSettlementReportCentral',
                    menuType: [0],
                    data: {
                      menu: {
                        title: 'Stock Settlement Report Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "currentstockitemwisecentral",
                    menuType: [15],
                    data: {
                      menu: {
                        title: "Current Stock Item Detail Central Report"
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: "ShortExpiryReportCentral",
                    menuType: [0],
                    data: {
                      menu: {
                        title: "Short Expiry Central Report"
                      }
                    }
                  }
                ]
              },
              {
                companyType: [0],
                path: "",
                menuType: [15],
                data: {
                  menu: {
                    title: "Promotional Reports",
                    selected: false,
                    expanded: false,
                    order: 1
                  }
                },
                children: [
                  {
                    companyType: [0],
                    path: 'customerwiseloyaltycentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Customer Wise Loyalty Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'customerwisedetailloyaltycentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Customer Wise Detail Loyalty Central'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'couponcreationreportcentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Coupon Creation Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'couponmasterreportcentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Coupon Master Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'coupondiscountreceivedreportcentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Coupon Discount Received Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'couponcreationreportsummarycentral',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Coupon Creation Summary Central Report'
                      }
                    }
                  },
                  {
                    companyType: [0],
                    path: 'OfferManagementReport',
                    menuType: [15],
                    data: {
                      menu: {
                        title: 'Offer Management Report'
                      }
                    }
                  },
                ]
              }
            ]
          },
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Purchase Reports",
                selected: false,
                expanded: false,
                order: 1
              }
            },
            children: [

              {
                companyType: [0],
                path: 'purchaseinvoicedetailreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Invoice Detail Report'
                  }
                }
              },

              {
                companyType: [0],
                path: 'materialreceiptreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Material Receipt Report'
                  }
                }
              },

              {
                companyType: [0],
                path: 'MRvsPIReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'MR vs PI Report'
                  }
                }
              },

              {
                companyType: [0],
                path: 'POvsSOReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'PO vs SO Report'
                  }
                }
              },
              {

                companyType: [0],
                path: 'IndentReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Indent Report'
                  }
                }
              },

              {

                companyType: [0],
                path: 'IndentVSPOReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Indent VS PO Report'

                  }
                }
              },
              {

                companyType: [0],
                path: 'purchaseorderdetailreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Order Detail Report'
                  }
                }
              },

              //{
              //companyType: [0],
              //path: 'materialreceiptcentralreport',
              //menuType: [15],
              // data: {
              // menu: {
              //title: 'Material Receipt Central Report'
              //  }
              // }
              //},
              // {
              // companyType: [0],
              //path: 'purchaseorderdetailreport',
              //menuType: [0],
              //data: {
              //menu: {
              //title: 'Purchase Order Detail Report'
              //}
              //}
              //},
              // {
              // companyType: [0],
              //path: 'purchaseordercentraldetailreport',
              //menuType: [0],
              //data: {
              //menu: {
              //title: 'Purchase Order Detail Central Report'
              //}
              //}
              //},

              {
                companyType: [0],
                path: 'purchasereturnreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Return Report'
                  }
                }
              },

              {
                companyType: [0],
                path: 'purchaseordersummary',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Order Summary'
                  }
                }
              },

              {
                companyType: [0],
                path: 'POVSMRReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'PO VS MR Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'purchasesummary',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Summary'
                  }
                }
              },

              {
                companyType: [0],
                path: 'purchaseRegisterReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Register'
                  }
                }
              },
              {
                companyType: [0],
                path: 'purchaseReturnSummaryReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Return Summary Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'GSTPurchaseSummaryTaxSlabReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'GST Purchase Summary Tax Slab Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'POvsPIReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Po vs PI Report'
                  }
                }
              },
              // {
              // companyType: [0],
              //path: 'POvsPICentralReport',
              //menuType: [15],
              //data: {
              //menu: {
              //title: 'Po vs PI Central Report'
              //}
              //}
              //},
              {
                companyType: [0],
                path: 'PRvsSRreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'PR vs SR Report'
                  }
                }
              },
              {

                companyType: [0],
                path: 'purchaseMonthlyReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase Monthly Report'
                  }
                }
              },
              {

                companyType: [0],
                path: 'purchaseMonthlywiseSummaryReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Purchase - Month Wise Summary'
                  }
                }
              },
            ]
          },

          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Master Report",
                selected: false,
                expanded: false,
                order: 1
              }
            },
            children: [

              {
                companyType: [0],
                path: 'erppireport',
                menuType: [1, 5],
                data: {
                  menu: {
                    title: 'ERP PI REPORT'
                  }
                }
              },
              {
                companyType: [0],
                path: 'erpsireport',
                menuType: [1, 5],
                data: {
                  menu: {
                    title: 'ERP SI REPORT'
                  }
                }
              },
              // {
              // companyType:[0],//
              // path: 'itemwisechannelmarginreport',
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: 'Itemwise Channel Margin Report'
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: 'itemMasterreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Item Master'
                  }
                }
              },
              {
                companyType: [0],
                path: 'PRICELIST',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Price List'
                  }
                }
              },
              {
                companyType: [0],
                path: 'LOYALTYREPORT',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Loyalty Report'
                  }
                }

              },
              {
                companyType: [0],
                path: 'loyaltymasterreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Loyalty Master Report'
                  }
                }

              },
              {
                companyType: [0],
                path: 'CustomerMasterReport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Customer Master Report'
                  }
                }

              },
              {
                companyType: [0],
                path: 'OUTLETLIST',
                menuType: [15],
                data: {
                  menu: {
                    title: 'OUTLET LIST'
                  }
                }
              },
              {
                companyType: [0],
                path: 'salesmanecoreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Salesman & ECO Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'nontransactedpartyreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Non Transacted Customer Report'
                  }
                }
              },

              {
                companyType: [0],
                path: 'SCHEMEMASTER',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Scheme Master'
                  }
                }
              },
              {
                companyType: [0],
                path: 'partyageoutstandingreconcillation',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Party Age Outstanding Reconciliation Report'
                  }
                }
              },
              {
                companyType: [0],
                path: "customerbillreminderreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customer Bill Reminder Report"
                  }
                }
              },
              {
                companyType: [0],
                path: 'mrp-change-report',
                menuType: [0],
                data: {
                  menu: {
                    title: 'MRP Change Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'audit-report',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Audit Report'
                  }
                }
              },
              {
                companyType: [0],
                path: 'itemSchemeMasterreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Item Scheme Master'
                  }
                }
              },

              {
                path: 'schemereport',

                companyType: [0],

                menuType: [0],
                data: {
                  menu: {
                    title: 'Scheme Report'
                  }
                }
              },
              // {
              // companyType:[0],//
              // path: 'claimreport',
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: 'Claim Report'
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "combopackconfigreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Combo Pack Configuration."
                  }
                }
              },
              {
                companyType: [0],
                path: 'claimandexpiryreport',
                menuType: [2, 3, 6, 7],
                data: {
                  menu: {
                    title: 'Claim & Expiry Report'
                  }
                }
              },
              {
                path: 'autodebitnoteraisedreport',

                companyType: [0],

                menuType: [1],
                data: {
                  menu: {
                    title: 'Auto DebitNote Raised Report'
                  }
                }
              },
              {
                path: 'erpSalesReturnReport',

                companyType: [0],

                menuType: [1, 5],
                data: {
                  menu: {
                    title: 'ERP Sales Return Report'
                  }
                }
              },
              {
                path: 'erpPurchaseReturnReport',

                companyType: [0],

                menuType: [1, 5],
                data: {
                  menu: {
                    title: 'ERP Purchase Return Report'
                  }
                }
              },
              {
                companyType: [0],
                path: "crateReport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Crate Report"
                  }
                }
              },
              {
                companyType: [0],
                path: "offlinesyncreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Offline Sync Report"
                  }
                }
              },
              {
                companyType: [0],
                path: "couponReport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Coupon Report."
                  }
                }
              },
              {
                companyType: [0],
                path: "couponmasterreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Coupon Master Report."
                  }
                }
              }
            ]
          },
          // {
          //   companyType: [0],
          //   path: "",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "BI & MIS",
          //       selected: false,
          //       expanded: false,
          //       order: 1
          //     }
          //   },
          //   children: [

          //     {
          //       companyType: [0],
          //       path: 'outlettracking',
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: 'Outlet Tracking Report'
          //         }
          //       }
          //     },
          //   ]
          // },

          {
            companyType: [0],
            path: "",
            menuType: [1],
            data: {
              menu: {
                title: "OrderApp Report",
                selected: false,
                expanded: false,
                order: 1
              }
            },
            children: [

              {
                companyType: [0],
                path: 'soerrorlogreport',
                menuType: [1],
                data: {
                  menu: {
                    title: 'Sales Order Error Log'
                  }
                }
              },
              {
                companyType: [0],
                path: 'ordertransfer',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Order Transfer'
                  }
                }
              }
            ]
          },

          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Fav report",
                selected: false,
                expanded: false,
                order: 1
              }
            },

            children: [

              {
                companyType: [0],
                path: 'itemMasterreport',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Item Master'
                  }
                }
              },
              {
                companyType: [0],
                path: 'PRICELIST',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Price List'
                  }
                }
              },
            ]
          },

        ]
      },
      {
        companyType: [0],
        path: "sms",
        menuType: [0],
        data: {
          menu: {
            title: "SMS",
            icon: "ion-android-home",
            selected: true,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Quick",
                selected: false,
                expanded: false
              }
            },

            children: [
              // {
              //   companyType: [0],
              //   path: "quick-message",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Quick Message",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "quick-email",
                menuType: [0],
                data: {
                  menu: {
                    title: "Quick Email",
                    selected: false,
                    expanded: false
                  }
                }
              }


            ]
          },

          // {
          //   companyType: [0],
          //   path: "",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Master",
          //       selected: false,
          //       expanded: false
          //     }
          //   },

          //   children: [
          //     {
          //       companyType: [0],
          //       path: "outlet-master",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Outlet Master",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //     {
          //       companyType: [0],
          //       path: "category-master",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Category Master",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     }

          //   ]
          // },
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Schedule",
                selected: false,
                expanded: false
              }
            },
            children: [
              {
                companyType: [0],
                path: "schedule-message",
                menuType: [0],
                data: {
                  menu: {
                    title: "Schedule Message",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "quick-schedule-msg",
                menuType: [0],
                data: {
                  menu: {
                    title: "Quick Message Scheduler",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "quick-schedule-email",
                menuType: [0],
                data: {
                  menu: {
                    title: "Quick Email Scheduler",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "reportscheduler",
                menuType: [0],
                data: {
                  menu: {
                    title: "Report Scheduler",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "reportschedulerlisting",
                menuType: [0],
                data: {
                  menu: {
                    title: "Report Scheduler List",
                    selected: false,
                    expanded: false
                  }
                }
              },

            ]
          },
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Customize Template",
                selected: false,
                expanded: false
              }
            },
            children: [
              {
                companyType: [0],
                path: "custom-message",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customize Message",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "custom-email",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customize Email",
                    selected: false,
                    expanded: false
                  }
                }
              }

            ]
          },
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Reports",
                selected: false,
                expanded: false
              }
            },
            children: [
              {
                companyType: [0],
                path: "sms-delivery",
                menuType: [0],
                data: {
                  menu: {
                    title: "SMS Delivery Details",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "email-delivery",
                menuType: [0],
                data: {
                  menu: {
                    title: "Email Delivery Details",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "whatsapp-delivery",
                menuType: [0],
                data: {
                  menu: {
                    title: "Whatsapp Delivery Details",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "sms-failed",
                menuType: [0],
                data: {
                  menu: {
                    title: "SMS Failed Details",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "email-failed",
                menuType: [0],
                data: {
                  menu: {
                    title: "Email Failed Details",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "whatsapp-failed",
                menuType: [0],
                data: {
                  menu: {
                    title: "Whatsapp Failed Details",
                    selected: false,
                    expanded: false
                  }
                }
              }

            ]
          },
          {
            companyType: [0],
            path: "",
            menuType: [0],
            data: {
              menu: {
                title: "Configuration",
                selected: false,
                expanded: false
              }
            },
            children: [
              {
                companyType: [0],
                path: "cust-template",
                menuType: [0],
                data: {
                  menu: {
                    title: "Customer Template",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                companyType: [0],
                path: "emp-template",
                menuType: [0],
                data: {
                  menu: {
                    title: "Employee Template",
                    selected: false,
                    expanded: false
                  }
                }
              }

            ]
          },
        ]
      },
      // {
      //   // path: "masters",
      // companyType:[0],//
      // path: "multibusiness",
      //   menuType: [0],
      //   data: {
      //     menu: {
      //       title: "Multi Business",
      //       icon: "fa fa-usd"
      //     }
      //   }, children: [
      //     {
      //       path: "test",
      //       data: {
      //         menu: {
      //           title: "Test",
      //           icon: "ion-android-people",
      //           selected: false,
      //           expanded: false,
      //           order: 1000
      //         }
      //       }

      //     }]
      // },
      {
        // path: "masters",
        companyType: [0],
        path: "account",
        menuType: [0],
        data: {
          menu: {
            title: "Financial Account",
            icon: "fa fa-usd"
          }
        }, children: [
          {
            path: "test",
            data: {
              menu: {
                title: "Test",
                icon: "ion-android-people",
                selected: false,
                expanded: false,
                order: 1000
              }
            }

          }]
      },
      {
        companyType: [0],
        path: "configuration",
        menuType: [0],
        data: {
          menu: {
            title: "Configuration",
            icon: "ion-gear-b",
            selected: false,
            expanded: false,
            order: 2
          }
        },
        children: [
          {
            companyType: [0],
            path: "org-master",
            menuType: [0],
            data: {
              menu: {
                title: "Organisation Master",
                icon: "ion-android-people",
                selected: false,
                expanded: false,
                order: 90
              }
            },
            children: [
              {
                companyType: [0],
                path: "company-info",
                menuType: [15, 16, 17],
                isOnlyCentral: false,
                data: {
                  menu: {
                    title: "Company Info"
                  }
                }
              },
              {
                companyType: [0],
                path: "warehouse",
                menuType: [0],
                isOnlyCentral: false,
                data: {
                  menu: {
                    title: "Warehouse",
                    selected: false,
                    expanded: false
                  }
                }
              },
            ]
          },

          {
            companyType: [0],
            path: "userManager",
            menuType: [15, 16, 17],
            data: {
              menu: {
                title: "User Manager",
                icon: "ion-android-people",
                selected: false,
                expanded: false,
                order: 90
              }
            },
            children: [
              {
                companyType: [0],
                path: "userlist",
                menuType: [0],
                data: {
                  menu: {
                    title: "User List"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "master-migration",
            menuType: [0],
            data: {
              menu: {
                title: "Master Migration"
              }
            }
          },
          {
            companyType: [0],
            path: "scheme-setting",
            menuType: [],
            data: {
              menu: {
                title: "Scheme Setting"
              }
            }
          },
          // {
          // companyType:[0],//
          // path: "normsetting",
          //   menuType: [],
          //   data: {
          //     menu: {
          //       title: "Norms Setting"
          //     }
          //   }
          // },
          {
            companyType: [0],
            path: "scheme",
            menuType: [0],
            data: {
              menu: {
                title: "Scheme Master",
                selected: false,
                expanded: false
              }
            },
            children: [
              {
                companyType: [0],
                path: "schemeList",
                menuType: [0],
                data: {
                  menu: {
                    title: "Scheme"
                  }
                }
              },
              {
                companyType: [0],
                path: "scheduleTable",
                menuType: [0],
                data: {
                  menu: {
                    title: "Schedule"
                  }
                }
              },
              {
                companyType: [0],
                path: "schemebudgetlist",
                menuType: [0],
                data: {
                  menu: {
                    title: "Scheme Vs Budget Master"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "datamigrationgof",
            menuType: [0],
            data: {
              menu: {
                title: "Inventory Migration"
              }
            }
          },



          {
            companyType: [0],
            path: "invoicing-finance",
            menuType: [0],
            data: {
              menu: {
                title: "Invoicing & Finance",
                icon: "ion-gear-b",
                selected: false,
                expanded: false,
                order: 90
              }
            },
            children: [
              {
                companyType: [0],
                path: "EwayUpdate",
                menuType: [0],
                data: {
                  menu: {
                    title: "Eway Update"
                  }
                }
              },
              {
                companyType: [0],
                path: "einvoice",
                menuType: [0],
                data: {
                  menu: {
                    title: "E-Invoice"
                  }
                }
              },
              // {
              // companyType:[0],//
              // path: "BankFinanceQuery",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Bank Finance Query"
              //     }
              //   }
              // },
            ]
          },



          {
            companyType: [0],
            path: "settings",
            menuType: [0],
            data: {
              menu: {
                title: "Settings",
                icon: "ion-gear-b",
                selected: false,
                expanded: false,
                order: 90
              }
            },
            children: [
              {
                companyType: [0],
                path: 'appconfiguration',
                menuType: [0],
                data: {
                  menu: {
                    title: 'App configuration'
                  }
                }
              },
              {
                companyType: [0],
                path: 'PageWiseControl',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Page Wise Control'
                  }
                }
              },
              {
                companyType: [0],
                path: 'ControlAccessPageWise',
                menuType: [0],
                data: {
                  menu: {
                    title: 'Control Access Page Wise'
                  }
                }
              },
              {
                companyType: [0],
                path: "devicesetting",
                menuType: [0],
                data: {
                  menu: {
                    title: "Print Setting"
                  }
                }
              },
              {
                companyType: [0],
                path: "supplieritemcodevsbpositemcode",
                menuType: [0],
                data: {
                  menu: {
                    title: "Supplier Item Code Vs BPOS Item Code"
                  }
                }
              },
              {
                companyType: [0],
                path: "eancode",
                menuType: [0],
                data: {
                  menu: {
                    title: "EAN Code Management"
                  }
                }
              },
              {
                companyType: [0],
                path: "bar-code",
                menuType: [0],
                data: {
                  menu: {
                    title: "Bar Code Settings"
                  }
                }
              },
              {
                companyType: [0],
                path: "config-bar-code",
                menuType: [0],
                data: {
                  menu: {
                    title: "Configuration Bar Code"
                  }
                }
              },
              // {
              //   companyType: [0],
              //   path: "barcodeMapping",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Bar Code Mapping"
              //     }
              //   }
              // },
              {
                companyType: [0],
                path: "beatvsminlist",
                menuType: [0],
                data: {
                  menu: {
                    title: "Beat Vs Min Amount"
                  }
                }
              },
              {
                companyType: [0],
                path: "prefixsetting",
                menuType: [0],
                data: {
                  menu: {
                    title: "Sales Prefix Setting"
                  }
                }
              },
              {
                companyType: [0],
                path: "digitalSignature",
                menuType: [0],
                data: {
                  menu: {
                    title: "Digital Signature"
                  }
                }
              },
              {
                companyType: [0],
                path: "emailsetting",
                menuType: [0],
                data: {
                  menu: {
                    title: "Email Setting"
                  }
                }
              }
            ]
          },
          {
            companyType: [0],
            path: "outlet-configuration",
            menuType: [15],
            data: {
              menu: {
                title: "Outlet Configuration"
              }
            }
          }

        ]
      }
    ]
  }

]
