
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BiasVarianceParams, BiasVarianceState, generatePlotX, trueFunction, generateData, trainPolynomialModel, predict } from '@/utils/biasVariance';
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

  // CRITICAL: Function Space Plot - Complete Rewrite
  useEffect(() => {
    if (!functionSpaceRef.current || state.predictions.length === 0) return;

    const svg = d3.select(functionSpaceRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // CRITICAL: Generate X plot points (-1 to 1, exactly 100 points)
    const xPlot = generatePlotX();
    const yTrue = xPlot.map(trueFunction);

    // MANDATORY: Set up proper scales
    const xScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-2, 3]) // FIXED: Proper Y domain
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

    // CRITICAL: Show individual model predictions (gray lines)
    for (let i = 0; i < state.currentIteration; i++) {
      const alpha = Math.max(0.1, 0.7 * (i + 1) / state.currentIteration);
      
      g.append("path")
        .datum(state.predictions[i])
        .attr("d", line)
        .style("stroke", "gray")
        .style("stroke-opacity", alpha)
        .style("stroke-width", 0.5)
        .style("fill", "none");
    }

    // CRITICAL: Calculate and show mean prediction (RED line)
    if (state.currentIteration > 0) {
      const meanPred = xPlot.map((_, j) => {
        const sum = state.predictions
          .slice(0, state.currentIteration)
          .reduce((acc, pred) => acc + pred[j], 0);
        return sum / state.currentIteration;
      });
      
      g.append("path")
        .datum(meanPred)
        .attr("d", line)
        .style("stroke", "red")
        .style("stroke-width", 2)
        .style("fill", "none");
    }

    // CRITICAL: Show true function (BLACK dashed)
    g.append("path")
      .datum(yTrue)
      .attr("d", line)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5")
      .style("fill", "none");

    // MANDATORY: Add training data points
    const { X: trainX, y: trainY } = generateData(params.samples, params.noise);
    g.selectAll(".data-point")
      .data(trainX)
      .enter().append("circle")
      .attr("cx", d => xScale(d))
      .attr("cy", (d, i) => yScale(trainY[i]))
      .attr("r", 3)
      .style("fill", "blue")
      .style("opacity", 0.6);

  }, [state.predictions, state.currentIteration, params]);

  // MANDATORY: Error Decomposition Plot - Mathematical Fix
  useEffect(() => {
    if (!errorDecompositionRef.current || state.predictions.length === 0 || state.currentIteration === 0) return;

    const svg = d3.select(errorDecompositionRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.bottom - margin.top;

    const xPlot = generatePlotX();
    const yTrue = xPlot.map(trueFunction);

    // CRITICAL: Calculate mean prediction correctly
    const meanPred = xPlot.map((_, j) => {
      const sum = state.predictions
        .slice(0, state.currentIteration)
        .reduce((acc, pred) => acc + pred[j], 0);
      return sum / state.currentIteration;
    });

    // MANDATORY: Calculate error components with proper math
    const biasSq = meanPred.map((m, i) => Math.pow(m - yTrue[i], 2));
    
    const variance = xPlot.map((_, j) => {
      const preds = state.predictions
        .slice(0, state.currentIteration)
        .map(pred => pred[j]);
      const mean = preds.reduce((a, b) => a + b) / preds.length;
      return preds.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / preds.length;
    });
    
    const noiseLevel = Math.pow(params.noise, 2);
    const totalError = biasSq.map((b, i) => b + variance[i] + noiseLevel);

    // CRITICAL: Use proper Y domain (no scientific notation)
    const maxError = Math.max(...totalError, ...biasSq, ...variance);
    const xScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, maxError * 1.1]) // FIXED: Proper scaling
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

    // MANDATORY: Draw all error components
    const lineGenerator = d3.line<number>()
      .x((_, i) => xScale(xPlot[i]))
      .y(d => yScale(d))
      .curve(d3.curveCardinal);

    // Bias² (GREEN)
    g.append("path")
      .datum(biasSq)
      .attr("d", lineGenerator)
      .style("stroke", "green")
      .style("stroke-width", 2)
      .style("fill", "none");
      
    // Variance (RED)
    g.append("path")
      .datum(variance)
      .attr("d", lineGenerator)
      .style("stroke", "red")
      .style("stroke-width", 2)
      .style("fill", "none");
      
    // Total Error (BLACK)
    g.append("path")
      .datum(totalError)
      .attr("d", lineGenerator)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("fill", "none");
      
    // Irreducible Error (ORANGE horizontal line)
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(noiseLevel))
      .attr("y2", yScale(noiseLevel))
      .style("stroke", "orange")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "3,3");

  }, [state.predictions, state.currentIteration, params]);

  // MANDATORY: Bias-Variance Tradeoff Curve - Complete Implementation
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
      .domain([0, Math.max(...state.tradeoffData.bias, ...state.tradeoffData.variance, ...state.tradeoffData.total)])
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

    const lineGenerator = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal);

    // MANDATORY: Draw the U-shaped curves
    // Bias² curve (GREEN)
    g.append("path")
      .datum(state.tradeoffData.bias.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "green")
      .style("stroke-width", 2)
      .style("fill", "none");
      
    // Variance curve (RED)  
    g.append("path")
      .datum(state.tradeoffData.variance.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "red")
      .style("stroke-width", 2)
      .style("fill", "none");
      
    // Total Error curve (BLACK)
    g.append("path")
      .datum(state.tradeoffData.total.map((y, i) => ({ x: state.tradeoffData.degrees[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("fill", "none");

    // Current degree marker (BLUE vertical line)
    g.append("line")
      .attr("x1", xScale(params.degree))
      .attr("x2", xScale(params.degree))
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "blue")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5");

  }, [state.tradeoffData, params.degree]);

  // MANDATORY: Learning Curve Implementation
  useEffect(() => {
    if (!learningCurveRef.current) return;

    const svg = d3.select(learningCurveRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const sampleSizes = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
    const trainErrors: number[] = [];
    const testErrors: number[] = [];

    const xTest = generatePlotX();
    const yTest = xTest.map(trueFunction);

    sampleSizes.forEach(size => {
      let avgTrainError = 0;
      let avgTestError = 0;
      const trials = 10;

      for (let trial = 0; trial < trials; trial++) {
        const { X: trainX, y: trainY } = generateData(size, params.noise);
        const model = trainPolynomialModel(trainX, trainY, params.degree);
        
        // Train error
        const trainPred = predict(model, trainX);
        const trainError = trainPred.reduce((acc, pred, i) => 
          acc + Math.pow(pred - trainY[i], 2), 0) / trainPred.length;
        avgTrainError += trainError;
        
        // Test error
        const testPred = predict(model, xTest);
        const testError = testPred.reduce((acc, pred, i) => 
          acc + Math.pow(pred - yTest[i], 2), 0) / testPred.length;
        avgTestError += testError;
      }

      trainErrors.push(avgTrainError / trials);
      testErrors.push(avgTestError / trials);
    });

    const xScale = d3.scaleLinear()
      .domain([20, 200])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...trainErrors, ...testErrors)])
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
      .text("Training Set Size");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("Error");

    const lineGenerator = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal);

    // Train error (BLUE)
    g.append("path")
      .datum(trainErrors.map((y, i) => ({ x: sampleSizes[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "blue")
      .style("stroke-width", 2)
      .style("fill", "none");
      
    // Test error (RED)
    g.append("path")
      .datum(testErrors.map((y, i) => ({ x: sampleSizes[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "red")
      .style("stroke-width", 2)
      .style("fill", "none");

  }, [params]);

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

    const lineGenerator = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal);

    // Bias history (GREEN)
    g.append("path")
      .datum(biasHistory.map((y, i) => ({ x: iterations[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "green")
      .style("stroke-width", 2)
      .style("fill", "none");

    // Variance history (RED)
    g.append("path")
      .datum(varianceHistory.map((y, i) => ({ x: iterations[i], y })))
      .attr("d", lineGenerator)
      .style("stroke", "red")
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
            width={500}
            height={350}
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
            width={500}
            height={350}
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
                  <div className="w-3 h-0.5 bg-black bg-white"></div>
                  <span>Total Error</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-orange-500 border-dotted"></div>
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
