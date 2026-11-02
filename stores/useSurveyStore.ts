import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SurveyAnswers {
  area: string;
  problem: string;
  future_vision: string;
  blocker: string;
  routine: string;
  time_available: string;
  completedAt?: string;
}

interface SurveyState {
  step: number;
  answers: SurveyAnswers;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAnswer: (field: keyof SurveyAnswers, value: string) => void;
  resetSurvey: () => void;
}

const initialAnswers: SurveyAnswers = {
  area: "",
  problem: "",
  future_vision: "",
  blocker: "",
  routine: "",
  time_available: "",
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      step: 0,
      answers: initialAnswers,
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
      setAnswer: (field, value) =>
        set((state) => ({
          answers: { ...state.answers, [field]: value },
        })),
      resetSurvey: () => set({ step: 0, answers: initialAnswers }),
    }),
    {
      name: "mirr_survey_store",
    }
  )
);

