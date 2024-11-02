// src/components/workout/WorkoutDetailModal.tsx
import React, { useState } from 'react';
import { 
  Clock, 
  Activity,
  Dumbbell,
  Target,
  BarChart,
  AlertCircle,
  Play,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import type { Exercise, ExerciseReference, PerformanceEntry } from '@/types/api';
import { ExerciseProgress } from './ExerciseProgress';

interface WorkoutDetailModalProps {
  exercise: Exercise;
  exerciseDetails: ExerciseReference;
  isOpen: boolean;
  onClose: () => void;
  type: 'regular' | 'superset';
  supersetIndex?: number;
  performance: PerformanceEntry[];
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  exercise,
  exerciseDetails,
  isOpen,
  onClose,
  type,
  supersetIndex,
  performance
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'progress'>('info');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="animate-fade-in">
        {/* Hero Section with Exercise Images */}
        <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
          {/* Superset Badge */}
          {type === 'superset' && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium z-10">
              Superset {supersetIndex}
            </div>
          )}
          
          {/* Video or Images */}
          {exerciseDetails.video && !isVideoPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="p-4 rounded-full bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <Play className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : exerciseDetails.video && isVideoPlaying ? (
            <div className="absolute inset-0">
              <video
                src={exerciseDetails.video}
                autoPlay
                controls
                className="w-full h-full object-cover"
                onPause={() => setIsVideoPlaying(false)}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="relative group">
                  <img
                    src={exerciseDetails.starting}
                    alt="Starting position"
                    className="w-full h-40 object-cover rounded-2xl border-2 border-white/20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Starting Position</span>
                  </div>
                </div>
                <div className="relative group">
                  <img
                    src={exerciseDetails.ending}
                    alt="Ending position"
                    className="w-full h-40 object-cover rounded-2xl border-2 border-white/20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Ending Position</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Exercise Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                  {exerciseDetails.category}
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                  {exerciseDetails.level}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{exercise.ref}</h2>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors relative ${
                activeTab === 'info'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Information
              {activeTab === 'info' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 animate-slide-in" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors relative ${
                activeTab === 'progress'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Progress
              {activeTab === 'progress' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 animate-slide-in" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                      <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Sets & Reps</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {exercise.sets} × {exercise.reps}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Rest Time</p>
                      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {exercise.rest}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment & Target */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{exerciseDetails.equipment}</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{exerciseDetails.primary_muscle}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  How to Perform
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {exerciseDetails.instructions}
                </p>
              </div>

              {/* Target Muscles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Target Muscles</h3>
                <div className="space-y-3">
                  {/* Primary Muscle */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      <span className="text-sm font-medium">Primary:</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        {exerciseDetails.primary_muscle}
                      </span>
                    </div>
                  </div>
                  
                  {/* Secondary Muscles */}
                  {exerciseDetails.secondary_muscles.length > 0 && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                        <span className="text-sm font-medium">Secondary:</span>
                        <div className="ml-2 flex flex-wrap gap-2">
                          {exerciseDetails.secondary_muscles.map((muscle, index) => (
                            <span
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-300"
                            >
                              {muscle.muscle}
                              {index < exerciseDetails.secondary_muscles.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <ExerciseProgress performance={performance} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};