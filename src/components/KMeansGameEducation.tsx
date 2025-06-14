
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { Target, TrendingDown, Award, BookOpen, Lightbulb, Zap } from "lucide-react";

interface KMeansGameEducationProps {
  k: number;
  cities: {x: number, y: number, name: string, population: number}[];
  clusters: {center: {x: number, y: number}, cities: number[], color: string}[];
  iteration: number;
  convergenceData: {iteration: number, wcss: number}[];
  gameLevel: number;
}

const KMeansGameEducation: React.FC<KMeansGameEducationProps> = ({
  k,
  cities,
  clusters,
  iteration,
  convergenceData,
  gameLevel,
}) => {
  const getGameTip = () => {
    if (cities.length === 0) {
      return {
        icon: <Target className="h-4 w-4" />,
        title: "Getting Started",
        content: "Click on the map to place cities. Try to create interesting patterns!",
        type: "info"
      };
    }
    
    if (cities.length < k) {
      return {
        icon: <Target className="h-4 w-4" />,
        title: "Need More Cities",
        content: `You need at least ${k} cities to run K-means clustering with K=${k}.`,
        type: "warning"
      };
    }
    
    if (clusters.length === 0) {
      return {
        icon: <Zap className="h-4 w-4" />,
        title: "Ready to Cluster",
        content: "Great! You have enough cities. Click 'Start' to begin K-means clustering.",
        type: "success"
      };
    }
    
    if (iteration < 5) {
      return {
        icon: <TrendingDown className="h-4 w-4" />,
        title: "Algorithm Running",
        content: "Watch how centroids move to minimize the distance to their assigned cities.",
        type: "info"
      };
    }
    
    return {
      icon: <Award className="h-4 w-4" />,
      title: "Optimization in Progress",
      content: "The algorithm is converging! Lower WCSS means better clustering.",
      type: "success"
    };
  };

  const tip = getGameTip();
  
  return (
    <div className="space-y-4">
      {/* Current Game Tip */}
      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {tip.icon}
            {tip.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{tip.content}</p>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-purple-400" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Level {gameLevel}</span>
            <Badge variant="outline" className="text-purple-400 border-purple-400/50">
              {gameLevel < 5 ? 'Beginner' : gameLevel < 10 ? 'Expert' : 'Master'}
            </Badge>
          </div>
          <Progress value={(gameLevel % 5) * 20} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete efficient clusterings to level up!
          </p>
        </CardContent>
      </Card>

      {/* Convergence Chart */}
      {convergenceData.length > 1 && (
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-400" />
              Convergence Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={convergenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="iteration" 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={10}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wcss" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* K-Means Concepts */}
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-blue-400" />
            K-Means Concepts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">K={k}</Badge>
              <span className="text-xs">Number of clusters to find</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">WCSS</Badge>
              <span className="text-xs">Within-Cluster Sum of Squares</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Centroids</Badge>
              <span className="text-xs">Center points of clusters</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Goal:</strong> Group cities into {k} clusters by minimizing distances.</p>
            <p><strong>Process:</strong> Assign → Update → Repeat until convergence.</p>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Tips */}
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            Strategy Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Place cities in distinct groups for better clustering results</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Choose K based on the natural number of city groups</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Watch how centroids move toward the center of their clusters</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Lower WCSS values indicate better clustering quality</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KMeansGameEducation;
