
function assignment9(){
    var filePath="new_chocolates.csv";
    var filePath2= "chocolate_taste_dataset.csv"
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}

//
var question1=function(filePath){
    var rowConverter = function(d){
        return {
            num: parseInt(d[""]),
            beans: d.beans,
            cocoa_butter: d.cocoa_butter,
            cocoa_percent: parseFloat(d['cocoa_percent']),
            company: d.company,
            company_location: d.company_location,
            country_of_bean_origin: d.country_of_bean_origin,
            counts_of_ingredients: parseInt(d["counts_of_ingredients"]),
            first_taste: d.first_taste,
            fourth_taste: d.fourth_taste,
            lecithin: d.lecithin,
            rating: parseFloat(d['rating']),
            ref: parseInt(d["ref"]),
            review_date: parseInt(d["review_date"]),
            salt: d.salt,
            second_taste: d.second_taste,
            specific_bean_origin_or_bar_name: d.specific_bean_origin_or_bar_name,
            sugar: d.sugar,
            sweetener_without_sugar: d.sweetener_without_sugar,
            third_taste: d.third_taste,
            vanilla: d.vanilla,
            latitude: parseFloat(d['country_of_bean_origin_latitude']),
            longitude: parseFloat(d['country_of_bean_origin_longitude'])
        }
    }
    d3.csv(filePath, rowConverter).then(function(data){
        var margin = {top: 50, right: 30, bottom: 30, left: 220},
        width = 690 - margin.left - margin.right,
        height = 560 - margin.top - margin.bottom;
        // append the svg object to the body of the page
        let padding_new = 100;
        var svg = d3.select("#q1_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom+padding_new )
                    .append("g")
                    .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");
        console.log(data);
        var data_by_c = d3.rollup(data, v=> d3.mean(v, d => d.rating), d => d.company);
        console.log(data_by_c);
        var data_arr = Array.from(data_by_c).sort(function(a, b) {return b[1] - a[1];}).slice(0, 15).sort(function(a, b) {return a[1] - b[1];});
        console.log(data_arr);
        var company_lst = data_arr.map(function(d) {return d[0];});
        console.log(company_lst);
        var avg_lst = data_arr.map(function(d) {return d[1];});
        console.log(avg_lst);
        // Add X axis --> it is a date format
        let padding = 0;
        let padding_1 = 0;
        var max_v = 4;//Math.max(...avg_lst);
        var min_v = 3;//Math.min(...avg_lst);
        var xScale = d3.scaleLinear()
            .domain([min_v, max_v])
            .range([padding, width-padding]);
        var x_axis_1 = d3.axisBottom(xScale);
        svg.append("g").call(x_axis_1)
            .attr("class", "x_axis_1")
            .attr("transform","translate(0, 475)")
        // Add Y axis
        let padding_inner = 0.5
        var yScale = d3.scaleBand()
            .domain(company_lst)
            .range([height - padding, padding])
            .padding(padding_inner);
        var y_axis = d3.axisLeft(yScale)
        svg.append("g")
        .call(y_axis)
        .attr("class", "y_axis")
        .attr("transform","translate(0,-9)")
        .selectAll("text") 
        .style("font-size", "12px");
        // Add the line
        var myLine = svg.selectAll("myline")
                      .data(data_arr)
                      .enter()
                      .append("line")
                      .attr("x1", xScale(min_v))
                      .attr("x2", xScale(min_v))
                     //.attr("x1", function(d) {return xScale(d[1]); })
                      .attr("y1", function(d) { return yScale(d[0]); })
                      .attr("y2", function(d) { return yScale(d[0]); })
                      .attr("stroke", "grey")
        let padding3 = -140;
        let padding4 = -30;
        let padding5 = -30
        //Circles -> start at X=0
        var Tooltip = d3.select("#q1_plot")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("position", "absolute")
        var myCircle = svg.selectAll("mycircle")
            .data(data_arr)
            .enter()
            .append("circle")
            .attr("cx", xScale(min_v) )
            //.attr("cx", function(d) { return xScale(d[1]); })
            .attr("cy", function(d) { return yScale(d[0]); })
            .attr("r", "7")
            .style("fill", "#A27C61")
            .attr("stroke", "#563129")
            .on("mouseover", function(e, d){
                //console.log(d);
                Tooltip.transition("showtool").duration(50).style("opacity", 0.9);
                                //create method chain for tooltip
                d3.select(this).transition("showtool").duration(50)
                            .attr("r", "20")
                            .style("fill", "#64442D")
                            .style("stroke", "black")
                            .style("stroke-width", 2)
                            .style("opacity", 1)
                })
                .on("mousemove", function (e, d) {
                        //create method chain for tooltip
                        //console.log(e);
                        Tooltip .html("The average rating for "+d[0]+" is "+d[1])
                                .style("left", (e.pageX+70) + "px")
                                .style("top", (e.pageY) + "px")
                                
                    })
                .on("mouseout", function (e, d) {
                        //create method chain for tooltip
                        Tooltip.transition("showtool").duration(50).style("opacity", 0);
                        d3.select(this).transition("showtool").duration(50)
                        .attr("r", "7")
                        .style("fill", "#A27C61")
                        .style("stroke", "#563129")
                        .style("stroke-width", 1)
                        .style("opacity", 1)
                    });
        var title = svg.append("text")
                .attr("x", width/2)
                .attr("y", padding5)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .text("Top 15 Heigest Rated Chocolate Bars Companies")
                .style("font-family", 'Chalkduster')
                .style("fill", "#64442D");
        var x_lable = svg.append("text")
                .attr("transform", "translate(" + (width/2) + " ," + (height-padding4) + ")")
                .style("text-anchor", "middle")
                .attr("fill", 'black')
                .text("Average Rating");
        var y_lable = svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", padding3)
                .style("text-anchor", "middle")
                .attr("fill", 'black')
                .text("Company Name");
        // Change the X coordinates of line and circle
        let duration_1 = 5000
        myCircle
            .transition()
            .duration(duration_1)
            .attr("cx", function(d) { return xScale(d[1]); })

        myLine
            .transition()
            .duration(duration_1)
            .attr("x1", function(d) {return xScale(d[1]); })
    })
}

var question2=function(filePath){
    
    //reading data
    var rowConverter = function(d){
        return {
            num: parseInt(d[""]),
            beans: d.beans,
            cocoa_butter: d.cocoa_butter,
            cocoa_percent: parseFloat(d['cocoa_percent']),
            company: d.company,
            company_location: d.company_location,
            country_of_bean_origin: d.country_of_bean_origin,
            counts_of_ingredients: parseInt(d["counts_of_ingredients"]),
            first_taste: d.first_taste,
            fourth_taste: d.fourth_taste,
            lecithin: d.lecithin,
            rating: parseFloat(d['rating']),
            ref: parseInt(d["ref"]),
            review_date: parseInt(d["review_date"]),
            salt: d.salt,
            second_taste: d.second_taste,
            specific_bean_origin_or_bar_name: d.specific_bean_origin_or_bar_name,
            sugar: d.sugar,
            sweetener_without_sugar: d.sweetener_without_sugar,
            third_taste: d.third_taste,
            vanilla: d.vanilla,
            latitude: parseFloat(d['country_of_bean_origin_latitude']),
            longitude: parseFloat(d['country_of_bean_origin_longitude'])
        }
    }
    d3.csv(filePath, rowConverter).then(function(data){
        // append the svg object to the body of the page
        var margin = {top: 10, right: 30, bottom: 30, left: 100},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
        // append the svg object to the body of the page
        let padding_new = 100;
        var svg = d3.select("#q2_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom+padding_new )
                    .append("g")
                    .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");
        console.log(data);
        // Add X axis --> it is a date format
        let padding = 1;
        let padding1 = 1;
        let padding2 = 0.5;
        var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.cocoa_percent; })-padding, d3.max(data, function(d) { return d.cocoa_percent; })+padding2]) 
        .range([padding, width-padding2]);
        var x_axis = d3.axisBottom(xScale);
        svg.append("g").call(x_axis)
            .attr("class", "x_axis")
            .attr("transform","translate(0, 365)")
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", ".9em")
            .attr("dy", ".65em")
            //.attr("transform", "rotate(-25)");
        // Add Y axis
        var yScale = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d.rating; })-padding1, d3.max(data, function(d) { return d.rating; })+padding1]) 
            .range([height - padding, padding ]);
        var y_axis = d3.axisLeft(yScale)
        svg.append("g").call(y_axis).attr("class", "y_axis").attr("transform","translate(-15,0)");
        // Add the points
        let r_val = 3;
        var dot = svg.append("g")
            .selectAll("cricle") 
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.cocoa_percent); } ) 
            .attr("cy", function (d) { return yScale(d.rating); } ) 
            .attr("r", r_val)
            .attr("class", "center_plot")
            .style("fill", "#816146" )
            .attr('fill-opacity', 0.3);
        let padding3 = -70;
        let padding4 = -50;
        let padding5 = 10
        var title = svg.append("text")
                .attr("x", width/2)
                .attr("y", padding5)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .text("Cocoa Percentage and Rating Scatterplot")
                .style("font-family", 'Chalkduster')
                .style("fill", "#64442D");
        var x_lable = svg.append("text")
                .attr("transform", "translate(" + (width/2) + " ," + (height-padding4) + ")")
                .style("text-anchor", "middle")
                .attr("fill", 'black')
                .text("Cocoa percentage🤎");
        var y_lable = svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", padding3)
                .style("text-anchor", "middle")
                .attr("fill", 'black')
                .text("Rating🌟");
        var radio = d3.select('#radio_q2')
            .attr('name', 'attribute').on("change", function (d) {
                current_att= d.target.value;
                xScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d) { return d[current_att]; })-padding, d3.max(data, function(d) { return d[current_att]; })+padding2]) 
                    .range([0, width]);
                x_axis = d3.axisBottom(xScale);
                d3.selectAll("g.x_axis")
                        .transition()
                        .call(x_axis)
                
                let delay = 100;
                let duration = 750;
                dot
                    .data(data)
                    .transition()
                    .delay(delay)
                    .duration(duration)
                    .attr("cx", function (d) { return xScale(d[current_att]); } ) 
                    .attr("cy", function (d) { return yScale(d.rating); } ) 
                var current_att_name = ""
                if (current_att == 'cocoa_percent'){
                    current_att_name = 'Cocoa Percentage';
                } else {
                    current_att_name = 'Counts of Ingredients ';
                }
                x_lable 
                    .transition()
                    .delay(delay)
                    .duration(duration)
                    .text(current_att_name+'🤎');
                title
                    .transition()
                    .delay(delay)
                    .duration(duration)
                    .text(current_att_name+" and Rating Scatterplot")
            })
        })
}

