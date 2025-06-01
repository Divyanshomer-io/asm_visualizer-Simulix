
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const learningCurveRef = useRef<SVGSVGElement>(null);
  const convergenceHistoryRef = useRef<SVGSVGElement>(null);

  // Function Space Plot
  useEffect(() => {
    if (!functionSpaceRef.current || state.predictions.length === 0) return;

    const svg = d3.select(functionSpaceRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const xPlot = generatePlotX();
    const trueValues = xPlot.map(trueFunction);

    const xScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-2, 3])
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

    // Draw individual predictions up to current iteration
    const visiblePredictions = state.predictions.slice(0, state.currentIteration);
    visiblePredictions.forEach((pred, i) => {
      const alpha = Math.max(0.1, 0.5 * (i + 1) / state.currentIteration);
      g.append("path")
        .datum(pred)
        .attr("d", line)
        .style("stroke", "rgba(128, 128, 128, " + alpha + ")")
        .style("stroke-width", 0.5)
        .style("fill", "none");
    });

    // Calculate and draw mean prediction for current iteration
    if (state.currentIteration > 0) {
      const meanPred = xPlot.map((_, j) => {
        const sum = visiblePredictions.reduce((acc, pred) => acc + pred[j], 0);
        return sum / visiblePredictions.length;
      });

      g.append("path")
        .datum(meanPred)
        .attr("d", line)
        .style("stroke", "#ef4444")
        .style("stroke-width", 3)
        .style("fill", "none");
    }

    // Draw true function (white dashed)
    g.append("path")
      .datum(trueValues)
      .attr("d", line)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5")
      .style("fill", "none");

  }, [state.predictions, state.currentIteration]);

  // Error Decomposition Plot
  useEffect(() => {
    if (!errorDecompositionRef.current || state.predictions.length === 0 || state.currentIteration === 0) return;

    const svg = d3.select(errorDecompositionRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const xPlot = generatePlotX();
    const yTrue = xPlot.map(trueFunction);

    // Calculate mean prediction for current iteration
    const visiblePredictions = state.predictions.slice(0, state.currentIteration);
    const meanPred = xPlot.map((_, j) => {
      const sum = visiblePredictions.reduce((acc, pred) => acc + pred[j], 0);
      return sum / visiblePredictions.length;
    });

    // Calculate error components
    const biasSq = meanPred.map((m, i) => Math.pow(m - yTrue[i], 2));
    const variance = xPlot.map((_, j) => {
      const preds = visiblePredictions.map(pred => pred[j]);
      const mean = preds.reduce((a, b) => a + b) / preds.length;
      return preds.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / preds.length;
    });
    const noiseComponent = Array(xPlot.length).fill(params.noise * params.noise);
    const totalError = biasSq.map((b, i) => b + variance[i] + noiseComponent[i]);

    const xScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(totalError) || 1])
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
    g.append("path")
      .datum(biasSq)
      .attr("d", line)
      .style("stroke", "#22c55e")
      .style("stroke-width", 2)
      .style("fill", "none");

    g.append("path")
      .datum(variance)
      .attr("d", line)
      .style("stroke", "#ef4444")
      .style("stroke-width", 2)
      .style("fill", "none");

    g.append("path")
      .datum(totalError)
      .attr("d", line)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .style("fill", "none");

    // Irreducible error (horizontal line)
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(params.noise * params.noise))
      .attr("y2", yScale(params.noise * params.noise))
      .style("stroke", "#eab308")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "3,3");

  }, [state.predictions, state.currentIteration, params.noise]);

  // Bias-Variance Tradeoff Curve
  useEffect(() => {
    if (!tradeoffCurveRef.current || state.tradeoffData.degrees.length === 0) return;

    const svg = d3.select(tradeoffCurveRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 250 - margin.bottom - margin.top;

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
        color: "#ef4444", 
        label: "Variance" 
      },
      { 
        data: state.tradeoffData.total.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })), 
        color: "white", 
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
      .style("stroke", "#3b82f6")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.7);

  }, [state.tradeoffData, params.degree]);

  // Learning Curve
  useEffect(() => {
    if (!learningCurveRef.current) return;

    const svg = d3.select(learningCurveRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add placeholder text
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text("Learning Curve");

  }, []);

  // Convergence History
  useEffect(() => {
    if (!convergenceHistoryRef.current || state.currentIteration <= 1) {
      if (convergenceHistoryRef.current) {
        const svg = d3.select(convergenceHistoryRef.current);
        svg.selectAll("*").remove();
        const g = svg.append("g").attr("transform", "translate(50,20)");
        g.append("text")
          .attr("x", 150)
          .attr("y", 90)
          .style("text-anchor", "middle")
          .style("fill", "white")
          .text("Convergence History (Need >1 iteration)");
      }
      return;
    }

    const svg = d3.select(convergenceHistoryRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const xPlot = generatePlotX();
    const yTrue = xPlot.map(trueFunction);

    const iterations: number[] = [];
    const biasHistory: number[] = [];
    const varianceHistory: number[] = [];

    // Calculate bias and variance for each iteration from 2 to current
    for (let iter = 2; iter <= state.currentIteration; iter++) {
      const visiblePreds = state.predictions.slice(0, iter);
      const meanPred = xPlot.map((_, j) => {
        const sum = visiblePreds.reduce((acc, pred) => acc + pred[j], 0);
        return sum / visiblePreds.length;
      });

      const avgBias = meanPred.reduce((acc, m, i) => 
        acc + Math.pow(m - yTrue[i], 2), 0) / meanPred.length;
      
      const avgVar = xPlot.reduce((acc, _, j) => {
        const preds = visiblePreds.map(pred => pred[j]);
        const mean = preds.reduce((a, b) => a + b) / preds.length;
        return acc + preds.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / preds.length;
      }, 0) / xPlot.length;

      iterations.push(iter);
      biasHistory.push(avgBias);
      varianceHistory.push(avgVar);
    }

    const xScale = d3.scaleLinear()
      .domain([2, state.currentIteration])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...biasHistory, ...varianceHistory)])
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
      .text("Iterations");

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

    // Bias history (GREEN)
    g.append("path")
      .datum(biasHistory.map((y, i) => ({ x: iterations[i], y })))
      .attr("d", line)
      .style("stroke", "#22c55e")
      .style("stroke-width", 2)
      .style("fill", "none");

    // Variance history (RED)
    g.append("path")
      .datum(varianceHistory.map((y, i) => ({ x: iterations[i], y })))
      .attr("d", line)
      .style("stroke", "#ef4444")
      .style("stroke-width", 2)
      .style("fill", "none");

  }, [state.predictions, state.currentIteration]);

  return (
    <div className="visualization-grid">
      {/* Function Space Plot */}
      <Card className="glass-panel plot-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Function Space</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <svg
            ref={functionSpaceRef}
            width={400}
            height={300}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Error Decomposition Plot */}
      <Card className="glass-panel plot-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Error Decomposition</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <svg
            ref={errorDecompositionRef}
            width={400}
            height={300}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Bias-Variance Tradeoff Curve (spans 2 columns) */}
      <Card className="glass-panel plot-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bias-Variance Tradeoff</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <svg
            ref={tradeoffCurveRef}
            width={800}
            height={250}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Learning Curve */}
      <Card className="glass-panel plot-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Learning Curve</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <svg
            ref={learningCurveRef}
            width={400}
            height={200}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Convergence History */}
      <Card className="glass-panel plot-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Convergence History</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <svg
            ref={convergenceHistoryRef}
            width={400}
            height={200}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Card className="glass-panel plot-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Current Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="opacity-70">Current Iteration:</span>
              <div className="font-mono text-blue-400">{state.currentIteration}/50</div>
            </div>
            <div>
              <span className="opacity-70">Model Degree:</span>
              <div className="font-mono text-white">{params.degree}</div>
            </div>
            <div>
              <span className="opacity-70">Noise Level:</span>
              <div className="font-mono text-yellow-400">{params.noise.toFixed(2)}</div>
            </div>
            <div>
              <span className="opacity-70">Sample Size:</span>
              <div className="font-mono text-green-400">{params.samples}</div>
            </div>
          </div>
          
          {state.currentIteration > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs opacity-70">Legend:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Bias²</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-red-500"></div>
                  <span>Variance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-white"></div>
                  <span>Total Error</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-yellow-500 border-dotted"></div>
                  <span>Noise</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BiasVarianceVisualization;
