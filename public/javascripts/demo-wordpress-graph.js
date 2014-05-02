document.getElementById('version-selector').addEventListener('change', selectVersion);  

var developer_list = null;
d3.json("/wordpress/developer.json",function(error,data){
    developer_list = data;
});

var file_list = null;
d3.json("/wordpress/file.json",function(error,data){
    file_list = data;
});

function selectVersion(){
    console.log(this.options[this.selectedIndex].value);
    renderCircleGraph("/wordpress/circle_developer_comment_" + this.options[this.selectedIndex].value + ".json","developer-comment",100);
    renderCircleGraph("/wordpress/circle_developer_commit_" + this.options[this.selectedIndex].value + ".json","developer-commit",100);
    renderCircleGraph("/wordpress/circle_developer_work_" + this.options[this.selectedIndex].value + ".json","developer-work",100);

    //renderCircleGraph("/wordpress/circle_file_logic_" + this.options[this.selectedIndex].value + ".json","file-logic",10);
    //renderCircleGraph("/wordpress/circle_file_syntax_" + this.options[this.selectedIndex].value + ".json","file-syntax",10);
    //renderCircleGraph("/wordpress/circle_file_work_" + this.options[this.selectedIndex].value + ".json","file-work",10);

    renderCircleGraph("/wordpress/circle_TT_logic_" + this.options[this.selectedIndex].value + ".json","TT-logic",250);
    renderCircleGraph("/wordpress/circle_TT_syntax_" + this.options[this.selectedIndex].value + ".json","TT-syntax",150);
    renderCircleGraph("/wordpress/circle_TT_work_" + this.options[this.selectedIndex].value + ".json","TT-work",100);
};



var renderMainGraph = function( jsonFile, divId, distance){
    //console.log("123124"+developer_list[2].developer);

    var width = 868,
        height = 868;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-500)
        .linkDistance(distance)
        .size([width, height]);

    /*clear the graph out*/
    d3.select(document.getElementById(divId)).html("<label>"+divId+"-network</label>");

    var svg = d3.select(document.getElementById(divId)).append("svg")
        .attr("width", width)
        .attr("height", height);


    d3.json(jsonFile, function(error, graph) {
        force
            .nodes(graph.nodes)
            .links(graph.links)
            //.text(graph.nodes)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 8)
            .style("fill", function(d) { return color(d.group); })
            .call(force.drag);

        // node.append("title")
        //     .text(function(d) { return d.name; });

        // var g = svg.selectAll("g")
        //     .data(graph.nodes)
        //     .enter().append('text')
        //     .text(function(d) {
        //         return d.name;
        //     });
        var text = svg.selectAll(".text")
            .data(graph.nodes)
            .enter().append("text")
            .style("fill", function(d) { return color(d.group); })
            .text(function(d) { return d.name ; })
            .attr("id", function(d){return "name-"+d.name;})
            .attr("data-container","body")
            .attr("data-toggle","popover")
            .attr("data-placement","top")
            .attr("data-html",true)
            .attr("data-content",function(d){ 
                return "<div style='boder:5px solid blue'>"+
                "<h3 style='color:"+color(d.group)+"'>"+d.name+
                "</h3><legend></legend><h5>ct</h5></div>"
            })
            .on("mouseover", function(d){ 
                console.log(d.name+" over"); 
                $(this).popover('show');
            })
            .on("mouseout", function(d){ 
                console.log(d.name+" out"); 
                $(this).popover('hide');
            })
            .call(force.drag);


        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            text.attr("x", function(d) { return (d.x+10); })
                .attr("y", function(d) { return (d.y+10); });
            
        });
    });

    d3.select(".text")
        .on("click", function() {
            console.log(this.value);
        });

}


var renderCircleGraph = function( jsonFile, divId, distance){

    var width = 500,
        height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(distance)
        .size([width, height]);

    /*clear the graph out*/
    d3.select(document.getElementById(divId)).html("<label>"+divId+"-netwrok</label>");

    var svg = d3.select(document.getElementById(divId)).append("svg")
        .attr("width", width)
        .attr("height", height);


    d3.json(jsonFile, function(error, graph) {
        force
            .nodes(graph.nodes)
            .links(graph.links)
            //.text(graph.nodes)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", function(d) { return color(d.group); })
            .call(force.drag);

        // node.append("title")
        //     .text(function(d) { return d.name; });

        // var g = svg.selectAll("g")
        //     .data(graph.nodes)
        //     .enter().append('text')
        //     .text(function(d) {
        //         return d.name;
        //     });
        var text = svg.selectAll(".text")
            .data(graph.nodes)
            .enter().append("text")
            .style("fill", function(d) { return color(d.group); })
            .text(function(d) { return d.name ; })
            .on("click", function(d){ console.log(d.name);})
            .call(force.drag);


        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            text.attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
            
        });
    });

    d3.select(".text")
        .on("click", function() {
            console.log(this.value);
        });

}