var question3=function(filePath){
    var rowConverter = function(d){
            return {
                num: parseInt(d[""]),
                beans: d.beans,
                cocoa_butter: d.cocoa_butter,
                cocoa_percent: parseFloat(d['cocoa_percent']),
                company: d.company,
                company_location: d.company_location,
                country_of_bean_origin: d.country_of_bean_origin,
                counts_of_ingredients: parseInt(d["counts_of_ingredients"]),
                first_taste: d.first_taste,
                fourth_taste: d.fourth_taste,
                lecithin: d.lecithin,
                rating: parseFloat(d['rating']),
                ref: parseInt(d["ref"]),
                review_date: parseInt(d["review_date"]),
                salt: d.salt,
                second_taste: d.second_taste,
                specific_bean_origin_or_bar_name: d.specific_bean_origin_or_bar_name,
                sugar: d.sugar,
                sweetener_without_sugar: d.sweetener_without_sugar,
                third_taste: d.third_taste,
                vanilla: d.vanilla,
                latitude: parseFloat(d['country_of_bean_origin_latitude']),
                longitude: parseFloat(d['country_of_bean_origin_longitude'])
            }
    }
    //var newfp = 'new_chocolate.csv'
    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data);
        //console.log(flavor_lst);
        var new_data = data.filter(function(d){return d.rating >=3});
        console.log(new_data);
        var rowConverter2 = function(d){
                return {
                    taste: d.taste,
                    count_of_taste: parseInt(d["count_of_taste"])
                }
            }
        var newfp = "chocolate_taste_dataset.csv"
        d3.csv(newfp, rowConverter2).then(function(data){
            console.log(data);
            var taste_lst = data.map(function(d) {return d.taste;})
            console.log(taste_lst);
            var count_frist = d3.rollup(new_data, v=> v.length, d => d.first_taste)
            console.log(count_frist);
            var taste_lst1 = Array.from(count_frist.keys());
            console.log(taste_lst1);
            var count_second = d3.rollup(new_data, v=> v.length, d => d.second_taste)
            console.log(count_second);
            var taste_lst2 = Array.from(count_second.keys());
            var count_third = d3.rollup(new_data, v=> v.length, d => d.third_taste)
            console.log(count_third);
            var taste_lst3 = Array.from(count_third.keys());
            var count_fourth = d3.rollup(new_data, v=> v.length, d => d.fourth_taste)
            console.log(count_fourth);
            var taste_lst4 = Array.from(count_fourth.keys());
            let all_taste_len = taste_lst.length
            var new_arr_lst1 = [];
            var new_arr_lst2 = [];
            var new_arr_lst3 = [];
            var new_arr_lst4 = [];
            for (let i=0; i<all_taste_len; i++) {
                if (taste_lst1.indexOf(taste_lst[i]) > -1){
                    var new_lst = [[taste_lst[i], count_frist.get(taste_lst[i])]]
                    new_arr_lst1 = new_arr_lst1.concat(new_lst)
                } else {
                    var new_lst = [[taste_lst[i], 0]]
                    new_arr_lst1 = new_arr_lst1.concat(new_lst)
                }
                if (taste_lst2.indexOf(taste_lst[i]) > -1){
                    var new_lst = [[taste_lst[i], count_second.get(taste_lst[i])]]
                    new_arr_lst2 = new_arr_lst2.concat(new_lst)
                } else {
                    var new_lst = [[taste_lst[i], 0]]
                    new_arr_lst2 = new_arr_lst2.concat(new_lst)
                }
                if (taste_lst3.indexOf(taste_lst[i]) > -1){
                    var new_lst = [[taste_lst[i], count_third.get(taste_lst[i])]]
                    new_arr_lst3 = new_arr_lst3.concat(new_lst)
                } else {
                    var new_lst = [[taste_lst[i], 0]]
                    new_arr_lst3 = new_arr_lst3.concat(new_lst)
                }
                if (taste_lst4.indexOf(taste_lst[i]) > -1){
                    var new_lst = [[taste_lst[i], count_fourth.get(taste_lst[i])]]
                    new_arr_lst4 = new_arr_lst4.concat(new_lst)
                } else {
                    var new_lst = [[taste_lst[i], 0]]
                    new_arr_lst4 = new_arr_lst4.concat(new_lst)
                }
            }
            console.log(new_arr_lst1);
            console.log(new_arr_lst2);
            console.log(new_arr_lst3);
            console.log(new_arr_lst4);
            console.log(new_arr_lst1[0][1]);
            var new_arr_total = []
            for (let i=0; i<all_taste_len; i++) {
                var new_lst = [[taste_lst[i], new_arr_lst1[i][1]+new_arr_lst2[i][1]+new_arr_lst3[i][1]+new_arr_lst4[i][1]]]
                new_arr_total = new_arr_total.concat(new_lst)
            }
            console.log(new_arr_total);
            var sorted_count = new_arr_total.sort(function(a, b) {return b[1] - a[1];}).slice(0, 10);
            console.log(sorted_count);
            var top_10_taste_lst = sorted_count.map(function(d) {return d[0];})
            console.log(top_10_taste_lst);
            var colors = ["#824646", "#F5C3C0","#64442D", "#B1937D"];//"#EFDEAA"];
            var my_taste_lst = ['first taste', 'second taste', 'third taste', 'fourth taste'];
            var stack_prep = [];
            let top_len = top_10_taste_lst.length;
            for (let i=0; i<top_len; i++) {
                let new_idx = taste_lst.indexOf(top_10_taste_lst[i]);
                var new_lst = [{'taste name' : taste_lst[new_idx], 'first taste' : new_arr_lst1[new_idx][1], 'second taste' : new_arr_lst2[new_idx][1], 'third taste': new_arr_lst3[new_idx][1], 'fourth taste': new_arr_lst4[new_idx][1]}]
                stack_prep = stack_prep.concat(new_lst)
            }
            console.log(stack_prep[0]['first taste']);
            var series = d3.stack().keys(my_taste_lst)
            var stacked =  series(stack_prep);
            console.log(stacked);
            // plotting stacked bar chart
        var svgheight = 350;
        var svgwidth = 800;
        var padding = 60;
        var padding2 = 70;
        var padd_in = 0.2;
        var svg = d3.select("#q3_plot").append("svg")
            .attr("height", svgheight+padding2)
            .attr("width", svgwidth)
            .attr("class", "center_plot");
        var xScale = d3.scaleBand()
                    .domain(d3.range(stack_prep.length)) //notice how the domain is set
                    .range([padding, svgwidth-padding])
                    .paddingInner(padd_in);

        var yScale = d3.scaleLinear()
                    .domain([0, d3.max(stack_prep, function(d){ 
                        return d['first taste']+ d['second taste'] + d['third taste'] + d['fourth taste'];
                    })+padding])
                    .range([svgheight-padding, padding]);
        var colorScale = d3.scaleOrdinal()
                        .domain(my_taste_lst)
                        .range(colors);

        //group <g> bars with respect to the secondary Key 
        var groups = svg.selectAll(".gbars")
        .data(stacked).enter().append("g")
        .attr("class","gbars")
        .attr("fill", d => colorScale(d.key));

        //draw a bar for each Key value 
        var rects = groups.selectAll("rect")
                    .data(function(d){
                        //console.log(d)
                        return d;
                    }).enter().append("rect")
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("y", function(d) {
                        return yScale(d[1]); 
                    })
                    .attr("width", xScale.bandwidth()) 
                    .attr('height', (d) => yScale(d[0]) -  yScale(d[1]));
        var newxScale = d3.scaleBand()
            .domain(top_10_taste_lst)
            .range([padding, svgwidth-padding])
            .paddingInner(0.2);
        
        const xAxis = d3.axisBottom().scale(newxScale);
        const yAxis = d3.axisLeft().scale(yScale);
    
        groups.selectAll("text")
            .data(stack_prep).enter().append("text")
            .attr("x", function(d){
                return newxScale(top_10_taste_lst);
            })
            .attr("y", function(d){
                return yScale(d['first taste']+ d['second taste'] + d['third taste'] + d['fourth taste']);
            });

        /* TODO: draw x-axis and y-axis to svg  */
        groups.append("g").call(xAxis)
        .attr("class", "xAxis")
        .attr("transform","translate(0,290)")
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", ".9em")
        .attr("dy", ".65em")
        .attr("font-size", 12)
        .attr("transform", "rotate(0)");
        groups.append("g").call(yAxis).attr("class", "yAxis").attr("transform","translate(60,0)");
        //let new_padding = -20
        groups.append("text")
            .attr("x", svgwidth/2)
            .attr("y", padding)
            .attr("text-anchor", "middle")
            .style("font-size", "19px")
            .attr("fill", 'black')
            .text("Top 10 Chocolate Tastes from Great Chocolate Bars")
            .style("font-family", 'Chalkduster')
            .style("fill", "#64442D");
        groups.append("text")
            .attr("transform", "translate(" + (svgwidth/2) + " ," + (svgheight) + ")")
            .style("text-anchor", "middle")
            .attr("fill", 'black')
            .text("Taste");
        groups.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(svgheight/2))
            .attr("y", 15)
            .style("text-anchor", "middle")
            .attr("fill", 'black')
            .text("Counts");
        var legend = d3.legendColor()
            .scale(colorScale);
        svg.append("g")
            .attr("transform", "translate(650,80)")
            .call(legend);

        })
        })
    
        
}

