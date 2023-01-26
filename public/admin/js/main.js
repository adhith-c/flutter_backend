(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {
        offset: '80%'
    });


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav: false
    });


    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    // Worldwide Sales Chart
    let array = document.getElementById('graph').value;
    console.log('array', typeof (array))

    let graphLabels = document.getElementById('graphlabels').value;
    console.log(graphLabels)
    graphLabels = JSON.parse(graphLabels)
    console.log(graphLabels)
    let label = []
    for (let i = 0; i < graphLabels.length; i++) {
        label.push(`${graphLabels[i].day}` + "/" + `${graphLabels[i].month}` + "/" + `${graphLabels[i].year}`);
    }

    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: [...label],
            datasets: [{
                label: "Last 7 Days",
                data: [...array],
                backgroundColor: "rgba(235, 22, 22, .7)"
            }]
        },
        options: {
            responsive: true
        }
    });


    // Salse & Revenue Chart
    let sale = document.getElementById('graph').value;
    let revenue = document.getElementById('revenue').value;

    console.log('label', label)
    let labelvar = [];
    // label.forEach(p => {
    //     labelvar.push(p);
    // })
    // console.log('labelvar', labelvar)

    var ctx2 = $("#salse-revenue").get(0).getContext("2d");
    var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: [...label],
            datasets: [{
                    label: "Sales",
                    data: [...sale],
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    fill: true
                },
                {
                    label: "Revenue",
                    data: [...revenue],
                    backgroundColor: "rgba(235, 22, 22, .5)",
                    fill: true
                }
            ]
        },
        options: {
            responsive: true
        }
    });

    // Doughnut Chart
    let cod = document.getElementById('paymentGraph0').value;
    let online = document.getElementById('paymentGraph1').value;

    //paymentGraph = parseInt(paymentGraph)
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: ["ONLINE", "COD"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(189, 255, 0, 0.8)",
                ],
                data: [cod, online],
                // backgroundColor: "rgba(235, 22, 22, .7)",
                fill: true
            }]
        },
        options: {
            responsive: true,
        }
    });

    // Pie Chart
    let catVal = document.getElementById('categoryvalues').value.split(',');
    let catLab = document.getElementById('categorylabels').value.split(",")
    let cat = catVal.map(function (item) {
        return parseInt(item, 10)
    })
    console.log(cat)
    // let label = [];
    // for (let i of catLab) {
    //     i = i.toString();
    //     label.push(i)
    // }

    var ctx5 = $("#pie-chart").get(0).getContext("2d");
    var myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: [...catLab],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(32, 40, 179, 0.8)",
                    "rgba(32, 246, 179, 0.8)",

                ],
                data: [...cat]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Single Line Chart
    var ctx3 = $("#line-chart").get(0).getContext("2d");
    var myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            datasets: [{
                label: "Salse",
                fill: false,
                backgroundColor: "rgba(235, 22, 22, .7)",
                data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Single Bar Chart
    var ctx4 = $("#bar-chart").get(0).getContext("2d");
    var myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });



    // Doughnut Chart
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15],
                backgroundColor: "rgba(235, 22, 22, .7)",
                fill: true
            }]
        },
        options: {
            responsive: true,
            circumference: 1 * Math.PI,
            rotation: 1 * Math.PI,
            cutoutPercentage: 90

        }
    });
    // var myChart6 = new Chart(ctx6, {
    //     config: {
    //         type: 'doughnut',
    //         data: data,
    //     },
    //     data: {
    //         labels: [
    //             'Red',
    //             'Blue',
    //             'Yellow'
    //         ],
    //         datasets: [{
    //             label: 'My First Dataset',
    //             data: [300, 50, 100],
    //             backgroundColor: [
    //                 'rgb(255, 99, 132)',
    //                 'rgb(54, 162, 235)',
    //                 'rgb(255, 205, 86)'
    //             ],
    //             hoverOffset: 4
    //         }]
    //     }
    // });


})(jQuery);