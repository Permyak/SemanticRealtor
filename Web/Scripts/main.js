$(document).ready(function () {
    draw();
});

var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data = getScaleFreeNetwork(25);
var seed = 2;
function destroy() {
    if (network) {
        network.destroy();
        network = null;
    }
}
function draw() {
    destroy();
    nodes = [];
    edges = [];
    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        locale: "ru",
        manipulation: {
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Добавить вершину";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Изменить вершину";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                document.getElementById('network-popUp').style.display = 'block';
            },
            addEdge: function (data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Вы хотите соединить вершину саму с собой?");
                    if (r == true) {
                        callback(data);
                    }
                }
                else {
                    callback(data);
                }
            }
        }
    };
    network = new vis.Network(container, data, options);
}
function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}
function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}
function saveData(data, callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}

/**
 * Created by Alex on 5/20/2015.
 */

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            }
            else {
                error(xhr);
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}


function getScaleFreeNetwork(nodeCount) {
    var nodes = [];
    var edges = [];
    var connectionCount = [];

    // randomly create some nodes and edges
    for (var i = 0; i < nodeCount; i++) {
        nodes.push({
            id: i,
            label: String(i)
        });

        connectionCount[i] = 0;

        // create edges in a scale-free-network way
        if (i == 1) {
            var from = i;
            var to = 0;
            edges.push({
                from: from,
                to: to
            });
            connectionCount[from]++;
            connectionCount[to]++;
        }
        else if (i > 1) {
            var conn = edges.length * 2;
            var rand = Math.floor(Math.random() * conn);
            var cum = 0;
            var j = 0;
            while (j < connectionCount.length && cum < rand) {
                cum += connectionCount[j];
                j++;
            }


            var from = i;
            var to = j;
            edges.push({
                from: from,
                to: to
            });
            connectionCount[from]++;
            connectionCount[to]++;
        }
    }

    return { nodes: nodes, edges: edges };
}

var unnamedCnt = 0;
$("#add_node").click(function () {
    unnamedCnt++
    sys.addNode('unnamed' + unnamedCnt)
});

$("#add_edge").click(function () {
    $.fancybox({
        content: $('#add_edge_div'),
        modal: true,
        closeBtn: true,
    });
});

$("#add_edge_confirm").click(function () {
    sys.addEdge($("#edge_node_1").val(), $("#edge_node_2").val(), { name: $("#edge_name").val() });
    $.fancybox.close();
});

$("#addSemNetwork").click(function () {
    $.fancybox({
        content: $('#addSemNetworkDiv'),
        modal: true,
        closeBtn: true,
    });
});

$("#addSemNetworkConfirm").click(function () {
    var semNetworkName = $("#semNetworkName").val(),
        ddlSemNetwork = $("#ddl_sem_network");
    ddlSemNetwork.append('<option value="' + semNetworkName + '">' + semNetworkName + '</option>');
    ddlSemNetwork[0].selectedIndex = ddlSemNetwork[0].length - 1;
    jQuery.ajax({
        type: 'POST',
        url: "/api/SemanticNetworks/",
        success: function (data) {

        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });
    $.fancybox.close();
});

$("#ddl_sem_network").change(function () {
    var semNetworkId = $(this).val();
    jQuery.ajax({
        type: 'GET',
        url: "/api/SemanticNetworks/" + semNetworkId,
        success: function (data) {

        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });
});
