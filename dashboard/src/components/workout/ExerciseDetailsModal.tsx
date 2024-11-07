import { Modal, ModalContent, Button, Tabs, Tab, Card, Chip, Avatar } from "@nextui-org/react";
import { ExerciseBase, ExerciseReference } from "@/types/workout";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Activity, Video, X,  ChevronLeft, ChevronRight, Pause, Play, Dumbbell, Target, Clock, ScrollText, Flame, Trophy, Medal, TrendingUp, AlertTriangle } from "lucide-react";

interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseBase;
  details: ExerciseReference;
  isLogged: boolean;
  performance?: {
    weight: number;
    reps: number;
    date: string;
  }[];
}

export const ExerciseDetailsModal = ({
    isOpen,
    onClose,
    exercise,
    details,
    isLogged,
    performance,
  }: ExerciseDetailsModalProps) => {
    const [selectedTab, setSelectedTab] = useState("overview");
    const [imageIndex, setImageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
  
    const images = [
      {
        url: details.starting,
        label: "Starting Position",
      },
      {
        url: details.ending,
        label: "Ending Position",
      },
    ];
  
    // Auto-advance images
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isPlaying) {
        interval = setInterval(() => {
          setImageIndex((prev) => (prev === 0 ? 1 : 0));
        }, 1500);
      }
      return () => clearInterval(interval);
    }, [isPlaying]);
  
    // Auto-start playing when modal opens
    useEffect(() => {
      if (isOpen) {
        setIsPlaying(true);
      }
      return () => setIsPlaying(false);
    }, [isOpen]);
  
    // Prepare performance data for the chart
    const chartData = useMemo(() => {
      if (!performance) return [];
      return [...performance]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(p => ({
          date: p.date,
          weight: p.weight,
          reps: p.reps,
        }));
    }, [performance]);
  
    const QuickStatChip = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
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
    );
  
    // Available tabs
    const tabs = [
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
      // Only show video tab if video URL exists
      ...(details.video ? [{
        key: "video",
        icon: Video,
        label: "Video",
      }] : []),
    ];
  
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
          base: "h-[100dvh] max-h-[100dvh]",
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          <div className="flex flex-col h-[100dvh]">
            {/* Fixed Header/Navigation */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md pb-2 ">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex gap-4">
                <Avatar isBordered color="secondary" src={images[0].url} />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold truncate">{exercise.ref}</h2>
                  <p className="text-sm text-foreground/60">{details.primary_muscle}</p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={onClose}
                  className="min-w-unit-8 w-unit-8 h-unit-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
  
              <div className="px-4 flex justify-center">
                <Tabs
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key.toString())}
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
              {selectedTab === "overview" && (
                <div className="space-y-6">
                  {/* Image Section - Adjusted for full visibility */}
                  <div className="relative bg-black">
                    <img
                      src={images[imageIndex].url}
                      alt={images[imageIndex].label}
                      className="w-full h-auto object-contain mx-auto"
                      style={{ maxHeight: "40vh" }}
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
                            onPress={() => setImageIndex((prev) => (prev === 0 ? 1 : 0))}
                          >
                            <ChevronLeft className="w-4 h-4 text-white" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-background/10 backdrop-blur-md"
                            onPress={() => setIsPlaying(!isPlaying)}
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
                            onPress={() => setImageIndex((prev) => (prev === 1 ? 0 : 1))}
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
                      <div className="flex gap-2">
                        <Chip
                          className="h-auto py-2"
                          startContent={<Target size={14} />}
                          color="warning"
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
                            color="warning"
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
                </div>
              )}
  
              {selectedTab === "performance" && (
                <div className="p-4 space-y-6">
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
                          {[...performance].slice(0, 5).map((perf, index) => (
                            <Card
                              key={index}
                              className="bg-content-secondary/30 border-none"
                            >
                              <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-primary-500/10">
                                    <Dumbbell className="w-4 h-4 text-primary-500" />
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
                </div>
              )}
  
              {selectedTab === "video" && details.video && (
                <div className="p-4 space-y-6">
                  <Card className="w-full aspect-video overflow-hidden border-none">
                    <iframe
                      className="w-full h-full"
                      src={details.video}
                      title={`${exercise.ref} demonstration`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Card>
  
                  <Card className="p-4 bg-warning-500/10 border-none">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
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
                </div>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  };
