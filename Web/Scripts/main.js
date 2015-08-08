$(document).ready(function () {
    if ($("#ddl_sem_network").length) {
        var semNetworkId = $("#ddl_sem_network").val();
        draw(semNetworkId);
    }
});

var nodes = null;
var edges = null;
var network = null;
var data = null;
var seed = 2;
function destroy() {
    if (network) {
        network.destroy();
        network = null;
    }
}

function loadSemnetworkJson(semNetworkId) {
    var result;
    jQuery.ajax({
        type: 'GET',
        async: false,
        timeout: 30000,
        url: "/api/SemanticNetworks/" + semNetworkId,
        success: function (data) {
            result = data;
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });
    return result;
}

function getNetwork() {
    
}

function draw(semNetworkId) {
    destroy();
    nodes = [];
    edges = [];
    var semNetworkJson = loadSemnetworkJson(semNetworkId);
    data = getGraph(semNetworkJson);
    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        layout: { randomSeed: seed },
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


function getGraph(semNetworkJson) {
    var nodes = [];
    var edges = [];

    // Create some nodes and edges.
    semNetworkJson.Vertices.forEach(
        function (node) {
            nodes.push({
                id: node.VertexId,
                label: node.Text
            });
        }
    );

    semNetworkJson.Arcs.forEach(
        function (arc) {
            edges.push({
                from: arc.FromVertexId,
                to: arc.ToVertexId,
                label: arc.Text,
                font: { align: 'top' },
                arrows: 'to'
            });
        }
    );
    
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
    draw(semNetworkId);
});