var question4=function(filePath){
    var rowConverter = function(d){
            return {
                num: parseInt(d[""]),
                beans: d.beans,
                cocoa_butter: d.cocoa_butter,
                cocoa_percent: parseFloat(d['cocoa_percent']),
                company: d.company,
                company_location: d.company_location,
                country_of_bean_origin: d.country_of_bean_origin,
                counts_of_ingredients: parseInt(d["counts_of_ingredients"]),
                first_taste: d.first_taste,
                fourth_taste: d.fourth_taste,
                lecithin: d.lecithin,
                rating: parseFloat(d['rating']),
                ref: parseInt(d["ref"]),
                review_date: parseInt(d["review_date"]),
                salt: d.salt,
                second_taste: d.second_taste,
                specific_bean_origin_or_bar_name: d.specific_bean_origin_or_bar_name,
                sugar: d.sugar,
                sweetener_without_sugar: d.sweetener_without_sugar,
                third_taste: d.third_taste,
                vanilla: d.vanilla,
                latitude: parseFloat(d['country_of_bean_origin_latitude']),
                longitude: parseFloat(d['country_of_bean_origin_longitude'])
            }
    }
    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data);
        var data_by_c = d3.rollup(data, v=> [d3.mean(v, d => d.rating), v.length], d => d.company);
        console.log(Array.from(data_by_c)[0][1][1]);
        data_by_c = Array.from(data_by_c).filter(function(d){return d[1][1]>=20})
        console.log(data_by_c);
        var data_arr = data_by_c.sort(function(a, b) {return b[1][0] - a[1][0];}).slice(0, 3)//.sort(function(a, b) {return a[1] - b[1];});
        console.log(data_arr);
        var company_lst = data_arr.map(function(d) {return d[0];});
        console.log(company_lst);
        var avg_lst = data_arr.map(function(d) {return d[1];});
        console.log(avg_lst);
        var new_data = data.filter(function(d){return company_lst.indexOf(d.company) > -1});
        console.log(new_data);
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 50, left: 70},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q5_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        var sumstat = [];
        for (let i=0; i<3; i++) {
            var my_data = new_data.filter(function(d){return d.company == company_lst[i]})
            my_data = Array.from(my_data).map(function(d) {return d.rating;});
            console.log(my_data);
            var data_sorted = my_data.sort(d3.ascending)
            var q1 = d3.quantile(data_sorted, .25)
            var median = d3.quantile(data_sorted, .5)
            var q3 = d3.quantile(data_sorted, .75)
            var interQuantileRange = q3 - q1
            var min = q1 - 1.5 * interQuantileRange
            var max = q1 + 1.5 * interQuantileRange
            var new_lst = [{company: company_lst[i], q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max}]
            sumstat = sumstat.concat(new_lst)
        }
        console.log(sumstat);

        // Show the Y scale
        var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(company_lst)
        .padding(.4);
        var y_axis = d3.axisLeft().scale(y);//.tickSize(0);
        svg.append("g")
        .call(y_axis)
        .style("font-size", "14px")
        .select(".domain").remove()
        let pad_min = 2;
        let pad_max = 4.5;
        // Show the X scale
        var x = d3.scaleLinear()
        .domain([pad_min,pad_max])
        .range([0, width])
        var x_axis = d3.axisBottom(x).ticks(5);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis)
        .select(".domain").remove()
        
        // Color scale
        var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([pad_min,pad_max])

        // Show the main vertical line
        svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.min))})
        .attr("x2", function(d){return(x(d.max))})
        .attr("y1", function(d){return(y(d.company) + y.bandwidth()/2)})
        .attr("y2", function(d){return(y(d.company) + y.bandwidth()/2)})
        .attr("stroke", "black")
        .style("width", 40)

        // rectangle for the main box
        svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.q1))}) // console.log(x(d.value.q1)) ;
            .attr("width", function(d){ ; return(x(d.q3)-x(d.q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
            .attr("y", function(d) { return y(d.company); })
            .attr("height", y.bandwidth() )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
            .style("opacity", 0.3)

        // Show the median
        svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function(d){return(y(d.company))})
        .attr("y2", function(d){return(y(d.company) + y.bandwidth()/2)})
        .attr("x1", function(d){return(x(d.median))})
        .attr("x2", function(d){return(x(d.median))})
        .attr("stroke", "black")
        .style("width", 80)

        // create a tooltip
        var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px")
        // Three function that change the tooltip when user hover / move / leave a cell
        // var mouseover = function(d) {
        // tooltip
        // .transition()
        // .duration(200)
        // .style("opacity", 1)
        // tooltip
        //     .html("<span style='color:grey'>Sepal length: </span>" + d.Sepal_Length) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
        //     .style("left", (d3.mouse(this)[0]+30) + "px")
        //     .style("top", (d3.mouse(this)[1]+30) + "px")
        // }
        // var mousemove = function(d) {
        // tooltip
        // .style("left", (d3.mouse(this)[0]+30) + "px")
        // .style("top", (d3.mouse(this)[1]+30) + "px")
        // }
        // var mouseleave = function(d) {
        // tooltip
        // .transition()
        // .duration(200)
        // .style("opacity", 0)
        // }

        // Add individual points with jitter
        var jitterWidth = 50
        svg
        .selectAll("indPoints")
        .data(new_data)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.rating))})
        .attr("cy", function(d){ return( y(d.company) + (y.bandwidth()/2) - jitterWidth/2 + Math.random()*jitterWidth )})
        .attr("r", 4)
        .style("fill", function(d){ return(myColor(+d.rating)) })
        .attr('fill-opacity', 0.5);
        //.attr("stroke", "black")
        // .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        // .on("mouseleave", mouseleave);
        // Add axis label:
        let padding = 10;
        svg.append("text")
            .attr("x", width/2)
            .attr("y", padding)
            .attr("text-anchor", "middle")
            .style("font-size", "17px")
            .text("Chocolate Bars Companies Rating Distributions")
            .style("font-family", 'Chalkduster')
            .style("fill", "#64442D");
        svg.append("text")
            .attr("transform", "translate(" + (width/2) + " ," + (height+40) + ")")
            .style("text-anchor", "middle")
            .attr("fill", 'black')
            .text("Rating");
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height/2))
            .attr("y", -60)
            .style("text-anchor", "middle")
            .attr("fill", 'black')
            .text("Company");
        var legend = d3.legendColor()
             .scale(myColor);
        //var legend = Legend(myColor);
        svg.append("g")
            .attr("transform", "translate(350,50)")
            .call(legend)
            .attr('fill-opacity', 0.8);
    })
}

