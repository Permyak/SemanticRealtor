﻿$(document).ready(function () {
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
    if (!semNetworkId) {
        return;
    }
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
        interaction: {
            multiselect: true  
        },
        manipulation: {
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Добавить вершину";
                document.getElementById('node-label').value = "Новая вершина";
                document.getElementById('saveButton').onclick = saveNewNode.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
                document.getElementById("node-label").focus();
                document.getElementById("node-label").select();
            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Редактировать вершину";
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveChangeNode.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                document.getElementById('network-popUp').style.display = 'block';
                document.getElementById("node-label").focus();
                document.getElementById("node-label").select();
            },
            addEdge: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Добавить ребро";
                document.getElementById('node-label').value = "Новое ребро";
                document.getElementById('saveButton').onclick = saveNewEdge.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
                document.getElementById("node-label").focus();
                document.getElementById("node-label").select();
            },
            editEdge: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Редактировать ребро";
                document.getElementById('node-label').value = network.nodesHandler.body.edges[data.id].options.label;
                document.getElementById('saveButton').onclick = saveChangeEdge.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
                document.getElementById("node-label").focus();
                document.getElementById("node-label").select();
            }
        }
    };

    network = new vis.Network(container, data, options);
    network.on("click", function (params) {
    });

    $("#" + network.body.container.id).off("deleted").on("deleted", function ($network, nodes, edges) {
        edges.forEach(function (edgeId) {
            jQuery.ajax({
                type: 'DELETE',
                async: false,
                timeout: 30000,
                url: "/api/Edges/" + edgeId,
                error: function (data) {
                    alert("Request couldn't be processed. Please try again later. the reason " + data);
                }
            });
        });

        nodes.forEach(function (nodeId) {
            jQuery.ajax({
                type: 'DELETE',
                async: false,
                timeout: 30000,
                url: "/api/Nodes/" + nodeId,
                error: function(data) {
                    alert("Request couldn't be processed. Please try again later. the reason " + data);
                }
            });
        });
    });
}

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}

function clearPopUpEdit() {
    document.getElementById('saveButtonEdit').onclick = null;
    document.getElementById('cancelButtonEdit').onclick = null;
    document.getElementById('network-popUpEdit').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveNewNode(data, callback) {
    var sendData = { SemanticNetworkId: $("#ddl_sem_network").val(), Text: document.getElementById('node-label').value },
        newNodeLabel = document.getElementById('node-label').value,
        newNodeId = 0;
    jQuery.ajax({
        type: 'POST',
        url: "/api/Nodes/",
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            newNodeId = data.VertexId;
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });

    data.id = newNodeId;
    data.label = newNodeLabel;
    clearPopUp();
    callback(data);
}

function getEdges(semNetId) {
    var edgesNames = [];
    jQuery.ajax({
        type: 'GET',
        url: "/api/Edges/",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var edges = data.filter(function (el) {
                return semNetId === el.SemanticNetworkId.toString();
            });
            edges.forEach(function (item, i, arr) {
                var found = edgesNames.some(function (el) {
                    return el === item.Text ;
                });
                if (!found) {
                    edgesNames.push(item.Text);
                }
            });
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });
    return edgesNames.sort();
}

function saveNewEdge(data, callback) {
    var newNodeLabel = document.getElementById('node-label').value,
        sendData = {
            SemanticNetworkId: $("#ddl_sem_network").val(),
            Text: newNodeLabel,
            FromVertexId: data.from,
            ToVertexId: data.to
        },
        newEdgeId = 0;

    jQuery.ajax({
        type: 'POST',
        url: "/api/Edges/",
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            newEdgeId = data.ArcId;
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });

    data.id = newEdgeId;
    data.label = newNodeLabel;
    data.arrows = 'to';
    
    clearPopUp();
    callback(data);
}

function saveChangeEdge(data, callback) {
    var newNodeLabel = document.getElementById('node-label').value,
        sendData = {
            SemanticNetworkId: $("#ddl_sem_network").val(),
            Text: newNodeLabel,
            FromVertexId: data.from,
            ToVertexId: data.to,
            ArcId: data.id
        },
        newEdgeId = 0;

    jQuery.ajax({
        type: 'PUT',
        url: "/api/Edges/" + data.id,
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            newEdgeId = data.ArcId;
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });

    data.id = newEdgeId;
    data.label = newNodeLabel;

    clearPopUp();
    callback(data);
}

function saveChangeNode(data, callback) {
    var sendData = { SemanticNetworkId: $("#ddl_sem_network").val(), Text: document.getElementById('node-label').value };

    jQuery.ajax({
        type: 'PUT',
        url: "/api/Nodes/" + data.id,
        data: JSON.stringify(sendData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            newNodeId = data.VertexId;
        },
        error: function (data) {
            alert("Request couldn't be processed. Please try again later. the reason " + data);
        }
    });

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
                id: arc.ArcId,
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

$("#cancelAddSemNetworkConfirm").unbind("click").click(function () {
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

$("#cancelEditSemNetworkConfirm").unbind("click").click(function () {
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