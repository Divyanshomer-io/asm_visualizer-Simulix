
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BiasVarianceParams, BiasVarianceState, generatePlotX, trueFunction } from '@/utils/biasVariance';
import * as d3 from 'd3';

interface BiasVarianceVisualizationProps {
  params: BiasVarianceParams;
  state: BiasVarianceState;
}

const BiasVarianceVisualization: React.FC<BiasVarianceVisualizationProps> = ({
  params,
  state
}) => {
  const functionSpaceRef = useRef<SVGSVGElement>(null);
  const errorDecompositionRef = useRef<SVGSVGElement>(null);
  const tradeoffCurveRef = useRef<SVGSVGElement>(null);

  // Function Space Plot
  useEffect(() => {
    if (!functionSpaceRef.current || state.predictions.length === 0) return;

    const svg = d3.select(functionSpaceRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    const xPlot = generatePlotX();
    const trueValues = xPlot.map(trueFunction);

    const xScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent([...trueValues, ...state.predictions.flat()]) as [number, number])
      .nice()
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("x");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("y");

    const line = d3.line<number>()
      .x((_, i) => xScale(xPlot[i]))
      .y(d => yScale(d))
      .curve(d3.curveCardinal);

    // Draw individual predictions (gray, low opacity)
    const visiblePredictions = state.predictions.slice(0, state.currentIteration);
    visiblePredictions.forEach(pred => {
      g.append("path")
        .datum(pred)
        .attr("d", line)
        .style("stroke", "rgba(128, 128, 128, 0.1)")
        .style("stroke-width", 1)
        .style("fill", "none");
    });

    // Draw true function (black dashed)
    g.append("path")
      .datum(trueValues)
      .attr("d", line)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5")
      .style("fill", "none");

    // Draw mean prediction (red)
    if (state.meanPrediction.length > 0) {
      g.append("path")
        .datum(state.meanPrediction)
        .attr("d", line)
        .style("stroke", "#ef4444")
        .style("stroke-width", 3)
        .style("fill", "none");
    }

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - 150}, 20)`);

    const legendItems = [
      { label: "True function", color: "white", dasharray: "5,5" },
      { label: "Mean prediction", color: "#ef4444", dasharray: "none" },
      { label: "Individual models", color: "rgba(128, 128, 128, 0.3)", dasharray: "none" }
    ];

    legendItems.forEach((item, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .style("stroke", item.color)
        .style("stroke-width", 2)
        .style("stroke-dasharray", item.dasharray);

      legendRow.append("text")
        .attr("x", 25)
        .attr("y", 5)
        .style("fill", "white")
        .style("font-size", "12px")
        .text(item.label);
    });

  }, [state.predictions, state.meanPrediction, state.currentIteration]);

  // Error Decomposition Plot
  useEffect(() => {
    if (!errorDecompositionRef.current || state.errorDecomposition.bias.length === 0) return;

    const svg = d3.select(errorDecompositionRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    const xPlot = generatePlotX();

    const xScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(state.errorDecomposition.total) || 1])
      .nice()
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("x");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("Error");

    const line = d3.line<number>()
      .x((_, i) => xScale(xPlot[i]))
      .y(d => yScale(d))
      .curve(d3.curveCardinal);

    // Draw error components
    const errorComponents = [
      { data: state.errorDecomposition.bias, color: "#22c55e", label: "Bias²" },
      { data: state.errorDecomposition.variance, color: "#3b82f6", label: "Variance" },
      { data: state.errorDecomposition.noise, color: "#eab308", label: "Noise" },
      { data: state.errorDecomposition.total, color: "#ef4444", label: "Total Error" }
    ];

    errorComponents.forEach(component => {
      g.append("path")
        .datum(component.data)
        .attr("d", line)
        .style("stroke", component.color)
        .style("stroke-width", 2)
        .style("fill", "none");
    });

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - 120}, 20)`);

    errorComponents.forEach((component, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .style("stroke", component.color)
        .style("stroke-width", 2);

      legendRow.append("text")
        .attr("x", 25)
        .attr("y", 5)
        .style("fill", "white")
        .style("font-size", "12px")
        .text(component.label);
    });

  }, [state.errorDecomposition]);

  // Bias-Variance Tradeoff Curve
  useEffect(() => {
    if (!tradeoffCurveRef.current || state.tradeoffData.degrees.length === 0) return;

    const svg = d3.select(tradeoffCurveRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    const xScale = d3.scaleLinear()
      .domain([1, 15])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max([...state.tradeoffData.bias, ...state.tradeoffData.variance, ...state.tradeoffData.total]) || 1])
      .nice()
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("Model Complexity (Degree)");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("Error");

    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal);

    // Draw tradeoff curves
    const curves = [
      { 
        data: state.tradeoffData.bias.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })), 
        color: "#22c55e", 
        label: "Bias²" 
      },
      { 
        data: state.tradeoffData.variance.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })), 
        color: "#3b82f6", 
        label: "Variance" 
      },
      { 
        data: state.tradeoffData.total.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })), 
        color: "#ef4444", 
        label: "Total Error" 
      }
    ];

    curves.forEach(curve => {
      g.append("path")
        .datum(curve.data)
        .attr("d", line)
        .style("stroke", curve.color)
        .style("stroke-width", 2)
        .style("fill", "none");
    });

    // Highlight current degree
    g.append("line")
      .attr("x1", xScale(params.degree))
      .attr("x2", xScale(params.degree))
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "white")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.7);

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - 100}, 20)`);

    curves.forEach((curve, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .style("stroke", curve.color)
        .style("stroke-width", 2);

      legendRow.append("text")
        .attr("x", 25)
        .attr("y", 5)
        .style("fill", "white")
        .style("font-size", "12px")
        .text(curve.label);
    });

  }, [state.tradeoffData, params.degree]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="function-space" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="function-space">Function Space</TabsTrigger>
          <TabsTrigger value="error-decomposition">Error Decomposition</TabsTrigger>
          <TabsTrigger value="tradeoff-curve">Bias-Variance Tradeoff</TabsTrigger>
        </TabsList>

        <TabsContent value="function-space">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Function Space Visualization</CardTitle>
              <p className="text-sm opacity-70">
                Individual model predictions (gray), mean prediction (red), and true function (white dashed)
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <svg
                  ref={functionSpaceRef}
                  width={600}
                  height={400}
                  className="w-full"
                  style={{ minWidth: '600px' }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error-decomposition">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Error Decomposition</CardTitle>
              <p className="text-sm opacity-70">
                Breakdown of prediction error into bias², variance, and irreducible noise
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <svg
                  ref={errorDecompositionRef}
                  width={600}
                  height={400}
                  className="w-full"
                  style={{ minWidth: '600px' }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tradeoff-curve">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Bias-Variance Tradeoff Curve</CardTitle>
              <p className="text-sm opacity-70">
                How bias and variance change with model complexity. Vertical line shows current degree.
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <svg
                  ref={tradeoffCurveRef}
                  width={600}
                  height={400}
                  className="w-full"
                  style={{ minWidth: '600px' }}
                />
              </div>
              {state.isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white">Computing tradeoff curve...</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiasVarianceVisualization;
