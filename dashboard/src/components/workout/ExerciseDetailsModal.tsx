import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { 
  Modal, 
  ModalContent, 
  Button, 
  Tabs, 
  Tab, 
  Card, 
  Chip, 
  Avatar
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
  Image as ImageIcon,
  RefreshCcw,
  Heart,
  LucideIcon
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
interface ExercisePerformance {
  date: string;
  weight: number;
  reps: number;
}

interface PerformanceStats {
  maxWeight: number;
  maxReps: number;
  maxWeightDate: string;
  maxRepsDate: string;
}

interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    ref: string;
    rest: number;
  };
  details: {
    starting: string;
    ending: string;
    equipment?: string;
    force: string;
    mechanic?: string;
    instructions: string;
    primary_muscle: string;
    secondary_muscles?: Array<{ muscle: string }>;
    video?: string;
    _videoUrl?: string;
  };
  performance?: ExercisePerformance[];
}

interface QuickStatChipProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface ExerciseImageProps {
  src: string;
  alt: string;
  onLoad?: () => void;
  aspectRatio: 'portrait' | 'landscape';
}

interface PerformanceChartProps {
  data: ExercisePerformance[];
  yAxisDomain: [number, number];
}

// Hooks
const useSafeImageLoading = (url: string, onLoad?: () => void) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('landscape');
  
  const handleLoad = useCallback((e: Event) => {
    const img = e.target as HTMLImageElement;
    setAspectRatio(img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape');
    setStatus('success');
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setStatus('error');
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [url, handleLoad, handleError]);

  const retry = useCallback(() => {
    setStatus('loading');
    const img = new Image();
    img.src = `${url}?retry=${new Date().getTime()}`;
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
  }, [url, handleLoad, handleError]);

  return { status, aspectRatio, retry };
};

// Memoized Components
const QuickStatChip = memo(({ 
  icon: Icon, 
  label, 
  value 
}: QuickStatChipProps) => (
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
));

QuickStatChip.displayName = 'QuickStatChip';

const ExerciseImage = memo(({
  src,
  alt,
  onLoad,
  aspectRatio
}: ExerciseImageProps) => {
  const { status, retry } = useSafeImageLoading(src, onLoad);

  if (status === 'loading') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-content2/20">
        <div className="w-8 h-8 rounded-full border-2 border-primary animate-spin border-t-transparent" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-content2/20">
        <AlertTriangle className="w-10 h-10 text-warning mb-2" />
        <p className="text-sm text-warning font-medium mb-4">Failed to load image</p>
        <Button
          size="sm"
          color="warning"
          onPress={retry}
          startContent={<RefreshCcw className="w-4 h-4" />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(
        "absolute inset-0 w-full h-full object-cover" // Always use object-cover
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.5,
        ease: "easeInOut"
      }}
    />
  );
});

ExerciseImage.displayName = 'ExerciseImage';

const PerformanceChart = memo(({ 
  data,
  yAxisDomain 
}: PerformanceChartProps) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value: string) => new Date(value || '').toLocaleDateString()}
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
                  <p className="text-sm">{new Date(label || '').toLocaleDateString()}</p>
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
));

PerformanceChart.displayName = 'PerformanceChart';