var question5=function(filePath){
    var rowConverter = function(d){
            return {
                num: parseInt(d[""]),
                beans: d.beans,
                cocoa_butter: d.cocoa_butter,
                cocoa_percent: parseFloat(d['cocoa_percent']),
                company: d.company,
                company_location: d.company_location,
                country_of_bean_origin: d.country_of_bean_origin,
                counts_of_ingredients: parseInt(d["counts_of_ingredients"]),
                first_taste: d.first_taste,
                fourth_taste: d.fourth_taste,
                lecithin: d.lecithin,
                rating: parseFloat(d['rating']),
                ref: parseInt(d["ref"]),
                review_date: parseInt(d["review_date"]),
                salt: d.salt,
                second_taste: d.second_taste,
                specific_bean_origin_or_bar_name: d.specific_bean_origin_or_bar_name,
                sugar: d.sugar,
                sweetener_without_sugar: d.sweetener_without_sugar,
                third_taste: d.third_taste,
                vanilla: d.vanilla,
                latitude: parseFloat(d['country_of_bean_origin_latitude']),
                longitude: parseFloat(d['country_of_bean_origin_longitude'])
            }
    }
    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data);
        var width = 900;
        var height = 600;
        var svg1 = d3.select("#q4_plot")
                     .append("svg").attr("width", width)
                     .attr("height", height)
                     .attr("class", "center_plot");
        const projection1  = d3.geoNaturalEarth1()
                               .scale(100)
                               .translate([width / 2, height / 2]);//chain translate and scale
        const projection2  = //d3.geoAzimuthalEqualArea()
                                //d3.geoInterruptedHomolosine() 
                                //d3.geoBonne() 
                                d3.geoGingery().lobes(500) 
                                //d3.geoPolyhedralWaterman()
                                //d3.geoBottomley()
                                //d3.geoBonne().parallel(70)
                               .scale(100)
                               .translate([width / 2, height / 2])
                               .rotate(150); 
        const pathgeo1 = d3.geoPath()
                               .projection(projection1);
        const pathgeo2 = d3.geoPath()
                               .projection(projection2);
        //TO DO: Load JSON file and create the map
        svg1.append('path')
                    .attr('class', 'sphere')
                    .attr('d', pathgeo2({ type: 'Sphere' })).style("fill", "#DBB785");
        const worldmap = d3.json("world.json");
        worldmap.then(function(map){
            console.log(map);
            svg1.selectAll("path")
                .data(map.features)
                .enter().append("path").attr("d", pathgeo2)
                .style("fill", "#F7E9B7")//"#FAECA5")//"pink")
                .attr('stroke','#C68E63');
            var new_data = data.filter(function(d){return d.rating >=3.5});
            console.log(new_data);
            let num_excellent_bar = new_data.length;
            var c_by_c = d3.rollups(new_data, v => [v.length, v[0].latitude, v[0].longitude], d => d.country_of_bean_origin);
            console.log(c_by_c);
            var k_lst = Array.from(c_by_c.map(function(d){return d[0]}));
            console.log(k_lst);
            var v_lst = Array.from(c_by_c.map(function(d){return d[1][0]}));
            console.log(v_lst);
            // console.log(new_dataset[0][1][0].Longitude);
            let min_range = 1;
            let max_range = 18;
            var max_v = Math.max(...v_lst);
            var min_v = Math.min(...v_lst);
            var log_s = d3.scaleLog()
                .domain([min_v, max_v])
                .range([min_range, max_range]);
            var Tooltip = d3.select("#q4_plot")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("position", "absolute")
            svg1.selectAll("cricle") 
            .data(c_by_c)
            .enter()
            .append("circle")
            .attr("cx", function (d) {return projection2([d[1][2], d[1][1]])[0]; } ) 
            .attr("cy", function (d) {return projection2([d[1][2], d[1][1]])[1]; } ) 
            .attr("r", function(d) {return log_s(d[1][0])})//log_s(v_lst[k_lst.indexOf(d[0])]);})
            //.attr("class", "center_plot")
            .style('fill', '#4E1B18')
            .attr('stroke','#64442D')
            .attr('fill-opacity', 0.5)
            .on("mouseover", function(e, d){
                //console.log(d);
                Tooltip.transition().duration(50).style("opacity", 0.9);
                                //create method chain for tooltip
                        d3.select(this)
                            .style("stroke", "black")
                            .style("stroke-width", 3)
                            .style("opacity", 1)
                })
                .on("mousemove", function (e, d) {
                        //create method chain for tooltip
                        //console.log(e);
                        Tooltip .html(d[1][0]+" out of "+num_excellent_bar+" excellent chocolate bars were made of beans originated from "+d[0])
                                .style("left", (e.pageX+70) + "px")
                                .style("top", (e.pageY) + "px")
                                
                    })
                .on("mouseout", function (e, d) {
                        //create method chain for tooltip
                        Tooltip.transition().duration(50).style("opacity", 0);
                        d3.select(this)
                        .style("stroke-width", 1)
                        .style("opacity", 1)
                    });
            let padding = 20;
            let padding22 = 60
            svg1.append("text")
                .attr("x", width/2)
                .attr("y", padding)
                .attr("text-anchor", "middle")
                .style("font-size", "21px")
                .text("Bean Origins of Excellent Chocolate Bars World Map")
                .style("font-family", 'Chalkduster')
                .style("fill", "#64442D");
            svg1.append("text")
                .attr("x", width/2)
                .attr("y", padding22)
                .attr("text-anchor", "middle")
                .style("font-size", "17px")
                .text("Feel free to navigate the map by moving your cursor on each circle!")
                .style("font-family", 'Chalkduster')
                .style("fill", "#eb95a9");
            var linearSize = d3.scaleLinear()
                               .domain([min_v,max_v])
                               .range([min_range, max_range]);
            svg1.append("g")
                .attr("class", "legendSize")
                .attr("transform", "translate(610, 100)");
            let l_padding = 25
            var legendSize = d3.legendSize()
                .scale(linearSize)
                .shape('circle')
                .shapePadding(l_padding)
                .labelOffset(15)
                .orient('horizontal');
              
            svg1.select(".legendSize")
                .call(legendSize)
                .style('fill', '#4E1B18')
                .attr('stroke','#64442D')
                .attr('fill-opacity', 0.5);
        });
    })
}

