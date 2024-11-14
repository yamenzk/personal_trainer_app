import React from 'react';
import { Card, Button, CardBody, CardHeader } from "@nextui-org/react";
import { RefreshCcw, AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WorkoutErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Workout Plan Error:', error, errorInfo);
  }

  handleRetry = () => {
    // Clear any cached images or state
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src.includes(window.location.origin)) {
        img.src = '';
        img.removeAttribute('src');
      }
    });

    // Clear any iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.src = '';
    });

    // Clear localStorage cache if needed
    localStorage.removeItem('workoutPlanCache');

    // Reset error state
    this.setState({ hasError: false, error: undefined });

    // Reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="max-w-md border-none shadow-2xl">
            <CardHeader className="flex gap-3 justify-center">
              <AlertCircle className="w-8 h-8 text-danger" />
              <p className="text-xl font-semibold">Something went wrong</p>
            </CardHeader>
            <CardBody className="text-center space-y-4">
              <p className="text-foreground/60">
                We encountered an unexpected error while loading your workout plan.
                Please try refreshing the page.
              </p>
              <Button
                color="primary"
                startContent={<RefreshCcw className="w-4 h-4" />}
                onPress={this.handleRetry}
                size="lg"
              >
                Reload Page
              </Button>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}