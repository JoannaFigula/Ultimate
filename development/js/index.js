$(function () {

    var apiUrl = 'http://localhost:3000/persons';
    var list = $('.employee-list');
    var form = $('.form');
    var btnShowEmlpoyees = $(".work-container");
    var companyName = $(".companyName");
    var divPersons = $(".search");
    var tasksList = $(".tasks-list");
    var inputTask = $("#taskTitle");
    var inputPrice = $("#taskPrice");
    var table = $(".table");

    loadEmlpoyees();

    function loadEmlpoyees() {
        $.ajax({
            url: apiUrl,
        }).done(function (resp) {
            console.log(resp);
            insertEmlpoyees(resp)
        }).fail(function (err) {
            console.log(err);
        })
    }

    function insertEmlpoyees(persons) {
        list.empty();
        list.append(`<div class="form-row search-container"><input type="text" placeholder="Szukaj" class="form-search search">
            <button type="submit" class="fa fa-search"></button></div>`);
        $.each(persons, function (index, person) {
            list.append(`<li class="emlpoyee" data-id="${person.id}">
                                <div class="search" id="div">
                                <img src='${person.photo}'>
                                <div class="personName"> ${person.name}</div>
                                </div>
                            </li>`);
        });
    }

    var selectEmployee = $(".employees");
    var text = selectEmployee.find("ul");
    text.hide();
    var fill = $(".form-group").append("<div class='fill'>Błąd</div>");
    $(".fill").hide();
    $(".task-section").hide();

    btnShowEmlpoyees.on("click", function (e) {
        e.preventDefault();
        console.log("działąm");
        var companyPerson = $(".companyPerson");
        selectEmployee.find("ul").toggle();
        companyName.toggleClass("activ");
        companyPerson.toggleClass("activ");
        if (companyName.hasClass("activ") || companyPerson.hasClass("activ")) {
            companyName.css("border", "1px solid red");
            companyPerson.css("border", "1px solid blue").css("border-radius", "5px");
            $(".form-group").find(".fill").show().css("color", "red");
        } else {
            $(".companyName").css("border", "1px solid grey");
            $(".form-group").find(".fill").hide();
        }
    });

    var divPerson = $(".employee-list");
    divPerson.on("click", ".search", function () {
        $(this).toggleClass("added");
        $(this).hasClass('added');
        $(this).show().css("color", "#0080ff");

        divPerson.on("dblclick", function () {
            console.log("działąm");
            list.hasClass("employee");
            $(".person").append($(".emlpoyee"));
            $(this).text($(".personName"));
            $(".employees").hide();
            $(".task-section").show();
            if (companyName.hasClass("activ") || companyPerson.hasClass("activ")) {
                companyName.css("border", "1px solid grey");
                $(".form-group").find(".fill").hide();
            }
        });
    });

    loadTasks();

    function loadTasks() {
        $.ajax({
            url: apiUrl,
        }).done(function (resp) {
            console.log(resp);
            insertTasks(resp)
        }).fail(function (err) {
            console.log(err);
        })
    }

    function insertTasks(persons) {
        $.each(persons, function (index, person) {
            tasksList.append(`<li class="task" data-id="${person.id}">
                    <div class="container">
                        <div class='plan-options'><table border=1 class="table table-bordered" id="total">
                            <tr class="infoHeader"><td>Nazwa zadania</td><td>Kwota w PLN</td>
                                <td>Kwota w EUR</td><td>Opcje</td></tr>
                            ${person.tasks.map((task, index) =>
                `<tr class="tasks">
                                        <td>${task.taskName}</td>
                                        <td class="totalPln">${task.pricePln}</td>
                                        <td class="totalEur">${task.priceEu}</td>
                                        <td><a href="#" class="btn-delete"><i class="far fa-trash-alt" style="font-size:15px; color:grey;"> Usuń</i></a>
                                        </td></tr>`)}</table></div></div></li>`);
        });
    }

    $(".taskForm").on("submit", function (event) {
        console.log("ok");
        event.preventDefault();
        var taskVal = $("#taskTitle");
        var priceVal = $("#taskPrice");

        if (taskVal.val() === "") {
            alert("uzupełnij")
        } else if (taskVal.val().length < 5) {
            alert("Nazwa powinna mieć minimum 5 znaków")
        } else {
            var newTr = $("<tr>");
            var newTd = $("<td></td>").text(taskVal.val());
            var newTd1 = $("<td>", {class: "totalPln"}).text(priceVal.val() + " PLN");
            var newTd2 = $("<td>", {class: "totalEur"}).text(priceVal.val() * 4.2 + " EUR");
            var newTd3 = $("<td><a href=\"#\" class=\"btn-delete\"><i class=\"far fa-trash-alt\" style=\"font-size:15px; color:grey;\"> Usuń</i></a>\n" +
                "</td>");

            newTr.append(newTd);
            newTr.append(newTd1);
            newTr.append(newTd2);
            newTr.append(newTd3);
            $(".table").append(newTr);

            calc_total_pl();

            function calc_total_pl() {
                var sumPl = 0;
                $(".totalPln").each(function () {
                    sumPl += parseInt($(this).text());
                });
                $('#sumPl').text(sumPl);
            }

            calc_total_eur();

            function calc_total_eur() {
                var sumEu = 0;
                $(".totalEur").each(function () {
                    sumEu += parseInt($(this).text());
                });
                $('#sumEu').text(sumEu);
            }

            taskVal.val("");
            priceVal.val("");
        }
        // addTask(taskVal, priceVal);
    });

    function addTask(taskName, pricePln) {
        var newData = {
            taskName: taskName,
            pricePln: pricePln,
        };
        $.ajax({
            url: apiUrl,
            method: 'POST',
            data: newData,
        }).done(function () {
            inputTask.val('');
            inputPrice.val('');
        }).fail(function (err) {
            console.log(err);
        }).always(function () {
            loadTasks();
        })
    }

    $(".tasks-list").on("click", ".btn-delete", function () {
        console.log("działam");
        $(this).parent().parent().fadeOut(function () {
            $(this).remove();
            removeTask(id);
        });
    });


    function removeTask(id) {
        $.ajax({
            url: apiUrl + '/' + id,
            method: 'DELETE',
        }).done(function (resp) {

        }).fail(function (err) {
            console.log(err);
        }).always(loadTasks);
    }

    calc_total_pl();

    function calc_total_pl() {
        var sumPl = 0;
        $(".totalPln").each(function () {
            sumPl += parseInt($(this).text());
        });
        $('#sumPl').text(sumPl);
    }

    calc_total_eur();

    function calc_total_eur() {
        var sumEu = 0;
        $(".totalEur").each(function () {
            sumEu += parseInt($(this).text());
        });
        $('#sumEu').text(sumEu);
    }

    var currencyElem = $('.currency');
    var currencyUrl = 'http://api.nbp.pl/api/exchangerates/rates/a/eur?format=json';

    function insertCurrency(currencies) {
        console.log(currencies);
        console.log(currencies[0].mid);
        var newLi = $("<li>");
        var newLabel = $("<label>").text(currencies[0].mid);
        newLi.append(newLabel);
        currencyElem.append(newLi);
    }

    function loadCurrency() {
        $.ajax({
            url: currencyUrl,
            dataType: 'json'
        }).done(function (resp) {
            insertCurrency(resp.rates);
        }).fail(function (err) {
            console.log(err);
        });
    }

    loadCurrency();
});