// Main Component
export const ExerciseDetailsModal = memo(
  ({
    isOpen,
    onClose,
    exercise,
    details,
    performance,
  }: ExerciseDetailsModalProps) => {
    // State management
    const [selectedTab, setSelectedTab] = useState<string>("overview");
    const [showImages, setShowImages] = useState<boolean>(true);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [videoAspectRatio, setVideoAspectRatio] = useState<
      "portrait" | "landscape"
    >("landscape");

    // Refs
    const isMounted = useRef<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playIntervalRef = useRef<NodeJS.Timeout>();

    // Memoized data
    const images = useMemo(
      () => [
        { url: details.starting, label: "Starting Position" },
        { url: details.ending, label: "Ending Position" },
      ],
      [details.starting, details.ending]
    );

    const tabs = useMemo(
      () => [
        { key: "overview", icon: Info, label: "Overview" },
        { key: "performance", icon: Activity, label: "Performance" },
        ...(details.video
          ? [{ key: "video", icon: Video, label: "Video" }]
          : []),
      ],
      [details.video]
    );

    // Performance data processing
    const { chartData, yAxisDomain, performanceStats } = useMemo(() => {
      if (!performance?.length) {
        return {
          chartData: [],
          yAxisDomain: [0, 100] as [number, number],
          performanceStats: null as PerformanceStats | null,
        };
      }

      const sortedData = [...performance]
        .sort(
          (a, b) =>
            new Date(a.date || "").getTime() - new Date(b.date || "").getTime()
        )
        .slice(-10);

      const weights = sortedData.map((d) => d.weight);
      const reps = sortedData.map((d) => d.reps);

      const maxWeight = Math.max(...weights);
      const maxReps = Math.max(...reps);
      const maxWeightDate =
        performance.find((p) => p.weight === maxWeight)?.date ?? "";
      const maxRepsDate =
        performance.find((p) => p.reps === maxReps)?.date ?? "";

      const min = Math.min(...weights);
      const max = Math.max(...weights);
      const padding = (max - min) * 0.1;

      return {
        chartData: sortedData,
        yAxisDomain: [
          Math.max(0, Math.floor(min - padding)),
          Math.ceil(max + padding),
        ] as [number, number],
        performanceStats: {
          maxWeight,
          maxReps,
          maxWeightDate,
          maxRepsDate,
        },
      };
    }, [performance]);

    // Cleanup effects
    useEffect(() => {
      return () => {
        isMounted.current = false;
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
        }
      };
    }, []);

    // Modal state reset
    useEffect(() => {
      if (!isOpen) {
        setImageIndex(0);
        setIsPlaying(false);
        setSelectedTab("overview");
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      } else {
        // Reset and start playing when modal opens
        setImageIndex(0);
        setIsPlaying(true);
        setShowImages(true);
      }
    }, [isOpen]);

    // Improved image autoplay management
    useEffect(() => {
      let intervalId: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;

      const switchImage = () => {
        setImageIndex((prev) => (prev === 0 ? 1 : 0));
      };

      if (isOpen && isPlaying && showImages) {
        // Initial switch after a delay
        timeoutId = setTimeout(() => {
          switchImage();
          // Start regular interval after the first switch
          intervalId = setInterval(switchImage, 1500);
        }, 500);
      }

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }, [isOpen, isPlaying, showImages]);

    // Event handlers
    const handleTabChange = useCallback((key: React.Key) => {
      setSelectedTab(key.toString());
    }, []);

    const handlePlayToggle = useCallback(() => {
      setIsPlaying((prev) => !prev);
    }, []);

    const handleImageChange = useCallback((direction: "next" | "prev") => {
      setImageIndex((prev) =>
        direction === "next" ? (prev === 1 ? 0 : 1) : prev === 0 ? 1 : 0
      );
    }, []);

    const handleMediaToggle = useCallback(() => {
      setShowImages((prev) => !prev);
      if (videoRef.current) {
        videoRef.current.src = videoRef.current.src;
      }
    }, []);

    

    // Render functions
    const renderMediaSection = useCallback(() => {
      const currentImage = images[imageIndex];

      return (
        <div className="relative w-full bg-black">
          {/* Background color wrapper */}
          <div className="w-full" style={{ aspectRatio: "16/9" }}>
            <AnimatePresence initial={false} mode="popLayout">
              {showImages ? (
                <motion.div
                  key="images"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <div className="absolute inset-0">
                    <AnimatePresence initial={false} mode="sync">
                      <ExerciseImage
                        key={imageIndex}
                        src={currentImage.url}
                        alt={currentImage.label}
                        aspectRatio="landscape"
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full bg-black"
                >
                  <div className="relative w-full h-full bg-black">
                    <video
                      ref={videoRef}
                      src={details._videoUrl}
                      title={`${exercise.ref} video`}
                      controls={false}
                      autoPlay
                      loop
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        backgroundColor: "black",
                      }}
                      playsInline
                    >
                      <source src={details._videoUrl} type="video/mp4" />
                      Your browser does not support videos.
                    </video>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Media Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showImages && (
                  <>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-background/10 backdrop-blur-md"
                      onPress={() => handleImageChange("prev")}
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
                      onPress={() => handleImageChange("next")}
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </Button>
                  </>
                )}
                {details._videoUrl && (
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-background/10 backdrop-blur-md"
                    onPress={handleMediaToggle}
                    startContent={
                      showImages ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )
                    }
                  >
                    {showImages ? "Show Video" : "Show Images"}
                  </Button>
                )}
              </div>
              {showImages && (
                <span className="text-sm text-white/90 bg-background/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {currentImage.label}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }, [
      showImages,
      imageIndex,
      isPlaying,
      details._videoUrl,
      images,
      exercise.ref,
      handleImageChange,
      handlePlayToggle,
      handleMediaToggle,
    ]);

    // Render tabs
    const renderOverviewTab = useCallback(
      () => (
        <motion.div
          key="overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {renderMediaSection()}

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
                    <span className="font-medium">
                      {details.primary_muscle}
                    </span>
                  </div>
                </Chip>
                {details.secondary_muscles?.map((muscle, index) => (
                  <Chip
                    key={index}
                    className="h-auto py-2"
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
      ),
      [details, exercise.rest, renderMediaSection]
    );

    const renderPerformanceTab = useCallback(
      () => (
        <motion.div
          key="performance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 space-y-6"
        >
          {performanceStats ? (
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
                        {performanceStats.maxWeight} kg
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date(
                          performanceStats.maxWeightDate || ""
                        ).toLocaleDateString()}
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
                        {performanceStats.maxReps}
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date(
                          performanceStats.maxRepsDate || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card
                isBlurred
                className="p-4 border-none bg-content-secondary/70"
              >
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Progress Chart
                </h4>
                <PerformanceChart data={chartData} yAxisDomain={yAxisDomain} />
              </Card>

              {/* Recent History */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">Recent History</h4>
                <div className="space-y-2">
                  {performance &&
                    [...performance]
                      .sort(
                        (a, b) =>
                          new Date(b.date || "").getTime() -
                          new Date(a.date || "").getTime()
                      )
                      .slice(0, 5)
                      .map((perf, index) => (
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
                                  {new Date(
                                    perf.date || ""
                                  ).toLocaleDateString()}
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
      ),
      [performanceStats, chartData, yAxisDomain, performance]
    );

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
                {selectedTab === "overview" && renderOverviewTab()}
                {selectedTab === "performance" && renderPerformanceTab()}
              </AnimatePresence>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
);

ExerciseDetailsModal.displayName = "ExerciseDetailsModal";

export default ExerciseDetailsModal;