var renderLabelGraph = function(jsonFile, divId){
    var w = 500, h = 500;

    var labelDistance = 0;

    var vis = d3.select(document.getElementById(divId)).append("svg:svg").attr("width", w).attr("height", h);

    d3.json(jsonFile, function(error, graph) {

        var force = d3.layout.force().size([w, h]).nodes(graph.nodes).links(graph.links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function(x) {
            return x.weight * 10
        });


        force.start();

        var force2 = d3.layout.force().nodes(graph.labelAnchors).links(graph.labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
        force2.start();

        var link = vis.selectAll("line.link").data(graph.links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

        var node = vis.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
        node.append("svg:circle").attr("r", 5).style("fill", "#555").style("stroke", "#FFF").style("stroke-width", 3);
        node.call(force.drag);


        var anchorLink = vis.selectAll("line.anchorLink").data(graph.labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

        var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
        anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
            anchorNode.append("svg:text").text(function(d, i) {
            return i % 2 == 0 ? "" : d.node.label
        }).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

        var updateLink = function() {
            this.attr("x1", function(d) {
                return d.source.x;
            }).attr("y1", function(d) {
                return d.source.y;
            }).attr("x2", function(d) {
                return d.target.x;
            }).attr("y2", function(d) {
                return d.target.y;
            });

        }

        var updateNode = function() {
            this.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }


        force.on("tick", function() {

            force2.start();

            node.call(updateNode);

            anchorNode.each(function(d, i) {
                if(i % 2 == 0) {
                    d.x = d.node.x;
                    d.y = d.node.y;
                } else {
                    var b = this.childNodes[1].getBBox();

                    var diffX = d.x - d.node.x;
                    var diffY = d.y - d.node.y;

                    var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                    var shiftX = b.width * (diffX - dist) / (dist * 2);
                    shiftX = Math.max(-b.width, Math.min(0, shiftX));
                    var shiftY = 5;
                    this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                }
            });


            anchorNode.call(updateNode);

            link.call(updateLink);
            anchorLink.call(updateLink);

        });

    });


}


var renderLabelGraphTest = function(jsonFile, divId){
    var w = 500, h = 500;

    var labelDistance = 0;

    var vis = d3.select(document.getElementById(divId)).append("svg:svg").attr("width", w).attr("height", h);

    var nodes = [];
    var labelAnchors = [];
    var labelAnchorLinks = [];
    var links = [];

    for(var i = 0; i < 30; i++) {
        var node = {
            label : "node " + i
        };
        nodes.push(node);
        labelAnchors.push({
            node : node
        });
        labelAnchors.push({
            node : node
        });
    };

    for(var i = 0; i < nodes.length; i++) {
        for(var j = 0; j < i; j++) {
            if(Math.random() > .95)
                links.push({
                    source : i,
                    target : j,
                    weight : Math.random()
                });
        }
        labelAnchorLinks.push({
            source : i * 2,
            target : i * 2 + 1,
            weight : 1
        });
    };



    var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function(x) {
        return x.weight * 10
    });


    force.start();

    var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
    force2.start();

    var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

    var node = vis.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
    node.append("svg:circle").attr("r", 5).style("fill", "#555").style("stroke", "#FFF").style("stroke-width", 3);
    node.call(force.drag);


    var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

    var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
    anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
        anchorNode.append("svg:text").text(function(d, i) {
        return i % 2 == 0 ? "" : d.node.label
    }).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

    var updateLink = function() {
        this.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });

    }

    var updateNode = function() {
        this.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    }


    force.on("tick", function() {

        force2.start();

        node.call(updateNode);

        anchorNode.each(function(d, i) {
            if(i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                var b = this.childNodes[1].getBBox();

                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 5;
                this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });


        anchorNode.call(updateNode);

        link.call(updateLink);
        anchorLink.call(updateLink);

    });
}



var testoutput = function(){
    console.log("test output");
}



