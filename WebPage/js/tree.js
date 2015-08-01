/** Questa funzione calcola il valore massimo e quello minimo tra quelli da assegnare ai nodi
Così da scalare adeguatamente l'albero **/
function getMinAndMaxValues(jsonNode) {
    if (jsonNode.children === null) {
        // Devo leggere dalla proprietà _children
        var i;
        var max = 0;
        var min = Infinity;
        for (i = 0; i < jsonNode._children.length; i++) {
            res = getMinAndMaxValues(jsonNode._children[i]);
            max += res.max;
            min = (min > res.min) ? res.min : min;
        }
        jsonNode.value = max;

        return {
            max: max,
            min: min
        };
    }
    if (jsonNode.children === undefined) {
        jsonNode.value = jsonNode.size;
        return {
            max: jsonNode.size,
            min: jsonNode.size
        };

    } else {
        // Il nodo che ho preso in considerazione non è una foglia
        var i;
        var max = 0;
        var min = Infinity;
        for (i = 0; i < jsonNode.children.length; i++) {
            res = getMinAndMaxValues(jsonNode.children[i]);
            max += res.max;
            min = (min > res.min) ? res.min : min;
        }
        jsonNode.value = max;
        return {
            max: max,
            min: min
        };
    }

}

/** Questa funzione setta la dimenzione dello strokeFill e del raggio per ogni nodo */
function setStrokeFillAndRadiusAndColor(jsonNode, widthScale, radiusScale, parentColor) {

    //Imposto il colore del nodo
    if (parentColor !== undefined) {
        jsonNode.color = parentColor;
    }

    if (jsonNode.children === null) {

        var i;
        for (i = 0; i < jsonNode._children.length; i++) {
            setStrokeFillAndRadiusAndColor(jsonNode._children[i], widthScale, radiusScale, jsonNode.color);
        }

    } else {
        if (jsonNode.children !== undefined) {

            // Il nodo che ho preso in considerazione non è una foglia
            var i;
            for (i = 0; i < jsonNode.children.length; i++) {
                setStrokeFillAndRadiusAndColor(jsonNode.children[i], widthScale, radiusScale, jsonNode.color);
            }
        }
    }

    jsonNode.strokeFill = widthScale(jsonNode.value);
    jsonNode.radius = radiusScale(jsonNode.value);
}


/** Questa funzione crea l'albero **/
function buildTree(json) {
    var m = [20, 120, 20, 120],
        w = 1000 - m[1] - m[3],
        h = 800 - m[0] - m[2],
        i = 0,
        root;

    var tree = d3.layout.tree()
        .size([h, w]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var vis = d3.select("#chart1")
        // .attr("width", w + m[1] + m[3])
        .attr("width", '100%')
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");



    root = json;
    root.x0 = h / 2;
    root.y0 = 0;

    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }


    // Initialize the display to show a few nodes.
    root.children.forEach(toggleAll);
    //    toggle(root.children[1]);
    //    toggle(root.children[1].children[2]);
    //    toggle(root.children[9]);
    //    toggle(root.children[9].children[0]);

    var minAndMax = getMinAndMaxValues(root);

    var widthScale = d3.scale.linear()
        .domain([minAndMax.min, minAndMax.max])
        .range([1.5, 135]);

    var radiusScale = d3.scale.linear()
        .domain([minAndMax.min, minAndMax.max])
        .range([4.5, 55]);

    root.value = minAndMax.max;

    //Imposto il colore per i primi figli
    var colorScale = d3.scale.category10();
    var i;
    for (i = 0; i < root.children.length; i++) {
        root.children[i].color = colorScale(i);
    }

    setStrokeFillAndRadiusAndColor(root, widthScale, radiusScale);

    update(root);


    function update(source) {


        var vis = d3.select("#chart1 g");

        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse();

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
        });

        // Update the nodes…
        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", function (d) {
                toggle(d);
                update(d);
            });

        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", function (d) {
                //return d._children ? "lightsteelblue" : "#fff";
                //return d._children ? d.color : "#fff";
                return d.color;
            });

        nodeEnter.append("svg:text")
            .attr("x", function (d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("class", "node")
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });


        nodeUpdate.select("circle")
            .attr("r", function (d) {
                return d.radius;
            })
            .attr("value", function (d) {
                return d.value;
                //Decommentare se si preferisce mostrare i valori solo per le foglie
                //                if (d.size != undefined) {
                //                    return d.value;
                //                } else {
                //                    return -1;
                //                }
            })
            .style("opacity", ".85")
            .style("fill", function (d) {
                //return d._children ? "lightsteelblue" : "#fff";
                //return d._children ? d.color : "#fff";
                return d.color;
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .style("stroke-width", function (d) {
                var i;
                var arr;
                if (d.source.children !== null) {
                    //return d.source.children[source.y0].strokeFill;
                    arr = d.source.children;
                } else {
                    //return d.source._children[source.y0].strokeFill;
                    arr = d.source._children;
                }

                for (i = 0; i < arr.length; i++) {
                    if (arr[i].id === d.target.id) {
                        return arr[i].strokeFill;
                    }
                }
            })
            .style("opacity", ".3")
            .style("stroke", function (d) {
                var i;
                var arr;

                if (d.source.children !== null) {
                    arr = d.source.children;
                } else {
                    arr = d.source._children;
                }

                for (i = 0; i < arr.length; i++) {
                    if (arr[i].id === d.target.id) {
                        return arr[i].color;
                    }
                }

                return d.color;
            })
            //            .style("stroke", "#fff")
            .transition()
            .duration(duration)
            .attr("d", diagonal);


        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        /* Aggiungo i tip alle barre */
        $('#chart1 circle').tipsy({
            gravity: 'w',
            html: true,
            title: function () {
                var value = $(this)[0].getAttribute('value');
                var description = "numero di entry: " + value + "<br>";
                return description;
                //Decommentare se si preferisce mostrare solo i valori delle foglie
                //                if (value !== "-1") {
                //                    var description = "numero di entry: " + value + "<br>";
                //                    return description;
                //                } else {
                //                    return "";
                //                }

            }
        });



    }

    // Toggle children.
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }

    //$("#chartcontainer").html($("#chartcontainer").html());
}

function updateTree(filteredRows, entries) {
    buildTree(entries);
}