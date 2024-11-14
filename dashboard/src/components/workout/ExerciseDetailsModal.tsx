import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Modal, 
  ModalContent, 
  Button, 
  Tabs, 
  Tab, 
  Card, 
  Chip, 
  Avatar, 
  cn 
} from "@nextui-org/react";
import { 
  Info, 
  Activity, 
  Video, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Target, 
  Trophy, 
  Medal, 
  AlertTriangle, 
  Dumbbell, 
  Flame, 
  ScrollText, 
  TrendingUp,
  Clock,
  Heart,
  BedDouble,
  Bath,
  Waves,
  CloudMoon,
  Pizza,
  Gamepad2,
  Music2,
  RefreshCcw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { ExerciseDetailsModalProps } from '@/types';
import { useSafeImageLoading } from '@/hooks/useSafeImageLoading';
import React from "react";

export const ExerciseDetailsModal = React.memo(({
  isOpen,
  onClose,
  exercise,
  details,
  performance,
}: ExerciseDetailsModalProps) => {
  // State management
  const [selectedTab, setSelectedTab] = useState("overview");
  const [imageIndex, setImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Refs
  const isMounted = useRef(true);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Image configuration
  const images = useMemo(() => [
    {
      url: details.starting,
      label: "Starting Position",
    },
    {
      url: details.ending,
      label: "Ending Position",
    },
  ], [details.starting, details.ending]);

  // Use safe image loading for both images
  const { isLoading: isStartingLoading } = useSafeImageLoading(details.starting);
  const { isLoading: isEndingLoading } = useSafeImageLoading(details.ending);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (isMounted.current) {
        setImageIndex(0);
        setIsPlaying(false);
        setIsVideoLoaded(false);
        setShowVideo(false);
        setSelectedTab("overview");
      }
      
      // Clean up video iframes
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    }
  }, [isOpen]);

  // Handle autoplay for images
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && isPlaying && selectedTab === "overview") {
      interval = setInterval(() => {
        if (isMounted.current) {
          setImageIndex(prev => (prev === 0 ? 1 : 0));
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isPlaying, selectedTab]);

  // Memoize chart data preparation
  const chartData = useMemo(() => {
    if (!performance) return [];
    
    return [...performance]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10)
      .map(p => ({
        date: p.date,
        weight: p.weight,
        reps: p.reps,
      }));
  }, [performance]);

  // Calculate Y-axis domain
  const yAxisDomain = useMemo(() => {
    if (!chartData.length) return [0, 100];
    
    const weights = chartData.map(d => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = (max - min) * 0.1;
    
    return [
      Math.max(0, Math.floor(min - padding)),
      Math.ceil(max + padding)
    ];
  }, [chartData]);

  // Video loading management
  useEffect(() => {
    if (!isOpen || selectedTab !== 'video') {
      if (isMounted.current) {
        setShowVideo(false);
        setIsVideoLoaded(false);
      }
    }
  }, [isOpen, selectedTab]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (selectedTab === 'video' && !showVideo) {
      timeoutId = setTimeout(() => {
        if (isMounted.current) {
          setShowVideo(true);
        }
      }, 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedTab, showVideo]);

  // Event handlers
  const handleTabChange = useCallback((key: React.Key) => {
    if (isMounted.current) {
      setSelectedTab(key.toString());
    }
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (isMounted.current) {
      setIsPlaying(prev => !prev);
    }
  }, []);

  const handleImageChange = useCallback((direction: 'next' | 'prev') => {
    if (isMounted.current) {
      setImageIndex(prev => direction === 'next' ? 
        (prev === 1 ? 0 : 1) : 
        (prev === 0 ? 1 : 0)
      );
    }
  }, []);

  const handleVideoLoad = useCallback(() => {
    if (isMounted.current) {
      setIsVideoLoaded(true);
    }
  }, []);

  // Memoized components
  const QuickStatChip = useCallback(({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: any; 
    label: string; 
    value: string 
  }) => (
    <Chip
      startContent={<Icon size={14} />}
      className="bg-content-secondary/30 h-auto py-2 px-4 min-w-full"
      size="md"
    >
      <div className="flex flex-col items-start">
        <span className="text-xs text-foreground/60">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </Chip>
  ), []);

  const ExerciseImage: React.FC<{
    src: string;
    alt: string;
    onLoad?: () => void;
  }> = ({ src, alt, onLoad }) => {
    const { isLoading, error, retry } = useSafeImageLoading(src, onLoad);
  
    if (isLoading) {
      return (
        <div className="w-full h-[40vh] flex items-center justify-center bg-content2/20">
          <div className="w-8 h-8 rounded-full border-2 border-primary animate-spin border-t-transparent" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="w-full h-[40vh] flex flex-col items-center justify-center bg-content2/20">
          <div className="text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-warning mx-auto" />
            <div className="space-y-1">
              <p className="text-sm text-warning font-medium">Failed to load image</p>
              <p className="text-xs text-warning/60">The image might be unavailable or corrupted</p>
            </div>
            <Button
              size="sm"
              variant="flat"
              color="warning"
              onPress={retry}
              startContent={<RefreshCcw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }
  
    return (
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain mx-auto max-h-[40vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://bitsofco.de/img/Qo5mfYDE5v-350.png';
        }}
      />
    );
  };

  // Memoized tab configurations
  const tabs = useMemo(() => [
    {
      key: "overview",
      icon: Info,
      label: "Overview",
    },
    {
      key: "performance",
      icon: Activity,
      label: "Performance",
    },
    ...(details.video ? [{
      key: "video",
      icon: Video,
      label: "Video",
    }] : []),
  ], [details.video]);

  return (
    <Modal
      size="full"
      radius="lg"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-white/50 dark:bg-black/50"
      backdrop="blur"
      classNames={{
        base: "h-[100dvh] max-h-[100dvh] will-change-transform",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        {/* Full modal content layout */}
        <div className="flex flex-col h-[100dvh]">
          {/* Fixed Header */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md pb-2">
            <div className="px-4 py-3 flex items-center">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <Avatar 
                  isBordered 
                  color="secondary" 
                  src={images[0].url}
                  className="flex-shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold truncate">
                    {exercise.ref}
                  </h2>
                  <p className="text-sm text-foreground/60 truncate">
                    {details.primary_muscle}
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={onClose}
                  className="flex-shrink-0 ml-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="px-4 flex justify-center">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
                color="secondary"
                variant="solid"
                radius="full"
                classNames={{
                  tabList: "bg-content-secondary/60",
                  cursor: "w-full",
                }}
              >
                {tabs.map(({ key, icon: Icon, label }) => (
                  <Tab
                    key={key}
                    title={
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </div>
                    }
                  />
                ))}
              </Tabs>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Image Section */}
                  <div className="relative bg-black">
                    <ExerciseImage
                      src={images[imageIndex].url}
                      alt={images[imageIndex].label}
                      onLoad={() => {
                        if (isMounted.current) {
                          // Handle successful load
                        }
                      }}
                    />

                    {/* Image Controls */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-background/10 backdrop-blur-md"
                            onPress={() => handleImageChange('prev')}
                          >
                            <ChevronLeft className="w-4 h-4 text-white" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-background/10 backdrop-blur-md"
                            onPress={handlePlayToggle}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-background/10 backdrop-blur-md"
                            onPress={() => handleImageChange('next')}
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                        <span className="text-sm text-white/90 bg-background/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          {images[imageIndex].label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <QuickStatChip
                        icon={Dumbbell}
                        label="Equipment"
                        value={details.equipment || "Bodyweight"}
                      />
                      <QuickStatChip
                        icon={Target}
                        label="Force Type"
                        value={details.force}
                      />
                      <QuickStatChip
                        icon={Clock}
                        label="Rest"
                        value={`${exercise.rest}s`}
                      />
                      <QuickStatChip
                        icon={Activity}
                        label="Type"
                        value={details.mechanic || "Compound"}
                      />
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <ScrollText className="w-5 h-5 text-secondary-500" />
                        Instructions
                      </h4>
                      <Card className="p-4 bg-content-secondary/70">
                        <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                          {details.instructions}
                        </p>
                      </Card>
                    </div>

                    {/* Muscles Grid */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Flame className="w-5 h-5 text-secondary-500" />
                        Muscles Worked
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        <Chip
                          className="h-auto py-2"
                          startContent={<Target size={14} />}
                          color="secondary"
                          variant="solid"
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{details.primary_muscle}</span>
                          </div>
                        </Chip>
                        {details.secondary_muscles?.map((muscle, index) => (
                          <Chip
                            className="h-auto py-2"
                            key={index}
                            variant="faded"
                            color="secondary"
                            startContent={<Activity size={14} />}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{muscle.muscle}</span>
                            </div>
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedTab === "performance" && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 space-y-6"
                >
                  {performance && performance.length > 0 ? (
                    <>
                      {/* Performance Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card isBlurred className="p-4 bg-primary-500 border-none">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary-500">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60">Personal Best</p>
                              <p className="text-2xl font-bold text-white">
                                {Math.max(...performance.map(p => p.weight))} kg
                              </p>
                              <p className="text-xs text-white/60">
                                {performance.find(p => p.weight === Math.max(...performance.map(p => p.weight)))?.date}
                              </p>
                            </div>
                          </div>
                        </Card>

                        <Card isBlurred className="p-4 bg-secondary-500 border-none">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary-500">
                              <Medal className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60">Most Reps</p>
                              <p className="text-2xl font-bold text-white">
                                {Math.max(...performance.map(p => p.reps))}
                              </p>
                              <p className="text-xs text-white/60">
                                {performance.find(p => p.reps === Math.max(...performance.map(p => p.reps)))?.date}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Performance Chart */}
                      <Card isBlurred className="p-4 border-none bg-content-secondary/70">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary-500" />
                          Progress Chart
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                                domain={yAxisDomain}
                                padding={{ top: 20, bottom: 20 }}
                              />
                              <Tooltip
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-background/95 backdrop-blur-md p-2 rounded-lg border border-content/10">
                                        <p className="text-sm">{new Date(label).toLocaleDateString()}</p>
                                        <p className="text-sm font-medium text-primary-500">
                                          {payload[0].value} kg × {payload[0].payload.reps} reps
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#7828c8"
                                strokeWidth={2}
                                dot={{ fill: "#7828c8", strokeWidth: 2 }}
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>

                      {/* Recent History */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold">Recent History</h4>
                        <div className="space-y-2">
                          {[...performance].sort((a, b) => 
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                          ).slice(0, 5).map((perf, index) => (
                            <Card
                              key={index}
                              className="bg-content-secondary/30 border-none"
                            >
                              <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-secondary-500/10">
                                    <Dumbbell className="w-4 h-4 text-secondary-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {perf.weight} kg × {perf.reps} reps
                                    </p>
                                    <p className="text-sm text-foreground/60">
                                      {new Date(perf.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {index === 0 && (
                                  <Chip
                                    size="sm"
                                    variant="shadow"
                                    color="success"
                                    startContent={<Activity size={14} />}
                                  >
                                    Latest
                                  </Chip>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 rounded-full bg-secondary-500/10 mb-4">
                        <Activity className="w-8 h-8 text-secondary-500" />
                      </div>
                      <p className="text-lg font-semibold">No Performance Data</p>
                      <p className="text-foreground/60 mt-2">
                        Start logging your sets to track your progress
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {selectedTab === "video" && details.video && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 space-y-6"
                >
                  <Card className="w-full aspect-video overflow-hidden border-none">
                    {showVideo ? (
                      <div className="relative w-full h-full">
                        {!isVideoLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-content/5">
                            <div className="w-8 h-8 rounded-full border-2 border-primary animate-spin border-t-transparent" />
                          </div>
                        )}
                        <iframe
                          ref={videoRef}
                          className={cn(
                            "w-full h-full",
                            !isVideoLoaded && "opacity-0"
                          )}
                          src={details.video}
                          title={`${exercise.ref} demonstration`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={handleVideoLoad}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-content/5">
                        <Video className="w-8 h-8 text-content/40" />
                      </div>
                    )}
                  </Card>

                  <Card className="p-4 bg-warning-500/10 border-none">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-warning-500">Video Guide</p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Watch the demonstration video to learn proper form and technique.
                          Pay attention to movement patterns and key positions.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Reference */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold">Quick Reference</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="p-4 border-none">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-success-500/10">
                            <Target className="w-4 h-4 text-success-500" />
                          </div>
                          <div>
                            <p className="font-medium">Key Points</p>
                            <ul className="text-sm text-foreground/70 mt-2 space-y-1 list-disc list-inside">
                              <li>Maintain proper form throughout</li>
                              <li>Control the movement</li>
                              <li>Focus on muscle engagement</li>
                              <li>Keep proper breathing pattern</li>
                            </ul>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-none">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-danger-500/10">
                            <AlertTriangle className="w-4 h-4 text-danger-500" />
                          </div>
                          <div>
                            <p className="font-medium">Common Mistakes</p>
                            <ul className="text-sm text-foreground/70 mt-2 space-y-1 list-disc list-inside">
                              <li>Using momentum</li>
                              <li>Incorrect positioning</li>
                              <li>Going too heavy too soon</li>
                              <li>Rushing the movement</li>
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
});

ExerciseDetailsModal.displayName = 'ExerciseDetailsModal';