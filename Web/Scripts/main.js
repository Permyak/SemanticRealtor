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
            result = resolveReferences(data);
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });
    return result;
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

$("#addSemNetwork").unbind("click").click(function () {
    $.fancybox({
        content: $('#addSemNetworkDiv'),
        modal: true,
        closeBtn: true,
    });
});

$("#editSemNetwork").unbind("click").click(function () {
    var $ddlSemNetwork = $("#ddl_sem_network");
    $("#semNetworkNameForEdit").val($ddlSemNetwork[0].options[$ddlSemNetwork[0].selectedIndex].text);

    $.fancybox({
        content: $('#editSemNetworkDiv'),
        modal: true,
        closeBtn: true,
    });
});

$("#removeSemNetwork").unbind("click").click(function () {
    var $ddlSemNetwork = $("#ddl_sem_network"),
        semNetworkId = $ddlSemNetwork.val();
    jQuery.ajax({
        type: 'DELETE',
        async: false,
        timeout: 30000,
        url: "/api/SemanticNetworks/" + semNetworkId,
        success: function () {
            var selectedIndex = $ddlSemNetwork[0].selectedIndex;
            $("#ddl_sem_network option[value='" + semNetworkId + "']").remove();
            if ($ddlSemNetwork[0].length) {
                if (!selectedIndex) {
                    selectedIndex = selectedIndex + 2;
                }

                $ddlSemNetwork[0].selectedIndex = selectedIndex - 1;
                draw($ddlSemNetwork.val());
            }
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });
});

$("#addSemNetworkConfirm").unbind("click").click(function () {
    var semNetworkName = $("#semNetworkName").val(),
        $ddlSemNetwork = $("#ddl_sem_network"),
        sendData = { Name: semNetworkName };

    jQuery.ajax({
        type: 'POST',
        url: "/api/SemanticNetworks/",
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var semNetworkId = data.SemanticNetworkId;
            $ddlSemNetwork.append('<option value="' + semNetworkId + '">' + semNetworkName + '</option>');
            $ddlSemNetwork[0].selectedIndex = $ddlSemNetwork[0].length - 1;
            draw(semNetworkId);
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });

    $.fancybox.close();
});

$("#editSemNetworkConfirm").unbind("click").click(function () {
    var semNetworkName = $("#semNetworkNameForEdit").val(),
        $ddlSemNetwork = $("#ddl_sem_network"),
        sendData = { Name: semNetworkName },
        semNetworkId = $ddlSemNetwork.val();

    jQuery.ajax({
        type: 'PUT',
        url: "/api/SemanticNetworks/" + semNetworkId,
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            $ddlSemNetwork[0].options[$ddlSemNetwork[0].selectedIndex].text = semNetworkName;
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });

    $.fancybox.close();
});

$("#ddl_sem_network").unbind("change").change(function () {
    var semNetworkId = $(this).val();
    draw(semNetworkId);
});

function resolveReferences(json) {
    if (typeof json === 'string')
        json = JSON.parse(json);

    var byid = {}, // all objects by id
        refs = []; // references to objects that could not be resolved
    json = (function recurse(obj, prop, parent) {
        if (typeof obj !== 'object' || !obj) // a primitive value
            return obj;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            for (var i = 0; i < obj.length; i++)
                // check also if the array element is not a primitive value
                if (typeof obj[i] !== 'object' || !obj[i]) // a primitive value
                    continue;
                else if ("$ref" in obj[i])
                    obj[i] = recurse(obj[i], i, obj);
                else
                    obj[i] = recurse(obj[i], prop, obj);
            return obj;
        }
        if ("$ref" in obj) { // a reference
            var ref = obj.$ref;
            if (ref in byid)
                return byid[ref];
            // else we have to make it lazy:
            refs.push([parent, prop, ref]);
            return;
        } else if ("$id" in obj) {
            var id = obj.$id;
            delete obj.$id;
            if ("$values" in obj) // an array
                obj = obj.$values.map(recurse);
            else // a plain object
                for (var prop in obj)
                    obj[prop] = recurse(obj[prop], prop, obj);
            byid[id] = obj;
        }
        return obj;
    })(json); // run it!

    for (var i = 0; i < refs.length; i++) { // resolve previously unknown references
        var ref = refs[i];
        ref[0][ref[1]] = byid[ref[2]];
        // Notice that this throws if you put in a reference at top-level
    }
    return json;
}