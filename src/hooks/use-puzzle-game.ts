import { useEffect, useRef, useState } from 'react'
import { loadPuzzleProgress, savePuzzleProgress } from '../adapters/browser/puzzle-storage'
import {
  applyPuzzleMove,
  createInitialPuzzleViewModel,
  createPuzzleViewModel,
  type PuzzleViewModel,
} from '../adapters/react/puzzle-engine-adapter'
import type { MovePassenger } from '../domain/puzzle/move'
import { getPuzzleSolutionPath, type PuzzleSolutionStep } from '../services/puzzle-solution'

export interface PuzzleGameApi {
  viewModel: PuzzleViewModel
  applyMove: (passenger: MovePassenger) => void
  isSolutionVisible: boolean
  showSolution: () => void
  solutionSteps: PuzzleSolutionStep[]
}

export function usePuzzleGame(): PuzzleGameApi {
  const [viewModel, setViewModel] = useState<PuzzleViewModel>(() => {
    const savedProgress = loadPuzzleProgress()

    return savedProgress
      ? createPuzzleViewModel(savedProgress.state, savedProgress.state.statusExplanation)
      : createInitialPuzzleViewModel()
  })
  const [isSolutionVisible, setIsSolutionVisible] = useState(false)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    savePuzzleProgress(viewModel.state)
  }, [viewModel.state])

  const applyMove = (passenger: MovePassenger) => {
    setViewModel((current) => applyPuzzleMove(current.state, passenger))
  }

  const showSolution = () => {
    setIsSolutionVisible(true)
  }

  return {
    viewModel,
    applyMove,
    isSolutionVisible,
    showSolution,
    solutionSteps: getPuzzleSolutionPath(),
  }
}