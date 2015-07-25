//TODO testing

//funzione di ausilio che trova la netmask made by Danilo
function findIpV4Netmask(value) {
    var netmask = '24'; // Di default ho una /24
    /* Estraggo l'eventuale netmask dall'indirizzo ip */
    var netmaskPosition = value.indexOf('/');
    if (netmaskPosition !== -1) {
        netmask = value.substring(netmaskPosition + 1, value.length);
    }
    /* Calcolo il prefisso utilizzando un'apposita libreria */
    IPv4_Address(value, netmask);
    //this.netaddressDotQuad è il prefisso ricavato.
    return this.netaddressDotQuad + '/' + netmask;
}

//oggetto dell'array toMatch
var ToMatch = function (name, clusterFun, expandFun) {
    this.fieldName = name;
    if (clusterFun === undefined) {
        this.filter = function (a) {
            return a;
        }
    } else {
        this.filter = clusterFun;
    }
    if (expandFun === undefined)
        this.expand = function () {
            return false;
        };
    else
        this.expand = expandFun;
}

//esempio di toMatchArray
var defaultToMatchArray = [];

var ipOutToMatch = new ToMatch("ip_add_out", findIpV4Netmask, function (elem, index, array) {
    //queste funzioni avranno tutte questa forma
    var res = new ToMatch("ip_add_out");
    array.splice(index + 1, 0, res); //aggiungo il nuovo ToMatch dopo il precedente  
    return true;
});

defaultToMatchArray.push(ipOutToMatch);

//fa in modo tale che tutti i toMatch abbiano eseguito le loro funzioni di expand
function normalizeToMatchArray(toMatchArray) {
    var eseguito;
    do { //esegue fintanto esiste u campo con expand potrebbe non essere necessario
        //poco robusto può portare a loop
        eseguito = false;
        toMatchArray.forEach(function (elem, index, array) {
            eseguito = elem.expand(elem, index, array) || eseguito;
        });
    } while (eseguito);
}

//funzione a modello per i flussi filtrati
//defaultFilterFunction ritorna un array di questo oggetto
var FilteredFlow = function (name) {
    this.name = name;
    this.entries = [];
    this.count = 0;
    this.addFlow = function (newFlow) {
        this.entries.push(newFlow);
        this.count++;
    }
};

function clusterizedFlow(entries, actualMatch) {
    var flow, c, d, currentName;
    var res = [];
    var fieldName = actualMatch.matchValue.fieldName;

    for (c; c < entries.length; c++) {
        currentName = actualMatch.filter(entries[c][fieldName]);
        //cerca in res un flow con quel nome
        //se ci sta aumenta il contatore e aggiungilo
        //se non ci sta crea il flow e aggiungilo
        if (currentName === undefined)
            currentName = "no_match";
        d = res.findIndex(function (elem) {
            return elem[name] === currentName;
        });
        if (d === -1) {
            flow = new FilteredFlow(currentName);
            res.push(flow);
            d = 0;
        }
        res[d].addFlow(entries[c]);
    }

    return res;
}

/** Estrapola un albero dai dati che ha come livelli dettagli di matching decisi da ToMatchArray
    come radice il nodeName
 **/
function matchingFilter(entries, toMatchArray, nodeName, size) {
    var actualMatch, filtered, root;

    if (size === undefined)
        size = 1;

    actualMatch = toMatchArray[0];

    //le entries ripartite per children filtrate rispetto all'attributo attualmente
    //preso in considerazione
    //i filtered sono i famosi cluster filtrati
    filtered = clusterizedFlow(entries, actualMatch);

    root.name = nodeName;

    if (filtered.length !== 0)
        root.children = [];

    //espando gli envenutali cluster
    for (var i; i < filtered.length; i++) {
        root.children.push(matchingFilterHelper(filtered[i], toMatchArray, 1));
    }
    return root;
}

/*  
    entries: porzione di dataset analizzata
    toMatchArray: lista di dettagli da filtrare
    matched:contatore del numero dei campi già matched.
*/
function matchingFilterHelper(entries, toMatchArray, matched) {
    var node = {};
    node.name = entries.name;
    node.size = entries.size;

    var actualMatch = toMatchArray[matched];
    var filtered = clusterizedFlow(entries, actualMatch.filter);

    if (matched !== ToMatchArray.length) {
        node.children = [];
        for (var i; i < filtered.length; i++) {
            node.children.push(matchingFilterHelper(filtered[i], toMatchArray, matched + 1));
        }
    }
    return node;
}


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
function setStrokeFillAndRadius(jsonNode, widthScale, radiusScale) {

    if (jsonNode.children === null) {

        var i;
        for (i = 0; i < jsonNode._children.length; i++) {
            setStrokeFillAndRadius(jsonNode._children[i], widthScale, radiusScale);
        }

    } else {
        if (jsonNode.children !== undefined) {

            // Il nodo che ho preso in considerazione non è una foglia
            var i;
            for (i = 0; i < jsonNode.children.length; i++) {
                setStrokeFillAndRadius(jsonNode.children[i], widthScale, radiusScale);
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
        .attr("width", w + m[1] + m[3])
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
    toggle(root.children[1]);
    toggle(root.children[1].children[2]);
    toggle(root.children[9]);
    toggle(root.children[9].children[0]);

    var minAndMax = getMinAndMaxValues(root);

    var widthScale = d3.scale.linear()
        .domain([minAndMax.min, minAndMax.max])
        .range([1.5, 135]);

    var radiusScale = d3.scale.linear()
        .domain([minAndMax.min, minAndMax.max])
        .range([4.5, 55]);

    root.value = minAndMax.max;

    setStrokeFillAndRadius(root, widthScale, radiusScale);

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
                return d._children ? "lightsteelblue" : "#fff";
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
            .style("opacity", ".8")
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
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
            .style("opacity", ".5")
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
}

function updateTree(filteredRows, entries) {
    buildTree(entries);
}